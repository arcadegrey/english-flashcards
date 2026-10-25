# 版本音频R2发布（2026-10-25）

## 发布范围

使用用户指定的 cloudflare-deploy 技能，经 `wrangler whoami` 核验现有账号，上传到已有 `english-flashcards-audio` 桶。没有新建桶或改动D1。

| 批次 | MP3数量 | 音频字节数 | R2前缀 |
| --- | ---: | ---: | --- |
| 33条词库修复 | 60 | 676584 | audio-updates/2026-10-24/ |
| 247条实用词替换 | 1976 | 13773312 | audio-updates/2026-10-25/ |
| 合计 | 2036 | 14449896 | audio-updates/ |

另上传两个批次的 `manifest.json`，共2038个对象。旧的 `audio/words/`、`audio/examples/` 对象保留，历史客户端与作业的旧录音不覆盖。

公开前缀：`https://pub-47e027cd6ce64af29a76f038ecb22373.r2.dev/audio-updates`。

MP3设置为 `audio/mpeg`，缓存为 `public, max-age=31536000, immutable`；清单使用短缓存。原桶已配置公开GET/HEAD跨域读取，本轮没有修改桶权限或CORS。

## 应用与Git调整

- `shared/vocabularyAudio.js` 返回R2版本地址，继续按ID和文本精确匹配；旧快照不误用新文本录音。
- `VITE_AUDIO_UPDATES_BASE_URL` 可覆盖公开前缀，默认使用现有R2；GitHub Actions和环境示例均记录这个公开变量。
- 本机MP3保留，但加入 `.gitignore`；当前没有版本MP3进入Git历史。清单、文本、版本映射及生成脚本仍提交。
- 整个 `public/audio-updates/` 不复制进 `dist`，不进入PWA预缓存。首次播放这些录音需要网络或已有浏览器缓存，不承诺首次离线可播放整库。已有Kokoro/浏览器语音回退不变。
- 测试在本机有MP3时检查其文件哈希；干净检出只要求清单、路径、文本和哈希元数据，线上文件由专用核验脚本检查。

## 后续固定发布流程

```bash
# 本地生成并检查音频后：
npx wrangler whoami
npm run audio:upload-updates-r2 -- --bucket english-flashcards-audio
npm run audio:verify-updates-r2
# 全部线上校验通过后，再提交并推送前端/Worker代码。
```

每次修改文本或合成配置，都使用新版本路径。不要用新录音覆盖已设置immutable缓存的旧路径；旧路径保留历史兼容。上传过程可重试，核验会逐个读取公开文件并比较SHA-256、大小和Content-Type；清单本身也比较哈希。

核验断点写入忽略目录 `output/audio-updates-r2-verification.json`，仅复用与当前清单相同的成功条目。需要重新读取全部线上文件时先另存该报告，再重新核验。

## 验证状态

- 上传：2036个MP3和两份清单已完成，使用21批上传，脚本成功退出。
- 全量线上核验完成：2036/2036个MP3与两份清单的大小、SHA-256全部匹配，无失败。精简发布回执见 `data/audio-r2-release-2026-10-25.json`。
- 真实浏览器中点击passport单词和例句发音，均使用R2域名并收到完整播放结束事件。
- 123项测试、lint、生产构建/PWA通过；无MP3的模拟干净检出也通过123项测试和构建。
- `dist`不包含版本音频，Git没有跟踪这些MP3。

本轮仅发布R2对象；没有执行Git提交、推送、前端/Worker生产部署或D1迁移。网页词库新版本仍需随后按既有流程发布。

## 变更文件

- `.gitignore`
- `.env.example`
- `.github/workflows/deploy-cloudflare-pages.yml`
- `package.json`
- `shared/vocabularyAudio.js`
- `vite.config.js`
- `scripts/verify-audio-updates-r2.mjs`
- `tests/vocabulary-repairs.test.mjs`
- `tests/practical-vocabulary.test.mjs`
- `PROJECT_CONTEXT.md`
- `docs/project-reference.md`
- `docs/cloudflare-github-build.md`
- `docs/vocabulary-repair-2026-10-24.md`
- `docs/practical-vocabulary-replacement-2026-10-25.md`
- `docs/audio-r2-release-2026-10-25.md`

- `data/audio-r2-release-2026-10-25.json`：成功核验回执。
