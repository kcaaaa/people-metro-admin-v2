// 文创产品管理页面 - 列表/创建/发布/回收站
const CulturalProductManagement = () => {
    const { Tabs, Card, Table, Button, Input, Select, Space, Tag, Modal, Form, Switch, message, Row, Col, DatePicker, Upload, Radio, Popconfirm } = antd;
    const { TabPane } = Tabs;
    const { Option } = Select;
    const { TextArea } = Input;
    const { Dragger } = Upload;

    const [activeTab, setActiveTab] = React.useState('list');
    const [loading, setLoading] = React.useState(false);
    const [list, setList] = React.useState([]);
    const [recycleList, setRecycleList] = React.useState([]);
    const [pagination, setPagination] = React.useState({ current: 1, pageSize: 10, total: 0 });
    const [filters, setFilters] = React.useState({ keyword: '', status: 'all', category: 'all' });
    const [createForm] = Form.useForm();
    const [coverFile, setCoverFile] = React.useState(null);
    const [detail, setDetail] = React.useState(null);
    const [detailVisible, setDetailVisible] = React.useState(false);
    const [createModalVisible, setCreateModalVisible] = React.useState(false);
    const [companies, setCompanies] = React.useState([]);

    // 本地模拟存储键
    const STORAGE_KEY = 'cultural_products';
    const RECYCLE_KEY = 'cultural_products_recycle';

    // 加载公司列表
    const loadCompanies = React.useCallback(() => {
        const saved = localStorage.getItem('cultural_companies');
        if (saved) {
            try {
                const companiesData = JSON.parse(saved);
                setCompanies(companiesData.filter(c => c.status === 'active'));
            } catch (e) {
                console.error('加载公司数据失败:', e);
            }
        }
    }, []);

    React.useEffect(() => {
        loadCompanies();
    }, [loadCompanies]);

    const loadData = React.useCallback(() => {
        setLoading(true);
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const all = raw ? JSON.parse(raw) : [];
            let data = [...all];
            if (filters.status !== 'all') {
                data = data.filter(i => i.status === filters.status);
            }
            if (filters.category !== 'all') {
                data = data.filter(i => (i.categories || []).includes(filters.category));
            }
            if (filters.keyword) {
                const k = filters.keyword.trim();
                data = data.filter(i => (i.name || '').includes(k) || (i.description || '').includes(k));
            }
            setList(data);
            setPagination(prev => ({ ...prev, total: data.length }));
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // 初始化演示数据
    React.useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw || JSON.parse(raw).length === 0) {
            // 初始化演示数据
            const mockData = [
                {
                    id: 1,
                    name: '城轨文化纪念邮票册',
                    description: '精美设计的地铁文化纪念邮票册，收录了城市轨道交通发展历程中的重要时刻，是收藏和馈赠的佳品。',
                    categories: ['纪念品', '收藏品'],
                    tags: ['限量版', '收藏', '纪念'],
                    companyId: 1,
                    companyName: '轨道交通文创有限公司',
                    companyCode: 'RT-CULT-001',
                    isRecommended: true,
                    recommendOrder: 1,
                    status: 'published',
                    cover: { url: 'https://via.placeholder.com/300x300?text=邮票册' },
                    createdAt: '2024-01-10T10:00:00',
                    updatedAt: '2024-01-15T14:30:00'
                },
                {
                    id: 2,
                    name: '地铁主题文化T恤',
                    description: '舒适纯棉材质，印有独特的城市轨道交通主题图案，适合日常穿着，展现对城轨文化的热爱。',
                    categories: ['衍生品', '服饰'],
                    tags: ['舒适', '时尚', '日常'],
                    companyId: 2,
                    companyName: '城轨文化传媒公司',
                    companyCode: 'RT-CULT-002',
                    isRecommended: true,
                    recommendOrder: 2,
                    status: 'published',
                    cover: { url: 'https://via.placeholder.com/300x300?text=T恤' },
                    createdAt: '2024-01-12T09:00:00',
                    updatedAt: '2024-01-14T16:20:00'
                },
                {
                    id: 3,
                    name: '轨道交通模型套装',
                    description: '1:87比例精细还原的地铁列车模型，包含多个车型，适合模型爱好者和收藏家。',
                    categories: ['模型', '收藏品'],
                    tags: ['精细', '收藏', '限量'],
                    companyId: 3,
                    companyName: '地铁文创工作室',
                    companyCode: 'RT-CULT-003',
                    isRecommended: false,
                    recommendOrder: 0,
                    status: 'published',
                    cover: { url: 'https://via.placeholder.com/300x300?text=模型' },
                    createdAt: '2024-01-08T11:00:00',
                    updatedAt: '2024-01-13T10:15:00'
                },
                {
                    id: 4,
                    name: '城轨建设发展历程图册',
                    description: '图文并茂的城轨建设发展历程图册，记录了城市轨道交通从规划到运营的完整历程，具有很高的纪念和参考价值。',
                    categories: ['杂志', '图书'],
                    tags: ['历史', '纪念', '教育'],
                    companyId: 1,
                    companyName: '轨道交通文创有限公司',
                    companyCode: 'RT-CULT-001',
                    isRecommended: true,
                    recommendOrder: 3,
                    status: 'published',
                    cover: { url: 'https://via.placeholder.com/300x300?text=图册' },
                    createdAt: '2024-01-05T08:00:00',
                    updatedAt: '2024-01-11T13:45:00'
                },
                {
                    id: 5,
                    name: '地铁站主题钥匙扣',
                    description: '以各大地铁站为设计灵感的钥匙扣，材质优良，设计精美，是日常使用的实用纪念品。',
                    categories: ['纪念品', '衍生品'],
                    tags: ['实用', '日常', '纪念'],
                    companyId: 2,
                    companyName: '城轨文化传媒公司',
                    companyCode: 'RT-CULT-002',
                    isRecommended: false,
                    recommendOrder: 0,
                    status: 'published',
                    cover: { url: 'https://via.placeholder.com/300x300?text=钥匙扣' },
                    createdAt: '2024-01-03T14:00:00',
                    updatedAt: '2024-01-09T11:30:00'
                },
                {
                    id: 6,
                    name: '智能交通科普绘本',
                    description: '专为青少年设计的智能交通科普绘本，通过生动有趣的方式介绍城市轨道交通知识，寓教于乐。',
                    categories: ['图书', '教育'],
                    tags: ['科普', '教育', '青少年'],
                    companyId: 1,
                    companyName: '轨道交通文创有限公司',
                    companyCode: 'RT-CULT-001',
                    isRecommended: true,
                    recommendOrder: 4,
                    status: 'published',
                    cover: { url: 'https://via.placeholder.com/300x300?text=绘本' },
                    createdAt: '2024-01-01T09:00:00',
                    updatedAt: '2024-01-07T15:00:00'
                },
                {
                    id: 7,
                    name: '城轨主题马克杯',
                    description: '印有城市轨道交通标志和路线的陶瓷马克杯，简约时尚，适合办公和居家使用。',
                    categories: ['衍生品', '生活用品'],
                    tags: ['实用', '日常', '时尚'],
                    companyId: 3,
                    companyName: '地铁文创工作室',
                    companyCode: 'RT-CULT-003',
                    isRecommended: false,
                    recommendOrder: 0,
                    status: 'unpublished',
                    cover: { url: 'https://via.placeholder.com/300x300?text=马克杯' },
                    createdAt: '2024-01-06T10:00:00',
                    updatedAt: '2024-01-12T09:20:00'
                }
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
        }
        loadData();
        const rawRecycle = localStorage.getItem(RECYCLE_KEY);
        setRecycleList(rawRecycle ? JSON.parse(rawRecycle) : []);
    }, [loadData]);

    const saveAll = (items) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        setList(items);
        setPagination(prev => ({ ...prev, total: items.length }));
    };
    const saveRecycle = (items) => {
        localStorage.setItem(RECYCLE_KEY, JSON.stringify(items));
        setRecycleList(items);
    };

    const getStatusTag = (s) => {
        const map = { published: { color: 'green', text: '上架' }, unpublished: { color: 'orange', text: '下架' }, draft: { color: 'default', text: '草稿' } };
        const c = map[s] || { color: 'default', text: '未知' };
        return React.createElement(Tag, { color: c.color }, c.text);
    };

    const coverUploadProps = {
        name: 'cover',
        accept: 'image/*',
        maxCount: 1,
        fileList: coverFile ? [coverFile] : [],
        beforeUpload: (file) => {
            if (!file.type.startsWith('image/')) { message.error('请上传图片'); return false; }
            if (file.size / 1024 / 1024 > 5) { message.error('图片不能超过5MB'); return false; }
            const nf = { uid: Date.now(), name: file.name, status: 'done', url: URL.createObjectURL(file), originFileObj: file };
            setCoverFile(nf);
            return false;
        },
        onRemove: () => setCoverFile(null),
        listType: 'picture-card'
    };

    const handleCreate = (values) => {
        if (!coverFile) { message.error('请上传产品封面图'); return; }
        if (!values.companyId) { message.error('请选择来源公司'); return; }
        const raw = localStorage.getItem(STORAGE_KEY);
        const all = raw ? JSON.parse(raw) : [];
        const selectedCompany = companies.find(c => c.id === values.companyId);
        const item = {
            id: Date.now(),
            name: values.name,
            description: values.description || '',
            categories: values.categories || [],
            tags: values.tags || [],
            companyId: values.companyId,
            companyName: selectedCompany ? selectedCompany.name : '',
            companyCode: selectedCompany ? selectedCompany.code : '',
            isRecommended: !!values.isRecommended,
            recommendOrder: values.recommendOrder || 0,
            shelfTime: values.shelfTime ? values.shelfTime[0]?.toISOString?.() : null,
            unshelfTime: values.shelfTime ? values.shelfTime[1]?.toISOString?.() : null,
            status: values.status ? 'published' : 'unpublished',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            cover: coverFile,
            media: values.media || [],
        };
        const next = [item, ...all];
        saveAll(next);
        StateManager?.addNotification({ type: 'success', title: '新增文创产品', content: `已创建：${item.name}` });
        message.success('创建成功');
        createForm.resetFields();
        setCoverFile(null);
        setCreateModalVisible(false);
        loadData();
    };

    const publishItem = (record, publish = true) => {
        const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const idx = all.findIndex(i => i.id === record.id);
        if (idx > -1) {
            all[idx].status = publish ? 'published' : 'unpublished';
            all[idx].updatedAt = new Date().toISOString();
            saveAll(all);
            StateManager?.emit('content:statusChanged', { contentId: record.id, oldStatus: record.status, newStatus: all[idx].status, details: { publisher: AuthUtils.getCurrentUser()?.username || 'system' } });
            message.success(publish ? '已上架' : '已下架');
        }
    };

    const deleteItem = (record) => {
        const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const next = all.filter(i => i.id !== record.id);
        saveAll(next);
        const recycle = JSON.parse(localStorage.getItem(RECYCLE_KEY) || '[]');
        recycle.unshift({ ...record, deletedAt: new Date().toISOString() });
        saveRecycle(recycle);
        message.success('已移入回收站，保留30天');
    };

    const restoreItem = (record) => {
        const recycle = JSON.parse(localStorage.getItem(RECYCLE_KEY) || '[]');
        const remain = recycle.filter(i => i.id !== record.id);
        saveRecycle(remain);
        const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        saveAll([record, ...all]);
        message.success('已恢复');
    };

    const purgeItem = (record) => {
        const recycle = JSON.parse(localStorage.getItem(RECYCLE_KEY) || '[]');
        const remain = recycle.filter(i => i.id !== record.id);
        saveRecycle(remain);
        message.success('已永久删除');
    };

    const columns = [
        { title: '封面', key: 'cover', width: 80, render: (_, r) => React.createElement('div', { style: { width: 56, height: 56, background: `url(${r.cover?.url}) center/cover no-repeat`, borderRadius: 6 } }) },
        { title: '产品名称', dataIndex: 'name', key: 'name', width: 220 },
        { title: '所属分类', key: 'categories', render: (_, r) => (r.categories || []).map(c => React.createElement(Tag, { key: c }, c)) },
        { title: '标签', key: 'tags', render: (_, r) => (r.tags || []).map(t => React.createElement(Tag, { key: t, color: 'blue' }, t)) },
        { title: '来源公司', key: 'company', width: 180, render: (_, r) => r.companyName ? React.createElement(Tag, { color: 'cyan' }, `${r.companyCode} - ${r.companyName}`) : React.createElement(Tag, { color: 'default' }, '未设置') },
        { title: '状态', key: 'status', width: 120, render: (_, r) => getStatusTag(r.status) },
        { title: '创建时间', dataIndex: 'createdAt', width: 180 },
        { title: '更新时间', dataIndex: 'updatedAt', width: 180 },
        {
            title: '操作', key: 'actions', width: 240,
            render: (_, r) => React.createElement(Space, null,
                React.createElement(Button, { type: 'link', onClick: () => { setDetail(r); setDetailVisible(true); } }, '详情'),
                r.status === 'published'
                    ? React.createElement(Button, { type: 'link', danger: true, onClick: () => publishItem(r, false) }, '下架')
                    : React.createElement(Button, { type: 'link', onClick: () => publishItem(r, true) }, '上架'),
                React.createElement(Popconfirm, { title: '确认删除并移入回收站？', onConfirm: () => deleteItem(r) }, React.createElement(Button, { type: 'link', danger: true }, '删除'))
            )
        }
    ];

    const renderFilters = () => React.createElement(Card, { size: 'small', style: { marginBottom: 16 } },
        React.createElement(Row, { gutter: 16, align: 'middle' }, [
            React.createElement(Col, { key: 'status', span: 4 },
                React.createElement(Select, { value: filters.status, onChange: v => setFilters(prev => ({ ...prev, status: v })), style: { width: '100%' } }, [
                    React.createElement(Option, { key: 'all', value: 'all' }, '全部状态'),
                    React.createElement(Option, { key: 'published', value: 'published' }, '上架'),
                    React.createElement(Option, { key: 'unpublished', value: 'unpublished' }, '下架'),
                    React.createElement(Option, { key: 'draft', value: 'draft' }, '草稿')
                ])
            ),
            React.createElement(Col, { key: 'category', span: 4 },
                React.createElement(Select, { value: filters.category, onChange: v => setFilters(prev => ({ ...prev, category: v })), style: { width: '100%' } }, [
                    React.createElement(Option, { key: 'all', value: 'all' }, '全部分类'),
                    React.createElement(Option, { key: '杂志', value: '杂志' }, '杂志'),
                    React.createElement(Option, { key: '纪念品', value: '纪念品' }, '纪念品'),
                    React.createElement(Option, { key: '模型', value: '模型' }, '模型')
                ])
            ),
            React.createElement(Col, { key: 'kw', span: 8 },
                React.createElement(Input.Search, { placeholder: '按名称/描述搜索', value: filters.keyword, onChange: e => setFilters(prev => ({ ...prev, keyword: e.target.value })), onSearch: loadData, enterButton: true })
            ),
            React.createElement(Col, { key: 'actions', span: 8, style: { textAlign: 'right' } },
                React.createElement(Space, null,
                    React.createElement(Button, { onClick: loadData }, '刷新'),
                    React.createElement(Button, { type: 'primary', onClick: () => { createForm.resetFields(); setCoverFile(null); setCreateModalVisible(true); }, 'data-permission': 'cultural_product:create' }, '新增产品')
                )
            )
        ])
    );

    const renderList = () => React.createElement('div', null, [
        renderFilters(),
        React.createElement(Card, { key: 'table' },
            React.createElement(Table, {
                columns: columns,
                dataSource: list,
                loading: loading,
                rowKey: 'id',
                pagination: {
                    ...pagination,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (t) => `共 ${t} 条记录`,
                    onChange: (p, s) => setPagination(prev => ({ ...prev, current: p, pageSize: s }))
                },
                scroll: { x: 1000 }
            })
        )
    ]);

    const renderCreateModal = () => React.createElement(Modal, {
        key: 'create-modal',
        visible: createModalVisible,
        title: '新增文创产品',
        width: 900,
        onCancel: () => { setCreateModalVisible(false); createForm.resetFields(); setCoverFile(null); },
        footer: null
    }, [
        React.createElement(Form, { key: 'form', layout: 'vertical', form: createForm, onFinish: handleCreate }, [
            React.createElement(Row, { key: 'row1', gutter: 16 }, [
                React.createElement(Col, { key: 'left', span: 12 }, [
                    React.createElement(Form.Item, { label: '产品名称', name: 'name', rules: [{ required: true, message: '请输入产品名称' }] }, React.createElement(Input, { maxLength: 100, showCount: true })),
                    React.createElement(Form.Item, { label: '产品描述', name: 'description' }, React.createElement(TextArea, { rows: 6, maxLength: 2000, showCount: true })),
                    React.createElement(Form.Item, { label: '分类', name: 'categories' }, React.createElement(Select, { mode: 'multiple', options: [
                        { value: '杂志' }, { value: '纪念品' }, { value: '模型' }, { value: '衍生品' }
                    ] }))
                ]),
                React.createElement(Col, { key: 'right', span: 12 }, [
                    React.createElement(Form.Item, { label: '封面图', required: true }, React.createElement(Upload, coverUploadProps, !coverFile && React.createElement('div', { style: { padding: '8px 0' } }, [React.createElement('div', { key: 'i', style: { marginBottom: 8 } }, '🖼️'), React.createElement('div', { key: 't', style: { fontSize: 12 } }, '上传封面')]))),
                    React.createElement(Form.Item, { label: '标签', name: 'tags' }, React.createElement(Select, { mode: 'tags', tokenSeparators: [','] })),
                    React.createElement(Form.Item, { label: '是否推荐', name: 'isRecommended', valuePropName: 'checked' }, React.createElement(Switch, null)),
                    React.createElement(Form.Item, { label: '推荐排序', name: 'recommendOrder' }, React.createElement(Input, { type: 'number', min: 0 })),
                    React.createElement(Form.Item, { label: '上/下架时间', name: 'shelfTime' }, React.createElement(DatePicker.RangePicker, { showTime: true }))
                ])
            ]),
            React.createElement(Row, { key: 'row2', gutter: 16 }, [
                React.createElement(Col, { key: 'left2', span: 12 }, [
                    React.createElement(Form.Item, { 
                        label: '来源公司', 
                        name: 'companyId',
                        rules: [{ required: true, message: '请选择来源公司' }]
                    }, React.createElement(Select, { 
                        placeholder: '请选择来源公司',
                        showSearch: true,
                        filterOption: (input, option) => 
                            (option?.children?.join('') || '').toLowerCase().includes(input.toLowerCase())
                    }, companies.map(c => React.createElement(Option, { 
                        key: c.id, 
                        value: c.id 
                    }, `${c.code} - ${c.name}`))))
                ]),
                React.createElement(Col, { key: 'right2', span: 12 }, [
                    React.createElement(Form.Item, { label: '是否上架', name: 'status', valuePropName: 'checked' }, React.createElement(Switch, null))
                ])
            ]),
            React.createElement('div', { key: 'actions', style: { textAlign: 'center', marginTop: 24 } }, React.createElement(Space, { size: 'large' }, [
                React.createElement(Button, { key: 'cancel', onClick: () => { setCreateModalVisible(false); createForm.resetFields(); setCoverFile(null); } }, '取消'),
                React.createElement(Button, { key: 'reset', onClick: () => { createForm.resetFields(); setCoverFile(null); } }, '重置'),
                React.createElement(Button, { key: 'submit', type: 'primary', htmlType: 'submit', 'data-permission': 'cultural_product:create' }, '保存')
            ]))
        ])
    ]);

    const renderCreate = () => null; // 不再使用标签页

    const renderRecycle = () => React.createElement(Card, { key: 'recycle' },
        React.createElement(Table, {
            rowKey: 'id',
            dataSource: recycleList,
            columns: [
                { title: '产品名称', dataIndex: 'name' },
                { title: '删除时间', dataIndex: 'deletedAt', width: 200 },
                { title: '操作', key: 'act', width: 220, render: (_, r) => React.createElement(Space, null,
                    React.createElement(Button, { type: 'link', onClick: () => restoreItem(r) }, '恢复'),
                    React.createElement(Popconfirm, { title: '确认永久删除？', onConfirm: () => purgeItem(r) }, React.createElement(Button, { type: 'link', danger: true }, '永久删除'))
                ) }
            ],
            pagination: false
        })
    );

    const renderDetailModal = () => {
        if (!detail) return null;
        const company = companies.find(c => c.id === detail.companyId);
        return React.createElement(Modal, {
            visible: detailVisible,
            title: '产品详情',
            onCancel: () => setDetailVisible(false),
            footer: [React.createElement(Button, { key: 'c', onClick: () => setDetailVisible(false) }, '关闭')],
            width: 720
        }, React.createElement('div', { style: { lineHeight: 1.8 } }, [
            React.createElement('div', { key: 'name', style: { fontWeight: 600, fontSize: 16, marginBottom: 12 } }, detail.name),
            React.createElement('div', { key: 'desc', style: { color: '#666', marginBottom: 12 } }, detail.description || '—'),
            React.createElement('div', { key: 'cats' }, '分类：', (detail.categories || []).join('、') || '—'),
            React.createElement('div', { key: 'tags' }, '标签：', (detail.tags || []).join('、') || '—'),
            React.createElement('div', { key: 'company', style: { marginTop: 12 } }, [
                React.createElement('div', { key: 'title', style: { fontWeight: 600, marginBottom: 8 } }, '来源公司：'),
                company ? React.createElement('div', { key: 'info', style: { padding: 12, background: '#f5f5f5', borderRadius: 4 } }, [
                    React.createElement('div', { key: 'name' }, `公司名称：${company.name}`),
                    React.createElement('div', { key: 'code' }, `公司代码：${company.code}`),
                    company.contactName && React.createElement('div', { key: 'contact' }, `联系人：${company.contactName}`),
                    company.phone && React.createElement('div', { key: 'phone' }, `固定电话：${company.phone}`),
                    company.mobile && React.createElement('div', { key: 'mobile' }, `手机号码：${company.mobile}`),
                    company.email && React.createElement('div', { key: 'email' }, `联系邮箱：${company.email}`),
                    company.address && React.createElement('div', { key: 'address' }, `公司地址：${company.address}`)
                ]) : React.createElement('div', { key: 'none', style: { color: '#999' } }, '未设置来源公司')
            ]),
            React.createElement('div', { key: 'st' }, '状态：', getStatusTag(detail.status)),
            React.createElement('div', { key: 'ct' }, '创建时间：', detail.createdAt),
            React.createElement('div', { key: 'ut' }, '更新时间：', detail.updatedAt)
        ]));
    };

    return React.createElement('div', { className: 'page-fade-in' }, [
        React.createElement('div', { key: 'header', className: 'page-header' }, [
            React.createElement('h1', { key: 'title', className: 'page-title' }, '文创产品管理'),
            React.createElement('p', { key: 'desc', className: 'page-description' }, '创建、编辑、上/下架文创产品，支持回收站管理')
        ]),
        React.createElement(Tabs, { key: 'tabs', activeKey: activeTab, onChange: setActiveTab, size: 'large' }, [
            React.createElement(TabPane, { key: 'list', tab: React.createElement('span', null, ['📋 ', '产品列表']) }, renderList()),
            React.createElement(TabPane, { key: 'recycle', tab: React.createElement('span', null, ['🗑️ ', '回收站']) }, renderRecycle())
        ]),
        renderDetailModal(),
        renderCreateModal()
    ]);
};

window.App.pages.CulturalProductManagement = CulturalProductManagement;
console.log('[CulturalProductManagement] 组件挂载成功');


