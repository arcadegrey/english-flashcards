# 133 词多义项修复（2026-10-31）

## 内容范围

用户提供的 DeepSeek 清单含 118 条多义词、16 个缺义项候选，mine 重合，因此实际修复 **133 个稳定词条 ID**。源快照、逐词词典来源和完整 before／after 均保存在 `data/vocabulary-multi-sense-repair/`。原始清单未被改写成“已由独立人工专家审核”；本批是单模型逐词编辑复核。

新增 **424 条带词性／义项标签的双语短句**，每词 2–6 条，复用既有真实 WordCard 例句组件及逐句播放。第一条例句仍供原有填空、听写等练习使用，不改变抽题、计分、路线或学习范围。其余 8616 个活动词条及所有 ID、词头、分类、学习进度均保持不变。

- 补充 pupil 的瞳孔、temple 的太阳穴、fan 的爱好者、mine 的代词与地雷、coach 的长途汽车／经济舱、story 的美式楼层等常用义项。
- 修正原词性漏标，明确 n.／v.／adj. 等；清理 set 的残片与默认教学释义、sound 的截断释义。
- club 的社团属于已有组织义，不另造缺失义项；trip 不被泛化为“任何失误”；bit 与 bite–bit–bitten 的关系明确区分。
- 英式／美式以及正式用法明确标注。旧的、非本次核对范围内的有效扩展释义保留，不声称已穷尽词典所有义项。
- 单词的每个主来源页面均取得公开 HTTP 200 并提取到词典释义，记录页面哈希、词典 URL 与日期。原句独立编写；词典正文不打包进前端。正文与校验缓存位于忽略目录 `output/multi-sense-sources/`。

## 异读词

bow、wound、object、row、record、present、wind、tear、lead、close 在例句标签和词头音标中区分读音／重音。录音生成时对目标词使用明确音素，生成清单逐项保留实际音素，并验证没有丢失覆盖；美式与英式分别生成。

例如 wound 的伤口义读 /wuːnd/，wind 过去式读 /waʊnd/；lead 的铅义读 /led/，带领义读 /liːd/；close 的动词与形容词分别以 /z/、/s/ 结尾。[Cambridge · wound](https://dictionary.cambridge.org/us/pronunciation/english/wound)、[lead](https://dictionary.cambridge.org/dictionary/english/lead)、[close](https://dictionary.cambridge.org/us/pronunciation/english/close)。

词头播放使用当前第一项对应的读音；10 个词头重录使用精确的词头、释义与音标守卫，旧快照不被强行切换到新读音。对例句则按稳定 ID 与完整英文选择录音。

## 数据、提示与历史兼容

- canonical、core、所有实际包含目标词的完整 TOEFL／IELTS 分片同步，按原生成器重建目录、详情、阅读词汇摘要、提示批次及 Worker 词汇／听写登记。
- 多例句仍只存在于按需详情，启动摘要不携带英文例句。没有把整份编辑登记静态打进前端启动图。
- 当前词条新增“多义用法”提示，保留仍适用的原有近义辨析、构词与常用义补充。
- 多义词提示批次添加可选语义守卫；hook 随当前释义／音标／例句变化重读。旧快照或同 ID 的自定义释义冲突时，不套用新提示，仍显示该快照自己的词义回顾。
- `beforeMultiSenseReview` 可完整还原前一阶段，早期阶段哈希与编辑登记继续有效。旧维护脚本登记新阶段，不会回滚本批；未知修改仍被拒绝。
- 旧作业答案、选项和成绩使用冻结快照；旧听写例句版本与录音保留。不改账号授权、同步结构或个人存储，不需要 D1／用户数据迁移。

## 音频与验证

424 条例句与 10 个异读词头 × 四音色，共 **1736 个新版本 MP3**，13,488,264 字节。发布到原 R2 桶 `audio-updates/2026-10-31-multi-sense/`，保持 `audio.englishflashcards.cn` 正式域名；原版本音频不删除。MP3 继续排除在 Git、应用静态包与 PWA 安装缓存之外。

- 本地 1736/1736：完整字节数／SHA-256、24 kHz 单声道 MP3 参数、完整浮点解码、有限样本及非静音 RMS 均通过。
- 公网 1736/1736：HTTP 200、audio/mpeg、字节数／SHA-256 全部匹配，发布清单逐字节相同。回执：`data/vocabulary-multi-sense-repair/audio-r2-release-2026-10-31.json`。
- 单元／集成测试 **436/436**，跨时区 **6/6**，Lint、生产构建、Worker dry-run 和差异检查通过。新增范围、原型快照、义项句子、字段矩阵、音素与提示语义守卫验证；旧功能测试继续执行。
- 真实生产包词卡：桌面 1440px 和手机 390px 各核对全部 133 词，另在 320px 深色核对 16 个重点词，共 282 次词卡／1414 项断言通过，无未捕获错误。英文、中文、标签、逐句按钮及页面宽度均核对。该轮仅布局检查拦截了预加载 MP3，正向原生播放另行执行。
- 真实词卡按钮完成 **98 个不同公网录音**的原生播放至 ended，包括 10 个异读词的四音色对照例句及词头；没有未捕获播放错误。第一轮 80 段后因搜索条件同时命中其他词条而结束，wind、tear 使用独立唯一条件补验 18 段全部通过；这是检索夹具问题，不是音频失败。
- PWA 102 项／2913.31 KiB 未压缩预缓存，保留既有大 chunk／Browserslist 提示。录音正向验证使用本机既有代理，不能当作国内无代理测速，也不是对全部 1736 条录音逐一的人耳认证。

## 复现与发布

```bash
node scripts/apply-vocabulary-multi-sense.mjs
npm run build
npm test
node scripts/audit-multi-sense.mjs
```

本机已有 Kokoro 环境下，`scripts/generate_multi_sense_audio.py` 可按当前清单断点续做；没有实时合成服务或新 API key。`scripts/validate-multi-sense-audio.py` 校验本地，`scripts/publish-multi-sense-audio.py` 用既有 Wrangler 登录发布并逐文件公开核验，支持 `--verify-only`。代理仅通过调用者环境配置，不写入产品配置。

发布沿用已有 main 自动工作流，必须一起交付完整词库／目录／详情／阅读摘要／提示／音频映射和 Worker 听写登记。先确认上述公开录音就绪，再切换前端映射。
