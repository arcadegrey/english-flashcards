# Kokoro TTS 全站统一地址（Railway）

## 目标
部署一个你自己的 Kokoro API，然后把统一地址配置到前端，所有用户默认可用。

## 1. 部署 API（Railway）
1. 打开 Railway 模板页：`https://railway.com/deploy/kokoro-tts-api`
2. 登录 Railway，点击部署。
3. 部署成功后，在项目的 Networking/Domain 中拿到公网域名，例如：
   - `https://your-app.up.railway.app`

## 2. 拼出统一接口地址
在域名后追加：
- `/v1/audio/speech`

示例：
- `https://your-app.up.railway.app/v1/audio/speech`
- 你的当前地址：`https://kokoro-api-production-9ea1.up.railway.app/v1/audio/speech`

## 3. 配置到前端（全站默认）
在项目根目录新建 `.env`（或在部署平台设置同名环境变量）：

```bash
VITE_KOKORO_TTS_URL=https://your-app.up.railway.app/v1/audio/speech
```

然后重新构建/部署前端。

## 4. 校验
1. 打开站点 -> 语音设置 -> 切到 `Kokoro TTS`
2. 不填任何地址，直接点“试听 Kokoro”
3. 能播放即说明全站默认地址生效

## 备注
- 前端仍支持用户在“语音设置”里填自定义 endpoint，优先级高于全站默认值。
- 如果你使用的是需要密钥的第三方服务，建议走后端代理，避免把密钥暴露到前端。
