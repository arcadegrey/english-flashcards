# Worker 与本地存储职责拆分（2026-11-03）

基线为已推送的 `4249cdd`。本批继续整理两个中优先级维护点，不修改界面、路由匹配、接口／同步协议、学习算法、认证策略、数据库、词库或个人数据。无需新增环境变量、依赖或数据库／个人数据迁移。本批已完成本地验证，现按用户要求与页面装配／背词展示拆分一并提交并推送；生产发布状态以对应 GitHub Actions 自动部署回执为准。

## Worker 边界

`worker/index.js` 从 629 行降为 96 行，保留原 `fetch` 入口、跨站／JSON 校验、expected-account 校验、路由匹配顺序、静态资源分发及错误处理。继续从原入口导出 `PasswordHasher` 与 `mergeProgress`，测试和 Durable Object binding 不需要改变导入路径。

| 新模块 | 职责 |
| --- | --- |
| `worker/http.js` | 原 JSON／错误响应、请求 JSON 解析。 |
| `worker/authSupport.js` | 原 cookie 名、邮箱规范化、时效、随机数、验证码／会话摘要辅助函数。 |
| `worker/authSession.js` | 用户查询、会话查询／签发、cookie、会话恢复与退出。 |
| `worker/emailAuth.js` | 邮件配置检查、发送邮件、旧验证码注册／登录。 |
| `worker/progressModel.js` | 进度规范化、自定义词合并、认识状态／复习／统计／偏好合并。 |
| `worker/progressRoutes.js` | 进度读取与 D1 CAS 写入／最多三次重试。 |

保留密码登录原服务注入方式和凭据版本校验；没有移动或重写密码 KDF／事务逻辑。统一账号校验仍先于特性路由执行；密码服务异常继续由原作用域转换为 503，其他入口异常仍由外层处理。未合并其他特性文件中相似的响应函数，避免扩展重构范围。

## 本地存储边界

`src/utils/storage.js` 从 509 行降为 17 行，继续导出同一个 `storage` 对象和 `WORD_BOOKMARKS_STORAGE_KEY`。内部按以下职责组合，不改调用方：

| 新模块 | 职责 |
| --- | --- |
| `src/utils/storage/keys.js` | 原有存储键常量。 |
| `src/utils/storage/accountStorage.js` | 账号所有者、学习快照、账号归档切换、本机认证会话缓存。 |
| `src/utils/storage/progressStorage.js` | 学习／认识／错词／自定义词、复习状态、历史、日记录和清空学习进度。 |
| `src/utils/storage/planStorage.js` | 计划目标／分类、计划统计、更新时间、收藏和收藏冲突合并。 |
| `src/utils/storage/deviceStorage.js` | 主题、语音提供方／音色／语速和旧 endpoint 偏好。 |

账号／进度／计划模块通过工厂闭包引用同一个 facade，避免相互导入形成循环。创建 facade 不读取或写入 localStorage；方法在调用时读取当前存储，原模块引用稳定。

保留原账号切换的“先归档，再替换活动缓存”顺序、旧账号所有者回退、兼容默认值，以及不混合其他已登录账号数据的规则。收藏写失败仍抛出；原有进度／设备设置方法仍按各自旧规则记录错误或回退。没有把旧的多键写入改称为事务，也没有改变清空进度时保留自定义词、收藏、偏好和认证缓存的行为。

## 验证

- 源码对照：41 个 Worker 声明／入口、49 个存储方法的语法树与原版一致；仅模块归属与导入／导出改变。
- 一次性差异运行：2743 次存储调用，返回值、抛错、日志和完整落盘键值逐项一致，覆盖默认值、登录账号轮换、归档／恢复、学习记录、清空、设备偏好及存储拒绝。
- 新增八项固定 Node 回归：`tests/storage-compatibility.test.mjs` 五项，检查设备偏好／清空边界、旧账号归属与未提交本机进度、坏归档回退、归档写失败、存储拒绝；`tests/worker-routing.test.mjs` 三项，检查路由前的来源／JSON 门控、八类路由的账号隔离、未知路径及认证服务异常响应边界。
- 全量 Node 测试 490／490 通过，无失败或跳过。原认证、并发验证码、会话撤销、认识冲突、CAS、收藏、阅读、测试与课堂用例继续通过。
- 浏览器 CI 107 项通过：37 交付＋24 真实双构建 PWA 升级＋24 密码流程＋22 阅读流程。使用真实生产构建、原 Worker 和一次性本机 SQLite，未访问真实生产账号。
- Lint、生产构建、缓存／启动与阅读预算、6 项跨时区及 Worker dry-run 通过。14 份构建 CSS 与基线逐字节相同；没有 UI／样式文件改动。保留原有大 chunk 提示。
- 原生运行时 14 项通过：实际 workerd＋本地 D1＋SQLite `PasswordHasher` Durable Object，覆盖验证码注册、独立密码登录、旧账号设密、会话轮换、事务重置、两设备撤销、其他账号保留与验证码重放。测试入口从拆分后的 `worker/index.js` 导出该类，验证原 binding 兼容。仅使用虚构邮箱和新的本地测试状态；这与 Node 模拟数据库和浏览器检查分别记录。

复现命令：

```bash
node --test tests/storage-compatibility.test.mjs tests/worker-routing.test.mjs
npm test
npm run lint
npm run build
npm run performance:audit
TZ=America/Los_Angeles node --test tests/study-date.test.mjs tests/study-day-subscription.test.mjs tests/vocabulary-merge.test.mjs
PLAYWRIGHT_CHANNEL=chrome npm run test:browser
WRANGLER_SEND_METRICS=false npx --no-install wrangler deploy --dry-run
```

基线、语法树与行为对照脚本、本地原生测试配置／一次性状态、日志位于忽略目录 `output/playwright/worker-storage-refactor/`。未来正常发布应包含前端构建与 Worker 模块；回退可还原该代码批次，无需操作个人数据、数据库表或 Durable Object 命名空间。
