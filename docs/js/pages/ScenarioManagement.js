// 超简单版本 - 只有几行代码
function renderScenarioManagement() {
  console.log('超简单版本渲染');
}

// 导出函数
window.renderScenarioManagement = renderScenarioManagement;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = renderScenarioManagement;
}