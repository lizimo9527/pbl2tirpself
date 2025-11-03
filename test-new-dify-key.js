// 测试新的Dify API密钥
const baseURL = 'https://dify.aipfuture.com';
const apiKey = 'app-6UqCYRfGzqiHTOgS9JB5wq4Z';

async function testDifyAPI() {
  console.log('🚀 开始测试新的Dify API密钥...');
  console.log('API密钥:', apiKey);
  
  const testData = {
    inputs: {},
    query: '你好，请介绍一下北京三日游的行程安排',
    response_mode: 'streaming',
    user: 'test-user-123'
  };

  try {
    console.log('\n📡 发送测试请求到Dify API...');
    
    // 使用fetch API发送请求
    const response = await fetch(`${baseURL}/v1/chat-messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(testData)
    });
    
    console.log('响应状态码:', response.status);
    
    if (response.ok) {
      console.log('✅ API认证成功！');
      const data = await response.json();
      console.log('响应数据:', JSON.stringify(data, null, 2));
    } else if (response.status === 401) {
      console.log('❌ API认证失败：无效的API密钥');
      console.log('响应信息:', await response.text());
    } else {
      console.log('⚠️ 其他错误，状态码:', response.status);
      console.log('响应信息:', await response.text());
    }
    
  } catch (error) {
    console.log('❌ 请求失败:', error.message);
  }
}

// 运行测试
testDifyAPI();