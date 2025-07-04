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
            { id: 'area_a', floorId: 'floor_f1', name: 'A区', description: '核心技术展示区', boothCount: 15, color: '#1890ff' },
            { id: 'area_b', floorId: 'floor_f1', name: 'B区', description: '创新产品展示区', boothCount: 15, color: '#52c41a' },
            { id: 'area_c', floorId: 'floor_f1', name: 'C区', description: '解决方案展示区', boothCount: 15, color: '#faad14' },
            { id: 'area_d', floorId: 'floor_f2', name: 'D区', description: '智能装备展示区', boothCount: 15, color: '#f759ab' },
            { id: 'area_e', floorId: 'floor_f2', name: 'E区', description: '数字化展示区', boothCount: 15, color: '#722ed1' },
            { id: 'area_f', floorId: 'floor_f2', name: 'F区', description: '绿色技术展示区', boothCount: 15, color: '#13c2c2' },
            { id: 'area_sa', floorId: 'floor_s1', name: 'SA区', description: '上海馆A区', boothCount: 20, color: '#1890ff' },
            { id: 'area_sb', floorId: 'floor_s1', name: 'SB区', description: '上海馆B区', boothCount: 20, color: '#52c41a' }
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

    // 模拟加载数据
    const loadBoothData = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            message.success('展位数据加载成功');
        } catch (error) {
            message.error('数据加载失败');
        } finally {
            setLoading(false);
        }
    };

    // 导航函数
    const navigateToVenues = () => {
        setCurrentView('venues');
        setSelectedVenue(null);
        setSelectedFloor(null);
        setSelectedArea(null);
    };

    const navigateToFloors = (venue) => {
        setSelectedVenue(venue);
        setCurrentView('floors');
        setSelectedFloor(null);
        setSelectedArea(null);
    };

    const navigateToAreas = (floor) => {
        setSelectedFloor(floor);
        setCurrentView('areas');
        setSelectedArea(null);
    };

    const navigateToBooths = (area) => {
        setSelectedArea(area);
        setCurrentView('booths');
    };

    // 获取面包屑导航
    const getBreadcrumbItems = () => {
        const items = [
            { title: React.createElement('a', { onClick: navigateToVenues }, '场馆管理') }
        ];

        if (selectedVenue) {
            items.push({ title: React.createElement('a', { onClick: () => navigateToFloors(selectedVenue) }, selectedVenue.name) });
        }

        if (selectedFloor) {
            items.push({ title: React.createElement('a', { onClick: () => navigateToAreas(selectedFloor) }, `${selectedFloor.name} 楼层`) });
        }

        if (selectedArea) {
            items.push({ title: React.createElement('a', { onClick: () => navigateToBooths(selectedArea) }, `${selectedArea.name} 分区`) });
        }
        
        return items;
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
                        onClick: () => navigateToFloors(record)
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
        const currentFloors = boothData.floors.filter(floor => floor.venueId === selectedVenue.id);
        
        const floorColumns = [
            {
                title: '楼层信息',
                dataIndex: 'name',
                width: 300,
                render: (text, record) => React.createElement('div', {}, [
                    React.createElement('div', {
                        key: 'name',
                        style: { fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }
                    }, `${record.name} - ${record.description}`),
                    React.createElement('div', {
                        key: 'level',
                    style: { color: '#666', fontSize: '12px' } 
                    }, `楼层编号: ${record.level}`)
                ])
            },
            {
                title: '分区统计',
                dataIndex: 'areaCount',
                width: 150,
                render: (_, record) => React.createElement('div', {}, [
                    React.createElement('div', {
                        key: 'areas',
                        style: { marginBottom: '4px' }
                    }, `分区数: ${record.areaCount}`),
                    React.createElement('div', {
                        key: 'booths',
                        style: { fontWeight: 'bold', color: '#1890ff' }
                    }, `展位数: ${record.boothCount}`)
                ])
            },
            {
                title: '展位图',
                dataIndex: 'mapUrl',
                width: 120,
                render: (mapUrl) => mapUrl ? React.createElement(Image, {
                    src: mapUrl,
                    alt: '楼层展位图',
                    style: { width: 80, height: 60, objectFit: 'cover' }
                }) : React.createElement('span', { style: { color: '#999' } }, '暂无')
            },
            {
                title: '操作',
                width: 200,
                render: (_, record) => React.createElement(Space, { size: 'small' }, [
                    React.createElement(Button, {
                        key: 'manage',
                        size: 'small',
                        type: 'primary',
                        onClick: () => navigateToAreas(record)
                    }, '管理分区'),
                    React.createElement(Button, {
                        key: 'edit',
                        size: 'small',
                        onClick: () => editFloor(record)
                    }, '编辑'),
                    React.createElement(Button, {
                        key: 'delete',
                        size: 'small',
                        danger: true,
                        onClick: () => deleteFloor(record)
                    }, '删除')
                ])
            }
        ];

        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'floor-info',
                message: `${selectedVenue.name} - 楼层管理`,
                description: '管理场馆内的楼层信息，点击"管理分区"进入分区管理',
                type: 'info',
                showIcon: true,
                style: { marginBottom: '24px' }
            }),
                    React.createElement(Card, {
                key: 'floor-table',
                title: '楼层列表',
                extra: React.createElement(Button, {
                    type: 'primary',
                    onClick: () => createNewFloor()
                }, '新建楼层')
            }, React.createElement(Table, {
                dataSource: currentFloors?.map((item, index) => ({ ...item, key: index })) || [],
                columns: floorColumns,
                pagination: false,
                                size: 'small',
                loading: loading
            }))
        ]);
    };

    // 渲染分区列表
    const renderAreasList = () => {
        const currentAreas = boothData.areas.filter(area => area.floorId === selectedFloor.id);
        
        const areaColumns = [
            {
                title: '分区信息',
                dataIndex: 'name',
                width: 300,
                render: (text, record) => React.createElement('div', {}, [
                    React.createElement('div', {
                        key: 'name',
                        style: { fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }
                    }, `${record.name} - ${record.description}`),
                    React.createElement('div', {
                        key: 'color',
                        style: { display: 'flex', alignItems: 'center', gap: '8px' }
                    }, [
                        React.createElement('div', {
                            key: 'color-box',
                            style: {
                                width: '16px',
                                height: '16px',
                                backgroundColor: record.color,
                                borderRadius: '2px',
                                border: '1px solid #d9d9d9'
                            }
                        }),
                        React.createElement('span', { key: 'color-text', style: { color: '#666', fontSize: '12px' } }, '分区颜色')
                    ])
                ])
            },
            {
                title: '展位统计',
                dataIndex: 'boothCount',
                width: 150,
                render: (boothCount) => React.createElement('div', {
                    style: { fontWeight: 'bold', color: '#1890ff', fontSize: '16px' }
                }, `${boothCount} 个展位`)
            },
            {
                title: '操作',
                width: 200,
                render: (_, record) => React.createElement(Space, { size: 'small' }, [
                            React.createElement(Button, {
                        key: 'manage',
                                size: 'small',
                        type: 'primary',
                        onClick: () => navigateToBooths(record)
                    }, '管理展位'),
                    React.createElement(Button, {
                        key: 'edit',
                        size: 'small',
                        onClick: () => editArea(record)
                    }, '编辑'),
                    React.createElement(Button, {
                        key: 'delete',
                        size: 'small',
                        danger: true,
                        onClick: () => deleteArea(record)
                    }, '删除')
                        ])
            }
        ];

        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'area-info',
                message: `${selectedVenue.name} - ${selectedFloor.name} - 分区管理`,
                description: '管理楼层内的分区信息，点击"管理展位"进入展位管理',
                type: 'info',
                showIcon: true,
                style: { marginBottom: '24px' }
            }),
            React.createElement(Card, {
                key: 'area-table',
                title: '分区列表',
                extra: React.createElement(Button, {
                    type: 'primary',
                    onClick: () => createNewArea()
                }, '新建分区')
            }, React.createElement(Table, {
                dataSource: currentAreas?.map((item, index) => ({ ...item, key: index })) || [],
                columns: areaColumns,
                pagination: false,
                size: 'small',
                loading: loading
            }))
        ]);
    };

    // 渲染展位列表
    const renderBoothsList = () => {
        const currentBooths = boothData.booths.filter(booth => booth.areaId === selectedArea.id);
        
        const boothColumns = [
            {
                title: '展位信息',
                dataIndex: 'boothNumber',
                width: 200,
                render: (boothNumber, record) => React.createElement('div', {}, [
                    React.createElement('div', {
                        key: 'number',
                        style: { fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }
                    }, boothNumber),
                    React.createElement('div', {
                        key: 'size',
                        style: { color: '#666', fontSize: '12px' }
                    }, `尺寸: ${record.size}`)
                ])
            },
            {
                title: '展商信息',
                dataIndex: 'exhibitorName',
                width: 250,
                render: (exhibitorName, record) => exhibitorName ? React.createElement('div', {}, [
                    React.createElement('div', {
                        key: 'name',
                        style: { fontWeight: 'bold', color: '#1890ff' }
                    }, exhibitorName),
                    React.createElement('div', {
                        key: 'contact',
                        style: { color: '#666', fontSize: '12px' }
                    }, `联系人: ${record.contact || '-'}`)
                ]) : React.createElement('span', { style: { color: '#999' } }, '未绑定展商')
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 120,
                render: (status) => {
                    const statusConfig = {
                        available: { color: 'green', text: '可预订' },
                        occupied: { color: 'blue', text: '已占用' },
                        reserved: { color: 'orange', text: '已预订' }
                    };
                    const config = statusConfig[status] || { color: 'default', text: status };
                    return React.createElement(Tag, { color: config.color }, config.text);
                }
            },
            {
                title: '价格',
                dataIndex: 'price',
                width: 120,
                render: (price) => React.createElement('span', {
                    style: { fontWeight: 'bold', color: '#f50' }
                }, `¥${price?.toLocaleString() || 0}`)
            },
            {
                title: '操作',
                width: 200,
                render: (_, record) => React.createElement(Space, { size: 'small' }, [
                            React.createElement(Button, {
                        key: 'edit',
                                size: 'small',
                        onClick: () => editBooth(record)
                    }, '编辑'),
                            React.createElement(Button, {
                        key: 'bind',
                                size: 'small',
                        type: 'primary',
                        onClick: () => bindExhibitor(record)
                    }, '绑定展商'),
                    React.createElement(Button, {
                        key: 'delete',
                        size: 'small',
                        danger: true,
                        onClick: () => deleteBooth(record)
                    }, '删除')
                ])
            }
        ];

        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'booth-info',
                message: `${selectedVenue.name} - ${selectedFloor.name} - ${selectedArea.name} - 展位管理`,
                description: '管理分区内的展位信息，支持展商绑定和状态管理',
                type: 'info',
                showIcon: true,
                style: { marginBottom: '24px' }
            }),
            React.createElement(Card, {
                key: 'booth-table',
                title: '展位列表',
                        extra: React.createElement(Button, {
                    type: 'primary',
                    onClick: () => createNewBooth()
                }, '新建展位')
            }, React.createElement(Table, {
                dataSource: currentBooths?.map((item, index) => ({ ...item, key: index })) || [],
                columns: boothColumns,
                pagination: false,
                            size: 'small',
                loading: loading
            }))
        ]);
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

    // 功能函数
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

    const createNewFloor = () => {
        setEditingFloor(null);
        floorForm.resetFields();
        setFloorModalVisible(true);
    };

    const editFloor = (floor) => {
        setEditingFloor(floor);
        floorForm.setFieldsValue(floor);
        setFloorModalVisible(true);
    };

    const createNewArea = () => {
        setEditingArea(null);
        areaForm.resetFields();
        setAreaModalVisible(true);
    };

    const editArea = (area) => {
        setEditingArea(area);
        areaForm.setFieldsValue(area);
        setAreaModalVisible(true);
    };

    const createNewBooth = () => {
        setEditingBooth(null);
        boothForm.resetFields();
        setBoothModalVisible(true);
    };

    const editBooth = (booth) => {
        setEditingBooth(booth);
        boothForm.setFieldsValue(booth);
        setBoothModalVisible(true);
    };

    const bindExhibitor = (booth) => {
        setEditingBooth(booth);
        boothForm.setFieldsValue(booth);
        setBoothModalVisible(true);
    };

    // 删除函数
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

    const deleteFloor = (floor) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除楼层"${floor.name}"吗？此操作将同时删除该楼层下的所有分区，且不可恢复。`,
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                const newFloors = boothData.floors.filter(f => f.id !== floor.id);
                const newAreas = boothData.areas.filter(a => a.floorId !== floor.id);
                setBoothData({ ...boothData, floors: newFloors, areas: newAreas });
                message.success('楼层删除成功');
            }
        });
    };

    const deleteArea = (area) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除分区"${area.name}"吗？此操作不可恢复。`,
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                const newAreas = boothData.areas.filter(a => a.id !== area.id);
                setBoothData({ ...boothData, areas: newAreas });
                message.success('分区删除成功');
            }
        });
    };

    const deleteBooth = (booth) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除展位"${booth.boothNumber}"吗？此操作不可恢复。`,
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                const newBooths = boothData.booths.filter(b => b.id !== booth.id);
                setBoothData({ ...boothData, booths: newBooths });
                message.success('展位删除成功');
            }
        });
    };

    // 保存函数
    const handleVenueSave = async (values) => {
        setLoading(true);
        try {
            const newVenue = {
                ...editingVenue,
                ...values,
                id: editingVenue ? editingVenue.id : `venue_${Date.now()}`,
                totalFloors: 0,
                totalAreas: 0,
                totalBooths: 0,
                status: 'active',
                created: new Date().toLocaleString()
            };
            let newVenues;
            if (editingVenue) {
                newVenues = boothData.venues.map(v => v.id === editingVenue.id ? newVenue : v);
            } else {
                newVenues = [...boothData.venues, newVenue];
            }
            setBoothData({ ...boothData, venues: newVenues });
            setVenueModalVisible(false);
            setEditingVenue(null);
            message.success('场馆保存成功');
        } catch (e) {
            message.error('保存失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    const handleFloorSave = async (values) => {
        setLoading(true);
        try {
            const newFloor = {
                ...editingFloor,
                ...values,
                id: editingFloor ? editingFloor.id : `floor_${Date.now()}`,
                venueId: selectedVenue.id,
                areaCount: 0,
                boothCount: 0
            };
            let newFloors;
            if (editingFloor) {
                newFloors = boothData.floors.map(f => f.id === editingFloor.id ? newFloor : f);
            } else {
                newFloors = [...boothData.floors, newFloor];
            }
            setBoothData({ ...boothData, floors: newFloors });
            setFloorModalVisible(false);
            setEditingFloor(null);
            message.success('楼层保存成功');
        } catch (e) {
            message.error('保存失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    const handleAreaSave = async (values) => {
        setLoading(true);
        try {
            const newArea = {
                ...editingArea,
                ...values,
                id: editingArea ? editingArea.id : `area_${Date.now()}`,
                floorId: selectedFloor.id,
                boothCount: 0
            };
            let newAreas;
            if (editingArea) {
                newAreas = boothData.areas.map(a => a.id === editingArea.id ? newArea : a);
            } else {
                newAreas = [...boothData.areas, newArea];
            }
            setBoothData({ ...boothData, areas: newAreas });
            setAreaModalVisible(false);
            setEditingArea(null);
            message.success('分区保存成功');
        } catch (e) {
            message.error('保存失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    const handleBoothSave = async (values) => {
        setLoading(true);
        try {
            const newBooth = {
                ...editingBooth,
                ...values,
                id: editingBooth ? editingBooth.id : `booth_${Date.now()}`,
                areaId: selectedArea.id,
                status: values.exhibitorId ? 'occupied' : 'available'
            };
            let newBooths;
            if (editingBooth) {
                newBooths = boothData.booths.map(b => b.id === editingBooth.id ? newBooth : b);
            } else {
                newBooths = [...boothData.booths, newBooth];
            }
            setBoothData({ ...boothData, booths: newBooths });
            setBoothModalVisible(false);
            setEditingBooth(null);
            message.success('展位保存成功');
        } catch (e) {
            message.error('保存失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    console.log('Creating BoothManagement JSX...');

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
            items: getBreadcrumbItems(),
            style: { marginBottom: '16px' }
        }),

        renderCurrentView(),

        // Modal组件
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
            onFinish: handleVenueSave
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
            }, React.createElement(TextArea, { rows: 2, placeholder: '请输入描述' })),
            React.createElement(Form.Item, {
                key: 'submit',
                style: { textAlign: 'right' }
            }, React.createElement(Button, {
                type: 'primary',
                htmlType: 'submit',
                loading: loading
            }, '保存'))
        ])),

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
            onFinish: handleFloorSave
        }, [
            React.createElement(Form.Item, {
                key: 'name',
                label: '楼层名称',
                name: 'name',
                rules: [{ required: true, message: '请输入楼层名称' }]
            }, React.createElement(Input, { placeholder: '如：F1、F2等' })),
            React.createElement(Form.Item, {
                key: 'level',
                label: '楼层编号',
                name: 'level',
                rules: [{ required: true, message: '请输入楼层编号' }]
            }, React.createElement(InputNumber, { min: 1, max: 99, style: { width: '100%' } })),
            React.createElement(Form.Item, {
                key: 'description',
                label: '描述',
                name: 'description'
            }, React.createElement(TextArea, { rows: 2, placeholder: '请输入描述' })),
            React.createElement(Form.Item, {
                key: 'submit',
                style: { textAlign: 'right' }
            }, React.createElement(Button, {
                type: 'primary',
                htmlType: 'submit',
                loading: loading
            }, '保存'))
        ])),

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
            onFinish: handleAreaSave
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
            }, React.createElement(TextArea, { rows: 2, placeholder: '请输入描述' })),
            React.createElement(Form.Item, {
                key: 'color',
                label: '分区颜色',
                name: 'color',
                rules: [{ required: true, message: '请选择分区颜色' }]
            }, React.createElement(Input, { type: 'color', style: { width: 60, height: 32, padding: 0, border: 'none' } })),
            React.createElement(Form.Item, {
                key: 'submit',
                style: { textAlign: 'right' }
            }, React.createElement(Button, {
                type: 'primary',
                htmlType: 'submit',
                loading: loading
            }, '保存'))
        ])),

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
            onFinish: handleBoothSave
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
            }, boothData.exhibitors?.map(ex => React.createElement(Option, { key: ex.id, value: ex.id }, ex.name)))),
            React.createElement(Form.Item, {
                key: 'status',
                label: '展位状态',
                name: 'status'
            }, React.createElement(Select, {
                placeholder: '请选择状态'
            }, [
                React.createElement(Option, { key: 'available', value: 'available' }, '可预订'),
                React.createElement(Option, { key: 'occupied', value: 'occupied' }, '已占用'),
                React.createElement(Option, { key: 'reserved', value: 'reserved' }, '已预订')
            ])),
            React.createElement(Form.Item, {
                key: 'submit',
                style: { textAlign: 'right' }
            }, React.createElement(Button, {
                type: 'primary',
                htmlType: 'submit',
                loading: loading
            }, '保存'))
        ]))
    ]);
};

console.log('BoothManagement component defined');
window.BoothManagement = BoothManagement;
console.log('BoothManagement attached to window object'); 