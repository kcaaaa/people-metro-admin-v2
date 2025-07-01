// 登录页面组件
const LoginPage = ({ onLogin }) => {
    const { Form, Input, Button, Card, message, Space } = antd;
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);

    const handleLogin = async (values) => {
        setLoading(true);
        try {
            // 模拟登录验证
            const { username, password } = values;
            
            // 固定的登录凭据
            if (username === 'admin' && password === 'admin123') {
                // 模拟API调用延迟
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const userData = {
                    id: 1,
                    name: '系统管理员',
                    username: 'admin',
                    role: 'admin',
                    avatar: null,
                    loginTime: new Date().toISOString()
                };
                
                // 保存登录状态到localStorage
                localStorage.setItem('userToken', 'admin_token_' + Date.now());
                localStorage.setItem('userData', JSON.stringify(userData));
                
                message.success('登录成功！');
                onLogin && onLogin(userData);
            } else {
                message.error('用户名或密码错误！');
            }
        } catch (error) {
            console.error('登录失败:', error);
            message.error('登录失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = (values) => {
        handleLogin(values);
    };

    // 键盘快捷键支持
    React.useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                form.submit();
            }
        };
        
        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [form]);

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
        React.createElement('div', {
            key: 'login-container',
            style: {
                width: '100%',
                maxWidth: '400px'
            }
        }, [
            // Logo和标题
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
                React.createElement('h1', {
                    key: 'title',
                    style: {
                        color: 'white',
                        margin: 0,
                        fontSize: '24px',
                        fontWeight: 'bold'
                    }
                }, '人民城轨2.0'),
                React.createElement('p', {
                    key: 'subtitle',
                    style: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: '8px 0 0 0',
                        fontSize: '14px'
                    }
                }, '运营管理后台')
            ]),

            // 登录表单
            React.createElement(Card, {
                key: 'form-card',
                style: {
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                },
                bodyStyle: {
                    padding: '32px'
                }
            }, [
                React.createElement('div', {
                    key: 'form-header',
                    style: {
                        textAlign: 'center',
                        marginBottom: '24px'
                    }
                }, [
                    React.createElement('h2', {
                        key: 'form-title',
                        style: {
                            margin: 0,
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#1e293b'
                        }
                    }, '系统登录'),
                    React.createElement('p', {
                        key: 'form-desc',
                        style: {
                            margin: '8px 0 0 0',
                            color: '#64748b',
                            fontSize: '14px'
                        }
                    }, '请输入您的登录凭据')
                ]),

                React.createElement(Form, {
                    key: 'login-form',
                    form: form,
                    name: 'login',
                    layout: 'vertical',
                    onFinish: handleFormSubmit,
                    autoComplete: 'off',
                    size: 'large'
                }, [
                    React.createElement(Form.Item, {
                        key: 'username',
                        name: 'username',
                        label: '用户名',
                        rules: [
                            { required: true, message: '请输入用户名！' },
                            { min: 3, message: '用户名至少3个字符！' }
                        ]
                    }, React.createElement(Input, {
                        prefix: '👤',
                        placeholder: '请输入用户名',
                        autoComplete: 'username'
                    })),

                    React.createElement(Form.Item, {
                        key: 'password',
                        name: 'password',
                        label: '密码',
                        rules: [
                            { required: true, message: '请输入密码！' },
                            { min: 6, message: '密码至少6个字符！' }
                        ]
                    }, React.createElement(Input.Password, {
                        prefix: '🔒',
                        placeholder: '请输入密码',
                        autoComplete: 'current-password'
                    })),

                    React.createElement(Form.Item, {
                        key: 'submit',
                        style: { marginBottom: '16px' }
                    }, React.createElement(Button, {
                        type: 'primary',
                        htmlType: 'submit',
                        loading: loading,
                        block: true,
                        style: {
                            height: '44px',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }
                    }, loading ? '登录中...' : '登录')),

                    React.createElement('div', {
                        key: 'demo-info',
                        style: {
                            background: '#f8fafc',
                            padding: '16px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                        }
                    }, [
                        React.createElement('div', {
                            key: 'demo-title',
                            style: {
                                fontSize: '12px',
                                color: '#64748b',
                                marginBottom: '8px',
                                fontWeight: 'bold'
                            }
                        }, '演示账号信息：'),
                        React.createElement('div', {
                            key: 'demo-content',
                            style: {
                                fontSize: '12px',
                                color: '#475569'
                            }
                        }, [
                            React.createElement('div', {
                                key: 'username-info'
                            }, '用户名：admin'),
                            React.createElement('div', {
                                key: 'password-info'
                            }, '密码：admin123')
                        ])
                    ])
                ])
            ]),

            // 版权信息
            React.createElement('div', {
                key: 'footer',
                style: {
                    textAlign: 'center',
                    marginTop: '24px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '12px'
                }
            }, [
                React.createElement('p', {
                    key: 'copyright',
                    style: { margin: 0 }
                }, '© 2024 人民城轨2.0 运营管理后台'),
                React.createElement('p', {
                    key: 'version',
                    style: { margin: '4px 0 0 0' }
                }, 'Version 2.0.0')
            ])
        ])
    ]);
};

window.LoginPage = LoginPage; 