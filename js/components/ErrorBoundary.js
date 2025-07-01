// 错误边界组件
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        
        // 这里可以记录错误日志
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    }

    render() {
        if (this.state.hasError) {
            return React.createElement('div', {
                className: 'error-boundary',
                style: {
                    padding: '50px',
                    textAlign: 'center',
                    background: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #ff4d4f',
                    margin: '20px'
                }
            }, [
                React.createElement('div', {
                    key: 'icon',
                    style: { fontSize: '48px', marginBottom: '20px', color: '#ff4d4f' }
                }, '⚠️'),
                React.createElement('h2', {
                    key: 'title',
                    style: { color: '#ff4d4f', marginBottom: '16px' }
                }, '系统错误'),
                React.createElement('p', {
                    key: 'message',
                    style: { marginBottom: '20px', color: '#666' }
                }, '抱歉，系统遇到了一个错误。请尝试刷新页面或联系管理员。'),
                React.createElement('button', {
                    key: 'retry',
                    onClick: this.handleRetry,
                    style: {
                        padding: '8px 16px',
                        background: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }
                }, '重试'),
                React.createElement('button', {
                    key: 'reload',
                    onClick: () => window.location.reload(),
                    style: {
                        padding: '8px 16px',
                        background: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }
                }, '刷新页面'),
                this.state.error && React.createElement('details', {
                    key: 'details',
                    style: { marginTop: '20px', textAlign: 'left' }
                }, [
                    React.createElement('summary', {
                        key: 'summary',
                        style: { cursor: 'pointer', marginBottom: '10px' }
                    }, '错误详情'),
                    React.createElement('pre', {
                        key: 'error',
                        style: {
                            background: '#f5f5f5',
                            padding: '10px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            overflow: 'auto'
                        }
                    }, this.state.error.toString()),
                    this.state.errorInfo && React.createElement('pre', {
                        key: 'stack',
                        style: {
                            background: '#f5f5f5',
                            padding: '10px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            overflow: 'auto',
                            marginTop: '10px'
                        }
                    }, this.state.errorInfo.componentStack)
                ])
            ]);
        }

        return this.props.children;
    }
}

window.ErrorBoundary = ErrorBoundary; 