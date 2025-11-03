// 测试uni.request在小程序环境中的行为
const baseURL = 'https://dify.aipfuture.com';
const apiKey = 'app-6UqCYRfGzqiHTOgS9JB5wq4Z';

// 模拟uni.request函数
const uni = {
  request: function(options) {
    return new Promise((resolve, reject) => {
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
      
      // 发送数据
      if (options.data) {
        xhr.send(JSON.stringify(options.data));
      } else {
        xhr.send();
      }
    });
  }
};

async function testUniRequest() {
  console.log('🔍 测试uni.request在小程序环境中的行为...');
  
  const requestData = {
    inputs: {},
    query: '你好，请介绍一下北京三日游的行程安排',
    response_mode: 'blocking',
    user: 'mini-program-user-' + Date.now(),
    conversation_id: null,
    files: []
  };

  try {
    console.log('📡 使用uni.request发送请求...');
    
    const response = await uni.request({
      url: `${baseURL}/v1/chat-messages`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      data: requestData
    });
    
    console.log('响应状态码:', response.statusCode);
    
    if (response.statusCode === 200) {
      console.log('✅ uni.request请求成功！');
      console.log('响应数据:', JSON.stringify(response.data, null, 2));
    } else {
      console.log('❌ uni.request请求失败，状态码:', response.statusCode);
    }
    
  } catch (error) {
    console.log('❌ uni.request请求异常:', error.message);
  }
}

// 运行测试
testUniRequest();