// 参展公司管理页面 - 展会参展公司信息管理
const ExhibitorManagement = () => {
    console.log('ExhibitorManagement component is rendering...');
    
    const { Row, Col, Card, Button, Space, Alert, Tag, Table, Modal, Form, Input, Select, message, Upload, Image, Divider, Statistic, Progress, InputNumber, Radio, Switch, DatePicker, Tooltip, Steps, Descriptions, Tabs } = antd;
    const { TextArea } = Input;
    const { Option } = Select;
    const { RangePicker: DateRangePicker } = DatePicker;
    const { Dragger } = Upload;
    const { TabPane } = Tabs;
    
    // 状态管理
    const [companyModalVisible, setCompanyModalVisible] = React.useState(false);
    const [editingCompany, setEditingCompany] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [companyForm] = Form.useForm();
    
    // 审核相关状态
    const [auditModalVisible, setAuditModalVisible] = React.useState(false);
    const [currentAuditRecord, setCurrentAuditRecord] = React.useState(null);
    const [auditForm] = Form.useForm();
    const [pendingChanges, setPendingChanges] = React.useState([]);
    const [activeTab, setActiveTab] = React.useState('companies');
    
    // 导入功能状态
    const [importModalVisible, setImportModalVisible] = React.useState(false);
    const [importStep, setImportStep] = React.useState(0);
    const [uploadedFile, setUploadedFile] = React.useState(null);
    const [importData, setImportData] = React.useState([]);
    const [importValidation, setImportValidation] = React.useState({ valid: [], invalid: [] });
    const [importLoading, setImportLoading] = React.useState(false);
    const [importResults, setImportResults] = React.useState(null);
    
    // 搜索和筛选状态
    const [searchText, setSearchText] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [categoryFilter, setCategoryFilter] = React.useState('all');
    const [floorFilter, setFloorFilter] = React.useState('all');
    const [timeRange, setTimeRange] = React.useState(null);

    // 模拟参展公司数据
    const [companies, setCompanies] = React.useState([
        {
            id: 'company_001',
            name: '中车集团',
            logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100',
            description: '中国中车股份有限公司',
            floorId: 'floor_f1',
            areaId: 'area_a',
            boothNumber: 'A区-01',
            boothSize: '3x3',
            appAccount: 'crrc_official',
            contactPerson: '张经理',
            contactPhone: '13800138001',
            contactEmail: 'zhang@crrc.com',
            website: 'https://www.crrcgc.cc',
            category: '车辆制造',
            status: 'confirmed',
            created: '2024-01-12 14:30:00'
        },
        {
            id: 'company_002',
            name: '比亚迪轨道交通',
            logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100',
            description: '比亚迪轨道交通有限公司',
            floorId: 'floor_f1',
            areaId: 'area_a',
            boothNumber: 'A区-02',
            boothSize: '3x3',
            appAccount: 'byd_rail',
            contactPerson: '李总监',
            contactPhone: '13800138002',
            contactEmail: 'li@byd.com',
            website: 'https://rail.byd.com',
            category: '智能交通',
            status: 'confirmed',
            created: '2024-01-13 09:15:00'
        },
        {
            id: 'company_003',
            name: '华为技术',
            logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100',
            description: '华为技术有限公司',
            floorId: 'floor_f2',
            areaId: 'area_d',
            boothNumber: 'D区-03',
            boothSize: '6x3',
            appAccount: 'huawei_rail',
            contactPerson: '王工程师',
            contactPhone: '13800138003',
            contactEmail: 'wang@huawei.com',
            website: 'https://www.huawei.com',
            category: '通信技术',
            status: 'pending',
            created: '2024-01-14 16:45:00'
        },
        {
            id: 'company_004',
            name: '腾讯科技',
            logo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100',
            description: '腾讯科技(深圳)有限公司',
            floorId: 'floor_f2',
            areaId: 'area_e',
            boothNumber: 'E区-05',
            boothSize: '4x3',
            appAccount: 'tencent_smart',
            contactPerson: '刘产品经理',
            contactPhone: '13800138004',
            contactEmail: 'liu@tencent.com',
            website: 'https://www.tencent.com',
            category: '数字化解决方案',
            status: 'confirmed',
            created: '2024-01-15 10:20:00'
        },
        {
            id: 'company_005',
            name: '西门子交通',
            logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100',
            description: '西门子交通技术有限公司',
            floorId: 'floor_f3',
            areaId: 'area_g',
            boothNumber: 'G区-01',
            boothSize: '5x4',
            appAccount: 'siemens_mobility',
            contactPerson: 'Mueller先生',
            contactPhone: '13800138005',
            contactEmail: 'mueller@siemens.com',
            website: 'https://www.siemens.com/mobility',
            category: '信号系统',
            status: 'confirmed',
            created: '2024-01-16 14:00:00'
        }
    ]);

    // 模拟待审核变更数据
    React.useEffect(() => {
        // 初始化待审核变更数据
        const mockPendingChanges = [
            {
                id: 'change_001',
                exhibitorId: 'company_001',
                exhibitorName: '中车集团',
                changeType: 'exhibitor_info',
                submitTime: '2024-01-20 10:30:00',
                status: 'pending',
                changes: {
                    before: {
                        name: '中车集团',
                        description: '中国中车股份有限公司',
                        contactPerson: '张经理',
                        email: 'zhang@crrc.com',
                        website: 'https://www.crrcgc.cc'
                    },
                    after: {
                        name: '中车集团有限公司',
                        description: '中国中车股份有限公司是全球规模最大、品种最全、技术领先的轨道交通装备供应商',
                        contactPerson: '张总经理',
                        email: 'zhang.manager@crrc.com',
                        website: 'https://www.crrcgc.cc/cn'
                    }
                }
            },
            {
                id: 'change_002',
                exhibitorId: 'company_002',
                exhibitorName: '比亚迪轨道交通',
                changeType: 'product_info',
                submitTime: '2024-01-20 14:15:00',
                status: 'pending',
                changes: {
                    action: 'add_product',
                    product: {
                        name: '比亚迪云巴',
                        description: '新型轨道交通系统，适用于中小运量城市轨道交通',
                        category: '轨道交通',
                        images: []
                    }
                }
            },
            {
                id: 'change_003',
                exhibitorId: 'company_003',
                exhibitorName: '华为技术',
                changeType: 'exhibitor_info',
                submitTime: '2024-01-19 16:20:00',
                status: 'pending',
                changes: {
                    before: {
                        description: '华为技术有限公司',
                        contactPerson: '王工程师'
                    },
                    after: {
                        description: '华为技术有限公司，全球领先的ICT（信息与通信）基础设施和智能终端提供商',
                        contactPerson: '王高级工程师'
                    }
                }
            }
        ];
        setPendingChanges(mockPendingChanges);
    }, []);

    // 产品状态定义
    const PRODUCT_STATUS = {
        DRAFT: 'draft',           // 草稿
        PENDING_REVIEW: 'pending_review', // 待审核
        ONLINE: 'online',         // 已上架
        OFFLINE: 'offline',       // 已下架
        REJECTED: 'rejected'      // 审核拒绝
    };

    // 产品审核相关状态
    const [productAuditModalVisible, setProductAuditModalVisible] = React.useState(false);
    const [currentProductAudit, setCurrentProductAudit] = React.useState(null);
    const [productAuditForm] = Form.useForm();
    const [pendingProductChanges, setPendingProductChanges] = React.useState([]);

    // 模拟待审核产品数据
    React.useEffect(() => {
        const mockPendingProducts = [
            {
                id: 'change_p001',
                exhibitorId: 'company_001',
                exhibitorName: '中车集团',
                changeType: 'product_online',
                submitTime: '2024-01-20 11:30:00',
                status: 'pending',
                product: {
                    id: 'p_001',
                    name: '和谐号动车组',
                    description: '高速动车组列车，最高运营速度350km/h',
                    category: '动车组',
                    specifications: '8节编组',
                    features: '高速、节能、环保'
                }
            }
        ];
        setPendingProductChanges(mockPendingProducts);
    }, []);

    // 统计数据
    const statistics = React.useMemo(() => {
        const total = companies.length;
        const confirmed = companies.filter(c => c.status === 'confirmed').length;
        const pending = companies.filter(c => c.status === 'pending').length;
        const rejected = companies.filter(c => c.status === 'rejected').length;
        const boothUsage = `${confirmed}/100`; // 展位使用率
        const pendingAuditCount = pendingChanges.filter(c => c.status === 'pending').length;
        
        return { total, confirmed, pending, rejected, boothUsage, pendingAuditCount };
    }, [companies, pendingChanges]);

    React.useEffect(() => {
        loadCompanyData();
    }, []);

    // 模拟加载数据
    const loadCompanyData = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            message.success('参展公司数据加载成功');
        } catch (error) {
            message.error('数据加载失败');
        } finally {
            setLoading(false);
        }
    };

    // 审核变更申请
    const handleAuditChange = (record) => {
        setCurrentAuditRecord(record);
        setAuditModalVisible(true);
    };

    // 提交审核结果
    const handleAuditSubmit = async (values) => {
        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const { action, comment } = values;
            const newStatus = action === 'approve' ? 'approved' : 'rejected';
            
            // 更新待审核列表
            setPendingChanges(prev => prev.map(change => 
                change.id === currentAuditRecord.id 
                    ? { 
                        ...change, 
                        status: newStatus,
                        reviewer: '运营人员',
                        reviewTime: new Date().toLocaleString(),
                        reviewComment: comment
                    }
                    : change
            ));
            
            // 如果审核通过，更新展商信息
            if (action === 'approve' && currentAuditRecord.changeType === 'exhibitor_info') {
                setCompanies(prev => prev.map(company => 
                    company.id === currentAuditRecord.exhibitorId
                        ? { ...company, ...currentAuditRecord.changes.after }
                        : company
                ));
            }
            
            setAuditModalVisible(false);
            setCurrentAuditRecord(null);
            auditForm.resetFields();
            
            message.success(`${action === 'approve' ? '审核通过' : '审核拒绝'}操作完成`);
        } catch (error) {
            message.error('审核操作失败');
        } finally {
            setLoading(false);
        }
    };

    // 处理产品审核
    const handleProductAudit = (record) => {
        setCurrentProductAudit(record);
        setProductAuditModalVisible(true);
    };

    // 提交产品审核结果
    const handleProductAuditSubmit = async (values) => {
        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const { action, comment } = values;
            const newStatus = action === 'approve' ? 'approved' : 'rejected';
            
            // 更新待审核列表
            setPendingProductChanges(prev => prev.map(change => 
                change.id === currentProductAudit.id 
                    ? { 
                        ...change, 
                        status: newStatus,
                        reviewer: '运营人员',
                        reviewTime: new Date().toLocaleString(),
                        reviewComment: comment
                    }
                    : change
            ));
            
            // 如果审核通过，更新产品状态
            if (action === 'approve') {
                // 这里应该调用API更新产品状态
                message.success('产品已上架');
            } else {
                message.success('已拒绝产品上架申请');
            }
            
            setProductAuditModalVisible(false);
            setCurrentProductAudit(null);
            productAuditForm.resetFields();
            
        } catch (error) {
            message.error('审核操作失败');
        } finally {
            setLoading(false);
        }
    };

    // 数据筛选
    const filteredCompanies = React.useMemo(() => {
        return companies.filter(company => {
            // 文本搜索
            if (searchText && 
                !company.name?.toLowerCase().includes(searchText.toLowerCase()) && 
                !company.description?.toLowerCase().includes(searchText.toLowerCase()) &&
                !company.contactPerson?.toLowerCase().includes(searchText.toLowerCase()) &&
                !company.boothNumber?.toLowerCase().includes(searchText.toLowerCase())) {
                return false;
            }
            
            // 状态筛选
            if (statusFilter !== 'all' && company.status !== statusFilter) {
                return false;
            }
            
            // 分类筛选
            if (categoryFilter !== 'all' && company.category !== categoryFilter) {
                return false;
            }
            
            return true;
        });
    }, [companies, searchText, statusFilter, categoryFilter]);

    // 重置筛选条件
    const resetFilters = () => {
        setSearchText('');
        setStatusFilter('all');
        setCategoryFilter('all');
        setFloorFilter('all');
        setTimeRange(null);
    };

    // 导出数据
    const handleExport = () => {
        message.loading('正在导出参展公司数据...', 2);
        setTimeout(() => {
            message.success(`已导出 ${filteredCompanies.length} 条参展公司数据`);
        }, 2000);
    };

    // 创建新公司
    const createNewCompany = () => {
        setEditingCompany(null);
        companyForm.resetFields();
        setCompanyModalVisible(true);
    };

    // 编辑公司
    const editCompany = (company) => {
        setEditingCompany(company);
        companyForm.setFieldsValue(company);
        setCompanyModalVisible(true);
    };

    // 删除公司
    const deleteCompany = (company) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除参展公司"${company.name}"吗？此操作不可恢复。`,
            okText: '确认删除',
            cancelText: '取消',
            okType: 'danger',
            onOk() {
                setCompanies(prev => prev.filter(c => c.id !== company.id));
                message.success('参展公司删除成功');
            }
        });
    };

    // 审核公司
    const reviewCompany = (company, status) => {
        const statusText = {
            'confirmed': '通过',
            'rejected': '拒绝'
        };
        
        Modal.confirm({
            title: '确认审核',
            content: `确定要${statusText[status]}参展公司"${company.name}"的申请吗？`,
            okText: `确认${statusText[status]}`,
            cancelText: '取消',
            onOk() {
                setCompanies(prev => 
                    prev.map(c => 
                        c.id === company.id ? { ...c, status } : c
                    )
                );
                message.success(`参展公司审核${statusText[status]}成功`);
            }
        });
    };

    // 保存公司信息
    const handleCompanySave = async (values) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (editingCompany) {
                // 编辑现有公司
                setCompanies(prev => 
                    prev.map(company => 
                        company.id === editingCompany.id 
                            ? { ...company, ...values }
                            : company
                    )
                );
                message.success('参展公司信息更新成功');
            } else {
                // 创建新公司
                const newCompany = {
                    id: `company_${Date.now()}`,
                    ...values,
                    status: 'pending',
                    created: new Date().toLocaleString()
                };
                setCompanies(prev => [newCompany, ...prev]);
                message.success('新参展公司创建成功');
            }
            
            setCompanyModalVisible(false);
            companyForm.resetFields();
            setEditingCompany(null);
        } catch (error) {
            message.error('保存失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    // 状态渲染
    const renderStatus = (status) => {
        const statusConfig = {
            'confirmed': { color: 'green', text: '已审核' },
            'pending': { color: 'orange', text: '待审核' },
            'rejected': { color: 'red', text: '已拒绝' }
        };
        const config = statusConfig[status] || statusConfig['pending'];
        return React.createElement(Tag, { color: config.color }, config.text);
    };

    // 表格列定义
    const columns = [
        {
            title: '公司信息',
            key: 'company',
            width: 300,
            render: (_, record) => React.createElement('div', {
                style: { display: 'flex', alignItems: 'center' }
            }, [
                React.createElement(Image, {
                    key: 'logo',
                    src: record.logo,
                    alt: record.name,
                    width: 50,
                    height: 50,
                    style: { borderRadius: '4px', marginRight: '12px' }
                }),
                React.createElement('div', { key: 'info' }, [
                    React.createElement('div', {
                        key: 'name',
                        style: { fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }
                    }, record.name),
                    React.createElement('div', {
                        key: 'description',
                        style: { color: '#666', fontSize: '12px', marginBottom: '4px' }
                    }, record.description),
                    React.createElement('div', {
                        key: 'category',
                        style: { color: '#999', fontSize: '12px' }
                    }, record.category)
                ])
            ])
        },
        {
            title: '展位信息',
            key: 'booth',
            width: 150,
            render: (_, record) => React.createElement('div', {}, [
                React.createElement('div', {
                    key: 'number',
                    style: { fontWeight: 'bold', marginBottom: '4px' }
                }, record.boothNumber),
                React.createElement('div', {
                    key: 'size',
                    style: { color: '#666', fontSize: '12px' }
                }, `规格: ${record.boothSize}`)
            ])
        },
        {
            title: '联系信息',
            key: 'contact',
            width: 200,
            render: (_, record) => React.createElement('div', {}, [
                React.createElement('div', {
                    key: 'person',
                    style: { marginBottom: '4px' }
                }, record.contactPerson),
                React.createElement('div', {
                    key: 'phone',
                    style: { color: '#666', fontSize: '12px', marginBottom: '2px' }
                }, record.contactPhone),
                React.createElement('div', {
                    key: 'email',
                    style: { color: '#666', fontSize: '12px' }
                }, record.contactEmail)
            ])
        },
        {
            title: 'APP账号',
            dataIndex: 'appAccount',
            key: 'appAccount',
            width: 120,
            render: (account) => React.createElement(Tag, { 
                color: 'blue' 
            }, account)
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: renderStatus
        },
        {
            title: '创建时间',
            dataIndex: 'created',
            key: 'created',
            width: 150
        },
        {
            title: '操作',
            key: 'actions',
            width: 250,
            render: (_, record) => React.createElement(Space, { 
                size: 'small',
                direction: 'vertical'
            }, [
                React.createElement(Space, { key: 'row1', size: 'small' }, [
                    React.createElement(Button, {
                        key: 'edit',
                        size: 'small',
                        onClick: () => editCompany(record)
                    }, '编辑'),
                    React.createElement(Button, {
                        key: 'view',
                        size: 'small',
                        type: 'primary',
                        onClick: () => message.info('查看详情功能开发中')
                    }, '详情')
                ]),
                React.createElement(Space, { key: 'row2', size: 'small' }, [
                    record.status === 'pending' && React.createElement(Button, {
                        key: 'approve',
                        size: 'small',
                        type: 'primary',
                        onClick: () => reviewCompany(record, 'confirmed')
                    }, '通过'),
                    record.status === 'pending' && React.createElement(Button, {
                        key: 'reject',
                        size: 'small',
                        danger: true,
                        onClick: () => reviewCompany(record, 'rejected')
                    }, '拒绝'),
                    React.createElement(Button, {
                        key: 'delete',
                        size: 'small',
                        danger: true,
                        onClick: () => deleteCompany(record)
                    }, '删除')
                ])
            ])
        }
    ];

    // 导入模板数据
    const importTemplate = [
        {
            name: '公司名称',
            description: '公司描述',
            category: '车辆制造',
            boothNumber: 'A区-01',
            boothSize: '3x3',
            appAccount: 'demo_account',
            contactPerson: '张三',
            contactPhone: '13800138000',
            contactEmail: 'zhangsan@example.com',
            website: 'https://example.com'
        }
    ];

    // 下载导入模板
    const downloadImportTemplate = (format = 'excel') => {
        if (format === 'excel') {
            // 模拟Excel文件下载
            const csvContent = [
                ['公司名称', '公司描述', '公司分类', '展位号', '展位规格', 'APP账号', '联系人', '联系电话', '联系邮箱', '公司网站'],
                ['测试公司1', '测试公司1描述', '车辆制造', 'T区-01', '3x3', 'test_account1', '张三', '13800000001', 'test1@example.com', 'https://test1.com'],
                ['测试公司2', '测试公司2描述', '智能交通', 'T区-02', '3x3', 'test_account2', '李四', '13800000002', 'test2@example.com', 'https://test2.com'],
                ['测试公司3', '测试公司3描述', '通信技术', 'T区-03', '3x3', 'test_account3', '王五', '13800000003', 'test3@example.com', 'https://test3.com'],
                ['', '', '', '', '', '', '', '', '', '']
            ].map(row => row.join(',')).join('\n');
            
            const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', '参展公司导入模板.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            message.success('展商导入模板下载成功');
        }
    };

    // 解析上传的文件
    const parseUploadedFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target.result;
                    const lines = text.split('\n').filter(line => line.trim());
                    
                    if (lines.length < 2) {
                        reject(new Error('文件内容格式不正确，至少需要标题行和一行数据'));
                        return;
                    }
                    
                    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
                    const expectedHeaders = ['公司名称', '公司描述', '公司分类', '展位号', '展位规格', 'APP账号', '联系人', '联系电话', '联系邮箱', '公司网站'];
                    
                    // 验证标题行
                    const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
                    if (missingHeaders.length > 0) {
                        reject(new Error(`缺少必要的列：${missingHeaders.join(', ')}`));
                        return;
                    }
                    
                    // 解析数据行
                    const data = [];
                    for (let i = 1; i < lines.length; i++) {
                        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
                        if (values.some(v => v)) { // 跳过空行
                            const row = {};
                            headers.forEach((header, index) => {
                                const value = values[index] || '';
                                switch (header) {
                                    case '公司名称':
                                        row.name = value;
                                        break;
                                    case '公司描述':
                                        row.description = value;
                                        break;
                                    case '公司分类':
                                        row.category = value;
                                        break;
                                    case '展位号':
                                        row.boothNumber = value;
                                        break;
                                    case '展位规格':
                                        row.boothSize = value;
                                        break;
                                    case 'APP账号':
                                        row.appAccount = value;
                                        break;
                                    case '联系人':
                                        row.contactPerson = value;
                                        break;
                                    case '联系电话':
                                        row.contactPhone = value;
                                        break;
                                    case '联系邮箱':
                                        row.contactEmail = value;
                                        break;
                                    case '公司网站':
                                        row.website = value;
                                        break;
                                }
                            });
                            row.rowIndex = i;
                            data.push(row);
                        }
                    }
                    
                    resolve(data);
                } catch (error) {
                    reject(new Error('文件解析失败：' + error.message));
                }
            };
            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsText(file, 'utf-8');
        });
    };

    // 验证导入数据
    const validateImportData = (data) => {
        const valid = [];
        const invalid = [];
        const existingBoothNumbers = new Set(companies.map(c => c.boothNumber));
        
        data.forEach((row, index) => {
            const errors = [];
            
            // 只校验展位号唯一性
            if (row.boothNumber && existingBoothNumbers.has(row.boothNumber)) {
                errors.push('展位号已被占用');
            }
            
            // 批量数据内部展位号重复检查
            const duplicateBoothInBatch = data.filter((item, idx) => idx !== index && item.boothNumber === row.boothNumber);
            if (duplicateBoothInBatch.length > 0) {
                errors.push('批量数据中展位号重复');
            }
            
            const validatedRow = { ...row, errors, index: index + 1 };
            
            if (errors.length === 0) {
                valid.push(validatedRow);
            } else {
                invalid.push(validatedRow);
            }
        });
        
        return { valid, invalid };
    };

    // 执行导入
    const executeImport = async () => {
        if (importValidation.valid.length === 0) {
            message.error('没有有效的数据可以导入');
            return;
        }
        
        setImportLoading(true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟导入过程
            
            // 生成新的公司数据
            const newCompanies = importValidation.valid.map((row, index) => ({
                id: `company_import_${Date.now()}_${index}`,
                name: row.name || '未命名公司',
                logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100',
                description: row.description || '暂无描述',
                floorId: 'floor_f1', // 默认楼层
                areaId: 'area_a', // 默认区域
                boothNumber: row.boothNumber || `TEMP-${index + 1}`,
                boothSize: row.boothSize || '3x3',
                appAccount: row.appAccount || `auto_${Date.now()}_${index}`,
                contactPerson: row.contactPerson || '待补充',
                contactPhone: row.contactPhone || '13800000000',
                contactEmail: row.contactEmail || `temp${index}@example.com`,
                website: row.website || '',
                category: row.category || '车辆制造',
                status: 'pending', // 导入的数据默认为待审核状态
                created: new Date().toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                }).replace(/\//g, '-')
            }));
            
            // 更新公司列表
            setCompanies(prev => [...prev, ...newCompanies]);
            
            // 记录导入结果
            const results = {
                total: importData.length,
                success: importValidation.valid.length,
                failed: importValidation.invalid.length,
                newCompanies: newCompanies
            };
            
            setImportResults(results);
            setImportStep(3);
            
            message.success(`导入成功！共导入${results.success}家参展公司`);
            
        } catch (error) {
            message.error('导入失败：' + error.message);
        } finally {
            setImportLoading(false);
        }
    };

    // 重置导入流程
    const resetImportFlow = () => {
        setImportStep(0);
        setUploadedFile(null);
        setImportData([]);
        setImportValidation({ valid: [], invalid: [] });
        setImportResults(null);
        setImportModalVisible(false);
    };

    // 文件上传配置
    const uploadProps = {
        name: 'file',
        multiple: false,
        accept: '.csv,.xlsx,.xls',
        beforeUpload: (file) => {
            // 检查文件类型
            const isValidType = file.type === 'text/csv' || 
                               file.type === 'application/vnd.ms-excel' || 
                               file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            
            if (!isValidType) {
                message.error('只支持 CSV、Excel 格式的文件');
                return false;
            }
            
            // 检查文件大小（最大5MB）
            const isLimitSize = file.size / 1024 / 1024 < 5;
            if (!isLimitSize) {
                message.error('文件大小不能超过 5MB');
                return false;
            }
            
            setUploadedFile(file);
            
            // 解析文件
            parseUploadedFile(file)
                .then(data => {
                    setImportData(data);
                    const validation = validateImportData(data);
                    setImportValidation(validation);
                    setImportStep(1);
                    message.success(`文件解析成功，共${data.length}条数据`);
                })
                .catch(error => {
                    message.error(error.message);
                    setUploadedFile(null);
                });
            
            return false; // 阻止自动上传
        },
        onRemove: () => {
            setUploadedFile(null);
            setImportData([]);
            setImportValidation({ valid: [], invalid: [] });
            setImportStep(0);
        }
    };

    // 渲染统计卡片
    const renderStatistics = () => {
        return React.createElement(Row, { gutter: 16 }, [
            React.createElement(Col, { span: 4, key: 'total' },
                React.createElement(Card, {},
                    React.createElement(Statistic, {
                        title: '参展公司总数',
                        value: statistics.total,
                        suffix: '家'
                    })
                )
            ),
            React.createElement(Col, { span: 4, key: 'confirmed' },
                React.createElement(Card, {},
                    React.createElement(Statistic, {
                        title: '已审核',
                        value: statistics.confirmed,
                        suffix: '家'
                    })
                )
            ),
            React.createElement(Col, { span: 4, key: 'pending' },
                React.createElement(Card, {},
                    React.createElement(Statistic, {
                        title: '待审核',
                        value: statistics.pending,
                        suffix: '家'
                    })
                )
            ),
            React.createElement(Col, { span: 4, key: 'pending-changes' },
                React.createElement(Card, {},
                    React.createElement(Statistic, {
                        title: '待审核变更',
                        value: statistics.pendingAuditCount,
                        suffix: '个',
                        valueStyle: { color: '#ff4d4f' }
                    })
                )
            ),
            React.createElement(Col, { span: 4, key: 'rejected' },
                React.createElement(Card, {},
                    React.createElement(Statistic, {
                        title: '已拒绝',
                        value: statistics.rejected,
                        suffix: '家'
                    })
                )
            ),
            React.createElement(Col, { span: 4, key: 'usage' },
                React.createElement(Card, {},
                    React.createElement(Statistic, {
                        title: '展位使用',
                        value: statistics.boothUsage,
                        valueStyle: { color: '#722ed1' }
                    })
                )
            )
        ]);
    };

    // 渲染变更对比
    const renderChangeComparison = (changes, changeType) => {
        if (changeType === 'product_info') {
            return React.createElement('div', {}, [
                React.createElement('h4', { key: 'title' }, '新增产品信息'),
                React.createElement(Descriptions, {
                    key: 'product-info',
                    column: 1,
                    bordered: true,
                    size: 'small'
                }, [
                    React.createElement(Descriptions.Item, {
                        key: 'name',
                        label: '产品名称'
                    }, changes.product.name),
                    React.createElement(Descriptions.Item, {
                        key: 'category',
                        label: '产品分类'
                    }, changes.product.category),
                    React.createElement(Descriptions.Item, {
                        key: 'description',
                        label: '产品描述'
                    }, changes.product.description)
                ])
            ]);
        }

        // 展商信息变更对比
        const { before, after } = changes;
        const changedFields = Object.keys(after).filter(key => before[key] !== after[key]);

        return React.createElement('div', {}, [
            React.createElement('h4', { key: 'title' }, '信息变更对比'),
            React.createElement(Table, {
                key: 'comparison',
                size: 'small',
                pagination: false,
                columns: [
                    {
                        title: '字段',
                        dataIndex: 'field',
                        width: 120
                    },
                    {
                        title: '变更前',
                        dataIndex: 'before',
                        render: (text) => React.createElement('span', {
                            style: { color: '#ff4d4f' }
                        }, text || '-')
                    },
                    {
                        title: '变更后',
                        dataIndex: 'after',
                        render: (text) => React.createElement('span', {
                            style: { color: '#52c41a' }
                        }, text || '-')
                    }
                ],
                dataSource: changedFields.map((field, index) => ({
                    key: index,
                    field: {
                        'name': '公司名称',
                        'description': '公司描述',
                        'contactPerson': '联系人',
                        'email': '邮箱',
                        'website': '网站'
                    }[field] || field,
                    before: before[field],
                    after: after[field]
                }))
            })
        ]);
    };

    // 渲染审核页面内容
    const renderAuditContent = () => {
        const auditColumns = [
            {
                title: '展商名称',
                dataIndex: 'exhibitorName',
                key: 'exhibitorName',
                width: 150
            },
            {
                title: '变更类型',
                dataIndex: 'changeType',
                key: 'changeType',
                width: 120,
                render: (type) => React.createElement(Tag, {
                    color: type === 'exhibitor_info' ? 'blue' : 
                           type === 'product_online' ? 'green' :
                           type === 'product_offline' ? 'orange' : 'default'
                }, type === 'exhibitor_info' ? '展商信息' : 
                   type === 'product_online' ? '产品上架' :
                   type === 'product_offline' ? '产品下架' : '产品信息')
            },
            {
                title: '提交时间',
                dataIndex: 'submitTime',
                key: 'submitTime',
                width: 180
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 100,
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
                width: 100,
                render: (reviewer) => reviewer || '-'
            },
            {
                title: '审核时间',
                dataIndex: 'reviewTime',
                key: 'reviewTime',
                width: 180,
                render: (time) => time || '-'
            },
            {
                title: '操作',
                key: 'actions',
                width: 120,
                render: (_, record) => React.createElement(Space, { size: 'small' }, [
                    record.status === 'pending' && React.createElement(Button, {
                        key: 'audit',
                        size: 'small',
                        type: 'primary',
                        onClick: () => handleProductAudit(record)
                    }, '审核'),
                    React.createElement(Button, {
                        key: 'view',
                        size: 'small',
                        onClick: () => {
                            Modal.info({
                                title: '变更详情',
                                width: 600,
                                content: renderChangeComparison(record.changes, record.changeType)
                            });
                        }
                    }, '详情')
                ])
            }
        ];

        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'audit-info',
                message: '审核说明',
                description: '展商通过展商中心提交的信息变更和产品上架申请需要运营人员审核，审核通过后变更才会生效并在APP中展示。',
                type: 'info',
                showIcon: true,
                style: { marginBottom: '16px' }
            }),
            React.createElement(Tabs, {
                key: 'audit-tabs',
                defaultActiveKey: 'all'
            }, [
                React.createElement(TabPane, {
                    key: 'all',
                    tab: '全部变更'
                }, React.createElement(Table, {
                    columns: auditColumns,
                    dataSource: [...pendingChanges, ...pendingProductChanges].map((item, index) => ({ ...item, key: index })),
                    pagination: {
                        pageSize: 10,
                        showTotal: (total) => `共 ${total} 条`
                    }
                })),
                React.createElement(TabPane, {
                    key: 'products',
                    tab: React.createElement('span', null, [
                        '产品上架',
                        pendingProductChanges.filter(c => c.status === 'pending').length > 0 && 
                        React.createElement('sup', {
                            style: {
                                marginLeft: '4px',
                                padding: '2px 6px',
                                background: '#ff4d4f',
                                color: '#fff',
                                borderRadius: '10px',
                                fontSize: '12px'
                            }
                        }, pendingProductChanges.filter(c => c.status === 'pending').length)
                    ])
                }, React.createElement(Table, {
                    columns: auditColumns,
                    dataSource: pendingProductChanges.map((item, index) => ({ ...item, key: index })),
                    pagination: {
                        pageSize: 10,
                        showTotal: (total) => `共 ${total} 条`
                    }
                }))
            ])
        ]);
    };

    return React.createElement('div', {
        style: { padding: '0' }
    }, [
        // 页面标题
        React.createElement('div', {
            key: 'header',
            style: { marginBottom: '24px' }
        }, [
            React.createElement('h2', {
                key: 'title',
                style: { 
                    fontSize: '24px', 
                    fontWeight: '600', 
                    margin: '0 0 8px 0',
                    color: '#333'
                }
            }, '展商管理'),
            React.createElement('div', {
                key: 'description',
                style: { 
                    color: '#666', 
                    fontSize: '14px'
                }
            }, '管理展会展商信息，包括公司资料、展位分配、审核状态等')
        ]),

        // 统计数据
        React.createElement('div', {
            key: 'statistics',
            style: { marginBottom: '24px' }
        }, renderStatistics()),

        // 主要内容区域 - 使用Tabs
        React.createElement(Tabs, {
            key: 'main-tabs',
            activeKey: activeTab,
            onChange: setActiveTab,
            size: 'large'
        }, [
            // 展商管理标签页
            React.createElement(TabPane, {
                key: 'companies',
                tab: React.createElement('span', null, ['🏢 ', '展商管理'])
            }, [
                // 搜索和筛选
                React.createElement(Card, {
                    key: 'filters',
                    style: { marginBottom: '16px' }
                }, React.createElement(Row, {
                    gutter: 16,
                    align: 'middle'
                }, [
                    React.createElement(Col, { key: 'search', span: 6 },
                        React.createElement(Input, {
                            placeholder: '搜索公司名称、联系人或展位号',
                            value: searchText,
                            onChange: (e) => setSearchText(e.target.value),
                            style: { width: '100%' },
                            prefix: React.createElement('span', {}, '🔍')
                        })
                    ),
                    React.createElement(Col, { key: 'status', span: 4 },
                        React.createElement(Select, {
                            value: statusFilter,
                            onChange: setStatusFilter,
                            style: { width: '100%' },
                            placeholder: '筛选状态'
                        }, [
                            React.createElement(Option, { key: 'all', value: 'all' }, '全部状态'),
                            React.createElement(Option, { key: 'confirmed', value: 'confirmed' }, '已审核'),
                            React.createElement(Option, { key: 'pending', value: 'pending' }, '待审核'),
                            React.createElement(Option, { key: 'rejected', value: 'rejected' }, '已拒绝')
                        ])
                    ),
                    React.createElement(Col, { key: 'category', span: 4 },
                        React.createElement(Select, {
                            value: categoryFilter,
                            onChange: setCategoryFilter,
                            style: { width: '100%' },
                            placeholder: '筛选分类'
                        }, [
                            React.createElement(Option, { key: 'all', value: 'all' }, '全部分类'),
                            React.createElement(Option, { key: '车辆制造', value: '车辆制造' }, '车辆制造'),
                            React.createElement(Option, { key: '智能交通', value: '智能交通' }, '智能交通'),
                            React.createElement(Option, { key: '通信技术', value: '通信技术' }, '通信技术'),
                            React.createElement(Option, { key: '数字化解决方案', value: '数字化解决方案' }, '数字化解决方案'),
                            React.createElement(Option, { key: '信号系统', value: '信号系统' }, '信号系统')
                        ])
                    ),
                    React.createElement(Col, { key: 'actions', span: 10 },
                        React.createElement(Space, { size: 'small' }, [
                            React.createElement(Button, {
                                key: 'import',
                                onClick: () => setImportModalVisible(true),
                                style: { color: '#52c41a', borderColor: '#52c41a' }
                            }, '批量导入'),
                            React.createElement(Button, {
                                key: 'reset',
                                onClick: resetFilters
                            }, '重置筛选'),
                            React.createElement(Button, {
                                key: 'export',
                                onClick: handleExport
                            }, '导出数据'),
                            React.createElement(Button, {
                                key: 'refresh',
                                onClick: loadCompanyData,
                                loading: loading
                            }, '刷新数据'),
                            React.createElement(Button, {
                                key: 'create',
                                type: 'primary',
                                onClick: createNewCompany
                            }, '新增公司')
                        ])
                    )
                ])),

                // 数据表格
                React.createElement(Card, {
                    key: 'table',
                    title: `参展公司列表 (${filteredCompanies.length}家)`
                }, React.createElement(Table, {
                    columns: columns,
                    dataSource: filteredCompanies.map((item, index) => ({ ...item, key: index })),
                    loading: loading,
                    pagination: {
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                    },
                    scroll: { x: 1400 }
                }))
            ]),

            // 审核变更标签页
            React.createElement(TabPane, {
                key: 'audit',
                tab: React.createElement('span', null, [
                    '🔍 ', 
                    '审核变更',
                    statistics.pendingAuditCount > 0 && React.createElement('span', {
                        key: 'badge',
                        style: {
                            marginLeft: '8px',
                            background: '#ff4d4f',
                            color: '#fff',
                            borderRadius: '10px',
                            padding: '0 6px',
                            fontSize: '12px'
                        }
                    }, statistics.pendingAuditCount)
                ])
            }, renderAuditContent())
        ]),

        // 审核模态框
        auditModalVisible && React.createElement(Modal, {
            key: 'audit-modal',
            title: '审核变更申请',
            visible: auditModalVisible,
            onCancel: () => {
                setAuditModalVisible(false);
                setCurrentAuditRecord(null);
                auditForm.resetFields();
            },
            footer: null,
            width: 800
        }, currentAuditRecord && React.createElement('div', {}, [
            React.createElement(Descriptions, {
                key: 'basic-info',
                title: '基本信息',
                column: 2,
                bordered: true,
                style: { marginBottom: '16px' }
            }, [
                React.createElement(Descriptions.Item, {
                    key: 'exhibitor',
                    label: '展商名称'
                }, currentAuditRecord.exhibitorName),
                React.createElement(Descriptions.Item, {
                    key: 'type',
                    label: '变更类型'
                }, currentAuditRecord.changeType === 'exhibitor_info' ? '展商信息' : '产品信息'),
                React.createElement(Descriptions.Item, {
                    key: 'submit-time',
                    label: '提交时间'
                }, currentAuditRecord.submitTime),
                React.createElement(Descriptions.Item, {
                    key: 'status',
                    label: '当前状态'
                }, React.createElement(Tag, {
                    color: 'orange'
                }, '待审核'))
            ]),

            React.createElement(Divider, { key: 'divider' }),

            renderChangeComparison(currentAuditRecord.changes, currentAuditRecord.changeType),

            React.createElement(Divider, { key: 'divider2' }),

            React.createElement(Form, {
                key: 'audit-form',
                form: auditForm,
                layout: 'vertical',
                onFinish: handleAuditSubmit
            }, [
                React.createElement(Form.Item, {
                    key: 'action',
                    label: '审核决定',
                    name: 'action',
                    rules: [{ required: true, message: '请选择审核结果' }]
                }, React.createElement(Radio.Group, null, [
                    React.createElement(Radio, {
                        key: 'approve',
                        value: 'approve',
                        style: { color: '#52c41a' }
                    }, '通过'),
                    React.createElement(Radio, {
                        key: 'reject',
                        value: 'reject',
                        style: { color: '#ff4d4f' }
                    }, '拒绝')
                ])),
                React.createElement(Form.Item, {
                    key: 'comment',
                    label: '审核备注',
                    name: 'comment',
                    rules: [{ required: true, message: '请输入审核备注' }]
                }, React.createElement(TextArea, {
                    rows: 3,
                    placeholder: '请输入审核备注，说明通过或拒绝的原因'
                })),
                React.createElement(Form.Item, {
                    key: 'submit',
                    style: { textAlign: 'right', marginTop: '24px' }
                }, React.createElement(Space, null, [
                    React.createElement(Button, {
                        key: 'cancel',
                        onClick: () => {
                            setAuditModalVisible(false);
                            setCurrentAuditRecord(null);
                            auditForm.resetFields();
                        }
                    }, '取消'),
                    React.createElement(Button, {
                        key: 'submit',
                        type: 'primary',
                        htmlType: 'submit',
                        loading: loading
                    }, '提交审核')
                ]))
            ])
        ])),

        // 产品审核模态框
        productAuditModalVisible && React.createElement(Modal, {
            key: 'product-audit-modal',
            title: '产品上架审核',
            visible: productAuditModalVisible,
            onCancel: () => {
                setProductAuditModalVisible(false);
                setCurrentProductAudit(null);
                productAuditForm.resetFields();
            },
            footer: null,
            width: 800
        }, currentProductAudit && React.createElement('div', {}, [
            React.createElement(Descriptions, {
                key: 'product-basic-info',
                title: '产品信息',
                column: 2,
                bordered: true,
                style: { marginBottom: '16px' }
            }, [
                React.createElement(Descriptions.Item, {
                    key: 'product-name',
                    label: '产品名称'
                }, currentProductAudit.product.name),
                React.createElement(Descriptions.Item, {
                    key: 'product-category',
                    label: '产品分类'
                }, currentProductAudit.product.category),
                React.createElement(Descriptions.Item, {
                    key: 'product-description',
                    label: '产品描述'
                }, currentProductAudit.product.description),
                React.createElement(Descriptions.Item, {
                    key: 'product-status',
                    label: '当前状态'
                }, React.createElement(Tag, {
                    color: 'orange'
                }, '待审核'))
            ]),

            React.createElement(Divider, { key: 'divider' }),

            React.createElement(Form, {
                key: 'product-audit-form',
                form: productAuditForm,
                layout: 'vertical',
                onFinish: handleProductAuditSubmit
            }, [
                React.createElement(Form.Item, {
                    key: 'action',
                    label: '审核决定',
                    name: 'action',
                    rules: [{ required: true, message: '请选择审核结果' }]
                }, React.createElement(Radio.Group, null, [
                    React.createElement(Radio, {
                        key: 'approve',
                        value: 'approve',
                        style: { color: '#52c41a' }
                    }, '通过'),
                    React.createElement(Radio, {
                        key: 'reject',
                        value: 'reject',
                        style: { color: '#ff4d4f' }
                    }, '拒绝')
                ])),
                React.createElement(Form.Item, {
                    key: 'comment',
                    label: '审核备注',
                    name: 'comment',
                    rules: [{ required: true, message: '请输入审核备注' }]
                }, React.createElement(TextArea, {
                    rows: 3,
                    placeholder: '请输入审核备注，说明通过或拒绝的原因'
                })),
                React.createElement(Form.Item, {
                    key: 'submit',
                    style: { textAlign: 'right', marginTop: '24px' }
                }, React.createElement(Space, null, [
                    React.createElement(Button, {
                        key: 'cancel',
                        onClick: () => {
                            setProductAuditModalVisible(false);
                            setCurrentProductAudit(null);
                            productAuditForm.resetFields();
                        }
                    }, '取消'),
                    React.createElement(Button, {
                        key: 'submit',
                        type: 'primary',
                        htmlType: 'submit',
                        loading: loading
                    }, '提交审核')
                ]))
            ])
        ])),

        // 公司信息编辑模态框
        React.createElement(Modal, {
            key: 'companyModal',
            title: editingCompany ? '编辑参展公司' : '新增参展公司',
            visible: companyModalVisible,
            onCancel: () => {
                setCompanyModalVisible(false);
                companyForm.resetFields();
                setEditingCompany(null);
            },
            footer: [
                React.createElement(Button, {
                    key: 'cancel',
                    onClick: () => {
                        setCompanyModalVisible(false);
                        companyForm.resetFields();
                        setEditingCompany(null);
                    }
                }, '取消'),
                React.createElement(Button, {
                    key: 'submit',
                    type: 'primary',
                    loading: loading,
                    onClick: () => companyForm.submit()
                }, '保存')
            ],
            width: 800
        }, React.createElement(Form, {
            form: companyForm,
            layout: 'vertical',
            onFinish: handleCompanySave
        }, [
            React.createElement(Row, { key: 'row1', gutter: 16 }, [
                React.createElement(Col, { span: 12 },
                    React.createElement(Form.Item, {
                        label: '公司名称',
                        name: 'name',
                        rules: [{ required: true, message: '请输入公司名称' }]
                    }, React.createElement(Input, { placeholder: '请输入公司名称' }))
                ),
                React.createElement(Col, { span: 12 },
                    React.createElement(Form.Item, {
                        label: '公司分类',
                        name: 'category',
                        rules: [{ required: true, message: '请选择公司分类' }]
                    }, React.createElement(Select, { placeholder: '请选择公司分类' }, [
                        React.createElement(Option, { key: '车辆制造', value: '车辆制造' }, '车辆制造'),
                        React.createElement(Option, { key: '智能交通', value: '智能交通' }, '智能交通'),
                        React.createElement(Option, { key: '通信技术', value: '通信技术' }, '通信技术'),
                        React.createElement(Option, { key: '数字化解决方案', value: '数字化解决方案' }, '数字化解决方案'),
                        React.createElement(Option, { key: '信号系统', value: '信号系统' }, '信号系统')
                    ]))
                )
            ]),
            
            React.createElement(Form.Item, {
                key: 'description',
                label: '公司描述',
                name: 'description',
                rules: [{ required: true, message: '请输入公司描述' }]
            }, React.createElement(TextArea, { 
                rows: 3, 
                placeholder: '请输入公司描述' 
            })),

            React.createElement(Row, { key: 'row2', gutter: 16 }, [
                React.createElement(Col, { span: 12 },
                    React.createElement(Form.Item, {
                        label: '展位号',
                        name: 'boothNumber',
                        rules: [{ required: true, message: '请输入展位号' }]
                    }, React.createElement(Input, { placeholder: '如：A区-01' }))
                ),
                React.createElement(Col, { span: 12 },
                    React.createElement(Form.Item, {
                        label: '展位规格',
                        name: 'boothSize',
                        rules: [{ required: true, message: '请输入展位规格' }]
                    }, React.createElement(Input, { placeholder: '如：3x3' }))
                )
            ]),

            React.createElement(Row, { key: 'row3', gutter: 16 }, [
                React.createElement(Col, { span: 8 },
                    React.createElement(Form.Item, {
                        label: '联系人',
                        name: 'contactPerson',
                        rules: [{ required: true, message: '请输入联系人' }]
                    }, React.createElement(Input, { placeholder: '请输入联系人姓名' }))
                ),
                React.createElement(Col, { span: 8 },
                    React.createElement(Form.Item, {
                        label: '联系电话',
                        name: 'contactPhone',
                        rules: [{ required: true, message: '请输入联系电话' }]
                    }, React.createElement(Input, { placeholder: '请输入联系电话' }))
                ),
                React.createElement(Col, { span: 8 },
                    React.createElement(Form.Item, {
                        label: '联系邮箱',
                        name: 'contactEmail',
                        rules: [
                            { required: true, message: '请输入联系邮箱' },
                            { type: 'email', message: '请输入有效的邮箱地址' }
                        ]
                    }, React.createElement(Input, { placeholder: '请输入联系邮箱' }))
                )
            ]),

            React.createElement(Row, { key: 'row4', gutter: 16 }, [
                React.createElement(Col, { span: 12 },
                    React.createElement(Form.Item, {
                        label: 'APP账号',
                        name: 'appAccount',
                        rules: [{ required: true, message: '请输入APP账号' }]
                    }, React.createElement(Input, { placeholder: '请输入APP账号' }))
                ),
                React.createElement(Col, { span: 12 },
                    React.createElement(Form.Item, {
                        label: '公司网站',
                        name: 'website'
                    }, React.createElement(Input, { placeholder: '请输入公司网站URL' }))
                )
            ]),

            React.createElement(Form.Item, {
                key: 'logo',
                label: '公司LOGO',
                name: 'logo'
            }, React.createElement(Input, { 
                placeholder: '请输入LOGO图片URL或使用上传功能' 
            }))
        ])),

        // 批量导入模态框
        React.createElement(Modal, {
            key: 'importModal',
            title: '批量导入参展公司',
            visible: importModalVisible,
            onCancel: resetImportFlow,
            footer: null,
            width: 900,
            destroyOnClose: true
        }, React.createElement('div', {}, [
            // 导入步骤
            React.createElement(Steps, {
                key: 'steps',
                current: importStep,
                style: { marginBottom: '24px' }
            }, [
                React.createElement(Steps.Step, {
                    key: 'upload',
                    title: '上传文件',
                    description: '选择导入文件'
                }),
                React.createElement(Steps.Step, {
                    key: 'validate',
                    title: '数据校验',
                    description: '验证数据格式'
                }),
                React.createElement(Steps.Step, {
                    key: 'import',
                    title: '执行导入',
                    description: '导入到系统'
                }),
                React.createElement(Steps.Step, {
                    key: 'result',
                    title: '导入结果',
                    description: '查看导入结果'
                })
            ]),

            // 步骤1：文件上传
            importStep === 0 && React.createElement('div', { key: 'upload-step' }, [
                React.createElement(Alert, {
                    key: 'alert',
                    message: '导入说明',
                    description: '请下载模板文件，按照格式填写数据后上传。支持CSV、Excel格式，文件大小不超过5MB。',
                    type: 'info',
                    showIcon: true,
                    style: { marginBottom: '16px' }
                }),
                
                React.createElement(Space, {
                    key: 'template-buttons',
                    style: { marginBottom: '16px' }
                }, [
                    React.createElement(Button, {
                        key: 'download-excel',
                        onClick: () => downloadImportTemplate('excel')
                    }, '下载Excel模板'),
                    React.createElement(Button, {
                        key: 'download-csv',
                        onClick: () => downloadImportTemplate('csv')
                    }, '下载CSV模板')
                ]),
                
                React.createElement(Dragger, {
                    key: 'uploader',
                    ...uploadProps,
                    style: { padding: '40px' }
                }, [
                    React.createElement('p', {
                        key: 'icon',
                        className: 'ant-upload-drag-icon',
                        style: { fontSize: '48px', color: '#1890ff' }
                    }, '📁'),
                    React.createElement('p', {
                        key: 'text',
                        className: 'ant-upload-text',
                        style: { fontSize: '16px', marginBottom: '8px' }
                    }, '点击或拖拽文件到此区域上传'),
                    React.createElement('p', {
                        key: 'hint',
                        className: 'ant-upload-hint',
                        style: { color: '#666' }
                    }, '支持CSV、Excel格式，单个文件大小不超过5MB')
                ])
            ]),

            // 步骤2：数据校验
            importStep === 1 && React.createElement('div', { key: 'validate-step' }, [
                React.createElement(Row, {
                    key: 'summary',
                    gutter: 16,
                    style: { marginBottom: '16px' }
                }, [
                    React.createElement(Col, { span: 8 },
                        React.createElement(Card, {
                            style: { textAlign: 'center' }
                        }, React.createElement(Statistic, {
                            title: '总数据量',
                            value: importData.length,
                            valueStyle: { color: '#1890ff' }
                        }))
                    ),
                    React.createElement(Col, { span: 8 },
                        React.createElement(Card, {
                            style: { textAlign: 'center' }
                        }, React.createElement(Statistic, {
                            title: '有效数据',
                            value: importValidation.valid.length,
                            valueStyle: { color: '#52c41a' }
                        }))
                    ),
                    React.createElement(Col, { span: 8 },
                        React.createElement(Card, {
                            style: { textAlign: 'center' }
                        }, React.createElement(Statistic, {
                            title: '错误数据',
                            value: importValidation.invalid.length,
                            valueStyle: { color: '#ff4d4f' }
                        }))
                    )
                ]),

                // 错误数据列表
                importValidation.invalid.length > 0 && React.createElement('div', {
                    key: 'invalid-data',
                    style: { marginBottom: '16px' }
                }, [
                    React.createElement('h4', {
                        key: 'title',
                        style: { color: '#ff4d4f' }
                    }, `错误数据 (${importValidation.invalid.length}条)`),
                    React.createElement(Table, {
                        key: 'table',
                        dataSource: importValidation.invalid.map(item => ({ ...item, key: item.index })),
                        size: 'small',
                        pagination: { pageSize: 5 },
                        columns: [
                            {
                                title: '行号',
                                dataIndex: 'index',
                                width: 60
                            },
                            {
                                title: '公司名称',
                                dataIndex: 'name',
                                width: 150
                            },
                            {
                                title: '错误信息',
                                dataIndex: 'errors',
                                render: (errors) => React.createElement('div', {},
                                    errors.map((error, idx) => 
                                        React.createElement(Tag, {
                                            key: idx,
                                            color: 'red',
                                            style: { marginBottom: '2px' }
                                        }, error)
                                    )
                                )
                            }
                        ]
                    })
                ]),

                // 操作按钮
                React.createElement(Space, {
                    key: 'actions',
                    style: { marginTop: '16px' }
                }, [
                    React.createElement(Button, {
                        key: 'back',
                        onClick: () => setImportStep(0)
                    }, '重新选择文件'),
                    React.createElement(Button, {
                        key: 'import',
                        type: 'primary',
                        disabled: importValidation.valid.length === 0,
                        onClick: () => setImportStep(2)
                    }, `导入有效数据 (${importValidation.valid.length}条)`)
                ])
            ]),

            // 步骤3：确认导入
            importStep === 2 && React.createElement('div', { key: 'confirm-step' }, [
                React.createElement(Alert, {
                    key: 'confirm-alert',
                    message: '确认导入',
                    description: `即将导入 ${importValidation.valid.length} 条有效数据，导入后数据将保存到系统中，请确认操作。`,
                    type: 'warning',
                    showIcon: true,
                    style: { marginBottom: '16px' }
                }),

                React.createElement('h4', {
                    key: 'preview-title'
                }, '数据预览'),
                
                React.createElement(Table, {
                    key: 'preview-table',
                    dataSource: importValidation.valid.slice(0, 5).map(item => ({ ...item, key: item.index })),
                    size: 'small',
                    pagination: false,
                    columns: [
                        { title: '公司名称', dataIndex: 'name', width: 120 },
                        { title: '分类', dataIndex: 'category', width: 100 },
                        { title: '展位号', dataIndex: 'boothNumber', width: 80 },
                        { title: '联系人', dataIndex: 'contactPerson', width: 80 },
                        { title: '联系电话', dataIndex: 'contactPhone', width: 120 }
                    ]
                }),

                importValidation.valid.length > 5 && React.createElement('div', {
                    key: 'more-hint',
                    style: { textAlign: 'center', color: '#666', margin: '8px 0' }
                }, `还有 ${importValidation.valid.length - 5} 条数据...`),

                React.createElement(Space, {
                    key: 'actions',
                    style: { marginTop: '16px' }
                }, [
                    React.createElement(Button, {
                        key: 'back',
                        onClick: () => setImportStep(1)
                    }, '返回校验'),
                    React.createElement(Button, {
                        key: 'execute',
                        type: 'primary',
                        loading: importLoading,
                        onClick: executeImport
                    }, '确认导入')
                ])
            ]),

            // 步骤4：导入结果
            importStep === 3 && importResults && React.createElement('div', { key: 'result-step' }, [
                React.createElement(Alert, {
                    key: 'success-alert',
                    message: '导入完成',
                    description: `成功导入 ${importResults.success} 条数据，失败 ${importResults.failed} 条数据。`,
                    type: 'success',
                    showIcon: true,
                    style: { marginBottom: '16px' }
                }),

                React.createElement(Row, {
                    key: 'result-summary',
                    gutter: 16,
                    style: { marginBottom: '16px' }
                }, [
                    React.createElement(Col, { span: 6 },
                        React.createElement(Card, {
                            style: { textAlign: 'center' }
                        }, React.createElement(Statistic, {
                            title: '总处理',
                            value: importResults.total,
                            valueStyle: { color: '#1890ff' }
                        }))
                    ),
                    React.createElement(Col, { span: 6 },
                        React.createElement(Card, {
                            style: { textAlign: 'center' }
                        }, React.createElement(Statistic, {
                            title: '成功导入',
                            value: importResults.success,
                            valueStyle: { color: '#52c41a' }
                        }))
                    ),
                    React.createElement(Col, { span: 6 },
                        React.createElement(Card, {
                            style: { textAlign: 'center' }
                        }, React.createElement(Statistic, {
                            title: '导入失败',
                            value: importResults.failed,
                            valueStyle: { color: '#ff4d4f' }
                        }))
                    ),
                    React.createElement(Col, { span: 6 },
                        React.createElement(Card, {
                            style: { textAlign: 'center' }
                        }, React.createElement(Statistic, {
                            title: '成功率',
                            value: ((importResults.success / importResults.total) * 100).toFixed(1),
                            valueStyle: { color: '#722ed1' },
                            suffix: '%'
                        }))
                    )
                ]),

                React.createElement(Space, {
                    key: 'final-actions',
                    style: { marginTop: '16px' }
                }, [
                    React.createElement(Button, {
                        key: 'close',
                        type: 'primary',
                        onClick: resetImportFlow
                    }, '完成导入'),
                    React.createElement(Button, {
                        key: 'continue',
                        onClick: () => {
                            setImportStep(0);
                            setUploadedFile(null);
                            setImportData([]);
                            setImportValidation({ valid: [], invalid: [] });
                            setImportResults(null);
                        }
                    }, '继续导入')
                ])
            ])
        ]))
    ]);
};

window.ExhibitorManagement = ExhibitorManagement; 