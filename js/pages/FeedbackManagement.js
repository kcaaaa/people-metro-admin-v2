// 用户反馈管理页面
const FeedbackManagement = () => {
    const { Card, Table, Button, Input, Select, Space, Tag, Modal, Form, Switch, message, Row, Col, Rate, TextArea, Drawer } = antd;
    const { Search } = Input;
    const { Option } = Select;

    const [loading, setLoading] = React.useState(false);
    const [feedbackList, setFeedbackList] = React.useState([]);
    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [filters, setFilters] = React.useState({
        status: 'all',
        type: 'all',
        keyword: ''
    });
    const [replyModalVisible, setReplyModalVisible] = React.useState(false);
    const [detailDrawerVisible, setDetailDrawerVisible] = React.useState(false);
    const [currentFeedback, setCurrentFeedback] = React.useState(null);
    const [templates, setTemplates] = React.useState([]);
    const [form] = Form.useForm();

    // 模拟数据
    const mockFeedbackData = [
        {
            id: 1,
            title: '视频播放卡顿问题',
            content: '在观看视频时经常出现卡顿现象，特别是高峰期，希望能够优化视频播放体验。',
            type: 'bug',
            priority: 'high',
            status: 'pending',
            userId: 1001,
            userName: '张三',
            userPhone: '13800138000',
            userEmail: 'zhangsan@example.com',
            rating: 2,
            createTime: '2024-01-15 14:30:00',
            updateTime: '2024-01-15 14:30:00',
            images: ['feedback1.jpg', 'feedback2.jpg'],
            deviceInfo: 'iPhone 13 Pro, iOS 16.5',
            appVersion: '2.1.0',
            reply: null,
            replyTime: null,
            replyBy: null
        },
        {
            id: 2,
            title: '建议增加夜间模式',
            content: '希望APP能够增加夜间模式功能，晚上使用时眼睛会比较累，深色主题会更舒适。',
            type: 'suggestion',
            priority: 'medium',
            status: 'in_progress',
            userId: 1002,
            userName: '李四',
            userPhone: '13800138001',
            userEmail: 'lisi@example.com',
            rating: 4,
            createTime: '2024-01-14 16:20:00',
            updateTime: '2024-01-15 10:30:00',
            images: [],
            deviceInfo: 'Samsung Galaxy S21, Android 12',
            appVersion: '2.0.8',
            reply: '您的建议很棒！我们已经将夜间模式功能纳入下个版本的开发计划中。',
            replyTime: '2024-01-15 10:30:00',
            replyBy: '产品团队'
        },
        {
            id: 3,
            title: '登录验证码收不到',
            content: '多次尝试登录，但是手机验证码一直收不到，请帮忙解决一下。',
            type: 'bug',
            priority: 'high',
            status: 'resolved',
            userId: 1003,
            userName: '王五',
            userPhone: '13800138002',
            userEmail: 'wangwu@example.com',
            rating: 1,
            createTime: '2024-01-13 10:15:00',
            updateTime: '2024-01-13 15:20:00',
            images: ['sms_issue.jpg'],
            deviceInfo: 'Xiaomi 12, MIUI 13',
            appVersion: '2.0.8',
            reply: '问题已修复，请您重新尝试获取验证码。如仍有问题请联系客服。',
            replyTime: '2024-01-13 15:20:00',
            replyBy: '技术支持'
        }
    ];

    const mockTemplates = [
        {
            id: 1,
            name: '问题确认模板',
            content: '感谢您的反馈！我们已收到您的问题报告，技术团队正在分析处理，预计在3个工作日内给您回复。'
        },
        {
            id: 2,
            name: '建议采纳模板',
            content: '您的建议很有价值！我们已将此建议纳入产品优化计划，后续版本会考虑实现。'
        },
        {
            id: 3,
            name: '问题解决模板',
            content: '您反馈的问题已经修复，请更新到最新版本体验。如仍有问题请随时联系我们。'
        },
        {
            id: 4,
            name: '感谢反馈模板',
            content: '感谢您的宝贵反馈！我们会持续改进产品，为您提供更好的使用体验。'
        }
    ];

    React.useEffect(() => {
        loadFeedbackList();
        setTemplates(mockTemplates);
    }, [pagination.current, pagination.pageSize, filters]);

    const loadFeedbackList = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            let filteredData = [...mockFeedbackData];
            
            // 应用过滤器
            if (filters.status !== 'all') {
                filteredData = filteredData.filter(item => item.status === filters.status);
            }
            if (filters.type !== 'all') {
                filteredData = filteredData.filter(item => item.type === filters.type);
            }
            if (filters.keyword) {
                filteredData = filteredData.filter(item => 
                    item.title.includes(filters.keyword) || 
                    item.content.includes(filters.keyword) ||
                    item.userName.includes(filters.keyword)
                );
            }
            
            setFeedbackList(filteredData);
            setPagination(prev => ({
                ...prev,
                total: filteredData.length
            }));
        } catch (error) {
            message.error('加载反馈列表失败');
        } finally {
            setLoading(false);
        }
    };

    const handleReply = (feedback) => {
        setCurrentFeedback(feedback);
        form.resetFields();
        setReplyModalVisible(true);
    };

    const handleViewDetail = (feedback) => {
        setCurrentFeedback(feedback);
        setDetailDrawerVisible(true);
    };

    const handleStatusChange = async (feedbackId, newStatus) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            setFeedbackList(prev => 
                prev.map(item => 
                    item.id === feedbackId 
                        ? { ...item, status: newStatus, updateTime: new Date().toLocaleString() }
                        : item
                )
            );
            message.success('状态更新成功');
        } catch (error) {
            message.error('状态更新失败');
        }
    };

    const handleSubmitReply = async (values) => {
        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));
            
            setFeedbackList(prev => 
                prev.map(item => 
                    item.id === currentFeedback.id 
                        ? { 
                            ...item, 
                            reply: values.reply,
                            replyTime: new Date().toLocaleString(),
                            replyBy: '客服团队',
                            status: 'resolved',
                            updateTime: new Date().toLocaleString()
                        }
                        : item
                )
            );
            
            message.success('回复发送成功');
            setReplyModalVisible(false);
        } catch (error) {
            message.error('回复发送失败');
        } finally {
            setLoading(false);
        }
    };

    const useTemplate = (template) => {
        form.setFieldsValue({
            reply: template.content
        });
    };

    const getStatusTag = (status) => {
        const statusMap = {
            pending: { color: 'orange', text: '待处理' },
            in_progress: { color: 'blue', text: '处理中' },
            resolved: { color: 'green', text: '已解决' },
            closed: { color: 'gray', text: '已关闭' }
        };
        const config = statusMap[status] || { color: 'gray', text: '未知' };
        return React.createElement(Tag, { color: config.color }, config.text);
    };

    const getTypeTag = (type) => {
        const typeMap = {
            bug: { color: 'red', text: '问题反馈' },
            suggestion: { color: 'blue', text: '功能建议' },
            complaint: { color: 'orange', text: '投诉建议' },
            other: { color: 'gray', text: '其他' }
        };
        const config = typeMap[type] || { color: 'gray', text: '未知' };
        return React.createElement(Tag, { color: config.color }, config.text);
    };

    const getPriorityTag = (priority) => {
        const priorityMap = {
            high: { color: 'red', text: '高' },
            medium: { color: 'orange', text: '中' },
            low: { color: 'green', text: '低' }
        };
        const config = priorityMap[priority] || { color: 'gray', text: '未知' };
        return React.createElement(Tag, { color: config.color, size: 'small' }, config.text);
    };

    const columns = [
        {
            title: '反馈信息',
            key: 'info',
            width: 300,
            render: (_, record) => React.createElement('div', {}, [
                React.createElement('div', {
                    key: 'title',
                    style: { fontWeight: 'bold', marginBottom: 4 }
                }, record.title),
                React.createElement('div', {
                    key: 'content',
                    style: { 
                        fontSize: 12, 
                        color: '#666', 
                        marginBottom: 8,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }
                }, record.content),
                React.createElement('div', { key: 'tags' }, [
                    getTypeTag(record.type),
                    React.createElement('span', { key: 'space', style: { marginLeft: 8 } }),
                    getPriorityTag(record.priority)
                ])
            ])
        },
        {
            title: '用户信息',
            key: 'user',
            width: 150,
            render: (_, record) => React.createElement('div', {}, [
                React.createElement('div', {
                    key: 'name',
                    style: { fontWeight: 'bold', marginBottom: 4 }
                }, record.userName),
                React.createElement('div', {
                    key: 'phone',
                    style: { fontSize: 12, color: '#666' }
                }, record.userPhone)
            ])
        },
        {
            title: '评分',
            key: 'rating',
            width: 120,
            render: (_, record) => React.createElement(Rate, {
                disabled: true,
                value: record.rating,
                style: { fontSize: 14 }
            })
        },
        {
            title: '状态',
            key: 'status',
            width: 100,
            render: (_, record) => getStatusTag(record.status)
        },
        {
            title: '提交时间',
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
                    key: 'detail',
                    type: 'link',
                    size: 'small',
                    onClick: () => handleViewDetail(record)
                }, '查看详情'),
                !record.reply && React.createElement(Button, {
                    key: 'reply',
                    type: 'link',
                    size: 'small',
                    onClick: () => handleReply(record)
                }, '回复'),
                record.status === 'pending' && React.createElement(Button, {
                    key: 'process',
                    type: 'link',
                    size: 'small',
                    onClick: () => handleStatusChange(record.id, 'in_progress')
                }, '处理中'),
                record.status !== 'resolved' && React.createElement(Button, {
                    key: 'resolve',
                    type: 'link',
                    size: 'small',
                    onClick: () => handleStatusChange(record.id, 'resolved')
                }, '标记解决')
            ])
        }
    ];

    const renderFilters = () => {
        return React.createElement(Card, {
            size: 'small',
            style: { marginBottom: 16 }
        }, React.createElement(Row, { gutter: 16, align: 'middle' }, [
            React.createElement(Col, { key: 'status', span: 4 },
                React.createElement(Select, {
                    placeholder: '处理状态',
                    value: filters.status,
                    onChange: (value) => setFilters(prev => ({ ...prev, status: value })),
                    style: { width: '100%' }
                }, [
                    React.createElement(Option, { key: 'all', value: 'all' }, '全部状态'),
                    React.createElement(Option, { key: 'pending', value: 'pending' }, '待处理'),
                    React.createElement(Option, { key: 'in_progress', value: 'in_progress' }, '处理中'),
                    React.createElement(Option, { key: 'resolved', value: 'resolved' }, '已解决'),
                    React.createElement(Option, { key: 'closed', value: 'closed' }, '已关闭')
                ])
            ),
            React.createElement(Col, { key: 'type', span: 4 },
                React.createElement(Select, {
                    placeholder: '反馈类型',
                    value: filters.type,
                    onChange: (value) => setFilters(prev => ({ ...prev, type: value })),
                    style: { width: '100%' }
                }, [
                    React.createElement(Option, { key: 'all', value: 'all' }, '全部类型'),
                    React.createElement(Option, { key: 'bug', value: 'bug' }, '问题反馈'),
                    React.createElement(Option, { key: 'suggestion', value: 'suggestion' }, '功能建议'),
                    React.createElement(Option, { key: 'complaint', value: 'complaint' }, '投诉建议'),
                    React.createElement(Option, { key: 'other', value: 'other' }, '其他')
                ])
            ),
            React.createElement(Col, { key: 'search', span: 8 },
                React.createElement(Search, {
                    placeholder: '搜索标题、内容或用户名',
                    value: filters.keyword,
                    onChange: (e) => setFilters(prev => ({ ...prev, keyword: e.target.value })),
                    onSearch: loadFeedbackList,
                    enterButton: true
                })
            )
        ]));
    };

    const renderReplyModal = () => {
        return React.createElement(Modal, {
            title: '回复用户反馈',
            visible: replyModalVisible,
            onCancel: () => setReplyModalVisible(false),
            footer: null,
            width: 600
        }, React.createElement('div', {}, [
            React.createElement('div', {
                key: 'feedback-info',
                style: { 
                    background: '#f5f5f5', 
                    padding: 16, 
                    borderRadius: 8, 
                    marginBottom: 16 
                }
            }, [
                React.createElement('h4', { key: 'title' }, currentFeedback?.title),
                React.createElement('p', { key: 'content' }, currentFeedback?.content),
                React.createElement('p', {
                    key: 'user',
                    style: { fontSize: 12, color: '#666', margin: 0 }
                }, `用户：${currentFeedback?.userName} | 评分：${currentFeedback?.rating}星`)
            ]),

            React.createElement('div', {
                key: 'templates',
                style: { marginBottom: 16 }
            }, [
                React.createElement('h4', { key: 'title' }, '快捷回复模板：'),
                React.createElement(Space, { key: 'buttons', wrap: true },
                    templates.map(template => 
                        React.createElement(Button, {
                            key: template.id,
                            size: 'small',
                            onClick: () => useTemplate(template)
                        }, template.name)
                    )
                )
            ]),

            React.createElement(Form, {
                key: 'form',
                form: form,
                layout: 'vertical',
                onFinish: handleSubmitReply
            }, [
                React.createElement(Form.Item, {
                    key: 'reply',
                    label: '回复内容',
                    name: 'reply',
                    rules: [{ required: true, message: '请输入回复内容' }]
                }, React.createElement(TextArea, {
                    placeholder: '请输入回复内容',
                    rows: 4
                })),

                React.createElement(Form.Item, { key: 'buttons' },
                    React.createElement(Space, {}, [
                        React.createElement(Button, {
                            key: 'cancel',
                            onClick: () => setReplyModalVisible(false)
                        }, '取消'),
                        React.createElement(Button, {
                            key: 'submit',
                            type: 'primary',
                            htmlType: 'submit',
                            loading: loading
                        }, '发送回复')
                    ])
                )
            ])
        ]));
    };

    const renderDetailDrawer = () => {
        if (!currentFeedback) return null;

        return React.createElement(Drawer, {
            title: '反馈详情',
            visible: detailDrawerVisible,
            onClose: () => setDetailDrawerVisible(false),
            width: 500
        }, React.createElement('div', {}, [
            React.createElement('div', { key: 'basic-info', style: { marginBottom: 24 } }, [
                React.createElement('h3', { key: 'title' }, currentFeedback.title),
                React.createElement('div', { key: 'tags', style: { marginBottom: 12 } }, [
                    getTypeTag(currentFeedback.type),
                    React.createElement('span', { key: 'space1', style: { marginLeft: 8 } }),
                    getPriorityTag(currentFeedback.priority),
                    React.createElement('span', { key: 'space2', style: { marginLeft: 8 } }),
                    getStatusTag(currentFeedback.status)
                ]),
                React.createElement('div', { key: 'rating', style: { marginBottom: 12 } }, [
                    React.createElement('span', { key: 'label' }, '用户评分：'),
                    React.createElement(Rate, {
                        key: 'stars',
                        disabled: true,
                        value: currentFeedback.rating,
                        style: { fontSize: 14 }
                    })
                ]),
                React.createElement('p', { key: 'content' }, currentFeedback.content)
            ]),

            React.createElement('div', { key: 'user-info', style: { marginBottom: 24 } }, [
                React.createElement('h4', { key: 'title' }, '用户信息'),
                React.createElement('p', { key: 'name' }, `姓名：${currentFeedback.userName}`),
                React.createElement('p', { key: 'phone' }, `手机：${currentFeedback.userPhone}`),
                React.createElement('p', { key: 'email' }, `邮箱：${currentFeedback.userEmail}`)
            ]),

            React.createElement('div', { key: 'device-info', style: { marginBottom: 24 } }, [
                React.createElement('h4', { key: 'title' }, '设备信息'),
                React.createElement('p', { key: 'device' }, `设备：${currentFeedback.deviceInfo}`),
                React.createElement('p', { key: 'version' }, `版本：${currentFeedback.appVersion}`)
            ]),

            currentFeedback.reply && React.createElement('div', { key: 'reply-info', style: { marginBottom: 24 } }, [
                React.createElement('h4', { key: 'title' }, '回复记录'),
                React.createElement('div', {
                    key: 'reply',
                    style: { 
                        background: '#f5f5f5', 
                        padding: 12, 
                        borderRadius: 8 
                    }
                }, [
                    React.createElement('p', { key: 'content' }, currentFeedback.reply),
                    React.createElement('p', {
                        key: 'meta',
                        style: { fontSize: 12, color: '#666', margin: 0 }
                    }, `${currentFeedback.replyBy} 回复于 ${currentFeedback.replyTime}`)
                ])
            ])
        ]));
    };

    return React.createElement('div', { className: 'page-fade-in' }, [
        React.createElement('div', { key: 'header', className: 'page-header' }, [
            React.createElement('h1', { key: 'title', className: 'page-title' }, '用户反馈管理'),
            React.createElement('p', { key: 'desc', className: 'page-description' }, 
                '查看和处理用户反馈，提升用户满意度和产品体验'
            )
        ]),

        renderFilters(),

        React.createElement(Card, { key: 'main-card' }, [
            React.createElement('div', {
                key: 'header',
                style: { 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: 16 
                }
            }, [
                React.createElement('h3', { key: 'title' }, '反馈列表'),
                React.createElement(Button, {
                    key: 'refresh',
                    onClick: loadFeedbackList
                }, '刷新')
            ]),

            React.createElement(Table, {
                key: 'table',
                columns: columns,
                dataSource: feedbackList,
                loading: loading,
                pagination: {
                    ...pagination,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条记录`,
                    onChange: (page, pageSize) => {
                        setPagination(prev => ({ ...prev, current: page, pageSize }));
                    }
                },
                rowKey: 'id'
            })
        ]),

        renderReplyModal(),
        renderDetailDrawer()
    ]);
};

window.FeedbackManagement = FeedbackManagement; 