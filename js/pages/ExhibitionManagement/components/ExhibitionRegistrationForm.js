import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, DatePicker, Switch, Radio, Checkbox, Upload, Button, Space, message, Table, Modal, Drawer, Tag, Row, Col, Divider } from 'antd';
import { PlusOutlined, MinusOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined, FileTextOutlined, UploadOutlined, EyeOutlined, SaveOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

/**
 * 展会报名表单组件
 * 功能：配置和管理展会报名表单的字段和验证规则
 */
const ExhibitionRegistrationForm = ({ exhibitionData = [] }) => {
  const [selectedExhibition, setSelectedExhibition] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddFieldModalVisible, setIsAddFieldModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [fieldForm] = Form.useForm();

  // 字段类型选项
  const fieldTypes = [
    { value: 'text', label: '单行文本' },
    { value: 'textarea', label: '多行文本' },
    { value: 'number', label: '数字' },
    { value: 'date', label: '日期' },
    { value: 'daterange', label: '日期范围' },
    { value: 'select', label: '下拉选择' },
    { value: 'radio', label: '单选框' },
    { value: 'checkbox', label: '多选框' },
    { value: 'switch', label: '开关' },
    { value: 'upload', label: '文件上传' },
  ];

  // 选择展会
  const handleExhibitionSelect = (exhibitionId) => {
    const exhibition = exhibitionData.find(item => item.exhibitionId === exhibitionId);
    setSelectedExhibition(exhibition);
    loadFormFields(exhibitionId);
  };

  // 加载表单字段
  const loadFormFields = (exhibitionId) => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      // 模拟数据
      const mockFields = [
        {
          id: '1',
          fieldName: 'company',
          fieldLabel: '公司名称',
          fieldType: 'text',
          required: true,
          placeholder: '请输入公司名称',
          maxLength: 100,
          order: 1,
          options: [],
        },
        {
          id: '2',
          fieldName: 'contactPerson',
          fieldLabel: '联系人',
          fieldType: 'text',
          required: true,
          placeholder: '请输入联系人姓名',
          maxLength: 50,
          order: 2,
          options: [],
        },
        {
          id: '3',
          fieldName: 'phone',
          fieldLabel: '联系电话',
          fieldType: 'text',
          required: true,
          placeholder: '请输入联系电话',
          maxLength: 20,
          order: 3,
          options: [],
        },
        {
          id: '4',
          fieldName: 'email',
          fieldLabel: '电子邮箱',
          fieldType: 'text',
          required: true,
          placeholder: '请输入电子邮箱',
          maxLength: 100,
          order: 4,
          options: [],
        },
        {
          id: '5',
          fieldName: 'participantCount',
          fieldLabel: '参展人数',
          fieldType: 'number',
          required: true,
          min: 1,
          max: 100,
          order: 5,
          options: [],
        },
        {
          id: '6',
          fieldName: 'participationPurpose',
          fieldLabel: '参展目的',
          fieldType: 'select',
          required: true,
          placeholder: '请选择参展目的',
          order: 6,
          options: [
            { label: '寻求合作', value: 'cooperation' },
            { label: '学习交流', value: 'learning' },
            { label: '产品展示', value: 'display' },
            { label: '市场调研', value: 'research' },
          ],
        },
        {
          id: '7',
          fieldName: 'specialRequirements',
          fieldLabel: '特殊需求',
          fieldType: 'textarea',
          required: false,
          placeholder: '如有特殊需求，请在此说明',
          maxLength: 500,
          rows: 4,
          order: 7,
          options: [],
        },
      ];
      
      setFormFields(mockFields);
      setLoading(false);
    }, 500);
  };

  // 添加字段
  const handleAddField = () => {
    fieldForm.resetFields();
    setCurrentField(null);
    setIsAddFieldModalVisible(true);
  };

  // 编辑字段
  const handleEditField = (field) => {
    setCurrentField(field);
    fieldForm.setFieldsValue({
      fieldName: field.fieldName,
      fieldLabel: field.fieldLabel,
      fieldType: field.fieldType,
      required: field.required,
      placeholder: field.placeholder,
      maxLength: field.maxLength,
      min: field.min,
      max: field.max,
      rows: field.rows,
      options: field.options ? field.options.map(opt => opt.value).join('\n') : '',
    });
    setIsAddFieldModalVisible(true);
  };

  // 删除字段
  const handleDeleteField = (fieldId) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该字段吗？删除后不可恢复。',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setFormFields(formFields.filter(field => field.id !== fieldId));
        message.success('删除成功');
      },
    });
  };

  // 保存字段
  const handleSaveField = (values) => {
    // 处理选项数据
    let fieldOptions = [];
    if (['select', 'radio', 'checkbox'].includes(values.fieldType) && values.options) {
      fieldOptions = values.options.split('\n')
        .filter(opt => opt.trim())
        .map(opt => ({
          label: opt.trim(),
          value: opt.trim().toLowerCase().replace(/\s+/g, '_'),
        }));
    }

    const fieldData = {
      ...values,
      options: fieldOptions,
      order: formFields.length + 1,
    };

    if (currentField) {
      // 更新现有字段
      const updatedFields = formFields.map(field => 
        field.id === currentField.id ? { ...field, ...fieldData } : field
      );
      setFormFields(updatedFields);
      message.success('更新成功');
    } else {
      // 添加新字段
      const newField = {
        ...fieldData,
        id: Date.now().toString(),
      };
      setFormFields([...formFields, newField]);
      message.success('添加成功');
    }
    setIsAddFieldModalVisible(false);
  };

  // 调整字段顺序
  const handleFieldOrderChange = (dragIndex, hoverIndex) => {
    const dragField = formFields[dragIndex];
    const newFields = [...formFields];
    newFields.splice(dragIndex, 1);
    newFields.splice(hoverIndex, 0, dragField);
    
    // 更新order属性
    const updatedFields = newFields.map((field, index) => ({
      ...field,
      order: index + 1,
    }));
    
    setFormFields(updatedFields);
  };

  // 保存表单配置
  const handleSaveFormConfig = () => {
    if (!selectedExhibition) {
      message.warning('请先选择展会');
      return;
    }
    
    setLoading(true);
    // 模拟保存操作
    setTimeout(() => {
      message.success('表单配置保存成功');
      setLoading(false);
    }, 500);
  };

  // 预览表单
  const handlePreviewForm = () => {
    // 这里可以实现表单预览功能
    message.info('表单预览功能待实现');
  };

  return (
    <div>
      {/* 展会选择 */}
      <Card size="small" className="filter-card" style={{ marginBottom: 20 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="选择展会">
              <Select 
                placeholder="请选择展会" 
                style={{ width: '100%' }}
                onChange={handleExhibitionSelect}
                value={selectedExhibition?.exhibitionId}
              >
                {exhibitionData.map(item => (
                  <Option key={item.exhibitionId} value={item.exhibitionId}>
                    {item.exhibitionName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            {selectedExhibition && (
              <Form.Item label="展会状态">
                <Tag color={selectedExhibition.registrationStatus === 'open' ? 'green' : 'red'}>
                  {selectedExhibition.registrationStatus === 'open' ? '开放报名' : '已关闭'}
                </Tag>
              </Form.Item>
            )}
          </Col>
          <Col span={10} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
            <Space>
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveFormConfig} loading={loading}>
                保存表单配置
              </Button>
              <Button icon={<EyeOutlined />} onClick={handlePreviewForm} disabled={!selectedExhibition}>
                预览表单
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 表单字段配置 */}
      {selectedExhibition && (
        <Card 
          title="表单字段配置" 
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddField}>
              添加字段
            </Button>
          }
        >
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: '#666', marginBottom: 10 }}>
              拖动字段可以调整顺序，点击编辑可以修改字段属性
            </p>
          </div>
          
          <div>
            {formFields.map((field, index) => (
              <div 
                key={field.id} 
                style={{
                  padding: 15,
                  border: '1px solid #e8e8e8',
                  borderRadius: 4,
                  marginBottom: 10,
                  cursor: 'move',
                  backgroundColor: '#fafafa',
                }}
                onMouseDown={(e) => {
                  // 这里可以实现拖拽功能
                }}
              >
                <Row justify="space-between" align="middle">
                  <Col>
                    <Space>
                      <span style={{ fontWeight: 'bold' }}>{index + 1}. {field.fieldLabel}</span>
                      <Tag color="blue">{fieldTypes.find(t => t.value === field.fieldType)?.label}</Tag>
                      {field.required && <Tag color="red">必填</Tag>}
                    </Space>
                    <p style={{ color: '#666', marginTop: 5, fontSize: 12 }}>
                      字段名：{field.fieldName}
                    </p>
                  </Col>
                  <Col>
                    <Space>
                      <Button 
                        type="text" 
                        icon={<EditOutlined />} 
                        onClick={() => handleEditField(field)}
                      >
                        编辑
                      </Button>
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => handleDeleteField(field.id)}
                      >
                        删除
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </div>
            ))}
            
            {formFields.length === 0 && (
              <div style={{ textAlign: 'center', padding: 50, color: '#999' }}>
                <p>暂无表单字段，请点击添加字段按钮开始配置</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* 添加/编辑字段模态框 */}
      <Modal
        title={currentField ? '编辑字段' : '添加字段'}
        open={isAddFieldModalVisible}
        onCancel={() => setIsAddFieldModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={fieldForm}
          layout="vertical"
          onFinish={handleSaveField}
        >
          <Form.Item
            name="fieldName"
            label="字段名"
            rules={[{ required: true, message: '请输入字段名' }]}
          >
            <Input placeholder="请输入字段名（英文，建议使用下划线分隔）" />
          </Form.Item>
          
          <Form.Item
            name="fieldLabel"
            label="字段标签"
            rules={[{ required: true, message: '请输入字段标签' }]}
          >
            <Input placeholder="请输入字段标签（显示在表单上的名称）" />
          </Form.Item>
          
          <Form.Item
            name="fieldType"
            label="字段类型"
            rules={[{ required: true, message: '请选择字段类型' }]}
          >
            <Select placeholder="请选择字段类型">
              {fieldTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="required"
            label="是否必填"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.fieldType !== currentValues.fieldType}
          >
            {({ getFieldValue }) => {
              const fieldType = getFieldValue('fieldType');
              if (['text', 'textarea'].includes(fieldType)) {
                return (
                  <>
                    <Form.Item
                      name="placeholder"
                      label="提示文本"
                    >
                      <Input placeholder="请输入提示文本" />
                    </Form.Item>
                    
                    <Form.Item
                      name="maxLength"
                      label="最大长度"
                    >
                      <Input type="number" placeholder="请输入最大长度" />
                    </Form.Item>
                    
                    {fieldType === 'textarea' && (
                      <Form.Item
                        name="rows"
                        label="行数"
                      >
                        <Input type="number" placeholder="请输入默认行数" />
                      </Form.Item>
                    )}
                  </>
                );
              }
              
              if (fieldType === 'number') {
                return (
                  <>
                    <Form.Item
                      name="min"
                      label="最小值"
                    >
                      <Input type="number" placeholder="请输入最小值" />
                    </Form.Item>
                    
                    <Form.Item
                      name="max"
                      label="最大值"
                    >
                      <Input type="number" placeholder="请输入最大值" />
                    </Form.Item>
                  </>
                );
              }
              
              if (['select', 'radio', 'checkbox'].includes(fieldType)) {
                return (
                  <Form.Item
                    name="options"
                    label="选项值"
                    tooltip="每行输入一个选项"
                  >
                    <TextArea 
                      placeholder="请输入选项，每行一个" 
                      rows={4}
                      showCount
                    />
                  </Form.Item>
                );
              }
              
              return null;
            }}
          </Form.Item>
          
          <Form.Item>
            <Row justify="end">
              <Space>
                <Button onClick={() => setIsAddFieldModalVisible(false)}>取消</Button>
                <Button type="primary" htmlType="submit">
                  确定
                </Button>
              </Space>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExhibitionRegistrationForm;
