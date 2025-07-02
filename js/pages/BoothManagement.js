// 展位管理页面 - 展会展位信息管理
const BoothManagement = () => {
    console.log('BoothManagement component is rendering...');
    
    const { Row, Col, Card, Button, Space, Alert, Tag, Table, Modal, Form, Input, Select, message, Tabs, Upload, Tree, Image, Divider, Statistic, Progress, InputNumber, Radio, Switch, DatePicker } = antd;
    const { TextArea } = Input;
    const { Option } = Select;
    const { RangePicker: DateRangePicker } = DatePicker;
    
    // 状态管理
    const [activeTab, setActiveTab] = React.useState('venue');
    const [venueModalVisible, setVenueModalVisible] = React.useState(false);
    const [floorModalVisible, setFloorModalVisible] = React.useState(false);
    const [areaModalVisible, setAreaModalVisible] = React.useState(false);
    const [boothMapModalVisible, setBoothMapModalVisible] = React.useState(false);
    const [editingVenue, setEditingVenue] = React.useState(null);
    const [editingFloor, setEditingFloor] = React.useState(null);
    const [editingArea, setEditingArea] = React.useState(null);
    const [selectedFloor, setSelectedFloor] = React.useState(null);
    const [selectedArea, setSelectedArea] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    
    const [venueForm] = Form.useForm();
    const [floorForm] = Form.useForm();
    const [areaForm] = Form.useForm();
    
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
            }
        ],
        
        // 楼层数据
        floors: [
            { id: 'floor_f1', venueId: 'venue_001', name: 'F1', level: 1, description: '一层展区', areaCount: 3, boothCount: 45, mapUrl: '/images/floor_f1_map.jpg' },
            { id: 'floor_f2', venueId: 'venue_001', name: 'F2', level: 2, description: '二层展区', areaCount: 3, boothCount: 45, mapUrl: '/images/floor_f2_map.jpg' },
            { id: 'floor_f3', venueId: 'venue_001', name: 'F3', level: 3, description: '三层展区', areaCount: 3, boothCount: 30, mapUrl: '/images/floor_f3_map.jpg' },
            { id: 'floor_f4', venueId: 'venue_001', name: 'F4', level: 4, description: '四层展区', areaCount: 3, boothCount: 30, mapUrl: '/images/floor_f4_map.jpg' }
        ],
        
        // 分区数据
        areas: [
            { id: 'area_a', floorId: 'floor_f1', name: 'A区', description: '核心技术展示区', boothCount: 15, color: '#1890ff' },
            { id: 'area_b', floorId: 'floor_f1', name: 'B区', description: '创新产品展示区', boothCount: 15, color: '#52c41a' },
            { id: 'area_c', floorId: 'floor_f1', name: 'C区', description: '解决方案展示区', boothCount: 15, color: '#faad14' },
            { id: 'area_d', floorId: 'floor_f2', name: 'D区', description: '智能装备展示区', boothCount: 15, color: '#f759ab' },
            { id: 'area_e', floorId: 'floor_f2', name: 'E区', description: '数字化展示区', boothCount: 15, color: '#722ed1' },
            { id: 'area_f', floorId: 'floor_f2', name: 'F区', description: '绿色技术展示区', boothCount: 15, color: '#13c2c2' }
        ],
        
        // 统计数据
        statistics: {
            totalVenues: 1,
            totalFloors: 4,
            totalAreas: 12,
            totalBooths: 150,
            occupiedBooths: 89
        }
    });

    // 搜索和筛选状态
    const [searchText, setSearchText] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [typeFilter, setTypeFilter] = React.useState('all');
    const [venueFilter, setVenueFilter] = React.useState('all');
    const [floorFilter, setFloorFilter] = React.useState('all');
    const [timeRange, setTimeRange] = React.useState(null);

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

    // 重置筛选条件
    const resetFilters = () => {
        setSearchText('');
        setStatusFilter('all');
        setTypeFilter('all');
        setVenueFilter('all');
        setFloorFilter('all');
        setTimeRange(null);
    };

    // 导出数据
    const handleExport = () => {
        const currentData = getCurrentData();
        const filteredData = filterData(currentData);
        
        message.loading('正在导出数据...', 2);
        setTimeout(() => {
            message.success(`已导出 ${filteredData.length} 条${getTabDisplayName(activeTab)}数据`);
        }, 2000);
    };

    // 获取当前Tab的数据
    const getCurrentData = () => {
        switch(activeTab) {
            case 'venue': return boothData.venues;
            case 'floor': return boothData.floors;
            default: return [];
        }
    };

    // 获取Tab显示名称
    const getTabDisplayName = (tab) => {
        const names = {
            venue: '场馆',
            floor: '楼层分区'
        };
        return names[tab] || '数据';
    };

    // 数据筛选逻辑
    const filterData = (data) => {
        if (!data || data.length === 0) return [];
        
        return data.filter(item => {
            // 根据不同Tab应用不同的筛选逻辑
            if (activeTab === 'venue') {
                return filterVenues(item);
            } else if (activeTab === 'floor') {
                return filterFloors(item);
            }
            return true;
        });
    };

    // 场馆筛选逻辑
    const filterVenues = (venue) => {
        // 文本搜索
        if (searchText && 
            !venue.name?.toLowerCase().includes(searchText.toLowerCase()) && 
            !venue.description?.toLowerCase().includes(searchText.toLowerCase()) &&
            !venue.address?.toLowerCase().includes(searchText.toLowerCase())) {
            return false;
        }
        
        // 状态筛选
        if (statusFilter !== 'all' && venue.status !== statusFilter) {
            return false;
        }
        
        return true;
    };

    // 楼层筛选逻辑
    const filterFloors = (floor) => {
        // 文本搜索
        if (searchText && 
            !floor.name?.toLowerCase().includes(searchText.toLowerCase()) && 
            !floor.description?.toLowerCase().includes(searchText.toLowerCase()) &&
            !floor.venueName?.toLowerCase().includes(searchText.toLowerCase())) {
            return false;
        }
        
        // 状态筛选
        if (statusFilter !== 'all' && floor.status !== statusFilter) {
            return false;
        }
        
        // 场馆筛选
        if (venueFilter !== 'all' && floor.venueId !== venueFilter) {
            return false;
        }
        
        return true;
    };

    // 渲染场馆管理
    const renderVenueManagement = () => {
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
                        key: 'edit',
                        size: 'small',
                        onClick: () => editVenue(record)
                    }, '编辑'),
                    React.createElement(Button, {
                        key: 'floors',
                        size: 'small',
                        type: 'primary',
                        onClick: () => manageFloors(record)
                    }, '楼层管理'),
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
                message: '场馆信息管理',
                description: '管理展会场馆基本信息，包括场馆名称、地址、描述等',
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

    // 渲染楼层分区管理
    const renderFloorAreaManagement = () => {
        // 构建楼层树形数据
        const treeData = boothData.floors.map(floor => ({
            title: React.createElement('div', {
                style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }
            }, [
                React.createElement('span', { key: 'name' }, `${floor.name} - ${floor.description}`),
                React.createElement('span', { 
                    key: 'count', 
                    style: { color: '#666', fontSize: '12px' } 
                }, `${floor.areaCount}个分区 ${floor.boothCount}个展位`)
            ]),
            key: floor.id,
            children: boothData.areas
                .filter(area => area.floorId === floor.id)
                .map(area => ({
                    title: React.createElement('div', {
                        style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }
                    }, [
                        React.createElement('span', { key: 'name' }, `${area.name} - ${area.description}`),
                        React.createElement('span', { 
                            key: 'count', 
                            style: { color: '#666', fontSize: '12px' } 
                        }, `${area.boothCount}个展位`)
                    ]),
                    key: area.id,
                    isLeaf: true
                }))
        }));

        return React.createElement('div', {}, [
            React.createElement(Alert, {
                key: 'floor-info',
                message: '楼层分区管理',
                description: '管理展会楼层和分区信息，设置展位分布和区域划分',
                type: 'info',
                showIcon: true,
                style: { marginBottom: '24px' }
            }),

            React.createElement(Row, { key: 'floor-content', gutter: [24, 24] }, [
                React.createElement(Col, { span: 10 }, [
                    React.createElement(Card, {
                        title: '楼层分区结构',
                        extra: React.createElement(Space, { size: 'small' }, [
                            React.createElement(Button, {
                                size: 'small',
                                onClick: () => createNewFloor()
                            }, '新建楼层'),
                            React.createElement(Button, {
                                size: 'small',
                                onClick: () => createNewArea()
                            }, '新建分区')
                        ])
                    }, React.createElement(Tree, {
                        treeData: treeData,
                        defaultExpandAll: true,
                        onSelect: (selectedKeys, info) => {
                            const { node } = info;
                            if (node.isLeaf) {
                                // 选择了分区
                                const area = boothData.areas.find(a => a.id === node.key);
                                setSelectedArea(area);
                            } else {
                                // 选择了楼层
                                const floor = boothData.floors.find(f => f.id === node.key);
                                setSelectedFloor(floor);
                            }
                        }
                    }))
                ]),
                
                React.createElement(Col, { span: 14 }, [
                    selectedFloor && React.createElement(Card, {
                        key: 'floor-details',
                        title: `${selectedFloor.name} 楼层详情`,
                        extra: React.createElement(Space, { size: 'small' }, [
                            React.createElement(Button, {
                                size: 'small',
                                onClick: () => editFloor(selectedFloor)
                            }, '编辑楼层'),
                            React.createElement(Button, {
                                size: 'small',
                                onClick: () => uploadBoothMap(selectedFloor)
                            }, '上传展位图')
                        ]),
                        style: { marginBottom: '16px' }
                    }, [
                        React.createElement('p', { key: 'desc' }, selectedFloor.description),
                        React.createElement('p', { key: 'stats' }, `分区数量: ${selectedFloor.areaCount} | 展位数量: ${selectedFloor.boothCount}`),
                        selectedFloor.mapUrl && React.createElement(Image, {
                            key: 'map',
                            src: selectedFloor.mapUrl,
                            alt: `${selectedFloor.name}展位图`,
                            style: { maxWidth: '100%', maxHeight: '300px' }
                        })
                    ]),
                    
                    selectedArea && React.createElement(Card, {
                        key: 'area-details',
                        title: `${selectedArea.name} 分区详情`,
                        extra: React.createElement(Button, {
                            size: 'small',
                            onClick: () => editArea(selectedArea)
                        }, '编辑分区')
                    }, [
                        React.createElement('p', { key: 'desc' }, selectedArea.description),
                        React.createElement('p', { key: 'stats' }, `展位数量: ${selectedArea.boothCount}`),
                        React.createElement('div', {
                            key: 'color',
                            style: {
                                width: '100px',
                                height: '30px',
                                backgroundColor: selectedArea.color,
                                borderRadius: '4px',
                                border: '1px solid #d9d9d9'
                            }
                        })
                    ])
                ])
            ])
        ]);
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

    const uploadBoothMap = (floor) => {
        setSelectedFloor(floor);
        setBoothMapModalVisible(true);
    };

    // Tab配置
    const tabItems = [
        {
            key: 'venue',
            label: '🏢 场馆管理',
            children: renderVenueManagement()
        },
        {
            key: 'floor',
            label: '🏗️ 楼层分区',
            children: renderFloorAreaManagement()
        }
    ];

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

        React.createElement(Tabs, {
            key: 'main-tabs',
            items: tabItems,
            defaultActiveKey: 'venue',
            onChange: setActiveTab
        }),

        // 这里会添加各种Modal组件
        // 场馆Modal、楼层Modal、分区Modal等
    ]);
};

console.log('BoothManagement component defined');
window.BoothManagement = BoothManagement;
console.log('BoothManagement attached to window object'); 