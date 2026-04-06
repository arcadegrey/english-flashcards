# 账号注册登录与云同步（Tencent CloudBase）

## 1. 安装 CloudBase Web SDK
```bash
npm install @cloudbase/js-sdk
```

## 2. 配置环境变量
在项目根目录创建或修改 `.env`：

```bash
VITE_CLOUDBASE_ENV_ID=<你的 CloudBase 环境 ID>
VITE_CLOUDBASE_REGION=ap-shanghai
VITE_CLOUDBASE_PUBLISHABLE_KEY=<可选：Publishable Key>
VITE_CLOUDBASE_PROGRESS_COLLECTION=user_progress
```

- `VITE_CLOUDBASE_ENV_ID` 必填。
- `VITE_CLOUDBASE_PUBLISHABLE_KEY` 可选（部分环境推荐配置）。
- 配置后重启前端开发服务。

## 2.1 安全要求（重要）
- 不要把 `SecretId`、`SecretKey` 或任何管理凭证放到前端 `.env`。
- `VITE_` 开头变量会被打包到浏览器代码，用户可见。
- 前端只保留公开配置（如 `ENV_ID`、`Publishable Key`、区域、集合名）。
- 需要管理权限的操作应放在服务端（Cloud Functions / Node API）执行。

## 3. 创建进度集合
在 CloudBase 数据库中创建集合（默认名）：
- `user_progress`

前端会按当前登录用户 ID 写入文档，文档 ID 与用户 ID 一致，字段结构如下：

```json
{
  "userId": "用户ID",
  "learnedWords": [1, 2, 3],
  "masteredWords": [4, 5],
  "customWords": [{ "word": "abandon", "meaning": "放弃" }],
  "updatedAt": "2026-04-06T00:00:00.000Z"
}
```

## 3.1 推荐安全规则（user_progress）
在 CloudBase 控制台给 `user_progress` 集合设置安全规则（JSON）：

```json
{
  "read": "auth.uid != null && doc.userId == auth.uid",
  "create": "auth.uid != null && request.data.userId == auth.uid",
  "update": "auth.uid != null && doc.userId == auth.uid && request.data.userId == auth.uid",
  "delete": "auth.uid != null && doc.userId == auth.uid"
}
```

说明：
- 仅允许登录用户访问自己的进度文档。
- 规则是“前端侧访问控制”；云函数/服务端调用不受此规则限制。
- 若后续把写入统一改为云函数代理，可把前端集合权限进一步收紧。

## 4. 注册与登录流程（当前前端实现）
- 登录：邮箱 + 密码。
- 注册：先提交邮箱+密码发送验证码，再输入验证码完成注册。
- 登录后会自动拉取云端进度并与本地合并，再回写云端。

## 5. 同步逻辑说明
- 学习过程中会自动增量同步。
- 首页账号卡片可手动点击“立即同步”。
- 若未配置 CloudBase，系统保持本地存储模式，不影响学习功能。
