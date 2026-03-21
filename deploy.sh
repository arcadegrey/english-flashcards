#!/bin/bash

echo "🚀 英语单词卡片 PWA - GitHub + Cloudflare 部署脚本"
echo "================================================"
echo ""

if [ ! -f "package.json" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    exit 1
fi

echo "📋 部署步骤："
echo ""
echo "第一步：创建 GitHub 仓库"
echo "----------------------------------------"
echo "1. 访问：https://github.com/new"
echo "2. 仓库名：english-flashcards"
echo "3. 设为 Public"
echo "4. 点击 Create repository"
echo ""
read -p "按 Enter 继续下一步..."

echo ""
echo "第二步：推送代码到 GitHub"
echo "----------------------------------------"
echo ""
read -p "请输入你的 GitHub 用户名: " username

if [ -z "$username" ]; then
    echo "❌ 用户名不能为空"
    exit 1
fi

git remote remove origin 2>/dev/null
git remote add origin https://github.com/${username}/english-flashcards.git

echo ""
echo "正在推送代码..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 代码推送成功！"
    echo ""
    echo "第三步：部署到 Cloudflare Pages"
    echo "----------------------------------------"
    echo "1. 访问：https://pages.cloudflare.com/"
    echo "2. 点击 'Create a project'"
    echo "3. 选择 'Connect to Git'"
    echo "4. 授权 GitHub 并选择 english-flashcards 仓库"
    echo "5. 构建设置："
    echo "   - Framework: Vite"
    echo "   - Build command: npm run build"
    echo "   - Output directory: dist"
    echo "6. 点击 'Save and Deploy'"
    echo ""
    echo "🎉 部署完成后，你的应用地址："
    echo "https://english-flashcards.pages.dev"
else
    echo ""
    echo "❌ 推送失败，请检查："
    echo "1. GitHub 用户名是否正确"
    echo "2. 是否需要登录 GitHub（运行: gh auth login）"
    echo "3. 或使用 SSH: git remote set-url origin git@github.com:${username}/english-flashcards.git"
fi