// APP版本管理页面
const VersionManagement = () => {
    const { Card, Table, Button, Input, Select, Space, Tag, Modal, Form, Switch, message, Row, Col, Upload, Progress, Radio, DatePicker } = antd;
    const { Search } = Input;
    const { Option } = Select;
    const { Dragger } = Upload;

    const [loading, setLoading] = React.useState(false);
    const [versionList, setVersionList] = React.useState([]);
    const [uploadModalVisible, setUploadModalVisible] = React.useState(false);
    const [configModalVisible, setConfigModalVisible] = React.useState(false);
    const [currentVersion, setCurrentVersion] = React.useState(null);
    const [uploading, setUploading] = React.useState(false);
    const [uploadProgress, setUploadProgress] = React.useState(0);
    const [form] = Form.useForm();
    const [configForm] = Form.useForm();

    // 模拟数据
    const mockVersionData = [
        {
            id: 1,
            version: '2.1.0',
            versionCode: 210,
            platform: 'both',
            status: 'published',
            publishTime: '2024-01-15 14:30:00',
            updateType: 'optional',
            downloadCount: 1250,
            updateRate: 78.5,
            fileSize: '45.2MB',
            description: '1. 新增夜间模式功能\n2. 优化视频播放性能\n3. 修复已知问题\n4. 提升用户体验',
            features: ['夜间模式', '性能优化', '问题修复'],
            minSystemVersion: {
                android: '7.0',
                ios: '13.0'
            },
            grayScale: {
                enabled: false,
                percentage: 0,
                userGroups: []
            },
            forceUpdate: false,
            createTime: '2024-01-15 10:00:00'
        },
        {
            id: 2,
            version: '2.0.8',
            versionCode: 208,
            platform: 'both',
            status: 'published',
            publishTime: '2024-01-10 16:20:00',
            updateType: 'recommended',
            downloadCount: 2180,
            updateRate: 92.3,
            fileSize: '43.8MB',
            description: '1. 修复登录验证码问题\n2. 优化内容加载速度\n3. 增强系统稳定性',
            features: ['登录优化', '性能提升', '稳定性增强'],
            minSystemVersion: {
                android: '6.0',
                ios: '12.0'
            },
            grayScale: {
                enabled: false,
                percentage: 0,
                userGroups: []
            },
            forceUpdate: false,
            createTime: '2024-01-10 09:30:00'
        },
        {
            id: 3,
            version: '2.1.1',
            versionCode: 211,
            platform: 'both',
            status: 'testing',
            publishTime: null,
            updateType: 'optional',
            downloadCount: 0,
            updateRate: 0,
            fileSize: '46.1MB',
            description: '1. 新增用户反馈功能\n2. 优化审核流程\n3. 修复部分机型兼容性问题',
            features: ['反馈功能', '审核优化', '兼容性修复'],
            minSystemVersion: {
                android: '7.0',
                ios: '13.0'
            },
            grayScale: {
                enabled: true,
                percentage: 10,
                userGroups: ['beta', 'vip']
            },
            forceUpdate: false,
            createTime: '2024-01-16 11:00:00'
        }
    ];

    React.useEffect(() => {
        loadVersionList();
    }, []);

    const loadVersionList = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setVersionList(mockVersionData);
        } catch (error) {
            message.error('加载版本列表失败');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateVersion = () => {
        setCurrentVersion(null);
        form.resetFields();
        setUploadModalVisible(true);
    };

    const handleConfigUpdate = (version) => {
        setCurrentVersion(version);
        configForm.setFieldsValue({
            updateType: version.updateType,
            forceUpdate: version.forceUpdate,
            grayScaleEnabled: version.grayScale.enabled,
            grayScalePercentage: version.grayScale.percentage
        });
        setConfigModalVisible(true);
    };

    const handlePublishVersion = async (versionId) => {
        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setVersionList(prev => 
                prev.map(item => 
                    item.id === versionId 
                        ? { 
                            ...item, 
                            status: 'published',
                            publishTime: new Date().toLocaleString()
                        }
                        : item
                )
            );
            message.success('版本发布成功');
        } catch (error) {
            message.error('版本发布失败');
        } finally {
            setLoading(false);
        }
    };

    const handleWithdrawVersion = async (versionId) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            setVersionList(prev => 
                prev.map(item => 
                    item.id === versionId 
                        ? { ...item, status: 'withdrawn' }
                        : item
                )
            );
            message.success('版本已下架');
        } catch (error) {
            message.error('版本下架失败');
        }
    };

    const handleUploadVersion = async (values) => {
        try {
            setUploading(true);
            setUploadProgress(0);
            
            // 模拟上传进度
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(progressInterval);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 200);
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const newVersion = {
                id: Date.now(),
                ...values,
                versionCode: parseInt(values.version.replace(/\./g, '')),
                status: 'testing',
                publishTime: null,
                downloadCount: 0,
                updateRate: 0,
                fileSize: '45.8MB',
                grayScale: {
                    enabled: false,
                    percentage: 0,
                    userGroups: []
                },
                forceUpdate: false,
                createTime: new Date().toLocaleString()
            };
            
            setVersionList(prev => [newVersion, ...prev]);
            message.success('版本上传成功');
            setUploadModalVisible(false);
            setUploadProgress(0);
        } catch (error) {
            message.error('版本上传失败');
        } finally {
            setUploading(false);
        }
    };

    const handleSaveConfig = async (values) => {
        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));
            
            setVersionList(prev => 
                prev.map(item => 
                    item.id === currentVersion.id 
                        ? { 
                            ...item, 
                            updateType: values.updateType,
                            forceUpdate: values.forceUpdate,
                            grayScale: {
                                ...item.grayScale,
                                enabled: values.grayScaleEnabled,
                                percentage: values.grayScalePercentage || 0
                            }
                        }
                        : item
                )
            );
            
            message.success('更新策略配置成功');
            setConfigModalVisible(false);
        } catch (error) {
            message.error('配置保存失败');
        } finally {
            setLoading(false);
        }
    };

    const getStatusTag = (status) => {
        const statusMap = {
            testing: { color: 'blue', text: '测试中' },
            published: { color: 'green', text: '已发布' },
            withdrawn: { color: 'red', text: '已下架' },
            draft: { color: 'gray', text: '草稿' }
        };
        const config = statusMap[status] || { color: 'gray', text: '未知' };
        return React.createElement(Tag, { color: config.color }, config.text);
    };

    const getUpdateTypeTag = (type) => {
        const typeMap = {
            forced: { color: 'red', text: '强制更新' },
            recommended: { color: 'orange', text: '推荐更新' },
            optional: { color: 'green', text: '可选更新' }
        };
        const config = typeMap[type] || { color: 'gray', text: '未知' };
        return React.createElement(Tag, { color: config.color, size: 'small' }, config.text);
    };

    const getPlatformTag = (platform) => {
        const platformMap = {
            android: { color: 'green', text: 'Android' },
            ios: { color: 'blue', text: 'iOS' },
            both: { color: 'purple', text: 'Android & iOS' }
        };
        const config = platformMap[platform] || { color: 'gray', text: '未知' };
        return React.createElement(Tag, { color: config.color, size: 'small' }, config.text);
    };

    const columns = [
        {
            title: '版本信息',
            key: 'info',
            width: 200,
            render: (_, record) => React.createElement('div', {}, [
                React.createElement('div', {
                    key: 'version',
                    style: { fontWeight: 'bold', marginBottom: 4 }
                }, `v${record.version}`),
                React.createElement('div', {
                    key: 'code',
                    style: { fontSize: 12, color: '#666', marginBottom: 8 }
                }, `版本号：${record.versionCode}`),
                React.createElement('div', { key: 'tags' }, [
                    getPlatformTag(record.platform),
                    React.createElement('span', { key: 'space', style: { marginLeft: 8 } }),
                    getUpdateTypeTag(record.updateType)
                ])
            ])
        },
        {
            title: '状态',
            key: 'status',
            width: 100,
            render: (_, record) => React.createElement('div', {}, [
                getStatusTag(record.status),
                record.grayScale.enabled && React.createElement('div', {
                    key: 'gray',
                    style: { marginTop: 4 }
                }, React.createElement(Tag, { color: 'blue', size: 'small' }, `灰度${record.grayScale.percentage}%`))
            ])
        },
        {
            title: '文件大小',
            dataIndex: 'fileSize',
            width: 100
        },
        {
            title: '更新数据',
            key: 'updateData',
            width: 150,
            render: (_, record) => record.status === 'published' ? React.createElement('div', {}, [
                React.createElement('div', { key: 'download' }, `下载：${record.downloadCount}`),
                React.createElement('div', {
                    key: 'rate',
                    style: { fontSize: 12, color: '#666' }
                }, `更新率：${record.updateRate}%`)
            ]) : React.createElement('span', { style: { color: '#999' } }, '-')
        },
        {
            title: '发布时间',
            key: 'publishTime',
            width: 150,
            render: (_, record) => record.publishTime || React.createElement('span', { style: { color: '#999' } }, '未发布')
        },
        {
            title: '操作',
            key: 'actions',
            width: 250,
            render: (_, record) => {
                const actions = [];
                
                if (record.status === 'testing') {
                    actions.push(
                        React.createElement(Button, {
                            key: 'publish',
                            type: 'link',
                            size: 'small',
                            onClick: () => handlePublishVersion(record.id)
                        }, '发布')
                    );
                }
                
                if (record.status === 'published') {
                    actions.push(
                        React.createElement(Button, {
                            key: 'withdraw',
                            type: 'link',
                            size: 'small',
                            danger: true,
                            onClick: () => {
                                Modal.confirm({
                                    title: '确认下架',
                                    content: '下架后用户将无法下载此版本，确定要下架吗？',
                                    onOk: () => handleWithdrawVersion(record.id)
                                });
                            }
                        }, '下架')
                    );
                }
                
                actions.push(
                    React.createElement(Button, {
                        key: 'config',
                        type: 'link',
                        size: 'small',
                        onClick: () => handleConfigUpdate(record)
                    }, '更新策略')
                );
                
                return React.createElement(Space, {}, actions);
            }
        }
    ];

    const renderUploadModal = () => {
        return React.createElement(Modal, {
            title: '上传新版本',
            visible: uploadModalVisible,
            onCancel: () => setUploadModalVisible(false),
            footer: null,
            width: 600
        }, React.createElement(Form, {
            form: form,
            layout: 'vertical',
            onFinish: handleUploadVersion
        }, [
            React.createElement(Row, { key: 'row1', gutter: 16 }, [
                React.createElement(Col, { key: 'version', span: 12 },
                    React.createElement(Form.Item, {
                        label: '版本号',
                        name: 'version',
                        rules: [{ required: true, message: '请输入版本号' }]
                    }, React.createElement(Input, { placeholder: '如：2.1.2' }))
                ),
                React.createElement(Col, { key: 'platform', span: 12 },
                    React.createElement(Form.Item, {
                        label: '平台',
                        name: 'platform',
                        rules: [{ required: true, message: '请选择平台' }]
                    }, React.createElement(Select, { placeholder: '请选择平台' }, [
                        React.createElement(Option, { key: 'android', value: 'android' }, 'Android'),
                        React.createElement(Option, { key: 'ios', value: 'ios' }, 'iOS'),
                        React.createElement(Option, { key: 'both', value: 'both' }, 'Android & iOS')
                    ]))
                )
            ]),

            React.createElement(Form.Item, {
                key: 'description',
                label: '更新说明',
                name: 'description',
                rules: [{ required: true, message: '请输入更新说明' }]
            }, React.createElement(Input.TextArea, {
                placeholder: '请输入更新说明，每行一条',
                rows: 4
            })),

            React.createElement(Form.Item, {
                key: 'features',
                label: '主要功能（可选）',
                name: 'features'
            }, React.createElement(Select, {
                mode: 'tags',
                placeholder: '输入主要功能，回车添加'
            })),

            React.createElement(Form.Item, {
                key: 'updateType',
                label: '更新类型',
                name: 'updateType',
                rules: [{ required: true, message: '请选择更新类型' }]
            }, React.createElement(Radio.Group, {}, [
                React.createElement(Radio, { key: 'optional', value: 'optional' }, '可选更新'),
                React.createElement(Radio, { key: 'recommended', value: 'recommended' }, '推荐更新'),
                React.createElement(Radio, { key: 'forced', value: 'forced' }, '强制更新')
            ])),

            React.createElement(Form.Item, {
                key: 'upload',
                label: '安装包文件'
            }, React.createElement(Dragger, {
                name: 'file',
                multiple: false,
                accept: '.apk,.ipa',
                showUploadList: false,
                customRequest: () => {},
                style: { marginBottom: 16 }
            }, [
                React.createElement('p', {
                    key: 'icon',
                    className: 'ant-upload-drag-icon',
                    style: { fontSize: 48 }
                }, '📱'),
                React.createElement('p', {
                    key: 'text',
                    className: 'ant-upload-text'
                }, '点击或拖拽文件到此区域上传'),
                React.createElement('p', {
                    key: 'hint',
                    className: 'ant-upload-hint'
                }, '支持 APK、IPA 格式文件')
            ])),

            uploading && React.createElement(Progress, {
                key: 'progress',
                percent: uploadProgress,
                status: uploadProgress === 100 ? 'success' : 'active',
                style: { marginBottom: 16 }
            }),

            React.createElement(Form.Item, { key: 'buttons' },
                React.createElement(Space, {}, [
                    React.createElement(Button, {
                        key: 'cancel',
                        onClick: () => setUploadModalVisible(false),
                        disabled: uploading
                    }, '取消'),
                    React.createElement(Button, {
                        key: 'submit',
                        type: 'primary',
                        htmlType: 'submit',
                        loading: uploading
                    }, uploading ? '上传中...' : '上传版本')
                ])
            )
        ]));
    };

    const renderConfigModal = () => {
        return React.createElement(Modal, {
            title: '配置更新策略',
            visible: configModalVisible,
            onCancel: () => setConfigModalVisible(false),
            footer: null,
            width: 500
        }, React.createElement(Form, {
            form: configForm,
            layout: 'vertical',
            onFinish: handleSaveConfig
        }, [
            React.createElement(Form.Item, {
                key: 'updateType',
                label: '更新类型',
                name: 'updateType'
            }, React.createElement(Radio.Group, {}, [
                React.createElement(Radio, { key: 'optional', value: 'optional' }, '可选更新'),
                React.createElement(Radio, { key: 'recommended', value: 'recommended' }, '推荐更新'),
                React.createElement(Radio, { key: 'forced', value: 'forced' }, '强制更新')
            ])),

            React.createElement(Form.Item, {
                key: 'forceUpdate',
                label: '强制更新',
                name: 'forceUpdate',
                valuePropName: 'checked'
            }, React.createElement(Switch, {})),

            React.createElement(Form.Item, {
                key: 'grayScaleEnabled',
                label: '灰度发布',
                name: 'grayScaleEnabled',
                valuePropName: 'checked'
            }, React.createElement(Switch, {})),

            React.createElement(Form.Item, {
                key: 'grayScalePercentage',
                label: '灰度比例',
                name: 'grayScalePercentage'
            }, React.createElement(Input, {
                type: 'number',
                min: 0,
                max: 100,
                suffix: '%',
                placeholder: '0-100'
            })),

            React.createElement(Form.Item, { key: 'buttons' },
                React.createElement(Space, {}, [
                    React.createElement(Button, {
                        key: 'cancel',
                        onClick: () => setConfigModalVisible(false)
                    }, '取消'),
                    React.createElement(Button, {
                        key: 'submit',
                        type: 'primary',
                        htmlType: 'submit',
                        loading: loading
                    }, '保存配置')
                ])
            )
        ]));
    };

    return React.createElement('div', { className: 'page-fade-in' }, [
        React.createElement('div', { key: 'header', className: 'page-header' }, [
            React.createElement('h1', { key: 'title', className: 'page-title' }, 'APP版本管理'),
            React.createElement('p', { key: 'desc', className: 'page-description' }, 
                '管理APP版本发布、更新策略配置和灰度发布控制'
            )
        ]),

        React.createElement(Card, { key: 'main-card' }, [
            React.createElement('div', {
                key: 'header',
                style: { 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: 16 
                }
            }, [
                React.createElement('h3', { key: 'title' }, '版本列表'),
                React.createElement(Space, { key: 'actions' }, [
                    React.createElement(Button, {
                        key: 'refresh',
                        onClick: loadVersionList
                    }, '刷新'),
                    React.createElement(Button, {
                        key: 'create',
                        type: 'primary',
                        onClick: handleCreateVersion
                    }, '上传新版本')
                ])
            ]),

            React.createElement(Table, {
                key: 'table',
                columns: columns,
                dataSource: versionList,
                loading: loading,
                pagination: {
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条记录`
                },
                rowKey: 'id'
            })
        ]),

        renderUploadModal(),
        renderConfigModal()
    ]);
};

window.VersionManagement = VersionManagement; 