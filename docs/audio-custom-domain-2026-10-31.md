# 音频正式域名与边缘缓存（2026-10-31）

## 变更

复用已有公开 R2 桶 `english-flashcards-audio`，启用原先空闲的 `audio.englishflashcards.cn`，最低 TLS 1.2。域名所有权及证书均为 active。没有新建桶、迁移或重传 MP3，也没有生成新录音、改写词条或更改个人数据。旧 `pub-47…r2.dev` 入口继续启用，保留旧客户端／历史录音兼容。

生产构建的三个地址更新为：

```text
VITE_WORD_AUDIO_BASE_URL=https://audio.englishflashcards.cn/audio/words
VITE_EXAMPLE_AUDIO_BASE_URL=https://audio.englishflashcards.cn/audio/examples
VITE_AUDIO_UPDATES_BASE_URL=https://audio.englishflashcards.cn/audio-updates
```

`shared/vocabularyAudio.js` 的版本录音默认地址也改为新域名，环境覆盖仍有效。所有 voice／ID／批次／文本哈希路径不变；按 ID、原文与 guards 的版本选择规则不变，旧作业快照不会被替换成新原句。

基础词头／例句的开发环境仍可显式使用同源 `/audio/words`、`/audio/examples`，版本录音可覆盖为 `/audio-updates`；生产继续不把 MP3 打进 `dist` 或 PWA 预缓存。听写仍只播放录音，失败不切换浏览器合成，不增加答题事件。其他学习模式的原语音回退保持不变。

## 缓存与公开读取

- R2 Custom Domain 使原 MP3 经 Cloudflare 边缘缓存交付；沿用对象已有 `public, max-age=31536000, immutable`，没有重置录音元数据或覆盖音频内容。未来内容更新继续发布新版本路径，不能在 immutable 旧路径下直接替换录音。
- 清单保持 `public, max-age=300`。本次发现 `2026-10-29-expansion-50/manifest.json` 原先缺少 Cache-Control，仅对该清单重新写入完全相同的 JSON 字节并添加 300 秒缓存；公开 SHA-256 不变。没有为清单设置 immutable 或一年缓存。
- 实际 MP3 重复 GET 已验证 `CF-Cache-Status: HIT`；字节范围请求为 206，`If-None-Match` 为 304。清单实测为 DYNAMIC，保留短期客户端缓存，不要求它进入长期边缘缓存。
- 原桶 CORS 已允许公开 GET／HEAD、所有 Origin／请求头，并暴露 Content-Type／Cache-Control；本次保持该设置，没有扩大写入权限。实际新域名跨域 GET 返回 `Access-Control-Allow-Origin: *`。
- 现有 OAuth 无权读取全站缓存规则／DNS 列表，接口返回 403；没有扩大权限或改全站规则。R2 原生域名绑定和已有对象缓存元数据已可实现并实测 MP3 HIT，无需为此新增 Worker 或付费缓存产品。

这是正式音频交付及缓存改进，不代表国内专线。没有购买 China Network、Argo、Cache Reserve 等产品，没有按用户地区切换节点；国内无代理播放与延迟仍需实测。复用原桶没有新增整库副本，常规 R2 请求等费用仍依实际账单计算。

## 验证

新增只读命令 `npm run audio:verify-domain`，通过公开 HTTPS 校验新域名，无需 Cloudflare 凭据。它对所有版本批次的清单逐字节比对，并抽取各批次／四音色／可用 word/example 类型的代表录音，加上基础四音色词头与例句。

| 检查 | 结果 |
| --- | --- |
| 公开文件 | 11 份清单 + 84 个 MP3 样本，共 95 个文件，SHA-256／大小／MIME 全部一致，失败 0。不是整库逐文件复验。 |
| 缓存／协议 | 基础和版本录音重复 GET 为 HIT；Range 206 返回原文件前 128 字节；条件请求 304；公开 CORS 正常。 |
| 真实播放 | 本机正式配置生产构建 41 项浏览器断言通过，四音色 12 段原生解码／播放／ended：4 个词头试听、4 个基础例句、4 个 teenage 版本例句。正向 MP3 不映射成本机文件。 |
| 行为兼容 | 慢速 0.75、停止、离页清理、录音故障保留输入／0 答题数／不合成均通过；浏览器无运行时 `r2.dev` 请求、无未捕获错误。API 使用本机 guest 夹具，不写真实账号。 |
| 定向测试 | 语音、听写及实用词映射 40/40。 |
| 全量回归 | 412/412，无失败或跳过。 |
| Lint／构建／PWA | 通过；105 项／2879.26 KiB 未压缩预缓存。既有核心后备大 chunk 提示保留，没有新增音频进 PWA。 |
| 跨时区／Worker dry-run | 6/6，通过；dry-run 不部署。 |

本机浏览器和公开文件核验使用现有本机代理，不作为国内直连测速或人工发音认证。用户原有国内启动复测反馈保留，不把它自动扩大为新音频域名已经完成国内四音色验收。

回执：[data/audio-domain-release-2026-10-31.json](../data/audio-domain-release-2026-10-31.json)。详细公开哈希报告为忽略目录 `output/audio-domain-verification.json`；命令、截图和浏览器日志在 `output/audio-cdn-2026-10-31/`。

## 运维与回滚

后续音频上传继续使用原桶／原 prefix，旧上传命令不变。发布后可执行：

```bash
npm run audio:verify-domain
npm run audio:verify-updates-r2
```

第一个命令是域名／各批次抽样与协议检查，第二个沿用原版本文件全量哈希核验，默认跟随新正式域名；其原断点按 baseUrl 区分，不复用旧域名成功记录。需要通过本机现有代理时，可使用支持 `--use-env-proxy` 的 Node 并显式设置代理变量；不把代理参数提交到生产配置。

回滚应用只需将三个构建变量和版本录音默认地址恢复到原 `r2.dev` 后正常构建发布。原入口／全部对象继续存在，无需恢复数据库或复制录音。正式域名可保留，不影响旧入口。该清单的短缓存修正无需跟随应用回滚。

前端按现有 Actions 发布；无新增 D1 迁移或 Worker 逻辑。正式域名已验证就绪后才切换生产构建。发布结果和真实生产页面播放在后续验收补记中记录。
