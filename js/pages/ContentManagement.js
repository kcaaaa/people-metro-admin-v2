// 内容管理页面 - 支持内容发布和管理
const ContentManagement = () => {
    const { Card, Table, Button, Input, Select, Space, Tag, Modal, Form, Switch, Checkbox, message, Row, Col, Statistic, DatePicker, Tabs, Upload, Radio, Divider, Dropdown, Menu } = antd;
    const { Search } = Input;
    const { Option } = Select;
    const { RangePicker } = DatePicker;
    const { TabPane } = Tabs;
    const { TextArea } = Input;
    const { Dragger } = Upload;

    // 获取当前用户信息
    const [currentUser, setCurrentUser] = React.useState(AuthUtils.getCurrentUser());
    const userRole = currentUser?.role?.toUpperCase() || 'REGULAR_USER';
    const userId = currentUser?.userId || null;

    // 状态管理
    const [activeTab, setActiveTab] = React.useState('management');
    const [loading, setLoading] = React.useState(false);
    const [contentList, setContentList] = React.useState([]);
    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [filters, setFilters] = React.useState({
        contentType: 'all',
        status: 'all',
        board: 'all',
        keyword: '',
        dateRange: null
    });
    // 内容迁移相关状态
    const [selectedContentIds, setSelectedContentIds] = React.useState([]);
    const [migrateModalVisible, setMigrateModalVisible] = React.useState(false);
    const [targetBoard, setTargetBoard] = React.useState('');
    const [migratingContentId, setMigratingContentId] = React.useState(null); // 用于单条迁移时记录ID

    // 统计数据状态
    const [statsData, setStatsData] = React.useState({
        totalContent: 0,
        todayContent: 0,
        pendingReview: 0,
        publishedToday: 0
    });
    
    // 发布相关状态
    const [publishForm] = Form.useForm();
    const [contentType, setContentType] = React.useState('article');
    const [publishBoard, setPublishBoard] = React.useState('association');
    const [previewVisible, setPreviewVisible] = React.useState(false);
    const [previewData, setPreviewData] = React.useState(null);
    const [uploadedFiles, setUploadedFiles] = React.useState([]);
    const [richTextContent, setRichTextContent] = React.useState('');
    const [coverFile, setCoverFile] = React.useState(null);
    const [bgmFile, setBgmFile] = React.useState(null);
    
    // 详情模态框状态
    const [selectedContent, setSelectedContent] = React.useState(null);
    const [detailModalVisible, setDetailModalVisible] = React.useState(false);

    // 角色切换功能
    const handleRoleSwitch = (roleConfig) => {
        const newUser = {
            ...currentUser,
            ...roleConfig
        };
        AuthUtils.saveCurrentUser(newUser);
        setCurrentUser(newUser);
        message.success(`已切换到${roleConfig.roleName}角色`);
        
        // 清空当前筛选条件
        setFilters({
            contentType: 'all',
            status: 'all',
            board: 'all',
            keyword: '',
            dateRange: null
        });

        // 重置分页
        setPagination(prev => ({
            ...prev,
            current: 1
        }));

        // 延迟一下重新加载数据，确保状态更新完成
        setTimeout(() => {
            loadContentList();
        }, 100);
    };

    // 角色切换菜单
    const roleMenu = React.createElement(Menu, {
        onClick: ({ key }) => {
            const roleConfigs = {
                'SUPER_ADMIN': {
                    role: 'SUPER_ADMIN',
                    roleName: '超级管理员',
                    userId: 'admin_001',
                    name: '系统管理员',
                    username: 'admin'
                },
                'ASSOCIATION_ADMIN': {
                    role: 'ASSOCIATION_ADMIN',
                    roleName: '协会管理员',
                    userId: 'assoc_001',
                    name: '协会管理员',
                    username: 'association'
                },
                'REGULAR_USER': {
                    role: 'REGULAR_USER',
                    roleName: '普通用户',
                    userId: 'user_001',
                    name: '张三',
                    username: 'zhangsan'
                }
            };
            handleRoleSwitch(roleConfigs[key]);
        }
    }, [
        React.createElement(Menu.Item, { key: 'SUPER_ADMIN' }, '🔐 超级管理员'),
        React.createElement(Menu.Item, { key: 'ASSOCIATION_ADMIN' }, '🏛️ 协会管理员'),
        React.createElement(Menu.Item, { key: 'REGULAR_USER' }, '👤 普通用户')
    ]);

    // 富文本编辑器工具栏配置
    const editorTools = [
        { key: 'bold', icon: 'B', tooltip: '粗体' },
        { key: 'italic', icon: 'I', tooltip: '斜体' },
        { key: 'h1', icon: 'H1', tooltip: '一级标题' },
        { key: 'h2', icon: 'H2', tooltip: '二级标题' },
        { key: 'link', icon: '🔗', tooltip: '插入链接' },
        { key: 'image', icon: '🖼️', tooltip: '插入图片' },
        { key: 'list', icon: '📝', tooltip: '无序列表' }
    ];

    // 富文本编辑器
    const RichTextEditor = () => {
        const insertTag = (tag) => {
            const textarea = document.getElementById('richTextEditor');
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = richTextContent.substring(start, end);
            const beforeText = richTextContent.substring(0, start);
            const afterText = richTextContent.substring(end);
            
            let newText = '';
            switch(tag) {
                case 'bold':
                    newText = beforeText + `**${selectedText || '粗体文字'}**` + afterText;
                    break;
                case 'italic':
                    newText = beforeText + `*${selectedText || '斜体文字'}*` + afterText;
                    break;
                case 'h1':
                    newText = beforeText + `# ${selectedText || '一级标题'}` + afterText;
                    break;
                case 'h2':
                    newText = beforeText + `## ${selectedText || '二级标题'}` + afterText;
                    break;
                case 'link':
                    newText = beforeText + `[${selectedText || '链接文字'}](http://example.com)` + afterText;
                    break;
                case 'image':
                    newText = beforeText + `![图片描述](图片地址)` + afterText;
                    break;
                case 'list':
                    newText = beforeText + `\n- ${selectedText || '列表项'}\n- 列表项2\n- 列表项3\n` + afterText;
                    break;
                default:
                    return;
            }
            setRichTextContent(newText);
        };

        return React.createElement('div', {
            style: { border: '1px solid #d9d9d9', borderRadius: '6px' }
        }, [
            React.createElement('div', {
                key: 'toolbar',
                style: {
                    padding: '8px 12px',
                    borderBottom: '1px solid #f0f0f0',
                    background: '#fafafa',
                    display: 'flex',
                    gap: '8px'
                }
            }, editorTools.map(tool => 
                React.createElement(Button, {
                    key: tool.key,
                    size: 'small',
                    onClick: () => insertTag(tool.key),
                    title: tool.tooltip
                }, tool.icon)
            )),
            React.createElement(TextArea, {
                key: 'editor',
                id: 'richTextEditor',
                value: richTextContent,
                onChange: (e) => setRichTextContent(e.target.value),
                placeholder: '请输入文章内容...\n\n支持Markdown格式：\n**粗体** *斜体* # 标题\n[链接](url) ![图片](url)\n- 列表项',
                rows: 12,
                style: { 
                    border: 'none',
                    resize: 'vertical',
                    fontSize: '14px',
                    lineHeight: '1.6'
                }
            })
        ]);
    };

    // 模拟数据
    const mockContentData = [
        {
            id: 1,
            title: '城轨建设最新进展',
            type: 'video',
            board: 'exhibition',
            publisher: '张三',
            publisherId: 'user_001',
            publisherType: 'regular', // 普通用户
            publishTime: '2024-01-15 14:30:00',
            status: 'published',
            auditStatus: 'passed',
            viewCount: 12580,
            likeCount: 234,
            commentCount: 56,
            shareCount: 89,
            duration: '3:45',
            thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300',
            tags: ['城轨建设', '最新进展'],
            description: '介绍最新的城轨建设进展情况，包括技术突破和项目成果...'
        },
        {
            id: 2,
            title: '轨道交通技术创新分享',
            type: 'article',
            board: 'association',
            publisher: '李四',
            publisherId: 'assoc_001',
            publisherType: 'association', // 协会账号
            publisherAssociation: '城市轨道交通协会',
            publishTime: '2024-01-14 16:20:00',
            status: 'published',
            auditStatus: 'passed',
            viewCount: 8960,
            likeCount: 156,
            commentCount: 32,
            shareCount: 45,
            imageCount: 5,
            tags: ['技术创新', '分享'],
            description: '轨道交通领域的技术创新案例分享，展示行业最新发展动态...'
        },
        {
            id: 3,
            title: '展会现场精彩瞬间',
            type: 'video',
            board: 'recommended',
            publisher: '王五',
            publisherId: 'admin_001',
            publisherType: 'admin', // 管理员
            publishTime: '2024-01-13 10:15:00',
            status: 'pending',
            auditStatus: 'manual_pending',
            viewCount: 0,
            likeCount: 0,
            commentCount: 0,
            shareCount: 0,
            duration: '2:30',
            tags: ['展会', '精彩瞬间'],
            description: '记录展会现场的精彩瞬间，展示参展商的最新产品和技术...'
        },
        {
            id: 4,
            title: '协会年度工作报告',
            type: 'article',
            board: 'association',
            publisher: '协会秘书处',
            publisherId: 'assoc_002',
            publisherType: 'association', // 协会账号
            publisherAssociation: '城市轨道交通协会',
            publishTime: '2024-01-12 09:00:00',
            status: 'published',
            auditStatus: 'passed',
            viewCount: 5430,
            likeCount: 89,
            commentCount: 23,
            shareCount: 56,
            imageCount: 3,
            tags: ['年度报告', '协会动态'],
            description: '2023年度协会工作总结及2024年工作展望...'
        },
        {
            id: 5,
            title: '新型列车试运行视频',
            type: 'video',
            board: 'recommended',
            publisher: '技术部',
            publisherId: 'user_002',
            publisherType: 'regular', // 普通用户
            publishTime: '2024-01-11 15:45:00',
            status: 'published',
            auditStatus: 'passed',
            viewCount: 8900,
            likeCount: 178,
            commentCount: 45,
            shareCount: 67,
            duration: '5:20',
            thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300',
            tags: ['新技术', '试运行'],
            description: '最新型号列车在测试线路上的试运行画面...'
        },
        {
            id: 6,
            title: '行业标准解读',
            type: 'news',
            board: 'association',
            publisher: '标准委员会',
            publisherId: 'assoc_003',
            publisherType: 'association', // 协会账号
            publisherAssociation: '行业标准委员会',
            publishTime: '2024-01-10 11:30:00',
            status: 'published',
            auditStatus: 'passed',
            viewCount: 3200,
            likeCount: 45,
            commentCount: 12,
            shareCount: 34,
            tags: ['行业标准', '政策解读'],
            description: '最新发布的城市轨道交通行业标准详细解读...'
        }
    ];

    // 计算统计数据
    const calculateStats = (data) => {
        const today = new Date().toISOString().split('T')[0];
        
        return {
            totalContent: data.length,
            todayContent: data.filter(item => item.publishTime.startsWith(today)).length,
            pendingReview: data.filter(item => item.status === 'pending').length,
            publishedToday: data.filter(item => 
                item.status === 'published' && 
                item.publishTime.startsWith(today)
            ).length
        };
    };

    React.useEffect(() => {
        let isMounted = true;
        
        const loadContent = () => {
            if (activeTab === 'management') {
                loadContentList(isMounted);
            }
        };
        
        loadContent();
        
        return () => {
            isMounted = false;
        };
    }, [activeTab, pagination.current, pagination.pageSize, filters]);

    const loadContentList = async (isMounted) => {
        if (!isMounted) return;
        
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            let filteredData = [...mockContentData];
            
            // 根据用户角色过滤内容
            if (userRole === 'SUPER_ADMIN' || userRole === 'SYSTEM_ADMIN' || userRole === 'ADMIN') {
                // 超级管理员和系统管理员可以看到所有内容
                // 不需要额外过滤
            } else if (userRole === 'ASSOCIATION_ADMIN') {
                // 协会账号只能看到协会发布的内容
                filteredData = filteredData.filter(item => 
                    item.publisherType === 'association' || 
                    item.publisherId === userId
                );
            } else {
                // 其他用户只能看到自己发布的内容
                filteredData = filteredData.filter(item => 
                    item.publisherId === userId
                );
            }
            
            // 应用其他过滤条件
            if (filters.contentType !== 'all') {
                filteredData = filteredData.filter(item => item.type === filters.contentType);
            }
            if (filters.status !== 'all') {
                filteredData = filteredData.filter(item => item.status === filters.status);
            }
            if (filters.board !== 'all') {
                filteredData = filteredData.filter(item => item.board === filters.board);
            }
            if (filters.keyword) {
                filteredData = filteredData.filter(item => 
                    item.title.includes(filters.keyword) || 
                    item.description.includes(filters.keyword)
                );
            }
            
            // 更新统计数据
            if (isMounted) {
                setStatsData(calculateStats(filteredData));
                setContentList(filteredData);
                setPagination(prev => ({
                    ...prev,
                    total: filteredData.length
                }));
            }
        } catch (error) {
            if (isMounted) {
                message.error('加载内容列表失败');
            }
        } finally {
            if (isMounted) {
                setLoading(false);
            }
        }
    };

    // 内容迁移处理函数
    const handleContentMigration = async () => {
        if (!targetBoard) {
            message.error('请选择目标栏目');
            return;
        }

        setLoading(true);
        try {
            // 确定要迁移的内容ID列表
            const contentIdsToMigrate = migratingContentId ? [migratingContentId] : selectedContentIds;
            
            if (contentIdsToMigrate.length === 0) {
                message.error('请选择要迁移的内容');
                return;
            }

            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 更新本地数据
            contentIdsToMigrate.forEach(contentId => {
                const index = mockContentData.findIndex(item => item.id === contentId);
                if (index !== -1) {
                    mockContentData[index] = {
                        ...mockContentData[index],
                        board: targetBoard
                    };
                }
            });

            // 重置选择状态
            setSelectedContentIds([]);
            setMigratingContentId(null);
            setTargetBoard('');
            setMigrateModalVisible(false);

            // 重新加载内容列表
            loadContentList();

            message.success(`成功迁移 ${contentIdsToMigrate.length} 条内容到${getBoardTag(targetBoard).props.children}栏目`);
        } catch (error) {
            message.error('内容迁移失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    // 打开迁移模态框
    const openMigrateModal = (contentId = null) => {
        if (contentId) {
            // 单条内容迁移
            setMigratingContentId(contentId);
        } else {
            // 批量迁移，检查是否有选中内容
            if (selectedContentIds.length === 0) {
                message.warning('请先选择要迁移的内容');
                return;
            }
        }
        setTargetBoard('');
        setMigrateModalVisible(true);
    };

    // 封面上传配置
    const coverUploadProps = {
        name: 'cover',
        accept: 'image/*',
        maxCount: 1,
        fileList: coverFile ? [coverFile] : [],
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error('请上传图片格式的封面！');
                return false;
            }
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                message.error('封面图片大小不能超过5MB！');
                return false;
            }
            
            // 创建预览URL
            const newFile = {
                uid: Date.now(),
                name: file.name,
                status: 'done',
                url: URL.createObjectURL(file),
                originFileObj: file
            };
            setCoverFile(newFile);
            return false;
        },
        onRemove: () => {
            setCoverFile(null);
        }
    };

    // 背景音乐上传配置
    const bgmUploadProps = {
        name: 'bgm',
        accept: 'audio/*',
        maxCount: 1,
        fileList: bgmFile ? [bgmFile] : [],
        beforeUpload: (file) => {
            const isAudio = file.type.startsWith('audio/');
            if (!isAudio) {
                message.error('请上传音频格式的背景音乐！');
                return false;
            }
            const isLt10M = file.size / 1024 / 1024 < 10;
            if (!isLt10M) {
                message.error('背景音乐大小不能超过10MB！');
                return false;
            }
            
            // 创建预览URL
            const newFile = {
                uid: Date.now(),
                name: file.name,
                status: 'done',
                url: URL.createObjectURL(file),
                originFileObj: file
            };
            setBgmFile(newFile);
            return false;
        },
        onRemove: () => {
            setBgmFile(null);
        }
    };

    // 重置所有表单数据
    const resetFormData = () => {
        publishForm.resetFields();
        setRichTextContent('');
        setUploadedFiles([]);
        setCoverFile(null);
        setBgmFile(null);
    };

    // 发布内容处理函数
    const handlePublish = async (values) => {
        // 检查封面是否已上传
        if (!coverFile) {
            message.error('请上传内容封面！');
            return;
        }

        try {
            setLoading(true);
            
            // 根据用户角色设置发布者类型
            let publisherType = 'regular';
            if (userRole === 'SUPER_ADMIN' || userRole === 'SYSTEM_ADMIN' || userRole === 'ADMIN') {
                publisherType = 'admin';
            } else if (userRole === 'ASSOCIATION_ADMIN') {
                publisherType = 'association';
            }
            
            const publishData = {
                id: Date.now(), // 生成唯一ID
                ...values,
                contentType,
                publishBoard,
                richTextContent,
                uploadedFiles,
                cover: coverFile,
                bgm: bgmFile,
                publishTime: new Date().toISOString(),
                status: 'pending',
                auditStatus: 'ai_pending',
                // 添加发布者信息
                publisher: currentUser?.name || currentUser?.username || '未知用户',
                publisherId: userId,
                publisherType: publisherType,
                publisherAssociation: publisherType === 'association' ? '城市轨道交通协会' : undefined,
                // 初始化统计数据
                viewCount: 0,
                likeCount: 0,
                commentCount: 0,
                shareCount: 0
            };
            
            console.log('发布内容:', publishData);
            
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // 更新本地数据
            mockContentData.unshift(publishData);
            
            // 重新加载内容列表和统计数据
            loadContentList();
            
            message.success('内容发布成功，已提交审核！');
            
            // 重置表单
            resetFormData();
            setActiveTab('management');
            
        } catch (error) {
            message.error('发布失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    // 预览内容
    const handlePreview = () => {
        const formData = publishForm.getFieldsValue();
        setPreviewData({
            ...formData,
            contentType,
            publishBoard,
            richTextContent,
            uploadedFiles,
            cover: coverFile, // 添加封面预览
            bgm: bgmFile // 添加背景音乐预览
        });
        setPreviewVisible(true);
    };

    // 文件上传处理
    const handleUpload = {
        name: 'file',
        multiple: true,
        accept: contentType === 'video' ? 'video/*' : 'image/*,video/*',
        beforeUpload: (file) => {
            const isValidType = contentType === 'video' 
                ? file.type.startsWith('video/')
                : file.type.startsWith('image/') || file.type.startsWith('video/');
            
            if (!isValidType) {
                message.error('请上传正确的文件类型！');
                return false;
            }

            const isLt50M = file.size / 1024 / 1024 < 50;
            if (!isLt50M) {
                message.error('文件大小不能超过50MB！');
                return false;
            }

            // 模拟文件上传
            const newFile = {
                uid: Date.now() + Math.random(),
                name: file.name,
                status: 'done',
                url: URL.createObjectURL(file),
                type: file.type
            };
            
            setUploadedFiles(prev => [...prev, newFile]);
            return false; // 阻止默认上传
        },
        onRemove: (file) => {
            setUploadedFiles(prev => prev.filter(item => item.uid !== file.uid));
        },
        fileList: uploadedFiles,
    };

    const getStatusTag = (status) => {
        const statusMap = {
            published: { color: 'green', text: '已发布' },
            pending: { color: 'orange', text: '待审核' },
            rejected: { color: 'red', text: '已拒绝' },
            draft: { color: 'gray', text: '草稿' }
        };
        const config = statusMap[status] || { color: 'gray', text: '未知' };
        return React.createElement(Tag, { color: config.color }, config.text);
    };

    const getAuditStatusTag = (status) => {
        const statusMap = {
            passed: { color: 'green', text: '审核通过' },
            rejected: { color: 'red', text: '审核拒绝' },
            ai_pending: { color: 'blue', text: 'AI审核中' },
            manual_pending: { color: 'orange', text: '人工审核中' },
            pending: { color: 'gray', text: '待审核' }
        };
        const config = statusMap[status] || { color: 'gray', text: '未知' };
        return React.createElement(Tag, { color: config.color }, config.text);
    };

    const getBoardTag = (board) => {
        const boardMap = {
            association: { color: 'blue', text: '协会板块' },
            recommended: { color: 'gold', text: '推荐板块' }
        };
        const config = boardMap[board] || { color: 'gray', text: '未知' };
        return React.createElement(Tag, { color: config.color, key: `board-tag-${board}` }, config.text);
    };

    // 渲染发布页面
    const renderPublishPage = () => {
        const formItemLayout = {
            labelCol: { span: 24 },
            wrapperCol: { span: 24 }
        };

        // 是否显示背景音乐上传
        const showBgmUpload = contentType === 'article' || contentType === 'news';

        return React.createElement('div', { key: 'publish-page' }, [
            React.createElement('div', {
                key: 'header',
                style: { marginBottom: '24px' }
            }, [
                React.createElement('h2', {
                    key: 'title',
                    style: { fontSize: '24px', fontWeight: '600', margin: '0 0 8px 0' }
                }, '发布内容'),
                React.createElement('p', {
                    key: 'description',
                    style: { color: '#666', fontSize: '14px', margin: '0' }
                }, '发布视频、图文等内容到协会、推荐板块，支持富文本编辑和预览')
            ]),

            React.createElement(Form, {
                key: 'publishForm',
                form: publishForm,
                layout: 'vertical',
                onFinish: handlePublish,
                ...formItemLayout
            }, [
                React.createElement(Row, {
                    key: 'basicInfo',
                    gutter: 24
                }, [
                    React.createElement(Col, { key: 'left-col', span: 12 }, [
                        React.createElement(Form.Item, {
                            key: 'contentType',
                            label: '内容类型'
                        }, React.createElement(Radio.Group, {
                            value: contentType,
                            onChange: (e) => {
                                setContentType(e.target.value);
                                // 当切换内容类型时，清空内容详情
                                publishForm.setFieldValue('content', '');
                                setRichTextContent('');
                            }
                        }, [
                            React.createElement(Radio.Button, { key: 'article', value: 'article' }, '📄 图文'),
                            React.createElement(Radio.Button, { key: 'video', value: 'video' }, '🎬 视频'),
                            React.createElement(Radio.Button, { key: 'news', value: 'news' }, '📰 资讯')
                        ])),

                        React.createElement(Form.Item, {
                            key: 'board',
                            label: '发布板块'
                        }, React.createElement(Radio.Group, {
                            value: publishBoard,
                            onChange: (e) => setPublishBoard(e.target.value)
                        }, [
                            React.createElement(Radio.Button, { key: 'association', value: 'association' }, '🏛️ 协会板块'),
                            React.createElement(Radio.Button, { key: 'recommended', value: 'recommended' }, '⭐ 推荐板块')
                        ]))
                    ]),

                    React.createElement(Col, { key: 'right-col', span: 12 }, [
                        React.createElement(Form.Item, {
                            key: 'title',
                            label: '标题',
                            name: 'title',
                            rules: [{ required: true, message: '请输入标题' }]
                        }, React.createElement(Input, {
                            placeholder: '请输入内容标题',
                            maxLength: 100,
                            showCount: true
                        })),

                        React.createElement(Form.Item, {
                            key: 'tags',
                            label: '标签',
                            name: 'tags'
                        }, React.createElement(Select, {
                            mode: 'tags',
                            placeholder: '请输入或选择标签',
                            style: { width: '100%' },
                            options: [
                                { key: 'tag1', value: '城轨建设' },
                                { key: 'tag2', value: '技术创新' },
                                { key: 'tag3', value: '展会活动' },
                                { key: 'tag4', value: '行业动态' },
                                { key: 'tag5', value: '产品展示' }
                            ]
                        }))
                    ])
                ]),

                // 封面上传
                React.createElement(Form.Item, {
                    key: 'cover',
                    label: '内容封面',
                    required: true,
                    help: '支持jpg、png格式，建议尺寸800x600，大小不超过5MB'
                }, React.createElement(Upload, {
                    ...coverUploadProps,
                    listType: 'picture-card'
                }, !coverFile && [
                    React.createElement('div', {
                        key: 'upload-button',
                        style: { padding: '8px 0' }
                    }, [
                        React.createElement('div', { 
                            key: 'icon',
                            style: { marginBottom: 8 }
                        }, '📷'),
                        React.createElement('div', { 
                            key: 'text',
                            style: { fontSize: 12 }
                        }, '上传封面')
                    ])
                ])),

                // 背景音乐上传（仅在图文和资讯类型时显示）
                showBgmUpload && React.createElement(Form.Item, {
                    key: 'bgm',
                    label: '背景音乐',
                    help: '支持mp3格式，大小不超过10MB'
                }, React.createElement(Upload, {
                    ...bgmUploadProps,
                    listType: 'text'
                }, !bgmFile && React.createElement(Button, {
                    icon: React.createElement('span', null, '🎵'),
                }, '上传背景音乐'))),

                // 根据内容类型渲染不同的内容编辑器
                contentType === 'news' ?
                    React.createElement(Form.Item, {
                        key: 'content',
                        label: '内容详情',
                        required: true,
                        help: '支持富文本编辑，可使用Markdown语法'
                    }, RichTextEditor()) :
                    React.createElement(Form.Item, {
                        key: 'content',
                        label: '内容详情',
                        name: 'content',
                        rules: [{ required: true, message: '请输入内容详情' }]
                    }, React.createElement(TextArea, {
                        placeholder: '请输入内容详情',
                        rows: 6,
                        maxLength: 2000,
                        showCount: true
                    })),

                // 文件上传（根据内容类型显示不同的提示）
                React.createElement(Form.Item, {
                    key: 'upload',
                    label: contentType === 'video' ? '上传视频' : '上传图片/视频'
                }, React.createElement(Dragger, {
                    ...handleUpload,
                    style: { marginBottom: '16px' }
                }, [
                    React.createElement('p', {
                        key: 'icon',
                        style: { fontSize: '48px', margin: '16px 0 8px 0' }
                    }, contentType === 'video' ? '🎬' : '📁'),
                    React.createElement('p', {
                        key: 'text',
                        style: { fontSize: '16px', color: '#666' }
                    }, '点击或拖拽文件到此区域上传'),
                    React.createElement('p', {
                        key: 'hint',
                        style: { fontSize: '14px', color: '#999' }
                    }, contentType === 'video' ? '支持MP4、AVI、MOV等视频格式，大小不超过50MB' : '支持JPG、PNG、GIF、MP4等格式，大小不超过50MB')
                ])),

                React.createElement('div', {
                    key: 'actions',
                    style: { 
                        textAlign: 'center',
                        paddingTop: '24px',
                        borderTop: '1px solid #f0f0f0'
                    }
                }, React.createElement(Space, { key: 'action-space', size: 'large' }, [
                    React.createElement(Button, {
                        key: 'preview',
                        size: 'large',
                        onClick: handlePreview
                    }, '🔍 预览内容'),
                    React.createElement(Button, {
                        key: 'save',
                        size: 'large'
                    }, '💾 保存草稿'),
                    React.createElement(Button, {
                        key: 'publish',
                        type: 'primary',
                        size: 'large',
                        htmlType: 'submit',
                        loading: loading
                    }, '🚀 立即发布')
                ]))
            ])
        ]);
    };

    // 渲染管理页面
    const renderManagementPage = () => {
        // 获取角色显示名称
        const getRoleDisplayName = () => {
            const roleMap = {
                'SUPER_ADMIN': '超级管理员',
                'SYSTEM_ADMIN': '系统管理员',
                'ADMIN': '管理员',
                'ASSOCIATION_ADMIN': '协会管理员',
                'REGULAR_USER': '普通用户'
            };
            return roleMap[userRole] || '普通用户';
        };

        // 获取权限范围描述
        const getPermissionDescription = () => {
            if (userRole === 'SUPER_ADMIN' || userRole === 'SYSTEM_ADMIN' || userRole === 'ADMIN') {
                return '您可以查看和管理所有用户发布的内容';
            } else if (userRole === 'ASSOCIATION_ADMIN') {
                return '您可以查看和管理所有协会发布的内容';
            } else {
                return '您只能查看和管理自己发布的内容';
            }
        };

        const columns = [
            {
                title: React.createElement('input', {
                    type: 'checkbox',
                    checked: selectedContentIds.length === contentList.length && contentList.length > 0,
                    onChange: (e) => {
                        if (e.target.checked) {
                            // 全选
                            const allIds = contentList.map(item => item.id);
                            setSelectedContentIds(allIds);
                        } else {
                            // 取消全选
                            setSelectedContentIds([]);
                        }
                    }
                }),
                key: 'selection',
                width: 50,
                render: (_, record) => React.createElement('input', {
                    type: 'checkbox',
                    checked: selectedContentIds.includes(record.id),
                    onChange: (e) => {
                        if (e.target.checked) {
                            setSelectedContentIds([...selectedContentIds, record.id]);
                        } else {
                            setSelectedContentIds(selectedContentIds.filter(id => id !== record.id));
                        }
                    }
                })
            },
            {
                title: '内容信息',
                key: 'content',
                width: 300,
                render: (_, record) => React.createElement('div', {
                    style: { display: 'flex', alignItems: 'center' }
                }, [
                    React.createElement('div', {
                        key: 'thumb',
                        style: {
                            width: 60,
                            height: 60,
                            background: record.thumbnail ? `url(${record.thumbnail})` : '#f0f0f0',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: 4,
                            marginRight: 12,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 24
                        }
                    }, !record.thumbnail && (record.type === 'video' ? '🎬' : '📄')),
                    React.createElement('div', { key: 'info' }, [
                        React.createElement('div', {
                            key: 'title',
                            style: { fontWeight: 'bold', marginBottom: 4 }
                        }, record.title),
                        React.createElement('div', {
                            key: 'meta',
                            style: { fontSize: 12, color: '#666' }
                        }, [
                            getBoardTag(record.board),
                            React.createElement('span', {
                                key: 'publisher',
                                style: { marginLeft: 8 }
                            }, `发布者：${record.publisher}`)
                        ])
                    ])
                ])
            },
            {
                title: '发布时间',
                dataIndex: 'publishTime',
                width: 150,
                sorter: true
            },
            {
                title: '状态',
                key: 'status',
                width: 120,
                render: (_, record) => React.createElement('div', {}, [
                    getStatusTag(record.status),
                    React.createElement('br', { key: 'br' }),
                    getAuditStatusTag(record.auditStatus)
                ])
            },
            {
                title: '数据统计',
                key: 'stats',
                width: 150,
                render: (_, record) => React.createElement('div', {
                    style: { fontSize: 12 }
                }, [
                    React.createElement('div', { key: 'view' }, `观看：${record.viewCount}`),
                    React.createElement('div', { key: 'like' }, `点赞：${record.likeCount}`),
                    React.createElement('div', { key: 'comment' }, `评论：${record.commentCount}`)
                ])
            },
            {
                title: '操作',
                key: 'actions',
                width: 250,
                render: (_, record) => React.createElement(Space, {}, [
                    React.createElement(Button, {
                        key: 'view',
                        type: 'link',
                        size: 'small',
                        onClick: () => {
                            setSelectedContent(record);
                            setDetailModalVisible(true);
                        }
                    }, '查看详情'),
                    React.createElement(Button, {
                        key: 'edit',
                        type: 'link',
                        size: 'small'
                    }, '编辑'),
                    React.createElement(Button, {
                        key: 'migrate',
                        type: 'link',
                        size: 'small',
                        onClick: () => openMigrateModal(record.id)
                    }, '迁移'),
                    record.status === 'published' ? 
                        React.createElement(Button, {
                            key: 'hide',
                            type: 'link',
                            size: 'small',
                            danger: true
                        }, '下架') :
                        React.createElement(Button, {
                            key: 'publish',
                            type: 'link',
                            size: 'small'
                        }, '发布')
                ])
            }
        ];

        return React.createElement('div', {}, [
            // 角色权限提示
            React.createElement(Card, {
                key: 'role-info',
                size: 'small',
                style: { 
                    marginBottom: 16,
                    background: '#e6f7ff',
                    borderColor: '#91d5ff'
                }
            }, React.createElement('div', {
                style: { 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16
                }
            }, [
                React.createElement('div', {
                    key: 'icon',
                    style: {
                        fontSize: 24,
                        marginRight: 8
                    }
                }, '👤'),
                React.createElement('div', { key: 'info' }, [
                    React.createElement('div', {
                        key: 'role',
                        style: { 
                            fontWeight: 'bold',
                            fontSize: 16,
                            marginBottom: 4
                        }
                    }, `当前角色：${getRoleDisplayName()}`),
                    React.createElement('div', {
                        key: 'permission',
                        style: { 
                            color: '#666',
                            fontSize: 14
                        }
                    }, getPermissionDescription())
                ]),
                React.createElement(Dropdown, { overlay: roleMenu },
                    React.createElement(Button, {
                        type: 'link',
                        style: { padding: '0 8px' }
                    }, '切换角色')
                )
            ])),

            // 统计卡片
            React.createElement(Row, { 
                key: 'stats', 
                gutter: 16, 
                style: { marginBottom: 24 } 
            }, [
                React.createElement(Col, { key: 'total', span: 6 },
                    React.createElement(Card, { size: 'small' },
                        React.createElement(Statistic, {
                            title: '总内容数',
                            value: statsData.totalContent,
                            prefix: '📄'
                        })
                    )
                ),
                React.createElement(Col, { key: 'today', span: 6 },
                    React.createElement(Card, { size: 'small' },
                        React.createElement(Statistic, {
                            title: '今日新增',
                            value: statsData.todayContent,
                            prefix: '📈'
                        })
                    )
                ),
                React.createElement(Col, { key: 'pending', span: 6 },
                    React.createElement(Card, { size: 'small' },
                        React.createElement(Statistic, {
                            title: '待审核',
                            value: statsData.pendingReview,
                            prefix: '⏳'
                        })
                    )
                ),
                React.createElement(Col, { key: 'published', span: 6 },
                    React.createElement(Card, { size: 'small' },
                        React.createElement(Statistic, {
                            title: '今日发布',
                            value: statsData.publishedToday,
                            prefix: '✅'
                        })
                    )
                )
            ]),

            // 筛选器
            React.createElement(Card, {
                key: 'filters',
                size: 'small',
                style: { marginBottom: 16 }
            }, React.createElement(Row, { gutter: 16, align: 'middle' }, [
                React.createElement(Col, { key: 'type', span: 4 },
                    React.createElement(Select, {
                        placeholder: '内容类型',
                        value: filters.contentType,
                        onChange: (value) => setFilters(prev => ({ ...prev, contentType: value })),
                        style: { width: '100%' }
                    }, [
                        React.createElement(Option, { key: 'all', value: 'all' }, '全部类型'),
                        React.createElement(Option, { key: 'video', value: 'video' }, '视频'),
                        React.createElement(Option, { key: 'article', value: 'article' }, '图文'),
                        React.createElement(Option, { key: 'news', value: 'news' }, '资讯')
                    ])
                ),
                React.createElement(Col, { key: 'status', span: 4 },
                    React.createElement(Select, {
                        placeholder: '发布状态',
                        value: filters.status,
                        onChange: (value) => setFilters(prev => ({ ...prev, status: value })),
                        style: { width: '100%' }
                    }, [
                        React.createElement(Option, { key: 'all', value: 'all' }, '全部状态'),
                        React.createElement(Option, { key: 'published', value: 'published' }, '已发布'),
                        React.createElement(Option, { key: 'pending', value: 'pending' }, '待审核'),
                        React.createElement(Option, { key: 'rejected', value: 'rejected' }, '已拒绝'),
                        React.createElement(Option, { key: 'draft', value: 'draft' }, '草稿')
                    ])
                ),
                React.createElement(Col, { key: 'board', span: 4 },
                    React.createElement(Select, {
                        placeholder: '发布板块',
                        value: filters.board,
                        onChange: (value) => setFilters(prev => ({ ...prev, board: value })),
                        style: { width: '100%' }
                    }, [
                        React.createElement(Option, { key: 'all', value: 'all' }, '全部板块'),
                        React.createElement(Option, { key: 'association', value: 'association' }, '协会板块'),
                        React.createElement(Option, { key: 'recommended', value: 'recommended' }, '推荐板块')
                    ])
                ),
                React.createElement(Col, { key: 'search', span: 12 },
                    React.createElement(Search, {
                        placeholder: '搜索标题或内容',
                        value: filters.keyword,
                        onChange: (e) => setFilters(prev => ({ ...prev, keyword: e.target.value })),
                        onSearch: loadContentList,
                        enterButton: true
                    })
                )
            ])),

            // 内容表格
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
                    React.createElement('h3', { key: 'title' }, '内容列表'),
                    React.createElement(Space, { key: 'actions' }, [
                        React.createElement(Button, {
                            key: 'refresh',
                            onClick: loadContentList
                        }, '刷新'),
                        React.createElement(Button, {
                            key: 'batch-migrate',
                            onClick: () => {
                                if (selectedContentIds.length > 0) {
                                    openMigrateModal();
                                }
                            },
                            disabled: selectedContentIds.length === 0
                        }, '批量迁移'),
                        React.createElement(Button, {
                            key: 'publish',
                            type: 'primary',
                            onClick: () => setActiveTab('publish')
                        }, '发布内容')
                    ])
                ]),

                React.createElement(Table, {
                    key: 'table',
                    columns: columns,
                    dataSource: contentList,
                    loading: loading,
                    rowKey: 'id',
                    pagination: {
                        ...pagination,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 条记录`,
                        onChange: (page, pageSize) => {
                            setPagination(prev => ({ ...prev, current: page, pageSize }));
                        }
                    },
                    rowSelection: {
                        selectedRowKeys: selectedContentIds,
                        onChange: (selectedRowKeys) => setSelectedContentIds(selectedRowKeys)
                    },
                    rowKey: 'id',
                    scroll: { x: 1000 }
                })
            ])
        ]);
    };

    // 更新预览模态框，显示封面和背景音乐信息
    const renderPreviewModal = () => {
        if (!previewData) return null;

        return React.createElement(Modal, {
            title: '内容预览',
            visible: previewVisible,
            onCancel: () => setPreviewVisible(false),
            footer: [
                React.createElement(Button, {
                    key: 'close',
                    onClick: () => setPreviewVisible(false)
                }, '关闭'),
                React.createElement(Button, {
                    key: 'publish',
                    type: 'primary',
                    onClick: () => {
                        setPreviewVisible(false);
                        publishForm.submit();
                    }
                }, '确认发布')
            ],
            width: 800
        }, React.createElement('div', {
            style: { padding: '16px 0' }
        }, [
            // 封面预览
            coverFile && React.createElement('div', {
                key: 'cover',
                style: { 
                    marginBottom: '24px',
                    textAlign: 'center'
                }
            }, React.createElement('img', {
                src: coverFile.url,
                alt: '内容封面',
                style: {
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: '8px'
                }
            })),

            // 背景音乐信息
            bgmFile && React.createElement('div', {
                key: 'bgm',
                style: {
                    marginBottom: '16px',
                    padding: '8px 16px',
                    background: '#f5f5f5',
                    borderRadius: '4px'
                }
            }, [
                React.createElement('span', { key: 'icon' }, '🎵 '),
                React.createElement('span', null, '背景音乐：'),
                React.createElement('span', null, bgmFile.name)
            ]),

            React.createElement('div', {
                key: 'header',
                style: { marginBottom: '24px', textAlign: 'center' }
            }, [
                React.createElement('h2', {
                    key: 'title',
                    style: { margin: '0 0 8px 0' }
                }, previewData.title || '未填写标题'),
                React.createElement('div', {
                    key: 'meta',
                    style: { color: '#666', fontSize: '14px' }
                }, [
                    getBoardTag(previewData.publishBoard),
                    React.createElement('span', {
                        key: 'type',
                        style: { marginLeft: '8px' }
                    }, previewData.contentType === 'video' ? '视频内容' : previewData.contentType === 'news' ? '资讯内容' : '图文内容'),
                    React.createElement('span', {
                        key: 'time',
                        style: { marginLeft: '8px' }
                    }, `发布时间：${new Date().toLocaleString()}`)
                ])
            ]),
            React.createElement('div', {
                key: 'description',
                style: { 
                    padding: '16px',
                    background: '#f9f9f9',
                    borderRadius: '8px',
                    marginBottom: '16px'
                }
            }, previewData.description || '未填写摘要'),
            React.createElement('div', {
                key: 'content',
                style: { 
                    padding: '16px',
                    border: '1px solid #f0f0f0',
                    borderRadius: '8px',
                    minHeight: '200px',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.6'
                }
            }, previewData.richTextContent || '未填写内容'),
            previewData.uploadedFiles && previewData.uploadedFiles.length > 0 && React.createElement('div', {
                key: 'files',
                style: { marginTop: '16px' }
            }, [
                React.createElement('h4', {
                    key: 'title',
                    style: { marginBottom: '12px' }
                }, '附件文件'),
                React.createElement('div', {
                    key: 'fileList',
                    style: { display: 'flex', flexWrap: 'wrap', gap: '8px' }
                }, previewData.uploadedFiles.map(file => 
                    React.createElement('div', {
                        key: file.uid,
                        style: {
                            padding: '8px 12px',
                            background: '#f0f0f0',
                            borderRadius: '4px',
                            fontSize: '12px'
                        }
                    }, file.name)
                ))
            ])
        ]));
    };

    // 渲染详情模态框
    const renderDetailModal = () => {
        if (!selectedContent) return null;

        return React.createElement(Modal, {
            title: '内容详情',
            visible: detailModalVisible,
            onCancel: () => setDetailModalVisible(false),
            footer: [
                React.createElement(Button, {
                    key: 'close',
                    onClick: () => setDetailModalVisible(false)
                }, '关闭')
            ],
            width: 800
        }, React.createElement('div', {}, [
            React.createElement('h3', { key: 'title' }, selectedContent.title),
            React.createElement('p', { key: 'desc' }, selectedContent.description),
            React.createElement('div', { key: 'meta', style: { marginTop: 16 } }, [
                React.createElement('p', { key: 'publisher' }, `发布者：${selectedContent.publisher}`),
                React.createElement('p', { key: 'time' }, `发布时间：${selectedContent.publishTime}`),
                React.createElement('p', { key: 'board' }, ['发布板块：', getBoardTag(selectedContent.board)]),
                React.createElement('p', { key: 'type' }, `内容类型：${selectedContent.type === 'video' ? '视频' : selectedContent.type === 'news' ? '资讯' : '图文'}`),
                selectedContent.duration && React.createElement('p', { key: 'duration' }, `视频时长：${selectedContent.duration}`),
                selectedContent.imageCount && React.createElement('p', { key: 'images' }, `图片数量：${selectedContent.imageCount}张`)
            ])
        ]));
    };

    return React.createElement('div', { className: 'page-fade-in' }, [
        React.createElement('div', { key: 'header', className: 'page-header' }, [
            React.createElement('h1', { key: 'title', className: 'page-title' }, '内容管理'),
            React.createElement('p', { key: 'desc', className: 'page-description' }, 
                '发布和管理平台内容，支持视频、图文发布到协会、推荐板块'
            )
        ]),

        React.createElement(Tabs, {
            key: 'tabs',
            activeKey: activeTab,
            onChange: setActiveTab,
            size: 'large'
        }, [
            React.createElement(TabPane, {
                key: 'management',
                tab: React.createElement('span', {}, ['📋 ', '内容管理'])
            }, renderManagementPage()),
            React.createElement(TabPane, {
                key: 'publish',
                tab: React.createElement('span', {}, ['✏️ ', '发布内容'])
            }, renderPublishPage())
        ]),

        renderPreviewModal(),
        renderDetailModal(),
        
        // 内容迁移模态框
        React.createElement(Modal, {
            key: 'migrate-modal',
            title: migratingContentId ? '迁移内容' : '批量迁移内容',
            open: migrateModalVisible,
            onCancel: () => {
                setMigrateModalVisible(false);
                setTargetBoard('');
                setSelectedContentIds([]);
            },
            footer: [
                React.createElement(Button, {
                    key: 'cancel',
                    onClick: () => {
                        setMigrateModalVisible(false);
                        setTargetBoard('');
                        setSelectedContentIds([]);
                    }
                }, '取消'),
                React.createElement(Button, {
                    key: 'confirm',
                    type: 'primary',
                    onClick: handleContentMigration,
                    loading: migratingContentId && loading
                }, '确认迁移')
            ],
            width: 600,
            children: React.createElement('div', { key: 'migrate-content' }, [
                React.createElement('p', { style: { marginBottom: 16 } },
                    migratingContentId ? 
                        '将当前内容迁移到新栏目' : 
                        `即将迁移 ${selectedContentIds.length} 条内容到新栏目`
                ),
                React.createElement(Form.Item, {
                    label: '目标栏目',
                    rules: [{ required: true, message: '请选择目标栏目' }]
                },
                    React.createElement(Select, {
                        placeholder: '请选择目标栏目',
                        value: targetBoard,
                        onChange: (value) => setTargetBoard(value),
                        style: { width: '100%' }
                    }, [
                        React.createElement(Option, { key: 'association', value: 'association' }, '协会板块'),
                        React.createElement(Option, { key: 'recommended', value: 'recommended' }, '推荐板块')
                    ])
                )
            ])
        })
    ]);
};

window.App.pages.ContentManagement = ContentManagement;
console.log('[ContentManagement] 组件挂载成功');