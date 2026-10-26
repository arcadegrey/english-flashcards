# 旧代码修复交接（2026-10-26）

## 已修复

### 同步响应覆盖

- 前端进度归一化和合并模型从 App 提取至 `src/utils/progressState.js`。原有访客合并、认识优先级、复习时间戳、日汇总最大值、偏好时间戳与收藏删除标记规则保留。
- `rebaseProgress` 比较发出快照、本机最新状态和服务端响应，只重放请求期间的本机变化。保留新增学习记录、移除标记、错词移出、计划切换及收藏取消；显式清空发生在请求期间时，清空后的学习状态覆盖旧响应，清空后新增活动也保留。
- 上传和云端恢复通过 `progressSync.js` 的队列串行执行，排队操作实际执行时读取最新快照和版本，避免多个旧请求逆序应用。云恢复期间的本机变化也重新合并。
- 登录／注册／退出使旧队列和旧响应失效；同一用户退出后重新登录也属于新会话。现有 expected-user 校验继续保留。
- 应用服务端合并结果时立即更新最新进度引用。自动同步按已确认快照判断是否仍有待上传变化，移除原“一次跳过上传”标记，避免误跳过新的本机变更。

本轮没有增加跨设备删除事件账本。日计数仍按最大值合并，不声称能精确相加多个离线设备的所有独立活动，也不改变既有历史成绩和作业首次提交规则。

### 语音生命周期和语速

- `speech.js` 保留原公共接口；具体实现移至可注入依赖的 `speechEngine.js`。
- 每次朗读持有独立 AbortController。停止、下一次朗读、音色／语速／提供方变化和应用页面切换会取消旧操作；旧请求即使迟到也不能播放或触发回退。
- 取消会及时结束调用方等待，返回 `{ cancelled: true }`，避免遗留“试听中”。自然结束仍正常完成；真实播放错误继续进入可用回退。
- Audio 事件、媒体资源和 Blob URL 在结束、错误和取消时清理；动态请求有 20 秒超时。
- 统一有效语速：`clamp(单次 rate × 全局语速 × Kokoro 设置语速, 0.5, 1.5)`。浏览器独立模式不乘 Kokoro 设置，Kokoro 失败后回退浏览器沿用已算出的有效语速。
- 静态音频设置 `defaultPlaybackRate` 和 `playbackRate`，避免浏览器加载新资源时把速率重置为 1；动态合成只通过请求 speed 应用一次，播放生成结果时使用 1 倍速。
- 既有版本音频 ID／文本映射、URL 和语音音色保留，无需重制或发布 MP3。

### 出题重复计算

- Quiz、FillBlank、MatchingTest 用单个惰性 round 状态保存题目／选项／错误信息，正常重渲染不再生成并丢弃一轮题目。
- 工厂提取至 `assessmentRounds.js`；随机排序替换为 Fisher–Yates 洗牌与部分抽样，避免随机比较排序。
- 保留范围限制、同词头去重和原填空挖空规则。连线题先线性洗牌再去重，两对同形词的不同 ID 仍可跨轮被选中，未把后一个 ID 永久遮蔽。
- 保留答题统计、庆祝、20 次上限与草稿恢复；词库变为空时填空轮次也清空。

### 阅读派生数据与职责整理

- `readingLibrary.js` 分离文章静态分词／预计时间、词库变化时建立的关联 ID，以及个人认识进度更新时的计数。标记认识不再对全部文章重新分词和查词。
- 本轮按问题边界提取进度模型、同步队列、语音引擎和出题工厂。没有一次性重写导航和学习事件管理，也没有删除尚需确认兼容性的旧导出。
- Worker／API 层与前端归一化存在既有差异，本轮保留这些差异，未直接合并成一套可能改变旧数据行为的模型。

## 验证

- 全量测试：**196/196**，含新增 31 项回归；覆盖响应期间的新增／删除、清空后活动、收藏删除标记、计划偏好、旧会话失效、队列失败后恢复、语音取消／迟到／错误回退／速率边界、题库范围／空状态／同形词 ID 和阅读元数据。
- `npm run lint`、生产构建及 PWA 生成、`git diff --check`：通过。仍有既有主包超过 500 kB 的提示。完整 PWA 产物含 `sw.js` 和 Workbox runtime；没有通过关闭 PWA 或降低生产模式来绕过验证。
- 真实浏览器：8699 条词库下，三个题目组件的普通重渲染不再触发随机抽题；连线 pointer move 不再生成整轮题目。范围切换、空词库恢复、选择答题和连线配对通过。
- 真实 AssessmentSession：答 3 题后刷新恢复草稿，继续至 20 次，保存 20/20 的结果，未多计答案。
- 真实 App：用虚构登录身份与拦截的内存 API 延迟一次自动上传，在等待中继续标记认识；冲突响应返回后两次本机活动与另一远端记录都保留，并被后续上传确认。此验证不是生产服务或真实账号验收。
- 真实 HTMLAudio：拦截网络请求并返回本地已有 MP3；语音设置 0.8 倍速试听／词头、QuickMenu 慢速 0.5 倍速例句均正确，收到 3 次 ended，无音频错误。没有重新全库听审。
- 1440px 桌面与 390px 手机学习页无横向溢出，共享 chrome 与手机学习专用结构保留。验收日志、脚本和截图在忽略的 `output/playwright/legacy-fix-*`。

## 发布

本轮仅修改前端及测试／文档，不新增 D1 schema、存储键或协议字段，不需要数据库迁移，也没有修改生产数据、发送邮件、提交／推送 Git 或部署。发布本轮前端即可带入这些修复；若一并发布此前仍未上线的词库和功能批次，继续按对应交接要求同步发布 Worker。

## 变更文件

- `src/App.jsx`
- `src/components/Quiz.jsx`
- `src/components/FillBlank.jsx`
- `src/components/MatchingTest.jsx`
- `src/components/VoiceSettings.jsx`
- `src/utils/progressState.js`
- `src/utils/progressSync.js`
- `src/utils/speech.js`
- `src/utils/speechEngine.js`
- `src/utils/assessmentRounds.js`
- `src/utils/random.js`
- `src/utils/readingLibrary.js`
- `tests/progress-sync.test.mjs`
- `tests/speech.test.mjs`
- `tests/assessment-rounds.test.mjs`
- `tests/reading-library.test.mjs`
- `docs/legacy-code-audit-2026-10-26.md`（前次审查已创建，本轮补修复链接）
- `docs/legacy-code-fixes-2026-10-26.md`
- `PROJECT_CONTEXT.md`
- `plan.md`
