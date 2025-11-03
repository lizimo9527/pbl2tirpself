// 调试Dify API 400错误
const baseURL = 'https://dify.aipfuture.com';
const apiKey = 'app-6UqCYRfGzqiHTOgS9JB5wq4Z';

async function debugDifyAPI() {
  console.log('🔍 开始调试Dify API 400错误...');
  
  // 测试不同的请求格式
  const testCases = [
    {
      name: '方式1: 当前代码格式',
      data: {
        inputs: {},
        query: '你好，请介绍一下北京三日游的行程安排',
        response_mode: 'blocking',
        user: 'mini-program-user-' + Date.now(),
        conversation_id: null,
        files: []
      }
    },
    {
      name: '方式2: 简化格式',
      data: {
        inputs: {},
        query: '你好，请介绍一下北京三日游的行程安排',
        response_mode: 'blocking',
        user: 'mini-program-user-' + Date.now()
      }
    },
    {
      name: '方式3: 流式响应',
      data: {
        inputs: {},
        query: '你好，请介绍一下北京三日游的行程安排',
        response_mode: 'streaming',
        user: 'mini-program-user-' + Date.now(),
        conversation_id: null
      }
    },
    {
      name: '方式4: 带应用ID',
      data: {
        inputs: {},
        query: '你好，请介绍一下北京三日游的行程安排',
        response_mode: 'blocking',
        user: 'mini-program-user-' + Date.now(),
        conversation_id: null
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📋 测试: ${testCase.name}`);
    console.log('请求数据:', JSON.stringify(testCase.data, null, 2));
    
    try {
      const response = await fetch(`${baseURL}/v1/chat-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(testCase.data)
      });
      
      console.log('响应状态码:', response.status);
      
      if (response.ok) {
        console.log('✅ 请求成功！');
        const data = await response.text();
        console.log('响应内容:', data.substring(0, 200) + '...');
      } else {
        console.log('❌ 请求失败，状态码:', response.status);
        const errorText = await response.text();
        console.log('错误信息:', errorText);
      }
      
    } catch (error) {
      console.log('❌ 请求异常:', error.message);
    }
    
    // 等待1秒再进行下一个测试
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// 运行调试
debugDifyAPI();