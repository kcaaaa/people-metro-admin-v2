# 大屏管理 - 富文本编辑器 Demo

## 📋 项目说明

这是一个为"人民城轨后台管理系统"大屏管理功能开发的富文本编辑器 Demo，支持图文混排，图片可以在文字的任意位置进行排版�?

## �?功能特�?

### 1. 富文本编辑功�?
- **文本格式�?*：支持标题（H1-H6）、字体大小调�?
- **文本样式**：粗体、斜体、下划线、删除线
- **颜色设置**：文字颜色、背景颜色自定义
- **对齐方式**：左对齐、居中、右对齐、两端对�?
- **列表功能**：有序列表、无序列�?
- **缩进控制**：增加缩进、减少缩�?

### 2. 图文混排功能 ⭐核心亮�?
- **图片插入**：支持本地图片上传（自动转换�?base64�?
- **智能布局选择�?*：插入图片后自动弹出布局选择对话框，提供4种布局方式�?
  - **左对�?*：图片在左侧，文字环绕右侧（图片宽度45%�?
  - **居中对齐**：图片居中显示（图片宽度70%�?
  - **右对�?*：图片在右侧，文字环绕左侧（图片宽度45%�?
  - **全宽显示**：图片占满整行（图片宽度100%�?
- **灵活调整**：点击已插入的图片可随时重新选择布局方式
- **可视化预�?*：布局选择器中提供可视化预览，直观展示布局效果
- **图片样式**：自动适配容器宽度，支持圆角、阴影效�?
- **交互提示**：鼠标悬停图片时显示"点击设置布局"提示

### 3. 实时预览功能
- **双栏布局**：左侧编辑，右侧实时预览
- **同步更新**：编辑内容实时同步到预览区域
- **所见即所�?*：预览效果与最终展示效果一�?

### 4. 内容管理功能
- **保存内容**：将编辑内容保存到本地存储（localStorage�?
- **自动恢复**：页面刷新后可恢复之前保存的内容
- **导出 HTML**：将编辑内容导出�?HTML 文件
- **清空内容**：一键清空所有编辑内�?

## 🎨 设计规范

### 视觉风格
- **主题�?*：深蓝色渐变�?1e3c72 �?#2a5298），符合中国城市轨道交通协会的品牌�?
- **背景�?*：渐变蓝色背景，营造专业大气的视觉效果
- **字体**：微软雅黑，确保中文显示效果
- **圆角**：统一使用 8px 圆角，现代化设计风格

### 布局规范
- **响应式设�?*：支持不同屏幕尺寸，小于 1200px 时切换为单栏布局
- **栅格系统**：采�?CSS Grid 实现双栏布局
- **间距规范**：统一使用 8px 基础间距倍数�?px�?2px�?6px�?4px�?2px�?

## 🚀 使用方法

### 1. 直接打开
```bash
# 在浏览器中直接打开 index.html 文件
# 双击 index.html 或右键选择"用浏览器打开"
```

### 2. 本地服务器运行（推荐�?
```bash
# 使用 Python 启动本地服务�?
cd demo
python -m http.server 8080

# 或使�?Node.js �?http-server
npx http-server -p 8080

# 然后在浏览器访问
# http://localhost:8080/index.html
```

### 3. 基本操作

#### 编辑文本
1. 在左侧编辑器中输入文本内�?
2. 使用工具栏选择文本格式（标题、粗体、颜色等�?
3. 右侧预览区域实时显示效果

#### 插入图片并设置布局
1. 点击工具栏的图片图标 📷
2. 选择本地图片文件
3. 图片插入后，**自动弹出布局选择�?*
4. 在布局选择器中选择以下任一布局方式�?
   - **左对�?*：图片在左，文字环绕右侧
   - **居中对齐**：图片居中显�?
   - **右对�?*：图片在右，文字环绕左侧
   - **全宽显示**：图片占满整�?
5. 点击选择后，布局立即应用

#### 调整已插入图片的布局
1. 直接点击编辑器中的图�?
2. 自动弹出布局选择�?
3. 选择新的布局方式
4. 布局立即更新，实时预览效�?

#### 保存和导�?
1. **保存内容**：点�?保存内容"按钮，内容保存到浏览器本地存�?
2. **导出 HTML**：点�?导出 HTML"按钮，下�?HTML 文件
3. **清空内容**：点�?清空内容"按钮，清除所有编辑内�?

## 🔧 技术栈

- **富文本编辑器**：Quill.js 1.3.6
  - 轻量级、可扩展的富文本编辑�?
  - 支持自定义工具栏和功能扩�?
  - 良好的跨浏览器兼容�?

- **图标�?*：Font Awesome 6.4.0
  - 丰富的图标资�?
  - 矢量图标，支持任意缩�?
  - 易于集成和使�?

- **前端技�?*�?
  - HTML5：语义化标签
  - CSS3：Grid 布局、Flexbox、渐变、动�?
  - JavaScript ES6+：箭头函数、模板字符串、Promise

## 📁 文件结构

```
demo/
├── index.html          # �?HTML 文件（包含完整的 HTML、CSS、JS�?
└── README.md          # 项目说明文档
```

## 🎯 核心代码说明

### 1. Quill 编辑器初始化
```javascript
var quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
        toolbar: {
            container: toolbarOptions,
            handlers: {
                image: imageHandler  // 自定义图片处�?
            }
        }
    },
    placeholder: '请输入内容，支持图文混排...'
});
```

### 2. 自定义图片上�?
```javascript
function imageHandler() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    
    input.onchange = async () => {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const range = quill.getSelection();
                quill.insertEmbed(range.index, 'image', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };
}
```

### 3. 实时预览更新
```javascript
quill.on('text-change', function() {
    updatePreview();
});

function updatePreview() {
    const content = quill.root.innerHTML;
    document.getElementById('preview').innerHTML = content;
}
```

### 4. 图片样式控制（CSS�?
```css
/* 左对�?- 文字环绕右侧 */
.ql-align-left img,
img[style*="float: left"] {
    float: left;
    margin-right: 16px;
    margin-bottom: 12px;
}

/* 右对�?- 文字环绕左侧 */
.ql-align-right img,
img[style*="float: right"] {
    float: right;
    margin-left: 16px;
    margin-bottom: 12px;
}

/* 居中对齐 */
.ql-align-center img {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
```

## 🔄 后续集成建议

### 1. 与后端集�?
```javascript
// 保存内容到服务器
async function saveContent() {
    const content = quill.root.innerHTML;
    
    try {
        const response = await fetch('/api/screen/content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: content,
                screenId: 'xxx',
                updateTime: new Date().toISOString()
            })
        });
        
        if (response.ok) {
            alert('保存成功�?);
        }
    } catch (error) {
        console.error('保存失败�?, error);
        alert('保存失败，请重试�?);
    }
}
```

### 2. 图片上传到服务器
```javascript
async function imageHandler() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    
    input.onchange = async () => {
        const file = input.files[0];
        if (file) {
            // 上传到服务器
            const formData = new FormData();
            formData.append('image', file);
            
            try {
                const response = await fetch('/api/upload/image', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                const imageUrl = data.url;
                
                // 插入图片 URL
                const range = quill.getSelection();
                quill.insertEmbed(range.index, 'image', imageUrl);
            } catch (error) {
                console.error('图片上传失败�?, error);
            }
        }
    };
}
```

### 3. 集成�?Vue 3 项目
```vue
<template>
  <div class="editor-container">
    <div ref="editorRef"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const editorRef = ref(null);
let quill = null;

onMounted(() => {
  quill = new Quill(editorRef.value, {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'align': [] }],
        ['image'],
        ['clean']
      ]
    }
  });
  
  // 设置初始内容
  if (props.modelValue) {
    quill.root.innerHTML = props.modelValue;
  }
  
  // 监听内容变化
  quill.on('text-change', () => {
    emit('update:modelValue', quill.root.innerHTML);
  });
});

watch(() => props.modelValue, (newValue) => {
  if (quill && newValue !== quill.root.innerHTML) {
    quill.root.innerHTML = newValue;
  }
});
</script>
```

## 📝 注意事项

1. **图片大小**：建议上传的图片大小不超�?2MB，过大的图片会影响页面性能
2. **浏览器兼容�?*：建议使用现代浏览器（Chrome、Firefox、Edge、Safari�?
3. **本地存储限制**：localStorage �?5-10MB 的存储限制，大量图片可能超出限制
4. **生产环境**：实际使用时应将图片上传到服务器，而不是使�?base64 编码
5. **安全�?*：从服务器加载的 HTML 内容应进�?XSS 过滤处理

## 🎨 自定义样�?

如需修改主题色，可以调整以下 CSS 变量�?

```css
/* 主题�?*/
--primary-color: #2a5298;
--primary-dark: #1e3c72;

/* 替换所有相关颜�?*/
background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-color) 100%);
border-color: var(--primary-color);
color: var(--primary-color);
```

## 📞 技术支�?

如有问题或建议，请联系开发团队�?

---

**版本**：v1.0.0  
**更新时间**�?024�?1�? 
**开发团�?*：人民城轨后台管理系统开发组


