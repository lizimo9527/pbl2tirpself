// Supabase数据同步服务
import supabase from '../utils/supabase.js'

// 数据同步服务
const supabaseSyncService = {
  
  // 同步本地数据到Supabase
  async syncLocalDataToSupabase() {
    try {
      console.log('开始同步本地数据到Supabase...')
      
      // 同步用户数据
      await this.syncUserData()
      
      // 同步攻略数据
      await this.syncTravelPlans()
      
      // 同步模板数据
      await this.syncTemplates()
      
      console.log('数据同步完成')
      return { success: true, message: '数据同步成功' }
    } catch (error) {
      console.error('数据同步失败:', error)
      return { success: false, message: '数据同步失败: ' + error.message }
    }
  },
  
  // 同步用户数据
  async syncUserData() {
    try {
      const userInfo = uni.getStorageSync('userInfo')
      if (userInfo && userInfo.id) {
        // 检查用户是否已存在
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', userInfo.id)
          .single()
        
        if (!existingUser) {
          // 创建新用户
          const userData = {
            id: userInfo.id,
            email: userInfo.email || `${userInfo.id}@tripself.com`,
            username: userInfo.username || `用户${userInfo.id}`,
            avatar_url: userInfo.avatar || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          
          await supabase.from('users').insert(userData)
          console.log('用户数据同步成功:', userInfo.id)
        }
      }
    } catch (error) {
      console.error('同步用户数据失败:', error)
    }
  },
  
  // 同步攻略数据
  async syncTravelPlans() {
    try {
      const plans = uni.getStorageSync('travel_plans') || []
      
      for (const plan of plans) {
        // 检查攻略是否已存在
        const { data: existingPlan } = await supabase
          .from('travel_plans')
          .select('id')
          .eq('id', plan.id)
          .single()
        
        if (!existingPlan) {
          // 创建新攻略
          const planData = {
            id: plan.id,
            user_id: plan.user_id || '00000000-0000-0000-0000-000000000000', // 默认用户ID
            title: plan.title,
            description: plan.description,
            destination: plan.destination,
            start_date: plan.start_date,
            end_date: plan.end_date,
            budget: parseFloat(plan.budget) || 0,
            travel_style: plan.travel_style,
            cover_image: plan.cover_image || null,
            status: plan.status || 'draft',
            is_public: plan.is_public || false,
            created_at: plan.created_at || new Date().toISOString(),
            updated_at: plan.updated_at || new Date().toISOString()
          }
          
          await supabase.from('travel_plans').insert(planData)
          console.log('攻略数据同步成功:', plan.id)
        }
      }
    } catch (error) {
      console.error('同步攻略数据失败:', error)
    }
  },
  
  // 同步模板数据
  async syncTemplates() {
    try {
      // 获取本地模板数据
      const templates = await this.getLocalTemplates()
      
      for (const template of templates) {
        // 检查模板是否已存在
        const { data: existingTemplate } = await supabase
          .from('plan_templates')
          .select('id')
          .eq('title', template.title)
          .single()
        
        if (!existingTemplate) {
          // 创建新模板
          const templateData = {
            title: template.title,
            description: template.description,
            destination: template.destination,
            travel_style: template.travelStyle || template.travel_style,
            duration_days: template.durationDays || template.duration_days || 1,
            cover_image: template.cover_image || null,
            is_public: true,
            created_at: new Date().toISOString()
          }
          
          await supabase.from('plan_templates').insert(templateData)
          console.log('模板数据同步成功:', template.title)
        }
      }
    } catch (error) {
      console.error('同步模板数据失败:', error)
    }
  },
  
  // 获取本地模板数据
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
  },
  
  // 从Supabase获取数据
  async getDataFromSupabase() {
    try {
      console.log('从Supabase获取数据...')
      
      // 获取攻略数据
      const { data: plans, error: plansError } = await supabase
        .from('travel_plans')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (plansError) throw plansError
      
      // 获取模板数据
      const { data: templates, error: templatesError } = await supabase
        .from('plan_templates')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (templatesError) throw templatesError
      
      console.log('数据获取成功')
      return {
        success: true,
        data: {
          plans: plans || [],
          templates: templates || []
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
  
  // 检查Supabase连接状态
  async checkConnection() {
    try {
      const { data, error } = await supabase.from('travel_plans').select('count')
      
      if (error) {
        console.error('Supabase连接失败:', error)
        return { success: false, message: '连接失败: ' + error.message }
      }
      
      console.log('Supabase连接成功')
      return { success: true, message: '连接成功' }
    } catch (error) {
      console.error('连接检查失败:', error)
      return { success: false, message: '连接检查失败: ' + error.message }
    }
  }
}

export default supabaseSyncService