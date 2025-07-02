// 展会内容审核管理页面
const ExhibitionAuditManagement = () => {
    const { Card, Table, Button, Input, Select, Space, Tag, Modal, Form, message, Row, Col, Statistic, DatePicker, Tabs, Descriptions, Image, Alert, Progress } = antd;
    const { Search } = Input;
    const { Option } = Select;
    const { RangePicker } = DatePicker;
    const { TabPane } = Tabs;
    const { TextArea } = Input;

    // 状态管理
    const [loading, setLoading] = React.useState(false);
    const [auditList, setAuditList] = React.useState([]);
    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [filters, setFilters] = React.useState({
        auditStatus: 'all',
        contentType: 'all',
        keyword: '',
        dateRange: null
    });
    
    // 审核相关状态
    const [selectedContent, setSelectedContent] = React.useState(null);
    const [auditModalVisible, setAuditModalVisible] = React.useState(false);
    const [detailModalVisible, setDetailModalVisible] = React.useState(false);
    const [auditForm] = Form.useForm();
    const [currentAuditAction, setCurrentAuditAction] = React.useState('approve'); // approve | reject

    // 模拟展会内容审核数据
    const mockAuditData = [
        {
            id: 1,
            title: '2024国际轨道交通展览会开幕式',
            type: 'video',
            board: 'exhibition',
            publisher: '张三',
            publisherId: 1001,
            publishTime: '2024-01-15 14:30:00',
            submitTime: '2024-01-15 14:35:00',
            aiAuditTime: '2024-01-15 14:36:00',
            manualAuditTime: null,
            auditStatus: 'ai_passed_pending_manual', // AI审核通过，待人工复审
            aiResult: {
                status: 'passed',
                confidence: 0.92,
                riskTags: [],
                summary: 'AI检测无违规内容'
            },
            manualResult: null,
            viewCount: 0,
            likeCount: 0,
            commentCount: 0,
            duration: '5:30',
            thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300',
            tags: ['展会开幕', '国际交流', '轨道交通'],
            description: '2024年度最大规模的国际轨道交通展览会隆重开幕，汇聚全球顶尖技术和产品...',
            content: '本次展会为期三天，将展示最新的轨道交通技术、设备和解决方案...'
        },
        {
            id: 2,
            title: '高速列车新技术发布会',
            type: 'article',
            board: 'exhibition',
            publisher: '李四',
            publisherId: 1002,
            publishTime: '2024-01-14 16:20:00',
            submitTime: '2024-01-14 16:25:00',
            aiAuditTime: '2024-01-14 16:26:00',
            manualAuditTime: '2024-01-14 17:30:00',
            auditStatus: 'manual_passed', // 人工审核通过
            aiResult: {
                status: 'passed',
                confidence: 0.89,
                riskTags: [],
                summary: 'AI检测内容合规'
            },
            manualResult: {
                status: 'passed',
                auditor: '展会审核员A',
                auditTime: '2024-01-14 17:30:00',
                comment: '内容质量高，符合展会标准，可以发布',
                rating: 'excellent'
            },
            viewCount: 1250,
            likeCount: 89,
            commentCount: 23,
            imageCount: 8,
            tags: ['高速列车', '新技术', '发布会'],
            description: '某知名制造商发布最新一代高速列车技术，速度和安全性均有显著提升...',
            content: '本次发布的新技术包括智能控制系统、新材料应用、节能减排技术等多个方面...'
        },
        {
            id: 3,
            title: '展位招商宣传视频',
            type: 'video',
            board: 'exhibition',
            publisher: '王五',
            publisherId: 1003,
            publishTime: '2024-01-13 10:15:00',
            submitTime: '2024-01-13 10:20:00',
            aiAuditTime: '2024-01-13 10:21:00',
            manualAuditTime: '2024-01-13 11:45:00',
            auditStatus: 'manual_rejected', // 人工审核拒绝
            aiResult: {
                status: 'warning',
                confidence: 0.76,
                riskTags: ['商业推广'],
                summary: 'AI检测到可能的商业推广内容'
            },
            manualResult: {
                status: 'rejected',
                auditor: '展会审核员B',
                auditTime: '2024-01-13 11:45:00',
                comment: '内容过于商业化，不符合展会内容标准，建议修改后重新提交',
                rating: 'poor'
            },
            viewCount: 0,
            likeCount: 0,
            commentCount: 0,
            duration: '3:20',
            tags: ['展位招商', '宣传'],
            description: '为即将到来的展会进行展位招商，欢迎各大企业参展...',
            content: '我们提供优质的展位位置，完善的服务配套，是您展示产品的最佳选择...'
        },
        {
            id: 4,
            title: '智能轨道交通解决方案介绍',
            type: 'article',
            board: 'exhibition',
            publisher: '赵六',
            publisherId: 1004,
            publishTime: '2024-01-12 09:30:00',
            submitTime: '2024-01-12 09:35:00',
            aiAuditTime: null,
            manualAuditTime: null,
            auditStatus: 'ai_pending', // AI审核中
            aiResult: null,
            manualResult: null,
            viewCount: 0,
            likeCount: 0,
            commentCount: 0,
            imageCount: 12,
            tags: ['智能交通', '解决方案', '技术介绍'],
            description: '全面介绍我司最新的智能轨道交通解决方案，包含信号系统、控制系统等...',
            content: '随着科技的发展，智能化已成为轨道交通行业的重要发展方向...'
        }
    ];

    // 统计数据
    const statsData = {
        totalPending: 15, // 待审核总数
        aiPending: 8,     // AI审核中
        manualPending: 7, // 待人工复审
        todayProcessed: 23, // 今日已处理
        avgProcessTime: '45分钟' // 平均处理时间
    };

    React.useEffect(() => {
        loadAuditList();
    }, [pagination.current, pagination.pageSize, filters]);

    const loadAuditList = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            let filteredData = [...mockAuditData];
            
            if (filters.auditStatus !== 'all') {
                filteredData = filteredData.filter(item => item.auditStatus === filters.auditStatus);
            }
            if (filters.contentType !== 'all') {
                filteredData = filteredData.filter(item => item.type === filters.contentType);
            }
            if (filters.keyword) {
                filteredData = filteredData.filter(item => 
                    item.title.includes(filters.keyword) || 
                    item.description.includes(filters.keyword)
                );
            }
            
            setAuditList(filteredData);
            setPagination(prev => ({
                ...prev,
                total: filteredData.length
            }));
        } catch (error) {
            message.error('加载审核列表失败');
        } finally {
            setLoading(false);
        }
    };

    // 处理人工审核
    const handleManualAudit = async (values) => {
        try {
            setLoading(true);
            
            const auditData = {
                contentId: selectedContent.id,
                action: currentAuditAction,
                comment: values.comment,
                rating: values.rating,
                auditor: '当前用户', // 实际应该从用户信息获取
                auditTime: new Date().toISOString()
            };
            
            console.log('人工审核:', auditData);
            
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const actionText = currentAuditAction === 'approve' ? '通过' : '拒绝';
            message.success(`内容审核${actionText}成功！`);
            
            // 重置表单并关闭模态框
            auditForm.resetFields();
            setAuditModalVisible(false);
            setSelectedContent(null);
            
            // 刷新列表
            loadAuditList();
            
        } catch (error) {
            message.error('审核操作失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    // 开始人工审核
    const startManualAudit = (record, action) => {
        setSelectedContent(record);
        setCurrentAuditAction(action);
        setAuditModalVisible(true);
        
        // 预设表单值
        auditForm.setFieldsValue({
            contentTitle: record.title,
            publisher: record.publisher,
            aiResult: record.aiResult?.summary || '暂无AI审核结果'
        });
    };

    // 查看详情
    const viewDetails = (record) => {
        setSelectedContent(record);
        setDetailModalVisible(true);
    };

    const getAuditStatusTag = (status) => {
        const statusMap = {
            ai_pending: { color: 'processing', text: 'AI审核中' },
            ai_passed_pending_manual: { color: 'warning', text: '待人工复审' },
            ai_rejected: { color: 'error', text: 'AI审核拒绝' },
            manual_passed: { color: 'success', text: '人工审核通过' },
            manual_rejected: { color: 'error', text: '人工审核拒绝' }
        };
        const config = statusMap[status] || { color: 'default', text: '未知状态' };
        return React.createElement(Tag, { color: config.color }, config.text);
    };

    const getContentTypeTag = (type) => {
        const typeMap = {
            video: { color: 'blue', text: '🎬 视频', icon: '🎬' },
            article: { color: 'green', text: '📄 图文', icon: '📄' }
        };
        const config = typeMap[type] || { color: 'default', text: '未知' };
        return React.createElement(Tag, { color: config.color }, config.text);
    };

    const getAuditProgress = (record) => {
        if (record.auditStatus === 'ai_pending') {
            return { percent: 25, status: 'active', text: 'AI审核中' };
        } else if (record.auditStatus === 'ai_passed_pending_manual') {
            return { percent: 50, status: 'active', text: '待人工复审' };
        } else if (record.auditStatus === 'ai_rejected') {
            return { percent: 100, status: 'exception', text: 'AI拒绝' };
        } else if (record.auditStatus === 'manual_passed') {
            return { percent: 100, status: 'success', text: '审核通过' };
        } else if (record.auditStatus === 'manual_rejected') {
            return { percent: 100, status: 'exception', text: '人工拒绝' };
        }
        return { percent: 0, status: 'normal', text: '未开始' };
    };

    // 渲染统计卡片
    const renderStatsCards = () => {
        return React.createElement(Row, { gutter: 16, style: { marginBottom: 24 } }, [
            React.createElement(Col, { key: 'pending', span: 6 },
                React.createElement(Card, { size: 'small' },
                    React.createElement(Statistic, {
                        title: '待审核总数',
                        value: statsData.totalPending,
                        prefix: '⏳',
                        valueStyle: { color: '#fa8c16' }
                    })
                )
            ),
            React.createElement(Col, { key: 'ai', span: 6 },
                React.createElement(Card, { size: 'small' },
                    React.createElement(Statistic, {
                        title: 'AI审核中',
                        value: statsData.aiPending,
                        prefix: '🤖',
                        valueStyle: { color: '#1890ff' }
                    })
                )
            ),
            React.createElement(Col, { key: 'manual', span: 6 },
                React.createElement(Card, { size: 'small' },
                    React.createElement(Statistic, {
                        title: '待人工复审',
                        value: statsData.manualPending,
                        prefix: '👨‍💼',
                        valueStyle: { color: '#722ed1' }
                    })
                )
            ),
            React.createElement(Col, { key: 'processed', span: 6 },
                React.createElement(Card, { size: 'small' },
                    React.createElement(Statistic, {
                        title: '今日已处理',
                        value: statsData.todayProcessed,
                        prefix: '✅',
                        valueStyle: { color: '#52c41a' }
                    })
                )
            )
        ]);
    };

    // 渲染筛选器
    const renderFilters = () => {
        return React.createElement(Card, {
            size: 'small',
            style: { marginBottom: 16 }
        }, React.createElement(Row, { gutter: 16, align: 'middle' }, [
            React.createElement(Col, { key: 'status', span: 6 },
                React.createElement(Select, {
                    placeholder: '审核状态',
                    value: filters.auditStatus,
                    onChange: (value) => setFilters(prev => ({ ...prev, auditStatus: value })),
                    style: { width: '100%' }
                }, [
                    React.createElement(Option, { key: 'all', value: 'all' }, '全部状态'),
                    React.createElement(Option, { key: 'ai_pending', value: 'ai_pending' }, 'AI审核中'),
                    React.createElement(Option, { key: 'ai_passed_pending_manual', value: 'ai_passed_pending_manual' }, '待人工复审'),
                    React.createElement(Option, { key: 'manual_passed', value: 'manual_passed' }, '人工审核通过'),
                    React.createElement(Option, { key: 'manual_rejected', value: 'manual_rejected' }, '人工审核拒绝'),
                    React.createElement(Option, { key: 'ai_rejected', value: 'ai_rejected' }, 'AI审核拒绝')
                ])
            ),
            React.createElement(Col, { key: 'type', span: 4 },
                React.createElement(Select, {
                    placeholder: '内容类型',
                    value: filters.contentType,
                    onChange: (value) => setFilters(prev => ({ ...prev, contentType: value })),
                    style: { width: '100%' }
                }, [
                    React.createElement(Option, { key: 'all', value: 'all' }, '全部类型'),
                    React.createElement(Option, { key: 'video', value: 'video' }, '视频'),
                    React.createElement(Option, { key: 'article', value: 'article' }, '图文')
                ])
            ),
            React.createElement(Col, { key: 'search', span: 14 },
                React.createElement(Search, {
                    placeholder: '搜索标题或内容',
                    value: filters.keyword,
                    onChange: (e) => setFilters(prev => ({ ...prev, keyword: e.target.value })),
                    onSearch: loadAuditList,
                    enterButton: true
                })
            )
        ]));
    };

    // 表格列配置
    const columns = [
        {
            title: '内容信息',
            key: 'content',
            width: 300,
            render: (_, record) => React.createElement('div', {
                style: { display: 'flex', alignItems: 'center' }
            }, [
                React.createElement('div', {
                    key: 'thumb',
                    style: {
                        width: 60,
                        height: 60,
                        background: record.thumbnail ? `url(${record.thumbnail})` : '#f0f0f0',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: 4,
                        marginRight: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24
                    }
                }, !record.thumbnail && (record.type === 'video' ? '🎬' : '📄')),
                React.createElement('div', { key: 'info' }, [
                    React.createElement('div', {
                        key: 'title',
                        style: { fontWeight: 'bold', marginBottom: 4, fontSize: '14px' }
                    }, record.title),
                    React.createElement('div', {
                        key: 'meta',
                        style: { fontSize: 12, color: '#666', marginBottom: 4 }
                    }, [
                        getContentTypeTag(record.type),
                        React.createElement('span', {
                            key: 'publisher',
                            style: { marginLeft: 8 }
                        }, `发布者：${record.publisher}`)
                    ]),
                    React.createElement('div', {
                        key: 'time',
                        style: { fontSize: 11, color: '#999' }
                    }, `提交时间：${record.submitTime}`)
                ])
            ])
        },
        {
            title: '审核进度',
            key: 'progress',
            width: 200,
            render: (_, record) => {
                const progress = getAuditProgress(record);
                return React.createElement('div', {}, [
                    React.createElement(Progress, {
                        key: 'progress',
                        percent: progress.percent,
                        status: progress.status,
                        size: 'small',
                        style: { marginBottom: 8 }
                    }),
                    React.createElement('div', {
                        key: 'text',
                        style: { fontSize: 12, color: '#666' }
                    }, progress.text)
                ]);
            }
        },
        {
            title: '审核状态',
            key: 'status',
            width: 130,
            render: (_, record) => React.createElement('div', {}, [
                getAuditStatusTag(record.auditStatus),
                record.aiResult && React.createElement('div', {
                    key: 'ai-info',
                    style: { fontSize: 11, color: '#666', marginTop: 4 }
                }, `AI置信度：${(record.aiResult.confidence * 100).toFixed(0)}%`)
            ])
        },
        {
            title: 'AI审核结果',
            key: 'aiResult',
            width: 150,
            render: (_, record) => {
                if (!record.aiResult) {
                    return React.createElement('span', { style: { color: '#999' } }, '审核中...');
                }
                
                const { status, riskTags } = record.aiResult;
                return React.createElement('div', {}, [
                    React.createElement(Tag, {
                        key: 'status',
                        color: status === 'passed' ? 'green' : status === 'warning' ? 'orange' : 'red'
                    }, status === 'passed' ? '通过' : status === 'warning' ? '警告' : '拒绝'),
                    riskTags && riskTags.length > 0 && React.createElement('div', {
                        key: 'risks',
                        style: { marginTop: 4 }
                    }, riskTags.map((tag, index) => 
                        React.createElement(Tag, {
                            key: index,
                            size: 'small',
                            color: 'red'
                        }, tag)
                    ))
                ]);
            }
        },
        {
            title: '操作',
            key: 'actions',
            width: 180,
            render: (_, record) => {
                const canManualAudit = record.auditStatus === 'ai_passed_pending_manual';
                
                return React.createElement(Space, { direction: 'vertical', size: 'small' }, [
                    React.createElement(Space, { key: 'main-actions' }, [
                        React.createElement(Button, {
                            key: 'view',
                            type: 'link',
                            size: 'small',
                            onClick: () => viewDetails(record)
                        }, '查看详情'),
                        canManualAudit && React.createElement(Button, {
                            key: 'approve',
                            type: 'link',
                            size: 'small',
                            style: { color: '#52c41a' },
                            onClick: () => startManualAudit(record, 'approve')
                        }, '✅ 通过')
                    ]),
                    canManualAudit && React.createElement(Button, {
                        key: 'reject',
                        type: 'link',
                        size: 'small',
                        danger: true,
                        onClick: () => startManualAudit(record, 'reject')
                    }, '❌ 拒绝')
                ]);
            }
        }
    ];

    // 渲染人工审核模态框
    const renderAuditModal = () => {
        if (!selectedContent) return null;

        const isApprove = currentAuditAction === 'approve';
        const title = isApprove ? '审核通过' : '审核拒绝';
        
        return React.createElement(Modal, {
            title: `${title} - ${selectedContent.title}`,
            visible: auditModalVisible,
            onCancel: () => {
                setAuditModalVisible(false);
                setSelectedContent(null);
                auditForm.resetFields();
            },
            footer: [
                React.createElement(Button, {
                    key: 'cancel',
                    onClick: () => {
                        setAuditModalVisible(false);
                        setSelectedContent(null);
                        auditForm.resetFields();
                    }
                }, '取消'),
                React.createElement(Button, {
                    key: 'confirm',
                    type: 'primary',
                    danger: !isApprove,
                    loading: loading,
                    onClick: () => auditForm.submit()
                }, `确认${title}`)
            ],
            width: 600
        }, React.createElement(Form, {
            form: auditForm,
            layout: 'vertical',
            onFinish: handleManualAudit
        }, [
            React.createElement(Alert, {
                key: 'info',
                type: isApprove ? 'success' : 'warning',
                message: `您正在进行${title}操作`,
                description: isApprove ? 
                    '请确认内容符合展会发布标准后点击确认' : 
                    '请说明拒绝原因，以便发布者了解并改进',
                style: { marginBottom: 16 }
            }),
            
            React.createElement(Form.Item, {
                key: 'content-info',
                label: '内容信息'
            }, React.createElement(Descriptions, {
                size: 'small',
                column: 1,
                bordered: true
            }, [
                React.createElement(Descriptions.Item, {
                    key: 'title',
                    label: '标题'
                }, selectedContent.title),
                React.createElement(Descriptions.Item, {
                    key: 'publisher',
                    label: '发布者'
                }, selectedContent.publisher),
                React.createElement(Descriptions.Item, {
                    key: 'ai-result',
                    label: 'AI审核结果'
                }, selectedContent.aiResult?.summary || '暂无')
            ])),

            isApprove && React.createElement(Form.Item, {
                key: 'rating',
                label: '内容评级',
                name: 'rating',
                rules: [{ required: true, message: '请选择内容评级' }]
            }, React.createElement(Select, {
                placeholder: '请选择内容评级'
            }, [
                React.createElement(Option, { key: 'excellent', value: 'excellent' }, '⭐⭐⭐ 优秀'),
                React.createElement(Option, { key: 'good', value: 'good' }, '⭐⭐ 良好'),
                React.createElement(Option, { key: 'fair', value: 'fair' }, '⭐ 一般')
            ])),

            React.createElement(Form.Item, {
                key: 'comment',
                label: isApprove ? '审核意见' : '拒绝原因',
                name: 'comment',
                rules: [{ required: true, message: `请输入${isApprove ? '审核意见' : '拒绝原因'}` }]
            }, React.createElement(TextArea, {
                placeholder: isApprove ? 
                    '请输入审核意见，如内容优点、建议等...' : 
                    '请详细说明拒绝原因，帮助发布者改进内容...',
                rows: 4,
                maxLength: 500,
                showCount: true
            }))
        ]));
    };

    // 渲染详情模态框
    const renderDetailModal = () => {
        if (!selectedContent) return null;

        return React.createElement(Modal, {
            title: '内容详情',
            visible: detailModalVisible,
            onCancel: () => {
                setDetailModalVisible(false);
                setSelectedContent(null);
            },
            footer: [
                React.createElement(Button, {
                    key: 'close',
                    onClick: () => {
                        setDetailModalVisible(false);
                        setSelectedContent(null);
                    }
                }, '关闭')
            ],
            width: 800
        }, React.createElement('div', {}, [
            React.createElement('h3', { 
                key: 'title',
                style: { marginBottom: 16 }
            }, selectedContent.title),
            
            React.createElement(Descriptions, {
                key: 'info',
                title: '基本信息',
                bordered: true,
                column: 2,
                style: { marginBottom: 16 }
            }, [
                React.createElement(Descriptions.Item, {
                    key: 'type',
                    label: '内容类型'
                }, getContentTypeTag(selectedContent.type)),
                React.createElement(Descriptions.Item, {
                    key: 'publisher',
                    label: '发布者'
                }, selectedContent.publisher),
                React.createElement(Descriptions.Item, {
                    key: 'submit-time',
                    label: '提交时间'
                }, selectedContent.submitTime),
                React.createElement(Descriptions.Item, {
                    key: 'status',
                    label: '审核状态'
                }, getAuditStatusTag(selectedContent.auditStatus))
            ]),

            selectedContent.aiResult && React.createElement(Descriptions, {
                key: 'ai-result',
                title: 'AI审核结果',
                bordered: true,
                column: 1,
                style: { marginBottom: 16 }
            }, [
                React.createElement(Descriptions.Item, {
                    key: 'ai-status',
                    label: '审核结果'
                }, React.createElement(Tag, {
                    color: selectedContent.aiResult.status === 'passed' ? 'green' : 'orange'
                }, selectedContent.aiResult.status === 'passed' ? '通过' : '警告')),
                React.createElement(Descriptions.Item, {
                    key: 'confidence',
                    label: '置信度'
                }, `${(selectedContent.aiResult.confidence * 100).toFixed(1)}%`),
                React.createElement(Descriptions.Item, {
                    key: 'summary',
                    label: '检测摘要'
                }, selectedContent.aiResult.summary)
            ]),

            selectedContent.manualResult && React.createElement(Descriptions, {
                key: 'manual-result',
                title: '人工审核结果',
                bordered: true,
                column: 1,
                style: { marginBottom: 16 }
            }, [
                React.createElement(Descriptions.Item, {
                    key: 'manual-status',
                    label: '审核结果'
                }, React.createElement(Tag, {
                    color: selectedContent.manualResult.status === 'passed' ? 'green' : 'red'
                }, selectedContent.manualResult.status === 'passed' ? '通过' : '拒绝')),
                React.createElement(Descriptions.Item, {
                    key: 'auditor',
                    label: '审核人员'
                }, selectedContent.manualResult.auditor),
                React.createElement(Descriptions.Item, {
                    key: 'audit-time',
                    label: '审核时间'
                }, selectedContent.manualResult.auditTime),
                React.createElement(Descriptions.Item, {
                    key: 'comment',
                    label: '审核意见'
                }, selectedContent.manualResult.comment)
            ]),

            React.createElement('div', {
                key: 'content',
                style: { marginTop: 16 }
            }, [
                React.createElement('h4', { key: 'content-title' }, '内容详情'),
                React.createElement('div', {
                    key: 'description',
                    style: { 
                        padding: 12,
                        background: '#f9f9f9',
                        borderRadius: 6,
                        marginBottom: 12 
                    }
                }, selectedContent.description),
                React.createElement('div', {
                    key: 'full-content',
                    style: { 
                        padding: 12,
                        border: '1px solid #f0f0f0',
                        borderRadius: 6,
                        maxHeight: 200,
                        overflowY: 'auto'
                    }
                }, selectedContent.content)
            ])
        ]));
    };

    return React.createElement('div', { className: 'page-fade-in' }, [
        React.createElement('div', { key: 'header', className: 'page-header' }, [
            React.createElement('h1', { key: 'title', className: 'page-title' }, '展会内容审核'),
            React.createElement('p', { key: 'desc', className: 'page-description' }, 
                '专门处理展会板块内容的AI+人工双重审核，确保展会内容质量和合规性'
            )
        ]),

        renderStatsCards(),
        renderFilters(),

        React.createElement(Card, { key: 'table-card' }, [
            React.createElement('div', {
                key: 'table-header',
                style: { 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: 16 
                }
            }, [
                React.createElement('h3', { key: 'title' }, '展会内容审核列表'),
                React.createElement(Space, { key: 'actions' }, [
                    React.createElement(Button, {
                        key: 'refresh',
                        onClick: loadAuditList
                    }, '刷新列表'),
                    React.createElement(Button, {
                        key: 'export',
                        type: 'primary'
                    }, '导出审核记录')
                ])
            ]),

            React.createElement(Alert, {
                key: 'info',
                type: 'info',
                message: '审核流程说明',
                description: '展会内容采用AI+人工双重审核机制：① AI自动检测内容合规性 → ② 人工复审确保质量标准 → ③ 发布到展会板块',
                style: { marginBottom: 16 },
                showIcon: true
            }),

            React.createElement(Table, {
                key: 'table',
                columns: columns,
                dataSource: auditList,
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
                rowKey: 'id',
                scroll: { x: 1200 }
            })
        ]),

        renderAuditModal(),
        renderDetailModal()
    ]);
};

window.ExhibitionAuditManagement = ExhibitionAuditManagement; 