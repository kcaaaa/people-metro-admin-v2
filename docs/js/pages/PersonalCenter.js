// 个人中心页面 - RuoYi风格
const PersonalCenter = () => {
    const { Card, Form, Input, Button, Upload, Avatar, Tabs, Table, Descriptions, Alert, Row, Col, message, Modal, Divider, Tag, Timeline, Badge } = antd;
    const { TabPane } = Tabs;
    const { TextArea } = Input;
    const { Password } = Input;

    // 状态管理
    const [loading, setLoading] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState('userinfo');
    const [avatarUrl, setAvatarUrl] = React.useState('');
    const [userInfo, setUserInfo] = React.useState({});
    const [loginLogs, setLoginLogs] = React.useState([]);
    const [operationLogs, setOperationLogs] = React.useState([]);
    
    // 表单实例
    const [userForm] = Form.useForm();
    const [passwordForm] = Form.useForm();

    // 模拟用户数据
    const mockUserInfo = {
        userId: 1,
        userName: 'admin',
        nickName: '系统管理员',
        email: 'admin@example.com',
        phonenumber: '15888888888',
        sex: '1', // 0女 1男 2未知
        avatar: '',
        remark: '管理员',
        loginIp: '127.0.0.1',
        loginDate: '2024-01-20 09:30:00',
        createTime: '2023-06-01 10:00:00',
        dept: {
            deptName: '研发部门',
            leader: '若依'
        },
        roles: [
            { roleId: 1, roleName: '超级管理员', roleKey: 'admin' },
            { roleId: 2, roleName: '普通角色', roleKey: 'common' }
        ],
        posts: [
            { postId: 1, postName: '董事长', postCode: 'ceo' },
            { postId: 2, postName: '项目经理', postCode: 'se' }
        ]
    };

    // 模拟登录日志
    const mockLoginLogs = [
        {
            infoId: 1,
            userName: 'admin',
            ipaddr: '127.0.0.1',
            loginLocation: '内网IP',
            browser: 'Chrome 120',
            os: 'Windows 10',
            status: '0',
            msg: '登录成功',
            loginTime: '2024-01-20 09:30:00'
        },
        {
            infoId: 2,
            userName: 'admin',
            ipaddr: '192.168.1.100',
            loginLocation: '局域网',
            browser: 'Firefox 115',
            os: 'Windows 10',
            status: '0',
            msg: '登录成功',
            loginTime: '2024-01-19 08:45:00'
        },
        {
            infoId: 3,
            userName: 'admin',
            ipaddr: '10.0.0.1',
            loginLocation: '本地',
            browser: 'Edge 120',
            os: 'Windows 11',
            status: '1',
            msg: '密码错误',
            loginTime: '2024-01-18 14:20:00'
        }
    ];

    // 模拟操作日志
    const mockOperationLogs = [
        {
            operId: 1,
            title: '用户管理',
            businessType: '新增',
            method: 'POST /system/user',
            requestMethod: 'POST',
            operName: 'admin',
            operIp: '127.0.0.1',
            operLocation: '内网IP',
            operParam: '{"userName":"test","nickName":"测试用户"}',
            jsonResult: '{"code":200,"msg":"操作成功"}',
            status: 0,
            operTime: '2024-01-20 10:15:00'
        },
        {
            operId: 2,
            title: '内容管理',
            businessType: '修改',
            method: 'PUT /content/update',
            requestMethod: 'PUT',
            operName: 'admin',
            operIp: '127.0.0.1',
            operLocation: '内网IP',
            operParam: '{"contentId":1,"title":"更新标题"}',
            jsonResult: '{"code":200,"msg":"操作成功"}',
            status: 0,
            operTime: '2024-01-20 09:45:00'
        },
        {
            operId: 3,
            title: '标签管理',
            businessType: '删除',
            method: 'DELETE /tag/delete',
            requestMethod: 'DELETE',
            operName: 'admin',
            operIp: '127.0.0.1',
            operLocation: '内网IP',
            operParam: '{"tagIds":[1,2,3]}',
            jsonResult: '{"code":200,"msg":"操作成功"}',
            status: 0,
            operTime: '2024-01-19 16:30:00'
        }
    ];

    React.useEffect(() => {
        loadUserInfo();
        loadLoginLogs();
        loadOperationLogs();
    }, []);

    const loadUserInfo = async () => {
        try {
            setLoading(true);
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 500));
            setUserInfo(mockUserInfo);
            userForm.setFieldsValue(mockUserInfo);
        } catch (error) {
            message.error('加载用户信息失败');
        } finally {
            setLoading(false);
        }
    };

    const loadLoginLogs = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            setLoginLogs(mockLoginLogs);
        } catch (error) {
            console.error('加载登录日志失败:', error);
        }
    };

    const loadOperationLogs = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            setOperationLogs(mockOperationLogs);
        } catch (error) {
            console.error('加载操作日志失败:', error);
        }
    };

    // 更新用户信息
    const handleUserInfoSubmit = async (values) => {
        try {
            setLoading(true);
            console.log('更新用户信息:', values);
            
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            message.success('用户信息更新成功！');
            setUserInfo({ ...userInfo, ...values });
        } catch (error) {
            message.error('更新失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    // 修改密码
    const handlePasswordSubmit = async (values) => {
        try {
            setLoading(true);
            console.log('修改密码');
            
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            message.success('密码修改成功！');
            passwordForm.resetFields();
        } catch (error) {
            message.error('密码修改失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    // 头像上传
    const handleAvatarChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // 模拟获取图片URL
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setAvatarUrl(reader.result);
                setUserInfo({ ...userInfo, avatar: reader.result });
                message.success('头像上传成功！');
            });
            reader.readAsDataURL(info.file.originFileObj);
            setLoading(false);
        }
        if (info.file.status === 'error') {
            message.error('头像上传失败！');
            setLoading(false);
        }
    };

    // 头像上传前检查
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只能上传 JPG/PNG 格式的图片!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片大小不能超过 2MB!');
            return false;
        }
        return false; // 阻止自动上传，手动处理
    };

    // 渲染基本信息标签页
    const renderUserInfo = () => {
        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'tip',
                message: '个人信息设置',
                description: '完善您的个人信息，有助于其他用户了解您的基本情况',
                type: 'info',
                showIcon: true,
                style: { marginBottom: 24 }
            }),
            
            React.createElement(Row, { key: 'content', gutter: 24 }, [
                React.createElement(Col, { key: 'form', span: 14 },
                    React.createElement(Card, { title: '基本信息' },
                        React.createElement(Form, {
                            form: userForm,
                            layout: 'vertical',
                            onFinish: handleUserInfoSubmit,
                            initialValues: userInfo
                        }, [
                            React.createElement(Row, { key: 'row1', gutter: 16 }, [
                                React.createElement(Col, { key: 'username', span: 12 },
                                    React.createElement(Form.Item, {
                                        label: '用户名称',
                                        name: 'userName'
                                    }, React.createElement(Input, {
                                        disabled: true,
                                        placeholder: '用户名称'
                                    }))
                                ),
                                React.createElement(Col, { key: 'nickname', span: 12 },
                                    React.createElement(Form.Item, {
                                        label: '用户昵称',
                                        name: 'nickName',
                                        rules: [{ required: true, message: '请输入用户昵称' }]
                                    }, React.createElement(Input, {
                                        placeholder: '请输入用户昵称'
                                    }))
                                )
                            ]),
                            
                            React.createElement(Row, { key: 'row2', gutter: 16 }, [
                                React.createElement(Col, { key: 'email', span: 12 },
                                    React.createElement(Form.Item, {
                                        label: '邮箱',
                                        name: 'email',
                                        rules: [
                                            { required: true, message: '请输入邮箱地址' },
                                            { type: 'email', message: '邮箱格式不正确' }
                                        ]
                                    }, React.createElement(Input, {
                                        placeholder: '请输入邮箱地址'
                                    }))
                                ),
                                React.createElement(Col, { key: 'phone', span: 12 },
                                    React.createElement(Form.Item, {
                                        label: '手机号码',
                                        name: 'phonenumber',
                                        rules: [
                                            { required: true, message: '请输入手机号码' },
                                            { pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, message: '手机号码格式不正确' }
                                        ]
                                    }, React.createElement(Input, {
                                        placeholder: '请输入手机号码'
                                    }))
                                )
                            ]),
                            
                            React.createElement(Form.Item, {
                                key: 'sex',
                                label: '性别',
                                name: 'sex'
                            }, React.createElement('div', {},
                                ['男', '女', '未知'].map((label, index) =>
                                    React.createElement('label', {
                                        key: index,
                                        style: { marginRight: 16 }
                                    }, [
                                        React.createElement('input', {
                                            key: 'input',
                                            type: 'radio',
                                            name: 'sex',
                                            value: index.toString(),
                                            defaultChecked: userInfo.sex === index.toString(),
                                            style: { marginRight: 4 }
                                        }),
                                        label
                                    ])
                                )
                            )),
                            
                            React.createElement(Form.Item, {
                                key: 'remark',
                                label: '个人简介',
                                name: 'remark'
                            }, React.createElement(TextArea, {
                                rows: 4,
                                placeholder: '请输入个人简介',
                                maxLength: 200,
                                showCount: true
                            })),

                            React.createElement(Form.Item, { key: 'submit' },
                                React.createElement(Button, {
                                    type: 'primary',
                                    htmlType: 'submit',
                                    loading: loading
                                }, '保存修改')
                            )
                        ])
                    )
                ),
                
                React.createElement(Col, { key: 'avatar', span: 10 },
                    React.createElement(Card, { title: '头像设置' }, [
                        React.createElement('div', {
                            key: 'avatar-container',
                            style: { textAlign: 'center', padding: '20px 0' }
                        }, [
                            React.createElement(Avatar, {
                                key: 'avatar',
                                size: 120,
                                src: avatarUrl || userInfo.avatar || undefined,
                                style: { 
                                    marginBottom: 16,
                                    border: '3px solid #f0f0f0'
                                }
                            }, !avatarUrl && !userInfo.avatar && userInfo.nickName?.charAt(0)),
                            
                            React.createElement('div', {
                                key: 'upload',
                                style: { marginBottom: 16 }
                            }, React.createElement(Upload, {
                                name: 'avatar',
                                listType: 'picture',
                                showUploadList: false,
                                beforeUpload: beforeUpload,
                                onChange: handleAvatarChange,
                                customRequest: ({ onSuccess }) => {
                                    setTimeout(() => {
                                        onSuccess("ok");
                                    }, 0);
                                }
                            }, React.createElement(Button, {
                                loading: loading
                            }, '上传头像'))),
                            
                            React.createElement('div', {
                                key: 'tips',
                                style: { 
                                    fontSize: 12, 
                                    color: '#999',
                                    lineHeight: 1.5
                                }
                            }, [
                                React.createElement('div', { key: 'tip1' }, '• 支持JPG、PNG格式'),
                                React.createElement('div', { key: 'tip2' }, '• 文件大小不超过2MB'),
                                React.createElement('div', { key: 'tip3' }, '• 建议尺寸120x120像素')
                            ])
                        ])
                    ])
                )
            ])
        ]);
    };

    // 渲染修改密码标签页
    const renderPasswordReset = () => {
        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'tip',
                message: '密码安全设置',
                description: '定期修改密码，确保账户安全。新密码应包含字母、数字和特殊字符',
                type: 'warning',
                showIcon: true,
                style: { marginBottom: 24 }
            }),
            
            React.createElement(Row, { key: 'content', justify: 'center' },
                React.createElement(Col, { span: 12 },
                    React.createElement(Card, { title: '修改密码' },
                        React.createElement(Form, {
                            form: passwordForm,
                            layout: 'vertical',
                            onFinish: handlePasswordSubmit
                        }, [
                            React.createElement(Form.Item, {
                                key: 'oldPassword',
                                label: '当前密码',
                                name: 'oldPassword',
                                rules: [{ required: true, message: '请输入当前密码' }]
                            }, React.createElement(Password, {
                                placeholder: '请输入当前密码'
                            })),
                            
                            React.createElement(Form.Item, {
                                key: 'newPassword',
                                label: '新密码',
                                name: 'newPassword',
                                rules: [
                                    { required: true, message: '请输入新密码' },
                                    { min: 6, message: '密码长度不能小于6位' },
                                    { pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/, message: '密码必须包含字母和数字' }
                                ]
                            }, React.createElement(Password, {
                                placeholder: '请输入新密码'
                            })),
                            
                            React.createElement(Form.Item, {
                                key: 'confirmPassword',
                                label: '确认密码',
                                name: 'confirmPassword',
                                dependencies: ['newPassword'],
                                rules: [
                                    { required: true, message: '请确认新密码' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('两次输入的密码不一致!'));
                                        },
                                    })
                                ]
                            }, React.createElement(Password, {
                                placeholder: '请确认新密码'
                            })),

                            React.createElement(Form.Item, { key: 'submit' },
                                React.createElement(Button, {
                                    type: 'primary',
                                    htmlType: 'submit',
                                    loading: loading,
                                    block: true
                                }, '确认修改')
                            )
                        ])
                    )
                )
            )
        ]);
    };

    // 渲染登录日志标签页
    const renderLoginLogs = () => {
        const columns = [
            {
                title: '访问编号',
                dataIndex: 'infoId',
                width: 100,
                render: (text) => `#${text}`
            },
            {
                title: '用户名称',
                dataIndex: 'userName',
                width: 120
            },
            {
                title: '登录地址',
                dataIndex: 'ipaddr',
                width: 130
            },
            {
                title: '登录地点',
                dataIndex: 'loginLocation',
                width: 120
            },
            {
                title: '浏览器',
                dataIndex: 'browser',
                width: 120
            },
            {
                title: '操作系统',
                dataIndex: 'os',
                width: 120
            },
            {
                title: '登录状态',
                dataIndex: 'status',
                width: 100,
                render: (status) => status === '0' 
                    ? React.createElement(Tag, { color: 'success' }, '成功')
                    : React.createElement(Tag, { color: 'error' }, '失败')
            },
            {
                title: '描述',
                dataIndex: 'msg',
                width: 120
            },
            {
                title: '访问时间',
                dataIndex: 'loginTime',
                width: 160
            }
        ];

        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'tip',
                message: '登录日志',
                description: '显示您最近的登录记录，如发现异常登录请及时修改密码',
                type: 'info',
                showIcon: true,
                style: { marginBottom: 16 }
            }),
            
            React.createElement(Card, { key: 'table' },
                React.createElement(Table, {
                    columns: columns,
                    dataSource: loginLogs,
                    rowKey: 'infoId',
                    pagination: {
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 条`
                    },
                    scroll: { x: 1200 }
                })
            )
        ]);
    };

    // 渲染操作日志标签页
    const renderOperationLogs = () => {
        const columns = [
            {
                title: '操作编号',
                dataIndex: 'operId',
                width: 100,
                render: (text) => `#${text}`
            },
            {
                title: '系统模块',
                dataIndex: 'title',
                width: 120
            },
            {
                title: '操作类型',
                dataIndex: 'businessType',
                width: 100,
                render: (type) => {
                    const colorMap = {
                        '新增': 'green',
                        '修改': 'blue',
                        '删除': 'red',
                        '查询': 'default',
                        '导出': 'orange'
                    };
                    return React.createElement(Tag, { 
                        color: colorMap[type] || 'default' 
                    }, type);
                }
            },
            {
                title: '请求方式',
                dataIndex: 'requestMethod',
                width: 100
            },
            {
                title: '操作人员',
                dataIndex: 'operName',
                width: 120
            },
            {
                title: '主机地址',
                dataIndex: 'operIp',
                width: 130
            },
            {
                title: '操作状态',
                dataIndex: 'status',
                width: 100,
                render: (status) => status === 0
                    ? React.createElement(Tag, { color: 'success' }, '正常')
                    : React.createElement(Tag, { color: 'error' }, '异常')
            },
            {
                title: '操作时间',
                dataIndex: 'operTime',
                width: 160
            },
            {
                title: '操作',
                width: 120,
                render: (_, record) => React.createElement(Button, {
                    type: 'link',
                    size: 'small',
                    onClick: () => {
                        Modal.info({
                            title: '操作详情',
                            width: 800,
                            content: React.createElement(Descriptions, {
                                column: 1,
                                bordered: true
                            }, [
                                React.createElement(Descriptions.Item, {
                                    key: 'method',
                                    label: '请求方法'
                                }, record.method),
                                React.createElement(Descriptions.Item, {
                                    key: 'param',
                                    label: '请求参数'
                                }, React.createElement('pre', {
                                    style: { 
                                        whiteSpace: 'pre-wrap',
                                        maxHeight: 200,
                                        overflow: 'auto',
                                        background: '#f5f5f5',
                                        padding: 8,
                                        fontSize: 12
                                    }
                                }, record.operParam)),
                                React.createElement(Descriptions.Item, {
                                    key: 'result',
                                    label: '返回结果'
                                }, React.createElement('pre', {
                                    style: { 
                                        whiteSpace: 'pre-wrap',
                                        maxHeight: 200,
                                        overflow: 'auto',
                                        background: '#f5f5f5',
                                        padding: 8,
                                        fontSize: 12
                                    }
                                }, record.jsonResult))
                            ])
                        });
                    }
                }, '详情')
            }
        ];

        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'tip',
                message: '操作日志',
                description: '记录您在系统中的关键操作，帮助追踪操作历史',
                type: 'info',
                showIcon: true,
                style: { marginBottom: 16 }
            }),
            
            React.createElement(Card, { key: 'table' },
                React.createElement(Table, {
                    columns: columns,
                    dataSource: operationLogs,
                    rowKey: 'operId',
                    pagination: {
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 条`
                    },
                    scroll: { x: 1400 }
                })
            )
        ]);
    };

    // 渲染账户信息标签页
    const renderAccountInfo = () => {
        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'tip',
                message: '账户信息',
                description: '查看您的账户基本信息和权限配置',
                type: 'info',
                showIcon: true,
                style: { marginBottom: 24 }
            }),
            
            React.createElement(Row, { key: 'content', gutter: 24 }, [
                React.createElement(Col, { key: 'basic', span: 12 },
                    React.createElement(Card, { title: '基本信息' },
                        React.createElement(Descriptions, {
                            column: 1,
                            labelStyle: { width: '100px' }
                        }, [
                            React.createElement(Descriptions.Item, {
                                key: 'username',
                                label: '用户名'
                            }, userInfo.userName),
                            React.createElement(Descriptions.Item, {
                                key: 'nickname',
                                label: '用户昵称'
                            }, userInfo.nickName),
                            React.createElement(Descriptions.Item, {
                                key: 'dept',
                                label: '归属部门'
                            }, userInfo.dept?.deptName),
                            React.createElement(Descriptions.Item, {
                                key: 'create',
                                label: '创建时间'
                            }, userInfo.createTime),
                            React.createElement(Descriptions.Item, {
                                key: 'login',
                                label: '最后登录'
                            }, `${userInfo.loginDate} (${userInfo.loginIp})`)
                        ])
                    )
                ),
                
                React.createElement(Col, { key: 'roles', span: 12 },
                    React.createElement(Card, { title: '角色信息' }, [
                        React.createElement('div', {
                            key: 'roles',
                            style: { marginBottom: 20 }
                        }, [
                            React.createElement('h4', {
                                key: 'title',
                                style: { marginBottom: 12 }
                            }, '角色列表'),
                            React.createElement('div', { key: 'tags' },
                                userInfo.roles?.map(role =>
                                    React.createElement(Tag, {
                                        key: role.roleId,
                                        color: role.roleKey === 'admin' ? 'red' : 'blue',
                                        style: { marginBottom: 8 }
                                    }, role.roleName)
                                )
                            )
                        ]),
                        
                        React.createElement('div', { key: 'posts' }, [
                            React.createElement('h4', {
                                key: 'title',
                                style: { marginBottom: 12 }
                            }, '岗位信息'),
                            React.createElement('div', { key: 'tags' },
                                userInfo.posts?.map(post =>
                                    React.createElement(Tag, {
                                        key: post.postId,
                                        color: 'green',
                                        style: { marginBottom: 8 }
                                    }, post.postName)
                                )
                            )
                        ])
                    ])
                )
            ])
        ]);
    };

    const tabItems = [
        {
            key: 'userinfo',
            label: React.createElement('span', {}, [
                React.createElement('span', { key: 'icon', style: { marginRight: 8 } }, '👤'),
                React.createElement('span', { key: 'text' }, '基本资料')
            ]),
            children: renderUserInfo()
        },
        {
            key: 'resetPwd',
            label: React.createElement('span', {}, [
                React.createElement('span', { key: 'icon', style: { marginRight: 8 } }, '🔒'),
                React.createElement('span', { key: 'text' }, '修改密码')
            ]),
            children: renderPasswordReset()
        },
        {
            key: 'accountInfo',
            label: React.createElement('span', {}, [
                React.createElement('span', { key: 'icon', style: { marginRight: 8 } }, 'ℹ️'),
                React.createElement('span', { key: 'text' }, '账户信息')
            ]),
            children: renderAccountInfo()
        },
        {
            key: 'loginLog',
            label: React.createElement('span', {}, [
                React.createElement('span', { key: 'icon', style: { marginRight: 8 } }, '📋'),
                React.createElement('span', { key: 'text' }, '登录日志')
            ]),
            children: renderLoginLogs()
        },
        {
            key: 'operLog',
            label: React.createElement('span', {}, [
                React.createElement('span', { key: 'icon', style: { marginRight: 8 } }, '📝'),
                React.createElement('span', { key: 'text' }, '操作日志')
            ]),
            children: renderOperationLogs()
        }
    ];

    return React.createElement('div', { className: 'page-fade-in' }, [
        React.createElement('div', { key: 'header', className: 'page-header' }, [
            React.createElement('h1', { key: 'title', className: 'page-title' }, '个人中心'),
            React.createElement('p', { key: 'desc', className: 'page-description' }, 
                '管理您的个人信息、安全设置和查看操作记录'
            )
        ]),

        React.createElement(Card, { key: 'main-card' },
            React.createElement(Tabs, {
                activeKey: activeTab,
                onChange: setActiveTab,
                items: tabItems,
                tabPosition: 'left',
                style: { minHeight: 500 }
            })
        )
    ]);
};

window.PersonalCenter = PersonalCenter; 