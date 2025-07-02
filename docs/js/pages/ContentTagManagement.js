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
    
    // 兴趣标签配置相关状态
    const [interestConfig, setInterestConfig] = React.useState({
        enabled: true,
        title: '选择您感兴趣的内容标签',
        subtitle: '根据您的兴趣，我们将为您推荐相关内容',
        maxSelections: 5,
        minSelections: 3
    });
    const [interestTags, setInterestTags] = React.useState([]);
    const [selectedInterestTags, setSelectedInterestTags] = React.useState([]);
    const [interestConfigForm] = Form.useForm();
    const [interestPreviewVisible, setInterestPreviewVisible] = React.useState(false);
    
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
        loadInterestConfig();
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

    // 加载兴趣标签配置
    const loadInterestConfig = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // 模拟已配置的兴趣标签
            const mockInterestTags = [
                { id: 1, name: '高速列车', category: 'technology', color: '#1890ff', appDescription: '高速列车技术与产品', displayOrder: 1, enabled: true },
                { id: 2, name: '城市轨道', category: 'scene', color: '#52c41a', appDescription: '城市轨道交通建设', displayOrder: 2, enabled: true },
                { id: 3, name: '智能控制', category: 'technology', color: '#722ed1', appDescription: '智能控制系统', displayOrder: 3, enabled: true },
                { id: 5, name: '安全系统', category: 'technology', color: '#f5222d', appDescription: '轨道交通安全技术', displayOrder: 4, enabled: true },
                { id: 7, name: '新能源技术', category: 'environment', color: '#13c2c2', appDescription: '绿色环保新能源', displayOrder: 5, enabled: false }
            ];
            
            setInterestTags(mockInterestTags);
            
            // 设置表单初始值
            interestConfigForm.setFieldsValue(interestConfig);
            
        } catch (error) {
            console.error('加载兴趣标签配置失败:', error);
        }
    };

    // 保存兴趣标签配置
    const saveInterestConfig = async (values) => {
        try {
            setLoading(true);
            
            console.log('保存兴趣标签配置:', {
                config: values,
                tags: interestTags
            });
            
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setInterestConfig(values);
            message.success('兴趣标签配置保存成功！');
            
        } catch (error) {
            message.error('保存失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    // 添加兴趣标签
    const addInterestTag = (tag) => {
        const isExist = interestTags.find(item => item.id === tag.id);
        if (isExist) {
            message.warning('该标签已添加为兴趣标签');
            return;
        }
        
        const newInterestTag = {
            ...tag,
            appDescription: tag.description,
            displayOrder: interestTags.length + 1,
            enabled: true
        };
        
        setInterestTags(prev => [...prev, newInterestTag]);
        message.success(`已添加"${tag.name}"为兴趣标签`);
    };

    // 移除兴趣标签
    const removeInterestTag = (tagId) => {
        setInterestTags(prev => prev.filter(item => item.id !== tagId));
        message.success('已移除兴趣标签');
    };

    // 更新兴趣标签
    const updateInterestTag = (tagId, updates) => {
        setInterestTags(prev => prev.map(item => 
            item.id === tagId ? { ...item, ...updates } : item
        ));
    };

    // 调整兴趣标签顺序
    const moveInterestTag = (dragIndex, hoverIndex) => {
        const draggedTag = interestTags[dragIndex];
        const newTags = [...interestTags];
        newTags.splice(dragIndex, 1);
        newTags.splice(hoverIndex, 0, draggedTag);
        
        // 重新设置displayOrder
        const updatedTags = newTags.map((tag, index) => ({
            ...tag,
            displayOrder: index + 1
        }));
        
        setInterestTags(updatedTags);
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

    // 渲染兴趣标签配置页面
    const renderInterestTagConfig = () => {
        return React.createElement('div', {}, [
            // 配置说明
            React.createElement(Alert, {
                key: 'info',
                type: 'info',
                message: '功能说明',
                description: '用户兴趣标签用于APP端新用户引导和长期未登录用户的兴趣重新选择。用户可以选择感兴趣的标签，系统会根据选择推荐相关内容。',
                style: { marginBottom: 24 },
                showIcon: true
            }),

            // 配置表单
            React.createElement(Card, {
                key: 'config-form',
                title: '基础配置',
                style: { marginBottom: 24 }
            }, React.createElement(Form, {
                form: interestConfigForm,
                layout: 'vertical',
                onFinish: saveInterestConfig,
                initialValues: interestConfig
            }, [
                React.createElement(Row, { key: 'row1', gutter: 16 }, [
                    React.createElement(Col, { key: 'enabled', span: 6 },
                        React.createElement(Form.Item, {
                            label: '启用状态',
                            name: 'enabled',
                            valuePropName: 'checked'
                        }, React.createElement(Switch, {
                            checkedChildren: '启用',
                            unCheckedChildren: '禁用'
                        }))
                    ),
                    React.createElement(Col, { key: 'min', span: 9 },
                        React.createElement(Form.Item, {
                            label: '最少选择数量',
                            name: 'minSelections',
                            rules: [{ required: true, message: '请输入最少选择数量' }]
                        }, React.createElement(Input, {
                            type: 'number',
                            min: 1,
                            max: 10,
                            placeholder: '建议1-3个'
                        }))
                    ),
                    React.createElement(Col, { key: 'max', span: 9 },
                        React.createElement(Form.Item, {
                            label: '最多选择数量',
                            name: 'maxSelections',
                            rules: [{ required: true, message: '请输入最多选择数量' }]
                        }, React.createElement(Input, {
                            type: 'number',
                            min: 1,
                            max: 20,
                            placeholder: '建议3-8个'
                        }))
                    )
                ]),
                React.createElement(Form.Item, {
                    key: 'title',
                    label: '页面标题',
                    name: 'title',
                    rules: [{ required: true, message: '请输入页面标题' }]
                }, React.createElement(Input, {
                    placeholder: '如：选择您感兴趣的内容标签'
                })),
                React.createElement(Form.Item, {
                    key: 'subtitle',
                    label: '页面副标题',
                    name: 'subtitle'
                }, React.createElement(TextArea, {
                    placeholder: '如：根据您的兴趣，我们将为您推荐相关内容',
                    rows: 2
                })),
                React.createElement(Form.Item, {
                    key: 'save-btn'
                }, React.createElement(Space, {}, [
                    React.createElement(Button, {
                        key: 'save',
                        type: 'primary',
                        htmlType: 'submit',
                        loading: loading
                    }, '保存配置'),
                    React.createElement(Button, {
                        key: 'preview',
                        onClick: () => setInterestPreviewVisible(true)
                    }, '预览效果')
                ]))
            ])),

            // 兴趣标签管理
            React.createElement(Card, {
                key: 'interest-tags',
                title: React.createElement('div', {
                    style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
                }, [
                    React.createElement('span', { key: 'title' }, '兴趣标签管理'),
                    React.createElement('div', { key: 'stats' }, [
                        React.createElement(Tag, { key: 'total', color: 'blue' }, `总计: ${interestTags.length}`),
                        React.createElement(Tag, { key: 'enabled', color: 'green' }, `启用: ${interestTags.filter(t => t.enabled).length}`)
                    ])
                ])
            }, [
                React.createElement(Row, { key: 'content', gutter: 24 }, [
                    // 左侧：可用标签
                    React.createElement(Col, { key: 'available', span: 12 }, [
                        React.createElement('h4', { key: 'title' }, '可用标签（点击添加为兴趣标签）'),
                        React.createElement('div', {
                            key: 'tags',
                            style: { 
                                maxHeight: 400, 
                                overflowY: 'auto', 
                                border: '1px solid #f0f0f0', 
                                borderRadius: 6, 
                                padding: 16 
                            }
                        }, tagList.filter(tag => tag.status === 'active').map(tag => {
                            const isAdded = interestTags.find(item => item.id === tag.id);
                            return React.createElement(Tag, {
                                key: tag.id,
                                color: isAdded ? '#d9d9d9' : tag.color,
                                style: { 
                                    margin: '4px 8px 4px 0', 
                                    cursor: isAdded ? 'not-allowed' : 'pointer',
                                    opacity: isAdded ? 0.5 : 1
                                },
                                onClick: isAdded ? undefined : () => addInterestTag(tag)
                            }, isAdded ? `${tag.name} (已添加)` : tag.name);
                        }))
                    ]),
                    
                    // 右侧：已配置的兴趣标签
                    React.createElement(Col, { key: 'configured', span: 12 }, [
                        React.createElement('h4', { key: 'title' }, '已配置兴趣标签'),
                        React.createElement('div', {
                            key: 'list',
                            style: { 
                                maxHeight: 400, 
                                overflowY: 'auto' 
                            }
                        }, interestTags.length === 0 
                            ? React.createElement('div', {
                                style: { 
                                    textAlign: 'center', 
                                    padding: 40, 
                                    color: '#999', 
                                    border: '1px dashed #d9d9d9', 
                                    borderRadius: 6 
                                }
                            }, [
                                React.createElement('div', { key: 'icon', style: { fontSize: 24, marginBottom: 8 } }, '🏷️'),
                                React.createElement('div', { key: 'text' }, '暂无兴趣标签，请从左侧添加')
                            ])
                            : interestTags.sort((a, b) => a.displayOrder - b.displayOrder).map((tag, index) => 
                                React.createElement(Card, {
                                    key: tag.id,
                                    size: 'small',
                                    style: { marginBottom: 8 }
                                }, [
                                    React.createElement('div', {
                                        key: 'content',
                                        style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
                                    }, [
                                        React.createElement('div', { key: 'info', style: { flex: 1 } }, [
                                            React.createElement('div', {
                                                key: 'name',
                                                style: { marginBottom: 4 }
                                            }, [
                                                React.createElement(Tag, {
                                                    key: 'tag',
                                                    color: tag.color,
                                                    style: { marginRight: 8 }
                                                }, tag.name),
                                                React.createElement('span', {
                                                    key: 'order',
                                                    style: { fontSize: 12, color: '#999' }
                                                }, `排序: ${tag.displayOrder}`)
                                            ]),
                                            React.createElement(Input, {
                                                key: 'desc',
                                                size: 'small',
                                                placeholder: 'APP显示描述',
                                                value: tag.appDescription,
                                                onChange: (e) => updateInterestTag(tag.id, { appDescription: e.target.value }),
                                                style: { marginBottom: 4 }
                                            })
                                        ]),
                                        React.createElement('div', { key: 'actions' }, [
                                            React.createElement(Switch, {
                                                key: 'switch',
                                                size: 'small',
                                                checked: tag.enabled,
                                                onChange: (checked) => updateInterestTag(tag.id, { enabled: checked }),
                                                style: { marginRight: 8 }
                                            }),
                                            React.createElement(Space, { key: 'btns', direction: 'vertical', size: 'small' }, [
                                                index > 0 && React.createElement(Button, {
                                                    key: 'up',
                                                    size: 'small',
                                                    type: 'text',
                                                    onClick: () => moveInterestTag(index, index - 1)
                                                }, '↑'),
                                                index < interestTags.length - 1 && React.createElement(Button, {
                                                    key: 'down',
                                                    size: 'small',
                                                    type: 'text',
                                                    onClick: () => moveInterestTag(index, index + 1)
                                                }, '↓'),
                                                React.createElement(Button, {
                                                    key: 'remove',
                                                    size: 'small',
                                                    type: 'text',
                                                    danger: true,
                                                    onClick: () => removeInterestTag(tag.id)
                                                }, '删除')
                                            ])
                                        ])
                                    ])
                                ])
                            )
                        )
                    ])
                ])
            ])
        ]);
    };

    // 渲染APP预览模态框
    const renderInterestPreview = () => {
        return React.createElement(Modal, {
            title: 'APP端效果预览',
            visible: interestPreviewVisible,
            onCancel: () => setInterestPreviewVisible(false),
            width: 400,
            footer: [
                React.createElement(Button, {
                    key: 'close',
                    onClick: () => setInterestPreviewVisible(false)
                }, '关闭预览')
            ]
        }, React.createElement('div', {
            style: {
                background: '#f5f5f5',
                borderRadius: 12,
                padding: 20,
                textAlign: 'center'
            }
        }, [
            React.createElement('h3', {
                key: 'title',
                style: { marginBottom: 16, fontSize: 18, fontWeight: 'bold' }
            }, interestConfig.title),
            React.createElement('p', {
                key: 'subtitle',
                style: { color: '#666', marginBottom: 24, lineHeight: 1.5 }
            }, interestConfig.subtitle),
            React.createElement('div', {
                key: 'tags',
                style: { marginBottom: 24 }
            }, interestTags.filter(tag => tag.enabled).map(tag => 
                React.createElement(Tag, {
                    key: tag.id,
                    color: tag.color,
                    style: { 
                        margin: '4px 8px 8px 0', 
                        padding: '8px 16px',
                        fontSize: 14,
                        borderRadius: 20,
                        cursor: 'pointer',
                        border: selectedInterestTags.includes(tag.id) ? '2px solid #1890ff' : 'none'
                    },
                    onClick: () => {
                        const newSelected = selectedInterestTags.includes(tag.id)
                            ? selectedInterestTags.filter(id => id !== tag.id)
                            : selectedInterestTags.length < interestConfig.maxSelections
                                ? [...selectedInterestTags, tag.id]
                                : selectedInterestTags;
                        setSelectedInterestTags(newSelected);
                    }
                }, [
                    React.createElement('div', { key: 'name', style: { fontWeight: 'bold' } }, tag.name),
                    React.createElement('div', { key: 'desc', style: { fontSize: 12, marginTop: 2 } }, tag.appDescription)
                ])
            )),
            React.createElement('div', {
                key: 'info',
                style: { fontSize: 12, color: '#999' }
            }, `请选择 ${interestConfig.minSelections}-${interestConfig.maxSelections} 个标签 (已选择 ${selectedInterestTags.length} 个)`),
            React.createElement(Button, {
                key: 'confirm',
                type: 'primary',
                size: 'large',
                disabled: selectedInterestTags.length < interestConfig.minSelections,
                style: { marginTop: 16, borderRadius: 20 }
            }, '确认选择')
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
                tab: '🏷️ 标签管理'
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
            ]),
            
            React.createElement(TabPane, {
                key: 'interest-config',
                tab: '📱 兴趣标签配置'
            }, renderInterestTagConfig())
        ]),

        renderTagModal(),
        renderBatchModal(),
        renderInterestPreview()
    ]);
};

window.ContentTagManagement = ContentTagManagement; 