// 展商中心页面 - 展商自主维护信息平台
const ExhibitorMaintenance = () => {
    console.log('ExhibitorCenter component is rendering...');
    
    const { Layout, Card, Form, Input, Button, Upload, Image, Select, message, Modal, Table, Tag, Space, Alert, Tabs, Row, Col, Divider, Steps, Descriptions, Tooltip, Statistic, List, Rate } = antd;
    const { TextArea } = Input;
    const { Option } = Select;
    const { TabPane } = Tabs;
    const { Step } = Steps;
    
    // 表单状态管理
    const [exhibitorForm] = Form.useForm();
    const [productForm] = Form.useForm();
    const [loading, setLoading] = React.useState(false);
    const [submitLoading, setSubmitLoading] = React.useState(false);
    
    // 数据状态管理
    const [exhibitorInfo, setExhibitorInfo] = React.useState({});
    const [productList, setProductList] = React.useState([]);
    const [changeHistory, setChangeHistory] = React.useState([]);
    const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
    
    // 产品管理状态
    const [productModalVisible, setProductModalVisible] = React.useState(false);
    const [editingProduct, setEditingProduct] = React.useState(null);
    
    // 产品状态定义
    const PRODUCT_STATUS = {
        DRAFT: 'draft',           // 草稿
        PENDING_REVIEW: 'pending_review', // 待审核
        ONLINE: 'online',         // 已上架
        OFFLINE: 'offline',       // 已下架
        REJECTED: 'rejected'      // 审核拒绝
    };

    // 产品评论数据
    const [productComments, setProductComments] = React.useState({});

    // 模拟展商数据
    const mockExhibitorData = {
        'ex_001': {
            id: 'ex_001',
            name: '中车集团',
            phone: '13800138001',
            logo: null,
            description: '中国中车股份有限公司是全球规模最大、品种最全、技术领先的轨道交通装备供应商。',
            website: 'https://www.crrcgc.cc',
            companyImages: [],
            contactPerson: '张经理',
            contactPhone: '13800138001',
            email: 'zhang@crrc.com',
            status: 'active',
            lastSubmitTime: '2024-01-15 10:30:00',
            approvalStatus: 'approved' // pending, approved, rejected
        },
        'ex_002': {
            id: 'ex_002',
            name: '比亚迪轨道交通',
            phone: '13800138002',
            logo: null,
            description: '比亚迪轨道交通有限公司专注于轨道交通领域的创新发展。',
            website: 'https://rail.byd.com',
            companyImages: [],
            contactPerson: '李总监',
            contactPhone: '13800138002',
            email: 'li@byd.com',
            status: 'active',
            lastSubmitTime: '2024-01-16 14:20:00',
            approvalStatus: 'pending'
        }
    };
    
    // 模拟产品数据 - 添加状态和评论
    const mockProductData = {
        'ex_001': [
            {
                id: 'p_001',
                name: '和谐号动车组',
                description: '高速动车组列车，最高运营速度350km/h',
                images: [],
                category: '动车组',
                specifications: '8节编组',
                features: '高速、节能、环保',
                status: PRODUCT_STATUS.ONLINE,
                comments: [
                    {
                        id: 'c_001',
                        userId: 'user_001',
                        userName: '张三',
                        content: '产品质量非常好',
                        rating: 5,
                        time: '2024-01-15 10:30:00'
                    }
                ],
                lastUpdateTime: '2024-01-15 10:30:00'
            }
        ]
    };
    
    // 产品分类选项
    const productCategories = [
        { value: '动车组', label: '动车组' },
        { value: '轨道交通', label: '轨道交通' },
        { value: '车辆制造', label: '车辆制造' },
        { value: '智能交通', label: '智能交通' },
        { value: '通信技术', label: '通信技术' },
        { value: '信号系统', label: '信号系统' },
        { value: '供电系统', label: '供电系统' },
        { value: '数字化解决方案', label: '数字化解决方案' }
    ];
    
    // 默认展商数据
    const defaultExhibitor = {
        id: 'camet_001',
        name: '中国城市轨道交通协会',
        phone: '13800138006',
        logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100',
        description: '中国城市轨道交通协会（China Association of Metros，简称CAMET）成立于2009年，是由城市轨道交通行业的相关企事业单位、科研院所、高等院校等自愿组成的全国性、行业性、非营利性社会组织。协会致力于推动中国城市轨道交通事业的发展，促进行业技术进步和管理水平提升。',
        website: 'http://www.camet.org.cn',
        companyImages: [],
        contactPerson: '张经理',
        contactPhone: '13800138006',
        email: 'zhang@camet.org.cn',
        status: 'active',
        lastSubmitTime: '2024-01-20 10:30:00',
        approvalStatus: 'approved'
    };

    // 默认产品数据
    const defaultProducts = [
        {
            id: 'p_001',
            name: '智能地铁运营系统',
            description: '基于人工智能和大数据的智能地铁运营管理系统，实现列车运行全自动化控制',
            images: [],
            category: '智能系统',
            specifications: '全线路覆盖',
            features: '智能化、自动化、安全可靠',
            status: PRODUCT_STATUS.ONLINE,
            comments: [
                {
                    id: 'c_001',
                    userId: 'user_001',
                    userName: '李工',
                    content: '系统运行稳定，大大提高了运营效率',
                    rating: 5,
                    time: '2024-01-15 10:30:00'
                }
            ],
            lastUpdateTime: '2024-01-15 10:30:00'
        },
        {
            id: 'p_002',
            name: '地铁安全监控平台',
            description: '覆盖地铁运营全过程的安全监控系统，包括站台监控、列车监控、客流监控等',
            images: [],
            category: '安防系统',
            specifications: '7*24小时监控',
            features: '全覆盖、高精度、快响应',
            status: PRODUCT_STATUS.ONLINE,
            comments: [
                {
                    id: 'c_002',
                    userId: 'user_002',
                    userName: '王工程师',
                    content: '监控覆盖全面，报警及时准确',
                    rating: 4,
                    time: '2024-01-16 14:20:00'
                }
            ],
            lastUpdateTime: '2024-01-16 14:20:00'
        }
    ];

    // 初始化数据
    React.useEffect(() => {
        setExhibitorInfo(defaultExhibitor);
        exhibitorForm.setFieldsValue(defaultExhibitor);
        loadChangeHistory();
    }, []);

    // 加载变更历史
    const loadChangeHistory = () => {
        const mockHistory = [
            {
                id: 'h_001',
                submitTime: '2024-01-20 10:30:00',
                changeType: 'exhibitor_info',
                status: 'approved',
                reviewer: '运营人员A',
                reviewTime: '2024-01-20 11:00:00',
                comment: '信息完整，审核通过'
            }
        ];
        setChangeHistory(mockHistory);
    };
    
    // 保存草稿
    const saveDraft = async () => {
        try {
            const values = await exhibitorForm.getFieldsValue();
            setExhibitorInfo(prev => ({ ...prev, ...values }));
            setHasUnsavedChanges(false);
            message.success('草稿已保存');
        } catch (error) {
            message.error('保存草稿失败');
        }
    };
    
    // 渲染展商信息标签页
    const renderExhibitorInfoTab = () => {
        return React.createElement('div', {
            style: { background: '#fff', padding: '24px', borderRadius: '8px' }
        }, [
            React.createElement(Form, {
                key: 'exhibitor-form',
                form: exhibitorForm,
                layout: 'vertical',
                onValuesChange: () => setHasUnsavedChanges(true) // 监听表单变化
            }, [
                React.createElement(Row, {
                    key: 'row1',
                    gutter: [16, 16]
                }, [
                    React.createElement(Col, {
                        key: 'col1',
                        span: 12
                    }, React.createElement(Form.Item, {
                        label: '公司名称',
                        name: 'name',
                        rules: [{ required: true, message: '请输入公司名称' }]
                    }, React.createElement(Input, {
                        placeholder: '请输入公司名称',
                        maxLength: 50
                    }))),
                    React.createElement(Col, {
                        key: 'col2',
                        span: 12
                    }, React.createElement(Form.Item, {
                        label: '联系人',
                        name: 'contactPerson',
                        rules: [{ required: true, message: '请输入联系人' }]
                    }, React.createElement(Input, {
                        placeholder: '请输入联系人姓名',
                        maxLength: 20
                    })))
                ]),
                React.createElement(Row, {
                    key: 'row2',
                    gutter: [16, 16]
                }, [
                    React.createElement(Col, {
                        key: 'col1',
                        span: 12
                    }, React.createElement(Form.Item, {
                        label: '手机号',
                        name: 'contactPhone'
                    }, React.createElement(Input, {
                        disabled: true,
                        placeholder: '系统自动填入'
                    }))),
                    React.createElement(Col, {
                        key: 'col2',
                        span: 12
                    }, React.createElement(Form.Item, {
                        label: '邮箱',
                        name: 'email',
                        rules: [{ type: 'email', message: '请输入正确的邮箱地址' }]
                    }, React.createElement(Input, {
                        placeholder: '请输入邮箱地址'
                    })))
                ]),
                React.createElement(Form.Item, {
                    key: 'website',
                    label: '公司网址',
                    name: 'website'
                }, React.createElement(Input, {
                    placeholder: '请输入公司网址',
                    prefix: '🌐'
                })),
                React.createElement(Form.Item, {
                    key: 'description',
                    label: '公司信息',
                    name: 'description',
                    rules: [{ required: true, message: '请输入公司信息' }]
                }, React.createElement(TextArea, {
                    placeholder: '请输入公司简介、主营业务等信息',
                    rows: 4,
                    maxLength: 500,
                    showCount: true
                })),
                React.createElement(Form.Item, {
                    key: 'logo',
                    label: '公司Logo',
                    name: 'logo'
                }, React.createElement(Upload, {
                    beforeUpload: (file) => {
                        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                        if (!isJpgOrPng) {
                            message.error('只能上传 JPG/PNG 格式的图片!');
                            return false;
                        }
                        const isLt5M = file.size / 1024 / 1024 < 5;
                        if (!isLt5M) {
                            message.error('图片大小不能超过 5MB!');
                            return false;
                        }
                        return false; // 阻止自动上传
                    },
                    onChange: (info) => {
                        // 处理图片上传
                        console.log('图片上传:', info);
                    },
                    listType: 'picture-card',
                    maxCount: 1
                }, React.createElement('div', null, [
                    React.createElement('div', { key: 'icon' }, '📷'),
                    React.createElement('div', { key: 'text' }, '上传Logo')
                ]))),
                React.createElement(Form.Item, {
                    key: 'images',
                    label: '宣传图片',
                    name: 'companyImages'
                }, React.createElement(Upload, {
                    beforeUpload: (file) => {
                        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                        if (!isJpgOrPng) {
                            message.error('只能上传 JPG/PNG 格式的图片!');
                            return false;
                        }
                        const isLt5M = file.size / 1024 / 1024 < 5;
                        if (!isLt5M) {
                            message.error('图片大小不能超过 5MB!');
                            return false;
                        }
                        return false; // 阻止自动上传
                    },
                    onChange: (info) => {
                        // 处理图片上传
                        console.log('图片上传:', info);
                    },
                    listType: 'picture-card',
                    maxCount: 5
                }, React.createElement('div', null, [
                    React.createElement('div', { key: 'icon' }, '🖼️'),
                    React.createElement('div', { key: 'text' }, '上传图片')
                ])))
            ]),
            React.createElement(Divider, { key: 'divider' }),
            React.createElement('div', {
                key: 'actions',
                style: { textAlign: 'center' }
            }, React.createElement(Button, {
                type: 'primary',
                size: 'large',
                loading: submitLoading,
                onClick: () => {
                    Modal.confirm({
                        title: '确认提交',
                        content: '确定要提交更改吗？提交后将等待运营人员审核。',
                        onOk: async () => {
                            setSubmitLoading(true);
                            try {
                                // 模拟提交
                                await new Promise(resolve => setTimeout(resolve, 1500));
                                
                                // 更新状态
                                setExhibitorInfo(prev => ({
                                    ...prev,
                                    lastSubmitTime: new Date().toLocaleString(),
                                    approvalStatus: 'pending'
                                }));
                                
                                setHasUnsavedChanges(false);
                                message.success('提交成功！请等待运营人员审核');
                                
                                // 添加到变更历史
                                const newHistory = {
                                    id: `h_${Date.now()}`,
                                    submitTime: new Date().toLocaleString(),
                                    changeType: 'exhibitor_info',
                                    status: 'pending',
                                    reviewer: null,
                                    reviewTime: null,
                                    comment: null
                                };
                                setChangeHistory(prev => [newHistory, ...prev]);
                                
                            } catch (error) {
                                message.error('提交失败，请重试');
                            } finally {
                                setSubmitLoading(false);
                            }
                        }
                    });
                },
                style: { minWidth: '200px' }
            }, '提交更改'))
        ]);
    };
    
    // 渲染产品信息标签页
    const renderProductInfoTab = () => {
        const productColumns = [
            {
                title: '产品名称',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) => React.createElement('div', null, [
                    React.createElement('div', {
                        key: 'name',
                        style: { fontWeight: 'bold', marginBottom: '4px' }
                    }, text),
                    React.createElement('div', {
                        key: 'category',
                        style: { color: '#666', fontSize: '12px' }
                    }, record.category),
                    React.createElement(Tag, {
                        key: 'status',
                        color: record.status === PRODUCT_STATUS.ONLINE ? 'green' :
                               record.status === PRODUCT_STATUS.PENDING_REVIEW ? 'orange' :
                               record.status === PRODUCT_STATUS.OFFLINE ? 'default' :
                               record.status === PRODUCT_STATUS.REJECTED ? 'red' : 'blue',
                        style: { marginTop: '4px' }
                    }, record.status === PRODUCT_STATUS.ONLINE ? '已上架' :
                       record.status === PRODUCT_STATUS.PENDING_REVIEW ? '待审核' :
                       record.status === PRODUCT_STATUS.OFFLINE ? '已下架' :
                       record.status === PRODUCT_STATUS.REJECTED ? '已拒绝' : '草稿')
                ])
            },
            {
                title: '产品简介',
                dataIndex: 'description',
                key: 'description',
                ellipsis: true
            },
            {
                title: '最后更新',
                dataIndex: 'lastUpdateTime',
                key: 'lastUpdateTime',
                width: 180
            },
            {
                title: '操作',
                key: 'actions',
                width: 280,
                render: (_, record) => React.createElement(Space, { size: 'small' }, [
                    React.createElement(Button, {
                        key: 'edit',
                        size: 'small',
                        type: 'link',
                        onClick: () => handleEditProduct(record)
                    }, '编辑'),
                    record.status !== PRODUCT_STATUS.ONLINE && 
                    record.status !== PRODUCT_STATUS.PENDING_REVIEW &&
                    React.createElement(Button, {
                        key: 'online',
                        size: 'small',
                        type: 'link',
                        onClick: () => handleProductOnline(record)
                    }, '申请上架'),
                    record.status === PRODUCT_STATUS.ONLINE &&
                    React.createElement(Button, {
                        key: 'offline',
                        size: 'small',
                        type: 'link',
                        danger: true,
                        onClick: () => handleProductOffline(record)
                    }, '下架'),
                    React.createElement(Button, {
                        key: 'comments',
                        size: 'small',
                        type: 'link',
                        onClick: () => handleViewComments(record)
                    }, `评论(${record.comments?.length || 0})`),
                    React.createElement(Button, {
                        key: 'delete',
                        size: 'small',
                        type: 'link',
                        danger: true,
                        onClick: () => handleDeleteProduct(record)
                    }, '删除')
                ])
            }
        ];
        
        return React.createElement('div', {
            style: { background: '#fff', padding: '24px', borderRadius: '8px' }
        }, [
            React.createElement('div', {
                key: 'header',
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px'
                }
            }, [
                React.createElement('h3', {
                    key: 'title',
                    style: { margin: 0 }
                }, '产品信息管理'),
                React.createElement(Button, {
                    key: 'add',
                    type: 'primary',
                    onClick: handleAddProduct,
                    icon: '➕'
                }, '添加产品')
            ]),
            React.createElement(Table, {
                key: 'product-table',
                columns: productColumns,
                dataSource: productList.map((item, index) => ({ ...item, key: index })),
                pagination: false,
                locale: { emptyText: '暂无产品信息，点击"添加产品"开始添加' }
            })
        ]);
    };
    
    // 渲染变更历史标签页
    const renderChangeHistoryTab = () => {
        const historyColumns = [
            {
                title: '提交时间',
                dataIndex: 'submitTime',
                key: 'submitTime',
                width: 180
            },
            {
                title: '变更类型',
                dataIndex: 'changeType',
                key: 'changeType',
                render: (type) => type === 'exhibitor_info' ? '展商信息' : '产品信息'
            },
            {
                title: '审核状态',
                dataIndex: 'status',
                key: 'status',
                render: (status) => {
                    const statusConfig = {
                        'pending': { color: 'orange', text: '待审核' },
                        'approved': { color: 'green', text: '已通过' },
                        'rejected': { color: 'red', text: '已拒绝' }
                    };
                    const config = statusConfig[status] || statusConfig['pending'];
                    return React.createElement(Tag, { color: config.color }, config.text);
                }
            },
            {
                title: '审核人',
                dataIndex: 'reviewer',
                key: 'reviewer',
                render: (reviewer) => reviewer || '-'
            },
            {
                title: '审核时间',
                dataIndex: 'reviewTime',
                key: 'reviewTime',
                render: (time) => time || '-'
            },
            {
                title: '备注',
                dataIndex: 'comment',
                key: 'comment',
                render: (comment) => comment || '-'
            }
        ];
        
        return React.createElement('div', {
            style: { background: '#fff', padding: '24px', borderRadius: '8px' }
        }, [
            React.createElement('h3', {
                key: 'title',
                style: { marginBottom: '24px' }
            }, '变更历史'),
            React.createElement(Table, {
                key: 'history-table',
                columns: historyColumns,
                dataSource: changeHistory.map((item, index) => ({ ...item, key: index })),
            pagination: false,
                locale: { emptyText: '暂无变更历史' }
            })
        ]);
    };
    
    // 产品模态框
    const renderProductModal = () => {
        return React.createElement(Modal, {
            title: editingProduct ? '编辑产品' : '添加产品',
            visible: productModalVisible,
            onCancel: () => {
                setProductModalVisible(false);
                setEditingProduct(null);
                productForm.resetFields();
            },
            footer: null,
            width: 600,
            destroyOnClose: true
        }, React.createElement(Form, {
            form: productForm,
            layout: 'vertical',
            onFinish: handleProductSave
        }, [
            React.createElement(Row, {
                key: 'row1',
                gutter: [16, 16]
            }, [
                React.createElement(Col, {
                    key: 'col1',
                    span: 12
                }, React.createElement(Form.Item, {
                    label: '产品名称',
                name: 'name',
                    rules: [{ required: true, message: '请输入产品名称' }]
                }, React.createElement(Input, {
                    placeholder: '请输入产品名称',
                    maxLength: 50
                }))),
                React.createElement(Col, {
                    key: 'col2',
                    span: 12
                }, React.createElement(Form.Item, {
                    label: '所属分类',
                    name: 'category',
                    rules: [{ required: true, message: '请选择产品分类' }]
                }, React.createElement(Select, {
                    placeholder: '请选择分类'
                }, productCategories.map(cat => 
                    React.createElement(Option, {
                        key: cat.value,
                        value: cat.value
                    }, cat.label)
                ))))
            ]),
            React.createElement(Form.Item, {
                key: 'description',
                label: '产品简介',
                name: 'description',
                rules: [{ required: true, message: '请输入产品简介' }]
            }, React.createElement(TextArea, {
                placeholder: '请输入产品简介、特点、用途等信息',
                rows: 3,
                maxLength: 300,
                showCount: true
            })),
            React.createElement(Form.Item, {
                key: 'images',
                label: '产品图片',
                name: 'images'
            }, React.createElement(Upload, {
                beforeUpload: (file) => {
                    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                    if (!isJpgOrPng) {
                        message.error('只能上传 JPG/PNG 格式的图片!');
                        return false;
                    }
                    const isLt5M = file.size / 1024 / 1024 < 5;
                    if (!isLt5M) {
                        message.error('图片大小不能超过 5MB!');
                        return false;
                    }
                    return false; // 阻止自动上传
                },
                onChange: (info) => {
                    // 处理图片上传
                    console.log('图片上传:', info);
                },
                listType: 'picture-card',
                maxCount: 3
            }, React.createElement('div', null, [
                React.createElement('div', { key: 'icon' }, '📷'),
                React.createElement('div', { key: 'text' }, '上传图片')
            ]))),
            React.createElement(Form.Item, {
                key: 'actions',
                style: { textAlign: 'right', marginTop: '24px' }
            }, React.createElement(Space, null, [
                React.createElement(Button, {
                    key: 'cancel',
                    onClick: () => {
                        setProductModalVisible(false);
                        setEditingProduct(null);
                        productForm.resetFields();
                    }
                }, '取消'),
                React.createElement(Button, {
                    key: 'submit',
                    type: 'primary',
                    htmlType: 'submit'
                }, '保存')
            ]))
        ]));
    };
    
    // 产品管理
    const handleAddProduct = () => {
        setEditingProduct(null);
        productForm.resetFields();
        setProductModalVisible(true);
    };
    
    const handleEditProduct = (product) => {
        setEditingProduct(product);
        productForm.setFieldsValue(product);
        setProductModalVisible(true);
    };
    
    const handleDeleteProduct = (product) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除产品"${product.name}"吗？`,
            onOk: () => {
                setProductList(prev => prev.filter(p => p.id !== product.id));
                setHasUnsavedChanges(true);
                message.success('产品删除成功');
            }
        });
    };

    const handleProductSave = async (values) => {
        try {
            if (editingProduct) {
                // 编辑产品
                setProductList(prev => prev.map(p => 
                    p.id === editingProduct.id ? { ...p, ...values } : p
                ));
                message.success('产品信息更新成功');
            } else {
                // 新增产品
                const newProduct = {
                    id: `p_${Date.now()}`,
                    ...values,
                    images: []
                };
                setProductList(prev => [...prev, newProduct]);
                message.success('产品添加成功');
            }
            
            setProductModalVisible(false);
            setEditingProduct(null);
            productForm.resetFields();
            setHasUnsavedChanges(true);
        } catch (error) {
            message.error('保存失败，请重试');
        }
    };
    
    // 处理产品上架申请
    const handleProductOnline = (product) => {
        Modal.confirm({
            title: '确认上架',
            content: '确定要申请上架该产品吗？上架后需要等待运营人员审核。',
            onOk: async () => {
                try {
                    // 更新产品状态
                    setProductList(prev => prev.map(p => 
                        p.id === product.id 
                            ? { 
                                ...p, 
                                status: PRODUCT_STATUS.PENDING_REVIEW,
                                lastUpdateTime: new Date().toLocaleString()
                            } 
                            : p
                    ));

                    // 添加到变更历史
                    const newHistory = {
                        id: `h_${Date.now()}`,
                        submitTime: new Date().toLocaleString(),
                        changeType: 'product_online',
                        status: 'pending',
                        productId: product.id,
                        productName: product.name,
                        reviewer: null,
                        reviewTime: null,
                        comment: null
                    };
                    setChangeHistory(prev => [newHistory, ...prev]);

                    message.success('上架申请已提交，请等待运营人员审核');
                } catch (error) {
                    message.error('操作失败，请重试');
                }
            }
        });
    };

    // 处理产品下架
    const handleProductOffline = (product) => {
        Modal.confirm({
            title: '确认下架',
            content: '确定要下架该产品吗？下架后该产品将不再对外展示。',
            onOk: async () => {
                try {
                    // 更新产品状态
                    setProductList(prev => prev.map(p => 
                        p.id === product.id 
                            ? { 
                                ...p, 
                                status: PRODUCT_STATUS.OFFLINE,
                                lastUpdateTime: new Date().toLocaleString()
                            } 
                            : p
                    ));

                    // 添加到变更历史
                    const newHistory = {
                        id: `h_${Date.now()}`,
                        submitTime: new Date().toLocaleString(),
                        changeType: 'product_offline',
                        status: 'approved',
                        productId: product.id,
                        productName: product.name,
                        reviewer: '系统',
                        reviewTime: new Date().toLocaleString(),
                        comment: '展商主动下架'
                    };
                    setChangeHistory(prev => [newHistory, ...prev]);

                    message.success('产品已下架');
                } catch (error) {
                    message.error('操作失败，请重试');
                }
            }
        });
    };

    // 查看产品评论
    const handleViewComments = (product) => {
        Modal.info({
            title: `${product.name} - 用户评论`,
            width: 600,
            content: React.createElement('div', {}, [
                React.createElement('div', {
                    key: 'stats',
                    style: { marginBottom: '16px' }
                }, [
                    React.createElement(Statistic, {
                        title: '平均评分',
                        value: product.comments?.length > 0 
                            ? (product.comments.reduce((sum, c) => sum + c.rating, 0) / product.comments.length).toFixed(1)
                            : '-',
                        suffix: '/ 5.0'
                    })
                ]),
                React.createElement(List, {
                    key: 'comments',
                    dataSource: product.comments || [],
                    locale: { emptyText: '暂无评论' },
                    renderItem: (comment) => React.createElement(List.Item, {}, [
                        React.createElement('div', {
                            style: { width: '100%' }
                        }, [
                            React.createElement('div', {
                                key: 'header',
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '8px'
                                }
                            }, [
                                React.createElement('span', {
                                    style: { fontWeight: 'bold' }
                                }, comment.userName),
                                React.createElement(Rate, {
                                    disabled: true,
                                    value: comment.rating,
                                    style: { fontSize: '14px' }
                                })
                            ]),
                            React.createElement('div', {
                                key: 'content',
                                style: { margin: '8px 0' }
                            }, comment.content),
                            React.createElement('div', {
                                key: 'time',
                                style: { color: '#999', fontSize: '12px' }
                            }, comment.time)
                        ])
                    ])
                })
            ])
        });
    };
    
    return React.createElement('div', {
        style: { 
            minHeight: '100vh',
            background: '#f5f5f5',
            padding: '24px'
        }
    }, [
        // 页面头部
        React.createElement('div', {
            key: 'header',
            style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                padding: '16px 24px',
                background: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }
        }, [
            React.createElement('div', {
                key: 'title',
                style: { display: 'flex', alignItems: 'center' }
            }, [
                React.createElement('h1', {
                    key: 'text',
                    style: { 
                        margin: 0, 
                        fontSize: '28px', 
                        fontWeight: 'bold',
                        color: '#1e293b',
                        marginRight: '16px'
                    }
                }, '🏢 展商中心'),
                React.createElement(Tag, {
                    key: 'status',
                    color: exhibitorInfo.approvalStatus === 'approved' ? 'green' : 
                           exhibitorInfo.approvalStatus === 'pending' ? 'orange' : 'red'
                }, exhibitorInfo.approvalStatus === 'approved' ? '已审核' : 
                   exhibitorInfo.approvalStatus === 'pending' ? '待审核' : '已拒绝')
            ]),
            React.createElement(Space, {
                key: 'actions'
            }, [
                hasUnsavedChanges && React.createElement(Button, {
                    key: 'save-draft',
                    onClick: saveDraft,
                    icon: '💾'
                }, '保存草稿')
            ])
        ]),

        // 欢迎信息
        React.createElement(Alert, {
            key: 'welcome',
            message: `${exhibitorInfo.name}`,
            description: `您可以在这里维护展商信息和产品信息。最后提交时间：${exhibitorInfo.lastSubmitTime || '未提交'}`,
            type: 'info',
            showIcon: true,
            style: { marginBottom: '24px' }
        }),

        // 主要内容区域
        React.createElement(Tabs, {
            key: 'main-tabs',
            defaultActiveKey: 'exhibitor-info',
            size: 'large'
        }, [
            React.createElement(TabPane, {
                key: 'exhibitor-info',
                tab: React.createElement('span', null, ['📋 ', '展商信息'])
            }, renderExhibitorInfoTab()),
            React.createElement(TabPane, {
                key: 'product-info',
                tab: React.createElement('span', null, ['📦 ', '产品信息'])
            }, renderProductInfoTab()),
            React.createElement(TabPane, {
                key: 'change-history',
                tab: React.createElement('span', null, ['📈 ', '变更历史'])
            }, renderChangeHistoryTab())
        ]),

        // 产品编辑模态框
        productModalVisible && renderProductModal()
    ]);
};

console.log('ExhibitorCenter component defined');
window.App.pages.ExhibitorMaintenance = ExhibitorMaintenance;
console.log('[ExhibitorMaintenance] 组件挂载成功'); 