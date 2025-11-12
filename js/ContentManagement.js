// 内容管理主页面组件
const ContentManagement = () => {
    const { Layout, Typography, Card, Row, Col, Button, message, Spin, Empty } = antd;
    const { Title, Text, Paragraph } = Typography;
    const { Content } = Layout;
    
    const [loading, setLoading] = React.useState(false);
    const [selectedTab, setSelectedTab] = React.useState('all'); // 默认为全部内容
    const [contentList, setContentList] = React.useState([]);
    
    // 初始化加载内容列表
    React.useEffect(() => {
        loadContentList();
    }, [selectedTab]);
    
    // 加载内容列表
    const loadContentList = async () => {
        try {
            setLoading(true);
            
            // 模拟API请求
            console.log(`加载${selectedTab}类型的内容列表`);
            
            // 这里应该调用实际的API接口
            // const response = await API.getContentList({ type: selectedTab });
            // setContentList(response.data);
            
            // 模拟数据
            const mockData = [
                {
                    id: '1',
                    title: '城轨安全运营管理规范更新通知',
                    type: 'notice',
                    publishDate: '2023-11-15',
                    status: 'published',
                    views: 1253
                },
                {
                    id: '2',
                    title: '地铁5号线延长线工程进度报告',
                    type: 'report',
                    publishDate: '2023-11-10',
                    status: 'published',
                    views: 892
                },
                {
                    id: '3',
                    title: '2023年度城轨行业技术研讨会通知',
                    type: 'event',
                    publishDate: '2023-11-08',
                    status: 'pending',
                    views: 0
                }
            ];
            
            // 根据选中的标签过滤内容
            let filteredData = mockData;
            if (selectedTab !== 'all') {
                filteredData = mockData.filter(item => item.type === selectedTab);
            }
            
            setContentList(filteredData);
            
            // 延迟一下模拟网络请求
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } catch (error) {
            console.error('加载内容列表失败:', error);
            message.error('加载内容列表失败，请重试');
            setContentList([]);
        } finally {
            setLoading(false);
        }
    };
    
    // 处理内容创建
    const handleCreateContent = () => {
        console.log('创建新内容');
        // 这里应该跳转到内容创建页面或打开创建弹窗
        message.info('创建内容功能待实现');
    };
    
    // 处理内容编辑
    const handleEditContent = (contentId) => {
        console.log(`编辑内容 ID: ${contentId}`);
        // 这里应该跳转到内容编辑页面或打开编辑弹窗
        message.info(`编辑内容功能待实现，内容ID: ${contentId}`);
    };
    
    // 处理内容删除
    const handleDeleteContent = (contentId) => {
        console.log(`删除内容 ID: ${contentId}`);
        // 这里应该显示确认对话框并调用删除API
        message.info(`删除内容功能待实现，内容ID: ${contentId}`);
    };
    
    // 渲染内容卡片
    const renderContentCard = (content) => {
        return (
            <Card
                key={content.id}
                title={content.title}
                extra={
                    <div>
                        <Button 
                            size="small" 
                            onClick={() => handleEditContent(content.id)}
                            style={{ marginRight: '8px' }}
                        >
                            编辑
                        </Button>
                        <Button 
                            size="small" 
                            danger 
                            onClick={() => handleDeleteContent(content.id)}
                        >
                            删除
                        </Button>
                    </div>
                }
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
                <div>
                    <Text type="secondary">类型: {getContentTypeLabel(content.type)}</Text>
                    <br />
                    <Text type="secondary">发布日期: {content.publishDate}</Text>
                    <br />
                    <Text type="secondary">状态: {content.status === 'published' ? '已发布' : '待发布'}</Text>
                    <br />
                    <Text type="secondary">浏览量: {content.views}</Text>
                </div>
            </Card>
        );
    };
    
    // 获取内容类型标签
    const getContentTypeLabel = (type) => {
        const typeMap = {
            notice: '通知公告',
            report: '报告文件',
            event: '活动信息',
            news: '新闻资讯'
        };
        return typeMap[type] || '未知类型';
    };
    
    // 获取内容统计信息
    const getContentStatistics = () => {
        // 这里应该从API获取真实统计数据
        return {
            total: 42,
            published: 38,
            pending: 4,
            drafts: 12
        };
    };
    
    const statistics = getContentStatistics();
    
    return (
        <Content style={{ padding: 24, background: '#fff', minHeight: 280 }}>
            <div className="content-management-container">
                <div className="page-header">
                    <Row align="middle" justify="space-between">
                        <Col>
                            <Title level={2}>内容管理</Title>
                            <Paragraph type="secondary">管理所有城轨相关内容，包括通知公告、报告文件、活动信息等</Paragraph>
                        </Col>
                        <Col>
                            <Button 
                                type="primary" 
                                onClick={handleCreateContent}
                                icon={<i className="fa-solid fa-plus"></i>}
                            >
                                创建新内容
                            </Button>
                        </Col>
                    </Row>
                </div>
                
                {/* 统计卡片 */}
                <Row gutter={16} style={{ marginBottom: '24px', marginTop: '24px' }}>
                    <Col xs={24} sm={12} md={6}>
                        <Card bordered={false}>
                            <div className="stat-card">
                                <Text type="secondary">总内容数</Text>
                                <Title level={3}>{statistics.total}</Title>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card bordered={false}>
                            <div className="stat-card">
                                <Text type="secondary">已发布</Text>
                                <Title level={3}>{statistics.published}</Title>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card bordered={false}>
                            <div className="stat-card">
                                <Text type="secondary">待审核</Text>
                                <Title level={3}>{statistics.pending}</Title>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card bordered={false}>
                            <div className="stat-card">
                                <Text type="secondary">草稿</Text>
                                <Title level={3}>{statistics.drafts}</Title>
                            </div>
                        </Card>
                    </Col>
                </Row>
                
                {/* 内容类型切换标签 */}
                <div className="content-tabs" style={{ marginBottom: '24px' }}>
                    <Button 
                        type={selectedTab === 'all' ? 'primary' : 'default'}
                        onClick={() => setSelectedTab('all')}
                        style={{ marginRight: '8px' }}
                    >
                        全部
                    </Button>
                    <Button 
                        type={selectedTab === 'notice' ? 'primary' : 'default'}
                        onClick={() => setSelectedTab('notice')}
                        style={{ marginRight: '8px' }}
                    >
                        通知公告
                    </Button>
                    <Button 
                        type={selectedTab === 'report' ? 'primary' : 'default'}
                        onClick={() => setSelectedTab('report')}
                        style={{ marginRight: '8px' }}
                    >
                        报告文件
                    </Button>
                    <Button 
                        type={selectedTab === 'event' ? 'primary' : 'default'}
                        onClick={() => setSelectedTab('event')}
                    >
                        活动信息
                    </Button>
                </div>
                
                {/* 内容列表 */}
                <div className="content-list">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <Spin size="large" tip="加载中..." />
                        </div>
                    ) : contentList.length === 0 ? (
                        <Empty 
                            description={`暂无${selectedTab !== 'all' ? getContentTypeLabel(selectedTab) : ''}内容`}
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    ) : (
                        <Row gutter={16}>
                            {contentList.map(content => (
                                <Col xs={24} sm={12} md={8} key={content.id}>
                                    {renderContentCard(content)}
                                </Col>
                            ))}
                        </Row>
                    )}
                </div>
            </div>
        </Content>
    );
};

// 将组件挂载到window对象，供App组件使用
console.log('🚀 ContentManagement 组件初始化');
window.ContentManagement = ContentManagement;
console.log('✅ ContentManagement 组件已挂载到 window');