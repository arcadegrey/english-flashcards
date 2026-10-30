# P2 D1 生产迁移记录

- 日期：2026-10-22（Asia/Shanghai）。
- 目标：Cloudflare D1 `english-flashcards`，ID `57bc031b-6a9e-406f-a810-c6cba61a41b8`。
- 按用户要求，使用已有 Wrangler OAuth 登录执行；通过 `wrangler whoami` 与 `d1 info` 核验身份及目标，未创建新数据库。
- 命令：`D1_DATABASE_NAME=english-flashcards npm run d1:migrate`。
- 结果：远程 schema 成功处理 25 条语句；原 `user_progress` 扩展字段齐全，无需额外 ALTER。

## 新增与核验

- 新增 `exam_attempts` 表和 `idx_exam_attempts_user_date` 索引。
- 与本机 `worker/schema.sql` 逐项比较：建表／索引 SQL、字段、默认值、联合主键、外键及索引列表完全一致。
- 迁移前后所有原有表和索引定义未变；14 张原有业务表的记录数一致。
- `PRAGMA foreign_key_check` 无异常；新测试历史表为 0 条记录，未写入测试数据。
- 本次只新增结构，没有删除或改写既有账号、学习进度、班级、作业或阅读历史。

## 恢复与审计

- 迁移前 Time Travel 书签：`000000a3-00000000-0000510c-049b998089c7c9b27c9427de76d1767e`。
- 迁移后核验书签：`000000a3-00000008-0000510c-014bb606a72ebb4d7b043ce65350b73f`。
- 只读结构与数量核验保存在被 Git 忽略的 `output/d1-p2-before.json`、`output/d1-p2-after.json`；书签保存在 `output/d1-p2-bookmark-before.json`、`output/d1-p2-bookmark-after.json`。
- 核验没有读取账号邮箱、学习内容或凭据，也未执行恢复操作。

## 代码发布范围

本次仅迁移并验证生产 D1，以及创建 P2 本地 Git 提交。Worker 与前端未在本次操作中部署，Git 推送由用户手动完成。

后续发布记录（2026-10-30 整理）：2026-10-29 的核对已确认截至 `5de1c1f` 的代码推送及 Actions #150 自动部署成功，包含 P2；quality、幂等 D1 schema 与 Worker／静态资源部署步骤通过。P2 不再等待首次代码发布，真实生产账号闭环仍待验收。凭据及后续阅读查词修复的独立发布状态见[发布状态](release-status.md)。功能与本机验收记录见 [P2 功能交接](p2-features.md)。
