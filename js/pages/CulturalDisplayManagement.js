// 文创 产品展示管理 - 推荐位/展示区域/排序规则（简版）
const CulturalDisplayManagement = () => {
    const { Tabs, Card, Button, Input, Space, Table, Modal, Form, Select, Switch, message } = antd;
    const { TabPane } = Tabs;
    const { Option } = Select;

    const [activeTab, setActiveTab] = React.useState('recommend');

    // 推荐位配置
    const [regions, setRegions] = React.useState(() => JSON.parse(localStorage.getItem('cultural_regions') || '[]'));
    const [regionModal, setRegionModal] = React.useState(false);
    const [regionForm] = Form.useForm();

    const saveRegions = (data) => { localStorage.setItem('cultural_regions', JSON.stringify(data)); setRegions(data); };

    const columns = [
        { title: '推荐区域名称', dataIndex: 'name' },
        { title: '展示样式', dataIndex: 'style', width: 140 },
        { title: '显示数量', dataIndex: 'limit', width: 120 },
        { title: '启用', dataIndex: 'enabled', width: 120, render: v => v ? '是' : '否' },
        { title: '操作', key: 'act', width: 180, render: (_, r) => React.createElement(Space, null,
            React.createElement(Button, { type: 'link', onClick: () => { regionForm.setFieldsValue(r); setRegionModal(true); } }, '编辑'),
            React.createElement(Button, { type: 'link', danger: true, onClick: () => saveRegions(regions.filter(i => i.id !== r.id)) }, '删除')
        ) }
    ];

    const upsertRegion = (values) => {
        if (values.id) {
            const next = regions.map(r => r.id === values.id ? { ...r, ...values } : r);
            saveRegions(next);
            message.success('推荐区域已更新');
        } else {
            saveRegions([{ id: Date.now(), ...values }, ...regions]);
            message.success('推荐区域已添加');
        }
        setRegionModal(false);
        regionForm.resetFields();
    };

    return React.createElement('div', { className: 'page-fade-in' }, [
        React.createElement('div', { key: 'header', className: 'page-header' }, [
            React.createElement('h1', { key: 'title', className: 'page-title' }, '文创 产品展示管理'),
            React.createElement('p', { key: 'desc', className: 'page-description' }, '配置推荐位、展示区域、排序规则，提高前端展示效果')
        ]),
        React.createElement(Tabs, { key: 'tabs', activeKey: activeTab, onChange: setActiveTab, size: 'large' }, [
            React.createElement(TabPane, { key: 'recommend', tab: React.createElement('span', null, ['⭐ ', '推荐位配置']) },
                React.createElement(Card, { key: 'card' }, [
                    React.createElement('div', { key: 'actions', style: { marginBottom: 12, textAlign: 'right' } },
                        React.createElement(Button, { type: 'primary', onClick: () => { regionForm.resetFields(); setRegionModal(true); }, 'data-permission': 'display:config' }, '新增推荐区域')
                    ),
                    React.createElement(Table, { key: 'table', rowKey: 'id', columns: columns, dataSource: regions })
                ])
            ),
            React.createElement(TabPane, { key: 'area', tab: React.createElement('span', null, ['🧩 ', '展示区域管理']) },
                React.createElement(Card, { key: 'area-card' }, '可视化区域配置（占位，后续可扩展拖拽布局）')
            ),
            React.createElement(TabPane, { key: 'sort', tab: React.createElement('span', null, ['↕️ ', '排序规则配置']) },
                React.createElement(Card, { key: 'sort-card' }, '按分类设置默认排序规则（占位：最新/最热/名称）')
            )
        ]),

        React.createElement(Modal, { key: 'region-modal', visible: regionModal, title: '新增/编辑推荐区域', onCancel: () => setRegionModal(false), onOk: () => regionForm.submit() },
            React.createElement(Form, { form: regionForm, layout: 'vertical', onFinish: upsertRegion }, [
                React.createElement(Form.Item, { key: 'id', name: 'id', style: { display: 'none' } }, React.createElement(Input, null)),
                React.createElement(Form.Item, { key: 'name', label: '推荐区域名称', name: 'name', rules: [{ required: true, message: '请输入名称' }] }, React.createElement(Input, null)),
                React.createElement(Form.Item, { key: 'style', label: '展示样式', name: 'style', initialValue: 'grid' }, React.createElement(Select, null, [
                    React.createElement(Option, { key: 'list', value: 'list' }, '列表'),
                    React.createElement(Option, { key: 'grid', value: 'grid' }, '网格'),
                    React.createElement(Option, { key: 'carousel', value: 'carousel' }, '轮播')
                ])),
                React.createElement(Form.Item, { key: 'limit', label: '显示数量', name: 'limit', initialValue: 8 }, React.createElement(Input, { type: 'number', min: 1 })),
                React.createElement(Form.Item, { key: 'enabled', label: '启用', name: 'enabled', valuePropName: 'checked', initialValue: true }, React.createElement(Switch, null))
            ])
        )
    ]);
};

window.App.pages.CulturalDisplayManagement = CulturalDisplayManagement;
console.log('[CulturalDisplayManagement] 组件挂载成功');


