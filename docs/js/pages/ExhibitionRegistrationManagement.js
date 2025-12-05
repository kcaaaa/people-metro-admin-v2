// 展会报名管理模块 - 基于 React 17 + Ant Design 4
// 对应需求：简化的展会报名管理功能（第三方平台报名入口）
// 确保React存在
if (!window.React) {
    console.error('React is not loaded. Make sure React is properly included in the project.');
}

// 确保antd存在
if (!window.antd) {
    console.error('Ant Design is not loaded. Make sure antd is properly included in the project.');
}

const ExhibitionRegistrationManagement = () => {
    const React = window.React;
    const antd = window.antd;
    const { 
        Card, Button, Form, Input, Switch, Upload, message, 
        Row, Col, Space, Modal 
    } = antd || {};
    const TextArea = Input?.TextArea;
      const Dragger = Upload?.Dragger;
      
      // 安全获取Form实例
      let form;
      try {
          // 确保Form和useForm存在
          if (Form && Form.useForm) {
              [form] = Form.useForm();
          } else {
              // 降级方案：创建一个简单的form对象模拟Form.useForm()返回的对象
              form = {
                  setFieldsValue: () => console.warn('setFieldsValue not implemented'),
                  submit: () => console.warn('submit not implemented')
              };
              console.warn('Form.useForm is not available, using fallback implementation');
          }
      } catch (error) {
          console.error('Error initializing form:', error);
          form = {};
      }
    
    // --- 状态管理 ---
      // 安全初始化状态
      let loading = false, setLoading = () => {};
      let editModalVisible = false, setEditModalVisible = () => {};
      let currentData = null, setCurrentData = () => {};
      
      // 只有在React.useState存在时才使用React钩子
      if (React && React.useState) {
          [loading, setLoading] = React.useState(false);
          [editModalVisible, setEditModalVisible] = React.useState(false);
          [currentData, setCurrentData] = React.useState(null);
      } else {
          console.warn('React hooks not available, using simple state variables');
      }
      
      // 初始化数据
      if (React && React.useEffect) {
          React.useEffect(() => {
              loadData();
          }, []);
      } else {
          // 如果没有useEffect，直接调用loadData
          loadData();
      }
    
    // 加载数据
    const loadData = () => {
        setLoading(true);
        try {
            // 从本地存储加载数据或使用默认数据
            let data = localStorage.getItem('exhibitionRegistrationConfig');
            if (data) {
                data = JSON.parse(data);
                form.setFieldsValue(data);
                setCurrentData(data);
            } else {
                // 默认配置
                const defaultData = {
                    name: '2024中国城市轨道交通展览会',
                    link: 'https://example.com/exhibition-registration',
                    isEnabled: false,
                    imageUrl: ''
                };
                form.setFieldsValue(defaultData);
                setCurrentData(defaultData);
            }
        } catch (error) {
            message.error('加载数据失败');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    // 保存配置
    const handleSave = async (values) => {
        setLoading(true);
        try {
            // 保存到本地存储
            localStorage.setItem('exhibitionRegistrationConfig', JSON.stringify(values));
            setCurrentData(values);
            message.success('配置保存成功');
            setEditModalVisible(false);
        } catch (error) {
            message.error('保存失败，请重试');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    // 处理图片上传
    const handleImageUpload = ({ file, onSuccess }) => {
        // 模拟上传成功
        setTimeout(() => {
            // 在实际应用中，这里应该是服务器返回的图片URL
            const mockImageUrl = URL.createObjectURL(file.originFileObj);
            form.setFieldsValue({ imageUrl: mockImageUrl });
            onSuccess(mockImageUrl);
        }, 1000);
        return false; // 阻止自动上传
    };
    
    // 编辑配置
    const handleEdit = () => {
        setEditModalVisible(true);
    };
    
    // 切换报名状态
    const handleToggleStatus = async () => {
        if (!currentData) return;
        
        setLoading(true);
        try {
            const newData = {
                ...currentData,
                isEnabled: !currentData.isEnabled
            };
            
            // 保存到本地存储
            localStorage.setItem('exhibitionRegistrationConfig', JSON.stringify(newData));
            setCurrentData(newData);
            form.setFieldsValue(newData);
            message.success(`报名已${newData.isEnabled ? '开启' : '关闭'}`);
        } catch (error) {
            message.error('更新状态失败');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    // 上传配置
    const uploadProps = {
        name: 'file',
        multiple: false,
        accept: '.jpg,.jpeg,.png,.gif',
        customRequest: handleImageUpload,
        beforeUpload: (file) => {
            // 验证文件大小
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('图片大小不能超过 2MB!');
            }
            return isLt2M;
        },
        showUploadList: false
    };
    
    // 渲染函数，确保即使缺少组件也能显示基本内容
    if (!React || !Card) {
        return React?.createElement(
            'div', 
            { className: 'exhibition-registration-management-simple' },
            React?.createElement('div', { style: { padding: '20px' } },
                React?.createElement('h2', null, '展会报名管理'),
                React?.createElement('p', null, '正在加载界面组件...')
            )
        );
    }

    // 使用React.createElement替代JSX语法，避免语法错误
    return React.createElement(
        'div', 
        { className: "exhibition-registration-management-simple" },
        React.createElement(Card, { title: "展会报名管理", bordered: false },
            React.createElement('div', { style: { marginBottom: '24px' } },
                React.createElement('h3', { style: { marginBottom: '16px' } }, "第三方平台报名入口"),
                React.createElement('p', { style: { marginBottom: '20px', color: '#666' } },
                    "配置展会报名的基本信息，包括宣传图、名称和第三方报名链接。"
                ),
                
                // 当前配置展示
                React.createElement(Card, { style: { marginBottom: '24px' } },
                    React.createElement(Row, { gutter: [16, 16] },
                        React.createElement(Col, { xs: 24, md: 6 },
                            React.createElement('div', { style: { textAlign: 'center', padding: '16px', border: '1px dashed #d9d9d9', borderRadius: '6px' } },
                                currentData?.imageUrl ? (
                                    React.createElement('img', {
                                        src: currentData.imageUrl,
                                        alt: "报名宣传图",
                                        style: { maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }
                                    })
                                ) : (
                                    React.createElement('div', { style: { color: '#999', padding: '40px 0' } },
                                        "暂无宣传图"
                                    )
                                )
                            )
                        ),
                        React.createElement(Col, { xs: 24, md: 18 },
                            React.createElement(Row, { gutter: [16, 16] },
                                React.createElement(Col, { xs: 24, md: 12 },
                                    React.createElement('p', null, React.createElement('strong', null, "报名名称："), currentData?.name || '未设置')
                                ),
                                React.createElement(Col, { xs: 24, md: 12 },
                                    React.createElement('p', null, 
                                        React.createElement('strong', null, "报名状态："),
                                        React.createElement(Switch, {
                                            checked: currentData?.isEnabled || false,
                                            onChange: handleToggleStatus,
                                            checkedChildren: "开启",
                                            unCheckedChildren: "关闭",
                                            loading: loading
                                        })
                                    )
                                ),
                                React.createElement(Col, { xs: 24 },
                                    React.createElement('p', null, 
                                        React.createElement('strong', null, "报名链接："),
                                        currentData?.link ? (
                                            React.createElement('a', { href: currentData.link, target: "_blank", rel: "noopener noreferrer" },
                                                currentData.link
                                            )
                                        ) : '未设置'
                                    )
                                )
                            )
                        )
                    )
                ),
                
                // 操作按钮
                React.createElement('div', { style: { textAlign: 'right' } },
                    React.createElement(Button,
                        {
                            type: "primary",
                            onClick: handleEdit,
                            loading: loading
                        },
                        "编辑配置"
                    )
                )
            )
        ),
        
        // 编辑配置模态框
        React.createElement(Modal,
            {
                title: "编辑报名配置",
                open: editModalVisible,
                onCancel: () => setEditModalVisible(false),
                footer: [
                    React.createElement(Button, { key: "cancel", onClick: () => setEditModalVisible(false) },
                        "取消"
                    ),
                    React.createElement(Button,
                        {
                            key: "save",
                            type: "primary",
                            onClick: form.submit,
                            loading: loading
                        },
                        "保存"
                    )
                ],
                width: 700
            },
            React.createElement(Form,
                {
                    form: form,
                    layout: "vertical",
                    onFinish: handleSave,
                    initialValues: currentData
                },
                React.createElement(Form.Item,
                    {
                        name: "name",
                        label: "报名名称",
                        rules: [{ required: true, message: '请输入报名名称' }]
                    },
                    React.createElement(Input, { placeholder: "请输入报名名称" })
                ),
                
                React.createElement(Form.Item,
                    {
                        name: "imageUrl",
                        label: "宣传图",
                        rules: [{ required: true, message: '请上传宣传图' }]
                    },
                    React.createElement(Dragger, uploadProps,
                        React.createElement('p', { className: "ant-upload-drag-icon" },
                            React.createElement('i', { className: "fa fa-picture-o" })
                        ),
                        React.createElement('p', { className: "ant-upload-text" }, "点击或拖拽文件到此区域上传"),
                        React.createElement('p', { className: "ant-upload-hint" },
                            "支持 JPG、JPEG、PNG、GIF 格式，文件大小不超过 2MB"
                        )
                    )
                ),
                
                React.createElement(Form.Item,
                    {
                        name: "link",
                        label: "报名链接",
                        rules: [
                            { required: true, message: '请输入报名链接' },
                            { type: 'url', message: '请输入有效的URL地址' }
                        ]
                    },
                    React.createElement(Input, { placeholder: "请输入第三方平台报名链接" })
                ),
                
                React.createElement(Form.Item,
                    {
                        name: "isEnabled",
                        label: "是否开启报名",
                        valuePropName: "checked"
                    },
                    React.createElement(Switch, { checkedChildren: "开启", unCheckedChildren: "关闭" })
                )
            )
        )
    );
};

// 安全注册组件
if (typeof window !== 'undefined') {
    // 确保App和pages对象存在
    if (!window.App) window.App = {};
    if (!window.App.pages) window.App.pages = {};
    
    // 注册组件到window.App.pages对象中
    window.App.pages.ExhibitionRegistrationManagement = ExhibitionRegistrationManagement;
    window.App.pages['exhibition-registration'] = ExhibitionRegistrationManagement;
    window.App.pages['exhibition_registration'] = ExhibitionRegistrationManagement;
    window.App.pages['展会报名管理'] = ExhibitionRegistrationManagement;
}

// 安全导出模块
try {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ExhibitionRegistrationManagement;
    }
} catch (e) {
    console.warn('Error exporting module:', e);
}
