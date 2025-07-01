#  贡献指南

感谢您对人民城轨2.0运营管理系统的关注！我们欢迎任何形式的贡献。

##  贡献方式

###  报告问题
- 通过 [GitHub Issues](https://github.com/[your-username]/people-metro-admin-v2/issues) 报告Bug
- 提供详细的问题描述和复现步骤
- 包含浏览器信息、错误截图等

###  功能建议
- 提交功能请求或改进建议
- 详细描述功能需求和使用场景
- 说明功能的价值和必要性

###  代码贡献
- Fork项目到您的账户
- 创建功能分支
- 提交代码更改
- 发起Pull Request

##  开发环境设置

### 环境要求
- Node.js 14.0+ (用于开发工具)
- 现代浏览器
- Git客户端

### 本地开发
`ash
# 克隆仓库
git clone https://github.com/[your-username]/people-metro-admin-v2.git
cd people-metro-admin-v2

# 启动本地服务器
python -m http.server 8000
# 或
npx http-server -p 8000

# 访问 http://localhost:8000
`

##  开发规范

### 代码风格
- 使用2空格缩进
- 优先使用const/let，避免var
- 组件命名使用PascalCase
- 函数命名使用camelCase
- 保持代码简洁和可读性

### 提交规范
使用语义化提交信息：

`
feat: 添加新功能
fix: 修复Bug
docs: 更新文档
style: 代码格式调整
refactor: 代码重构
test: 添加测试
chore: 构建过程或辅助工具的变动
`

示例：
`ash
git commit -m "feat: 添加用户导出功能"
git commit -m "fix: 修复数据统计图表显示问题"
git commit -m "docs: 更新API文档"
`

### 分支策略
- main: 主分支，稳定版本
- develop: 开发分支
- eature/*: 功能分支
- hotfix/*: 紧急修复分支

##  Pull Request流程

1. **Fork仓库**
   `ash
   # 在GitHub上Fork仓库
   git clone https://github.com/your-username/people-metro-admin-v2.git
   `

2. **创建功能分支**
   `ash
   git checkout -b feature/amazing-feature
   `

3. **开发和测试**
   - 编写代码
   - 进行本地测试
   - 确保功能正常

4. **提交更改**
   `ash
   git add .
   git commit -m "feat: 添加令人惊叹的功能"
   `

5. **推送分支**
   `ash
   git push origin feature/amazing-feature
   `

6. **创建Pull Request**
   - 访问GitHub仓库页面
   - 点击"New Pull Request"
   - 填写详细的PR描述

### PR描述模板
`markdown
##  描述
简要描述本次更改的内容和目的。

##  变更类型
- [ ] Bug修复
- [ ] 新功能
- [ ] 代码重构
- [ ] 文档更新
- [ ] 性能优化

##  测试
- [ ] 本地测试通过
- [ ] 浏览器兼容性测试
- [ ] 功能验证完成

##  截图
如果涉及UI变更，请提供截图。

##  检查清单
- [ ] 代码符合项目规范
- [ ] 提交信息清晰明确
- [ ] 文档已更新（如需要）
- [ ] 测试已通过
`

##  问题报告模板

`markdown
##  问题描述
清晰描述遇到的问题。

##  复现步骤
1. 进入页面...
2. 点击按钮...
3. 看到错误...

##  期望行为
描述您期望发生的行为。

##  环境信息
- 操作系统: [例如 Windows 10]
- 浏览器: [例如 Chrome 91]
- 版本: [例如 2.0.1]

##  截图
如果适用，添加截图来解释问题。

##  额外信息
添加其他相关信息。
`

##  贡献者

感谢所有贡献者的努力！您的名字将出现在这里：

<!-- 这里将自动生成贡献者列表 -->

##  联系我们

如有疑问，请通过以下方式联系：

-  邮箱: admin@people-metro.com
-  GitHub Issues
-  微信群: [群二维码]

---

再次感谢您的贡献！
