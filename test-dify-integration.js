// Dify AI 集成测试脚本
const difyChatService = require('./services/difyChatService.js');

async function testDifyIntegration() {
  console.log('🚀 开始测试 Dify AI 集成...\n');
  
  // 测试用例
  const testCases = [
    '我想去云南大理丽江玩5天，预算8000元',
    '带家人去北京旅游，有老人小孩，行程要轻松',
    '周末去杭州西湖周边，喜欢自然风光和美食',
    '你好，请帮我规划一个旅行路线'
  ];
  
  for (let i = 0; i < testCases.length; i++) {
    const testMessage = testCases[i];
    console.log(`📝 测试用例 ${i + 1}: "${testMessage}"`);
    
    try {
      const result = await difyChatService.sendMessage(testMessage);
      
      if (result.success) {
        console.log('✅ AI回复成功');
        console.log(`💬 回复内容: ${result.content.substring(0, 100)}...`);
        
        if (result.travelInfo && result.travelInfo.destination) {
          console.log(`📍 提取的目的地: ${result.travelInfo.destination}`);
        }
      } else {
        console.log('❌ AI回复失败');
        console.log(`💬 备用回复: ${result.content.substring(0, 100)}...`);
      }
    } catch (error) {
      console.log('❌ 测试失败:', error.message);
    }
    
    console.log('---\n');
    
    // 等待一下避免请求过快
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('🎉 Dify AI 集成测试完成！');
}

// 运行测试
testDifyIntegration().catch(console.error);