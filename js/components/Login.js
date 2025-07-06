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
    
    // 演示用的账号数据
    const demoAccounts = [
        {
            phone: '13800138000',
            password: '123456',
            name: '系统管理员',
            role: 'admin',
            permissions: ['*'],
            userId: 'admin_001'
        },
        {
            phone: '13800138001',
            password: '123456',
            name: '运营总监',
            role: 'operation_director',
            permissions: ['content:*', 'audit:*', 'exhibition:*', 'stats:*', 'user:view'],
            userId: 'operation_001'
        },
        {
            phone: '13800138002',
            password: '123456',
            name: '内容审核员',
            role: 'content_auditor',
            permissions: ['content:view', 'content:edit', 'audit:review', 'audit:approve'],
            userId: 'auditor_001'
        },
        {
            phone: '13800138003',
            password: '123456',
            name: '展会管理员',
            role: 'exhibition_manager',
            permissions: ['exhibition:*', 'booth:*', 'exhibitor:*'],
            userId: 'exhibition_001'
        },
        {
            phone: '13800138004',
            password: '123456',
            name: '数据分析师',
            role: 'data_analyst',
            permissions: ['stats:*', 'data:view', 'user:view'],
            userId: 'analyst_001'
        }
    ];
    
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
                }, '💡 演示账号说明'),
                React.createElement('div', {
                    key: 'demo-accounts',
                    style: {
                        fontSize: '12px',
                        color: '#6c757d',
                        lineHeight: '1.5'
                    }
                }, [
                    React.createElement('p', {
                        key: 'admin',
                        style: { margin: '4px 0' }
                    }, '🔧 系统管理员：13800138000 / 123456'),
                    React.createElement('p', {
                        key: 'operation',
                        style: { margin: '4px 0' }
                    }, '📊 运营总监：13800138001 / 123456'),
                    React.createElement('p', {
                        key: 'auditor',
                        style: { margin: '4px 0' }
                    }, '🔍 内容审核员：13800138002 / 123456'),
                    React.createElement('p', {
                        key: 'exhibition',
                        style: { margin: '4px 0' }
                    }, '🏢 展会管理员：13800138003 / 123456'),
                    React.createElement('p', {
                        key: 'analyst',
                        style: { margin: '4px 0' }
                    }, '📈 数据分析师：13800138004 / 123456'),
                    React.createElement('p', {
                        key: 'code-tip',
                        style: { margin: '8px 0 4px', color: '#28a745' }
                    }, '验证码登录统一使用：123456')
                ])
            ])
        ])
    ]);
};

window.Login = Login;
console.log('[Login] window.Login 挂载成功'); 