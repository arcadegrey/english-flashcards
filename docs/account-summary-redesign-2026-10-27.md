# 首页账号与学习记录栏重排（2026-10-27）

用户要求重新设计截图中“登录保存进度 / 未登录 / 今日学习汇总”底栏。

## 修改

- 新增 `AccountProgressSummary`，复用 `BaseCard` 与现有 Primary/SecondaryButton。宽屏按账号身份、四列真实数据、账号操作排列，使用白蓝表面、22 px 圆角和细分隔线。
- 左侧使用真实文字 Aa 账号标记、学习记录标题、原同步状态。访客明确提示“进度保存在当前设备”；已登录显示原账号邮箱。同步中、待同步、失败及时间文本直接使用原传入值，不推断已同步。
- 保留原四项数据来源：今日标记认识、今日阅读及阅读总数、今日巩固、当前错词。阅读总数仍是原 `readingCount`，未新增阅读目标或掌握率。
- 未登录按钮为“登录 / 注册”，已登录为“查看账号”，均调用原 `onAuthOpen`。通知独占整行，错误使用 alert，其余状态使用 status；长邮箱和消息可换行。
- 1200 px 及以下将数据移至下一行；640 px 及以下沿用原账号汇总栏隐藏行为，手机账号入口仍由共享 chrome 提供。
- 清理旧底栏的伪元素、混合栅格、全局 span 规则和重复深色覆盖。其余 tokens、首页内容和共享导航不变；没有新增图片、依赖、存储、接口或账号/同步逻辑。

## 验证

- lint、生产构建/PWA、`git diff --check`、原有首页 9 项测试通过。保留既有大 chunk / Browserslist 提示；未新增或重跑全量功能测试。
- 300 项隔离组件检查：1440/1280/1024/768 px、浅深主题，访客、已登录、同步中、待同步、长邮箱同步失败和成功通知六种状态；四项真实数值、文字/按钮边界、无横向溢出、原账号回调和错误通知通过。640/390/320 px 保留原隐藏行为。
- 8 项真实 App 检查：原登录注册弹窗打开、注册切换、原学习存储不变、真实深色 token、手机隐藏行为及无未捕获错误。
- 已查看真实首页浅深两主题的最终底栏截图。脚本和截图位于忽略目录 `output/playwright/account-summary-*`。
- 浏览器验收使用隔离访客和本地 API 拦截；登录状态及通知在组件夹具中模拟，未发送验证码、登录生产账号或修改生产数据。

## 文件与发布

- `src/components/home/AccountProgressSummary.jsx`
- `src/styles/account-progress-summary.css`
- `src/components/StudyHub.jsx`
- `src/design-system/tokens.css`
- `src/styles/study-dashboard.css`
- `src/styles/dark-home.css`
- `PROJECT_CONTEXT.md`、本文档

仅前端展示调整，无迁移或 Worker 变更。本轮按用户要求，与移除训练激励栏、答题卡底部留白调整一起本地提交；未推送或部署。
