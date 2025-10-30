// Supabase MCP Server功能测试脚本
const supabaseUrl = 'https://brcwdpcpgruzvbsohwat.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyY3dkcGNwZ3J1enZic29od2F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0Njg1NjIsImV4cCI6MjA3NjA0NDU2Mn0.2HquSawSHutiVM0hKaP8uHR0E2u0a5LW3xX6cq0ehIA'

// 测试Supabase REST API连接
async function testSupabaseConnection() {
  console.log('🔗 测试Supabase连接...')
  
  try {
    // 测试REST API连接
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    })
    
    if (response.ok) {
      console.log('✅ Supabase REST API连接成功')
      return true
    } else {
      console.log('❌ Supabase REST API连接失败:', response.status)
      return false
    }
  } catch (error) {
    console.log('❌ 连接测试出错:', error.message)
    return false
  }
}

// 测试数据库表查询
async function testDatabaseTables() {
  console.log('\n📊 测试数据库表查询...')
  
  try {
    // 查询数据库表结构
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    })
    
    if (response.ok) {
      console.log('✅ 数据库连接正常')
      
      // 尝试查询用户表
      const usersResponse = await fetch(`${supabaseUrl}/rest/v1/users?limit=1`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      })
      
      if (usersResponse.ok) {
        console.log('✅ 用户表查询成功')
      } else if (usersResponse.status === 404) {
        console.log('ℹ️  用户表不存在，需要创建数据库表结构')
      } else {
        console.log('❌ 用户表查询失败:', usersResponse.status)
      }
      
      return true
    } else {
      console.log('❌ 数据库连接失败:', response.status)
      return false
    }
  } catch (error) {
    console.log('❌ 数据库查询出错:', error.message)
    return false
  }
}

// 测试数据插入
async function testDataInsertion() {
  console.log('\n📝 测试数据插入...')
  
  try {
    // 测试插入示例数据
    const testData = {
      title: '测试攻略',
      description: '这是一个测试攻略',
      destination: '测试城市',
      status: 'draft',
      is_public: false
    }
    
    const response = await fetch(`${supabaseUrl}/rest/v1/travel_plans`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(testData)
    })
    
    if (response.ok) {
      console.log('✅ 数据插入成功')
      return true
    } else if (response.status === 404) {
      console.log('ℹ️  表不存在，需要先创建数据库表结构')
      return false
    } else {
      console.log('❌ 数据插入失败:', response.status)
      return false
    }
  } catch (error) {
    console.log('❌ 数据插入出错:', error.message)
    return false
  }
}

// 主测试函数
async function runTests() {
  console.log('🚀 开始Supabase MCP Server功能测试\n')
  
  // 测试连接
  const connectionTest = await testSupabaseConnection()
  
  if (connectionTest) {
    // 测试数据库表
    await testDatabaseTables()
    
    // 测试数据插入
    await testDataInsertion()
  }
  
  console.log('\n📋 测试完成')
  console.log('\n💡 下一步建议:')
  console.log('1. 在Supabase控制台执行 database/init.sql 创建表结构')
  console.log('2. 使用MCP Server工具进行数据库操作')
  console.log('3. 测试数据同步功能')
}

// 运行测试
runTests().catch(console.error)