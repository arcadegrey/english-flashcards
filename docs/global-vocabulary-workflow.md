# 全站共享词库维护流程

## 目标
把 CSV 单词表导入到项目词库文件 `src/data/vocabulary.js`，提交并部署后，全站用户可见。

## CSV 列
- 必填：`word`, `meaning`
- 可选：`phonetic`, `pos`, `example`, `exampleCn`, `category`

示例表头：
```csv
word,phonetic,pos,meaning,example,exampleCn,category
collaborate,/kəˈlæbəreɪt/,v.,合作，协作,We collaborate closely with clients.,我们与客户紧密合作。,business
```

## 导入命令
```bash
npm run words:import -- ./your_words.csv
```

预览导入结果（不写文件）：
```bash
npm run words:import -- ./your_words.csv --dry-run
```

如果词已存在但你想更新 `meaning/example/exampleCn/category`，用 upsert：
```bash
npm run words:import -- ./your_words.csv --upsert
```

先预览 upsert 结果：
```bash
npm run words:import -- ./your_words.csv --upsert --dry-run
```

## 导入规则
- 按 `word`（忽略大小写）去重，重复词会跳过。
- 缺少 `word` 或 `meaning` 的行会跳过。
- `category` 不在现有分类中时，自动回落到 `daily`。
- 新词 `id` 自动从当前最大 `id + 1` 分配。
- `--upsert` 模式会按 `word`（忽略大小写）匹配并更新已有词条；不存在时才新增。

## 发布到全站
1. 运行导入命令
2. 本地验证：`npm run build`
3. 提交并推送代码
4. 部署（Pages/Vercel/Netlify 等）
