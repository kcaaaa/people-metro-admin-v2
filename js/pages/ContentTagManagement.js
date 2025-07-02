// 内容标签管理页面
const ContentTagManagement = () => {
    const { Card, Table, Button, Input, Select, Space, Tag, Modal, Form, message, Row, Col, Statistic, DatePicker, Tabs, Descriptions, Alert, Progress, Switch, Divider, Tooltip, Badge } = antd;
    const { Search } = Input;
    const { Option } = Select;
    const { RangePicker } = DatePicker;
    const { TabPane } = Tabs;
    const { TextArea } = Input;

    // 状态管理
    const [loading, setLoading] = React.useState(false);
    const [tagList, setTagList] = React.useState([]);
    const [hotTagList, setHotTagList] = React.useState([]);
    const [selectedTags, setSelectedTags] = React.useState([]);
    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [filters, setFilters] = React.useState({
        category: 'all',
        status: 'all',
        keyword: '',
        dateRange: null
    });
    
    // 模态框状态
    const [tagModalVisible, setTagModalVisible] = React.useState(false);
    const [batchModalVisible, setBatchModalVisible] = React.useState(false);
    const [currentTag, setCurrentTag] = React.useState(null);
    const [modalMode, setModalMode] = React.useState('create'); // create | edit
    const [tagForm] = Form.useForm();
    const [batchForm] = Form.useForm();

    // 模拟标签数据
    const mockTagData = [
        {
            id: 1,
            name: '高速列车',
            category: 'technology',
            categoryName: '技术类型',
            description: '涉及高速列车相关的技术、产品和服务',
            color: '#1890ff',
            useCount: 1250,
            status: 'active',
            isHot: true,
            creator: '管理员',
            createTime: '2024-01-15 10:30:00',
            lastUsed: '2024-01-20 16:45:00',
            weight: 100
        },
        {
            id: 2,
            name: '城市轨道',
            category: 'scene',
            categoryName: '应用场景',
            description: '城市轨道交通相关内容',
            color: '#52c41a',
            useCount: 980,
            status: 'active',
            isHot: true,
            creator: '编辑A',
            createTime: '2024-01-10 14:20:00',
            lastUsed: '2024-01-20 14:30:00',
            weight: 95
        },
        {
            id: 3,
            name: '智能控制',
            category: 'technology',
            categoryName: '技术类型',
            description: '智能控制系统相关技术内容',
            color: '#722ed1',
            useCount: 756,
            status: 'active',
            isHot: true,
            creator: '管理员',
            createTime: '2024-01-08 09:15:00',
            lastUsed: '2024-01-19 11:20:00',
            weight: 88
        },
        {
            id: 4,
            name: '展会直播',
            category: 'content',
            categoryName: '内容类型',
            description: '展会直播相关内容',
            color: '#fa8c16',
            useCount: 234,
            status: 'active',
            isHot: false,
            creator: '编辑B',
            createTime: '2024-01-12 16:40:00',
            lastUsed: '2024-01-18 10:15:00',
            weight: 60
        },
        {
            id: 5,
            name: '安全系统',
            category: 'technology',
            categoryName: '技术类型',
            description: '轨道交通安全系统相关内容',
            color: '#f5222d',
            useCount: 189,
            status: 'active',
            isHot: false,
            creator: '管理员',
            createTime: '2024-01-05 11:25:00',
            lastUsed: '2024-01-17 15:50:00',
            weight: 55
        },
        {
            id: 6,
            name: '废弃标签',
            category: 'other',
            categoryName: '其他',
            description: '已不再使用的标签',
            color: '#d9d9d9',
            useCount: 12,
            status: 'inactive',
            isHot: false,
            creator: '编辑C',
            createTime: '2023-12-20 14:30:00',
            lastUsed: '2023-12-25 09:15:00',
            weight: 10
        }
    ];

    // 热门标签趋势数据
    const mockHotTagsData = [
        { name: '高速列车', count: 1250, trend: 15.2, category: 'technology' },
        { name: '城市轨道', count: 980, trend: 8.7, category: 'scene' },
        { name: '智能控制', count: 756, trend: 12.4, category: 'technology' },
        { name: '新能源', count: 543, trend: 25.8, category: 'technology' },
        { name: '节能减排', count: 432, trend: 18.9, category: 'environment' },
        { name: '技术创新', count: 378, trend: 22.1, category: 'technology' },
        { name: '国际合作', count: 289, trend: 9.5, category: 'cooperation' },
        { name: '产品发布', count: 256, trend: 5.3, category: 'content' }
    ];

    // 统计数据
    const statsData = {
        totalTags: 156,
        activeTags: 142,
        hotTags: 24,
        todayUsage: 1890
    };

    // 标签分类选项
    const categoryOptions = [
        { value: 'technology', label: '技术类型', color: '#1890ff' },
        { value: 'scene', label: '应用场景', color: '#52c41a' },
        { value: 'content', label: '内容类型', color: '#fa8c16' },
        { value: 'cooperation', label: '合作交流', color: '#13c2c2' },
        { value: 'environment', label: '环保节能', color: '#722ed1' },
        { value: 'other', label: '其他', color: '#8c8c8c' }
    ];

    React.useEffect(() => {
        loadTagList();
        loadHotTags();
    }, [pagination.current, pagination.pageSize, filters]);

    const loadTagList = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            let filteredData = [...mockTagData];
            
            if (filters.category !== 'all') {
                filteredData = filteredData.filter(item => item.category === filters.category);
            }
            if (filters.status !== 'all') {
                filteredData = filteredData.filter(item => item.status === filters.status);
            }
            if (filters.keyword) {
                filteredData = filteredData.filter(item => 
                    item.name.includes(filters.keyword) || 
                    item.description.includes(filters.keyword)
                );
            }
            
            setTagList(filteredData);
            setPagination(prev => ({
                ...prev,
                total: filteredData.length
            }));
        } catch (error) {
            message.error('加载标签列表失败');
        } finally {
            setLoading(false);
        }
    };

    const loadHotTags = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setHotTagList(mockHotTagsData);
        } catch (error) {
            console.error('加载热门标签失败:', error);
        }
    };

    // 处理标签操作
    const handleTagSubmit = async (values) => {
        try {
            setLoading(true);
            
            const tagData = {
                ...values,
                id: modalMode === 'edit' ? currentTag.id : Date.now(),
                creator: '当前用户',
                createTime: modalMode === 'edit' ? currentTag.createTime : new Date().toISOString(),
                useCount: modalMode === 'edit' ? currentTag.useCount : 0,
                lastUsed: modalMode === 'edit' ? currentTag.lastUsed : null
            };
            
            console.log('标签数据:', tagData);
            
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const actionText = modalMode === 'create' ? '创建' : '更新';
            message.success(`标签${actionText}成功！`);
            
            // 重置表单并关闭模态框
            tagForm.resetFields();
            setTagModalVisible(false);
            setCurrentTag(null);
            
            // 刷新列表
            loadTagList();
            
        } catch (error) {
            message.error('操作失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    // 创建标签
    const createTag = () => {
        setModalMode('create');
        setCurrentTag(null);
        setTagModalVisible(true);
        tagForm.resetFields();
    };

    // 编辑标签
    const editTag = (record) => {
        setModalMode('edit');
        setCurrentTag(record);
        setTagModalVisible(true);
        tagForm.setFieldsValue(record);
    };

    // 删除标签
    const deleteTag = (record) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除标签"${record.name}"吗？此操作不可恢复。`,
            okText: '确认删除',
            cancelText: '取消',
            okType: 'danger',
            onOk: async () => {
                try {
                    setLoading(true);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    message.success('标签删除成功！');
                    loadTagList();
                } catch (error) {
                    message.error('删除失败，请重试');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    // 批量操作
    const handleBatchOperation = async (values) => {
        try {
            setLoading(true);
            
            console.log('批量操作:', {
                operation: values.operation,
                tagIds: selectedTags,
                ...values
            });
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            message.success(`批量${values.operation === 'activate' ? '启用' : values.operation === 'deactivate' ? '禁用' : '删除'}成功！`);
            
            // 重置选择并刷新列表
            setSelectedTags([]);
            setBatchModalVisible(false);
            batchForm.resetFields();
            loadTagList();
            
        } catch (error) {
            message.error('批量操作失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    // 切换标签状态
    const toggleTagStatus = async (record) => {
        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const newStatus = record.status === 'active' ? 'inactive' : 'active';
            const actionText = newStatus === 'active' ? '启用' : '禁用';
            
            message.success(`标签${actionText}成功！`);
            loadTagList();
            
        } catch (error) {
            message.error('操作失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    const getStatusTag = (status) => {
        return status === 'active' 
            ? React.createElement(Tag, { color: 'green' }, '启用')
            : React.createElement(Tag, { color: 'red' }, '禁用');
    };

    const getCategoryTag = (category) => {
        const categoryOption = categoryOptions.find(opt => opt.value === category);
        return React.createElement(Tag, { 
            color: categoryOption?.color || '#8c8c8c' 
        }, categoryOption?.label || '未知');
    };

    const getTrendIcon = (trend) => {
        if (trend > 10) return '📈';
        if (trend > 0) return '📊';
        return '📉';
    };

    // 渲染统计卡片
    const renderStatsCards = () => {
        return React.createElement(Row, { gutter: 16, style: { marginBottom: 24 } }, [
            React.createElement(Col, { key: 'total', span: 6 },
                React.createElement(Card, { size: 'small' },
                    React.createElement(Statistic, {
                        title: '标签总数',
                        value: statsData.totalTags,
                        prefix: '🏷️',
                        valueStyle: { color: '#1890ff' }
                    })
                )
            ),
            React.createElement(Col, { key: 'active', span: 6 },
                React.createElement(Card, { size: 'small' },
                    React.createElement(Statistic, {
                        title: '启用标签',
                        value: statsData.activeTags,
                        prefix: '✅',
                        valueStyle: { color: '#52c41a' }
                    })
                )
            ),
            React.createElement(Col, { key: 'hot', span: 6 },
                React.createElement(Card, { size: 'small' },
                    React.createElement(Statistic, {
                        title: '热门标签',
                        value: statsData.hotTags,
                        prefix: '🔥',
                        valueStyle: { color: '#fa8c16' }
                    })
                )
            ),
            React.createElement(Col, { key: 'usage', span: 6 },
                React.createElement(Card, { size: 'small' },
                    React.createElement(Statistic, {
                        title: '今日使用',
                        value: statsData.todayUsage,
                        prefix: '📊',
                        valueStyle: { color: '#722ed1' }
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
            React.createElement(Col, { key: 'category', span: 5 },
                React.createElement(Select, {
                    placeholder: '标签分类',
                    value: filters.category,
                    onChange: (value) => setFilters(prev => ({ ...prev, category: value })),
                    style: { width: '100%' }
                }, [
                    React.createElement(Option, { key: 'all', value: 'all' }, '全部分类'),
                    ...categoryOptions.map(cat => 
                        React.createElement(Option, { key: cat.value, value: cat.value }, cat.label)
                    )
                ])
            ),
            React.createElement(Col, { key: 'status', span: 4 },
                React.createElement(Select, {
                    placeholder: '状态',
                    value: filters.status,
                    onChange: (value) => setFilters(prev => ({ ...prev, status: value })),
                    style: { width: '100%' }
                }, [
                    React.createElement(Option, { key: 'all', value: 'all' }, '全部状态'),
                    React.createElement(Option, { key: 'active', value: 'active' }, '启用'),
                    React.createElement(Option, { key: 'inactive', value: 'inactive' }, '禁用')
                ])
            ),
            React.createElement(Col, { key: 'search', span: 15 },
                React.createElement(Search, {
                    placeholder: '搜索标签名称或描述',
                    value: filters.keyword,
                    onChange: (e) => setFilters(prev => ({ ...prev, keyword: e.target.value })),
                    onSearch: loadTagList,
                    enterButton: true
                })
            )
        ]));
    };

    // 渲染热门标签
    const renderHotTags = () => {
        return React.createElement(Card, {
            title: '热门标签趋势',
            style: { marginBottom: 16 }
        }, React.createElement('div', {}, [
            React.createElement(Row, { key: 'hot-tags', gutter: 16 },
                hotTagList.map((tag, index) => 
                    React.createElement(Col, { key: tag.name, span: 6, style: { marginBottom: 16 } },
                        React.createElement(Card, { 
                            size: 'small',
                            style: { 
                                background: tag.trend > 15 ? '#fff7e6' : tag.trend > 10 ? '#f6ffed' : '#fafafa',
                                border: `1px solid ${tag.trend > 15 ? '#ffd591' : tag.trend > 10 ? '#b7eb8f' : '#d9d9d9'}`
                            }
                        }, [
                            React.createElement('div', {
                                key: 'tag-info',
                                style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
                            }, [
                                React.createElement('div', { key: 'tag-name' }, [
                                    React.createElement('div', {
                                        key: 'name',
                                        style: { fontWeight: 'bold', marginBottom: 4 }
                                    }, `${getTrendIcon(tag.trend)} ${tag.name}`),
                                    React.createElement('div', {
                                        key: 'count',
                                        style: { fontSize: 12, color: '#666' }
                                    }, `使用次数: ${tag.count}`)
                                ]),
                                React.createElement('div', {
                                    key: 'trend',
                                    style: { 
                                        textAlign: 'right',
                                        color: tag.trend > 0 ? '#52c41a' : '#f5222d',
                                        fontWeight: 'bold'
                                    }
                                }, `+${tag.trend}%`)
                            ])
                        ])
                    )
                )
            )
        ]));
    };

    // 表格列配置
    const columns = [
        {
            title: '标签信息',
            key: 'tagInfo',
            width: 200,
            render: (_, record) => React.createElement('div', {}, [
                React.createElement('div', {
                    key: 'name',
                    style: { marginBottom: 8 }
                }, [
                    React.createElement(Tag, {
                        key: 'tag',
                        color: record.color,
                        style: { marginRight: 8, fontWeight: 'bold' }
                    }, record.name),
                    record.isHot && React.createElement(Badge, {
                        key: 'hot',
                        count: '热门',
                        style: { backgroundColor: '#fa8c16' }
                    })
                ]),
                React.createElement('div', {
                    key: 'desc',
                    style: { fontSize: 12, color: '#666', lineHeight: 1.4 }
                }, record.description)
            ])
        },
        {
            title: '分类',
            key: 'category',
            width: 120,
            render: (_, record) => getCategoryTag(record.category)
        },
        {
            title: '使用统计',
            key: 'usage',
            width: 150,
            render: (_, record) => React.createElement('div', {}, [
                React.createElement('div', {
                    key: 'count',
                    style: { fontWeight: 'bold', color: '#1890ff' }
                }, `${record.useCount} 次`),
                React.createElement('div', {
                    key: 'last-used',
                    style: { fontSize: 11, color: '#999', marginTop: 2 }
                }, `最后使用: ${record.lastUsed || '从未使用'}`)
            ])
        },
        {
            title: '权重',
            key: 'weight',
            width: 80,
            render: (_, record) => React.createElement('div', {
                style: { textAlign: 'center' }
            }, [
                React.createElement('div', {
                    key: 'weight',
                    style: { fontWeight: 'bold' }
                }, record.weight),
                React.createElement(Progress, {
                    key: 'progress',
                    percent: record.weight,
                    size: 'small',
                    showInfo: false
                })
            ])
        },
        {
            title: '状态',
            key: 'status',
            width: 100,
            render: (_, record) => React.createElement('div', {}, [
                getStatusTag(record.status),
                React.createElement('div', {
                    key: 'switch',
                    style: { marginTop: 8 }
                }, React.createElement(Switch, {
                    size: 'small',
                    checked: record.status === 'active',
                    onChange: () => toggleTagStatus(record)
                }))
            ])
        },
        {
            title: '创建信息',
            key: 'createInfo',
            width: 150,
            render: (_, record) => React.createElement('div', {}, [
                React.createElement('div', {
                    key: 'creator',
                    style: { fontSize: 12, color: '#666' }
                }, `创建者: ${record.creator}`),
                React.createElement('div', {
                    key: 'time',
                    style: { fontSize: 11, color: '#999' }
                }, record.createTime)
            ])
        },
        {
            title: '操作',
            key: 'actions',
            width: 120,
            fixed: 'right',
            render: (_, record) => React.createElement(Space, { direction: 'vertical', size: 'small' }, [
                React.createElement(Space, { key: 'main-actions' }, [
                    React.createElement(Button, {
                        key: 'edit',
                        type: 'link',
                        size: 'small',
                        onClick: () => editTag(record)
                    }, '编辑'),
                    React.createElement(Button, {
                        key: 'delete',
                        type: 'link',
                        size: 'small',
                        danger: true,
                        onClick: () => deleteTag(record)
                    }, '删除')
                ])
            ])
        }
    ];

    // 渲染标签管理模态框
    const renderTagModal = () => {
        const title = modalMode === 'create' ? '创建标签' : '编辑标签';
        
        return React.createElement(Modal, {
            title: title,
            visible: tagModalVisible,
            onCancel: () => {
                setTagModalVisible(false);
                setCurrentTag(null);
                tagForm.resetFields();
            },
            footer: [
                React.createElement(Button, {
                    key: 'cancel',
                    onClick: () => {
                        setTagModalVisible(false);
                        setCurrentTag(null);
                        tagForm.resetFields();
                    }
                }, '取消'),
                React.createElement(Button, {
                    key: 'confirm',
                    type: 'primary',
                    loading: loading,
                    onClick: () => tagForm.submit()
                }, modalMode === 'create' ? '创建' : '更新')
            ],
            width: 600
        }, React.createElement(Form, {
            form: tagForm,
            layout: 'vertical',
            onFinish: handleTagSubmit
        }, [
            React.createElement(Row, { key: 'row1', gutter: 16 }, [
                React.createElement(Col, { key: 'name', span: 12 },
                    React.createElement(Form.Item, {
                        label: '标签名称',
                        name: 'name',
                        rules: [
                            { required: true, message: '请输入标签名称' },
                            { max: 20, message: '标签名称不能超过20个字符' }
                        ]
                    }, React.createElement(Input, {
                        placeholder: '请输入标签名称'
                    }))
                ),
                React.createElement(Col, { key: 'category', span: 12 },
                    React.createElement(Form.Item, {
                        label: '标签分类',
                        name: 'category',
                        rules: [{ required: true, message: '请选择标签分类' }]
                    }, React.createElement(Select, {
                        placeholder: '请选择标签分类'
                    }, categoryOptions.map(cat => 
                        React.createElement(Option, { key: cat.value, value: cat.value }, cat.label)
                    )))
                )
            ]),
            
            React.createElement(Row, { key: 'row2', gutter: 16 }, [
                React.createElement(Col, { key: 'color', span: 12 },
                    React.createElement(Form.Item, {
                        label: '标签颜色',
                        name: 'color',
                        initialValue: '#1890ff'
                    }, React.createElement(Input, {
                        type: 'color',
                        style: { width: '100%', height: 32 }
                    }))
                ),
                React.createElement(Col, { key: 'weight', span: 12 },
                    React.createElement(Form.Item, {
                        label: '权重 (0-100)',
                        name: 'weight',
                        initialValue: 50,
                        rules: [
                            { required: true, message: '请输入权重' },
                            { type: 'number', min: 0, max: 100, message: '权重必须在0-100之间' }
                        ]
                    }, React.createElement(Input, {
                        type: 'number',
                        min: 0,
                        max: 100,
                        placeholder: '0-100'
                    }))
                )
            ]),

            React.createElement(Form.Item, {
                key: 'description',
                label: '标签描述',
                name: 'description',
                rules: [
                    { required: true, message: '请输入标签描述' },
                    { max: 200, message: '描述不能超过200个字符' }
                ]
            }, React.createElement(TextArea, {
                placeholder: '请输入标签描述，用于AI搜索和内容分类',
                rows: 3,
                maxLength: 200,
                showCount: true
            })),

            React.createElement(Form.Item, {
                key: 'status',
                label: '标签状态',
                name: 'status',
                initialValue: 'active'
            }, React.createElement(Select, {}, [
                React.createElement(Option, { key: 'active', value: 'active' }, '启用'),
                React.createElement(Option, { key: 'inactive', value: 'inactive' }, '禁用')
            ]))
        ]));
    };

    // 渲染批量操作模态框
    const renderBatchModal = () => {
        return React.createElement(Modal, {
            title: `批量操作 - 已选择 ${selectedTags.length} 个标签`,
            visible: batchModalVisible,
            onCancel: () => {
                setBatchModalVisible(false);
                batchForm.resetFields();
            },
            footer: [
                React.createElement(Button, {
                    key: 'cancel',
                    onClick: () => {
                        setBatchModalVisible(false);
                        batchForm.resetFields();
                    }
                }, '取消'),
                React.createElement(Button, {
                    key: 'confirm',
                    type: 'primary',
                    loading: loading,
                    onClick: () => batchForm.submit()
                }, '确认执行')
            ]
        }, React.createElement(Form, {
            form: batchForm,
            layout: 'vertical',
            onFinish: handleBatchOperation
        }, [
            React.createElement(Form.Item, {
                key: 'operation',
                label: '操作类型',
                name: 'operation',
                rules: [{ required: true, message: '请选择操作类型' }]
            }, React.createElement(Select, {
                placeholder: '请选择要执行的操作'
            }, [
                React.createElement(Option, { key: 'activate', value: 'activate' }, '✅ 批量启用'),
                React.createElement(Option, { key: 'deactivate', value: 'deactivate' }, '❌ 批量禁用'),
                React.createElement(Option, { key: 'delete', value: 'delete' }, '🗑️ 批量删除')
            ])),

            React.createElement(Alert, {
                key: 'warning',
                type: 'warning',
                message: '批量操作提醒',
                description: '批量删除操作不可恢复，请谨慎操作。批量启用/禁用操作会立即生效。',
                style: { marginTop: 16 },
                showIcon: true
            })
        ]));
    };

    return React.createElement('div', { className: 'page-fade-in' }, [
        React.createElement('div', { key: 'header', className: 'page-header' }, [
            React.createElement('h1', { key: 'title', className: 'page-title' }, '内容标签管理'),
            React.createElement('p', { key: 'desc', className: 'page-description' }, 
                '维护视频内容标签，支持AI搜索和内容分类，提供热门标签统计和智能推荐功能'
            )
        ]),

        renderStatsCards(),
        renderHotTags(),

        React.createElement(Tabs, {
            key: 'main-tabs',
            defaultActiveKey: 'tag-list'
        }, [
            React.createElement(TabPane, {
                key: 'tag-list',
                tab: '标签管理'
            }, [
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
                        React.createElement('h3', { key: 'title' }, '标签列表'),
                        React.createElement(Space, { key: 'actions' }, [
                            selectedTags.length > 0 && React.createElement(Button, {
                                key: 'batch',
                                onClick: () => setBatchModalVisible(true)
                            }, `批量操作 (${selectedTags.length})`),
                            React.createElement(Button, {
                                key: 'refresh',
                                onClick: loadTagList
                            }, '刷新列表'),
                            React.createElement(Button, {
                                key: 'create',
                                type: 'primary',
                                onClick: createTag
                            }, '创建标签')
                        ])
                    ]),

                    React.createElement(Alert, {
                        key: 'info',
                        type: 'info',
                        message: '标签使用说明',
                        description: '标签用于视频内容分类和AI搜索，权重越高的标签在搜索结果中优先级越高。热门标签会根据使用频率自动更新。',
                        style: { marginBottom: 16 },
                        showIcon: true
                    }),

                    React.createElement(Table, {
                        key: 'table',
                        columns: columns,
                        dataSource: tagList,
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
                        scroll: { x: 1400 },
                        rowSelection: {
                            selectedRowKeys: selectedTags,
                            onChange: setSelectedTags,
                            getCheckboxProps: (record) => ({
                                disabled: record.isHot, // 热门标签不能批量操作
                            })
                        }
                    })
                ])
            ])
        ]),

        renderTagModal(),
        renderBatchModal()
    ]);
};

window.ContentTagManagement = ContentTagManagement; 