// 版本: v2.2 - 2025-01-03 - 重新设计展位管理层级结构
// 展位管理页面 - 展会展位信息管理
const BoothManagement = () => {
    console.log('BoothManagement component is rendering...');
    
    const { Row, Col, Card, Button, Space, Alert, Tag, Table, Modal, Form, Input, Select, message, Tabs, Upload, Tree, Image, Divider, Statistic, Progress, InputNumber, Radio, Switch, DatePicker, Breadcrumb, Descriptions, Badge } = antd;
    const { TextArea } = Input;
    const { Option } = Select;
    const { RangePicker: DateRangePicker } = DatePicker;
    
    // 状态管理 - 层级导航
    const [currentView, setCurrentView] = React.useState('venues'); // venues, floors, areas, booths
    const [selectedVenue, setSelectedVenue] = React.useState(null);
    const [selectedFloor, setSelectedFloor] = React.useState(null);
    const [selectedArea, setSelectedArea] = React.useState(null);
    
    // Modal状态
    const [venueModalVisible, setVenueModalVisible] = React.useState(false);
    const [floorModalVisible, setFloorModalVisible] = React.useState(false);
    const [areaModalVisible, setAreaModalVisible] = React.useState(false);
    const [boothModalVisible, setBoothModalVisible] = React.useState(false);
    
    // 编辑状态
    const [editingVenue, setEditingVenue] = React.useState(null);
    const [editingFloor, setEditingFloor] = React.useState(null);
    const [editingArea, setEditingArea] = React.useState(null);
    const [editingBooth, setEditingBooth] = React.useState(null);
    
    const [loading, setLoading] = React.useState(false);
    
    // 表单实例
    const [venueForm] = Form.useForm();
    const [floorForm] = Form.useForm();
    const [areaForm] = Form.useForm();
    const [boothForm] = Form.useForm();
    
    // 模拟数据
    const [boothData, setBoothData] = React.useState({
        // 场馆数据
        venues: [
            {
                id: 'venue_001',
                name: '人民城轨展览中心',
                address: '北京市朝阳区城轨大道123号',
                description: '专业城市轨道交通展览中心',
                totalFloors: 4,
                totalAreas: 12,
                totalBooths: 150,
                status: 'active',
                created: '2024-01-10 10:00:00'
            },
            {
                id: 'venue_002',
                name: '上海轨道交通展览馆',
                address: '上海市浦东新区展览路456号',
                description: '华东地区最大的轨道交通专业展览馆',
                totalFloors: 3,
                totalAreas: 8,
                totalBooths: 120,
                status: 'active',
                created: '2024-01-15 14:30:00'
            }
        ],
        
        // 楼层数据
        floors: [
            { id: 'floor_f1', venueId: 'venue_001', name: 'F1', level: 1, description: '一层展区', areaCount: 3, boothCount: 45, mapUrl: '/images/floor_f1_map.jpg' },
            { id: 'floor_f2', venueId: 'venue_001', name: 'F2', level: 2, description: '二层展区', areaCount: 3, boothCount: 45, mapUrl: '/images/floor_f2_map.jpg' },
            { id: 'floor_f3', venueId: 'venue_001', name: 'F3', level: 3, description: '三层展区', areaCount: 3, boothCount: 30, mapUrl: '/images/floor_f3_map.jpg' },
            { id: 'floor_f4', venueId: 'venue_001', name: 'F4', level: 4, description: '四层展区', areaCount: 3, boothCount: 30, mapUrl: '/images/floor_f4_map.jpg' },
            { id: 'floor_s1', venueId: 'venue_002', name: 'S1', level: 1, description: '上海馆一层', areaCount: 2, boothCount: 40, mapUrl: '/images/floor_s1_map.jpg' },
            { id: 'floor_s2', venueId: 'venue_002', name: 'S2', level: 2, description: '上海馆二层', areaCount: 3, boothCount: 40, mapUrl: '/images/floor_s2_map.jpg' },
            { id: 'floor_s3', venueId: 'venue_002', name: 'S3', level: 3, description: '上海馆三层', areaCount: 3, boothCount: 40, mapUrl: '/images/floor_s3_map.jpg' }
        ],
        
        // 分区数据
        areas: [
            { id: 'area_a', floorId: 'floor_f1', name: 'A区', description: '核心技术展示区', boothCount: 15, color: '#1890ff', status: 'active' },
            { id: 'area_b', floorId: 'floor_f1', name: 'B区', description: '创新产品展示区', boothCount: 15, color: '#52c41a', status: 'active' },
            { id: 'area_c', floorId: 'floor_f1', name: 'C区', description: '解决方案展示区', boothCount: 15, color: '#faad14', status: 'active' },
            { id: 'area_d', floorId: 'floor_f2', name: 'D区', description: '智能装备展示区', boothCount: 15, color: '#f759ab', status: 'active' },
            { id: 'area_e', floorId: 'floor_f2', name: 'E区', description: '数字化展示区', boothCount: 15, color: '#722ed1', status: 'active' },
            { id: 'area_f', floorId: 'floor_f2', name: 'F区', description: '绿色技术展示区', boothCount: 15, color: '#13c2c2', status: 'active' },
            { id: 'area_sa', floorId: 'floor_s1', name: 'SA区', description: '上海馆A区', boothCount: 20, color: '#1890ff', status: 'active' },
            { id: 'area_sb', floorId: 'floor_s1', name: 'SB区', description: '上海馆B区', boothCount: 20, color: '#52c41a', status: 'active' }
        ],
        
        // 展位数据
        booths: [
            { id: 'booth_001', areaId: 'area_a', boothNumber: 'A-001', size: '3x3m', status: 'occupied', exhibitorId: 'ex_001', exhibitorName: '北京地铁集团', price: 50000 },
            { id: 'booth_002', areaId: 'area_a', boothNumber: 'A-002', size: '3x3m', status: 'available', exhibitorId: null, exhibitorName: null, price: 50000 },
            { id: 'booth_003', areaId: 'area_b', boothNumber: 'B-001', size: '4x4m', status: 'occupied', exhibitorId: 'ex_002', exhibitorName: '上海申通地铁', price: 60000 },
            { id: 'booth_004', areaId: 'area_b', boothNumber: 'B-002', size: '3x3m', status: 'reserved', exhibitorId: 'ex_003', exhibitorName: '广州地铁集团', price: 50000 }
        ],
        
        // 展商数据
        exhibitors: [
            { id: 'ex_001', name: '北京地铁集团', contact: '张经理', phone: '13800138001', email: 'zhang@bjmetro.com' },
            { id: 'ex_002', name: '上海申通地铁', contact: '李经理', phone: '13800138002', email: 'li@shtmetro.com' },
            { id: 'ex_003', name: '广州地铁集团', contact: '王经理', phone: '13800138003', email: 'wang@gzmetro.com' }
        ]
    });

    React.useEffect(() => {
        loadBoothData();
    }, []);

    // 导航函数
    const navigateToVenues = () => {
        setCurrentView('venues');
        setSelectedVenue(null);
        setSelectedFloor(null);
        setSelectedArea(null);
    };

    const manageFloors = (venue) => {
        setSelectedVenue(venue);
        setCurrentView('floors');
        setSelectedFloor(null);
        setSelectedArea(null);
    };

    const navigateToFloors = (venue) => {
        manageFloors(venue);
    };

    // 修正导航函数，确保上下文赋值
    const navigateToAreas = (floor) => {
        setSelectedFloor(floor);
        setCurrentView('areas');
        setSelectedArea(null);
    };

    const navigateToBooths = (area) => {
        setSelectedArea(area);
        setCurrentView('booths');
    };

    // 渲染当前视图
    const renderCurrentView = () => {
        switch (currentView) {
            case 'venues':
                return renderVenuesList();
            case 'floors':
                return renderFloorsList();
            case 'areas':
                return renderAreasList();
            case 'booths':
                return renderBoothsList();
            default:
                return renderVenuesList();
        }
    };

    // 渲染场馆列表
    const renderVenuesList = () => {
        const venueColumns = [
            {
                title: '场馆信息',
                dataIndex: 'name',
                width: 300,
                render: (text, record) => React.createElement('div', {}, [
                    React.createElement('div', {
                        key: 'name',
                        style: { fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }
                    }, text),
                    React.createElement('div', {
                        key: 'address',
                        style: { color: '#666', fontSize: '12px', marginBottom: '4px' }
                    }, record.address),
                    React.createElement('div', {
                        key: 'description',
                        style: { color: '#999', fontSize: '12px' }
                    }, record.description)
                ])
            },
            {
                title: '展位统计',
                dataIndex: 'totalBooths',
                width: 200,
                render: (_, record) => React.createElement('div', {}, [
                    React.createElement('div', {
                        key: 'floors',
                        style: { marginBottom: '4px' }
                    }, `楼层数: ${record.totalFloors}`),
                    React.createElement('div', {
                        key: 'areas',
                        style: { marginBottom: '4px' }
                    }, `分区数: ${record.totalAreas}`),
                    React.createElement('div', {
                        key: 'booths',
                        style: { fontWeight: 'bold', color: '#1890ff' }
                    }, `展位数: ${record.totalBooths}`)
                ])
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 100,
                render: (status) => React.createElement(Tag, {
                    color: status === 'active' ? 'green' : 'orange'
                }, status === 'active' ? '使用中' : '待开放')
            },
            {
                title: '创建时间',
                dataIndex: 'created',
                width: 150
            },
            {
                title: '操作',
                width: 200,
                render: (_, record) => React.createElement(Space, { size: 'small' }, [
                    React.createElement(Button, {
                        key: 'manage',
                        size: 'small',
                        type: 'primary',
                        onClick: () => manageFloors(record)
                    }, '管理楼层'),
                    React.createElement(Button, {
                        key: 'edit',
                        size: 'small',
                        onClick: () => editVenue(record)
                    }, '编辑'),
                    React.createElement(Button, {
                        key: 'delete',
                        size: 'small',
                        danger: true,
                        onClick: () => deleteVenue(record)
                    }, '删除')
                ])
            }
        ];

        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'venue-info',
                message: '场馆管理',
                description: '管理展会场馆基本信息，点击"管理楼层"进入场馆内部管理',
                type: 'info',
                showIcon: true,
                style: { marginBottom: '24px' }
            }),
            React.createElement(Card, {
                key: 'venue-table',
                title: '场馆列表',
                extra: React.createElement(Button, {
                    type: 'primary',
                    onClick: () => createNewVenue()
                }, '新建场馆')
            }, React.createElement(Table, {
                dataSource: boothData.venues?.map((item, index) => ({ ...item, key: index })) || [],
                columns: venueColumns,
                pagination: false,
                size: 'small',
                loading: loading
            }))
        ]);
    };

    // 渲染楼层列表
    const renderFloorsList = () => {
        const { floors } = boothData;
        const venue = selectedVenue;
        if (!venue) return React.createElement(Alert, { message: '请先选择场馆', type: 'info' });

        return React.createElement('div', {}, [
            React.createElement('div', {
                key: 'floors-header',
                style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }
            }, [
                React.createElement(Button, {
                    key: 'back',
                    type: 'default',
                    onClick: navigateToVenues
                }, '返回场馆列表'),
                React.createElement(Button, {
                    key: 'add',
                    type: 'primary',
                    onClick: createNewFloor
                }, '新建楼层')
            ]),
            React.createElement(Row, { gutter: [16, 16] }, floors.filter(floor => floor.venueId === venue.id).map(floor => (
                React.createElement(Col, { span: 8, key: floor.id },
                    React.createElement(Card, {
            key: floor.id,
                        title: `${floor.name} (层)`,
                        bordered: false,
                        extra: React.createElement(Space, null, [
                            React.createElement(Button, { type: 'default', onClick: () => navigateToAreas(floor) }, '管理分区'),
                            React.createElement(Button, { type: 'default', onClick: () => handleManageBoothsFromFloor(floor) }, '管理展位')
                        ])
                    }, [
                        React.createElement('p', null, React.createElement('strong', null, '层级:'), floor.level),
                        React.createElement('p', null, React.createElement('strong', null, '描述:'), floor.description),
                        React.createElement('p', null, React.createElement('strong', null, '分区数量:'), floor.areaCount),
                        React.createElement('p', null, React.createElement('strong', null, '展位数量:'), floor.boothCount),
                        React.createElement('p', null, React.createElement('strong', null, '地图:'), React.createElement('a', { href: floor.mapUrl, target: '_blank', rel: 'noopener noreferrer' }, '查看'))
                    ])
                )
            )))
        ]);
    };

    // 渲染分区列表
    const renderAreasList = () => {
        const { areas } = boothData;
        const floor = selectedFloor; // 直接用对象
        if (!floor) return React.createElement(Alert, { message: '请先选择楼层', type: 'info' });

        return React.createElement('div', {}, [
            React.createElement('div', {
                key: 'areas-header',
                style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }
            }, [
                React.createElement(Button, {
                    key: 'back',
                    type: 'default',
                    onClick: () => navigateToFloors(selectedVenue)
                }, '返回楼层列表'),
                React.createElement(Button, {
                    key: 'add',
                    type: 'primary',
                    onClick: () => { setEditingArea(null); areaForm.resetFields(); setAreaModalVisible(true); }
                }, '新建分区')
            ]),
            React.createElement(Row, { gutter: [16, 16] }, areas.filter(area => area.floorId === floor.id).map(area => (
                React.createElement(Col, { span: 8, key: area.id },
                    React.createElement(Card, {
                        key: area.id,
                        title: area.name,
                        bordered: false,
                        extra: React.createElement(Space, null, [
                            React.createElement(Button, { type: 'default', onClick: () => navigateToBooths(area) }, '管理展位'),
                            React.createElement(Button, { type: 'primary', onClick: () => { setEditingArea(area); areaForm.setFieldsValue(area); setAreaModalVisible(true); } }, '编辑')
                        ])
                    }, [
                        React.createElement('p', null, React.createElement('strong', null, '描述:'), area.description),
                        React.createElement('p', null, React.createElement('strong', null, '展位数量:'), area.boothCount),
                        React.createElement('p', null, React.createElement('strong', null, '颜色:'), React.createElement(Tag, { color: area.color }, area.name)),
                        React.createElement('p', null, React.createElement('strong', null, '状态:'), React.createElement(Tag, { color: area.status === 'active' ? 'green' : 'default' }, area.status || 'active'))
                    ])
                )
            )))
        ]);
    };

    // 渲染展位列表
    const renderBoothsList = () => {
        const { booths, exhibitors } = boothData;
        const area = selectedArea;
        if (!area) return React.createElement(Alert, { message: '请先选择分区', type: 'info' });

        // 新建展位按钮
        const handleCreateBooth = () => {
            setEditingBooth(null);
            boothForm.resetFields();
            setBoothModalVisible(true);
        };

        // 编辑展位
        const handleEditBooth = (booth) => {
            setEditingBooth(booth);
            boothForm.setFieldsValue(booth);
            setBoothModalVisible(true);
        };

        // 删除展位
        const handleDeleteBooth = (booth) => {
            Modal.confirm({
                title: '确认删除',
                content: `确定要删除展位“${booth.boothNumber}”吗？此操作不可恢复。`,
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    const newBooths = booths.filter(b => b.id !== booth.id);
                    setBoothData({ ...boothData, booths: newBooths });
                    message.success('展位删除成功');
                }
            });
        };

        // 绑定展商
        const handleBindExhibitor = (booth) => {
            setEditingBooth(booth);
            boothForm.setFieldsValue(booth);
            setBoothModalVisible(true);
        };

        // 解绑展商
        const handleUnbindExhibitor = (booth) => {
            Modal.confirm({
                title: '确认解绑',
                content: `确定要解绑展位“${booth.boothNumber}”的展商吗？`,
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    const newBooths = booths.map(b => b.id === booth.id ? { ...b, exhibitorId: null, exhibitorName: null, status: 'available' } : b);
                    setBoothData({ ...boothData, booths: newBooths });
                    message.success('展商解绑成功');
                }
            });
        };

        // 状态流转
        const handleStatusChange = (booth, status) => {
            const newBooths = booths.map(b => b.id === booth.id ? { ...b, status } : b);
            setBoothData({ ...boothData, booths: newBooths });
            message.success('展位状态已更新');
        };

        return React.createElement('div', {}, [
            React.createElement('div', {
                key: 'booths-header',
                style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }
            }, [
                            React.createElement(Button, {
                    key: 'back',
                    type: 'default',
                    onClick: () => navigateToAreas(selectedFloor)
                }, '返回分区列表'),
                            React.createElement(Button, {
                    key: 'add',
                    type: 'primary',
                    onClick: handleCreateBooth,
                    disabled: !selectedArea
                }, '新建展位')
            ]),
            React.createElement(Row, { gutter: [16, 16] }, booths.filter(booth => booth.areaId === area.id).map(booth => (
                React.createElement(Col, { span: 8, key: booth.id },
                    React.createElement(Card, {
                        key: booth.id,
                        title: booth.boothNumber,
                        bordered: false,
                        extra: React.createElement(Space, null, [
                            React.createElement(Button, { onClick: () => handleEditBooth(booth) }, '编辑'),
                            React.createElement(Button, { onClick: () => setBoothModalVisible(true) }, '详情'),
                            React.createElement(Button, { danger: true, onClick: () => handleDeleteBooth(booth) }, '删除')
                        ])
                    }, [
                        React.createElement('p', null, React.createElement('strong', null, '大小:'), booth.size),
                        React.createElement('p', null, React.createElement('strong', null, '状态:'),
                            React.createElement(Select, {
                                value: booth.status,
                                style: { width: 120 },
                                onChange: (value) => handleStatusChange(booth, value)
                            }, [
                                React.createElement(Select.Option, { key: 'available', value: 'available' }, '可预订'),
                                React.createElement(Select.Option, { key: 'reserved', value: 'reserved' }, '已预订'),
                                React.createElement(Select.Option, { key: 'occupied', value: 'occupied' }, '已占用'),
                                React.createElement(Select.Option, { key: 'closed', value: 'closed' }, '关闭')
                            ])
                        ),
                        React.createElement('p', null, React.createElement('strong', null, '展商:'),
                            booth.exhibitorName ? [
                                React.createElement('span', { key: 'name', style: { color: '#1890ff', marginRight: 8 } }, booth.exhibitorName),
                                React.createElement(Button, { key: 'unbind', size: 'small', onClick: () => handleUnbindExhibitor(booth) }, '解绑')
                            ] : React.createElement(Button, { size: 'small', onClick: () => handleBindExhibitor(booth) }, '绑定展商')
                        ),
                        React.createElement('p', null, React.createElement('strong', null, '价格:'), booth.price)
                    ])
                )
            ))),
            boothModalVisible && React.createElement(Modal, {
                key: 'booth-modal',
                title: editingBooth ? '编辑展位' : '新建展位',
                visible: boothModalVisible,
                onCancel: () => setBoothModalVisible(false),
                footer: null,
                destroyOnClose: true,
                width: 600
            }, React.createElement(Form, {
                form: boothForm,
                layout: 'vertical',
                onFinish: (values) => {
                    setBoothModalVisible(false);
                    const newBooth = {
                        ...editingBooth,
                        ...values,
                        id: editingBooth ? editingBooth.id : `booth_${Date.now()}`,
                        areaId: area.id,
                        exhibitorName: values.exhibitorId ? (exhibitors.find(ex => ex.id === values.exhibitorId)?.name || '') : null
                    };
                    let newBooths;
                    if (editingBooth) {
                        newBooths = booths.map(b => b.id === editingBooth.id ? newBooth : b);
                    } else {
                        newBooths = [...booths, newBooth];
                    }
                    setBoothData({ ...boothData, booths: newBooths });
                    setEditingBooth(null);
                    message.success(editingBooth ? '展位编辑成功' : '展位新建成功');
                }
            }, [
                React.createElement(Form.Item, {
                    key: 'boothNumber',
                    label: '展位编号',
                    name: 'boothNumber',
                    rules: [{ required: true, message: '请输入展位编号' }]
                }, React.createElement(Input, { placeholder: '如：A-001、B-002等' })),
                React.createElement(Form.Item, {
                    key: 'size',
                    label: '展位尺寸',
                    name: 'size',
                    rules: [{ required: true, message: '请输入展位尺寸' }]
                }, React.createElement(Input, { placeholder: '如：3x3m、4x4m等' })),
                React.createElement(Form.Item, {
                    key: 'price',
                    label: '展位价格',
                    name: 'price',
                    rules: [{ required: true, message: '请输入展位价格' }]
                }, React.createElement(InputNumber, {
                    min: 0,
                    style: { width: '100%' },
                    formatter: value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                    parser: value => value.replace(/\¥\s?|(,*)/g, '')
                })),
                React.createElement(Form.Item, {
                    key: 'exhibitorId',
                    label: '绑定展商',
                    name: 'exhibitorId'
                }, React.createElement(Select, {
                    showSearch: true,
                    placeholder: '请选择展商',
                    allowClear: true,
                    filterOption: (input, option) => (option.children || '').toLowerCase().includes(input.toLowerCase())
                }, exhibitors?.map(ex => React.createElement(Select.Option, { key: ex.id, value: ex.id }, ex.name)))),
                React.createElement(Form.Item, {
                    key: 'status',
                    label: '展位状态',
                    name: 'status',
                    rules: [{ required: true, message: '请选择状态' }],
                    initialValue: 'available'
                }, React.createElement(Select, {
                    placeholder: '请选择状态'
                }, [
                    React.createElement(Select.Option, { key: 'available', value: 'available' }, '可预订'),
                    React.createElement(Select.Option, { key: 'occupied', value: 'occupied' }, '已占用'),
                    React.createElement(Select.Option, { key: 'reserved', value: 'reserved' }, '已预订'),
                    React.createElement(Select.Option, { key: 'closed', value: 'closed' }, '关闭')
                ])),
                React.createElement(Form.Item, {
                    key: 'submit',
                    style: { textAlign: 'right' }
                }, React.createElement(Button, {
                    type: 'primary',
                    htmlType: 'submit',
                    loading: false
                }, '保存'))
            ]))
        ]);
    };

    // 获取面包屑导航项
    const getBreadcrumbItems = () => {
        const items = [];
        if (currentView === 'venues') {
            items.push({ title: '场馆列表', onClick: navigateToVenues });
        } else if (currentView === 'floors') {
            const venue = selectedVenue;
            if (venue) {
                items.push({ title: venue.name, onClick: navigateToVenues });
                items.push({ title: '楼层列表', onClick: () => navigateToFloors(venue) });
            }
        } else if (currentView === 'areas') {
            const venue = selectedVenue;
            const floor = selectedFloor;
            if (venue) {
                items.push({ title: venue.name, onClick: navigateToVenues });
                if (floor) {
                    items.push({ title: floor.name, onClick: () => navigateToFloors(venue) });
                    items.push({ title: '分区列表', onClick: () => navigateToAreas(floor) });
                }
            }
        } else if (currentView === 'booths') {
            const venue = selectedVenue;
            const floor = selectedFloor;
            const area = selectedArea;
            if (venue) {
                items.push({ title: venue.name, onClick: navigateToVenues });
                if (floor) {
                    items.push({ title: floor.name, onClick: () => navigateToFloors(venue) });
                    if (area) {
                        items.push({ title: area.name, onClick: () => navigateToAreas(floor) });
                        items.push({ title: '展位列表', onClick: () => navigateToBooths(area) });
                    }
                }
            }
        }
        return items;
    };

    // 加载数据
    const loadBoothData = () => {
        setLoading(true);
        // 模拟异步加载
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    // 新增/修复：场馆操作函数
    const createNewVenue = () => {
        setEditingVenue(null);
        venueForm.resetFields();
        setVenueModalVisible(true);
    };

    const editVenue = (venue) => {
        setEditingVenue(venue);
        venueForm.setFieldsValue(venue);
        setVenueModalVisible(true);
    };

    const deleteVenue = (venue) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除场馆"${venue.name}"吗？此操作不可恢复。`,
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                const newVenues = boothData.venues.filter(v => v.id !== venue.id);
                setBoothData({ ...boothData, venues: newVenues });
                message.success('场馆删除成功');
            }
        });
    };

    // 新增/修复：楼层操作函数
    const createNewFloor = () => {
        setEditingFloor(null);
        floorForm.resetFields();
        setFloorModalVisible(true);
    };

    const editFloor = (floor) => {
        setEditingFloor(floor);
        floorForm.setFieldsValue({
            name: floor.name,
            level: floor.level,
            description: floor.description,
            areaCount: floor.areaCount,
            boothCount: floor.boothCount,
            mapUrl: floor.mapUrl
        });
        setFloorModalVisible(true);
    };

    const deleteFloor = (floor) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除楼层"${floor.name}"吗？此操作不可恢复。`,
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                const newFloors = boothData.floors.filter(f => f.id !== floor.id);
                setBoothData({ ...boothData, floors: newFloors });
                message.success('楼层删除成功');
            }
        });
    };

    // 编辑展位
    const handleEditBooth = (booth) => {
        setEditingBooth(booth);
        boothForm.setFieldsValue({
            boothNumber: booth.boothNumber,
            size: booth.size,
            status: booth.status,
            exhibitorId: booth.exhibitorId,
            price: booth.price
        });
        setBoothModalVisible(true);
    };

    // 保存展位
    const handleSaveBooth = async () => {
        try {
            const values = await boothForm.validateFields();
            const newBooth = { ...editingBooth, ...values };
            setBoothData(prev => ({
                ...prev,
                booths: prev.booths.map(b => b.id === newBooth.id ? newBooth : b)
            }));
            message.success('展位更新成功');
            setBoothModalVisible(false);
        } catch (errorInfo) {
            console.error('保存展位失败:', errorInfo);
        }
    };

    // 删除展位
    const handleDeleteBooth = (boothId) => {
        Modal.confirm({
            title: '确定删除展位吗？',
            content: '此操作不可逆，请谨慎操作。',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                setBoothData(prev => ({
                    ...prev,
                    booths: prev.booths.filter(b => b.id !== boothId)
                }));
                message.success('展位删除成功');
            }
        });
    };

    // 展位详情 Modal
    const BoothDetailsModal = () => {
        const booth = boothData.booths.find(b => b.id === editingBooth?.id);
        if (!booth) return null;

        return React.createElement(Modal, {
            title: '展位详情',
            visible: boothModalVisible,
            onCancel: () => setBoothModalVisible(false),
            footer: [
                React.createElement(Button, { key: 'back', onClick: () => setBoothModalVisible(false) }, '关闭'),
                React.createElement(Button, { key: 'edit', type: 'primary', onClick: handleEditBooth }, '编辑'),
                React.createElement(Button, { key: 'delete', danger: true, onClick: () => handleDeleteBooth(booth.id) }, '删除')
            ]
        }, [
            React.createElement(Descriptions, { title: '展位信息', bordered: true }, [
                React.createElement(Descriptions.Item, { label: '展位编号' }, booth.boothNumber),
                React.createElement(Descriptions.Item, { label: '大小' }, booth.size),
                React.createElement(Descriptions.Item, { label: '状态' }, booth.status),
                React.createElement(Descriptions.Item, { label: '展商' }, booth.exhibitorName || '未分配'),
                React.createElement(Descriptions.Item, { label: '价格' }, booth.price)
            ])
        ]);
    };

    // 新增：分区选择弹窗状态
    const [areaSelectModalVisible, setAreaSelectModalVisible] = React.useState(false);
    const [areaSelectList, setAreaSelectList] = React.useState([]);
    const [areaSelectFloor, setAreaSelectFloor] = React.useState(null);

    // 修改：管理展位按钮逻辑，弹出分区选择
    const handleManageBoothsFromFloor = (floor) => {
        const areas = boothData.areas.filter(a => a.floorId === floor.id);
        if (areas.length === 0) {
            message.warning('请先新建分区');
            return;
        }
        setAreaSelectList(areas);
        setAreaSelectFloor(floor);
        setAreaSelectModalVisible(true);
    };

    // 新增：分区选择弹窗组件
    const renderAreaSelectModal = () => {
        return React.createElement(Modal, {
            key: 'area-select-modal',
            title: areaSelectFloor ? `${areaSelectFloor.name} - 选择分区` : '选择分区',
            visible: areaSelectModalVisible,
            onCancel: () => setAreaSelectModalVisible(false),
            footer: null,
            destroyOnClose: true,
            width: 400
        }, [
            React.createElement('div', { style: { marginBottom: 16 } }, '请选择要管理展位的分区：'),
            areaSelectList.length > 0 ?
                areaSelectList.map(area =>
                    React.createElement(Button, {
                        key: area.id,
                        type: 'default',
                        style: { width: '100%', marginBottom: 8, textAlign: 'left' },
                        onClick: () => {
                            setAreaSelectModalVisible(false);
                            setSelectedFloor(areaSelectFloor);
                            setSelectedArea(area);
                            setCurrentView('booths');
                        }
                    }, `${area.name}（${area.description || ''}）`)
                ) :
                React.createElement('div', { style: { color: '#999' } }, '暂无分区，请先新建分区')
        ]);
    };

    return React.createElement('div', { className: 'booth-management-page' }, [
        React.createElement('div', {
            key: 'header',
            style: {
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }
        }, [
            React.createElement('h2', {
                key: 'title',
                style: { margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }
            }, '🏢 展位管理'),
            React.createElement(Space, {
                key: 'actions'
            }, [
                React.createElement(Button, {
                    key: 'refresh',
                    onClick: () => loadBoothData()
                }, '刷新数据'),
                React.createElement(Button, {
                    key: 'help',
                    type: 'default',
                    onClick: () => message.info('展位管理帮助文档')
                }, '使用帮助')
            ])
        ]),

        React.createElement(Breadcrumb, {
            key: 'breadcrumb',
            style: { marginBottom: '16px' }
        }, getBreadcrumbItems().map((item, idx) =>
            React.createElement(Breadcrumb.Item, { key: idx }, item.title)
        )),

        renderCurrentView(),

        // 新增：场馆弹窗Modal
        venueModalVisible && React.createElement(Modal, {
            key: 'venue-modal',
            title: editingVenue ? '编辑场馆' : '新建场馆',
            visible: venueModalVisible,
            onCancel: () => setVenueModalVisible(false),
            footer: null,
            destroyOnClose: true,
            width: 500
        }, React.createElement(Form, {
            form: venueForm,
            layout: 'vertical',
            onFinish: (values) => {
                // 保存逻辑
                setVenueModalVisible(false);
                if (editingVenue) {
                    // 编辑
                    const newVenues = boothData.venues.map(v => v.id === editingVenue.id ? { ...editingVenue, ...values } : v);
                    setBoothData({ ...boothData, venues: newVenues });
                    message.success('场馆编辑成功');
                } else {
                    // 新建
                    const newVenue = { ...values, id: `venue_${Date.now()}`, status: 'active', created: new Date().toLocaleString(), totalFloors: 0, totalAreas: 0, totalBooths: 0 };
                    setBoothData({ ...boothData, venues: [...boothData.venues, newVenue] });
                    message.success('场馆新建成功');
                }
                setEditingVenue(null);
            }
        }, [
            React.createElement(Form.Item, {
                key: 'name',
                label: '场馆名称',
                name: 'name',
                rules: [{ required: true, message: '请输入场馆名称' }]
            }, React.createElement(Input, { placeholder: '如：人民城轨展览中心' })),
            React.createElement(Form.Item, {
                key: 'address',
                label: '地址',
                name: 'address',
                rules: [{ required: true, message: '请输入地址' }]
            }, React.createElement(Input, { placeholder: '请输入地址' })),
            React.createElement(Form.Item, {
                key: 'description',
                label: '描述',
                name: 'description'
            }, React.createElement(Input.TextArea, { rows: 2, placeholder: '请输入描述' })),
            React.createElement(Form.Item, {
                key: 'submit',
                style: { textAlign: 'right' }
            }, React.createElement(Button, {
                type: 'primary',
                htmlType: 'submit',
                loading: loading
            }, '保存'))
        ])),

        // 新增：楼层弹窗Modal
        floorModalVisible && React.createElement(Modal, {
            key: 'floor-modal',
            title: editingFloor ? '编辑楼层' : '新建楼层',
            visible: floorModalVisible,
            onCancel: () => setFloorModalVisible(false),
            footer: null,
            destroyOnClose: true,
            width: 500
        }, React.createElement(Form, {
            form: floorForm,
            layout: 'vertical',
            onFinish: (values) => {
                // 保存逻辑
                setFloorModalVisible(false);
                if (editingFloor) {
                    // 编辑
                    const newFloors = boothData.floors.map(f => f.id === editingFloor.id ? { ...editingFloor, ...values } : f);
                    setBoothData({ ...boothData, floors: newFloors });
                    message.success('楼层编辑成功');
                } else {
                    // 新建
                    const newFloor = { ...values, id: `floor_${Date.now()}`, venueId: selectedVenue.id, areaCount: 0, boothCount: 0 };
                    setBoothData({ ...boothData, floors: [...boothData.floors, newFloor] });
                    message.success('楼层新建成功');
                }
                setEditingFloor(null);
            }
        }, [
            React.createElement(Form.Item, {
                key: 'name',
                label: '楼层名称',
                name: 'name',
                rules: [{ required: true, message: '请输入楼层名称' }]
            }, React.createElement(Input, { placeholder: '如：F1' })),
            React.createElement(Form.Item, {
                key: 'level',
                label: '层级',
                name: 'level',
                rules: [{ required: true, message: '请输入层级' }]
            }, React.createElement(InputNumber, { placeholder: '如：1' })),
            React.createElement(Form.Item, {
                key: 'description',
                label: '描述',
                name: 'description'
            }, React.createElement(Input.TextArea, { rows: 2, placeholder: '请输入描述' })),
            React.createElement(Form.Item, {
                key: 'areaCount',
                label: '分区数量',
                name: 'areaCount',
                rules: [{ required: true, message: '请输入分区数量' }]
            }, React.createElement(InputNumber, { placeholder: '如：3' })),
            React.createElement(Form.Item, {
                key: 'boothCount',
                label: '展位数量',
                name: 'boothCount',
                rules: [{ required: true, message: '请输入展位数量' }]
            }, React.createElement(InputNumber, { placeholder: '如：45' })),
            React.createElement(Form.Item, {
                key: 'mapUrl',
                label: '地图链接',
                name: 'mapUrl',
                rules: [{ required: true, message: '请输入地图链接' }]
            }, React.createElement(Input, { placeholder: '请输入地图链接' })),
            React.createElement(Form.Item, {
                key: 'submit',
                style: { textAlign: 'right' }
            }, React.createElement(Button, {
                type: 'primary',
                htmlType: 'submit',
                loading: loading
            }, '保存'))
        ])),

        // 分区编辑/新建弹窗
        areaModalVisible && React.createElement(Modal, {
            key: 'area-modal',
            title: editingArea ? '编辑分区' : '新建分区',
            visible: areaModalVisible,
            onCancel: () => setAreaModalVisible(false),
            footer: null,
            destroyOnClose: true,
            width: 500
        }, React.createElement(Form, {
            form: areaForm,
            layout: 'vertical',
            onFinish: (values) => {
                setAreaModalVisible(false);
                const newArea = {
                    ...editingArea,
                    ...values,
                    id: editingArea ? editingArea.id : `area_${Date.now()}`,
                    floorId: floor.id
                };
                let newAreas;
                if (editingArea) {
                    newAreas = boothData.areas.map(a => a.id === editingArea.id ? newArea : a);
                } else {
                    newAreas = [...boothData.areas, newArea];
                }
                setBoothData({ ...boothData, areas: newAreas });
                setEditingArea(null);
                message.success(editingArea ? '分区编辑成功' : '分区新建成功');
            }
        }, [
            React.createElement(Form.Item, {
                key: 'name',
                label: '分区名称',
                name: 'name',
                rules: [{ required: true, message: '请输入分区名称' }]
            }, React.createElement(Input, { placeholder: '如：A区、B区等' })),
            React.createElement(Form.Item, {
                key: 'description',
                label: '描述',
                name: 'description'
            }, React.createElement(Input.TextArea, { rows: 2, placeholder: '请输入描述' })),
            React.createElement(Form.Item, {
                key: 'color',
                label: '分区颜色',
                name: 'color',
                rules: [{ required: true, message: '请选择分区颜色' }]
            }, React.createElement(Input, { type: 'color', style: { width: 60, height: 32, padding: 0, border: 'none' } })),
            React.createElement(Form.Item, {
                key: 'status',
                label: '分区状态',
                name: 'status',
                rules: [{ required: true, message: '请选择分区状态' }],
                initialValue: 'active'
            }, React.createElement(Select, null, [
                React.createElement(Select.Option, { key: 'active', value: 'active' }, '启用'),
                React.createElement(Select.Option, { key: 'disabled', value: 'disabled' }, '禁用'),
                React.createElement(Select.Option, { key: 'closed', value: 'closed' }, '关闭')
            ])),
            React.createElement(Form.Item, {
                key: 'boothCount',
                label: '展位数量',
                name: 'boothCount',
                rules: [{ required: true, message: '请输入展位数量' }]
            }, React.createElement(InputNumber, { min: 0, style: { width: '100%' } })),
            React.createElement(Form.Item, {
                key: 'submit',
                style: { textAlign: 'right' }
            }, React.createElement(Button, {
                type: 'primary',
                htmlType: 'submit',
                loading: false
                       }, '保存'))
        ])),
        BoothDetailsModal(),
        renderAreaSelectModal()
    ]);
}

console.log('BoothManagement component defined');
window.BoothManagement = BoothManagement;
console.log('[BoothManagement] window.BoothManagement 挂载成功'); 