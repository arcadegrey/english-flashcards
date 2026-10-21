# P1 D1 生产迁移记录

- 日期：2026-10-21（Asia/Shanghai）。
- 目标：Cloudflare D1 `english-flashcards`，ID `57bc031b-6a9e-406f-a810-c6cba61a41b8`。
- 使用已有 Wrangler OAuth 登录执行；未创建新数据库。
- 命令：`D1_DATABASE_NAME=english-flashcards npm run d1:migrate`。
- 执行结果：远程 schema 脚本成功处理 23 条语句；既有 `user_progress.preferences` 等扩展字段齐全，无需额外 ALTER。

## 新增结构

- `word_assignments`
- `word_assignment_submissions`
- `word_assignment_sessions`
- `reading_attempts`
- `idx_word_assignments_class`
- `idx_reading_attempts_user_date`

迁移后逐项对比 `worker/schema.sql`：四张表的字段、默认值、主键及建表定义、两个索引均一致。`PRAGMA foreign_key_check` 无异常。
迁移前后的 `users`、`user_progress`、`classes`、`class_memberships`、`reading_assignments`、`assignment_submissions`、`reading_sessions` 记录数一致。脚本仅添加结构，没有删除或改写原有业务记录，也未写入测试数据。

## 恢复与审计

- 迁移前 D1 Time Travel 书签：`000000a0-00000000-0000510b-bbd753a036e25e64efd2a0c6e11a19e1`。
- 迁移后书签：`000000a0-00000006-0000510b-4ec17d3dfee4607f726b087680af785f`。
- 本机只读核验输出位于被 Git 忽略的 `output/d1-p1-before.json` 和 `output/d1-p1-after.json`，仅包含结构及数量，不包含账号邮箱、学习内容或凭据。
- 未执行恢复操作。

## 发布范围

本次仅执行并核验 D1 生产迁移。P1 Worker API 与前端代码尚未在本次操作中发布；完整功能上线仍需部署 Worker 和静态资源。
