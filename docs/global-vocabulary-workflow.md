# 全站共享词库维护流程

## 目标
把 CSV 单词表导入到全站词库文件 `public/data/vocabulary.json`，提交并部署后，全站用户可见。

## CSV 列
- 必填：`word`, `meaning`
- 可选：`phonetic`, `pos`, `example`, `exampleCn`, `category`, `level`, `list`

示例表头：
```csv
word,phonetic,pos,meaning,example,exampleCn,category,level,list
collaborate,/kəˈlæbəreɪt/,v.,合作，协作,We collaborate closely with clients.,我们与客户紧密合作。,daily,,
```

## 导入命令
```bash
npm run words:import -- ./your_words.csv
```

预览导入结果（不写文件）：
```bash
npm run words:import -- ./your_words.csv --dry-run
```

如果词已存在但你想合并分类或 TOEFL/IELTS 位置字段，用 upsert：
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
- `--upsert` 模式会按 `word`（忽略大小写）匹配已有词条；存在时只合并 `category/categories`、TOEFL `level/list` 和 IELTS `ieltsList/ieltsLists`，不会覆盖已有 `meaning/example/exampleCn/phonetic/pos`。
- Daily/CET 扩展使用 `scripts/build-daily-cet-expansion.py` 从 MIT 许可 ECDICT 临时源生成 `data/daily_cet_expansion.csv`，仓库不提交原始 ECDICT 大文件。

## Daily/CET 扩展

生成筛选后的导入 CSV：

```bash
python3 scripts/build-daily-cet-expansion.py --ecdict-zip /tmp/ecdict.zip --output data/daily_cet_expansion.csv
```

导入前先 dry-run：

```bash
npm run words:import -- data/daily_cet_expansion.csv --upsert --dry-run
```

当前扩展结果：

- 总词量：8699
- Daily：2026
- CET4：2283
- CET6：1520
- TOEFL 分类数保持 3254
- IELTS 唯一词保持 3257

## 发布到全站
1. 运行导入命令
2. 本地验证：`npm run build`
3. 提交并推送代码
4. 部署（Pages/Vercel/Netlify 等）
