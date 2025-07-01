// 管理员与权限管理页面
const AdminManagement = () => {
    const { Card, Table, Button, Input, Select, Space, Tag, Modal, Form, Switch, message, Row, Col, Tabs, Tree, Drawer } = antd;
    const { Search } = Input;
    const { Option } = Select;
    const { TabPane } = Tabs;

    const [loading, setLoading] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState('admins');
    
    // 管理员相关状态
    const [adminList, setAdminList] = React.useState([]);
    const [adminModalVisible, setAdminModalVisible] = React.useState(false);
    const [currentAdmin, setCurrentAdmin] = React.useState(null);
    
    // 角色相关状态
    const [roleList, setRoleList] = React.useState([]);
    const [roleModalVisible, setRoleModalVisible] = React.useState(false);
    const [currentRole, setCurrentRole] = React.useState(null);
    const [permissionDrawerVisible, setPermissionDrawerVisible] = React.useState(false);
    
    const [form] = Form.useForm();
    const [roleForm] = Form.useForm();

    // 模拟数据
    const mockAdminData = [
        {
            id: 1,
            username: 'admin',
            realName: '系统管理员',
            email: 'admin@rmcg.com',
            phone: '13800138000',
            role: 'super-admin',
            roleName: '超级管理员',
            status: 'active',
            lastLoginTime: '2024-01-15 14:30:00',
            lastLoginIp: '192.168.1.100',
            createTime: '2023-12-01 09:00:00'
        },
        {
            id: 2,
            username: 'content-admin',
            realName: '内容管理员',
            email: 'content@rmcg.com',
            phone: '13800138001',
            role: 'content-admin',
            roleName: '内容管理员',
            status: 'active',
            lastLoginTime: '2024-01-15 11:20:00',
            lastLoginIp: '192.168.1.101',
            createTime: '2024-01-02 10:30:00'
        },
        {
            id: 3,
            username: 'audit-admin',
            realName: '审核管理员',
            email: 'audit@rmcg.com',
            phone: '13800138002',
            role: 'audit-admin',
            roleName: '审核管理员',
            status: 'active',
            lastLoginTime: '2024-01-15 09:45:00',
            lastLoginIp: '192.168.1.102',
            createTime: '2024-01-05 15:20:00'
        }
    ];

    const mockRoleData = [
        {
            id: 'super-admin',
            name: '超级管理员',
            description: '拥有系统所有权限',
            permissions: ['*'],
            status: 'active',
            adminCount: 1,
            createTime: '2023-12-01 09:00:00'
        },
        {
            id: 'content-admin',
            name: '内容管理员',
            description: '负责内容管理相关功能',
            permissions: ['content:*', 'user:view', 'stats:view'],
            status: 'active',
            adminCount: 2,
            createTime: '2024-01-02 10:00:00'
        },
        {
            id: 'audit-admin',
            name: '审核管理员',
            description: '负责内容审核相关功能',
            permissions: ['audit:*', 'content:view', 'user:view'],
            status: 'active',
            adminCount: 1,
            createTime: '2024-01-05 11:00:00'
        }
    ];

    React.useEffect(() => {
        if (activeTab === 'admins') {
            loadAdminList();
        } else if (activeTab === 'roles') {
            loadRoleList();
        }
    }, [activeTab]);

    const loadAdminList = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setAdminList(mockAdminData);
        } catch (error) {
            message.error('加载管理员列表失败');
        } finally {
            setLoading(false);
        }
    };

    const loadRoleList = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setRoleList(mockRoleData);
        } catch (error) {
            message.error('加载角色列表失败');
        } finally {
            setLoading(false);
        }
    };

    const getStatusTag = (status) => {
        return status === 'active' 
            ? React.createElement(Tag, { color: 'green' }, '启用')
            : React.createElement(Tag, { color: 'red' }, '禁用');
    };

    const getRoleTag = (roleName) => {
        const colorMap = {
            '超级管理员': 'red',
            '内容管理员': 'blue',
            '审核管理员': 'orange',
            '数据管理员': 'green'
        };
        return React.createElement(Tag, { 
            color: colorMap[roleName] || 'default' 
        }, roleName);
    };

    // 管理员表格列定义
    const adminColumns = [
        {
            title: '管理员信息',
            key: 'info',
            width: 200,
            render: (_, record) => React.createElement('div', {}, [
                React.createElement('div', {
                    key: 'name',
                    style: { fontWeight: 'bold', marginBottom: 4 }
                }, record.realName),
                React.createElement('div', {
                    key: 'username',
                    style: { fontSize: 12, color: '#666' }
                }, `@${record.username}`)
            ])
        },
        {
            title: '联系方式',
            key: 'contact',
            width: 200,
            render: (_, record) => React.createElement('div', {}, [
                React.createElement('div', { key: 'email' }, record.email),
                React.createElement('div', {
                    key: 'phone',
                    style: { fontSize: 12, color: '#666' }
                }, record.phone)
            ])
        },
        {
            title: '角色',
            key: 'role',
            width: 120,
            render: (_, record) => getRoleTag(record.roleName)
        },
        {
            title: '状态',
            key: 'status',
            width: 80,
            render: (_, record) => getStatusTag(record.status)
        },
        {
            title: '最后登录',
            key: 'lastLogin',
            width: 180,
            render: (_, record) => React.createElement('div', {}, [
                React.createElement('div', { key: 'time' }, record.lastLoginTime),
                React.createElement('div', {
                    key: 'ip',
                    style: { fontSize: 12, color: '#666' }
                }, record.lastLoginIp)
            ])
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            width: 150,
            sorter: true
        },
        {
            title: '操作',
            key: 'actions',
            width: 200,
            render: (_, record) => React.createElement(Space, {}, [
                React.createElement(Button, {
                    key: 'edit',
                    type: 'link',
                    size: 'small'
                }, '编辑'),
                React.createElement(Button, {
                    key: 'toggle',
                    type: 'link',
                    size: 'small'
                }, record.status === 'active' ? '禁用' : '启用'),
                record.role !== 'super-admin' && React.createElement(Button, {
                    key: 'delete',
                    type: 'link',
                    size: 'small',
                    danger: true
                }, '删除')
            ])
        }
    ];

    // 角色表格列定义
    const roleColumns = [
        {
            title: '角色信息',
            key: 'info',
            width: 200,
            render: (_, record) => React.createElement('div', {}, [
                React.createElement('div', {
                    key: 'name',
                    style: { fontWeight: 'bold', marginBottom: 4 }
                }, record.name),
                React.createElement('div', {
                    key: 'desc',
                    style: { fontSize: 12, color: '#666' }
                }, record.description)
            ])
        },
        {
            title: '权限数量',
            key: 'permCount',
            width: 100,
            render: (_, record) => record.permissions.includes('*') ? '全部权限' : `${record.permissions.length} 项权限`
        },
        {
            title: '管理员数量',
            dataIndex: 'adminCount',
            width: 120,
            render: (count) => `${count} 人`
        },
        {
            title: '状态',
            key: 'status',
            width: 80,
            render: (_, record) => getStatusTag(record.status)
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            width: 150,
            sorter: true
        },
        {
            title: '操作',
            key: 'actions',
            width: 200,
            render: (_, record) => React.createElement(Space, {}, [
                React.createElement(Button, {
                    key: 'edit',
                    type: 'link',
                    size: 'small'
                }, '编辑'),
                React.createElement(Button, {
                    key: 'permissions',
                    type: 'link',
                    size: 'small'
                }, '配置权限'),
                record.id !== 'super-admin' && React.createElement(Button, {
                    key: 'delete',
                    type: 'link',
                    size: 'small',
                    danger: true
                }, '删除')
            ])
        }
    ];

    return React.createElement('div', { className: 'page-fade-in' }, [
        React.createElement('div', { key: 'header', className: 'page-header' }, [
            React.createElement('h1', { key: 'title', className: 'page-title' }, '管理员与权限管理'),
            React.createElement('p', { key: 'desc', className: 'page-description' }, 
                '管理后台管理员账号、角色权限配置，支持精细化权限控制'
            )
        ]),

        React.createElement(Card, { key: 'main-card' },
            React.createElement(Tabs, {
                activeKey: activeTab,
                onChange: setActiveTab
            }, [
                React.createElement(TabPane, {
                    key: 'admins',
                    tab: '管理员管理'
                }, [
                    React.createElement('div', {
                        key: 'header',
                        style: { 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: 16 
                        }
                    }, [
                        React.createElement('h3', { key: 'title' }, '管理员列表'),
                        React.createElement(Space, { key: 'actions' }, [
                            React.createElement(Button, {
                                key: 'refresh',
                                onClick: loadAdminList
                            }, '刷新'),
                            React.createElement(Button, {
                                key: 'create',
                                type: 'primary'
                            }, '新建管理员')
                        ])
                    ]),

                    React.createElement(Table, {
                        key: 'table',
                        columns: adminColumns,
                        dataSource: adminList,
                        loading: loading,
                        pagination: {
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total) => `共 ${total} 条记录`
                        },
                        rowKey: 'id'
                    })
                ]),

                React.createElement(TabPane, {
                    key: 'roles',
                    tab: '角色管理'
                }, [
                    React.createElement('div', {
                        key: 'header',
                        style: { 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: 16 
                        }
                    }, [
                        React.createElement('h3', { key: 'title' }, '角色列表'),
                        React.createElement(Space, { key: 'actions' }, [
                            React.createElement(Button, {
                                key: 'refresh',
                                onClick: loadRoleList
                            }, '刷新'),
                            React.createElement(Button, {
                                key: 'create',
                                type: 'primary'
                            }, '新建角色')
                        ])
                    ]),

                    React.createElement(Table, {
                        key: 'table',
                        columns: roleColumns,
                        dataSource: roleList,
                        loading: loading,
                        pagination: {
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total) => `共 ${total} 条记录`
                        },
                        rowKey: 'id'
                    })
                ])
            ])
        )
    ]);
};

window.AdminManagement = AdminManagement; 