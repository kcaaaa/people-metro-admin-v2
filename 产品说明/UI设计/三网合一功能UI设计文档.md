# 三网合一功能UI设计文档

## 1. 文档信息

- **文档版本**：V1.1
- **创建日期**：2025-11-18
- **更新日期**：2025-11-18
- **文档状态**：正式版
- **作者**：产品技术负责人
- **更新说明**：根据系统全局UI规范进行了统一优化，添加了缺失的组件样式定义、交互规范和技术实现要求

### 1.1 更新内容说明

#### V1.1 更新（2025-11-18）

根据系统统一规范要求，对UI设计进行了全面统一，主要更新内容包括：

1. **色彩方案统一**
   - 补充了功能色、中性色、平台标识色的完整表格
   - 确保所有颜色值与系统全局规范保持一致

2. **布局设计补充**
   - 添加了面包屑导航的详细设计规范
   - 完善了各页面的布局结构描述

3. **组件样式完善**
   - 新增按钮、输入框、表格、模态框的详细样式定义
   - 确保组件样式与Element UI标准保持一致

4. **交互设计规范**
   - 添加了按钮、输入框、表格、模态框的交互状态表格
   - 明确了各种交互效果和实现方式

5. **响应式设计规范**
   - 调整响应式断点为系统标准的5个断点
   - 详细定义了各断点的适配策略

6. **图标规范优化**
   - 将图标尺寸改为表格形式展示
   - 添加了图标使用方式和详细规范

7. **技术实现要求**
   - 新增样式管理规范
   - 添加JSX语法替代要求示例
   - 补充组件化开发规范
   - 增加性能优化要求

8. **文档结构调整**
   - 调整了章节编号，确保逻辑清晰
   - 更新了原型图设计说明章节位置

## 2. 设计原则

### 2.1 核心设计理念
- **一致性**：与系统全局UI规范保持高度一致，遵循Element UI设计语言
- **简洁易用**：操作流程清晰，界面简洁，减少用户学习成本
- **响应式设计**：适配不同屏幕尺寸，确保在各种设备上都能良好显示和操作
- **视觉层次**：通过视觉元素引导用户关注重点内容和操作

## 3. 色彩规范

### 3.1 主色调
- **主题色**：#409EFF（Element UI标准主题色）
  - 用途：主要按钮、高亮状态、进度条、链接等
  - 渐变：支持浅色#E6F7FF和深色#1890FF作为补充

### 3.2 功能色
- **成功色**：#67C23A
  - 用途：成功状态、通过审核等积极反馈
- **警告色**：#E6A23C
  - 用途：警告信息、待处理状态
- **危险色**：#F56C6C
  - 用途：错误提示、删除操作、拒绝审核等
- **信息色**：#909399
  - 用途：普通提示信息、次要文本

### 3.2.1 功能色表格

| 颜色类型 | 颜色代码 | 用途 |
|---------|--------|------|
| 成功色 | #67C23A | 成功状态提示、操作成功反馈 |
| 警告色 | #E6A23C | 警告提示、未完成状态 |
| 错误色 | #F56C6C | 错误提示、操作失败反馈 |
| 信息色 | #909399 | 辅助信息、禁用状态 |

### 3.3 中性色
- **背景色**：
  - 主背景：#F5F7FA
  - 次背景：#FFFFFF
  - 三级背景：#F0F2F5
- **边框色**：
  - 主要边框：#DCDFE6
  - 次要边框：#E4E7ED
  - 禁用边框：#EBEEF5
- **文字色**：
  - 主要文字：#303133
  - 次要文字：#606266
  - 提示文字：#909399
  - 禁用文字：#C0C4CC
  - 链接文字：#409EFF

### 3.4 平台标识色
- **APP标识色**：#409EFF（蓝色）
  - 用途：标识APP平台相关元素，与主题色保持一致
- **官网标识色**：#67C23A（绿色）
  - 用途：标识官网平台相关元素
- **公众号标识色**：#E6A23C（橙色）
  - 用途：标识公众号平台相关元素

## 4. 界面布局设计

### 4.1 整体布局
- **结构**：严格遵循系统全局布局规范
  - 顶部导航栏：系统标题、用户信息、操作按钮
  - 左侧菜单栏：功能模块导航
  - 主内容区域：功能实现区域
- **面包屑导航**：必须包含，显示当前页面层级位置，格式：首页 > 内容管理 > 内容发布

### 4.2 内容发布页面
- **顶部**：面包屑导航（首页 > 内容管理 > 内容发布）
- **页面标题栏**：内容发布标题、操作按钮
- **搜索区域**：顶部搜索条件表单，支持折叠/展开
- **操作按钮区**：位于搜索区下方，包含新增、批量操作等按钮
- **平台选择区**：位于操作区下方，提供APP、官网、公众号三个平台选择标签
- **平台配置区**：根据选中的平台动态显示对应的配置表单
- **内容编辑区**：富文本编辑器，用于编辑内容
- **预览区域**：实时预览内容在不同平台的展示效果
- **操作按钮**：底部包含保存、发布、取消按钮

### 4.3 模板管理页面
- **顶部**：面包屑导航（首页 > 内容管理 > 模板管理）
- **标题栏**：模板管理标题
- **工具栏**：搜索与筛选区域（模板名称搜索、类型筛选）
- **操作按钮区域**：新建模板、导入模板、批量删除
- **模板列表**：使用表格展示模板信息
- **操作列**：包含编辑、删除、预览、应用等操作按钮
- **分页控件**

### 4.4 批量发布配置界面
- **顶部**：面包屑导航（首页 > 内容管理 > 批量发布）
- **标题栏**：批量发布配置标题
- **步骤条**：使用步骤条引导用户完成批量发布配置
  - 第一步：选择内容
  - 第二步：选择发布平台
  - 第三步：配置平台参数
  - 第四步：确认发布
- **内容列表**：表格形式展示待发布内容
- **平台配置区**：可折叠的平台配置表单
- **预览与确认**：发布前的预览和确认界面

## 5. 组件样式设计

### 5.1 按钮样式

**遵循Element UI按钮样式规范**

| 按钮类型 | 样式名称 | 背景色 | 文字色 | 边框色 | 用途 |
|---------|---------|-------|-------|-------|------|
| 主要按钮 | el-button--primary | #409EFF | #FFFFFF | #409EFF | 主要操作、关键操作 |
| 成功按钮 | el-button--success | #67C23A | #FFFFFF | #67C23A | 成功操作、完成操作 |
| 警告按钮 | el-button--warning | #E6A23C | #FFFFFF | #E6A23C | 警告操作、需要注意的操作 |
| 危险按钮 | el-button--danger | #F56C6C | #FFFFFF | #F56C6C | 危险操作、删除操作 |
| 信息按钮 | el-button--info | #909399 | #FFFFFF | #909399 | 信息展示、辅助操作 |
| 次要按钮 | el-button--default | #FFFFFF | #606266 | #DCDFE6 | 次要操作、非关键操作 |
| 文字按钮 | el-button--text | 透明 | #409EFF | 无 | 辅助操作、表格操作按钮 |

**按钮尺寸**

| 尺寸 | 样式名称 | 高度 | 字体大小 | 内边距 |
|-----|---------|------|---------|-------|
| 大型 | el-button--large | 40px | 16px | 12px 24px |
| 中型 | el-button--medium | 32px | 14px | 8px 16px |
| 小型 | el-button--small | 28px | 13px | 6px 12px |
| 迷你 | el-button--mini | 24px | 12px | 4px 8px |

### 5.2 输入框样式

**遵循Element UI输入框样式规范**

```css
/* 正常状态 */
.el-input__inner {
  width: 100%;
  padding: 0 12px;
  font-size: 14px;
  line-height: 32px;
  color: #303133;
  background-color: #FFFFFF;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  transition: border-color 0.3s;
}

/* 聚焦状态 */
.el-input__inner:focus {
  border-color: #409EFF;
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

/* 错误状态 */
.el-input.is-error .el-input__inner {
  border-color: #F56C6C;
}

/* 禁用状态 */
.el-input.is-disabled .el-input__inner {
  background-color: #F5F7FA;
  border-color: #E4E7ED;
  color: #C0C4CC;
  cursor: not-allowed;
}
```

### 5.3 表格样式

**遵循Element UI表格样式规范**

```css
/* 表格容器 */
.el-table {
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  font-size: 14px;
  color: #303133;
}

/* 表头 */
.el-table__header-wrapper th {
  background-color: #F5F7FA;
  color: #606266;
  font-weight: 500;
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #EBEEF5;
}

/* 表体 */
.el-table__body-wrapper td {
  padding: 12px;
  border-bottom: 1px solid #EBEEF5;
  color: #303133;
}

/* 行悬停 */
.el-table__row:hover > td {
  background-color: #F5F7FA;
}

/* 斑马纹 */
.el-table--striped .el-table__body-wrapper tr.el-table__row--striped td {
  background-color: #F9FAFB;
}
```

### 5.4 模态框样式

**遵循Element UI模态框样式规范**

```css
/* 模态框容器 */
.el-dialog {
  width: 50%;
  border-radius: 4px;
  background-color: #FFFFFF;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  margin: 0 auto;
}

/* 模态框头部 */
.el-dialog__header {
  padding: 20px 20px 10px;
  border-bottom: 1px solid #EBEEF5;
}

/* 模态框标题 */
.el-dialog__title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

/* 模态框内容 */
.el-dialog__body {
  padding: 20px;
  font-size: 14px;
  color: #606266;
}

/* 模态框底部 */
.el-dialog__footer {
  padding: 10px 20px 20px;
  text-align: right;
  border-top: 1px solid #EBEEF5;
}
```

### 5.5 平台选择组件
```css
/* 平台选择组件样式 */
.platform-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.platform-tag {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #DCDFE6;
  font-size: 14px;
}

/* 未选中状态 - 遵循次要按钮样式 */
.platform-tag {
  background-color: #FFFFFF;
  color: #606266;
  border-color: #DCDFE6;
}

.platform-tag:hover {
  background-color: #F5F7FA;
  border-color: #C0C4CC;
}

/* 选中状态 */
.platform-tag.active {
  color: #FFFFFF;
}

/* 各平台选中状态颜色 */
.platform-tag.app.active {
  background-color: #409EFF;
  border-color: #409EFF;
}

.platform-tag.website.active {
  background-color: #67C23A;
  border-color: #67C23A;
}

.platform-tag.wechat.active {
  background-color: #E6A23C;
  border-color: #E6A23C;
}
```

### 5.2 平台标识样式
```css
/* 平台标识样式 */
.platform-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

/* APP平台标识 */
.platform-badge.app {
  background-color: #E6F7FF;
  color: #409EFF;
}

/* 官网平台标识 */
.platform-badge.website {
  background-color: #F0F9EB;
  color: #67C23A;
}

/* 公众号平台标识 */
.platform-badge.wechat {
  background-color: #FDF6EC;
  color: #E6A23C;
}
```

### 5.3 配置区域样式
```css
/* 配置区域样式 */
.config-section {
  border: 1px solid #E4E7ED;
  border-radius: 4px;
  padding: 16px;
  margin: 8px 0;
  background-color: #FFFFFF;
  transition: all 0.3s ease;
}

.config-section.collapsed {
  display: none;
}

.config-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.config-section-title {
  font-weight: 500;
  color: #303133;
  font-size: 14px;
}

.config-section-content {
  /* 内容样式继承Element UI表单样式 */
}
```

### 5.4 模板管理组件样式
```css
/* 模板管理组件样式 */
.template-list {
  /* 继承Element UI表格样式 */
}

.template-card {
  border: 1px solid #E4E7ED;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
  background-color: #FFFFFF;
  transition: all 0.3s ease;
}

.template-card:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.template-preview {
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  padding: 12px;
  background-color: #F5F7FA;
  min-height: 100px;
  margin-top: 10px;
}

.template-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}

/* 遵循Element UI按钮样式 */
.template-actions .el-button {
  padding: 4px 12px;
  font-size: 12px;
}
```

## 6. 交互效果设计

### 6.1 按钮交互

**遵循Element UI按钮交互规范**

| 交互状态 | 效果描述 | 实现方式 |
|---------|---------|----------|
| 默认状态 | 标准按钮样式 | CSS定义默认样式 |
| 悬停状态 | 背景色变深，边框色变深 | `:hover`伪类 |
| 点击状态 | 背景色更深，边框色更深，有微小的下沉效果 | `:active`伪类 |
| 禁用状态 | 背景色变灰，文字色变浅，鼠标指针为禁止样式 | `.is-disabled`类 |

### 6.2 输入框交互

**遵循Element UI输入框交互规范**

| 交互状态 | 效果描述 | 实现方式 |
|---------|---------|----------|
| 默认状态 | 标准输入框样式 | CSS定义默认样式 |
| 聚焦状态 | 边框色变为主题色，出现蓝色辉光效果 | `:focus`伪类 |
| 输入中状态 | 实时验证，错误时显示错误提示 | 实时监听输入事件 |
| 错误状态 | 边框变红，显示错误图标和提示文字 | `.is-error`类 |
| 禁用状态 | 背景色变灰，文字色变浅，鼠标指针为禁止样式 | `.is-disabled`类 |

### 6.3 表格交互

**遵循Element UI表格交互规范**

| 交互功能 | 效果描述 | 实现方式 |
|---------|---------|----------|
| 行悬停 | 行背景色变浅灰色 | `:hover`伪类 |
| 行选择 | 选中行背景色变为浅蓝色 | `.is-selected`类 |
| 排序 | 点击表头可进行升序/降序/默认排序切换 | 点击事件处理 |
| 筛选 | 点击表头筛选图标可弹出筛选条件面板 | 筛选组件实现 |
| 分页 | 分页控件支持切换页码、每页显示条数 | 分页组件实现 |

### 6.4 模态框交互

**遵循Element UI模态框交互规范**

| 交互功能 | 效果描述 | 实现方式 |
|---------|---------|----------|
| 打开动画 | 从顶部淡入，并有微小的向下移动效果 | 过渡动画 |
| 关闭动画 | 向顶部淡出，并有微小的向上移动效果 | 过渡动画 |
| 点击遮罩关闭 | 点击模态框外部遮罩可关闭模态框 | 点击事件处理 |
| ESC键关闭 | 按ESC键可关闭模态框 | 键盘事件监听 |

### 6.5 平台选择交互
- **点击选择**：点击平台标签切换选中状态
- **视觉反馈**：选中状态背景色变为平台标识色，文字变为白色
- **配置区域联动**：选中平台后平滑显示对应配置区域，取消选中后平滑隐藏

### 6.6 配置区域交互
- **展开/折叠**：支持手动展开和折叠配置区域
- **表单验证**：实时验证表单输入，错误时显示红色边框和提示信息
- **保存提示**：表单内容变更时提供保存提示

### 6.7 模板选择交互
- **预览功能**：鼠标悬停或点击预览按钮查看模板效果
- **应用模板**：点击应用按钮将模板应用到当前内容编辑
- **编辑模板**：点击编辑按钮进入模板编辑页面

### 6.8 发布流程交互
- **步骤引导**：通过步骤条清晰显示当前所处阶段
- **进度提示**：显示发布进度和状态
- **错误处理**：发布失败时显示错误信息和重试按钮
- **成功反馈**：发布成功后显示成功提示和查看链接

## 7. 响应式设计

### 7.1 响应式断点

**遵循系统全局规范的5个断点设置**

| 断点名称 | 屏幕宽度 | 布局策略 |
|---------|---------|----------|
| 移动端 | <768px | 单列布局，核心功能优先，隐藏非必要元素 |
| 平板 | 768px-1199px | 两列布局（部分页面），简化侧边栏 |
| 小屏幕 | 1200px-1399px | 标准三栏布局，适当压缩内容宽度 |
| 中屏幕 | 1400px-1599px | 标准三栏布局，扩展内容区域 |
| 大屏幕 | ≥1600px | 标准三栏布局，充分利用屏幕空间 |

### 7.2 适配策略

**各断点的详细适配策略**

#### 7.2.1 移动端 (<768px)
- 导航栏：顶部导航栏变为汉堡菜单，侧边栏隐藏
- 布局：所有页面改为单列布局
- 内容发布页：平台选择改为下拉菜单，预览和编辑区域上下排列
- 表格：简化表格展示，非关键列隐藏
- 操作按钮：简化为核心操作，次要操作隐藏或移至详情页

#### 7.2.2 平板 (768px-1199px)
- 导航栏：可折叠侧边栏，顶部导航简化
- 布局：大部分页面保持两列布局
- 内容发布页：平台选择保持标签页，但尺寸缩小
- 表格：简化部分列，提供水平滚动
- 操作按钮：保持主要操作按钮可见

#### 7.2.3 小屏幕 (1200px-1399px)
- 导航栏：标准侧边栏，可折叠
- 布局：标准三栏布局，但内容区域适当压缩
- 内容发布页：标准左右分栏布局
- 表格：完整展示，但列宽适当压缩

#### 7.2.4 中屏幕和大屏幕 (≥1400px)
- 导航栏：完整侧边栏导航
- 布局：标准三栏布局，充分利用屏幕空间
- 内容发布页：完整左右分栏布局，预览区域宽度增加
- 表格：完整展示所有列，列宽合理分配

## 8. 平台适配规范

### 8.1 APP端适配
- **图片尺寸**：推荐使用750x1334px尺寸的图片
- **文字排版**：标题18-20px，正文16px，辅助文字14px
- **布局要求**：单栏布局，内容居中
- **交互要求**：支持手势操作，如滑动、缩放等

### 8.2 官网端适配
- **图片尺寸**：推荐使用1920x1080px尺寸的图片，确保清晰度
- **文字排版**：标题24-36px，正文16px，辅助文字14px
- **布局要求**：多栏布局，充分利用屏幕空间
- **响应式要求**：支持桌面、平板、手机多端适配

### 8.3 公众号端适配
- **图片尺寸**：封面图900x383px，内容图640x400px
- **文字排版**：标题20-24px，正文16px，辅助文字14px
- **布局要求**：单栏布局，宽度不超过677px
- **特殊要求**：支持公众号特有的交互，如公众号菜单、自定义回复等

## 9. 图标规范

### 9.1 图标库
- **标准库**：FontAwesome 6.x
- **引用方式**：`<i class="fa-solid fa-icon-name"></i>`

### 9.2 平台图标
- **APP平台图标**：fa-mobile-alt
- **官网平台图标**：fa-globe
- **公众号平台图标**：fa-weixin

### 9.3 操作图标
- **发布图标**：fa-paper-plane
- **保存图标**：fa-save
- **预览图标**：fa-eye
- **编辑图标**：fa-edit
- **删除图标**：fa-trash-alt
- **模板图标**：fa-layer-group
- **配置图标**：fa-cog

### 9.4 状态图标
- **成功图标**：fa-check-circle
- **警告图标**：fa-exclamation-triangle
- **错误图标**：fa-times-circle
- **信息图标**：fa-info-circle

### 9.5 图标尺寸规范

**遵循系统全局图标尺寸规范**

| 图标类型 | 尺寸 | 适用场景 | 示例 |
|---------|------|---------|------|
| 导航图标 | 16px | 主导航菜单、功能模块图标 | <i class="fa-solid fa-file-lines"></i> |
| 操作按钮图标 | 14px | 按钮内图标、操作列图标 | <i class="fa-solid fa-edit"></i> |
| 状态图标 | 12px | 状态提示、标签图标 | <i class="fa-solid fa-check"></i> |
| 提示图标 | 14px | 提示信息、表单验证图标 | <i class="fa-solid fa-info-circle"></i> |

### 9.6 图标使用方式

**遵循系统全局图标使用规范**

- 使用标准HTML标签引用图标：`<i class="fa-solid fa-icon-name"></i>`
- 图标与文字搭配时，图标与文字之间保留4-8px的间距
- 独立使用的图标按钮，确保有适当的点击区域（至少24px×24px）
- 确保图标的颜色与上下文环境协调一致

## 10. 技术实现要求

### 10.1 样式管理规范

- 严格使用Element UI的样式变量，确保样式一致性
- 使用CSS变量管理自定义颜色和尺寸，便于统一修改
- 遵循BEM命名规范进行自定义样式开发
- 避免使用!important覆盖默认样式，优先使用更具体的选择器
- 样式文件按功能模块组织，避免样式冲突

### 10.2 JSX语法替代

根据系统技术规范要求，在需要的场景下使用React.createElement()替代JSX语法：

```javascript
// 示例：使用React.createElement()替代JSX
const buttonElement = React.createElement(
  'button',
  { 
    className: 'el-button el-button--primary',
    onClick: handleClick
  },
  '确认发布'
);

// 带图标的按钮
const iconButtonElement = React.createElement(
  'button',
  { 
    className: 'el-button el-button--success',
    onClick: handleSave
  },
  [
    React.createElement('i', { className: 'fa-solid fa-save' }, null),
    '保存草稿'
  ]
);
```

### 10.3 组件化开发规范

- 遵循Vue 3组件化开发规范，独立功能封装为独立组件
- 组件命名使用PascalCase格式，如`ContentPreview`、`PlatformSelector`
- 组件内样式使用scoped属性避免全局污染
- 组件间通信使用props和emit，复杂场景使用Vuex
- 组件设计遵循单一职责原则，提高复用性

### 10.4 性能优化要求

- 图片资源使用懒加载，减少初始加载时间
- 组件使用v-if和v-show合理切换，避免不必要的渲染
- 大数据列表使用虚拟滚动，提高渲染性能
- 避免在模板中使用复杂计算，优先使用computed属性
- 关键操作使用防抖和节流处理，避免频繁触发
- 使用keep-alive缓存不活跃的组件，减少重新渲染
- 优先使用Element UI原生组件，减少自定义组件开发

## 11. 原型图设计说明

### 11.1 文件结构
- **设计文件**：三网合一功能设计.fig
- **页面包含**：
  - 内容发布主页面
  - 平台配置详情页面
  - 模板管理页面
  - 批量发布流程页面
  - 各平台内容预览页面

### 11.2 交互原型
- **交互文件**：三网合一功能交互原型.fig
- **交互说明**：包含所有主要操作流程的交互演示

## 11. 开发实现建议

### 11.1 组件复用
- **平台选择组件**：封装为独立组件，支持自定义平台和样式
- **配置区域组件**：封装为可折叠的配置区域组件
- **预览组件**：封装为可切换平台的预览组件

### 11.2 性能优化
- **懒加载**：配置区域内容懒加载
- **缓存策略**：模板和配置信息缓存
- **异步加载**：图片和资源异步加载

### 11.3 无障碍访问
- **键盘导航**：支持键盘操作所有功能
- **屏幕阅读器**：提供适当的aria属性
- **颜色对比度**：确保文字和背景色对比度符合标准

## 12. 设计变更记录

| 版本 | 日期 | 修改内容 | 作者 |
|------|------|----------|------|
| V1.1 | 2025-11-18 | 更新UI设计文档，与标准化UI组件库规范保持一致 | 产品技术负责人 |
| V1.0 | 2025-11-18 | 初稿，三网合一功能UI设计 | 产品技术负责人 |