// 文创 联系方式管理 - 模板/批量更新/分组（简版）
const CulturalContactManagement = () => {
    const { Tabs, Card, Button, Input, Space, Table, Modal, Form, message, Select } = antd;
    const { TabPane } = Tabs;

    const [activeTab, setActiveTab] = React.useState('template');

    const [templates, setTemplates] = React.useState(() => JSON.parse(localStorage.getItem('cultural_contact_templates') || '[]'));
    const [tplModal, setTplModal] = React.useState(false);
    const [tplForm] = Form.useForm();

    const [groups, setGroups] = React.useState(() => JSON.parse(localStorage.getItem('cultural_contact_groups') || '[]'));
    const [grpModal, setGrpModal] = React.useState(false);
    const [grpForm] = Form.useForm();

    const saveTemplates = (data) => { localStorage.setItem('cultural_contact_templates', JSON.stringify(data)); setTemplates(data); };
    const saveGroups = (data) => { localStorage.setItem('cultural_contact_groups', JSON.stringify(data)); setGroups(data); };

    const tplColumns = [
        { title: '模板名称', dataIndex: 'name' },
        { title: '联系人', dataIndex: 'contactName' },
        { title: '电话', dataIndex: 'phone' },
        { title: '邮箱', dataIndex: 'email' },
        { title: '操作', key: 'act', width: 180, render: (_, r) => React.createElement(Space, null,
            React.createElement(Button, { type: 'link', onClick: () => { tplForm.setFieldsValue(r); setTplModal(true); } }, '编辑'),
            React.createElement(Button, { type: 'link', danger: true, onClick: () => saveTemplates(templates.filter(t => t.id !== r.id)) }, '删除')
        ) }
    ];

    const upsertTpl = (values) => {
        if (values.id) {
            saveTemplates(templates.map(t => t.id === values.id ? { ...t, ...values } : t));
            message.success('模板已更新');
        } else {
            saveTemplates([{ id: Date.now(), ...values }, ...templates]);
            message.success('模板已创建');
        }
        setTplModal(false);
        tplForm.resetFields();
    };

    const grpColumns = [
        { title: '分组名称', dataIndex: 'name' },
        { title: '统一联系方式', dataIndex: 'templateName' },
        { title: '关联产品数', dataIndex: 'productCount', width: 120 },
        { title: '操作', key: 'act', width: 180, render: (_, r) => React.createElement(Space, null,
            React.createElement(Button, { type: 'link', onClick: () => { grpForm.setFieldsValue(r); setGrpModal(true); } }, '编辑'),
            React.createElement(Button, { type: 'link', danger: true, onClick: () => saveGroups(groups.filter(g => g.id !== r.id)) }, '删除')
        ) }
    ];

    const upsertGroup = (values) => {
        const tpl = templates.find(t => t.id === values.templateId);
        const payload = { ...values, templateName: tpl ? tpl.name : '' };
        if (values.id) {
            saveGroups(groups.map(g => g.id === values.id ? { ...g, ...payload } : g));
            message.success('分组已更新');
        } else {
            saveGroups([{ id: Date.now(), productCount: 0, ...payload }, ...groups]);
            message.success('分组已创建');
        }
        setGrpModal(false);
        grpForm.resetFields();
    };

    return React.createElement('div', { className: 'page-fade-in' }, [
        React.createElement('div', { key: 'header', className: 'page-header' }, [
            React.createElement('h1', { key: 'title', className: 'page-title' }, '文创 联系方式管理'),
            React.createElement('p', { key: 'desc', className: 'page-description' }, '维护联系方式模板、批量应用与分组管理')
        ]),
        React.createElement(Tabs, { key: 'tabs', activeKey: activeTab, onChange: setActiveTab, size: 'large' }, [
            React.createElement(TabPane, { key: 'template', tab: React.createElement('span', null, ['📇 ', '联系方式模板']) },
                React.createElement(Card, { key: 'tpl-card' }, [
                    React.createElement('div', { key: 'actions', style: { marginBottom: 12, textAlign: 'right' } },
                        React.createElement(Button, { type: 'primary', onClick: () => { tplForm.resetFields(); setTplModal(true); }, 'data-permission': 'contact:manage' }, '新增模板')
                    ),
                    React.createElement(Table, { key: 'table', rowKey: 'id', columns: tplColumns, dataSource: templates })
                ])
            ),
            React.createElement(TabPane, { key: 'batch', tab: React.createElement('span', null, ['📦 ', '批量更新']) },
                React.createElement(Card, { key: 'batch-card' }, '批量更新占位（按分类/标签筛选应用模板，操作前预览）')
            ),
            React.createElement(TabPane, { key: 'group', tab: React.createElement('span', null, ['🧺 ', '分组管理']) },
                React.createElement(Card, { key: 'grp-card' }, [
                    React.createElement('div', { key: 'actions', style: { marginBottom: 12, textAlign: 'right' } },
                        React.createElement(Button, { type: 'primary', onClick: () => { grpForm.resetFields(); setGrpModal(true); }, 'data-permission': 'contact:manage' }, '新增分组')
                    ),
                    React.createElement(Table, { key: 'table', rowKey: 'id', columns: grpColumns, dataSource: groups })
                ])
            )
        ]),

        React.createElement(Modal, { key: 'tpl-modal', visible: tplModal, title: '新增/编辑联系方式模板', onCancel: () => setTplModal(false), onOk: () => tplForm.submit() },
            React.createElement(Form, { form: tplForm, layout: 'vertical', onFinish: upsertTpl }, [
                React.createElement(Form.Item, { key: 'id', name: 'id', style: { display: 'none' } }, React.createElement(Input, null)),
                React.createElement(Form.Item, { key: 'name', label: '模板名称', name: 'name', rules: [{ required: true, message: '请输入模板名称' }] }, React.createElement(Input, null)),
                React.createElement(Form.Item, { key: 'c', label: '联系人', name: 'contactName' }, React.createElement(Input, null)),
                React.createElement(Form.Item, { key: 'p', label: '电话', name: 'phone' }, React.createElement(Input, null)),
                React.createElement(Form.Item, { key: 'e', label: '邮箱', name: 'email' }, React.createElement(Input, null)),
                React.createElement(Form.Item, { key: 'a', label: '地址', name: 'address' }, React.createElement(Input, null)),
                React.createElement(Form.Item, { key: 'o', label: '其他', name: 'others' }, React.createElement(Input, null))
            ])
        ),

        React.createElement(Modal, { key: 'grp-modal', visible: grpModal, title: '新增/编辑分组', onCancel: () => setGrpModal(false), onOk: () => grpForm.submit() },
            React.createElement(Form, { form: grpForm, layout: 'vertical', onFinish: upsertGroup }, [
                React.createElement(Form.Item, { key: 'id', name: 'id', style: { display: 'none' } }, React.createElement(Input, null)),
                React.createElement(Form.Item, { key: 'name', label: '分组名称', name: 'name', rules: [{ required: true, message: '请输入分组名称' }] }, React.createElement(Input, null)),
                React.createElement(Form.Item, { key: 'tpl', label: '统一联系方式模板', name: 'templateId', rules: [{ required: true, message: '请选择模板' }] },
                    React.createElement(Select, null, templates.map(t => React.createElement(Select.Option, { key: t.id, value: t.id }, t.name)))
                )
            ])
        )
    ]);
};

window.App.pages.CulturalContactManagement = CulturalContactManagement;
console.log('[CulturalContactManagement] 组件挂载成功');


