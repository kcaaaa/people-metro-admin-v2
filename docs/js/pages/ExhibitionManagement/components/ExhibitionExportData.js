import React, { useState, useEffect } from 'react';
import { Button, Form, Select, DatePicker, Checkbox, Input, Row, Col, Card, Typography, message, Spin } from 'antd';
import { DownloadOutlined, FilterOutlined, CloseOutlined, ReloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

/**
 * 展会数据导出组件
 * 支持导出报名信息、参展人员信息、审核信息等各类展会相关数据
 * 支持多种导出格式和筛选条件
 */
const ExhibitionExportData = () => {
  const [form] = Form.useForm();
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState([
    { label: '报名基本信息', value: 'basicInfo' },
    { label: '企业信息', value: 'companyInfo' },
    { label: '联系人信息', value: 'contactInfo' },
    { label: '参展人员信息', value: 'participantInfo' },
    { label: '审核状态信息', value: 'auditInfo' },
  ]);
  
  // 模拟加载展会列表数据
  const [exhibitionList, setExhibitionList] = useState([]);
  
  useEffect(() => {
    // 模拟异步加载展会列表
    setTimeout(() => {
      setExhibitionList([
        { id: '1', name: '2023轨道交通技术展览会' },
        { id: '2', name: '2023智慧城市建设论坛' },
        { id: '3', name: '2023轨道交通装备展' },
      ]);
    }, 500);
  }, []);

  /**
   * 导出数据处理函数
   * @param {Object} values - 表单提交的值
   */
  const handleExport = async (values) => {
    try {
      setIsExporting(true);
      
      // 模拟导出请求延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 根据选择的导出格式和数据类型处理导出逻辑
      const { exportType, exhibitionId, dateRange, selectedFields, auditStatus } = values;
      
      // 模拟生成导出数据
      const exportData = generateMockExportData(selectedFields, auditStatus);
      
      // 根据选择的格式进行导出
      if (exportType === 'excel') {
        exportToExcel(exportData, exhibitionId);
      } else if (exportType === 'csv') {
        exportToCSV(exportData, exhibitionId);
      }
      
      message.success('数据导出成功');
    } catch (error) {
      console.error('导出失败:', error);
      message.error('数据导出失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * 生成模拟导出数据
   * @param {Array} selectedFields - 选择的字段
   * @param {string} auditStatus - 审核状态筛选
   * @returns {Array} 导出数据数组
   */
  const generateMockExportData = (selectedFields = [], auditStatus) => {
    // 基础模拟数据
    const baseData = [
      {
        id: '1',
        applyNo: 'XM2023001',
        exhibitionName: '2023轨道交通技术展览会',
        companyName: '中车集团有限公司',
        companyType: '国有企业',
        contactName: '张三',
        contactPhone: '13800138000',
        contactEmail: 'zhangsan@example.com',
        participantCount: 5,
        auditStatus: 'approved',
        auditTime: '2023-05-10 14:30:00',
        applyTime: '2023-05-08 09:15:00',
      },
      {
        id: '2',
        applyNo: 'XM2023002', 
        exhibitionName: '2023轨道交通技术展览会',
        companyName: '华为技术有限公司',
        companyType: '民营企业',
        contactName: '李四',
        contactPhone: '13900139000',
        contactEmail: 'lisi@example.com',
        participantCount: 3,
        auditStatus: 'rejected',
        auditTime: '2023-05-11 10:20:00',
        applyTime: '2023-05-09 16:45:00',
      },
      {
        id: '3',
        applyNo: 'XM2023003',
        exhibitionName: '2023轨道交通技术展览会',
        companyName: '西门子（中国）有限公司',
        companyType: '外资企业',
        contactName: '王五',
        contactPhone: '13700137000',
        contactEmail: 'wangwu@example.com',
        participantCount: 4,
        auditStatus: 'pending',
        auditTime: '',
        applyTime: '2023-05-12 11:30:00',
      },
    ];

    // 根据审核状态筛选
    let filteredData = baseData;
    if (auditStatus && auditStatus !== 'all') {
      filteredData = baseData.filter(item => item.auditStatus === auditStatus);
    }

    // 根据选择的字段生成导出数据
    if (selectedFields.length > 0) {
      return filteredData.map(item => {
        const result = {};
        
        if (selectedFields.includes('basicInfo')) {
          result['申请编号'] = item.applyNo;
          result['展会名称'] = item.exhibitionName;
          result['申请时间'] = item.applyTime;
        }
        
        if (selectedFields.includes('companyInfo')) {
          result['企业名称'] = item.companyName;
          result['企业类型'] = item.companyType;
        }
        
        if (selectedFields.includes('contactInfo')) {
          result['联系人姓名'] = item.contactName;
          result['联系电话'] = item.contactPhone;
          result['联系邮箱'] = item.contactEmail;
        }
        
        if (selectedFields.includes('participantInfo')) {
          result['参展人数'] = item.participantCount;
        }
        
        if (selectedFields.includes('auditInfo')) {
          const statusMap = {
            pending: '待审核',
            approved: '已通过',
            rejected: '已拒绝'
          };
          result['审核状态'] = statusMap[item.auditStatus] || item.auditStatus;
          result['审核时间'] = item.auditTime;
        }
        
        return result;
      });
    }
    
    // 默认返回全部字段的中文映射
    return filteredData.map(item => ({
      '申请编号': item.applyNo,
      '展会名称': item.exhibitionName,
      '企业名称': item.companyName,
      '企业类型': item.companyType,
      '联系人姓名': item.contactName,
      '联系电话': item.contactPhone,
      '联系邮箱': item.contactEmail,
      '参展人数': item.participantCount,
      '审核状态': item.auditStatus === 'approved' ? '已通过' : 
                 item.auditStatus === 'rejected' ? '已拒绝' : '待审核',
      '审核时间': item.auditTime,
      '申请时间': item.applyTime,
    }));
  };

  /**
   * 导出为Excel文件
   * @param {Array} data - 导出数据
   * @param {string} exhibitionId - 展会ID
   */
  const exportToExcel = (data, exhibitionId) => {
    // 创建工作簿
    const wb = XLSX.utils.book_new();
    // 创建工作表
    const ws = XLSX.utils.json_to_sheet(data);
    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(wb, ws, '展会报名数据');
    // 导出文件
    const exhibition = exhibitionList.find(ex => ex.id === exhibitionId);
    const fileName = `${exhibition?.name || '展会'}报名数据_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  /**
   * 导出为CSV文件
   * @param {Array} data - 导出数据
   * @param {string} exhibitionId - 展会ID
   */
  const exportToCSV = (data, exhibitionId) => {
    if (!data || data.length === 0) {
      message.error('没有可导出的数据');
      return;
    }
    
    // 获取所有字段名
    const headers = Object.keys(data[0]);
    // 生成CSV内容
    let csvContent = '\uFEFF' + headers.join(',') + '\n'; // 添加BOM以支持中文
    
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        // 处理包含逗号或换行的值
        if (value && (value.includes(',') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      });
      csvContent += values.join(',') + '\n';
    });
    
    // 创建下载链接
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const exhibition = exhibitionList.find(ex => ex.id === exhibitionId);
    const fileName = `${exhibition?.name || '展会'}报名数据_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * 重置表单
   */
  const handleReset = () => {
    form.resetFields();
  };

  return (
    <Card 
      title={<Title level={4}>展会数据导出</Title>}
      extra={
        <Button 
          type="text" 
          icon={<ReloadOutlined />} 
          onClick={handleReset}
          disabled={isExporting}
        >
          重置筛选
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleExport}
        initialValues={{
          exportType: 'excel',
          auditStatus: 'all',
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="exhibitionId"
              label="选择展会"
              rules={[{ required: true, message: '请选择要导出数据的展会' }]}
            >
              <Select placeholder="请选择展会" loading={exhibitionList.length === 0}>
                {exhibitionList.map(exhibition => (
                  <Option key={exhibition.id} value={exhibition.id}>
                    {exhibition.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          
          <Col xs={24} md={12}>
            <Form.Item
              name="exportType"
              label="导出格式"
              rules={[{ required: true, message: '请选择导出格式' }]}
            >
              <Select placeholder="请选择导出格式">
                <Option value="excel">Excel (.xlsx)</Option>
                <Option value="csv">CSV (.csv)</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col xs={24} md={12}>
            <Form.Item
              name="auditStatus"
              label="审核状态"
            >
              <Select placeholder="请选择审核状态筛选条件">
                <Option value="all">全部</Option>
                <Option value="pending">待审核</Option>
                <Option value="approved">已通过</Option>
                <Option value="rejected">已拒绝</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col xs={24} md={12}>
            <Form.Item
              name="dateRange"
              label="申请日期范围"
            >
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col xs={24}>
            <Form.Item
              name="selectedFields"
              label="选择导出字段"
              rules={[{ required: true, message: '请至少选择一个导出字段' }]}
            >
              <Checkbox.Group options={exportOptions} />
              <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                提示：可选择需要导出的数据字段，不选择则导出全部字段
              </Text>
            </Form.Item>
          </Col>
          
          <Col xs={24} style={{ textAlign: 'center' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<DownloadOutlined />}
              loading={isExporting}
              size="large"
              style={{ minWidth: 120 }}
            >
              导出数据
            </Button>
            
            <Spin spinning={isExporting} tip="正在导出数据..." />
          </Col>
        </Row>
      </Form>
      
      <div style={{ marginTop: 24, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
        <Title level={5}>导出说明：</Title>
        <ul style={{ lineHeight: 1.8 }}>
          <li>选择展会后可筛选导出指定展会的报名数据</li>
          <li>可根据审核状态筛选需要导出的数据</li>
          <li>可通过日期范围筛选特定时间段内的申请数据</li>
          <li>可自定义选择需要导出的数据字段，提高导出效率</li>
          <li>导出的文件名会包含展会名称和当前日期，便于识别和管理</li>
        </ul>
      </div>
    </Card>
  );
};

export default ExhibitionExportData;