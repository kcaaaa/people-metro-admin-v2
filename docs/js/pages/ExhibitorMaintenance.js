// 展商维护页面（展会管理 > 展商维护）
const { useState } = React;
const { Form, Input, Button, Card, Row, Col, Select, Upload, message, Modal, Table, Space, Image } = antd;
const { Option } = Select;
const { TextArea } = Input;

function ExhibitorMaintenance() {
    // 基础信息初始值
    const [companyInfo, setCompanyInfo] = useState({
        logo: '',
        name: '',
        code: '',
        type: '',
        description: '',
        contact: {
            name: '',
            phone: '',
            email: ''
        }
    });
    // 产品列表
    const [products, setProducts] = useState([]);
    // 产品编辑弹窗
    const [productModalVisible, setProductModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm] = Form.useForm();
    const [companyForm] = Form.useForm();
    // LOGO上传
    const [logoFileList, setLogoFileList] = useState([]);

    // 公司信息保存
    const handleCompanySave = (values) => {
        setCompanyInfo({ ...companyInfo, ...values, logo: logoFileList[0]?.url || companyInfo.logo });
        message.success('公司信息已保存');
    };

    // LOGO上传处理
    const handleLogoChange = ({ fileList }) => {
        fileList = fileList.slice(-1);
        fileList.forEach(file => {
            if (!file.url && !file.preview) {
                file.url = URL.createObjectURL(file.originFileObj);
            }
        });
        setLogoFileList(fileList);
    };

    // 产品弹窗保存
    const handleProductSave = () => {
        productForm.validateFields().then(values => {
            let imgUrl = values.image && values.image[0]?.url;
            if (!imgUrl && values.image && values.image[0]?.originFileObj) {
                imgUrl = URL.createObjectURL(values.image[0].originFileObj);
            }
            const product = { ...values, image: imgUrl };
            if (editingProduct !== null) {
                const newList = [...products];
                newList[editingProduct] = product;
                setProducts(newList);
                message.success('产品已更新');
            } else {
                setProducts([...products, product]);
                message.success('产品已添加');
            }
            setProductModalVisible(false);
            setEditingProduct(null);
            productForm.resetFields();
        });
    };

    // 产品编辑
    const handleEditProduct = (record, idx) => {
        setEditingProduct(idx);
        productForm.setFieldsValue({ ...record, image: record.image ? [{ url: record.image }] : [] });
        setProductModalVisible(true);
    };

    // 产品删除
    const handleDeleteProduct = (idx) => {
        Modal.confirm({
            title: '确认删除该产品？',
            onOk: () => {
                setProducts(products.filter((_, i) => i !== idx));
                message.success('已删除');
            }
        });
    };

    // 产品图片上传
    const handleProductImgChange = ({ fileList }) => {
        return fileList.slice(-1).map(file => {
            if (!file.url && !file.preview) {
                file.url = URL.createObjectURL(file.originFileObj);
            }
            return file;
        });
    };

    // 产品表格列
    const productColumns = [
        {
            title: '图片',
            dataIndex: 'image',
            render: (img) => img ? React.createElement(Image, { src: img, width: 60 }) : '无'
        },
        { title: '名称', dataIndex: 'name' },
        { title: '规格', dataIndex: 'spec' },
        { title: '描述', dataIndex: 'desc' },
        {
            title: '操作',
            render: (_, record, idx) => React.createElement(Space, {}, [
                React.createElement('a', { onClick: () => handleEditProduct(record, idx), key: 'edit' }, '编辑'),
                React.createElement('a', { onClick: () => handleDeleteProduct(idx), key: 'delete', style: { color: 'red' } }, '删除')
            ])
        }
    ];

    return React.createElement('div', { style: { maxWidth: 900, margin: '0 auto', padding: 24 } }, [
        React.createElement('h2', { style: { marginBottom: 24 } }, '展商维护'),
        React.createElement(Card, { title: '公司基础信息', style: { marginBottom: 24 } },
            React.createElement(Form, {
                form: companyForm,
                layout: 'vertical',
                initialValues: companyInfo,
                onFinish: handleCompanySave
            }, [
                React.createElement(Row, { gutter: 24 }, [
                    React.createElement(Col, { span: 6 },
                        React.createElement(Form.Item, { label: '公司LOGO', name: 'logo' },
                            React.createElement(Upload, {
                                listType: 'picture-card',
                                fileList: logoFileList,
                                onChange: handleLogoChange,
                                beforeUpload: () => false,
                                maxCount: 1
                            }, logoFileList.length < 1 && '+ 上传')
                        )
                    ),
                    React.createElement(Col, { span: 18 }, [
                        React.createElement(Row, { gutter: 16 }, [
                            React.createElement(Col, { span: 12 },
                                React.createElement(Form.Item, { label: '公司名称', name: 'name', rules: [{ required: true, message: '请输入公司名称' }] },
                                    React.createElement(Input, null)
                                )
                            ),
                            React.createElement(Col, { span: 12 },
                                React.createElement(Form.Item, { label: '公司编号', name: 'code', rules: [{ required: true, message: '请输入公司编号' }] },
                                    React.createElement(Input, null)
                                )
                            )
                        ]),
                        React.createElement(Row, { gutter: 16 }, [
                            React.createElement(Col, { span: 12 },
                                React.createElement(Form.Item, { label: '企业属性', name: 'type', rules: [{ required: true, message: '请选择企业属性' }] },
                                    React.createElement(Select, { placeholder: '请选择' }, [
                                        React.createElement(Option, { value: '国有企业', key: '国有企业' }, '国有企业'),
                                        React.createElement(Option, { value: '民营企业', key: '民营企业' }, '民营企业'),
                                        React.createElement(Option, { value: '合资企业', key: '合资企业' }, '合资企业')
                                    ])
                                )
                            )
                        ]),
                        React.createElement(Form.Item, { label: '公司简介', name: 'description', rules: [{ required: true, message: '请输入公司简介' }] },
                            React.createElement(TextArea, { rows: 3 })
                        )
                    ])
                ]),
                React.createElement(Row, { gutter: 16 }, [
                    React.createElement(Col, { span: 8 },
                        React.createElement(Form.Item, { label: '业务联系人姓名', name: ['contact', 'name'], rules: [{ required: true, message: '请输入联系人姓名' }] },
                            React.createElement(Input, null)
                        )
                    ),
                    React.createElement(Col, { span: 8 },
                        React.createElement(Form.Item, { label: '手机', name: ['contact', 'phone'], rules: [{ required: true, message: '请输入手机' }, { pattern: /^1\d{10}$/, message: '请输入正确的手机号' }] },
                            React.createElement(Input, null)
                        )
                    ),
                    React.createElement(Col, { span: 8 },
                        React.createElement(Form.Item, { label: '邮箱', name: ['contact', 'email'], rules: [{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入有效邮箱' }] },
                            React.createElement(Input, null)
                        )
                    )
                ]),
                React.createElement(Form.Item, null,
                    React.createElement(Button, { type: 'primary', htmlType: 'submit' }, '保存')
                )
            ])
        ),
        React.createElement(Card, {
            title: '产品列表',
            extra: React.createElement(Button, {
                type: 'primary',
                onClick: () => { setProductModalVisible(true); setEditingProduct(null); productForm.resetFields(); }
            }, '新增产品')
        },
            React.createElement(Table, {
                columns: productColumns,
                dataSource: products,
                rowKey: (r, i) => i,
                pagination: false
            })
        ),
        React.createElement(Modal, {
            title: editingProduct !== null ? '编辑产品' : '新增产品',
            open: productModalVisible,
            onCancel: () => { setProductModalVisible(false); setEditingProduct(null); productForm.resetFields(); },
            onOk: handleProductSave,
            destroyOnClose: true
        },
            React.createElement(Form, { form: productForm, layout: 'vertical' }, [
                React.createElement(Form.Item, {
                    label: '产品图片',
                    name: 'image',
                    valuePropName: 'fileList',
                    getValueFromEvent: handleProductImgChange,
                    rules: [{ required: true, message: '请上传产品图片' }]
                },
                    React.createElement(Upload, { listType: 'picture-card', beforeUpload: () => false, maxCount: 1 }, '+上传')
                ),
                React.createElement(Form.Item, { label: '产品名称', name: 'name', rules: [{ required: true, message: '请输入产品名称' }] },
                    React.createElement(Input, null)
                ),
                React.createElement(Form.Item, { label: '产品规格', name: 'spec', rules: [{ required: true, message: '请输入产品规格' }] },
                    React.createElement(Input, null)
                ),
                React.createElement(Form.Item, { label: '产品描述', name: 'desc', rules: [{ required: true, message: '请输入产品描述' }] },
                    React.createElement(TextArea, { rows: 2 })
                )
            ])
        )
    ]);
}

// 导出组件
window.ExhibitorMaintenance = ExhibitorMaintenance; 