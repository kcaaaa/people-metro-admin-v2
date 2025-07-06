// 参展公司管理页面 - 展会参展公司信息管理
const ExhibitorManagement = () => {
    // 从全局antd对象中获取组件
    const { Row, Col, Card, Button, Space, Tag, Table, Modal, Form, Input, Select, message } = window.antd;
    const { Option } = Select;
    const [form] = Form.useForm();
    
    // 状态管理
    const [loading, setLoading] = React.useState(true);
    const [companies, setCompanies] = React.useState([]);
    const [searchText, setSearchText] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [editingCompany, setEditingCompany] = React.useState(null);
    
    // 获取展商数据
    React.useEffect(() => {
        loadCompanyData();
    }, []);

    // 加载展商数据
    const loadCompanyData = () => {
        setLoading(true);
        // 模拟从API获取数据
        const mockData = [
            { id: 'BJ001', name: '北京地铁集团', contactPerson: '张经理', phone: '13800138001', email: 'zhang@bjmetro.com', status: '正常' },
            { id: 'SH001', name: '上海申通地铁', contactPerson: '李经理', phone: '13800138002', email: 'li@shtmetro.com', status: '正常' },
            { id: 'GZ001', name: '广州地铁集团', contactPerson: '王经理', phone: '13800138003', email: 'wang@gzmetro.com', status: '正常' }
        ];
        setTimeout(() => {
            setCompanies(mockData);
            setLoading(false);
        }, 500);
    };

    // 表格列定义
    const columns = [
        {
            title: '展商信息',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => React.createElement(Space, { direction: "vertical", size: "small" },
                React.createElement('span', { style: { fontWeight: 'bold' } }, text),
                React.createElement('span', { style: { fontSize: '12px', color: '#666' } }, `ID: ${record.id}`)
            )
        },
        {
            title: '联系方式',
            key: 'contact',
            render: (_, record) => React.createElement(Space, { direction: "vertical", size: "small" },
                React.createElement('span', null, record.contactPerson),
                React.createElement('span', null, record.phone),
                React.createElement('span', null, record.email)
            )
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => React.createElement(Tag, { color: status === '正常' ? 'green' : 'red' }, status)
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => React.createElement(Space, { size: "middle" },
                React.createElement(Button, { type: "link", onClick: () => handleEdit(record) }, '编辑'),
                React.createElement(Button, { type: "link", danger: true, onClick: () => handleDelete(record) }, '删除')
            )
        }
    ];

    const showModal = () => {
        setEditingCompany(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingCompany(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除展商 "${record.name}" 吗？此操作不可逆。`,
            okText: '确认删除',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                setCompanies(prev => prev.filter(item => item.id !== record.id));
                message.success('删除成功');
            }
        });
    };

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                if (editingCompany) {
                    // 编辑逻辑
                    setCompanies(companies.map(c => c.id === editingCompany.id ? { ...c, ...values } : c));
                    message.success('展商信息更新成功');
                } else {
                    // 新增逻辑
                    const newCompany = { ...values, id: `NEW${Date.now()}` };
                    setCompanies([newCompany, ...companies]);
                    message.success('新展商添加成功');
                }
                setIsModalVisible(false);
                form.resetFields();
            })
            .catch(info => {
                console.log('表单验证失败:', info);
            });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // 过滤数据
    const filteredData = React.useMemo(() => {
        return companies.filter(item => {
            const matchSearch = !searchText || 
                item.name.toLowerCase().includes(searchText.toLowerCase()) ||
                item.id.toLowerCase().includes(searchText.toLowerCase()) ||
                item.contactPerson.toLowerCase().includes(searchText.toLowerCase());
            
            const matchStatus = statusFilter === 'all' || item.status === statusFilter;
            
            return matchSearch && matchStatus;
        });
    }, [companies, searchText, statusFilter]);

    const modalTitle = editingCompany ? '编辑展商信息' : '新增展商';

    return React.createElement('div', { style: { padding: '24px' } },
        React.createElement(Card, null,
            React.createElement(Row, { gutter: [16, 16], style: { marginBottom: 16 } },
                React.createElement(Col, { span: 24 },
                    React.createElement(Space, {},
                        React.createElement(Input.Search, {
                            placeholder: "搜索展商名称/ID/联系人",
                            onSearch: setSearchText,
                            style: { width: 240 },
                            allowClear: true
                        }),
                        React.createElement(Select, {
                            defaultValue: "all",
                            style: { width: 120 },
                            onChange: setStatusFilter
                        },
                            React.createElement(Option, { value: "all" }, '全部状态'),
                            React.createElement(Option, { value: "正常" }, '正常'),
                            React.createElement(Option, { value: "异常" }, '异常')
                        ),
                        React.createElement(Button, { type: "primary", onClick: showModal }, '新增展商')
                    )
                )
            ),
            React.createElement(Table, {
                columns: columns,
                dataSource: filteredData,
                rowKey: "id",
                loading: loading,
                pagination: {
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `共 ${total} 条记录，当前显示 ${range[0]}-${range[1]}`
                }
            })
        ),
        React.createElement(Modal, {
            title: modalTitle,
            visible: isModalVisible,
            onOk: handleOk,
            onCancel: handleCancel,
            destroyOnClose: true,
            okText: "确认",
            cancelText: "取消"
        }, React.createElement(Form, { form: form, layout: "vertical", name: "company_form" },
            React.createElement(Form.Item, { name: "name", label: "展商名称", rules: [{ required: true, message: '请输入展商名称' }] },
                React.createElement(Input, { placeholder: "请输入公司全称" })
            ),
            React.createElement(Form.Item, { name: "contactPerson", label: "联系人", rules: [{ required: true, message: '请输入联系人姓名' }] },
                React.createElement(Input, { placeholder: "请输入主要联系人姓名" })
            ),
            React.createElement(Form.Item, { name: "phone", label: "联系电话", rules: [{ required: true, message: '请输入联系电话' }, { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }] },
                React.createElement(Input, { placeholder: "请输入联系人手机号" })
            ),
            React.createElement(Form.Item, { name: "email", label: "电子邮箱", rules: [{ type: 'email', message: '请输入有效的邮箱地址' }] },
                React.createElement(Input, { placeholder: "请输入联系人电子邮箱" })
            ),
            React.createElement(Form.Item, { name: "status", label: "状态", initialValue: "正常", rules: [{ required: true }] },
                React.createElement(Select, {},
                    React.createElement(Option, { value: "正常" }, '正常'),
                    React.createElement(Option, { value: "异常" }, '异常')
                )
            )
        ))
    );
};

// 将组件挂载到正确的命名空间
window.App = window.App || {};
window.App.pages = window.App.pages || {};
window.App.pages.ExhibitorManagement = ExhibitorManagement;
console.log('[ExhibitorManagement] 组件挂载成功'); 