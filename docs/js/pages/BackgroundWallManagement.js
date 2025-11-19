// 背景墙管理页面
const BackgroundWallManagement = () => {
    const { Card, Table, Button, Input, Select, Space, Tag, Modal, Form, Switch, message, Row, Col, Upload, Image, Divider, Typography } = antd;
    const { Search } = Input;
    const { Option } = Select;
    const { TextArea } = Input;
    const { Title, Paragraph } = Typography;
    
    // 状态管理
    const [loading, setLoading] = React.useState(false);
    const [createModalVisible, setCreateModalVisible] = React.useState(false);
    const [editModalVisible, setEditModalVisible] = React.useState(false);
    const [previewModalVisible, setPreviewModalVisible] = React.useState(false);
    const [selectedBackground, setSelectedBackground] = React.useState(null);
    const [backgroundList, setBackgroundList] = React.useState([
        {
            id: 1,
            name: '欢迎界面背景墙',
            description: '大厅入口处欢迎展示',
            imageUrl: 'https://images.unsplash.com/photo-1516397877639-c507a3654628?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80',
            content: '<p style="font-size:48px; color:#ffffff; text-align:center; text-shadow:2px 2px 4px #000000;">欢迎来到人民城轨数字化平台</p>',
            width: 1920,
            height: 1080,
            createTime: '2025-09-01 10:00:00',
            createUser: '系统管理员',
            lastUpdateTime: '2025-09-01 10:00:00',
            status: 'active'
        },
        {
            id: 2,
            name: '协会介绍背景墙',
            description: '协会信息展示屏',
            imageUrl: 'https://images.unsplash.com/photo-1565076915956-3cc3291298b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80',
            content: '<p style="font-size:36px; color:#409EFF; text-align:left; margin-left:100px; text-shadow:1px 1px 2px #ffffff;">中国城市轨道交通协会</p><p style="font-size:24px; color:#ffffff; text-align:left; margin-left:100px; text-shadow:1px 1px 2px #000000;">推动行业发展，构建和谐城市</p>',
            width: 1920,
            height: 1080,
            createTime: '2025-09-10 14:30:00',
            createUser: '张三',
            lastUpdateTime: '2025-09-15 09:20:00',
            status: 'active'
        },
        {
            id: 3,
            name: '科技展示背景墙',
            description: '科技创新成果展示',
            imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80',
            content: '<p style="font-size:42px; color:#13C2C2; text-align:right; margin-right:100px; text-shadow:2px 2px 3px #000000;">科技创新引领未来</p>',
            width: 1920,
            height: 1080,
            createTime: '2025-09-20 16:45:00',
            createUser: '李四',
            lastUpdateTime: '2025-09-20 16:45:00',
            status: 'inactive'
        }
    ]);
    const [createForm] = Form.useForm();
    const [editForm] = Form.useForm();
    const [imagePreviewUrl, setImagePreviewUrl] = React.useState('');
    
    // 支持的字体样式
    const fontFamilies = [
        { value: 'Arial, sans-serif', label: 'Arial' },
        { value: '"Microsoft YaHei", sans-serif', label: '微软雅黑' },
        { value: 'SimSun, serif', label: '宋体' },
        { value: 'SimHei, sans-serif', label: '黑体' },
        { value: 'KaiTi, serif', label: '楷体' }
    ];
    
    // 支持的文字对齐方式
    const textAlignOptions = [
        { value: 'left', label: '左对齐' },
        { value: 'center', label: '居中' },
        { value: 'right', label: '右对齐' }
    ];
    
    // 支持的文字颜色
    const textColors = [
        { value: '#FFFFFF', label: '白色' },
        { value: '#000000', label: '黑色' },
        { value: '#FF0000', label: '红色' },
        { value: '#00FF00', label: '绿色' },
        { value: '#0000FF', label: '蓝色' },
        { value: '#409EFF', label: '主题蓝' },
        { value: '#67C23A', label: '成功绿' },
        { value: '#E6A23C', label: '警告黄' },
        { value: '#F56C6C', label: '危险红' },
        { value: '#909399', label: '灰色' }
    ];
    
    // 表格列定义
    const columns = [
        {
            title: '背景墙ID',
            dataIndex: 'id',
            key: 'id',
            width: 80
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width: 200
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            width: 250
        },
        {
            title: '尺寸',
            key: 'size',
            width: 120,
            render: (_, record) => `${record.width}×${record.height}`
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 160,
            render: (text) => {
                const date = new Date(text);
                return date.toLocaleString('zh-CN');
            }
        },
        {
            title: '创建人',
            dataIndex: 'createUser',
            key: 'createUser',
            width: 100
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: (status) => React.createElement(
                Tag,
                { color: status === 'active' ? 'success' : 'default' },
                status === 'active' ? '启用' : '禁用'
            )
        },
        {
            title: '操作',
            key: 'actions',
            width: 200,
            fixed: 'right',
            render: (_, record) => React.createElement(
                Space,
                { size: "middle" },
                React.createElement(
                    Button,
                    { size: "small", onClick: () => handlePreview(record) },
                    "预览"
                ),
                React.createElement(
                    Button,
                    { type: "primary", size: "small", onClick: () => handleEdit(record) },
                    "编辑"
                ),
                React.createElement(
                    Button,
                    { danger: true, size: "small", onClick: () => handleDelete(record.id) },
                    "删除"
                ),
                React.createElement(Switch, {
                    checked: record.status === 'active',
                    onChange: (checked) => handleStatusChange(record.id, checked ? 'active' : 'inactive')
                })
            )
        }
    ];
    
    // 处理创建背景墙
    const handleCreate = () => {
        createForm.resetFields();
        setImagePreviewUrl('');
        setCreateModalVisible(true);
    };
    
    // 处理保存创建
    const handleSaveCreate = () => {
        createForm.validateFields().then(values => {
            setLoading(true);
            // 模拟API调用
            setTimeout(() => {
                const newBackground = {
                    id: backgroundList.length + 1,
                    name: values.name,
                    description: values.description,
                    imageUrl: imagePreviewUrl || 'https://via.placeholder.com/1920x1080?text=No+Image',
                    content: values.content,
                    width: values.width || 1920,
                    height: values.height || 1080,
                    createTime: new Date().toISOString(),
                    createUser: '当前用户',
                    lastUpdateTime: new Date().toISOString(),
                    status: 'active'
                };
                
                setBackgroundList([...backgroundList, newBackground]);
                setCreateModalVisible(false);
                message.success('背景墙创建成功');
                setLoading(false);
            }, 1000);
        });
    };
    
    // 处理编辑背景墙
    const handleEdit = (record) => {
        setSelectedBackground(record);
        editForm.setFieldsValue({
            name: record.name,
            description: record.description,
            width: record.width,
            height: record.height,
            content: record.content
        });
        setImagePreviewUrl(record.imageUrl);
        setEditModalVisible(true);
    };
    
    // 处理保存编辑
    const handleSaveEdit = () => {
        editForm.validateFields().then(values => {
            setLoading(true);
            // 模拟API调用
            setTimeout(() => {
                const updatedList = backgroundList.map(item => {
                    if (item.id === selectedBackground.id) {
                        return {
                            ...item,
                            name: values.name,
                            description: values.description,
                            width: values.width,
                            height: values.height,
                            content: values.content,
                            imageUrl: imagePreviewUrl || item.imageUrl,
                            lastUpdateTime: new Date().toISOString()
                        };
                    }
                    return item;
                });
                
                setBackgroundList(updatedList);
                setEditModalVisible(false);
                message.success('背景墙更新成功');
                setLoading(false);
            }, 1000);
        });
    };
    
    // 处理删除背景墙
    const handleDelete = (id) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这个背景墙吗？删除后数据将无法恢复。',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                setLoading(true);
                // 模拟API调用
                setTimeout(() => {
                    const updatedList = backgroundList.filter(item => item.id !== id);
                    setBackgroundList(updatedList);
                    message.success('背景墙删除成功');
                    setLoading(false);
                }, 1000);
            }
        });
    };
    
    // 处理状态切换
    const handleStatusChange = (id, status) => {
        setLoading(true);
        // 模拟API调用
        setTimeout(() => {
            const updatedList = backgroundList.map(item => {
                if (item.id === id) {
                    return {
                        ...item,
                        status,
                        lastUpdateTime: new Date().toISOString()
                    };
                }
                return item;
            });
            
            setBackgroundList(updatedList);
            message.success(`背景墙已${status === 'active' ? '启用' : '禁用'}`);
            setLoading(false);
        }, 500);
    };
    
    // 处理预览背景墙
    const handlePreview = (record) => {
        setSelectedBackground(record);
        setPreviewModalVisible(true);
    };
    
    // 处理图片上传预览
    const handleImageUpload = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setImagePreviewUrl(reader.result);
                resolve(true);
            };
        });
    };
    
    // 自定义上传组件
    const CustomUpload = ({ onChange, disabled }) => {
        const handleClick = () => {
            if (!disabled) {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        await handleImageUpload(file);
                        if (onChange) {
                            onChange(file);
                        }
                    }
                };
                input.click();
            }
        };
        
        return React.createElement(
            Button,
            { onClick: handleClick, disabled: disabled },
            "上传背景图片"
        );
    };
    
    // 处理文本样式更新
    const updateTextStyle = (styleProp, value) => {
        const currentContent = editModalVisible ? editForm.getFieldValue('content') : createForm.getFieldValue('content');
        if (!currentContent) return;
        
        // 简单的富文本样式更新逻辑
        let updatedContent;
        
        // 确保内容包裹在p标签中
        const hasPTag = currentContent.startsWith('<p') && currentContent.endsWith('</p>');
        const innerContent = hasPTag 
            ? currentContent.slice(currentContent.indexOf('>') + 1, currentContent.lastIndexOf('<'))
            : currentContent;
        
        if (hasPTag) {
            // 更新现有p标签的样式
            const regex = new RegExp(`${styleProp}="[^"]*"`, 'i');
            if (regex.test(currentContent)) {
                // 替换现有样式
                updatedContent = currentContent.replace(regex, `${styleProp}="${value}"`);
            } else {
                // 添加新样式
                const pTagStart = currentContent.slice(0, currentContent.indexOf('>'));
                updatedContent = `${pTagStart} ${styleProp}="${value}">${innerContent}</p>`;
            }
        } else {
            // 创建新的带样式的p标签
            updatedContent = `<p style="${styleProp}:${value};">${innerContent}</p>`;
        }
        
        // 更新表单值
        if (editModalVisible) {
            editForm.setFieldsValue({ content: updatedContent });
        } else {
            createForm.setFieldsValue({ content: updatedContent });
        }
    };
    
    // 处理文本内容更新
    const handleContentChange = (e) => {
        const value = e.target.value;
        if (editModalVisible) {
            editForm.setFieldsValue({ content: value });
        } else {
            createForm.setFieldsValue({ content: value });
        }
    };
    
    // 渲染背景墙编辑表单
    const renderForm = (form) => React.createElement(
        Form,
        {
            form: form,
            layout: "vertical",
            style: { maxHeight: '70vh', overflowY: 'auto' }
        },
        React.createElement(
            Form.Item,
            {
                name: "name",
                label: "背景墙名称",
                rules: [{ required: true, message: '请输入背景墙名称' }]
            },
            React.createElement(Input, { placeholder: "请输入背景墙名称" })
        ),
        React.createElement(
            Form.Item,
            {
                name: "description",
                label: "描述",
                rules: [{ required: true, message: '请输入描述' }]
            },
            React.createElement(Input, { placeholder: "请输入背景墙描述" })
        ),
        React.createElement(
            Row,
            { gutter: 16 },
            React.createElement(
                Col,
                { span: 12 },
                React.createElement(
                    Form.Item,
                    {
                        name: "width",
                        label: "宽度（像素）",
                        rules: [{ required: true, message: '请输入宽度', type: 'number' }]
                    },
                    React.createElement(Input, { type: "number", placeholder: "默认1920" })
                )
            ),
            React.createElement(
                Col,
                { span: 12 },
                React.createElement(
                    Form.Item,
                    {
                        name: "height",
                        label: "高度（像素）",
                        rules: [{ required: true, message: '请输入高度', type: 'number' }]
                    },
                    React.createElement(Input, { type: "number", placeholder: "默认1080" })
                )
            )
        ),
        React.createElement(
            Form.Item,
            { label: "背景图片" },
            React.createElement(
                Space,
                { direction: "vertical", size: 16 },
                React.createElement(CustomUpload, null),
                imagePreviewUrl && React.createElement(Image, {
                    src: imagePreviewUrl,
                    alt: "背景图片预览",
                    style: { maxWidth: '100%', maxHeight: '300px', border: '1px solid #d9d9d9' }
                }),
                React.createElement(
                    Typography.Text,
                    { type: "secondary" },
                    "建议上传与设置尺寸一致的图片，以获得最佳显示效果"
                )
            )
        ),
        React.createElement(Divider, { orientation: "left" }, "宣传语编辑"),
        React.createElement(
            Form.Item,
            { label: "文本样式设置" },
            React.createElement(
                Row,
                { gutter: 16 },
                React.createElement(
                    Col,
                    { span: 8 },
                    React.createElement(
                        Form.Item,
                        { label: "字体" },
                        React.createElement(Select, {
                            style: { width: '100%' },
                            onChange: (value) => updateTextStyle('font-family', value),
                            options: fontFamilies
                        })
                    )
                ),
                React.createElement(
                    Col,
                    { span: 8 },
                    React.createElement(
                        Form.Item,
                        { label: "文字颜色" },
                        React.createElement(Select, {
                            style: { width: '100%' },
                            onChange: (value) => updateTextStyle('color', value),
                            options: textColors,
                            optionRender: (option) => React.createElement(
                                "div",
                                { style: { display: 'flex', alignItems: 'center' } },
                                React.createElement("div", {
                                    style: {
                                        width: '16px',
                                        height: '16px',
                                        backgroundColor: option.value,
                                        border: '1px solid #d9d9d9',
                                        marginRight: '8px'
                                    }
                                }),
                                option.label
                            )
                        })
                    )
                ),
                React.createElement(
                    Col,
                    { span: 8 },
                    React.createElement(
                        Form.Item,
                        { label: "对齐方式" },
                        React.createElement(Select, {
                            style: { width: '100%' },
                            onChange: (value) => updateTextStyle('text-align', value),
                            options: textAlignOptions
                        })
                    )
                )
            ),
            React.createElement(
                Row,
                { gutter: 16 },
                React.createElement(
                    Col,
                    { span: 8 },
                    React.createElement(
                        Form.Item,
                        { label: "字体大小（像素）" },
                        React.createElement(Input, {
                            type: "number",
                            placeholder: "默认32",
                            onChange: (e) => updateTextStyle('font-size', `${e.target.value}px`)
                        })
                    )
                ),
                React.createElement(
                    Col,
                    { span: 8 },
                    React.createElement(
                        Form.Item,
                        { label: "文字阴影大小" },
                        React.createElement(Input, {
                            type: "number",
                            placeholder: "默认2",
                            onChange: (e) => updateTextStyle('text-shadow', `${e.target.value}px ${e.target.value}px ${e.target.value * 2}px #000000`)
                        })
                    )
                ),
                React.createElement(
                    Col,
                    { span: 8 },
                    React.createElement(
                        Form.Item,
                        { label: "左边距（像素）" },
                        React.createElement(Input, {
                            type: "number",
                            placeholder: "默认0",
                            onChange: (e) => updateTextStyle('margin-left', `${e.target.value}px`)
                        })
                    )
                )
            )
        ),
        React.createElement(
            Form.Item,
            {
                name: "content",
                label: "宣传语内容（支持HTML标签）",
                rules: [{ required: true, message: '请输入宣传语内容' }]
            },
            React.createElement(TextArea, {
                rows: 6,
                placeholder: "请输入宣传语内容",
                onChange: handleContentChange
            })
        ),
        React.createElement(
            Form.Item,
            { label: "实时预览" },
            React.createElement("div", {
                style: {
                    border: '1px solid #d9d9d9',
                    padding: '20px',
                    minHeight: '150px',
                    backgroundColor: '#f5f5f5'
                },
                dangerouslySetInnerHTML: { __html: form.getFieldValue('content') || '<p>请输入宣传语内容</p>' }
            })
        )
    );
    
    // 渲染创建模态框
    const renderCreateModal = () => React.createElement(
        Modal,
        {
            title: "创建背景墙",
            open: createModalVisible,
            onCancel: () => setCreateModalVisible(false),
            footer: [
                React.createElement(Button, { key: "cancel", onClick: () => setCreateModalVisible(false) }, "取消"),
                React.createElement(Button, { key: "submit", type: "primary", loading: loading, onClick: handleSaveCreate }, "保存")
            ],
            width: 800
        },
        renderForm(createForm)
    );
    
    // 渲染编辑模态框
    const renderEditModal = () => React.createElement(
        Modal,
        {
            title: "编辑背景墙",
            open: editModalVisible,
            onCancel: () => setEditModalVisible(false),
            footer: [
                React.createElement(Button, { key: "cancel", onClick: () => setEditModalVisible(false) }, "取消"),
                React.createElement(Button, { key: "submit", type: "primary", loading: loading, onClick: handleSaveEdit }, "保存")
            ],
            width: 800
        },
        renderForm(editForm)
    );
    
    // 渲染预览模态框
    const renderPreviewModal = () => React.createElement(
        Modal,
        {
            title: `预览：${selectedBackground?.name}`,
            open: previewModalVisible,
            onCancel: () => setPreviewModalVisible(false),
            footer: [
                React.createElement(Button, { key: "close", onClick: () => setPreviewModalVisible(false) }, "关闭")
            ],
            width: 1000,
            bodyStyle: { padding: 0 }
        },
        selectedBackground && React.createElement(
            "div",
            { style: { position: 'relative', width: '100%', height: '600px', overflow: 'hidden' } },
            React.createElement("img", {
                src: selectedBackground.imageUrl,
                alt: "背景图片",
                style: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: 0,
                    left: 0
                }
            }),
            React.createElement("div", {
                style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                },
                dangerouslySetInnerHTML: { __html: selectedBackground.content }
            })
        )
    );
    
    return React.createElement(
        "div",
        null,
        React.createElement(
            "div",
            { style: { marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
            React.createElement(Title, { level: 4 }, "背景墙管理"),
            React.createElement(Button, { type: "primary", onClick: handleCreate }, "创建背景墙")
        ),
        React.createElement(
            Card,
            null,
            React.createElement(Table, {
                columns: columns,
                dataSource: backgroundList,
                rowKey: "id",
                loading: loading,
                pagination: { pageSize: 10 },
                scroll: { x: 'max-content' }
            })
        ),
        renderCreateModal(),
        renderEditModal(),
        renderPreviewModal()
    );
};

// 确保组件被正确导出并注册到应用页面中
window.BackgroundWallManagement = BackgroundWallManagement;
// 注册到App.pages对象，这样路由系统才能找到并渲染该页面
// 使用DOMContentLoaded事件确保App对象已初始化
if (typeof window !== 'undefined' && window.document && window.document.createElement) {
    if (window.App && window.App.pages) {
        window.App.pages['background-wall'] = BackgroundWallManagement;
    } else {
        // 如果App对象还未初始化，等待DOM加载完成后再注册
        document.addEventListener('DOMContentLoaded', function() {
            if (window.App && window.App.pages) {
                window.App.pages['background-wall'] = BackgroundWallManagement;
            }
        });
    }
}