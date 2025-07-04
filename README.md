# 人民城轨2.0运营管理后台

## 项目简介

人民城轨2.0运营管理后台是一个专为城市轨道交通行业设计的企业级内容管理平台。系统提供完整的内容管理、审核流程、数据统计等功能，帮助运营团队高效管理平台内容。

## 技术栈

- React 17
- Ant Design 4.24
- ECharts 5.4
- Moment.js

## 功能特性

- 📊 数据看板
- 📝 内容管理
- 👥 用户管理
- 🎯 运营管理
- 📈 数据统计
- 🔍 审核管理
- 🏢 展商管理
- 📺 直播管理
- ⚙️ 系统设置

## 快速开始

1. 克隆项目
```bash
git clone https://github.com/yourusername/people-metro-admin-v2.git
cd people-metro-admin-v2
```

2. 安装依赖
```bash
npm install
npm run setup
```

3. 启动开发服务器
```bash
npm start
```

4. 访问系统
打开浏览器访问 http://localhost:8000

## 部署说明

1. 构建项目
```bash
npm run build
```

2. 部署到 GitHub Pages
```bash
npm run deploy
```

## 目录结构

```
people-metro-admin-v2/
├── js/                # 源代码目录
│   ├── components/    # 公共组件
│   ├── pages/        # 页面组件
│   └── utils/        # 工具函数
├── vendor/           # 第三方依赖
│   ├── js/          # JavaScript 库
│   └── css/         # CSS 文件
└── index.html       # 入口文件
```

## 开发指南

### 代码规范

- 使用 ES6+ 语法
- 组件采用函数式编程
- 使用 React Hooks 管理状态
- 遵循 Ant Design 设计规范

### 分支管理

- main: 主分支，用于生产环境
- develop: 开发分支
- feature/*: 功能分支
- hotfix/*: 紧急修复分支

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

MIT License
