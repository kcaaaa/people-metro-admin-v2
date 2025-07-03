// 版本: v2.1 - 2025-07-03-23:40 - 修复按钮点击事件 - CACHE_BUST_20250703_2340
// 展位管理页面 - 展会展位信息管理
const BoothManagement = () => {
    console.log('BoothManagement component is rendering...');
    
    const { Row, Col, Card, Button, Space, Alert, Tag, Table, Modal, Form, Input, Select, message, Tabs, Upload, Tree, Image, Divider, Statistic, Progress, InputNumber, Radio, Switch, DatePicker } = antd;
    const { TextArea } = Input;
    const { Option } = Select;
    const { RangePicker: DateRangePicker } = DatePicker;
    
    // 状态管理
    const [activeTab, setActiveTab] = React.useState('floor');
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

            // 添加快捷操作区
            React.createElement(Card, {
                key: 'quick-actions',
                title: '快捷操作',
                style: { marginBottom: '24px' }
            }, React.createElement(Space, { size: 'middle', wrap: true }, [
                React.createElement(Button, {
                    key: 'goto-floor',
                    type: 'primary',
                    onClick: () => setActiveTab('floor')
                }, '🏗️ 楼层分区管理'),
                React.createElement(Button, {
                    key: 'new-floor',
                    onClick: () => {
                        console.log('=== 楼层分区页-新建楼层按钮被点击 ===');
                        alert('楼层分区页-新建楼层按钮被点击！');
                        createNewFloor();
                    }
                }, '➕ 新建楼层'),
                React.createElement(Button, {
                    key: 'new-area',
                    onClick: () => {
                        console.log('=== 楼层分区页-新建分区按钮被点击 ===');
                        alert('楼层分区页-新建分区按钮被点击！');
                        createNewArea();
                    }
                }, '➕ 新建分区'),
                React.createElement(Button, {
                    key: 'export',
                    onClick: () => handleExport()
                }, '📊 导出数据')
            ])),

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
                                onClick: () => {
                                    console.log('=== 楼层分区页-新建楼层按钮被点击 ===');
                                    alert('楼层分区页-新建楼层按钮被点击！');
                                    createNewFloor();
                                }
                            }, '新建楼层'),
                            React.createElement(Button, {
                                size: 'small',
                                onClick: () => {
                                    console.log('=== 楼层分区页-新建分区按钮被点击 ===');
                                    alert('楼层分区页-新建分区按钮被点击！');
                                    createNewArea();
                                }
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
                                setSelectedFloor(null); // 清空楼层选中
                            } else {
                                // 选择了楼层
                                const floor = boothData.floors.find(f => f.id === node.key);
                                setSelectedFloor(floor);
                                setSelectedArea(null); // 清空分区选中
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
                        React.createElement('p', { key: 'boothNumber' }, `展位编号: ${selectedArea.boothNumber || '-'}`),
                        React.createElement('p', { key: 'svgPath' }, `SVG坐标: ${selectedArea.svgPath || '-'}`),
                        React.createElement('p', { key: 'exhibitor' }, `绑定展商: ${selectedArea.exhibitorName || '-'}`),
                        selectedArea.boothImage && React.createElement(Image, {
                            key: 'boothImage',
                            src: selectedArea.boothImage,
                            alt: `${selectedArea.name}展位图`,
                            style: { maxWidth: '100%', maxHeight: '200px', margin: '8px 0' }
                        }),
                        React.createElement('div', {
                            key: 'color',
                            style: {
                                width: '100px',
                                height: '30px',
                                backgroundColor: selectedArea.color,
                                borderRadius: '4px',
                                border: '1px solid #d9d9d9',
                                margin: '8px 0'
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
        console.log('createNewFloor clicked');
        setEditingFloor(null);
        floorForm.resetFields();
        setFloorModalVisible(true);
        console.log('floorModalVisible set to true');
    };

    const editFloor = (floor) => {
        console.log('editFloor clicked with floor:', floor);
        setEditingFloor(floor);
        floorForm.setFieldsValue(floor);
        setFloorModalVisible(true);
    };

    const createNewArea = () => {
        console.log('createNewArea clicked');
        setEditingArea(null);
        areaForm.resetFields();
        setAreaModalVisible(true);
        console.log('areaModalVisible set to true');
    };

    const editArea = (area) => {
        console.log('editArea clicked with area:', area);
        setEditingArea(area);
        areaForm.setFieldsValue(area);
        setAreaModalVisible(true);
    };

    const uploadBoothMap = (floor) => {
        setSelectedFloor(floor);
        setBoothMapModalVisible(true);
    };

    // 楼层管理函数
    const manageFloors = (venue) => {
        console.log('manageFloors clicked for venue:', venue);
        setActiveTab('floor'); // 切换到楼层分区Tab
        message.info(`已切换到${venue.name}的楼层管理`);
    };

    // 删除场馆函数
    const deleteVenue = (venue) => {
        console.log('deleteVenue clicked for venue:', venue);
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

    // 删除楼层函数
    const deleteFloor = (floor) => {
        console.log('deleteFloor clicked for floor:', floor);
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

    // 删除分区函数
    const deleteArea = (area) => {
        console.log('deleteArea clicked for area:', area);
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

    // 分区/展位保存逻辑
    const handleAreaSave = async (values) => {
        console.log('handleAreaSave called with values:', values);
        setLoading(true);
        try {
            // 处理展位图上传
            let boothImageUrl = values.boothImage && values.boothImage[0] && values.boothImage[0].originFileObj
                ? URL.createObjectURL(values.boothImage[0].originFileObj)
                : (editingArea ? editingArea.boothImage : undefined);
            // 处理展商名称
            let exhibitorName = '';
            if (values.exhibitorId && boothData.exhibitors) {
                const ex = boothData.exhibitors.find(e => e.id === values.exhibitorId);
                exhibitorName = ex ? ex.name : '';
            }
            // 构建新分区/展位对象
            const newArea = {
                ...editingArea,
                ...values,
                boothImage: boothImageUrl,
                exhibitorName,
                id: editingArea ? editingArea.id : `area_${Date.now()}`,
                floorId: editingArea ? editingArea.floorId : 'floor_f1' // 默认分配到F1
            };
            // 更新areas数据
            let newAreas;
            if (editingArea) {
                newAreas = boothData.areas.map(a => a.id === editingArea.id ? newArea : a);
            } else {
                newAreas = [...boothData.areas, newArea];
            }
            setBoothData({ ...boothData, areas: newAreas });
            setAreaModalVisible(false);
            setEditingArea(null);
            message.success('分区/展位保存成功');
            console.log('Area saved successfully:', newArea);
        } catch (e) {
            console.error('Save area error:', e);
            message.error('保存失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    // 楼层保存逻辑
    const handleFloorSave = async (values) => {
        console.log('handleFloorSave called with values:', values);
        setLoading(true);
        try {
            const newFloor = {
                ...editingFloor,
                ...values,
                id: editingFloor ? editingFloor.id : `floor_${Date.now()}`,
                venueId: 'venue_001', // 默认分配到主场馆
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
            console.log('Floor saved successfully:', newFloor);
        } catch (e) {
            console.error('Save floor error:', e);
            message.error('保存失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    // 场馆保存逻辑
    const handleVenueSave = async (values) => {
        console.log('handleVenueSave called with values:', values);
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
            console.log('Venue saved successfully:', newVenue);
        } catch (e) {
            console.error('Save venue error:', e);
            message.error('保存失败，请重试');
        } finally {
            setLoading(false);
        }
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
            defaultActiveKey: 'floor',
            onChange: setActiveTab
        }),

        // 这里会添加各种Modal组件
        // 场馆Modal、楼层Modal、分区Modal等
        areaModalVisible && React.createElement(Modal, {
            key: 'area-modal',
            title: editingArea ? '编辑分区/展位' : '新建分区/展位',
            visible: areaModalVisible,
            onCancel: () => setAreaModalVisible(false),
            footer: null,
            destroyOnClose: true,
            width: 600
        }, React.createElement(Form, {
            form: areaForm,
            layout: 'vertical',
            onFinish: handleAreaSave
        }, [
            React.createElement(Form.Item, {
                key: 'name',
                label: '分区/展位名称',
                name: 'name',
                rules: [{ required: true, message: '请输入分区/展位名称' }]
            }, React.createElement(Input, { placeholder: '如：A区、N4、S5等' })),
            React.createElement(Form.Item, {
                key: 'boothNumber',
                label: '展位编号',
                name: 'boothNumber',
                rules: [
                    { required: true, message: '请输入展位编号' },
                    { pattern: /^[A-Za-z0-9\-]+$/, message: '仅支持字母、数字和-符号' }
                ]
            }, React.createElement(Input, { placeholder: '如：A-3420、N4等' })),
            React.createElement(Form.Item, {
                key: 'svgPath',
                label: '展位坐标/形状（SVG）',
                name: 'svgPath',
                rules: [{ required: true, message: '请输入SVG Path/Rect/Circle等' }]
            }, React.createElement(Input, { placeholder: '如：M10 10 H 90 V 90 H 10 Z' })),
            React.createElement(Form.Item, {
                key: 'exhibitorId',
                label: '绑定展商',
                name: 'exhibitorId',
                rules: [{ required: false }]
            }, React.createElement(Select, {
                showSearch: true,
                placeholder: '请选择展商',
                filterOption: (input, option) => (option.children || '').toLowerCase().includes(input.toLowerCase())
            }, (boothData.exhibitors || []).map(ex => React.createElement(Option, { key: ex.id, value: ex.id }, ex.name)))),
            React.createElement(Form.Item, {
                key: 'boothImage',
                label: '展位图（SVG/PNG/JPG）',
                name: 'boothImage',
                valuePropName: 'fileList',
                getValueFromEvent: e => Array.isArray(e) ? e : e && e.fileList
            }, React.createElement(Upload, {
                name: 'file',
                listType: 'picture',
                maxCount: 1,
                accept: '.svg,.png,.jpg,.jpeg',
                beforeUpload: () => false
            }, React.createElement(Button, {}, '上传展位图'))),
            React.createElement(Form.Item, {
                key: 'color',
                label: '分区颜色',
                name: 'color',
                rules: [{ required: true, message: '请选择分区颜色' }]
            }, React.createElement(Input, { type: 'color', style: { width: 60, height: 32, padding: 0, border: 'none' } })),
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
        ]))
    ]);
};

console.log('BoothManagement component defined');
window.BoothManagement = BoothManagement;
console.log('BoothManagement attached to window object'); 