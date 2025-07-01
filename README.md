#  人民城轨2.0运营管理系统

<div align="center">
  <img src="https://img.shields.io/badge/version-2.0.1-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/status-active-success.svg" alt="Status">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
</div>

##  项目简介

人民城轨2.0运营管理系统是一个专为城市轨道交通行业设计的企业级短视频内容管理平台。系统集成了内容创作、审核、分发、运营等完整功能链条，支持图文、视频、直播等多种内容形态，为城轨行业提供专业的新媒体运营解决方案。

##  核心特性

###  内容管理
- **多形态支持**：视频、图文、直播全覆盖
- **智能推荐**：基于用户行为的个性化推荐算法
- **多维度审核**：AI + 人工双重审核机制

###  用户运营
- **精细化管理**：用户画像、行为分析、智能分群
- **组织架构**：支持协会、企业多级组织管理
- **权限控制**：细粒度的角色权限体系

###  数据分析
- **实时监控**：核心指标实时展示
- **深度分析**：用户行为、内容表现多维分析
- **可视化报表**：丰富的图表展示

###  安全合规
- **等保三级**：符合国家信息安全等级保护要求
- **审计日志**：完整的操作日志记录
- **内容安全**：多层次内容审核体系

##  技术栈

- **前端框架**: React 17.x
- **UI组件库**: Ant Design 4.x
- **图表库**: ECharts 5.x
- **样式方案**: CSS3 + CSS Variables
- **部署平台**: GitHub Pages

##  快速开始

### 环境要求
- 现代浏览器（Chrome 80+, Firefox 75+, Safari 13+, Edge 80+）
- Node.js 14.x 或更高版本（开发环境）

### 本地运行

1. **克隆仓库**
`ash
git clone https://github.com/[your-username]/people-metro-admin-v2.git
cd people-metro-admin-v2
`

2. **启动本地服务器**
`ash
# 使用Python
python -m http.server 8000

# 或使用Node.js
npx http-server -p 8000
`

3. **访问应用**
`
http://localhost:8000
`

### 登录信息
- 用户名：dmin
- 密码：dmin123

##  项目结构

`
people-metro-admin-v2/
 docs/                    # GitHub Pages部署目录
 js/                      # JavaScript源码
    components/          # 通用组件
    pages/              # 页面组件
    utils/              # 工具函数
    App.js              # 应用入口
 index.html              # 主页面
 README.md               # 项目说明
 人民城轨2.md            # 功能清单
`

##  功能模块

### APP端功能
-  **内容浏览**：推荐、关注、协会、展会多板块
-  **内容发布**：支持图文、视频创作发布
-  **智能搜索**：内容、用户、标签多维搜索
-  **社交互动**：点赞、评论、分享、关注
-  **个人中心**：作品管理、个人信息、系统设置

### 运营后台功能
-  **数据大屏**：核心指标实时监控
-  **内容管理**：审核、推荐、置顶、下架
-  **AI审核**：图文、视频、直播智能审核
-  **用户管理**：信息管理、权限控制、行为分析
-  **数据统计**：多维度数据分析与报表
-  **直播管理**：直播创建、监控、回放管理
-  **展位管理**：展会信息、展位分配
-  **消息推送**：系统通知、定向推送
-  **系统设置**：参数配置、流程管理

##  配置说明

### 部署配置
系统支持多种部署方式：
- GitHub Pages（推荐）
- 静态服务器
- CDN分发

### 环境变量
可通过修改配置文件自定义：
- API接口地址
- 资源路径
- 第三方服务配置

##  贡献指南

欢迎提交Issue和Pull Request！

### 开发流程
1. Fork本仓库
2. 创建功能分支 (git checkout -b feature/AmazingFeature)
3. 提交更改 (git commit -m 'Add some AmazingFeature')
4. 推送到分支 (git push origin feature/AmazingFeature)
5. 提交Pull Request

##  许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

##  联系我们

-  邮箱: admin@people-metro.com
-  问题反馈: [GitHub Issues](https://github.com/[your-username]/people-metro-admin-v2/issues)

##  路线图

- [ ] v2.2.0 - 移动端响应式优化
- [ ] v2.3.0 - 国际化多语言支持
- [ ] v2.4.0 - 深色主题
- [ ] v3.0.0 - 微前端架构重构

---

<div align="center">
  <b> 如果这个项目对您有帮助，请给个星标支持 </b>
  
  Made with  by 人民城轨开发团队
</div>
