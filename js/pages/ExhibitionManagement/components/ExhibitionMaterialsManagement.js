import React, { useState, useEffect, useRef } from 'react';
import {
  Layout,
  Card,
  Button,
  Table,
  Upload,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Switch,
  Space,
  message,
  Typography,
  Spin,
  Popconfirm,
  Divider
} from 'antd';
import {
  UploadOutlined,
  FileTextOutlined,
  ImageOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Dragger } = Upload;
const { TextArea } = Input;

// 模拟数据 - 实际项目中应从API获取
const mockMaterials = [
  {
    id: '1',
    name: '展会介绍手册',
    description: '本次展会的详细介绍和日程安排',
    type: 'pdf',
    category: '文档',
    tags: ['介绍', '日程'],
    fileUrl: '/files/exhibition-brochure.pdf',
    size: '2.5MB',
    uploadTime: '2024-06-20 10:30:00',
    uploader: '张经理',
    downloadCount: 156,
    isPublic: true,
    previewUrl: '/preview/exhibition-brochure.pdf'
  },
  {
    id: '2',
    name: '参展商名录',
    description: '所有参展商的详细信息和展位号',
    type: 'excel',
    category: '数据',
    tags: ['参展商', '名录'],
    fileUrl: '/files/exhibitor-list.xlsx',
    size: '1.8MB',
    uploadTime: '2024-06-21 14:20:00',
    uploader: '李助理',
    downloadCount: 234,
    isPublic: true,
    previewUrl: null
  },
  {
    id: '3',
    name: '展会主视觉设计',
    description: '展会的宣传海报和主视觉设计文件',
    type: 'image',
    category: '图片',
    tags: ['宣传', '设计'],
    fileUrl: '/files/main-visual.jpg',
    size: '4.2MB',
    uploadTime: '2024-06-15 09:15:00',
    uploader: '王设计师',
    downloadCount: 89,
    isPublic: true,
    previewUrl: '/preview/main-visual.jpg'
  },
  {
    id: '4',
    name: '展馆平面图',
    description: '展会场馆的详细平面图',
    type: 'pdf',
    category: '文档',
    tags: ['场地', '平面图'],
    fileUrl: '/files/venue-map.pdf',
    size: '3.1MB',
    uploadTime: '2024-06-22 16:45:00',
    uploader: '张经理',
    downloadCount: 198,
    isPublic: true,
    previewUrl: '/preview/venue-map.pdf'
  },
  {
    id: '5',
    name: 'VIP邀请函',
    description: '仅限VIP客户的专属邀请函',
    type: 'docx',
    category: '文档',
    tags: ['VIP', '邀请函'],
    fileUrl: '/files/vip-invitation.docx',
    size: '0.9MB',
    uploadTime: '2024-06-18 11:30:00',
    uploader: '刘总监',
    downloadCount: 27,
    isPublic: false,
    previewUrl: null
  }
];

// 材料分类选项
const materialCategories = [
  { value: '文档', label: '文档' },
  { value: '图片', label: '图片' },
  { value: '视频', label: '视频' },
  { value: '音频', label: '音频' },
  { value: '数据', label: '数据' },
  { value: '其他', label: '其他' }
];

// 预定义标签选项
const predefinedTags = ['介绍', '日程', '参展商', '宣传', '设计', '场地', 'VIP', '邀请函', '报告', '手册'];

/**
 * 展会材料管理组件
 * 负责展会相关材料的上传、管理、预览和下载
 */
const ExhibitionMaterialsManagement = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [visibleFilters, setVisibleFilters] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [form] = Form.useForm();
  const fileInputRef = useRef(null);

  // 加载材料数据
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        setMaterials(mockMaterials);
      } catch (error) {
        message.error('加载材料数据失败，请稍后重试');
        console.error('Failed to fetch materials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  // 获取文件类型对应的图标
  const getFileTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FilePdfOutlined style={{ color: '#e83e8c' }} />;
      case 'excel':
      case 'xlsx':
      case 'xls':
        return <FileExcelOutlined style={{ color: '#28a745' }} />;
      case 'word':
      case 'docx':
      case 'doc':
        return <FileTextOutlined style={{ color: '#007bff' }} />;
      case 'image':
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <ImageOutlined style={{ color: '#17a2b8' }} />;
      case 'video':
      case 'mp4':
      case 'avi':
      case 'mov':
        return <VideoCameraOutlined style={{ color: '#fd7e14' }} />;
      case 'audio':
      case 'mp3':
      case 'wav':
        return <AudioOutlined style={{ color: '#6f42c1' }} />;
      default:
        return <FileTextOutlined style={{ color: '#6c757d' }} />;
    }
  };

  // 过滤材料数据
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = searchText === '' ||
      material.name.toLowerCase().includes(searchText.toLowerCase()) ||
      material.description.toLowerCase().includes(searchText.toLowerCase()) ||
      material.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));
    
    const matchesCategory = categoryFilter === '' || material.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // 处理搜索输入变化
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // 处理分类筛选变化
  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
  };

  // 重置筛选条件
  const resetFilters = () => {
    setSearchText('');
    setCategoryFilter('');
    form.resetFields();
  };

  // 打开创建材料模态框
  const showCreateModal = () => {
    form.resetFields();
    setCreateModalVisible(true);
  };

  // 关闭创建材料模态框
  const handleCreateModalCancel = () => {
    setCreateModalVisible(false);
    form.resetFields();
  };

  // 打开编辑材料模态框
  const showEditModal = (material) => {
    setCurrentMaterial(material);
    form.setFieldsValue({
      name: material.name,
      description: material.description,
      category: material.category,
      tags: material.tags,
      isPublic: material.isPublic
    });
    setEditModalVisible(true);
  };

  // 关闭编辑材料模态框
  const handleEditModalCancel = () => {
    setEditModalVisible(false);
    setCurrentMaterial(null);
    form.resetFields();
  };

  // 提交材料表单（创建或编辑）
  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (createModalVisible) {
        // 创建新材料
        const newMaterial = {
          id: uuidv4(),
          ...values,
          type: 'pdf', // 实际项目中应根据文件类型自动判断
          fileUrl: '/files/new-material.pdf', // 实际项目中应使用上传后的文件URL
          size: '1.0MB', // 实际项目中应获取真实文件大小
          uploadTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          uploader: '当前用户', // 实际项目中应从用户会话获取
          downloadCount: 0,
          previewUrl: '/preview/new-material.pdf' // 实际项目中应根据文件类型生成预览URL
        };
        
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 500));
        setMaterials([...materials, newMaterial]);
        message.success('材料创建成功');
        setCreateModalVisible(false);
      } else if (editModalVisible && currentMaterial) {
        // 编辑现有材料
        const updatedMaterial = {
          ...currentMaterial,
          ...values
        };
        
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 500));
        setMaterials(materials.map(m => m.id === currentMaterial.id ? updatedMaterial : m));
        message.success('材料更新成功');
        setEditModalVisible(false);
        setCurrentMaterial(null);
      }
      
      form.resetFields();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // 删除材料
  const handleDeleteMaterial = async (id) => {
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 500));
      setMaterials(materials.filter(material => material.id !== id));
      message.success('材料删除成功');
    } catch (error) {
      message.error('删除材料失败，请稍后重试');
      console.error('Failed to delete material:', error);
    }
  };

  // 预览材料
  const handlePreviewMaterial = (material) => {
    if (material.previewUrl) {
      setPreviewUrl(material.previewUrl);
      setPreviewModalVisible(true);
    } else {
      message.info('该文件不支持在线预览，请下载后查看');
    }
  };

  // 关闭预览模态框
  const handlePreviewModalCancel = () => {
    setPreviewModalVisible(false);
    setPreviewUrl('');
  };

  // 下载材料
  const handleDownloadMaterial = (material) => {
    // 模拟下载操作
    message.success(`正在下载: ${material.name}`);
    // 实际项目中应使用真实的文件下载链接
    window.open(material.fileUrl);
    
    // 更新下载次数
    setMaterials(materials.map(m => 
      m.id === material.id ? { ...m, downloadCount: m.downloadCount + 1 } : m
    ));
  };

  // 切换材料公开状态
  const handleTogglePublicStatus = async (id, newStatus) => {
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 300));
      setMaterials(materials.map(material => 
        material.id === id ? { ...material, isPublic: newStatus } : material
      ));
      message.success(`材料已${newStatus ? '设置为公开' : '设置为私有'}`);
    } catch (error) {
      message.error('更新材料状态失败，请稍后重试');
      console.error('Failed to update material status:', error);
    }
  };

  // 处理文件上传
  const handleFileUpload = async (file) => {
    // 模拟文件上传
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('File uploaded:', file.name);
        resolve({ status: 'done', url: `/files/${file.name}` });
      }, 1000);
    });
  };

  // 上传配置
  const uploadProps = {
    name: 'file',
    multiple: true,
    customRequest: ({ file, onSuccess }) => {
      handleFileUpload(file).then(() => {
        onSuccess('ok');
        message.success(`${file.name} 文件上传成功`);
        // 实际项目中应在这里刷新材料列表
      });
    },
    onError: (err) => {
      message.error('文件上传失败');
      console.error('Upload error:', err);
    },
    onRemove: (file) => {
      console.log('Removed file:', file.name);
      return true;
    },
    beforeUpload: (file) => {
      // 检查文件大小（限制10MB）
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('文件大小不能超过10MB');
        return Upload.LIST_IGNORE;
      }
      return true;
    }
  };

  // 表格列配置
  const columns = [
    {
      title: '文件',
      dataIndex: 'name',
      key: 'name',
      width: '200px',
      render: (text, record) => (
        <Space>
          {getFileTypeIcon(record.type)}
          <Text ellipsis={{ tooltip: text }}>{text}</Text>
        </Space>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (text) => <Text ellipsis={{ tooltip: text }}>{text}</Text>
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      filters: materialCategories.map(cat => ({ text: cat.label, value: cat.value })),
      onFilter: (value, record) => record.category === value,
      width: '100px'
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: '150px',
      render: (tags) => (
        <Space size={[0, 4]} wrap>
          {tags.map((tag, index) => (
            <Tag key={index} color="blue">{tag}</Tag>
          ))}
        </Space>
      )
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      width: '80px'
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
      sorter: (a, b) => new Date(a.uploadTime) - new Date(b.uploadTime),
      width: '150px'
    },
    {
      title: '下载次数',
      dataIndex: 'downloadCount',
      key: 'downloadCount',
      sorter: (a, b) => a.downloadCount - b.downloadCount,
      width: '100px'
    },
    {
      title: '是否公开',
      dataIndex: 'isPublic',
      key: 'isPublic',
      width: '100px',
      render: (text, record) => (
        <Switch
          checked={text}
          onChange={(checked) => handleTogglePublicStatus(record.id, checked)}
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      width: '180px',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handlePreviewMaterial(record)}
            disabled={!record.previewUrl}
          >
            预览
          </Button>
          <Button
            type="text"
            icon={<DownloadOutlined />}
            onClick={() => handleDownloadMaterial(record)}
          >
            下载
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个材料吗？"
            onConfirm={() => handleDeleteMaterial(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 渲染表单
  const renderForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFormSubmit}
    >
      <Form.Item
        name="name"
        label="材料名称"
        rules={[{ required: true, message: '请输入材料名称' }]}
      >
        <Input placeholder="请输入材料名称" />
      </Form.Item>

      <Form.Item
        name="description"
        label="材料描述"
        rules={[{ required: true, message: '请输入材料描述' }]}
      >
        <TextArea rows={4} placeholder="请输入材料描述" />
      </Form.Item>

      <Form.Item
        name="category"
        label="材料分类"
        rules={[{ required: true, message: '请选择材料分类' }]}
      >
        <Select placeholder="请选择材料分类">
          {materialCategories.map(cat => (
            <Option key={cat.value} value={cat.value}>{cat.label}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="tags"
        label="标签"
        rules={[{ required: true, message: '请至少选择一个标签' }]}
      >
        <Select
          mode="multiple"
          placeholder="请选择标签（可多选）"
          style={{ width: '100%' }}
          tokenSeparators={[',', ' ']}
        >
          {predefinedTags.map(tag => (
            <Option key={tag} value={tag}>{tag}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="isPublic"
        label="是否公开"
        initialValue={true}
        valuePropName="checked"
      >
        <Switch checkedChildren="公开" unCheckedChildren="私有" />
      </Form.Item>

      <Form.Item label="文件上传">
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            支持单个或批量上传，单个文件不超过10MB
          </p>
        </Dragger>
      </Form.Item>

      <Form.Item style={{ textAlign: 'right' }}>
        <Space>
          <Button onClick={createModalVisible ? handleCreateModalCancel : handleEditModalCancel}>
            取消
          </Button>
          <Button type="primary" htmlType="submit">
            {createModalVisible ? '创建' : '更新'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return (
    <Layout className="exhibition-materials-management">
      <Header className="header">
        <Title level={4} style={{ color: 'white', margin: 0 }}>展会材料管理</Title>
      </Header>
      <Content className="content">
        <Card>
          <div className="header-actions">
            <div className="search-filters">
              <div className="search-input">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="搜索材料名称、描述或标签"
                  value={searchText}
                  onChange={handleSearchChange}
                  style={{ width: '300px' }}
                />
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showCreateModal}
                className="create-button"
              >
                上传材料
              </Button>
            </div>
          </div>

          <Divider />

          <div className="filter-section">
            <div className="filter-row">
              <Text style={{ marginRight: '10px', fontWeight: 'bold' }}>分类：</Text>
              <Select
                placeholder="全部分类"
                allowClear
                style={{ width: '150px' }}
                value={categoryFilter}
                onChange={handleCategoryChange}
              >
                {materialCategories.map(cat => (
                  <Option key={cat.value} value={cat.value}>{cat.label}</Option>
                ))}
              </Select>
              <Button style={{ marginLeft: '10px' }} onClick={resetFilters}>
                重置筛选
              </Button>
            </div>
          </div>

          <Divider />

          <Table
            columns={columns}
            dataSource={filteredMaterials}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `显示 ${range[0]}-${range[1]} 条，共 ${total} 条`
            }}
            scroll={{ x: 'max-content' }}
          />
        </Card>
      </Content>

      {/* 创建/编辑材料模态框 */}
      <Modal
        title={createModalVisible ? "上传新材料" : "编辑材料"}
        open={createModalVisible || editModalVisible}
        onCancel={createModalVisible ? handleCreateModalCancel : handleEditModalCancel}
        footer={null}
        width={700}
        destroyOnClose
      >
        {renderForm()}
      </Modal>

      {/* 预览材料模态框 */}
      <Modal
        title="材料预览"
        open={previewModalVisible}
        onCancel={handlePreviewModalCancel}
        footer={null}
        width={900}
        height={600}
      >
        {previewUrl && (
          <div className="preview-container">
            {previewUrl.endsWith('.pdf') ? (
              <iframe
                src={previewUrl}
                title="PDF Preview"
                width="100%"
                height="500px"
                frameBorder="0"
              />
            ) : (
              <img
                src={previewUrl}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: '500px' }}
              />
            )}
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default ExhibitionMaterialsManagement;
