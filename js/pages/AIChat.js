// AI聊天页面组件 - 使用基础JavaScript语法实现
function AIChat({ onPageChange, currentPage }) {
  // 使用React hooks管理状态
  const useState = React.useState;
  const useEffect = React.useEffect;
  
  // 状态管理 - 保留9个与城市轨道交通协会相关的专业智能体
  const agentsState = useState([
    { id: '1', name: '城轨专家', description: '城市轨道交通综合知识咨询', welcomeMessage: '您好！我是城轨专家，为您提供城市轨道交通领域的专业知识咨询服务。' },
    { id: '2', name: '政策法规顾问', description: '城轨相关政策法规解读', welcomeMessage: '您好！我是政策法规顾问，专注于城市轨道交通领域的政策解读和法律咨询。' },
    { id: '3', name: '技术咨询专家', description: '轨道交通技术方案咨询', welcomeMessage: '欢迎！我是技术咨询专家，为您提供轨道交通工程技术、设备选型等专业建议。' },
    { id: '4', name: '安全管理顾问', description: '城轨安全运营管理咨询', welcomeMessage: '您好！我是安全管理顾问，专注于城市轨道交通的安全运营、应急管理和风险控制。' },
    { id: '5', name: '规划设计顾问', description: '轨道交通规划与设计咨询', welcomeMessage: '欢迎！我是规划设计顾问，为您提供城市轨道交通线网规划、站点设计等专业建议。' },
    { id: '6', name: '运营管理专家', description: '轨道交通运营优化建议', welcomeMessage: '您好！我是运营管理专家，专注于城市轨道交通的运营效率提升和服务质量优化。' },
    { id: '7', name: '标准规范专家', description: '城轨行业标准规范解读', welcomeMessage: '欢迎！我是标准规范专家，为您解读城市轨道交通领域的各项标准和规范要求。' },
    { id: '8', name: '绿色发展顾问', description: '轨道交通可持续发展咨询', welcomeMessage: '您好！我是绿色发展顾问，专注于城市轨道交通的节能减排、环保技术和可持续发展方案。' },
    { id: '9', name: '人才发展顾问', description: '城轨行业人才培养建议', welcomeMessage: '欢迎！我是人才发展顾问，为您提供城市轨道交通行业的人才培养、职业规划和团队建设建议。' }
  ]);
  const agents = agentsState[0];
  const setAgents = agentsState[1];
  
  // 移除了知识库和聊天历史相关的状态，因为不再需要这些功能
  
  const messagesState = useState([]);
  const messages = messagesState[0];
  const setMessages = messagesState[1];
  
  const inputMessageState = useState('');
  const inputMessage = inputMessageState[0];
  const setInputMessage = inputMessageState[1];
  
  const currentAgentState = useState(agents[0]);
  const currentAgent = currentAgentState[0];
  const setCurrentAgent = currentAgentState[1];
  
  const isLoadingState = useState(false);
  const isLoading = isLoadingState[0];
  const setIsLoading = isLoadingState[1];
  
  // 初始化时显示第一个智能体的欢迎语
  useEffect(function() {
    if (agents.length > 0 && agents[0].welcomeMessage) {
      const welcomeMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: agents[0].welcomeMessage,
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    }
  }, []);
  
  // 移除了loadChat函数，因为不再需要加载历史聊天记录
  
  // 发送消息
  function handleSendMessage() {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };
    
    // 添加用户消息到消息列表
    setMessages([].concat(messages, userMessage));
    setInputMessage('');
    setIsLoading(true);
    
    // 模拟AI回复
    setTimeout(function() {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '这是对您问题的回复：' + inputMessage + '\n\n感谢您的咨询！',
        timestamp: new Date().toISOString()
      };
      setMessages(function(prevMessages) {
        return [].concat(prevMessages, aiMessage);
      });
      setIsLoading(false);
    }, 1000);
  }
  
  // 移除了handleNewChat函数，因为不再需要新建对话功能
  
  // 渲染聊天消息
  function renderMessage(message) {
    const isUser = message.role === 'user';
    return React.createElement('div', {
      key: message.id,
      style: {
        display: 'flex',
        marginBottom: '16px',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        alignItems: 'flex-end'
      }
    },
      React.createElement('div', {
        style: {
          maxWidth: '70%',
          padding: '12px 16px',
          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px', // 优化气泡圆角
          backgroundColor: isUser ? '#409EFF' : '#ffffff',
          color: isUser ? 'white' : '#303133',
          boxShadow: isUser ? '0 1px 3px rgba(64, 158, 255, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
          wordWrap: 'break-word'
        }
      }, message.content)
    );
  }
  
  // 渲染智能体项
  function renderAgentItem(agent) {
    const isActive = agent.id === currentAgent.id;
    return React.createElement('div', {
      key: agent.id,
      onClick: function() { 
        setCurrentAgent(agent);
        // 切换智能体时清空消息并显示欢迎语
        const welcomeMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: agent.welcomeMessage,
          timestamp: new Date().toISOString()
        };
        setMessages([welcomeMessage]);
      },
      style: {
        padding: '12px',
        borderBottom: '1px solid #ebeef5',
        cursor: 'pointer',
        backgroundColor: isActive ? '#ecf5ff' : 'transparent'
      }
    },
      React.createElement('div', {
        style: {
          fontWeight: isActive ? 'bold' : 'normal',
          marginBottom: '4px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, agent.name),
      React.createElement('div', { style: { fontSize: '12px', color: '#909399' } }, agent.description)
    );
  }
  
  // 移除了createAgentOptions和createKnowledgeBaseOptions函数，因为不再需要这些选择器
  
  // 创建智能体列表项
  function createAgentItems() {
    var items = [];
    for (var i = 0; i < agents.length; i++) {
      items.push(renderAgentItem(agents[i]));
    }
    return items;
  }
  
  // 创建消息项
  function createMessageItems() {
    var items = [];
    for (var i = 0; i < messages.length; i++) {
      items.push(renderMessage(messages[i]));
    }
    return items;
  }
  
  // 移除了handleAgentChange函数，因为不再需要智能体选择器
  
  // 移除了handleKnowledgeBaseChange函数，因为不再需要知识库选择功能
  
  // 文本框onKeyPress处理函数
  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }
  
  // 主渲染函数
  var messageItems = createMessageItems();
  var agentItems = createAgentItems();
  
  // 移除了构建选择器的代码，因为不再需要这些选择器
  
  return React.createElement('div', {
    style: {
      display: 'flex',
      height: '100%',
      backgroundColor: '#f0f2f5'
    }
  },
    // 左侧智能体列表面板
    React.createElement('div', {
      style: {
        width: '300px',
        backgroundColor: 'white',
        borderRight: '1px solid #ebeef5',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative' // 确保左侧面板固定位置
      }
    },
      React.createElement('div', {
        style: {
          padding: '16px',
          borderBottom: '1px solid #ebeef5',
          fontWeight: 'bold',
          fontSize: '16px'
        }
      }, '智能体列表'),
      React.createElement('div', {
        style: {
          flex: 1,
          overflowY: 'auto'
        }
      },
        agentItems
      )
    ),
    
    // 右侧聊天内容区域 - 重新调整样式
    React.createElement('div', {
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f5f7fa',
        position: 'relative',
        borderLeft: '1px solid #ebeef5'
      }
    },
      // 简化的聊天标题区域
      React.createElement('div', {
        style: {
          padding: '16px',
          borderBottom: '1px solid #ebeef5',
          backgroundColor: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 100 // 确保头部在消息区域之上
        }
      },
        React.createElement('div', {
          style: {
            fontWeight: 'bold',
            fontSize: '16px',
            color: '#303133'
          }
        }, currentAgent ? currentAgent.name : 'AI助手')
      ),
      
      // 聊天消息区域
      React.createElement('div', {
        style: {
          flex: 1,
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f5f7fa'
        }
      },
        isLoading ? (
          React.createElement('div', {
            style: {
              padding: '12px',
              backgroundColor: '#f5f7fa',
              borderRadius: '8px',
              alignSelf: 'flex-start',
              maxWidth: '70%',
              fontStyle: 'italic',
              color: '#606266',
              margin: '16px 0'
            }
          }, 'AI正在回复中...')
        ) : messages.length > 0 ? (
          messageItems
        ) : (
          React.createElement('div', {
            style: {
              textAlign: 'center',
              color: '#909399',
              marginTop: '100px',
              fontSize: '16px'
            }
          }, '开始您的对话吧！')
        )
      ),
      

      
      // 输入区域
      React.createElement('div', {
        style: {
          padding: '16px',
          borderTop: '1px solid #ebeef5',
          backgroundColor: 'white',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end',
          boxShadow: '0 -1px 4px rgba(0, 0, 0, 0.05)'
        }
      },
        React.createElement('textarea', {
          value: inputMessage,
          onChange: function(e) { setInputMessage(e.target.value); },
          onKeyPress: handleKeyPress,
          placeholder: '输入消息... (Shift+Enter换行)',
          style: {
            flex: 1,
            padding: '12px 16px',
            border: '1px solid #dcdfe6',
            borderRadius: '16px', // 增加圆角效果
            resize: 'none',
            minHeight: '60px',
            maxHeight: '150px',
            fontSize: '14px',
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'border-color 0.3s'
          },
          onFocus: function(e) {
            e.target.style.borderColor = '#409EFF';
          },
          onBlur: function(e) {
            e.target.style.borderColor = '#dcdfe6';
          }
        }),
        React.createElement('button', {
          onClick: handleSendMessage,
          disabled: !inputMessage.trim() || isLoading,
          style: {
            padding: '8px 24px',
            backgroundColor: (!inputMessage.trim() || isLoading) ? '#f0f0f0' : '#409EFF', // 修改禁用状态颜色
            color: (!inputMessage.trim() || isLoading) ? '#c0c4cc' : 'white', // 修改禁用状态文字颜色
            border: 'none',
            borderRadius: '18px', // 增加圆角效果
            cursor: (!inputMessage.trim() || isLoading) ? 'not-allowed' : 'pointer',
            height: '40px',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.3s',
            boxShadow: (!inputMessage.trim() || isLoading) ? 'none' : '0 2px 4px rgba(64, 158, 255, 0.3)'
          },
          onMouseEnter: function(e) {
            if (!e.target.disabled) {
              e.target.style.backgroundColor = '#66b1ff';
            }
          },
          onMouseLeave: function(e) {
            if (!e.target.disabled) {
              e.target.style.backgroundColor = '#409EFF';
            }
          }
        }, '发送')
      )
    )
  );
}

// 注册页面组件
window.App.pages.AIChat = AIChat;
console.log('[AIChat] 组件挂载成功');