# GitHub Pages 部署指南

本指南将帮助您将新闻聚合器部署到 GitHub Pages,使其可以通过互联网访问。

## 前置准备

1. **GitHub 账号**: 如果没有,请先注册 [https://github.com](https://github.com)
2. **Git 安装**: 确保本地已安装 Git
   - Windows: [https://git-scm.com/download/win](https://git-scm.com/download/win)
   - Mac: `brew install git`
   - Linux: `sudo apt install git`

## 部署步骤

### 第一步: 创建 GitHub 仓库

1. 登录 GitHub
2. 点击右上角的 `+` 按钮,选择 `New repository`
3. 填写仓库信息:
   - **Repository name**: `news-aggregator` (或其他您喜欢的名称)
   - **Description**: `实时新闻聚合器`
   - **Public**: ✅ 选择公开(免费用户必须选择公开才能使用 GitHub Pages)
   - **Initialize this repository**: ❌ 不勾选
4. 点击 `Create repository`

### 第二步: 初始化本地 Git 仓库

在项目文件夹中打开终端/命令提示符:

```bash
# 进入项目目录
cd c:/Users/LiaoRH/CodeBuddy/Claw

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit - 新闻聚合器"
```

### 第三步: 连接到 GitHub 仓库

```bash
# 添加远程仓库 (替换 YOUR_USERNAME 为您的 GitHub 用户名)
git remote add origin https://github.com/YOUR_USERNAME/news-aggregator.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 第四步: 启用 GitHub Pages

1. 在 GitHub 上打开您的仓库
2. 点击 `Settings` 标签页
3. 在左侧菜单中找到 `Pages`
4. 在 `Build and deployment` 部分:
   - **Source**: 选择 `Deploy from a branch`
   - **Branch**: 选择 `main` 分支,文件夹选择 `(root)`
   - 点击 `Save`
5. 等待 1-2 分钟,页面会刷新显示部署状态

### 第五步: 访问您的网站

部署成功后,您的网站地址将是:

```
https://YOUR_USERNAME.github.io/news-aggregator/
```

替换 `YOUR_USERNAME` 为您的 GitHub 用户名。

## 常见问题

### 1. 推送时出现身份验证错误

**问题**: 推送时提示 "Authentication failed"

**解决方案**:
- 使用 HTTPS 时,GitHub 现在要求使用 Personal Access Token
- 创建 Token:
  1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  2. 点击 `Generate new token (classic)`
  3. 勾选 `repo` 权限
  4. 生成并复制 token
- 使用 token 推送:
```bash
git push https://YOUR_TOKEN@github.com/YOUR_USERNAME/news-aggregator.git
```

### 2. 页面显示 404

**原因**: GitHub Pages 部署需要 1-2 分钟时间

**解决方案**:
- 等待几分钟后刷新页面
- 检查仓库 Settings → Pages 中的部署状态
- 确保文件在仓库的根目录

### 3. RSS 加载失败

**原因**: 某些 RSS 源可能存在 CORS 限制

**解决方案**:
- 项目已使用 rss2json.com 作为代理服务
- 如果仍有问题,可以尝试其他 RSS 源
- 检查浏览器控制台的错误信息

### 4. 自定义域名

如果想要使用自己的域名:

1. 在仓库根目录创建 `CNAME` 文件
2. 文件内容填写您的域名(如 `news.example.com`)
3. 在域名服务商处配置 DNS:
   - 添加 CNAME 记录: `www` → `YOUR_USERNAME.github.io`
   - 或添加 A 记录指向 GitHub Pages IP 地址

## 更新网站

当您修改代码后,只需:

```bash
# 添加更改
git add .

# 提交
git commit -m "更新内容"

# 推送
git push
```

GitHub Pages 会自动重新部署,通常 1-2 分钟后生效。

## 项目文件说明

部署到 GitHub Pages 需要的文件:

```
Claw/
├── news.html           # 首页
├── news-detail.html    # 新闻详情页
├── news.css           # 样式文件
├── news.js            # JavaScript 逻辑
├── README_NEWS.md     # 项目说明
└── GITHUB_PAGES_GUIDE.md  # 本指南
```

## 其他部署选项

### 使用 GitHub CLI (gh)

如果已安装 GitHub CLI:

```bash
# 登录 GitHub
gh auth login

# 创建仓库并推送
gh repo create news-aggregator --public --source=. --push
```

### 使用 GitHub Desktop

1. 下载并安装 [GitHub Desktop](https://desktop.github.com/)
2. 打开项目文件夹
3. 点击 `Publish repository`
4. 填写仓库名称并点击 `Publish`

## 维护建议

1. **定期更新**: 定期推送代码更新
2. **监控 RSS 源**: 检查 RSS 源是否可用
3. **用户反馈**: 收集用户反馈并改进功能
4. **安全性**: 不要在代码中暴露敏感信息

## 扩展功能建议

部署后可以考虑添加:

- [ ] 用户评论系统 (如 Disqus)
- [ ] 新闻收藏功能 (使用 LocalStorage)
- [ ] 主题切换 (深色/浅色模式)
- [ ] 多语言支持
- [ ] PWA 支持 (离线访问)
- [ ] 搜索历史记录
- [ ] 社交分享功能

## 获取帮助

遇到问题时可以:

1. 查看 [GitHub Pages 官方文档](https://docs.github.com/pages)
2. 在仓库中创建 Issue
3. 搜索 GitHub 社区的类似问题

---

祝您部署顺利! 🎉
