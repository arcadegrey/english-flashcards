# 邮箱验证与密码登录（2026-11-02）

**发布补记：`c6f625c` 已由 [Actions #171](https://github.com/arcadegrey/english-flashcards/actions/runs/41450259457) 于北京时间 2026-11-02 21:12:15 成功发布，远端 quality、D1 与 Worker／SQLite Durable Object 部署均通过；Cloudflare 版本 `d5bf910b-a02f-4057-98f6-ada58708edde`。** 下方实现验证发生于首次发布前。生产已通过八项匿名接口检查，用户亲自完成旧账号设置密码及另一独立客户端密码登录；其余结果待本轮验收结束补记。

用户在上线验收时明确要求放宽最少 15 字符，后续改为 **8–128 字符**，同时扩充常见弱密码拦截；八字符设置／重置会进入固定回归。该长度调整以随后提交与发布回执为准。

## 用户流程

- 新注册：邮箱验证码＋密码＋确认密码，验证成功后注册并登录，保留师生身份与昵称。
- 日常登录：默认邮箱＋密码，正常登录保留其他设备会话。
- 备用登录：可切换到原有邮箱验证码方式。旧客户端的注册／登录验证码接口继续兼容。
- 旧账号：先按原方式登录，在账号面板“设置密码”；账号 ID、学习记录、班级关系与历史不变。
- 设置／修改密码：需要当前账号的专用邮箱验证码；成功后更新当前会话，其他旧会话失效，账号面板显示已设置状态。
- 忘记密码：发送专用重置码，填写新密码两次；成功后回到正常登录，不自动建立会话，旧密码和旧会话失效。

账号弹窗沿用原有白蓝组件、按钮、深色主题与移动滚动容器，增加密码显示切换及密码管理器 autocomplete。没有新导航或全局顶栏槽位。口令只在表单与当前认证请求内使用，不写入 localStorage、学习进度、日志或邮件。

## 密码计算与免费计划

密码采用随机独立盐的原生 `scrypt`，参数 `N=16384, r=8, p=5`，派生 32 字节密钥，用恒定时间比较。D1 保存带算法／参数／盐的编码哈希，不能通过普通 SHA-256 代替。该参数是 [OWASP 的 scrypt 低内存配置之一](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)。

原生 workerd 固定测试口令探测约 78 ms（本机墙钟样本，不是生产 CPU 测量）。普通 Free Worker 的 CPU 预算较小，因此入口 Worker 只处理校验、D1、邮件与会话，耗时 KDF 通过内部 `PASSWORD_HASHER` binding 调用 `PasswordHasher` Durable Object。固定八个分片，没有按任意邮箱创建无限对象，没有计时器、外部网络调用或密码持久化。

选择 SQLite-backed 类以兼容 Free；它有独立的计算额度，默认每次请求 30 秒。Free 也有每日请求及计算时长配额，当前官方表列为 100,000 请求／日和 13,000 GB-s／日，不能视作无限免费。[运行限制](https://developers.cloudflare.com/durable-objects/platform/limits/)、[配额说明](https://developers.cloudflare.com/durable-objects/platform/pricing/)。本次没有开通付费计划。绑定或额度不可用时认证返回 503，不回退到弱密码哈希；原有验证码登录不依赖该服务。

`nodejs_compat` 提供 [Workers 原生 Node crypto](https://developers.cloudflare.com/workers/runtime-apis/nodejs/crypto/)，没有新增 npm 运行依赖、OpenAI key 或外部认证供应商。

## 验证码、会话与数据边界

- 密码为 8–128 个 Unicode 字符，允许空格与长句，不要求字符类型组合；拒绝纯空白、简单重复和小型常见弱口令清单。这不是完整泄露密码库检查。最低八字符是用户明确选择的便捷性取舍，低于 OWASP 对无 MFA 单因素密码的十五字符建议，不声称符合整套 NIST 认证要求；仍支持更长口令。[口令策略参考](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)。
- 注册、登录、设置和重置采用不同验证码用途；设置码只能用于当前已认证邮箱，不能通过请求里的其他邮箱或 ID 修改别人的密码。
- 验证码过期／单次使用／五次失败限制在服务端执行；使用新版码后旧码不会重新成为有效候选；写入事务在 KDF 完成后再次检查验证码。
- 密码请求按账号／用途和来源 IP 做原子限流，临时限流不永久锁号；旧验证码发送冷却继续保留。公共找回入口使用相同的账号存在／不存在提示。
- 新密码注册、凭据更新、验证码消费和会话撤销使用真实 D1 batch 事务；存储失败不留下半个注册账号或提前撤销会话。
- 登录建立会话时再次匹配已验证的凭据版本，防止较早密码／验证码请求在密码重置之后重新建立旧会话。
- 设置／重置会作废该账号旧会话和未使用的验证码，不影响其他账号。发送不含密码的安全通知；通知失败不会回滚已生效的密码变更。
- 保留原 cookie 名、HttpOnly／SameSite／HTTPS Secure、30 天会话期限、expected-user、账号缓存与学习同步协议。所有认证 POST，包括备用验证码入口，拒绝跨站来源和非 JSON 请求。

找回流程参考 [OWASP Forgot Password](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)，恢复后需正常登录。没有声称已经完成独立安全审计。

## 接口

| POST 路径 | 用途 |
| --- | --- |
| `/api/auth/password/register` | 注册验证码＋密码，创建账号与会话 |
| `/api/auth/password/login` | 邮箱＋密码，创建独立设备会话 |
| `/api/auth/password/set-code` | 当前账号申请设置／修改密码验证码 |
| `/api/auth/password/set` | 当前账号验证并保存密码，轮换会话 |
| `/api/auth/password/reset-code` | 申请找回密码邮件，使用统一提示 |
| `/api/auth/password/reset` | 重置密码，撤销旧会话，返回正常登录 |

旧 `/auth/send-code`、`/auth/verify-code` 及学习／课堂接口保留；密码不再被当作验证码字段处理。账号响应新增可选 `hasPassword`，师生资料更新也保留该标识，哈希永不返回客户端。

## 部署与迁移

正常发布需要同时包含客户端、Worker、D1 schema、Durable Object binding／migration 与 `nodejs_compat`。现有 GitHub main 工作流已按“质量检查 → 幂等 D1 → Worker＋静态资源”排序，不需要新增必填密钥。

1. `worker/schema.sql` 增加 `password_credentials` 和 `auth_rate_limits`，均为 `CREATE TABLE IF NOT EXISTS`；旧用户、学习表与用户 ID 不变，无需重建账号或搬移进度。
2. `wrangler.toml` 增加内部 `PASSWORD_HASHER` binding，导出类 `PasswordHasher`，迁移标签 `v1-password-hasher` 使用 `new_sqlite_classes`，适配 Free。哈希对象不使用其存储 API。
3. 现有 `npm run d1:migrate` 会先执行新增表，再检查旧进度列；只有随后完整发布 Worker／静态资源，新的默认密码入口才可用。
4. 上线后由用户在页面设置自己的密码；不能从旧验证码推导密码。生产还需验收真实邮件、新密码登录、找回和多设备撤销，以及实际 Free 配额／延迟。

回退时保留新增 D1 表、哈希数据、Durable Object 类导出与 binding，关闭密码入口或发布兼容版本；不要为回退删除账号、清空学习记录或销毁命名空间。旧验证码路径继续可用。

## 验证

| 检查 | 结果 |
| --- | --- |
| Node 全量回归 | 482 项通过，包含 13 项密码／恢复／限流／回滚／并发／Free 服务边界测试。 |
| 浏览器 CI | 37 项原交付＋24 项真实双版本 PWA 升级＋24 项密码流程断言通过。账号服务器仅监听 loopback，使用原 Worker 和一次性 SQLite；只把外发测试邮件替换为虚构收件箱。 |
| 原生运行时 | 实际 workerd＋本地 D1＋SQLite `PasswordHasher` Durable Object 的 14 项接口检查通过，覆盖注册、独立会话、旧账号设密、事务重置、会话撤销及验证码重放。 |
| UI | 1440／390／320 px、浅色找回表单、手机深色账号面板，真实输入／显示密码／确认不一致／登录与重置交互通过，无横向溢出或 pageerror。 |
| 工程检查 | Lint、生产构建、缓存／启动包预算、6 项跨时区与 Worker dry-run 通过。 |

固定复现命令：

```bash
node --test tests/password-auth.test.mjs
npm test
npm run lint
npm run build
npm run performance:audit
PLAYWRIGHT_CHANNEL=chrome npm run test:browser
WRANGLER_SEND_METRICS=false npx --no-install wrangler deploy --dry-run
```

CI 新密码检查脚本和测试邮箱服务受版本管理；截图／trace 在忽略目录 `output/browser-ci/`。额外原生运行时临时配置、假邮箱与独立数据库仅在忽略目录 `output/playwright/password-auth/`，不是生产入口，不进入构建或 Git。尚未进行新密码功能的真实生产账号或 iOS/Safari 验收。

## 变更文件

- 后端：`worker/passwordAuth.js`、`worker/passwordCrypto.js`、`worker/passwordHasher.js`、`worker/emailCodes.js`、`worker/index.js`、`worker/classroom.js`、`worker/schema.sql`、`wrangler.toml`。
- 共享规则与客户端：`shared/passwordPolicy.js`、`src/utils/workerAuth.js`、`src/hooks/app/useAccountSession.js`、`src/App.jsx`、`src/components/account/AuthCredentialsForm.jsx`、`src/components/AuthPanel.jsx`、`src/styles/auth.css`。
- 回归：`tests/password-auth.test.mjs`、`tests/helpers/classroom-db.mjs`、`scripts/check-password-auth-browser.mjs`、`scripts/lib/account-audit-server.mjs`、`scripts/browser-ci.mjs`。
- 交接：本文、`PROJECT_CONTEXT.md`、`docs/release-status.md`、`docs/account-sync-acceptance-2026-11-02.md`（补记用户对前次同步修复的成功复测反馈）。
