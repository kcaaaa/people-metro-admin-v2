// 登录页面组件
const Login = ({ onLogin }) => {
    const { Card, Form, Input, Button, Tabs, Row, Col, Space, message, Typography } = antd;
    const { TabPane } = Tabs;
    const { Title, Text } = Typography;
    
    const [passwordForm] = Form.useForm();
    const [codeForm] = Form.useForm();
    const [loginType, setLoginType] = React.useState('password');
    const [loading, setLoading] = React.useState(false);
    const [sendingCode, setSendingCode] = React.useState(false);
    const [countdown, setCountdown] = React.useState(0);
    
    // 统一演示账号：手机号与 UserManagement.js 中保持一致
    const demoAccounts = [
        {
            phone: '18800000000',
            password: '123456',
            name: '超级管理员',
            role: 'super_admin',
            permissions: ['*'],
            userId: 'super_admin_demo'
        },
        {
            phone: '18800000001',
            password: '123456',
            name: '协会管理员',
            role: 'union_admin',
            permissions: ['association:*', 'content:*', 'exhibition:*', 'operation:*'],
            userId: 'union_admin_demo'
        },
        {
            phone: '18800000002',
            password: '123456',
            name: '会展管理员',
            role: 'expo_admin',
            permissions: ['exhibition:*', 'content:*', 'operation:stats:view'],
            userId: 'expo_admin_demo'
        },
        {
            phone: '18800000003',
            password: '123456',
            name: '运营管理员',
            role: 'ops_admin',
            permissions: ['content:*', 'operation:*'],
            userId: 'ops_admin_demo'
        },
        {
            phone: '18800000004',
            password: '123456',
            name: '协会普通用户',
            role: 'union_user',
            permissions: ['content:publish'],
            userId: 'union_user_demo'
        },
        {
            phone: '18800000005',
            password: '123456',
            name: '参展公司',
            role: 'exhibitor',
            permissions: ['content:publish'],
            userId: 'exhibitor_demo'
        },
        {
            phone: '18800000006',
            password: '123456',
            name: '游客',
            role: 'visitor',
            permissions: ['content:view'],
            userId: 'visitor_demo'
        }
    ];
 
    // 演示账号快捷按钮，自动填写手机号 + 默认密码
    const demoAccountButtons = demoAccounts.map(acc => ({ phone: acc.phone, label: acc.name }));
    
    // 倒计时效果
    React.useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);
    
    // 发送验证码
    const handleSendCode = async () => {
        try {
            const values = await codeForm.validateFields(['phone']);
            
            // 检查手机号是否存在
            const account = demoAccounts.find(acc => acc.phone === values.phone);
            if (!account) {
                message.error('手机号不存在，请联系管理员');
                return;
            }
            
            setSendingCode(true);
            
            // 模拟发送验证码
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 模拟验证码是 123456
            message.success('验证码已发送至您的手机，验证码为：123456');
            setCountdown(60);
            
        } catch (error) {
            message.error('请先输入正确的手机号');
        } finally {
            setSendingCode(false);
        }
    };
    
    // 密码登录
    const handlePasswordLogin = async (values) => {
        setLoading(true);
        try {
            // 模拟登录验证
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const account = demoAccounts.find(acc => 
                acc.phone === values.phone && acc.password === values.password
            );
            
            if (account) {
                // 保存用户信息
                const userData = {
                    userId: account.userId,
                    username: account.phone,
                    name: account.name,
                    role: account.role,
                    permissions: account.permissions,
                    phone: account.phone,
                    loginTime: new Date().toISOString()
                };
                
                // 保存到localStorage
                localStorage.setItem('userData', JSON.stringify(userData));
                localStorage.setItem('userToken', `token_${account.userId}_${Date.now()}`);
                
                message.success(`欢迎回来，${account.name}！`);
                onLogin(userData);
            } else {
                message.error('手机号或密码错误，请重试');
            }
        } catch (error) {
            message.error('登录失败，请重试');
        } finally {
            setLoading(false);
        }
    };
    
    // 验证码登录
    const handleCodeLogin = async (values) => {
        setLoading(true);
        try {
            // 模拟登录验证
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const account = demoAccounts.find(acc => acc.phone === values.phone);
            
            if (account && values.code === '123456') {
                // 保存用户信息
                const userData = {
                    userId: account.userId,
                    username: account.phone,
                    name: account.name,
                    role: account.role,
                    permissions: account.permissions,
                    phone: account.phone,
                    loginTime: new Date().toISOString()
                };
                
                // 保存到localStorage
                localStorage.setItem('userData', JSON.stringify(userData));
                localStorage.setItem('userToken', `token_${account.userId}_${Date.now()}`);
                
                message.success(`欢迎回来，${account.name}！`);
                onLogin(userData);
            } else if (!account) {
                message.error('手机号不存在，请联系管理员');
            } else {
                message.error('验证码错误，请重试');
            }
        } catch (error) {
            message.error('登录失败，请重试');
        } finally {
            setLoading(false);
        }
    };
    
    return React.createElement('div', {
        style: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }
    }, [
        React.createElement(Card, {
            key: 'login-card',
            style: {
                width: '100%',
                maxWidth: '400px',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                border: 'none'
            }
        }, [
            // 登录标题
            React.createElement('div', {
                key: 'header',
                style: {
                    textAlign: 'center',
                    marginBottom: '32px'
                }
            }, [
                React.createElement('div', {
                    key: 'logo',
                    style: {
                        fontSize: '48px',
                        marginBottom: '16px'
                    }
                }, '🚇'),
                React.createElement(Title, {
                    key: 'title',
                    level: 2,
                    style: {
                        margin: 0,
                        color: '#1f2937'
                    }
                }, '人民城轨2.0'),
                React.createElement(Text, {
                    key: 'subtitle',
                    type: 'secondary',
                    style: {
                        fontSize: '16px'
                    }
                }, '管理后台系统')
            ]),
            
            // 登录表单
            React.createElement(Tabs, {
                key: 'login-tabs',
                activeKey: loginType,
                onChange: setLoginType,
                size: 'large',
                centered: true
            }, [
                // 密码登录
                React.createElement(TabPane, {
                    key: 'password',
                    tab: '密码登录'
                }, React.createElement(Form, {
                    form: passwordForm,
                    layout: 'vertical',
                    onFinish: handlePasswordLogin,
                    size: 'large'
                }, [
                    React.createElement('div', { style: { marginBottom: 24, textAlign: 'center' } },
                      demoAccountButtons.map(acc =>
                        React.createElement(Button, {
                          key: acc.phone,
                          size: 'small',
                          style: { margin: '0 4px' },
                          onClick: () => {
                            passwordForm.setFieldsValue({ phone: acc.phone, password: '123456' });
                          }
                        }, acc.label)
                      )
                    ),
                    React.createElement(Form.Item, {
                        key: 'phone',
                        label: '手机号',
                        name: 'phone',
                        rules: [
                            { required: true, message: '请输入手机号' },
                            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
                        ]
                    }, React.createElement(Input, {
                        placeholder: '请输入手机号',
                        prefix: '📱'
                    })),
                    React.createElement(Form.Item, {
                        key: 'password',
                        label: '密码',
                        name: 'password',
                        rules: [
                            { required: true, message: '请输入密码' }
                        ]
                    }, React.createElement(Input.Password, {
                        placeholder: '请输入密码',
                        prefix: '🔒'
                    })),
                    React.createElement(Form.Item, {
                        key: 'submit',
                        style: { marginTop: '32px' }
                    }, React.createElement(Button, {
                        type: 'primary',
                        htmlType: 'submit',
                        loading: loading,
                        block: true,
                        style: {
                            height: '48px',
                            fontSize: '16px',
                            borderRadius: '8px'
                        }
                    }, '登录'))
                ])),
                
                // 验证码登录
                React.createElement(TabPane, {
                    key: 'code',
                    tab: '验证码登录'
                }, React.createElement(Form, {
                    form: codeForm,
                    layout: 'vertical',
                    onFinish: handleCodeLogin,
                    size: 'large'
                }, [
                    React.createElement('div', { style: { marginBottom: 24, textAlign: 'center' } },
                      demoAccountButtons.map(acc =>
                        React.createElement(Button, {
                          key: acc.phone,
                          size: 'small',
                          style: { margin: '0 4px' },
                          onClick: () => {
                            codeForm.setFieldsValue({ phone: acc.phone, code: '123456' });
                          }
                        }, acc.label)
                      )
                    ),
                    React.createElement(Form.Item, {
                        key: 'phone',
                        label: '手机号',
                        name: 'phone',
                        rules: [
                            { required: true, message: '请输入手机号' },
                            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
                        ]
                    }, React.createElement(Input, {
                        placeholder: '请输入手机号',
                        prefix: '📱'
                    })),
                    React.createElement(Form.Item, {
                        key: 'code',
                        label: '验证码',
                        name: 'code',
                        rules: [
                            { required: true, message: '请输入验证码' },
                            { len: 6, message: '验证码为6位数字' }
                        ]
                    }, React.createElement(Row, {
                        gutter: 8
                    }, [
                        React.createElement(Col, {
                            key: 'code-input',
                            span: 15
                        }, React.createElement(Input, {
                            placeholder: '请输入验证码',
                            prefix: '🔢',
                            maxLength: 6
                        })),
                        React.createElement(Col, {
                            key: 'send-code',
                            span: 9
                        }, React.createElement(Button, {
                            onClick: handleSendCode,
                            loading: sendingCode,
                            disabled: countdown > 0,
                            style: {
                                width: '100%',
                                height: '40px'
                            }
                        }, countdown > 0 ? `${countdown}s` : '获取验证码'))
                    ])),
                    React.createElement(Form.Item, {
                        key: 'submit',
                        style: { marginTop: '32px' }
                    }, React.createElement(Button, {
                        type: 'primary',
                        htmlType: 'submit',
                        loading: loading,
                        block: true,
                        style: {
                            height: '48px',
                            fontSize: '16px',
                            borderRadius: '8px'
                        }
                    }, '登录'))
                ]))
            ]),
            
            // 演示账号说明
            React.createElement('div', {
                key: 'demo-info',
                style: {
                    marginTop: '32px',
                    padding: '16px',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef'
                }
            }, [
                React.createElement('div', {
                    key: 'demo-title',
                    style: {
                        fontSize: '14px',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                        color: '#495057'
                    }
                }, '💡 演示账号与角色权限对照表'),
                React.createElement('table', {
                    key: 'demo-table',
                    style: {
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '13px',
                        background: '#fff',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        marginBottom: '8px'
                    }
                }, [
                    React.createElement('thead', { key: 'thead' }, [
                        React.createElement('tr', { key: 'tr-head', style: { background: '#f1f3f4' } }, [
                            React.createElement('th', { key: 'th-role', style: { padding: '6px 8px', border: '1px solid #e9ecef' } }, '角色'),
                            React.createElement('th', { key: 'th-phone', style: { padding: '6px 8px', border: '1px solid #e9ecef' } }, '手机号'),
                            React.createElement('th', { key: 'th-password', style: { padding: '6px 8px', border: '1px solid #e9ecef' } }, '密码/验证码'),
                            React.createElement('th', { key: 'th-desc', style: { padding: '6px 8px', border: '1px solid #e9ecef' } }, '权限说明')
                        ])
                    ]),
                    React.createElement('tbody', { key: 'tbody' },
                        demoAccounts.map((acc, idx) =>
                            React.createElement('tr', { key: acc.phone, style: { background: idx % 2 === 0 ? '#fafbfc' : '#fff' } }, [
                                React.createElement('td', { style: { padding: '6px 8px', border: '1px solid #e9ecef', minWidth: 60 } }, acc.name),
                                React.createElement('td', { style: { padding: '6px 8px', border: '1px solid #e9ecef', minWidth: 110 } },
                                    React.createElement('span', {
                                        style: { cursor: 'pointer', color: '#1677ff' },
                                        title: '点击复制',
                                        onClick: () => { navigator.clipboard && navigator.clipboard.writeText(acc.phone); }
                                    }, acc.phone)
                                ),
                                React.createElement('td', { style: { padding: '6px 8px', border: '1px solid #e9ecef', minWidth: 80 } },
                                    React.createElement('span', {
                                        style: { cursor: 'pointer', color: '#1677ff' },
                                        title: '点击复制',
                                        onClick: () => { navigator.clipboard && navigator.clipboard.writeText(acc.password); }
                                    }, acc.password)
                                ),
                                React.createElement('td', { style: { padding: '6px 8px', border: '1px solid #e9ecef', minWidth: 100 } },
                                    acc.role === 'super_admin' ? '全站最高权限' :
                                    acc.role === 'union_admin' ? '协会管理' :
                                    acc.role === 'expo_admin' ? '会展管理' :
                                    acc.role === 'ops_admin' ? '内容运营' :
                                    acc.role === 'union_user' ? '协会数据查看' :
                                    acc.role === 'exhibitor' ? '展位申请' :
                                    acc.role === 'visitor' ? '浏览公开信息' :
                                    '—'
                                )
                            ])
                        )
                    )
                ]),
                React.createElement('div', {
                    key: 'demo-tip',
                    style: { color: '#888', fontSize: '12px', marginTop: '4px' }
                }, '支持手机号+密码 或 手机号+验证码（验证码：123456）两种登录方式，点击表格可快速复制。')
            ])
        ])
    ]);
};

window.Login = Login;
console.log('[Login] window.Login 挂载成功'); 