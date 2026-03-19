# PWA 部署指南

## ✅ 已完成的功能

### PWA 核心功能
- ✅ 离线支持 - Service Worker 自动缓存所有资源
- ✅ 可安装 - 支持"添加到主屏幕"
- ✅ 进度持久化 - localStorage 保存学习进度
- ✅ 移动端优化 - 触摸友好、防止缩放、安全区域适配
- ✅ 触觉反馈 - 点击时震动反馈（支持的设备）
- ✅ 响应式设计 - 适配各种屏幕尺寸

### 应用功能
- ✅ 卡片学习模式 - 翻转卡片查看释义
- ✅ 测验模式 - 四选一测试
- ✅ 进度追踪 - 已学习/已掌握统计
- ✅ 语音朗读 - TTS 发音功能
- ✅ 200个四六级核心词汇

## 📱 如何在手机上使用

### iOS (Safari)
1. 在 Safari 中打开应用
2. 点击底部分享按钮 📤
3. 向下滚动，选择"添加到主屏幕"
4. 点击"添加"
5. 应用图标会出现在主屏幕上

### Android (Chrome)
1. 在 Chrome 中打开应用
2. 点击右上角菜单 ⋮
3. 选择"添加到主屏幕"或"安装应用"
4. 点击"安装"
5. 应用图标会出现在主屏幕上

## 🚀 部署方式

### 方式 1: 本地预览（当前可用）
```bash
npm run build
npm run preview
```
访问: http://localhost:4173

### 方式 2: 部署到 Vercel（推荐）
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
cd /Users/arcade/Desktop/english-flashcards_副本
vercel
```

### 方式 3: 部署到 Netlify
```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 部署
cd /Users/arcade/Desktop/english-flashcards_副本
npm run build
netlify deploy --prod --dir=dist
```

### 方式 4: 部署到 GitHub Pages
1. 创建 GitHub 仓库
2. 修改 `vite.config.js` 添加 base:
```js
export default defineConfig({
  base: '/your-repo-name/',
  // ...
})
```
3. 推送代码并部署:
```bash
npm run build
git add dist -f
git commit -m "Deploy"
git subtree push --prefix dist origin gh-pages
```

## 🧪 测试清单

### 基础功能测试
- [x] 应用正常加载
- [x] 卡片翻转动画流畅
- [x] 语音朗读功能正常
- [x] 测验模式答题正常
- [x] 进度统计准确

### PWA 功能测试
- [x] Service Worker 注册成功
- [x] 离线模式可用（断网后仍可访问）
- [x] 学习进度持久化（刷新页面后保留）
- [x] 可添加到主屏幕
- [x] 从主屏幕启动为独立应用

### 移动端测试
- [x] 触摸操作流畅
- [x] 按钮大小适合手指点击
- [x] 防止双击缩放
- [x] 刘海屏安全区域适配
- [x] 触觉反馈工作（支持的设备）

## 📊 构建产物

```
dist/
├── index.html              # 主页面
├── manifest.webmanifest    # PWA 配置
├── sw.js                   # Service Worker
├── registerSW.js           # SW 注册脚本
├── workbox-*.js            # Workbox 运行时
├── assets/
│   ├── index-*.js          # 应用代码
│   └── index-*.css         # 样式
└── icons/
    ├── icon-192.svg        # 应用图标
    └── icon-512.svg        # 应用图标
```

## 🔧 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 代码检查
npm run lint
```

## 📝 注意事项

1. **HTTPS 要求**: PWA 必须在 HTTPS 环境下运行（localhost 除外）
2. **Service Worker 更新**: 修改代码后需要重新构建，用户需要刷新页面获取更新
3. **浏览器兼容性**: 
   - iOS Safari 11.3+
   - Android Chrome 40+
   - 其他现代浏览器
4. **存储限制**: localStorage 通常限制 5-10MB，当前应用使用量很小
5. **触觉反馈**: 仅在支持 Vibration API 的设备上工作

## 🎯 下一步建议

如果你想进一步增强应用，可以考虑：

1. **间隔重复算法** - 智能复习提醒
2. **更多词汇集** - 支持导入自定义单词
3. **学习统计** - 详细的学习曲线图表
4. **云同步** - 多设备同步进度（需要后端）
5. **社交功能** - 分享学习成果
6. **深色模式** - 夜间使用更舒适
7. **推送通知** - 每日学习提醒

## 🐛 故障排除

### Service Worker 未注册
- 检查浏览器控制台是否有错误
- 确保在 HTTPS 或 localhost 环境
- 清除浏览器缓存后重试

### 进度未保存
- 检查浏览器是否禁用了 localStorage
- 查看浏览器控制台的存储面板
- 确保没有使用隐私/无痕模式

### 无法添加到主屏幕
- iOS: 必须使用 Safari 浏览器
- Android: 确保使用 Chrome 或支持 PWA 的浏览器
- 检查 manifest.json 是否正确加载

---

**应用已准备就绪！** 🎉

当前预览服务器运行在: http://localhost:3000
你可以用手机浏览器访问这个地址进行测试。
