# Kokoro TTS 自部署

## 目标

为英语学习 App 提供更真人化的免费 TTS。前端已经支持 `Kokoro TTS` provider，默认接口地址是：

```text
http://127.0.0.1:8880/v1/audio/speech
```

如果本地 Kokoro 服务失败，前端会自动 fallback 到浏览器内置 TTS。

## 本地启动

### 1. 安装系统依赖

macOS:

```bash
brew install espeak-ng libsndfile
```

### 2. 创建 Python 环境

建议使用 Python 3.10+。项目当前机器自带 `/usr/bin/python3` 是 3.9.6，若 `pip install kokoro` 失败，请先安装新版 Python。

```bash
python3 -m venv .venv-kokoro
source .venv-kokoro/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements-kokoro.txt
```

### 3. 启动 Kokoro 服务

```bash
npm run tts:kokoro
```

服务会监听：

```text
http://127.0.0.1:8880
```

健康检查：

```bash
curl http://127.0.0.1:8880/health
```

生成音频测试：

```bash
curl -X POST http://127.0.0.1:8880/v1/audio/speech \
  -H "Content-Type: application/json" \
  -d '{"input":"Vocabulary practice sounds more natural with Kokoro.","voice":"af_bella","speed":0.95}' \
  --output kokoro-test.wav
```

## 前端使用

1. 启动前端：`npm run dev`
2. 打开右上角菜单 -> `语音设置`
3. 选择 `Kokoro TTS`
4. Kokoro 接口地址留空或填写 `http://127.0.0.1:8880/v1/audio/speech`
5. 点 `试听 Kokoro`

## API 兼容性

本地服务位于 `scripts/kokoro_tts_server.py`，支持两个 endpoint：

- `POST /v1/audio/speech`
- `POST /tts`

请求字段兼容 OpenAI 风格：

```json
{
  "model": "kokoro",
  "input": "Hello world.",
  "voice": "af_bella",
  "speed": 1,
  "response_format": "wav"
}
```

也兼容旧字段：

```json
{
  "text": "Hello world.",
  "voice": "af_bella",
  "speed": 1
}
```

返回值是 `audio/wav`。

## 缓存

生成结果会缓存到：

```text
.cache/kokoro-tts/
```

缓存 key 包含文本、音色、语速、语言和采样率。同一句话重复播放不会重新生成。

## 批量生成单词静态音频

已经提供批量脚本：

```bash
npm run tts:generate-words
```

默认读取：

```text
public/data/vocabulary.json
```

默认生成三套音色：

- `af_bella`：美音女声
- `am_michael`：美音男声
- `bf_emma`：英音女声
- `bm_george`：英音男声

输出目录：

```text
public/audio/words/{voice}/{id}.mp3
```

脚本默认只挑缺失的 MP3 生成；如果某个词和音色已经有文件，不会进入合成队列，也不会加载模型去重做旧音频。强制重生成：

```bash
npm run tts:generate-words -- --force
```

只生成前 100 个词做测试：

```bash
npm run tts:generate-words -- --limit 100
```

只预览新增词缺失音频：

```bash
npm run tts:generate-words -- --dry-run --start 5399
```

当前实测结果：

- 8699 个单词
- 4 个音色
- 单词音频：4 个音色本地均已补齐到 ID 8699
- 例句音频：`af_bella` 本地已补齐到 ID 8699；`am_michael`、`bf_emma`、`bm_george` 的新增词例句仍待生成
- 0 个失败
- 编码：MP3，24 kbps，24 kHz，mono

前端在 `Kokoro TTS` 模式下，单词发音会优先播放静态音频；如果文件不存在或播放失败，再 fallback 到实时 Kokoro / 浏览器 TTS。

默认静态音频 base URL 是同源：

```text
/audio/words
```

如果音频上传到 R2/CDN，在 `.env` 或部署平台设置：

```bash
VITE_WORD_AUDIO_BASE_URL=https://pub-47e027cd6ce64af29a76f038ecb22373.r2.dev/audio/words
```

这样 App 本体可以不携带全部音频，只按需从 CDN 加载：

```text
https://pub-47e027cd6ce64af29a76f038ecb22373.r2.dev/audio/words/af_bella/1.mp3
```

### 同步到 Cloudflare R2

本地生成的 MP3 不会提交到 Git。要让线上用户使用，把 `public/audio/words` 同步到 R2 bucket，再把 bucket 的公开域名配置成 `VITE_WORD_AUDIO_BASE_URL`。

先准备 Cloudflare API token 和 bucket 名：

```bash
export CLOUDFLARE_API_TOKEN=你的_token
export R2_AUDIO_BUCKET=english-flashcards-audio
```

试运行查看会上传哪些文件：

```bash
npm run audio:upload-r2 -- --dry-run
```

正式同步：

```bash
npm run audio:upload-r2
```

脚本默认使用 Wrangler 的 `r2 bulk put` 批量上传 MP3，并把 `manifest.json` 单独按 JSON 上传。对象会写入 R2 的 `audio/words/` 前缀，所以公开 URL 应类似：

```text
https://pub-47e027cd6ce64af29a76f038ecb22373.r2.dev/audio/words/af_bella/1.mp3
```

如果你的 bucket 公开域名直接指向 bucket 根目录，前端环境变量应设置为：

```bash
VITE_WORD_AUDIO_BASE_URL=https://pub-47e027cd6ce64af29a76f038ecb22373.r2.dev/audio/words
```

当前 R2 设置：

- Bucket：`english-flashcards-audio`
- 公开 r2.dev URL：`https://pub-47e027cd6ce64af29a76f038ecb22373.r2.dev`
- CORS 配置文件：`config/r2-word-audio-cors.json`
- 线上 GitHub Actions 构建已设置 `VITE_WORD_AUDIO_BASE_URL`
- 例句静态音频可设置 `VITE_EXAMPLE_AUDIO_BASE_URL=https://pub-47e027cd6ce64af29a76f038ecb22373.r2.dev/audio/examples`
- 2026-06-26 上传新增单词音频时，当前 Wrangler 凭证对 `english-flashcards-audio` 返回 `403 Authentication error`；需要更换/补充具备 `Account R2 Storage:Edit` 的 `CLOUDFLARE_API_TOKEN` 后再上传。

## 批量生成例句静态音频

例句比单词长很多，建议先只生成一个默认音色，避免一开始把 R2 存储和生成时间放大到 3 倍。脚本默认使用 `af_bella`，读取 `public/data/vocabulary.json` 里的 `example` 字段，输出到：

```text
public/audio/examples/{voice}/{id}.mp3
```

先小批量试跑：

```bash
npm run tts:generate-examples -- --limit 20
```

正式生成全部例句：

```bash
npm run tts:generate-examples
```

如果中断，直接重新运行即可，脚本只会继续生成缺失的 MP3。需要重新生成时加 `--force`：

```bash
npm run tts:generate-examples -- --force
```

只预览新增词缺失例句音频：

```bash
npm run tts:generate-examples -- --dry-run --start 5399
```

如果以后要补其他音色：

```bash
npm run tts:generate-examples -- --voices am_michael,bf_emma
```

上传例句音频到 R2 时复用同一个上传脚本，只改 source 和 prefix：

```bash
npm run audio:upload-r2 -- --bucket english-flashcards-audio --source public/audio/examples --prefix audio/examples
```

大量小文件建议保留默认小批次上传；脚本默认 `--batch-size 100 --concurrency 3 --retries 3`，如果网络不稳可以继续降低并发。

上传后公开 URL 形如：

```text
https://pub-47e027cd6ce64af29a76f038ecb22373.r2.dev/audio/examples/af_bella/1.mp3
```

前端 `speakExample(word)` 会在 Kokoro provider 下优先播放静态例句 MP3。未配置 `VITE_EXAMPLE_AUDIO_BASE_URL` 时默认读取同源 `/audio/examples`；线上建议指向 R2 的 `audio/examples` 前缀。

## 音色和语言

- 默认音色：`af_bella`
- 默认语言：`a`，即 American English。
- 如果音色以 `bf_` 或 `bm_` 开头，服务会自动用 `b`，即 British English。
- 也可以在请求中显式传 `lang_code`。

## 云端部署

如果要部署给多设备使用，可以把 `scripts/kokoro_tts_server.py` 放到自己的服务器、Railway、Render 或 Fly.io。部署后在 `.env` 或部署平台环境变量里设置：

```bash
VITE_KOKORO_TTS_URL=https://your-domain.example.com/v1/audio/speech
```

重新构建前端后，所有用户默认使用这个统一地址。语音设置里的用户自定义 endpoint 优先级更高。

## 注意

- Cloudflare Worker 不适合直接跑 Kokoro 模型；Worker 更适合做鉴权、限流和缓存代理。
- 如果服务公开到公网，建议加鉴权和限流，避免被外部刷接口。
- macOS Apple Silicon 上若遇到 PyTorch/MPS 兼容问题，保留 `PYTORCH_ENABLE_MPS_FALLBACK=1`。
