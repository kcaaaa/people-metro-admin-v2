#  部署指南

本文档提供了将人民城轨2.0运营管理系统部署到GitHub Pages的详细步骤。

##  前提条件

1. 拥有GitHub账户
2. 安装Git客户端
3. 基本的Git操作知识

##  部署步骤

### 1. 创建GitHub仓库

1. 登录GitHub账户
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库信息：
   - Repository name: people-metro-admin-v2
   - Description: 人民城轨2.0运营管理系统 - 企业级短视频内容管理平台
   - 选择 "Public"
   - 不要勾选 "Initialize this repository with a README"
4. 点击 "Create repository"

### 2. 推送代码到GitHub

在本地项目目录执行以下命令：

`ash
# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: 人民城轨2.0运营管理系统"

# 添加远程仓库（替换[your-username]为你的GitHub用户名）
git remote add origin https://github.com/[your-username]/people-metro-admin-v2.git

# 推送到main分支
git branch -M main
git push -u origin main
`

### 3. 配置GitHub Pages

1. 进入GitHub仓库页面
2. 点击 "Settings" 标签
3. 在左侧菜单中找到 "Pages"
4. 在 "Source" 下选择：
   - Source: Deploy from a branch
   - Branch: main
   - Folder: /docs
5. 点击 "Save"

### 4. 启用GitHub Actions

1. 进入仓库的 "Settings" > "Actions" > "General"
2. 在 "Actions permissions" 选择 "Allow all actions and reusable workflows"
3. 在 "Workflow permissions" 选择 "Read and write permissions"
4. 点击 "Save"

### 5. 访问部署的网站

部署成功后，可以通过以下URL访问：

`
https://[your-username].github.io/people-metro-admin-v2/
`

##  更新部署

后续更新只需要：

`ash
# 添加修改的文件
git add .

# 提交更改
git commit -m "更新说明"

# 推送到GitHub
git push
`

GitHub Actions会自动重新部署。

##  调试技巧

1. 查看部署日志：进入 Actions 标签查看详细日志
2. 本地测试：使用 python -m http.server 模拟部署环境
3. 使用浏览器开发者工具检查错误信息

---

祝您部署顺利！
