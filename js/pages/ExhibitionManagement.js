// 展会管理模块 - 基于 React 17 + Ant Design 4
// 对应需求：展会管理功能（增删改查、图片上传、状态管理）
const ExhibitionManagement = () => {
    const { 
        Card, Button, Table, Modal, Form, Input, Select, 
        DatePicker, Upload, message, Row, Col, Space, 
        Tag, Popconfirm, Image, Spin 
    } = antd;
    const { Search, TextArea } = Input;
    const { Option } = Select;
    const { RangePicker } = DatePicker;

    // --- 状态管理 ---
    const [loading, setLoading] = React.useState(false);
    const [list, setList] = React.useState([]);
    const [total, setTotal] = React.useState(0);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    
    // 筛选状态
    const [searchText, setSearchText] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [timeRange, setTimeRange] = React.useState(null);

    // 模态框与表单状态
    const [modalVisible, setModalVisible] = React.useState(false);
    const [editingItem, setEditingItem] = React.useState(null);
    const [form] = Form.useForm();
    
    // 图片上传状态 (Base64)
    const [coverImageUrl, setCoverImageUrl] = React.useState('');
    const [venueImageUrl, setVenueImageUrl] = React.useState('');

    // --- 初始化与数据加载 ---
    React.useEffect(() => {
        loadData();
    }, [currentPage, pageSize, searchText, statusFilter, timeRange]);

    const loadData = async () => {
        setLoading(true);
        try {
            // 模拟网络延迟
            await new Promise(resolve => setTimeout(resolve, 500));

            // 1. 获取所有数据 (Local Storage 或 Mock)
            let allData = [];
            try {
                const stored = localStorage.getItem('exhibitionList');
                if (stored) {
                    allData = JSON.parse(stored);
                } else {
                    // 默认 Mock 数据
                    allData = generateMockData();
                    localStorage.setItem('exhibitionList', JSON.stringify(allData));
                }
            } catch (e) {
                console.error('读取数据失败', e);
                allData = generateMockData();
            }

            // 2. 前端筛选逻辑
            let filtered = allData.filter(item => {
                // 名称搜索
                if (searchText && !item.name.toLowerCase().includes(searchText.toLowerCase())) {
                    return false;
                }
                // 状态筛选
                if (statusFilter !== 'all' && item.status !== statusFilter) {
                    return false;
                }
                // 时间筛选
                if (timeRange && timeRange.length === 2) {
                    const itemStart = window.moment(item.startTime);
                    const itemEnd = window.moment(item.endTime);
                    const filterStart = timeRange[0];
                    const filterEnd = timeRange[1];
                    
                    // 简单的交叉判断：展会时间段 与 筛选时间段 有重叠
                    if (itemEnd.isBefore(filterStart) || itemStart.isAfter(filterEnd)) {
                        return false;
                    }
                }
                return true;
            });

            // 3. 排序 (按创建时间倒序)
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            // 4. 更新状态
            setTotal(filtered.length);
            // 前端分页
            const start = (currentPage - 1) * pageSize;
            const end = start + pageSize;
            setList(filtered.slice(start, end));

        } catch (err) {
            message.error('加载数据失败');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // 生成模拟数据
    const generateMockData = () => {
        return [
            {
                id: 'ex_001',
                name: '2024年国际城市轨道交通展览会',
                location: '北京国际展览中心',
                startTime: '2024-06-15 09:00:00',
                endTime: '2024-06-18 17:00:00',
                status: 'not_started',
                description: '展示全球最新的轨道交通技术与装备，涵盖地铁、轻轨、单轨等多种制式。',
                liveUrl: 'https://live.example.com/ex001',
                coverImage: null,
                venueImage: null,
                createdAt: '2024-01-01 10:00:00'
            },
            {
                id: 'ex_002',
                name: '第十届智慧城轨高峰论坛',
                location: '上海世博中心',
                startTime: '2024-03-10 08:30:00',
                endTime: '2024-03-12 18:00:00',
                status: 'ended',
                description: '聚焦智慧城轨建设，探讨AI、大数据在轨道交通运营中的应用。',
                liveUrl: '',
                coverImage: null,
                venueImage: null,
                createdAt: '2023-12-15 14:20:00'
            }
        ];
    };

    // --- 交互处理 ---
    
    // 打开新建弹窗
    const handleAdd = () => {
        setEditingItem(null);
        setCoverImageUrl('');
        setVenueImageUrl('');
        form.resetFields();
        setModalVisible(true);
    };

    // 打开编辑弹窗
    const handleEdit = (record) => {
        setEditingItem(record);
        setCoverImageUrl(record.coverImage || '');
        setVenueImageUrl(record.venueImage || '');
        
        // 设置表单值，注意日期格式转换
        form.setFieldsValue({
            ...record,
            timeRange: [
                window.moment(record.startTime),
                window.moment(record.endTime)
            ]
        });
        setModalVisible(true);
    };

    // 删除
    const handleDelete = async (id) => {
        try {
            // 读最新数据
            const stored = localStorage.getItem('exhibitionList');
            let allData = stored ? JSON.parse(stored) : [];
            const newData = allData.filter(item => item.id !== id);
            localStorage.setItem('exhibitionList', JSON.stringify(newData));
            
            message.success('删除成功');
            loadData(); // 刷新
        } catch (e) {
            message.error('删除失败');
        }
    };

    // 提交保存
    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            
            setLoading(true); // 复用列表的loading或者单独设一个submitting
            
            // 模拟 API 延迟
            await new Promise(resolve => setTimeout(resolve, 800));

            const [start, end] = values.timeRange;
            
            const newItem = {
                id: editingItem ? editingItem.id : `ex_${Date.now()}`,
                name: values.name,
                location: values.location,
                startTime: start.format('YYYY-MM-DD HH:mm:ss'),
                endTime: end.format('YYYY-MM-DD HH:mm:ss'),
                status: values.status,
                description: values.description || '',
                liveUrl: values.liveUrl || '',
                coverImage: coverImageUrl,
                venueImage: venueImageUrl,
                createdAt: editingItem ? editingItem.createdAt : window.moment().format('YYYY-MM-DD HH:mm:ss'),
                updatedAt: window.moment().format('YYYY-MM-DD HH:mm:ss')
            };

            // 更新 LocalStorage
            const stored = localStorage.getItem('exhibitionList');
            let allData = stored ? JSON.parse(stored) : [];
            
            if (editingItem) {
                const idx = allData.findIndex(i => i.id === editingItem.id);
                if (idx > -1) {
                    allData[idx] = newItem;
                }
            } else {
                allData.unshift(newItem);
            }
            
            localStorage.setItem('exhibitionList', JSON.stringify(allData));
            
            message.success(editingItem ? '更新成功' : '创建成功');
            setModalVisible(false);
            loadData();
            
            // 触发全局事件，通知其他模块（如 LiveManagement）数据已更新
            window.dispatchEvent(new Event('exhibitionListChanged'));

        } catch (e) {
            console.error(e);
            // 验证失败不提示，由 Form 自动提示
        } finally {
            setLoading(false);
        }
    };

    // 图片上传处理 (转 Base64)
    const handleUpload = (file, type) => {
        // 验证格式和大小
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只能上传 JPG/PNG 格式的图片!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片大小不能超过 2MB!');
            return false;
        }

        // 转 Base64
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const base64 = reader.result;
            if (type === 'cover') setCoverImageUrl(base64);
            if (type === 'venue') setVenueImageUrl(base64);
        });
        reader.readAsDataURL(file);

        return false; // 阻止默认上传行为
    };

    // --- 渲染辅助 ---
    
    const getStatusTag = (status) => {
        const map = {
            'not_started': { color: 'blue', text: '未开始' },
            'ongoing': { color: 'green', text: '进行中' },
            'ended': { color: 'default', text: '已结束' }
        };
        const conf = map[status] || { color: 'default', text: '未知' };
        return React.createElement(Tag, { color: conf.color }, conf.text);
    };

    // 表格列配置
    const columns = [
        {
            title: '展会名称',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (text, record) => React.createElement('div', { style: { display: 'flex', alignItems: 'center' } }, [
                // 缩略图
                record.coverImage && React.createElement('img', {
                    key: 'img',
                    src: record.coverImage,
                    style: { width: 40, height: 40, marginRight: 8, objectFit: 'cover', borderRadius: 4 }
                }),
                React.createElement('span', { key: 'txt', style: { fontWeight: 500 } }, text)
            ])
        },
        {
            title: '地点',
            dataIndex: 'location',
            key: 'location',
            width: 150,
            ellipsis: true
        },
        {
            title: '展会时间',
            key: 'time',
            width: 240,
            render: (_, record) => React.createElement('div', {}, [
                React.createElement('div', { key: 's', style: { fontSize: 12, color: '#666' } }, `开始: ${record.startTime}`),
                React.createElement('div', { key: 'e', style: { fontSize: 12, color: '#666' } }, `结束: ${record.endTime}`)
            ])
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => getStatusTag(status)
        },
        {
            title: '直播链接',
            dataIndex: 'liveUrl',
            key: 'liveUrl',
            width: 100,
            render: (url) => url ? React.createElement('a', { href: url, target: '_blank' }, '查看') : '-'
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 160,
            render: (_, record) => React.createElement(Space, { size: 'middle' }, [
                React.createElement('a', { 
                    key: 'edit',
                    onClick: () => handleEdit(record) 
                }, '编辑详情'),
                React.createElement(Popconfirm, {
                    key: 'del',
                    title: '确定删除该展会吗？',
                    onConfirm: () => handleDelete(record.id),
                    okText: '是',
                    cancelText: '否'
                }, React.createElement('a', { style: { color: '#ff4d4f' } }, '删除'))
            ])
        }
    ];

    // --- 视图渲染 ---
    
    return React.createElement('div', { className: 'exhibition-management' }, [
        // 1. 头部标题
        React.createElement('div', { 
            key: 'header',
            style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 } 
        }, [
            React.createElement('h2', { key: 'title', style: { margin: 0 } }, '展会管理'),
            React.createElement(Button, { 
                key: 'btn', 
                type: 'primary', 
                icon: React.createElement('span', { className: 'anticon' }, '+'),
                onClick: handleAdd
            }, '新建展会')
        ]),

        // 2. 筛选区域
        React.createElement(Card, { key: 'filter', style: { marginBottom: 16 } }, 
            React.createElement(Row, { gutter: 16 }, [
                React.createElement(Col, { key: 'c1', span: 6 }, 
                    React.createElement(Search, { 
                        placeholder: '搜索展会名称',
                        onSearch: (val) => setSearchText(val),
                        onChange: (e) => setSearchText(e.target.value),
                        allowClear: true
                    })
                ),
                React.createElement(Col, { key: 'c2', span: 4 }, 
                    React.createElement(Select, { 
                        style: { width: '100%' }, 
                        placeholder: '展会状态',
                        value: statusFilter,
                        onChange: setStatusFilter
                    }, [
                        React.createElement(Option, { key: 'all', value: 'all' }, '全部状态'),
                        React.createElement(Option, { key: 'not_started', value: 'not_started' }, '未开始'),
                        React.createElement(Option, { key: 'ongoing', value: 'ongoing' }, '进行中'),
                        React.createElement(Option, { key: 'ended', value: 'ended' }, '已结束')
                    ])
                ),
                React.createElement(Col, { key: 'c3', span: 8 }, 
                    React.createElement(RangePicker, { 
                        style: { width: '100%' },
                        onChange: setTimeRange
                    })
                )
            ])
        ),

        // 3. 表格区域
        React.createElement(Card, { key: 'table-card' }, 
            React.createElement(Table, { 
                loading: loading,
                dataSource: list,
                columns: columns,
                rowKey: 'id',
                pagination: {
                    current: currentPage,
                    pageSize: pageSize,
                    total: total,
                    onChange: (page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);
                    },
                    showTotal: (t) => `共 ${t} 条`
                }
            })
        ),

        // 4. 编辑/新建 弹窗
        React.createElement(Modal, {
            key: 'modal',
            title: editingItem ? '编辑展会' : '新建展会',
            visible: modalVisible,
            width: 700,
            onOk: handleSave,
            onCancel: () => setModalVisible(false),
            confirmLoading: loading,
            destroyOnClose: true
        }, 
            React.createElement(Form, {
                form: form,
                layout: 'vertical',
                initialValues: { status: 'not_started' }
            }, [
                // 第一行：名称
                React.createElement(Form.Item, {
                    key: 'name',
                    name: 'name',
                    label: '展会名称',
                    rules: [{ required: true, message: '请输入展会名称' }]
                }, React.createElement(Input, { placeholder: '请输入展会名称' })),

                // 第二行：地点 & 状态
                React.createElement(Row, { key: 'r2', gutter: 16 }, [
                    React.createElement(Col, { span: 12, key: 'loc' }, 
                        React.createElement(Form.Item, {
                            name: 'location',
                            label: '展会地点',
                            rules: [{ required: true, message: '请输入展会地点' }]
                        }, React.createElement(Input, { placeholder: '地点' }))
                    ),
                    React.createElement(Col, { span: 12, key: 'stat' }, 
                        React.createElement(Form.Item, {
                            name: 'status',
                            label: '展会状态',
                            rules: [{ required: true, message: '请选择状态' }]
                        }, React.createElement(Select, {}, [
                            React.createElement(Option, { value: 'not_started' }, '未开始'),
                            React.createElement(Option, { value: 'ongoing' }, '进行中'),
                            React.createElement(Option, { value: 'ended' }, '已结束')
                        ]))
                    )
                ]),

                // 第三行：时间范围
                React.createElement(Form.Item, {
                    key: 'time',
                    name: 'timeRange',
                    label: '展会时间 (开始 - 结束)',
                    rules: [{ required: true, message: '请选择展会时间范围' }]
                }, React.createElement(RangePicker, { 
                    showTime: true, 
                    style: { width: '100%' },
                    format: 'YYYY-MM-DD HH:mm:ss'
                })),

                // 第四行：图片上传 (展会图片 & 展馆图片)
                React.createElement(Row, { key: 'r4', gutter: 16 }, [
                    React.createElement(Col, { span: 12, key: 'img1' }, 
                        React.createElement(Form.Item, {
                            label: '展会封面图片 (Max 2MB)'
                        }, React.createElement('div', {}, [
                            React.createElement(Upload, {
                                name: 'cover',
                                listType: 'picture-card',
                                showUploadList: false,
                                beforeUpload: (f) => handleUpload(f, 'cover')
                            }, coverImageUrl ? 
                                React.createElement('img', { src: coverImageUrl, style: { width: '100%' } }) :
                                React.createElement('div', {}, [
                                    React.createElement('div', { key: 'i' }, '+'),
                                    React.createElement('div', { key: 't' }, '上传')
                                ])
                            )
                        ]))
                    ),
                    React.createElement(Col, { span: 12, key: 'img2' }, 
                        React.createElement(Form.Item, {
                            label: '展馆导览图片 (Max 2MB)'
                        }, React.createElement('div', {}, [
                            React.createElement(Upload, {
                                name: 'venue',
                                listType: 'picture-card',
                                showUploadList: false,
                                beforeUpload: (f) => handleUpload(f, 'venue')
                            }, venueImageUrl ? 
                                React.createElement('img', { src: venueImageUrl, style: { width: '100%' } }) :
                                React.createElement('div', {}, [
                                    React.createElement('div', { key: 'i' }, '+'),
                                    React.createElement('div', { key: 't' }, '上传')
                                ])
                            )
                        ]))
                    )
                ]),

                // 第五行：直播链接
                React.createElement(Form.Item, {
                    key: 'live',
                    name: 'liveUrl',
                    label: '直播链接',
                    rules: [{ type: 'url', message: '请输入有效的 URL 链接' }]
                }, React.createElement(Input, { placeholder: 'http://...' })),

                // 第六行：描述 (富文本暂用 TextArea)
                React.createElement(Form.Item, {
                    key: 'desc',
                    name: 'description',
                    label: '展会描述'
                }, React.createElement(TextArea, { rows: 4, placeholder: '请输入展会详细描述' }))
            ])
        )
    ]);
};

// 导出组件
window.App.pages.ExhibitionManagement = ExhibitionManagement;
console.log('[ExhibitionManagement] React组件挂载成功');
