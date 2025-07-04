// 展商维护页面
const ExhibitorMaintenance = () => {
    console.log('ExhibitorMaintenance component is rendering...');
    
    const { Table, Card, Button, Space, Modal, Form, Input, message, Alert, Tag } = antd;
    const [loading, setLoading] = React.useState(false);
    const [exhibitorModalVisible, setExhibitorModalVisible] = React.useState(false);
    const [editingExhibitor, setEditingExhibitor] = React.useState(null);
    const [exhibitorForm] = Form.useForm();
    
    // 模拟数据
    const [exhibitors, setExhibitors] = React.useState([
        { id: 'ex_001', name: '北京地铁集团', contact: '张经理', phone: '13800138001', email: 'zhang@bjmetro.com', status: 'active' },
        { id: 'ex_002', name: '上海申通地铁', contact: '李经理', phone: '13800138002', email: 'li@shtmetro.com', status: 'active' },
        { id: 'ex_003', name: '广州地铁集团', contact: '王经理', phone: '13800138003', email: 'wang@gzmetro.com', status: 'active' }
    ]);

    // 表格列配置
    const columns = [
        {
            title: '展商信息',
            dataIndex: 'name',
            width: 300,
            render: (text, record) => React.createElement('div', {}, [
                React.createElement('div', {
                    key: 'name',
                    style: { fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }
                }, text),
                React.createElement('div', {
                    key: 'contact',
                    style: { color: '#666', fontSize: '12px' }
                }, `联系人：${record.contact}`)
            ])
        },
        {
            title: '联系方式',
            dataIndex: 'contact',
            width: 250,
            render: (_, record) => React.createElement('div', {}, [
                React.createElement('div', {
                    key: 'phone',
                    style: { marginBottom: '4px' }
                }, `电话：${record.phone}`),
                React.createElement('div', {
                    key: 'email',
                    style: { color: '#1890ff' }
                }, `邮箱：${record.email}`)
            ])
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: 100,
            render: (status) => React.createElement(Tag, {
                color: status === 'active' ? 'green' : 'orange'
            }, status === 'active' ? '正常' : '禁用')
        },
        {
            title: '操作',
            width: 150,
            render: (_, record) => React.createElement(Space, { size: 'small' }, [
                React.createElement(Button, {
                    key: 'edit',
                    size: 'small',
                    onClick: () => handleEdit(record)
                }, '编辑'),
                React.createElement(Button, {
                    key: 'delete',
                    size: 'small',
                    danger: true,
                    onClick: () => handleDelete(record)
                }, '删除')
            ])
        }
    ];

    // 处理编辑
    const handleEdit = (exhibitor) => {
        setEditingExhibitor(exhibitor);
        exhibitorForm.setFieldsValue(exhibitor);
        setExhibitorModalVisible(true);
    };

    // 处理删除
    const handleDelete = (exhibitor) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除展商"${exhibitor.name}"吗？此操作不可恢复。`,
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                const newExhibitors = exhibitors.filter(ex => ex.id !== exhibitor.id);
                setExhibitors(newExhibitors);
                message.success('展商删除成功');
            }
        });
    };

    // 处理保存
    const handleSave = async (values) => {
        try {
            const newExhibitor = {
                ...values,
                id: editingExhibitor ? editingExhibitor.id : `ex_${Date.now()}`,
                status: 'active'
            };

            if (editingExhibitor) {
                // 编辑
                setExhibitors(prev => prev.map(ex => 
                    ex.id === editingExhibitor.id ? newExhibitor : ex
                ));
                message.success('展商信息更新成功');
            } else {
                // 新建
                setExhibitors(prev => [...prev, newExhibitor]);
                message.success('展商创建成功');
            }

            setExhibitorModalVisible(false);
            setEditingExhibitor(null);
            exhibitorForm.resetFields();
        } catch (error) {
            message.error('操作失败，请重试');
        }
    };

    return React.createElement('div', { className: 'exhibitor-maintenance-page' }, [
        React.createElement('div', {
            key: 'header',
            style: {
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }
        }, [
            React.createElement('h2', {
                key: 'title',
                style: { margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }
            }, '🏢 展商维护'),
            React.createElement(Space, {
                key: 'actions'
            }, [
                React.createElement(Button, {
                    key: 'refresh',
                    onClick: () => setLoading(true)
                }, '刷新'),
                React.createElement(Button, {
                    key: 'help',
                    type: 'default',
                    onClick: () => message.info('展商维护帮助文档')
                }, '使用帮助')
            ])
        ]),

        React.createElement(Alert, {
            key: 'info',
            message: '展商维护',
            description: '管理展会展商信息，包括展商基本信息、联系方式等',
            type: 'info',
            showIcon: true,
            style: { marginBottom: '24px' }
        }),

        React.createElement(Card, {
            key: 'exhibitor-table',
            title: '展商列表',
            extra: React.createElement(Button, {
                type: 'primary',
                onClick: () => {
                    setEditingExhibitor(null);
                    exhibitorForm.resetFields();
                    setExhibitorModalVisible(true);
                }
            }, '新建展商')
        }, React.createElement(Table, {
            dataSource: exhibitors.map((item, index) => ({ ...item, key: index })),
            columns: columns,
            pagination: false,
            size: 'small',
            loading: loading
        })),

        exhibitorModalVisible && React.createElement(Modal, {
            key: 'exhibitor-modal',
            title: editingExhibitor ? '编辑展商' : '新建展商',
            visible: exhibitorModalVisible,
            onCancel: () => {
                setExhibitorModalVisible(false);
                setEditingExhibitor(null);
                exhibitorForm.resetFields();
            },
            footer: null,
            destroyOnClose: true,
            width: 500
        }, React.createElement(Form, {
            form: exhibitorForm,
            layout: 'vertical',
            onFinish: handleSave
        }, [
            React.createElement(Form.Item, {
                key: 'name',
                label: '展商名称',
                name: 'name',
                rules: [{ required: true, message: '请输入展商名称' }]
            }, React.createElement(Input, { placeholder: '请输入展商名称' })),
            React.createElement(Form.Item, {
                key: 'contact',
                label: '联系人',
                name: 'contact',
                rules: [{ required: true, message: '请输入联系人' }]
            }, React.createElement(Input, { placeholder: '请输入联系人姓名' })),
            React.createElement(Form.Item, {
                key: 'phone',
                label: '联系电话',
                name: 'phone',
                rules: [{ required: true, message: '请输入联系电话' }]
            }, React.createElement(Input, { placeholder: '请输入联系电话' })),
            React.createElement(Form.Item, {
                key: 'email',
                label: '电子邮箱',
                name: 'email',
                rules: [
                    { required: true, message: '请输入电子邮箱' },
                    { type: 'email', message: '请输入有效的电子邮箱' }
                ]
            }, React.createElement(Input, { placeholder: '请输入电子邮箱' })),
            React.createElement(Form.Item, {
                key: 'submit',
                style: { textAlign: 'right', marginTop: '24px' }
            }, React.createElement(Space, null, [
                React.createElement(Button, {
                    key: 'cancel',
                    onClick: () => {
                        setExhibitorModalVisible(false);
                        setEditingExhibitor(null);
                        exhibitorForm.resetFields();
                    }
                }, '取消'),
                React.createElement(Button, {
                    key: 'submit',
                    type: 'primary',
                    htmlType: 'submit',
                    loading: loading
                }, '保存')
            ]))
        ]))
    ]);
};

console.log('ExhibitorMaintenance component defined');
window.ExhibitorMaintenance = ExhibitorMaintenance;
console.log('[ExhibitorMaintenance] window.ExhibitorMaintenance 挂载成功'); 