// 文创 分类与标签管理（树状结构合并显示）
const CulturalCategoryTagManagement = () => {
    const { Card, Tree, Button, Input, Space, Modal, Form, message, Tag, Radio } = antd;

    // 统一的树结构：分类和标签都存储在树中
    const [treeData, setTreeData] = React.useState(() => {
        const saved = localStorage.getItem('cultural_category_tag_tree');
        if (saved) {
            return JSON.parse(saved);
        }
        // 初始化演示数据
        const initData = [
            {
                key: 'cat_1',
                title: '📁 纪念品',
                type: 'category',
                status: 'enabled',
                children: [
                    { key: 'tag_1', title: '🏷️ 限量版', type: 'tag', usage: 3 },
                    { key: 'tag_2', title: '🏷️ 收藏', type: 'tag', usage: 5 },
                    { key: 'tag_3', title: '🏷️ 纪念', type: 'tag', usage: 7 }
                ]
            },
            {
                key: 'cat_2',
                title: '📁 模型',
                type: 'category',
                status: 'enabled',
                children: [
                    { key: 'tag_4', title: '🏷️ 精细', type: 'tag', usage: 2 },
                    { key: 'tag_5', title: '🏷️ 收藏', type: 'tag', usage: 3 }
                ]
            },
            {
                key: 'cat_3',
                title: '📁 图书',
                type: 'category',
                status: 'enabled',
                children: [
                    { key: 'tag_6', title: '🏷️ 历史', type: 'tag', usage: 2 },
                    { key: 'tag_7', title: '🏷️ 教育', type: 'tag', usage: 3 },
                    { key: 'tag_8', title: '🏷️ 科普', type: 'tag', usage: 1 }
                ]
            },
            {
                key: 'cat_4',
                title: '📁 衍生品',
                type: 'category',
                status: 'enabled',
                children: [
                    { key: 'tag_9', title: '🏷️ 实用', type: 'tag', usage: 4 },
                    { key: 'tag_10', title: '🏷️ 日常', type: 'tag', usage: 5 },
                    { key: 'tag_11', title: '🏷️ 时尚', type: 'tag', usage: 3 }
                ]
            }
        ];
        localStorage.setItem('cultural_category_tag_tree', JSON.stringify(initData));
        return initData;
    });
    
    const [selectedKey, setSelectedKey] = React.useState(null);
    const [selectedNode, setSelectedNode] = React.useState(null);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [form] = Form.useForm();
    const [itemType, setItemType] = React.useState('category'); // category 或 tag

    const saveTree = (data) => {
        localStorage.setItem('cultural_category_tag_tree', JSON.stringify(data));
        setTreeData(data);
    };

    // 查找节点
    const findNode = (items, key) => {
        for (const item of items) {
            if (item.key === key) return item;
            if (item.children) {
                const found = findNode(item.children, key);
                if (found) return found;
            }
        }
        return null;
    };

    // 更新节点
    const updateNode = (items, key, updates) => {
        return items.map(item => {
            if (item.key === key) {
                return { ...item, ...updates };
            }
            if (item.children) {
                return { ...item, children: updateNode(item.children, key, updates) };
            }
            return item;
        });
    };

    // 删除节点
    const removeNode = (items, key) => {
        return items.filter(item => {
            if (item.key === key) return false;
            if (item.children) {
                item.children = removeNode(item.children, key);
            }
            return true;
        });
    };

    // 添加节点
    const addNode = (items, parentKey, newNode) => {
        if (!parentKey) {
            // 根节点添加分类
            return [...items, newNode];
        }
        return items.map(item => {
            if (item.key === parentKey) {
                if (!item.children) item.children = [];
                return { ...item, children: [...item.children, newNode] };
            }
            if (item.children) {
                return { ...item, children: addNode(item.children, parentKey, newNode) };
            }
            return item;
        });
    };

    const handleSubmit = (values) => {
        if (itemType === 'category') {
            const newNode = {
                key: `cat_${Date.now()}`,
                title: `📁 ${values.name}`,
                type: 'category',
                status: values.enabled ? 'enabled' : 'disabled',
                children: []
            };
            const newData = addNode([...treeData], selectedNode?.type === 'category' ? selectedKey : null, newNode);
            saveTree(newData);
            message.success('分类已添加');
        } else {
            // 添加标签
            if (!selectedNode || selectedNode.type !== 'category') {
                message.warning('请先选择一个分类作为父节点');
                return;
            }
            const newNode = {
                key: `tag_${Date.now()}`,
                title: `🏷️ ${values.name}`,
                type: 'tag',
                usage: 0
            };
            const newData = addNode([...treeData], selectedKey, newNode);
            saveTree(newData);
            message.success('标签已添加');
        }
        setModalVisible(false);
        form.resetFields();
        setSelectedKey(null);
        setSelectedNode(null);
    };

    const handleDelete = () => {
        if (!selectedKey) {
            message.warning('请先选择要删除的项');
            return;
        }
        const newData = removeNode([...treeData], selectedKey);
        saveTree(newData);
        setSelectedKey(null);
        setSelectedNode(null);
        message.success('已删除');
    };

    const handleEdit = () => {
        if (!selectedNode) {
            message.warning('请先选择要编辑的项');
            return;
        }
        const title = selectedNode.title.replace(/^[📁🏷️]\s*/, '');
        form.setFieldsValue({
            name: title,
            enabled: selectedNode.status === 'enabled'
        });
        setItemType(selectedNode.type);
        setModalVisible(true);
    };

    const handleUpdate = (values) => {
        if (!selectedKey) return;
        const updates = selectedNode.type === 'category' 
            ? { title: `📁 ${values.name}`, status: values.enabled ? 'enabled' : 'disabled' }
            : { title: `🏷️ ${values.name}` };
        const newData = updateNode([...treeData], selectedKey, updates);
        saveTree(newData);
        setModalVisible(false);
        form.resetFields();
        setSelectedKey(null);
        setSelectedNode(null);
        message.success('已更新');
    };

    const handleSelect = (keys, info) => {
        const key = keys[0];
        setSelectedKey(key || null);
        if (key) {
            const node = findNode(treeData, key);
            setSelectedNode(node || null);
        } else {
            setSelectedNode(null);
        }
    };

    const renderTitle = (nodeData) => {
        if (nodeData.type === 'tag') {
            return React.createElement('span', null, [
                nodeData.title,
                React.createElement(Tag, { key: 'usage', style: { marginLeft: 8 }, color: 'blue' }, `使用${nodeData.usage || 0}次`)
            ]);
        }
        return nodeData.title;
    };

    return React.createElement('div', { className: 'page-fade-in' }, [
        React.createElement('div', { key: 'header', className: 'page-header' }, [
            React.createElement('h1', { key: 'title', className: 'page-title' }, '文创 分类与标签管理'),
            React.createElement('p', { key: 'desc', className: 'page-description' }, '树状结构管理分类和标签，分类可包含多个标签')
        ]),
        React.createElement(Card, { key: 'main-card' }, [
            React.createElement('div', { key: 'actions', style: { marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
                React.createElement(Space, { key: 'left' }, [
                    React.createElement(Button, { 
                        type: 'primary', 
                        onClick: () => { 
                            form.resetFields(); 
                            setItemType('category'); 
                            setModalVisible(true); 
                        }, 
                        'data-permission': 'category:manage' 
                    }, '新增分类'),
                    React.createElement(Button, { 
                        type: 'default', 
                        onClick: () => { 
                            if (!selectedNode || selectedNode.type !== 'category') {
                                message.warning('请先选择一个分类');
                                return;
                            }
                            form.resetFields(); 
                            setItemType('tag'); 
                            setModalVisible(true); 
                        }, 
                        'data-permission': 'category:manage',
                        disabled: !selectedNode || selectedNode.type !== 'category'
                    }, '新增标签'),
                    React.createElement(Button, { 
                        onClick: handleEdit, 
                        disabled: !selectedNode,
                        'data-permission': 'category:manage' 
                    }, '编辑'),
                    React.createElement(Button, { 
                        danger: true, 
                        onClick: handleDelete, 
                        disabled: !selectedNode,
                        'data-permission': 'category:manage' 
                    }, '删除')
                ]),
                React.createElement('div', { key: 'hint', style: { color: '#999', fontSize: 14 } }, 
                    selectedNode ? `${selectedNode.type === 'category' ? '分类' : '标签'}：${selectedNode.title.replace(/^[📁🏷️]\s*/, '')}` : '未选择'
                )
            ]),
            React.createElement(Tree, {
                key: 'tree',
                blockNode: true,
                treeData: treeData,
                onSelect: handleSelect,
                selectedKeys: selectedKey ? [selectedKey] : [],
                defaultExpandAll: true,
                titleRender: renderTitle
            })
        ]),

        // 统一的新增/编辑弹窗
        React.createElement(Modal, {
            key: 'modal',
            visible: modalVisible,
            title: selectedNode ? `编辑${itemType === 'category' ? '分类' : '标签'}` : `新增${itemType === 'category' ? '分类' : '标签'}`,
            onCancel: () => { setModalVisible(false); form.resetFields(); },
            onOk: () => selectedNode ? form.submit() : form.submit()
        }, React.createElement(Form, { 
            form: form, 
            layout: 'vertical', 
            onFinish: selectedNode ? handleUpdate : handleSubmit 
        }, [
            React.createElement(Form.Item, { 
                key: 'name', 
                label: itemType === 'category' ? '分类名称' : '标签名称', 
                name: 'name', 
                rules: [{ required: true, message: `请输入${itemType === 'category' ? '分类名称' : '标签名称'}` }] 
            }, React.createElement(Input, { placeholder: `请输入${itemType === 'category' ? '分类名称' : '标签名称'}` })),
            itemType === 'category' && React.createElement(Form.Item, { 
                key: 'enabled', 
                label: '启用状态', 
                name: 'enabled', 
                valuePropName: 'checked',
                initialValue: true
            }, React.createElement(antd.Switch, null)),
            selectedNode && selectedNode.type === 'tag' && React.createElement(Form.Item, {
                key: 'usage',
                label: '使用次数'
            }, React.createElement('span', { style: { color: '#666' } }, selectedNode.usage || 0)),
            !selectedNode && itemType === 'tag' && selectedKey && React.createElement(Tag, { 
                key: 'parent', 
                style: { marginTop: 8 } 
            }, `父分类：${findNode(treeData, selectedKey)?.title.replace(/^📁\s*/, '') || ''}`)
        ]))
    ]);
};

window.App.pages.CulturalCategoryTagManagement = CulturalCategoryTagManagement;
console.log('[CulturalCategoryTagManagement] 组件挂载成功');


