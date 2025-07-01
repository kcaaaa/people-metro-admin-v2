// 增强版系统设置页面 - 完全可交互
const SystemSettings = () => {
    const { Tabs, Card, Form, Input, InputNumber, Switch, Button, Space, Table, Tag, Modal, message, Row, Col, Select, Slider, TimePicker, Upload, Descriptions, Alert, Tooltip, Divider, Progress } = antd;
    const { Option } = Select;
    const { Dragger } = Upload;
    
    const [settings, setSettings] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState('ai');
    const [alertRuleModalVisible, setAlertRuleModalVisible] = React.useState(false);
    const [currentAlertRule, setCurrentAlertRule] = React.useState(null);
    const [configExportModalVisible, setConfigExportModalVisible] = React.useState(false);
    const [configImportModalVisible, setConfigImportModalVisible] = React.useState(false);
    const [testingConnection, setTestingConnection] = React.useState({});
    
    const [aiForm] = Form.useForm();
    const [reviewForm] = Form.useForm();
    const [alertForm] = Form.useForm();
    const [logForm] = Form.useForm();
    const [exportForm] = Form.useForm();

    React.useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const mockSettings = {
                aiSettings: {
                    textThreshold: 0.8,
                    imageThreshold: 0.75,
                    videoThreshold: 0.85,
                    autoReview: true,
                    batchSize: 50,
                    timeout: 30,
                    retryCount: 3,
                    apiEndpoint: 'https://ai-service.example.com/api',
                    apiKey: 'sk-****************************',
                    maxFileSize: 100,
                    supportedFormats: ['jpg', 'png', 'gif', 'mp4', 'avi', 'mov']
                },
                reviewFlow: {
                    enableManualReview: true,
                    requireDoubleCheck: false,
                    autoAssignReviewer: true,
                    reviewTimeout: 24,
                    escalationRules: ['high_priority', 'controversial_content'],
                    stages: ['AI初审', '人工复审', '质量检查', '最终确认'],
                    reviewerGroups: [
                        { id: 1, name: '初级审核员', memberCount: 8, permissions: ['basic_review'] },
                        { id: 2, name: '高级审核员', memberCount: 5, permissions: ['advanced_review', 'escalation'] },
                        { id: 3, name: '审核主管', memberCount: 2, permissions: ['all'] }
                    ]
                },
                alertRules: [
                    { id: 1, type: 'CPU使用率', threshold: 80, enabled: true, operator: '>', unit: '%', action: '发送通知' },
                    { id: 2, type: '内存使用率', threshold: 85, enabled: true, operator: '>', unit: '%', action: '发送通知' },
                    { id: 3, type: '审核队列积压', threshold: 100, enabled: true, operator: '>', unit: '条', action: '发送邮件' },
                    { id: 4, type: '违规内容比例', threshold: 10, enabled: true, operator: '>', unit: '%', action: '发送短信' },
                    { id: 5, type: '系统响应时间', threshold: 5000, enabled: false, operator: '>', unit: 'ms', action: '记录日志' }
                ],
                logSettings: {
                    logLevel: 'INFO',
                    retentionDays: 90,
                    maxFileSize: 100,
                    enableAuditLog: true,
                    enableAccessLog: true,
                    enableErrorLog: true,
                    logFormat: 'JSON',
                    archiveEnabled: true,
                    realTimeMonitoring: true
                },
                securitySettings: {
                    sessionTimeout: 120,
                    maxLoginAttempts: 5,
                    passwordPolicy: {
                        minLength: 8,
                        requireUppercase: true,
                        requireLowercase: true,
                        requireNumbers: true,
                        requireSpecialChars: true
                    },
                    twoFactorAuth: true,
                    ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],
                    encryptionLevel: 'AES-256'
                }
            };
            
            setSettings(mockSettings);
            
            // 设置表单初始值
            aiForm.setFieldsValue(mockSettings.aiSettings);
            reviewForm.setFieldsValue(mockSettings.reviewFlow);
            logForm.setFieldsValue(mockSettings.logSettings);
            
        } catch (error) {
            message.error('设置加载失败');
        } finally {
            setLoading(false);
        }
    };

    // 保存AI设置
    const saveAISettings = async (values) => {
        setSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSettings(prev => ({ ...prev, aiSettings: values }));
            message.success('AI设置保存成功');
        } catch (error) {
            message.error('保存失败');
        } finally {
            setSaving(false);
        }
    };

    // 保存审核流程设置
    const saveReviewSettings = async (values) => {
        setSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSettings(prev => ({ ...prev, reviewFlow: values }));
            message.success('审核流程设置保存成功');
        } catch (error) {
            message.error('保存失败');
        } finally {
            setSaving(false);
        }
    };

    // 保存日志设置
    const saveLogSettings = async (values) => {
        setSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSettings(prev => ({ ...prev, logSettings: values }));
            message.success('日志设置保存成功');
        } catch (error) {
            message.error('保存失败');
        } finally {
            setSaving(false);
        }
    };

    // 测试AI连接
    const testAIConnection = async () => {
        setTestingConnection(prev => ({ ...prev, ai: true }));
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            message.success('AI服务连接正常');
        } catch (error) {
            message.error('AI服务连接失败');
        } finally {
            setTestingConnection(prev => ({ ...prev, ai: false }));
        }
    };

    // 新增/编辑告警规则
    const handleAlertRule = (rule = null) => {
        setCurrentAlertRule(rule);
        setAlertRuleModalVisible(true);
        if (rule) {
            alertForm.setFieldsValue(rule);
        } else {
            alertForm.resetFields();
        }
    };

    // 保存告警规则
    const saveAlertRule = async () => {
        try {
            const values = await alertForm.validateFields();
            setSaving(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (currentAlertRule) {
                // 编辑
                setSettings(prev => ({
                    ...prev,
                    alertRules: prev.alertRules.map(rule => 
                        rule.id === currentAlertRule.id ? { ...rule, ...values } : rule
                    )
                }));
                message.success('告警规则更新成功');
            } else {
                // 新增
                const newRule = {
                    id: Date.now(),
                    ...values
                };
                setSettings(prev => ({
                    ...prev,
                    alertRules: [...prev.alertRules, newRule]
                }));
                message.success('告警规则添加成功');
            }
            
            setAlertRuleModalVisible(false);
            alertForm.resetFields();
        } catch (error) {
            message.error('保存失败');
        } finally {
            setSaving(false);
        }
    };

    // 删除告警规则
    const deleteAlertRule = (ruleId) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这条告警规则吗？',
            onOk: async () => {
                try {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    setSettings(prev => ({
                        ...prev,
                        alertRules: prev.alertRules.filter(rule => rule.id !== ruleId)
                    }));
                    message.success('删除成功');
                } catch (error) {
                    message.error('删除失败');
                }
            }
        });
    };

    // 切换告警规则状态
    const toggleAlertRule = async (ruleId, enabled) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            setSettings(prev => ({
                ...prev,
                alertRules: prev.alertRules.map(rule => 
                    rule.id === ruleId ? { ...rule, enabled } : rule
                )
            }));
            message.success(enabled ? '规则已启用' : '规则已禁用');
        } catch (error) {
            message.error('操作失败');
        }
    };

    // 导出配置
    const exportConfig = async () => {
        try {
            const values = await exportForm.validateFields();
            message.loading('正在导出配置...', 0);
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const configData = {
                exportTime: new Date().toISOString(),
                version: '2.0.0',
                settings: values.includeAll ? settings : {
                    ...(values.includeAI && { aiSettings: settings.aiSettings }),
                    ...(values.includeReview && { reviewFlow: settings.reviewFlow }),
                    ...(values.includeAlert && { alertRules: settings.alertRules }),
                    ...(values.includeLog && { logSettings: settings.logSettings })
                }
            };
            
            message.destroy();
            message.success('配置导出成功！文件已保存到下载目录');
            setConfigExportModalVisible(false);
            exportForm.resetFields();
        } catch (error) {
            message.error('导出失败');
        }
    };

    // 导入配置
    const importConfig = (file) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const config = JSON.parse(e.target.result);
                message.loading('正在导入配置...', 0);
                
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // 合并配置
                setSettings(prev => ({
                    ...prev,
                    ...config.settings
                }));
                
                message.destroy();
                message.success('配置导入成功');
                setConfigImportModalVisible(false);
                
                // 重新加载表单数据
                if (config.settings.aiSettings) {
                    aiForm.setFieldsValue(config.settings.aiSettings);
                }
                if (config.settings.reviewFlow) {
                    reviewForm.setFieldsValue(config.settings.reviewFlow);
                }
                if (config.settings.logSettings) {
                    logForm.setFieldsValue(config.settings.logSettings);
                }
            } catch (error) {
                message.error('配置文件格式错误');
            }
        };
        reader.readAsText(file);
        return false; // 阻止自动上传
    };

    // 告警规则表格列定义
    const alertColumns = [
        { 
            title: '规则名称', 
            dataIndex: 'type', 
            width: 150,
            render: (text) => React.createElement('strong', {}, text)
        },
        { 
            title: '阈值条件', 
            width: 200,
            render: (_, record) => `${record.operator} ${record.threshold}${record.unit}`
        },
        { 
            title: '触发动作', 
            dataIndex: 'action', 
            width: 120 
        },
        {
            title: '状态',
            dataIndex: 'enabled',
            width: 100,
            render: (enabled, record) => React.createElement(Switch, {
                checked: enabled,
                onChange: (checked) => toggleAlertRule(record.id, checked),
                checkedChildren: '启用',
                unCheckedChildren: '禁用'
            })
        },
        {
            title: '操作',
            width: 180,
            render: (_, record) => React.createElement(Space, {}, [
                React.createElement(Button, {
                    key: 'edit',
                    size: 'small',
                    type: 'link',
                    onClick: () => handleAlertRule(record)
                }, '编辑'),
                React.createElement(Button, {
                    key: 'test',
                    size: 'small',
                    type: 'link',
                    onClick: () => {
                        message.loading('测试告警中...', 1);
                        setTimeout(() => message.success('测试告警发送成功'), 1000);
                    }
                }, '测试'),
                React.createElement(Button, {
                    key: 'delete',
                    size: 'small',
                    type: 'link',
                    danger: true,
                    onClick: () => deleteAlertRule(record.id)
                }, '删除')
            ])
        }
    ];

    const tabItems = [
        {
            key: 'ai',
            label: '🤖 AI设置',
            children: React.createElement(Card, {
                title: 'AI审核参数配置',
                extra: React.createElement(Button, {
                    type: 'primary',
                    loading: testingConnection.ai,
                    onClick: testAIConnection
                }, '测试连接')
            }, [
                React.createElement(Form, {
                    key: 'ai-form',
                    form: aiForm,
                    layout: 'vertical',
                    onFinish: saveAISettings
                }, [
                    React.createElement(Row, { gutter: 24 }, [
                        React.createElement(Col, { span: 12 }, [
                            React.createElement(Form.Item, {
                                key: 'text-threshold',
                                label: '文本审核阈值',
                                name: 'textThreshold',
                                help: '0-1之间，数值越高审核越严格'
                            }, React.createElement(Slider, {
                                min: 0,
                                max: 1,
                                step: 0.05,
                                marks: { 0: '0', 0.5: '0.5', 1: '1' }
                            })),
                            React.createElement(Form.Item, {
                                key: 'image-threshold',
                                label: '图像审核阈值',
                                name: 'imageThreshold'
                            }, React.createElement(Slider, {
                                min: 0,
                                max: 1,
                                step: 0.05,
                                marks: { 0: '0', 0.5: '0.5', 1: '1' }
                            })),
                            React.createElement(Form.Item, {
                                key: 'video-threshold',
                                label: '视频审核阈值',
                                name: 'videoThreshold'
                            }, React.createElement(Slider, {
                                min: 0,
                                max: 1,
                                step: 0.05,
                                marks: { 0: '0', 0.5: '0.5', 1: '1' }
                            }))
                        ]),
                        React.createElement(Col, { span: 12 }, [
                            React.createElement(Form.Item, {
                                key: 'batch-size',
                                label: '批处理大小',
                                name: 'batchSize'
                            }, React.createElement(InputNumber, {
                                min: 1,
                                max: 100,
                                style: { width: '100%' }
                            })),
                            React.createElement(Form.Item, {
                                key: 'timeout',
                                label: '超时时间（秒）',
                                name: 'timeout'
                            }, React.createElement(InputNumber, {
                                min: 5,
                                max: 300,
                                style: { width: '100%' }
                            })),
                            React.createElement(Form.Item, {
                                key: 'retry',
                                label: '重试次数',
                                name: 'retryCount'
                            }, React.createElement(InputNumber, {
                                min: 0,
                                max: 10,
                                style: { width: '100%' }
                            }))
                        ])
                    ]),
                    React.createElement(Divider, { key: 'divider' }),
                    React.createElement(Form.Item, {
                        key: 'api-endpoint',
                        label: 'API接口地址',
                        name: 'apiEndpoint'
                    }, React.createElement(Input, { placeholder: '请输入AI服务API地址' })),
                    React.createElement(Form.Item, {
                        key: 'api-key',
                        label: 'API密钥',
                        name: 'apiKey'
                    }, React.createElement(Input.Password, { placeholder: '请输入API密钥' })),
                    React.createElement(Form.Item, {
                        key: 'auto-review',
                        label: '自动审核',
                        name: 'autoReview',
                        valuePropName: 'checked'
                    }, React.createElement(Switch, {
                        checkedChildren: '开启',
                        unCheckedChildren: '关闭'
                    })),
                    React.createElement(Form.Item, {
                        key: 'actions'
                    }, React.createElement(Space, {}, [
                        React.createElement(Button, {
                            key: 'save',
                            type: 'primary',
                            htmlType: 'submit',
                            loading: saving
                        }, '保存设置'),
                        React.createElement(Button, {
                            key: 'reset',
                            onClick: () => aiForm.resetFields()
                        }, '重置')
                    ]))
                ])
            ])
        },
        {
            key: 'review',
            label: '📋 审核流程',
            children: React.createElement(Card, {
                title: '审核流程配置'
            }, [
                React.createElement(Form, {
                    key: 'review-form',
                    form: reviewForm,
                    layout: 'vertical',
                    onFinish: saveReviewSettings
                }, [
                    React.createElement(Alert, {
                        key: 'info',
                        message: '审核流程说明',
                        description: '配置内容审核的完整流程，包括AI审核、人工复审、质量检查等环节',
                        type: 'info',
                        showIcon: true,
                        style: { marginBottom: 24 }
                    }),
                    React.createElement(Row, { gutter: 24 }, [
                        React.createElement(Col, { span: 12 }, [
                            React.createElement(Form.Item, {
                                key: 'manual-review',
                                label: '启用人工审核',
                                name: 'enableManualReview',
                                valuePropName: 'checked'
                            }, React.createElement(Switch, {
                                checkedChildren: '启用',
                                unCheckedChildren: '禁用'
                            })),
                            React.createElement(Form.Item, {
                                key: 'double-check',
                                label: '双重检查',
                                name: 'requireDoubleCheck',
                                valuePropName: 'checked'
                            }, React.createElement(Switch, {
                                checkedChildren: '需要',
                                unCheckedChildren: '不需要'
                            })),
                            React.createElement(Form.Item, {
                                key: 'auto-assign',
                                label: '自动分配审核员',
                                name: 'autoAssignReviewer',
                                valuePropName: 'checked'
                            }, React.createElement(Switch, {
                                checkedChildren: '启用',
                                unCheckedChildren: '禁用'
                            }))
                        ]),
                        React.createElement(Col, { span: 12 }, [
                            React.createElement(Form.Item, {
                                key: 'timeout',
                                label: '审核超时时间（小时）',
                                name: 'reviewTimeout'
                            }, React.createElement(InputNumber, {
                                min: 1,
                                max: 168,
                                style: { width: '100%' }
                            })),
                            React.createElement(Form.Item, {
                                key: 'escalation',
                                label: '升级规则',
                                name: 'escalationRules'
                            }, React.createElement(Select, {
                                mode: 'multiple',
                                placeholder: '选择升级规则',
                                style: { width: '100%' }
                            }, [
                                React.createElement(Option, { value: 'high_priority' }, '高优先级'),
                                React.createElement(Option, { value: 'controversial_content' }, '争议内容'),
                                React.createElement(Option, { value: 'repeat_violation' }, '重复违规'),
                                React.createElement(Option, { value: 'technical_difficulty' }, '技术难点')
                            ]))
                        ])
                    ]),
                    React.createElement(Form.Item, {
                        key: 'actions'
                    }, React.createElement(Space, {}, [
                        React.createElement(Button, {
                            key: 'save',
                            type: 'primary',
                            htmlType: 'submit',
                            loading: saving
                        }, '保存设置'),
                        React.createElement(Button, {
                            key: 'reset',
                            onClick: () => reviewForm.resetFields()
                        }, '重置')
                    ]))
                ]),
                React.createElement(Divider, { key: 'divider' }),
                React.createElement('div', {
                    key: 'flow-stages',
                    style: { marginTop: 24 }
                }, [
                    React.createElement('h4', { key: 'title' }, '当前审核流程'),
                    React.createElement('div', {
                        key: 'stages',
                        style: { display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: 16 }
                    }, settings.reviewFlow?.stages?.map((stage, index) => 
                        React.createElement(Tag, {
                            key: index,
                            color: 'blue',
                            style: { 
                                padding: '8px 16px',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }
                        }, [
                            React.createElement('span', { 
                                key: 'number',
                                style: {
                                    background: 'rgba(255,255,255,0.3)',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px'
                                }
                            }, index + 1),
                            React.createElement('span', { key: 'text' }, stage)
                        ])
                    ))
                ])
            ])
        },
        {
            key: 'alerts',
            label: '🚨 报警规则',
            children: React.createElement(Card, {
                title: '报警规则管理',
                extra: React.createElement(Button, {
                    type: 'primary',
                    onClick: () => handleAlertRule()
                }, '新增规则')
            }, [
                React.createElement(Table, {
                    key: 'table',
                    columns: alertColumns,
                    dataSource: settings.alertRules || [],
                    size: 'middle',
                    rowKey: 'id',
                    pagination: { pageSize: 10 }
                })
            ])
        },
        {
            key: 'logs',
            label: '📋 日志管理',
            children: React.createElement(Card, {
                title: '系统日志配置'
            }, [
                React.createElement(Form, {
                    key: 'log-form',
                    form: logForm,
                    layout: 'vertical',
                    onFinish: saveLogSettings
                }, [
                    React.createElement(Row, { gutter: 24 }, [
                        React.createElement(Col, { span: 12 }, [
                            React.createElement(Form.Item, {
                                key: 'log-level',
                                label: '日志级别',
                                name: 'logLevel'
                            }, React.createElement(Select, {
                                style: { width: '100%' }
                            }, [
                                React.createElement(Option, { value: 'DEBUG' }, 'DEBUG'),
                                React.createElement(Option, { value: 'INFO' }, 'INFO'),
                                React.createElement(Option, { value: 'WARN' }, 'WARN'),
                                React.createElement(Option, { value: 'ERROR' }, 'ERROR')
                            ])),
                            React.createElement(Form.Item, {
                                key: 'retention',
                                label: '保留天数',
                                name: 'retentionDays'
                            }, React.createElement(InputNumber, {
                                min: 1,
                                max: 365,
                                style: { width: '100%' }
                            })),
                            React.createElement(Form.Item, {
                                key: 'file-size',
                                label: '最大文件大小（MB）',
                                name: 'maxFileSize'
                            }, React.createElement(InputNumber, {
                                min: 1,
                                max: 1024,
                                style: { width: '100%' }
                            }))
                        ]),
                        React.createElement(Col, { span: 12 }, [
                            React.createElement(Form.Item, {
                                key: 'audit-log',
                                label: '审计日志',
                                name: 'enableAuditLog',
                                valuePropName: 'checked'
                            }, React.createElement(Switch, {})),
                            React.createElement(Form.Item, {
                                key: 'access-log',
                                label: '访问日志',
                                name: 'enableAccessLog',
                                valuePropName: 'checked'
                            }, React.createElement(Switch, {})),
                            React.createElement(Form.Item, {
                                key: 'error-log',
                                label: '错误日志',
                                name: 'enableErrorLog',
                                valuePropName: 'checked'
                            }, React.createElement(Switch, {}))
                        ])
                    ]),
                    React.createElement(Form.Item, {
                        key: 'actions'
                    }, React.createElement(Space, {}, [
                        React.createElement(Button, {
                            key: 'save',
                            type: 'primary',
                            htmlType: 'submit',
                            loading: saving
                        }, '保存设置'),
                        React.createElement(Button, {
                            key: 'reset',
                            onClick: () => logForm.resetFields()
                        }, '重置')
                    ]))
                ])
            ])
        }
    ];

    return React.createElement('div', { className: 'page-fade-in' }, [
        React.createElement('div', { key: 'header', className: 'page-header' }, [
            React.createElement('h1', { key: 'title', className: 'page-title' }, '系统设置'),
            React.createElement('p', { key: 'desc', className: 'page-description' }, 
                '管理系统核心配置参数，包括AI审核、流程管理、告警规则等'
            )
        ]),

        React.createElement('div', {
            key: 'header-actions',
            style: {
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }
        }, [
            React.createElement('div', { key: 'status' }, [
                React.createElement(Alert, {
                    message: '系统运行正常',
                    description: '所有配置项均已加载，当前配置版本：v2.0.0',
                    type: 'success',
                    showIcon: true
                })
            ]),
            React.createElement(Space, {
                key: 'actions'
            }, [
                React.createElement(Button, {
                    key: 'export',
                    icon: React.createElement('span', {}, '📤'),
                    onClick: () => setConfigExportModalVisible(true)
                }, '导出配置'),
                React.createElement(Button, {
                    key: 'import',
                    icon: React.createElement('span', {}, '📥'),
                    onClick: () => setConfigImportModalVisible(true)
                }, '导入配置')
            ])
        ]),

        React.createElement(Tabs, {
            key: 'tabs',
            items: tabItems,
            activeKey: activeTab,
            onChange: setActiveTab,
            size: 'large'
        }),

        // 告警规则模态框
        React.createElement(Modal, {
            key: 'alert-rule-modal',
            title: currentAlertRule ? '编辑告警规则' : '新增告警规则',
            visible: alertRuleModalVisible,
            onOk: saveAlertRule,
            onCancel: () => setAlertRuleModalVisible(false),
            confirmLoading: saving,
            width: 600
        }, React.createElement(Form, {
            form: alertForm,
            layout: 'vertical'
        }, [
            React.createElement(Form.Item, {
                key: 'type',
                name: 'type',
                label: '规则类型',
                rules: [{ required: true, message: '请输入规则类型' }]
            }, React.createElement(Input, { placeholder: '如：CPU使用率' })),
            React.createElement(Row, { gutter: 16 }, [
                React.createElement(Col, { span: 8 }, React.createElement(Form.Item, {
                    key: 'operator',
                    name: 'operator',
                    label: '比较符',
                    rules: [{ required: true, message: '请选择比较符' }]
                }, React.createElement(Select, { placeholder: '选择' }, [
                    React.createElement(Option, { value: '>' }, '>'),
                    React.createElement(Option, { value: '<' }, '<'),
                    React.createElement(Option, { value: '>=' }, '>='),
                    React.createElement(Option, { value: '<=' }, '<='),
                    React.createElement(Option, { value: '=' }, '=')
                ]))),
                React.createElement(Col, { span: 8 }, React.createElement(Form.Item, {
                    key: 'threshold',
                    name: 'threshold',
                    label: '阈值',
                    rules: [{ required: true, message: '请输入阈值' }]
                }, React.createElement(InputNumber, { 
                    style: { width: '100%' },
                    placeholder: '数值'
                }))),
                React.createElement(Col, { span: 8 }, React.createElement(Form.Item, {
                    key: 'unit',
                    name: 'unit',
                    label: '单位',
                    rules: [{ required: true, message: '请输入单位' }]
                }, React.createElement(Input, { placeholder: '如：%、MB' })))
            ]),
            React.createElement(Form.Item, {
                key: 'action',
                name: 'action',
                label: '触发动作',
                rules: [{ required: true, message: '请选择触发动作' }]
            }, React.createElement(Select, {}, [
                React.createElement(Option, { value: '发送通知' }, '发送通知'),
                React.createElement(Option, { value: '发送邮件' }, '发送邮件'),
                React.createElement(Option, { value: '发送短信' }, '发送短信'),
                React.createElement(Option, { value: '记录日志' }, '记录日志'),
                React.createElement(Option, { value: '执行脚本' }, '执行脚本')
            ])),
            React.createElement(Form.Item, {
                key: 'enabled',
                name: 'enabled',
                label: '启用状态',
                valuePropName: 'checked',
                initialValue: true
            }, React.createElement(Switch, {
                checkedChildren: '启用',
                unCheckedChildren: '禁用'
            }))
        ])),

        // 导出配置模态框
        React.createElement(Modal, {
            key: 'export-modal',
            title: '导出系统配置',
            visible: configExportModalVisible,
            onOk: exportConfig,
            onCancel: () => setConfigExportModalVisible(false),
            width: 500
        }, React.createElement(Form, {
            form: exportForm,
            layout: 'vertical'
        }, [
            React.createElement(Form.Item, {
                key: 'include-all',
                name: 'includeAll',
                valuePropName: 'checked',
                initialValue: true
            }, React.createElement(Switch, {
                checkedChildren: '导出全部',
                unCheckedChildren: '选择导出'
            })),
            React.createElement(Form.Item, {
                key: 'include-ai',
                name: 'includeAI',
                valuePropName: 'checked'
            }, React.createElement(Switch, {
                checkedChildren: 'AI设置',
                unCheckedChildren: 'AI设置'
            })),
            React.createElement(Form.Item, {
                key: 'include-review',
                name: 'includeReview',
                valuePropName: 'checked'
            }, React.createElement(Switch, {
                checkedChildren: '审核流程',
                unCheckedChildren: '审核流程'
            })),
            React.createElement(Form.Item, {
                key: 'include-alert',
                name: 'includeAlert',
                valuePropName: 'checked'
            }, React.createElement(Switch, {
                checkedChildren: '告警规则',
                unCheckedChildren: '告警规则'
            })),
            React.createElement(Form.Item, {
                key: 'include-log',
                name: 'includeLog',
                valuePropName: 'checked'
            }, React.createElement(Switch, {
                checkedChildren: '日志设置',
                unCheckedChildren: '日志设置'
            }))
        ])),

        // 导入配置模态框
        React.createElement(Modal, {
            key: 'import-modal',
            title: '导入系统配置',
            visible: configImportModalVisible,
            footer: [
                React.createElement(Button, {
                    key: 'cancel',
                    onClick: () => setConfigImportModalVisible(false)
                }, '取消')
            ],
            width: 500
        }, [
            React.createElement(Alert, {
                key: 'warning',
                message: '注意',
                description: '导入配置将覆盖当前设置，请确保配置文件正确',
                type: 'warning',
                showIcon: true,
                style: { marginBottom: 16 }
            }),
            React.createElement(Dragger, {
                key: 'upload',
                accept: '.json',
                beforeUpload: importConfig,
                showUploadList: false
            }, [
                React.createElement('p', {
                    key: 'icon',
                    style: { fontSize: '48px', margin: '16px 0' }
                }, '📁'),
                React.createElement('p', {
                    key: 'text',
                    style: { fontSize: '16px' }
                }, '点击或拖拽文件到此区域上传'),
                React.createElement('p', {
                    key: 'hint',
                    style: { color: '#666' }
                }, '仅支持 .json 格式的配置文件')
            ])
        ])
    ]);
};

window.SystemSettings = SystemSettings; 