// AI分类管理页面组件
const AICategoryManagement = () => {
    console.log('AICategoryManagement component is rendering...');
    
    const { Row, Col, Card, Button, Space, Table, Modal, Form, Input, Select, message, Tree, Popconfirm, Tag } = antd;
    const { Option } = Select;
    const [loading, setLoading] = React.useState(false);
    const [categories, setCategories] = React.useState([]); // 分类数据
    const [visible, setVisible] = React.useState(false);
    const [editMode, setEditMode] = React.useState(false);
    const [currentCategory, setCurrentCategory] = React.useState(null);
    const [form] = Form.useForm();
    const [expandedKeys, setExpandedKeys] = React.useState([]);
    const isMountedRef = React.useRef(true); // 用于跟踪组件是否挂载
    
    // 当前用户信息（模拟，实际应该从权限系统获取）
    const currentUser = {
        id: 'user1',
        name: '当前用户',
        role: 'admin' // 可选值：'super-admin'、'admin' 或 'user'
    };
    
    // 初始化模拟数据
    React.useEffect(() => {
        initMockData();
        
        // 组件卸载时设置isMounted为false
        return () => {
            isMountedRef.current = false;
        };
    }, []);
    
    // 初始化模拟数据
    const initMockData = () => {
        setLoading(true);
        
        // 模拟分类数据
        const mockCategories = [
            {
                id: 'standard',
                name: '标准',
                parentId: null,
                level: 1,
                children: [
                    { id: 'national-standard', name: '国家标准', parentId: 'standard', level: 2 },
                    { id: 'industry-standard', name: '行业标准', parentId: 'standard', level: 2 },
                    { id: 'group-standard', name: '团体标准', parentId: 'standard', level: 2 }
                ]
            },
            {
                id: 'statistics',
                name: '统计分析',
                parentId: null,
                level: 1,
                children: [
                    { id: 'annual-report', name: '年报', parentId: 'statistics', level: 2 },
                    { id: 'semi-annual-report', name: '半年报', parentId: 'statistics', level: 2 }
                ]
            },
            {
                id: 'compliance',
                name: '合规',
                parentId: null,
                level: 1,
                children: [
                    { id: 'laws-regulations', name: '法律法规', parentId: 'compliance', level: 2 },
                    { id: 'legal-clauses', name: '法律条款', parentId: 'compliance', level: 2 }
                ]
            },
            {
                id: 'other',
                name: '其他',
                parentId: null,
                level: 1,
                children: []
            }
        ];
        
        setTimeout(() => {
            // 检查组件是否仍然挂载
            if (isMountedRef.current) {
                setCategories(mockCategories);
                // 默认展开所有一级分类
                const level1Ids = mockCategories.map(cat => cat.id);
                setExpandedKeys(level1Ids);
                setLoading(false);
            }
        }, 500);
    };
    
    // 转换为Tree组件需要的数据结构
    const transformToTreeData = (categories) => {
        return categories.map(category => {
            const treeNode = {
                title: React.createElement(Space, { size: "middle" },
                    React.createElement("span", null, category.name),
                    React.createElement(Tag, { color: category.level === 1 ? 'blue' : 'green' },
                        category.level === 1 ? '一级分类' : '二级分类'
                    )
                ),
                key: category.id,
                isLeaf: category.level === 2,
                data: category
            };
            
            if (category.children && category.children.length > 0) {
                treeNode.children = transformToTreeData(category.children);
            }
            
            return treeNode;
        });
    };
    
    // 打开新增/编辑对话框
    const handleOpenModal = (category = null) => {
        if (category) {
            // 编辑模式
            setEditMode(true);
            setCurrentCategory(category);
            form.setFieldsValue({
                name: category.name,
                parentId: category.parentId
            });
        } else {
            // 新增模式
            setEditMode(false);
            setCurrentCategory(null);
            form.resetFields();
        }
        setVisible(true);
    };
    
    // 关闭对话框
    const handleCloseModal = () => {
        setVisible(false);
        form.resetFields();
    };
    
    // 保存分类
    const handleSaveCategory = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // 准备保存的数据
            const saveData = {
                ...values,
                id: editMode ? currentCategory.id : Date.now().toString()
            };
            
            if (editMode) {
                // 更新分类
                updateCategoryInTree(categories, saveData);
                message.success('分类更新成功');
            } else {
                // 新增分类
                const newCategory = {
                    ...saveData,
                    level: saveData.parentId ? 2 : 1
                };
                
                if (saveData.parentId) {
                    // 新增二级分类
                    addChildCategory(categories, newCategory);
                } else {
                    // 新增一级分类
                    if (isMountedRef.current) {
                        setCategories([...categories, { ...newCategory, children: [] }]);
                    }
                }
                message.success('分类创建成功');
            }
            
            handleCloseModal();
        } catch (error) {
            console.error('保存失败:', error);
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    };
    
    // 在树形结构中更新分类
    const updateCategoryInTree = (treeData, updatedCategory) => {
        const updatedTree = treeData.map(category => {
            if (category.id === updatedCategory.id) {
                return { ...category, ...updatedCategory };
            }
            
            if (category.children && category.children.length > 0) {
                return {
                    ...category,
                    children: updateCategoryInTree(category.children, updatedCategory)
                };
            }
            
            return category;
        });
        
        setCategories(updatedTree);
    };
    
    // 向父分类添加子分类
    const addChildCategory = (treeData, newChildCategory) => {
        const updatedTree = treeData.map(category => {
            if (category.id === newChildCategory.parentId) {
                return {
                    ...category,
                    children: [...(category.children || []), newChildCategory]
                };
            }
            
            if (category.children && category.children.length > 0) {
                return {
                    ...category,
                    children: addChildCategory(category.children, newChildCategory)
                };
            }
            
            return category;
        });
        
        setCategories(updatedTree);
    };
    
    // 删除分类
    const handleDeleteCategory = async (category) => {
        try {
            setLoading(true);
            
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 检查是否有子分类
            if (category.level === 1 && category.children && category.children.length > 0) {
                message.error('该分类下存在子分类，无法删除');
                return;
            }
            
            // 从树形结构中删除分类
            deleteCategoryFromTree(categories, category.id);
            message.success('分类删除成功');
        } catch (error) {
            message.error('删除失败');
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    };
    
    // 从树形结构中删除分类
    const deleteCategoryFromTree = (treeData, categoryId) => {
        const updatedTree = treeData.filter(category => {
            if (category.id === categoryId) {
                return false;
            }
            
            if (category.children && category.children.length > 0) {
                category.children = deleteCategoryFromTree(category.children, categoryId);
            }
            
            return true;
        });
        
        setCategories(updatedTree);
    };
    
    // 获取所有一级分类（用于新增二级分类时选择父分类）
    const getLevel1Categories = () => {
        return categories.map(category => ({
            value: category.id,
            label: category.name
        }));
    };
    
    // 处理树节点点击
    const handleTreeNodeClick = (event, node) => {
        console.log('点击分类节点:', node);
    };
    
    // 处理树节点操作
    const renderTreeNodeActions = (category) => {
        const actionButtons = [
            React.createElement(Button, {
                key: 'edit-btn',
                size: 'small',
                onClick: () => handleOpenModal(category),
                disabled: category.id === 'other' && !editMode
            }, editMode ? '编辑' : '编辑')
        ];
        
        // 添加删除按钮（除"other"分类外）
        if (category.id !== 'other') {
            actionButtons.push(
                React.createElement(Popconfirm, {
                    key: 'delete-popconfirm',
                    title: category.level === 1 ? '确定要删除这个一级分类吗？删除后所有子分类也将被删除。' : '确定要删除这个分类吗？',
                    onConfirm: () => handleDeleteCategory(category),
                    okText: '确定',
                    cancelText: '取消'
                }, React.createElement(Button, { size: 'small', type: 'danger' }, '删除'))
            );
        }
        
        // 添加新增子分类按钮（仅一级分类且非"other"分类）
        if (category.level === 1 && category.id !== 'other') {
            actionButtons.push(
                React.createElement(Button, {
                    key: 'add-child-btn',
                    size: 'small',
                    onClick: () => handleOpenModal({ parentId: category.id })
                }, '新增子分类')
            );
        }
        
        return React.createElement(Space, { size: 'small' }, ...actionButtons);
    };
    
    // 转换为表格数据格式
    const getTableData = () => {
        const tableData = [];
        
        const processCategory = (category, parentName = '') => {
            tableData.push({
                key: category.id,
                name: category.name,
                parent: parentName || '无',
                level: category.level,
                levelText: category.level === 1 ? '一级分类' : '二级分类',
                data: category
            });
            
            if (category.children && category.children.length > 0) {
                category.children.forEach(child => {
                    processCategory(child, category.name);
                });
            }
        };
        
        categories.forEach(category => {
            processCategory(category);
        });
        
        return tableData;
    };
    
    // 表格列定义
    const columns = [
        {
            title: '分类名称',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                return React.createElement(Space, { size: 'small' },
                    Array(record.level - 1).fill('　').join(''), // 缩进显示层级
                    React.createElement('span', null, text)
                );
            }
        },
        {
            title: '父分类',
            dataIndex: 'parent',
            key: 'parent'
        },
        {
            title: '分类层级',
            dataIndex: 'levelText',
            key: 'level',
            render: (text, record) => {
                return React.createElement(Tag, { color: record.level === 1 ? 'blue' : 'green' },
                    text
                );
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => renderTreeNodeActions(record.data)
        }
    ];
    
    return React.createElement(React.Fragment, null,
        React.createElement(Row, { gutter: 16, key: 'title-row' },
            React.createElement(Col, { span: 24 },
                React.createElement(Space, { style: { marginBottom: 16 }, direction: 'horizontal', align: 'center' },
                    React.createElement('h3', { style: { margin: 0 } }, 'AI分类管理'),
                    React.createElement('span', null, '管理知识库的分类结构，支持一级分类和二级分类'),
                    React.createElement(Button, { 
                        type: 'primary', 
                        onClick: () => handleOpenModal()
                    }, '新增一级分类')
                )
            )
        ),
        
        React.createElement(Row, { gutter: 16, key: 'main-content-row' },
            React.createElement(Col, { span: 24 },
                React.createElement(Card, null,
                    React.createElement(Table,
                        {
                            columns: columns,
                            dataSource: getTableData(),
                            rowKey: 'key',
                            loading: loading,
                            pagination: {
                                pageSize: 10
                            }
                        }
                    )
                )
            )
        ),
        
        // 新增/编辑分类对话框
        React.createElement(Modal,
            {
                title: editMode ? '编辑分类' : (currentCategory && currentCategory.parentId ? '新增二级分类' : '新增一级分类'),
                open: visible,
                onOk: handleSaveCategory,
                onCancel: handleCloseModal,
                width: 600,
                confirmLoading: loading
            },
            React.createElement(Form,
                {
                    form: form,
                    layout: 'vertical'
                },
                React.createElement(Form.Item,
                    {
                        name: 'name',
                        label: '分类名称',
                        rules: [{ required: true, message: '请输入分类名称' }]
                    },
                    React.createElement(Input, { placeholder: '请输入分类名称' })
                ),
                !editMode && (
                    React.createElement(Form.Item,
                        {
                            name: 'parentId',
                            label: '父分类（可选）',
                            help: '选择父分类将创建二级分类，不选择则创建一级分类'
                        },
                        React.createElement(Select, { placeholder: '请选择父分类（不选则创建一级分类）' },
                            getLevel1Categories().map(category => {
                                return React.createElement(Option, { key: category.value, value: category.value }, category.label);
                            })
                        )
                    )
                )
            )
        )
    );
};

// 挂载组件到window.App.pages
window.App.pages.AICategoryManagement = AICategoryManagement;
console.log('[AICategoryManagement] 组件挂载成功');