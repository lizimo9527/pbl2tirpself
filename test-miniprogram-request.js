// 测试小程序环境中的uni.request行为
const baseURL = 'https://dify.aipfuture.com';
const apiKey = 'app-6UqCYRfGzqiHTOgS9JB5wq4Z';

// 模拟小程序环境中的uni.request
const uni = {
  request: function(options) {
    return new Promise((resolve, reject) => {
      console.log('📡 uni.request调用信息:');
      console.log('URL:', options.url);
      console.log('Method:', options.method);
      console.log('Headers:', options.header);
      console.log('Data:', options.data);
      console.log('Data Type:', typeof options.data);
      
      // 模拟小程序中的实际行为
      const xhr = new XMLHttpRequest();
      xhr.open(options.method || 'GET', options.url);
      
      // 设置请求头
      if (options.header) {
        for (const [key, value] of Object.entries(options.header)) {
          xhr.setRequestHeader(key, value);
        }
      }
      
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          console.log('📥 响应状态码:', xhr.status);
          console.log('响应头:', xhr.getAllResponseHeaders());
          console.log('响应体:', xhr.responseText.substring(0, 200) + '...');
          
          const response = {
            statusCode: xhr.status,
            data: xhr.responseText,
            header: xhr.getAllResponseHeaders()
          };
          
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              response.data = JSON.parse(xhr.responseText);
            } catch (e) {
              // 保持为文本
            }
            resolve(response);
          } else {
            reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
          }
        }
      };
      
      xhr.onerror = function() {
        reject(new Error('Network error'));
      };
      
      // 发送数据 - 模拟小程序的实际序列化行为
      let requestBody;
      if (typeof options.data === 'string') {
        // 如果已经是字符串，直接发送
        requestBody = options.data;
      } else {
        // 如果是对象，自动序列化
        requestBody = JSON.stringify(options.data);
      }
      
      console.log('📤 实际发送的数据:', requestBody);
      xhr.send(requestBody);
    });
  }
};

async function testMiniProgramRequest() {
  console.log('🔍 测试小程序环境中的uni.request行为...');
  
  const requestData = {
    inputs: {},
    query: '石家庄三天',
    response_mode: 'blocking',
    user: 'mini-program-user-1762156618243',
    conversation_id: 'conv_1762156618242_qlz8bxslw',
    files: []
  };

  console.log('📋 测试用例 - 直接传递对象:');
  try {
    const response = await uni.request({
      url: `${baseURL}/v1/chat-messages`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      data: requestData // 直接传递对象
    });
    
    console.log('✅ 请求成功，状态码:', response.statusCode);
  } catch (error) {
    console.log('❌ 请求失败:', error.message);
  }

  console.log('\n📋 测试用例 - 手动序列化:');
  try {
    const response = await uni.request({
      url: `${baseURL}/v1/chat-messages`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      data: JSON.stringify(requestData) // 手动序列化
    });
    
    console.log('✅ 请求成功，状态码:', response.statusCode);
  } catch (error) {
    console.log('❌ 请求失败:', error.message);
  }
}

// 运行测试
testMiniProgramRequest();