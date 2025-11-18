// 新版本的情景管理页面
const ScenarioManagement = () => {
  console.log('情景管理页面组件加载成功！');
  
  // 确保在React环境中正确渲染
  const { useState, useEffect } = React;
  
  // 状态管理
  const [scenarios, setScenarios] = useState([]);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [dialogTitle, setDialogTitle] = useState('');
  const [selectedScreens, setSelectedScreens] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    playMode: 'auto',
    defaultDuration: 30
  });
  
  // 加载数据
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = () => {
    setLoading(true);
    // 模拟API请求延迟
    setTimeout(() => {
      try {
        const scenarioData = window.MockData?.getScenarios ? window.MockData.getScenarios() : [];
        const screenData = window.MockData?.getScreens ? window.MockData.getScreens() : [];
        setScenarios(scenarioData);
        setScreens(screenData);
      } catch (error) {
        console.error('加载数据失败:', error);
        // 如果MockData不可用，使用默认数据
        setScenarios([
          {
            id: 'scenario1',
            name: '综合监控情景',
            description: '展示综合监控数据的场景',
            playMode: 'auto',
            defaultDuration: 30,
            screens: [
              { screenId: 'screen1', name: '客流量监控', duration: 30, order: 1 },
              { screenId: 'screen2', name: '设备状态监控', duration: 30, order: 2 }
            ],
            createdAt: '2024-01-15',
            updatedAt: '2024-01-15'
          },
          {
            id: 'scenario2',
            name: '应急响应情景',
            description: '应急情况下的展示场景',
            playMode: 'manual',
            defaultDuration: 0,
            screens: [
              { screenId: 'screen3', name: '视频监控', duration: 0, order: 1 },
              { screenId: 'screen4', name: '事件调度', duration: 0, order: 2 },
              { screenId: 'screen5', name: '指挥中心', duration: 0, order: 3 }
            ],
            createdAt: '2024-01-16',
            updatedAt: '2024-01-16'
          }
        ]);
        setScreens([
          { id: 'screen1', name: '客流量监控', status: 'active' },
          { id: 'screen2', name: '设备状态监控', status: 'active' },
          { id: 'screen3', name: '视频监控', status: 'active' },
          { id: 'screen4', name: '事件调度', status: 'active' },
          { id: 'screen5', name: '指挥中心', status: 'active' }
        ]);
      }
      setLoading(false);
    }, 500);
  };
  
  // 处理搜索
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      loadData();
      return;
    }
    
    // 从原始数据中过滤
    const scenarioData = window.MockData?.getScenarios ? window.MockData.getScenarios() : [];
    const filtered = scenarioData.filter(scenario => 
      scenario.name.includes(searchQuery) || 
      scenario.description.includes(searchQuery)
    );
    setScenarios(filtered);
  };
  
  // 打开新建对话框
  const handleCreate = () => {
    setDialogTitle('新建情景');
    setCurrentScenario(null);
    setFormData({
      name: '',
      description: '',
      playMode: 'auto',
      defaultDuration: 30
    });
    setSelectedScreens([]);
    setDialogVisible(true);
  };
  
  // 打开编辑对话框
  const handleEdit = (scenario) => {
    setDialogTitle('编辑情景');
    setCurrentScenario(scenario);
    setFormData({
      name: scenario.name,
      description: scenario.description,
      playMode: scenario.playMode,
      defaultDuration: scenario.defaultDuration
    });
    setSelectedScreens(scenario.screens || []);
    setDialogVisible(true);
  };
  
  // 处理删除
  const handleDelete = (id) => {
    if (confirm('确定要删除该情景吗？')) {
      const updatedScenarios = scenarios.filter(scenario => scenario.id !== id);
      setScenarios(updatedScenarios);
      console.log('删除情景:', id);
    }
  };
  
  // 保存情景
  const handleSave = () => {
    // 表单验证
    if (!formData.name.trim()) {
      alert('请输入情景名称');
      return;
    }
    
    if (selectedScreens.length === 0) {
      alert('请至少选择一个大屏');
      return;
    }
    
    const now = new Date().toISOString().split('T')[0];
    let updatedScenarios;
    
    if (currentScenario) {
      // 编辑现有情景
      updatedScenarios = scenarios.map(scenario => {
        if (scenario.id === currentScenario.id) {
          return {
            ...scenario,
            ...formData,
            screens: selectedScreens,
            updatedAt: now
          };
        }
        return scenario;
      });
    } else {
      // 创建新情景
      const newId = window.MockData?.generateId ? 
        window.MockData.generateId('scenario') : 
        'scenario' + Date.now();
      
      const newScenario = {
        id: newId,
        ...formData,
        screens: selectedScreens,
        createdAt: now,
        updatedAt: now
      };
      updatedScenarios = [...scenarios, newScenario];
    }
    
    setScenarios(updatedScenarios);
    setDialogVisible(false);
    console.log('保存情景:', formData.name);
  };
  
  // 添加大屏到情景
  const handleAddScreen = () => {
    // 获取所有可用大屏（未被选中的）
    const availableScreens = screens.filter(screen => 
      screen.status === 'active' && 
      !selectedScreens.some(selected => selected.screenId === screen.id)
    );
    
    if (availableScreens.length === 0) {
      alert('没有可用的大屏了');
      return;
    }
    
    const firstAvailable = availableScreens[0];
    const newScreenItem = {
      screenId: firstAvailable.id,
      name: firstAvailable.name,
      duration: formData.defaultDuration,
      order: selectedScreens.length + 1
    };
    
    setSelectedScreens([...selectedScreens, newScreenItem]);
  };
  
  // 移除大屏
  const handleRemoveScreen = (screenId) => {
    const updatedScreens = selectedScreens.filter(screen => screen.screenId !== screenId);
    // 重新排序
    updatedScreens.forEach((screen, index) => {
      screen.order = index + 1;
    });
    setSelectedScreens(updatedScreens);
  };
  
  // 更新大屏时长
  const handleScreenDurationChange = (screenId, duration) => {
    const updatedScreens = selectedScreens.map(screen => {
      if (screen.screenId === screenId) {
        return { ...screen, duration: parseInt(duration) || 0 };
      }
      return screen;
    });
    setSelectedScreens(updatedScreens);
  };
  
  // 更新播放模式
  const handlePlayModeChange = (mode) => {
    setFormData(prev => ({
      ...prev,
      playMode: mode,
      defaultDuration: mode === 'manual' ? 0 : prev.defaultDuration
    }));
    
    // 如果切换到手动模式，重置所有大屏时长
    if (mode === 'manual') {
      const updatedScreens = selectedScreens.map(screen => ({
        ...screen,
        duration: 0
      }));
      setSelectedScreens(updatedScreens);
    }
  };
  
  // 过滤显示的情景
  const filteredScenarios = scenarios.filter(scenario => 
    scenario.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scenario.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // 创建列表项
  const createListItem = (scenario) => {
    return React.createElement('tr', { key: scenario.id }, [
      React.createElement('td', { key: 'name' }, scenario.name),
      React.createElement('td', { key: 'desc' }, scenario.description),
      React.createElement('td', { key: 'mode' }, 
        React.createElement('span', {
          className: scenario.playMode === 'auto' ? 'badge badge-auto' : 'badge badge-manual',
          style: {
            display: 'inline-block',
            padding: '4px 8px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: scenario.playMode === 'auto' ? '#ecf5ff' : '#f0f9eb',
            color: scenario.playMode === 'auto' ? '#409eff' : '#67c23a'
          }
        }, scenario.playMode === 'auto' ? '自动播放' : '手动播放')
      ),
      React.createElement('td', { key: 'duration' }, scenario.defaultDuration || 0),
      React.createElement('td', { key: 'screenCount' }, scenario.screens?.length || 0),
      React.createElement('td', { key: 'createdAt' }, scenario.createdAt),
      React.createElement('td', { key: 'actions' }, 
        React.createElement('div', { className: 'action-buttons', style: { display: 'flex', gap: '8px' } }, [
          React.createElement('button', {
            className: 'btn btn-default',
            style: {
              padding: '4px 8px',
              border: '1px solid #dcdfe6',
              borderRadius: '4px',
              backgroundColor: '#fff',
              color: '#303133',
              cursor: 'pointer',
              fontSize: '12px'
            },
            onClick: () => handleEdit(scenario)
          }, '编辑'),
          React.createElement('button', {
            className: 'btn btn-danger',
            style: {
              padding: '4px 8px',
              border: '1px solid #f56c6c',
              borderRadius: '4px',
              backgroundColor: '#f56c6c',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '12px'
            },
            onClick: () => handleDelete(scenario.id)
          }, '删除')
        ])
      )
    ]);
  };
  
  // 返回React元素
  return React.createElement('div', {
    style: {
      padding: '20px',
      backgroundColor: '#f5f7fa',
      minHeight: '100vh'
    }
  }, [
    // 页面头部
    React.createElement('div', {
      key: 'header',
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }
    }, [
      React.createElement('h2', { style: { margin: 0, color: '#303133' } }, '情景管理'),
      React.createElement('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flex: 1,
          maxWidth: '500px',
          marginLeft: '20px'
        }
      }, [
        React.createElement('input', {
          type: 'text',
          placeholder: '搜索情景名称或描述...',
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          style: {
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #dcdfe6',
            borderRadius: '4px',
            fontSize: '14px'
          }
        }),
        React.createElement('button', {
          onClick: handleSearch,
          style: {
            padding: '8px 16px',
            border: '1px solid #dcdfe6',
            borderRadius: '4px',
            backgroundColor: '#fff',
            color: '#303133',
            cursor: 'pointer',
            fontSize: '14px'
          }
        }, '搜索'),
        React.createElement('button', {
          onClick: handleCreate,
          style: {
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#409eff',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px'
          }
        }, '新建情景')
      ])
    ]),
    
    // 情景列表
    React.createElement('div', {
      key: 'table',
      style: {
        backgroundColor: '#fff',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }
    }, [
      loading ? (
        React.createElement('div', {
          style: {
            textAlign: 'center',
            padding: '40px',
            color: '#909399'
          }
        }, '加载中...')
      ) : filteredScenarios.length > 0 ? (
        React.createElement('table', {
          style: {
            width: '100%',
            borderCollapse: 'collapse'
          }
        }, [
          React.createElement('thead', null, 
            React.createElement('tr', null, [
              React.createElement('th', { style: { 
                backgroundColor: '#f5f7fa', 
                padding: '12px', 
                textAlign: 'left', 
                fontWeight: '600',
                color: '#606266',
                borderBottom: '1px solid #ebeef5'
              } }, '情景名称'),
              React.createElement('th', { style: { 
                backgroundColor: '#f5f7fa', 
                padding: '12px', 
                textAlign: 'left', 
                fontWeight: '600',
                color: '#606266',
                borderBottom: '1px solid #ebeef5'
              } }, '描述'),
              React.createElement('th', { style: { 
                backgroundColor: '#f5f7fa', 
                padding: '12px', 
                textAlign: 'left', 
                fontWeight: '600',
                color: '#606266',
                borderBottom: '1px solid #ebeef5'
              } }, '播放模式'),
              React.createElement('th', { style: { 
                backgroundColor: '#f5f7fa', 
                padding: '12px', 
                textAlign: 'left', 
                fontWeight: '600',
                color: '#606266',
                borderBottom: '1px solid #ebeef5'
              } }, '默认时长(秒)'),
              React.createElement('th', { style: { 
                backgroundColor: '#f5f7fa', 
                padding: '12px', 
                textAlign: 'left', 
                fontWeight: '600',
                color: '#606266',
                borderBottom: '1px solid #ebeef5'
              } }, '大屏数量'),
              React.createElement('th', { style: { 
                backgroundColor: '#f5f7fa', 
                padding: '12px', 
                textAlign: 'left', 
                fontWeight: '600',
                color: '#606266',
                borderBottom: '1px solid #ebeef5'
              } }, '创建时间'),
              React.createElement('th', { style: { 
                backgroundColor: '#f5f7fa', 
                padding: '12px', 
                textAlign: 'left', 
                fontWeight: '600',
                color: '#606266',
                borderBottom: '1px solid #ebeef5'
              } }, '操作')
            ])
          ),
          React.createElement('tbody', null, 
            filteredScenarios.map(createListItem)
          )
        ])
      ) : (
        React.createElement('div', {
          style: {
            textAlign: 'center',
            padding: '60px 20px',
            color: '#909399'
          }
        }, [
          React.createElement('div', { style: { fontSize: '48px', marginBottom: '20px', color: '#c0c4cc' } }, '📭'),
          React.createElement('p', null, '暂无情景数据')
        ])
      )
    ]),
    
    // 情景编辑对话框
    dialogVisible && React.createElement('div', {
      key: 'dialog',
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }
    }, [
      React.createElement('div', {
        style: {
          backgroundColor: '#fff',
          borderRadius: '4px',
          width: '90%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }
      }, [
        React.createElement('div', {
          style: {
            padding: '20px',
            borderBottom: '1px solid #ebeef5',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }
        }, [
          React.createElement('h3', { style: { margin: 0, color: '#303133' } }, dialogTitle),
          React.createElement('button', {
            onClick: () => setDialogVisible(false),
            style: {
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#909399',
              padding: 0
            }
          }, '×')
        ]),
        
        React.createElement('div', {
          style: {
            padding: '20px'
          }
        }, [
          React.createElement('div', { style: { marginBottom: '20px' } }, [
            React.createElement('label', { style: { 
              display: 'block', 
              marginBottom: '8px', 
              color: '#606266',
              fontWeight: '500' 
            } }, '情景名称 *'),
            React.createElement('input', {
              type: 'text',
              value: formData.name,
              onChange: (e) => setFormData(prev => ({ ...prev, name: e.target.value })),
              placeholder: '请输入情景名称',
              style: {
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #dcdfe6',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }
            })
          ]),
          
          React.createElement('div', { style: { marginBottom: '20px' } }, [
            React.createElement('label', { style: { 
              display: 'block', 
              marginBottom: '8px', 
              color: '#606266',
              fontWeight: '500' 
            } }, '情景描述'),
            React.createElement('textarea', {
              value: formData.description,
              onChange: (e) => setFormData(prev => ({ ...prev, description: e.target.value })),
              placeholder: '请输入情景描述',
              style: {
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #dcdfe6',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
                resize: 'vertical',
                minHeight: '80px'
              }
            })
          ]),
          
          React.createElement('div', { style: { marginBottom: '20px' } }, [
            React.createElement('label', { style: { 
              display: 'block', 
              marginBottom: '8px', 
              color: '#606266',
              fontWeight: '500' 
            } }, '播放模式 *'),
            React.createElement('div', { style: { display: 'flex', gap: '20px' } }, [
              React.createElement('label', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
                React.createElement('input', {
                  type: 'radio',
                  name: 'playMode',
                  value: 'auto',
                  checked: formData.playMode === 'auto',
                  onChange: (e) => handlePlayModeChange(e.target.value)
                }),
                '自动播放'
              ]),
              React.createElement('label', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
                React.createElement('input', {
                  type: 'radio',
                  name: 'playMode',
                  value: 'manual',
                  checked: formData.playMode === 'manual',
                  onChange: (e) => handlePlayModeChange(e.target.value)
                }),
                '手动播放'
              ])
            ])
          ]),
          
          formData.playMode === 'auto' && React.createElement('div', { style: { marginBottom: '20px' } }, [
            React.createElement('label', { style: { 
              display: 'block', 
              marginBottom: '8px', 
              color: '#606266',
              fontWeight: '500' 
            } }, '默认展示时长(秒) *'),
            React.createElement('input', {
              type: 'number',
              min: 1,
              max: 3600,
              value: formData.defaultDuration,
              onChange: (e) => setFormData(prev => ({ 
                ...prev, 
                defaultDuration: parseInt(e.target.value) || 0 
              })),
              style: {
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #dcdfe6',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }
            })
          ]),
          
          React.createElement('div', { style: { marginBottom: '20px' } }, [
            React.createElement('label', { style: { 
              display: 'block', 
              marginBottom: '8px', 
              color: '#606266',
              fontWeight: '500' 
            } }, '大屏组合 *'),
            React.createElement('div', {
              style: {
                border: '1px solid #ebeef5',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '10px'
              }
            }, selectedScreens.length > 0 ? (
              selectedScreens.map((screen) => (
                React.createElement('div', { key: screen.screenId, style: {
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px',
                  borderBottom: '1px solid #ebeef5',
                  backgroundColor: '#fafafa'
                } }, [
                  React.createElement('div', { style: {
                    backgroundColor: '#409eff',
                    color: '#fff',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '10px',
                    fontSize: '12px'
                  } }, screen.order),
                  React.createElement('div', { style: { flex: 1, fontWeight: '500' } }, screen.name),
                  formData.playMode === 'auto' && React.createElement('input', {
                    type: 'number',
                    min: 1,
                    max: 3600,
                    value: screen.duration,
                    onChange: (e) => handleScreenDurationChange(screen.screenId, e.target.value),
                    style: {
                      width: '80px',
                      padding: '4px 8px',
                      border: '1px solid #dcdfe6',
                      borderRadius: '4px',
                      textAlign: 'center'
                    }
                  }),
                  React.createElement('button', {
                    onClick: () => handleRemoveScreen(screen.screenId),
                    style: {
                      padding: '4px 8px',
                      border: '1px solid #f56c6c',
                      borderRadius: '4px',
                      backgroundColor: '#f56c6c',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '12px',
                      marginLeft: '10px'
                    }
                  }, '删除')
                ])
              ))
            ) : (
              React.createElement('div', { style: {
                padding: '20px',
                textAlign: 'center',
                color: '#909399'
              } }, '暂无选择的大屏')
            )),
            React.createElement('button', {
              onClick: handleAddScreen,
              style: {
                padding: '8px 16px',
                border: '1px solid #dcdfe6',
                borderRadius: '4px',
                backgroundColor: '#fff',
                color: '#303133',
                cursor: 'pointer',
                fontSize: '14px'
              }
            }, '添加大屏')
          ])
        ]),
        
        React.createElement('div', {
          style: {
            padding: '10px 20px',
            borderTop: '1px solid #ebeef5',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px'
          }
        }, [
          React.createElement('button', {
            onClick: () => setDialogVisible(false),
            style: {
              padding: '8px 16px',
              border: '1px solid #dcdfe6',
              borderRadius: '4px',
              backgroundColor: '#fff',
              color: '#303133',
              cursor: 'pointer',
              fontSize: '14px'
            }
          }, '取消'),
          React.createElement('button', {
            onClick: handleSave,
            style: {
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: '#409eff',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px'
            }
          }, '保存')
        ])
      ])
    ])
  ]);
};

// 旧版本的渲染函数（保留兼容性）
function renderScenarioManagement() {
  console.log('情景管理页面渲染成功！');
  
  try {
    // 尝试使用React渲染
    if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
      var container = document.getElementById('app-content');
      if (container) {
        ReactDOM.render(React.createElement(ScenarioManagement), container);
        return;
      }
    }
    
    // 降级到原生DOM渲染
    var container = document.getElementById('app-content');
    if (!container) return;
    
    container.innerHTML = `
      <div class="scenario-management">
        <h2>情景管理</h2>
        <p>这是情景管理页面的兼容模式</p>
        <p>请使用现代浏览器以获得完整功能体验</p>
      </div>
    `;
  } catch (error) {
    console.error('渲染失败:', error);
  }
}

// 确保window.App.pages对象存在
if (!window.App) window.App = {};
if (!window.App.pages) window.App.pages = {};

// 注册组件到window.App.pages对象中
window.App.pages.ScenarioManagement = ScenarioManagement;
window.App.pages['scenario-management'] = ScenarioManagement;
window.App.pages['scenario_management'] = ScenarioManagement;
window.App.pages['情景管理'] = ScenarioManagement;

// 导出函数
window.renderScenarioManagement = renderScenarioManagement;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScenarioManagement;
}