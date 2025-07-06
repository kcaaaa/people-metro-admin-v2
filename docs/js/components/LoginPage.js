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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
            position: 'relative',
            overflow: 'hidden'
        }
    }, [
        // 背景动画元素
        React.createElement('div', {
            key: 'bg-animation',
            style: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                background: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NjUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cmVjdCBmaWxsPSIjZmZmIiB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NjUiLz48Y2lyY2xlIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIiBjeD0iNzIwIiBjeT0iMzgyLjUiIHI9IjE4MS41Ii8+PGNpcmNsZSBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIgY3g9IjcyMCIgY3k9IjM4Mi41IiByPSIyMzEuNSIvPjxjaXJjbGUgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIGN4PSI3MjAiIGN5PSIzODIuNSIgcj0iMjgxLjUiLz48Y2lyY2xlIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIiBjeD0iNzIwIiBjeT0iMzgyLjUiIHI9IjMzMS41Ii8+PC9nPjwvc3ZnPg==)',
                backgroundSize: 'cover',
                animation: 'pulse 3s infinite'
            }
        }),

        // 系统标题
        React.createElement('div', {
            key: 'system-title',
            style: {
                position: 'absolute',
                top: '10%',
                textAlign: 'center',
                color: '#fff'
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
                    fontSize: '28px',
                    fontWeight: 'bold',
                    margin: 0,
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }
            }, '人民城轨2.0运营管理后台'),
            React.createElement('p', {
                key: 'subtitle',
                style: {
                    fontSize: '16px',
                    opacity: 0.9,
                    margin: '8px 0 0',
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }
            }, '智能化运营 · 数据驱动决策')
        ]),

        // 登录表单卡片
        React.createElement(Card, {
            key: 'login-card',
            style: {
                width: '100%',
                maxWidth: '400px',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                border: 'none',
                zIndex: 1
            }
        }, [
            React.createElement('div', {
                key: 'form-header',
                style: {
                    textAlign: 'center',
                    marginBottom: '32px'
                }
            }, [
                React.createElement('h2', {
                    key: 'form-title',
                    style: {
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#1890ff',
                        margin: 0
                    }
                }, '欢迎登录'),
                React.createElement('p', {
                    key: 'form-subtitle',
                    style: {
                        margin: '8px 0 0',
                        color: '#666'
                    }
                }, '请输入您的账号和密码')
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
                    style: { marginBottom: 0 }
                }, React.createElement(Button, {
                    type: 'primary',
                    htmlType: 'submit',
                    loading: loading,
                    block: true,
                    style: {
                        height: '44px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
                        border: 'none'
                    }
                }, loading ? '登录中...' : '登 录'))
            ]),

            React.createElement('div', {
                key: 'demo-info',
                style: {
                    marginTop: '24px',
                    padding: '12px',
                    background: '#f0f5ff',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#666'
                }
            }, [
                React.createElement('div', {
                    key: 'title',
                    style: { fontWeight: 'bold', marginBottom: '4px', color: '#1890ff' }
                }, '演示账号'),
                React.createElement('div', { key: 'username' }, '用户名：admin'),
                React.createElement('div', { key: 'password' }, '密码：admin123')
            ])
        ]),

        // 页脚版权信息
        React.createElement('div', {
            key: 'footer',
            style: {
                position: 'absolute',
                bottom: '24px',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '14px'
            }
        }, [
            React.createElement('div', { key: 'copyright' }, '© 2024 人民城轨. All Rights Reserved.'),
            React.createElement('div', {
                key: 'version',
                style: { marginTop: '4px', fontSize: '12px', opacity: 0.8 }
            }, 'Version 2.0.0')
        ])
    ]);
};

window.LoginPage = LoginPage; 