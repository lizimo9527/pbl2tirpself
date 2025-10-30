// Supabase完整功能演示
const SUPABASE_URL = 'https://brcwdpcpgruzvbsohwat.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyY3dkcGNwZ3J1enZic29od2F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0Njg1NjIsImV4cCI6MjA3NjA0NDU2Mn0.2HquSawSHutiVM0hKaP8uHR0E2u0a5LW3xX6cq0ehIA'

class SupabaseDemo {
  constructor() {
    this.baseUrl = SUPABASE_URL
    this.headers = {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    }
  }

  // 测试连接
  async testConnection() {
    console.log('🔗 测试Supabase连接...')
    
    try {
      const response = await fetch(`${this.baseUrl}/rest/v1/`, {
        headers: this.headers
      })
      
      if (response.ok) {
        console.log('✅ Supabase连接成功')
        return true
      } else {
        console.log('❌ 连接失败，状态码:', response.status)
        return false
      }
    } catch (error) {
      console.log('❌ 连接错误:', error.message)
      return false
    }
  }

  // 获取数据库表信息
  async getTableInfo() {
    console.log('\n📊 获取数据库表信息...')
    
    const tables = ['users', 'travel_plans', 'plan_templates']
    
    for (const table of tables) {
      try {
        const response = await fetch(`${this.baseUrl}/rest/v1/${table}?limit=1`, {
          headers: this.headers
        })
        
        if (response.ok) {
          const data = await response.json()
          console.log(`✅ ${table}表 - 存在，数据量: ${data.length}`)
        } else if (response.status === 404) {
          console.log(`ℹ️  ${table}表 - 不存在`)
        } else {
          console.log(`❌ ${table}表 - 查询失败: ${response.status}`)
        }
      } catch (error) {
        console.log(`❌ ${table}表 - 查询错误: ${error.message}`)
      }
    }
  }

  // 创建示例数据
  async createSampleData() {
    console.log('\n📝 创建示例数据...')
    
    // 检查表是否存在
    const checkResponse = await fetch(`${this.baseUrl}/rest/v1/travel_plans?limit=1`, {
      headers: this.headers
    })
    
    if (checkResponse.status === 404) {
      console.log('ℹ️  表不存在，需要先执行数据库初始化脚本')
      return
    }
    
    // 创建示例攻略
    const samplePlan = {
      title: '北京三日文化探索之旅',
      description: '深度体验北京的历史文化，参观故宫、天坛等著名景点',
      destination: '北京',
      travel_style: '文化探索式',
      budget: 1500.00,
      status: 'published',
      is_public: true
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/rest/v1/travel_plans`, {
        method: 'POST',
        headers: {
          ...this.headers,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(samplePlan)
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ 示例攻略创建成功，ID:', data[0].id)
        return data[0]
      } else {
        console.log('❌ 数据创建失败:', response.status)
      }
    } catch (error) {
      console.log('❌ 数据创建错误:', error.message)
    }
  }

  // 查询数据
  async queryData() {
    console.log('\n🔍 查询数据...')
    
    try {
      // 查询攻略数据
      const response = await fetch(`${this.baseUrl}/rest/v1/travel_plans?select=*`, {
        headers: this.headers
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log(`📋 找到 ${data.length} 条攻略数据:`)
        
        data.forEach((plan, index) => {
          console.log(`${index + 1}. ${plan.title} - ${plan.destination} (${plan.travel_style})`)
        })
        
        return data
      } else {
        console.log('❌ 数据查询失败:', response.status)
      }
    } catch (error) {
      console.log('❌ 数据查询错误:', error.message)
    }
  }

  // 演示实时功能
  async demoRealtime() {
    console.log('\n⚡ 演示实时功能...')
    console.log('ℹ️  Supabase实时功能需要WebSocket连接')
    console.log('💡 可以通过Supabase客户端库实现实时数据同步')
  }

  // 演示认证功能
  async demoAuth() {
    console.log('\n🔐 演示认证功能...')
    console.log('ℹ️  Supabase Auth提供完整的用户认证系统')
    console.log('💡 支持邮箱登录、社交登录、手机验证等')
  }

  // 运行完整演示
  async runDemo() {
    console.log('🚀 Supabase完整功能演示开始\n')
    
    // 1. 测试连接
    const connected = await this.testConnection()
    if (!connected) {
      console.log('❌ 连接失败，无法继续演示')
      return
    }
    
    // 2. 获取表信息
    await this.getTableInfo()
    
    // 3. 创建示例数据
    await this.createSampleData()
    
    // 4. 查询数据
    await this.queryData()
    
    // 5. 演示其他功能
    await this.demoRealtime()
    await this.demoAuth()
    
    console.log('\n🎉 演示完成!')
    console.log('\n📋 下一步操作:')
    console.log('1. 在Supabase控制台执行 database/init.sql 创建完整表结构')
    console.log('2. 使用Supabase客户端库进行开发')
    console.log('3. 配置Row Level Security (RLS)策略')
    console.log('4. 测试实时数据同步功能')
  }
}

// 运行演示
const demo = new SupabaseDemo()
demo.runDemo().catch(console.error)