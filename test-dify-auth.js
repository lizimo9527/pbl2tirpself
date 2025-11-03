// Dify API认证测试脚本
const testDifyAuth = async () => {
  console.log('开始测试Dify API认证...');
  
  const baseURL = 'https://dify.aipfuture.com';
  const apiKey = 'app-1i1suD6MWKtMYQuq';
  
  // 测试请求数据
  const testData = {
    inputs: {},
    query: '你好，请介绍一下北京旅游',
    response_mode: 'blocking',
    user: 'test-user-' + Date.now(),
    conversation_id: 'test-conv-' + Date.now()
  };
  
  try {
    console.log('发送请求到Dify API...');
    console.log('URL:', `${baseURL}/v1/chat-messages`);
    console.log('API Key:', apiKey);
    
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
    console.log('响应状态文本:', response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('API响应成功:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('API响应错误:', errorText);
      
      // 尝试不同的认证方式
      console.log('\n尝试不同的认证方式...');
      
      // 方式1: 不使用认证
      console.log('\n方式1: 不使用认证');
      const response1 = await fetch(`${baseURL}/v1/chat-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });
      console.log('响应状态码:', response1.status);
      
      // 方式2: 使用不同的API密钥格式
      console.log('\n方式2: 使用不同的API密钥格式');
      const response2 = await fetch(`${baseURL}/v1/chat-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 1i1suD6MWKtMYQuq'
        },
        body: JSON.stringify(testData)
      });
      console.log('响应状态码:', response2.status);
      
      // 方式3: 使用API密钥作为查询参数
      console.log('\n方式3: 使用API密钥作为查询参数');
      const response3 = await fetch(`${baseURL}/v1/chat-messages?api_key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });
      console.log('响应状态码:', response3.status);
    }
    
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
};

// 运行测试
testDifyAuth();