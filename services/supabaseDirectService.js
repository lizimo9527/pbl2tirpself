// Supabase直接REST API服务 - 无需访问令牌
const supabaseUrl = 'https://brcwdpcpgruzvbsohwat.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyY3dkcGNwZ3J1enZic29od2F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0Njg1NjIsImV4cCI6MjA3NjA0NDU2Mn0.2HquSawSHutiVM0hKaP8uHR0E2u0a5LW3xX6cq0ehIA'

// Supabase直接REST API服务
const supabaseDirectService = {
  
  // 基础请求方法
  async request(endpoint, options = {}) {
    const url = `${supabaseUrl}/rest/v1${endpoint}`
    
    const defaultOptions = {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    }
    
    const finalOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    }
    
    try {
      const response = await uni.request({
        url,
        ...finalOptions
      })
      
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return response.data
      } else {
        throw new Error(`HTTP ${response.statusCode}: ${response.errMsg}`)
      }
    } catch (error) {
      console.error('Supabase请求失败:', error)
      throw error
    }
  },
  
  // 检查表是否存在
  async checkTableExists(tableName) {
    try {
      await this.request(`/${tableName}?limit=1`)
      return true
    } catch (error) {
      if (error.message.includes('404') || error.message.includes('不存在')) {
        return false
      }
      throw error
    }
  },
  
  // 创建表（通过执行SQL）
  async createTables() {
    try {
      console.log('开始创建数据库表...')
      
      // 检查是否已存在表
      const tablesExist = await this.checkTableExists('users')
      
      if (tablesExist) {
        console.log('数据库表已存在，跳过创建')
        return { success: true, message: '表已存在' }
      }
      
      // 由于无法直接执行SQL，我们尝试插入数据来隐式创建表
      // 如果表不存在，插入操作会失败，但我们可以捕获错误
      
      // 尝试创建用户表
      try {
        await this.request('/users', {
          method: 'POST',
          data: {
            id: '00000000-0000-0000-0000-000000000000',
            email: 'test@tripself.com',
            username: '测试用户',
            created_at: new Date().toISOString()
          }
        })
      } catch (error) {
        console.log('用户表可能不存在，需要手动创建')
      }
      
      return { 
        success: false, 
        message: '需要手动在Supabase控制台执行SQL脚本来创建表' 
      }
      
    } catch (error) {
      console.error('创建表失败:', error)
      return { success: false, message: '创建表失败: ' + error.message }
    }
  },
  
  // 插入数据
  async insertData(tableName, data) {
    try {
      const result = await this.request(`/${tableName}`, {
        method: 'POST',
        data
      })
      
      console.log(`数据插入成功: ${tableName}`, result)
      return { success: true, data: result }
    } catch (error) {
      console.error(`插入数据失败 (${tableName}):`, error)
      
      // 如果表不存在，返回特定错误
      if (error.message.includes('404') || error.message.includes('不存在')) {
        return { 
          success: false, 
          message: `表 ${tableName} 不存在，请先在Supabase控制台创建表` 
        }
      }
      
      return { success: false, message: error.message }
    }
  },
  
  // 查询数据
  async selectData(tableName, conditions = '') {
    try {
      const endpoint = conditions ? `/${tableName}?${conditions}` : `/${tableName}`
      const result = await this.request(endpoint)
      
      return { success: true, data: result }
    } catch (error) {
      console.error(`查询数据失败 (${tableName}):`, error)
      
      // 如果表不存在，返回空数组
      if (error.message.includes('404') || error.message.includes('不存在')) {
        return { success: true, data: [] }
      }
      
      return { success: false, message: error.message }
    }
  },
  
  // 同步本地数据到Supabase
  async syncLocalDataToSupabase() {
    try {
      console.log('开始同步本地数据到Supabase...')
      
      // 首先检查表是否存在
      const tablesExist = await this.checkTableExists('users')
      
      if (!tablesExist) {
        return { 
          success: false, 
          message: '数据库表不存在，请先在Supabase控制台执行SQL脚本创建表' 
        }
      }
      
      let syncedCount = 0
      let errorCount = 0
      
      // 同步攻略数据
      const plans = uni.getStorageSync('travel_plans') || []
      for (const plan of plans) {
        try {
          const planData = {
            id: plan.id,
            title: plan.title,
            description: plan.description,
            destination: plan.destination,
            start_date: plan.start_date,
            end_date: plan.end_date,
            budget: parseFloat(plan.budget) || 0,
            travel_style: plan.travel_style,
            status: plan.status || 'draft',
            is_public: plan.is_public || false,
            created_at: plan.created_at || new Date().toISOString(),
            updated_at: plan.updated_at || new Date().toISOString()
          }
          
          await this.insertData('travel_plans', planData)
          syncedCount++
        } catch (error) {
          console.error('同步攻略数据失败:', error)
          errorCount++
        }
      }
      
      // 同步模板数据
      const templates = this.getLocalTemplates()
      for (const template of templates) {
        try {
          const templateData = {
            title: template.title,
            description: template.description,
            destination: template.destination,
            travel_style: template.travelStyle || template.travel_style,
            duration_days: template.durationDays || template.duration_days || 1,
            is_public: true,
            created_at: new Date().toISOString()
          }
          
          await this.insertData('plan_templates', templateData)
          syncedCount++
        } catch (error) {
          console.error('同步模板数据失败:', error)
          errorCount++
        }
      }
      
      console.log(`数据同步完成: 成功 ${syncedCount} 条, 失败 ${errorCount} 条`)
      
      return { 
        success: errorCount === 0, 
        message: `同步完成: 成功 ${syncedCount} 条, 失败 ${errorCount} 条`,
        syncedCount,
        errorCount
      }
      
    } catch (error) {
      console.error('数据同步失败:', error)
      return { success: false, message: '数据同步失败: ' + error.message }
    }
  },
  
  // 从Supabase获取数据
  async getDataFromSupabase() {
    try {
      console.log('从Supabase获取数据...')
      
      // 获取攻略数据
      const plansResult = await this.selectData('travel_plans', 'order=created_at.desc')
      
      // 获取模板数据
      const templatesResult = await this.selectData('plan_templates', 'order=created_at.desc')
      
      console.log('数据获取成功')
      
      return {
        success: true,
        data: {
          plans: plansResult.success ? plansResult.data : [],
          templates: templatesResult.success ? templatesResult.data : []
        }
      }
    } catch (error) {
      console.error('获取数据失败:', error)
      return {
        success: false,
        message: '获取数据失败: ' + error.message,
        data: { plans: [], templates: [] }
      }
    }
  },
  
  // 检查连接状态
  async checkConnection() {
    try {
      // 尝试查询一个简单的端点
      const result = await this.request('/')
      
      console.log('Supabase连接成功')
      return { success: true, message: '连接成功' }
    } catch (error) {
      console.error('Supabase连接失败:', error)
      
      // 检查具体的错误类型
      if (error.message.includes('404')) {
        return { success: true, message: '连接正常，但REST端点可能不存在' }
      }
      
      if (error.message.includes('401') || error.message.includes('403')) {
        return { success: false, message: '认证失败，请检查API密钥' }
      }
      
      return { success: false, message: '连接失败: ' + error.message }
    }
  },
  
  // 本地模板数据
  getLocalTemplates() {
    return [
      {
        id: 1,
        title: '河北文化深度游',
        description: '探索燕赵文化，感受千年历史底蕴',
        destination: '河北',
        durationDays: 5,
        travelStyle: '文化探索式',
        tags: ['承德避暑山庄', '山海关', '清东陵', '正定古城']
      },
      {
        id: 2,
        title: '长城精华之旅',
        description: '从山海关到金山岭，领略长城雄伟',
        destination: '河北',
        durationDays: 4,
        travelStyle: '特种兵式',
        tags: ['山海关', '老龙头', '金山岭', '司马台']
      },
      {
        id: 3,
        title: '坝上草原风光游',
        description: '驰骋草原，感受塞外风情',
        destination: '河北',
        durationDays: 3,
        travelStyle: '细品慢游式',
        tags: ['丰宁坝上', '张北草原', '骑马', '烤全羊']
      },
      {
        id: 4,
        title: '皇家园林休闲游',
        description: '承德避暑山庄，体验皇家园林艺术',
        destination: '河北',
        durationDays: 2,
        travelStyle: '拍照打卡式',
        tags: ['承德避暑山庄', '外八庙', '皇家园林', '摄影']
      },
      {
        id: 5,
        title: '太行山自然探索',
        description: '穿越太行山脉，领略北方山水之美',
        destination: '河北',
        durationDays: 4,
        travelStyle: '自然探索式',
        tags: ['野三坡', '白石山', '嶂石岩', '徒步']
      },
      {
        id: 6,
        title: '河北美食文化游',
        description: '品味河北特色美食，感受饮食文化',
        destination: '河北',
        durationDays: 3,
        travelStyle: '美食探索式',
        tags: ['驴肉火烧', '沧州火锅鸡', '保定驴肉', '特色小吃']
      }
    ]
  }
}

export default supabaseDirectService