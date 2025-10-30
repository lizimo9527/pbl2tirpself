// 旅行攻略服务 - 支持Supabase数据库操作
import supabase from '../utils/supabase.js'

// 旅行攻略服务
const travelService = {
  
  // 配置：是否使用Supabase
  useSupabase: true,
  
  // 创建新攻略
  async createTravelPlan(planData) {
    try {
      if (this.useSupabase) {
        // 使用Supabase创建攻略
        const newPlan = {
          title: planData.title,
          description: planData.description,
          destination: planData.destination,
          start_date: planData.start_date,
          end_date: planData.end_date,
          budget: parseFloat(planData.budget) || 0,
          travel_style: planData.travel_style,
          status: 'draft',
          is_public: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        const { data, error } = await supabase
          .from('travel_plans')
          .insert(newPlan)
          .select()
        
        if (error) throw error
        
        // 同时保存到本地存储作为缓存
        this.saveToLocalStorage('travel_plans', data[0])
        
        return data[0]
      } else {
        // 使用本地存储
        const newPlan = {
          id: Date.now().toString(),
          title: planData.title,
          description: planData.description,
          destination: planData.destination,
          start_date: planData.start_date,
          end_date: planData.end_date,
          budget: planData.budget || 0,
          travel_style: planData.travel_style,
          status: 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          templateId: planData.templateId,
          templateData: planData.templateData
        }
        
        this.saveToLocalStorage('travel_plans', newPlan)
        return newPlan
      }
    } catch (error) {
      console.error('创建攻略失败:', error)
      throw error
    }
  },
  
  // 获取所有攻略
  async getAllTravelPlans() {
    try {
      if (this.useSupabase) {
        // 从Supabase获取攻略
        const { data, error } = await supabase
          .from('travel_plans')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        
        // 更新本地缓存
        if (data && data.length > 0) {
          uni.setStorageSync('travel_plans', data)
        }
        
        return data || []
      } else {
        // 从本地存储获取攻略
        const plans = uni.getStorageSync('travel_plans') || []
        return plans.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      }
    } catch (error) {
      console.error('获取攻略失败:', error)
      
      // 如果Supabase失败，回退到本地存储
      if (this.useSupabase) {
        console.log('回退到本地存储获取攻略')
        const plans = uni.getStorageSync('travel_plans') || []
        return plans.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      }
      
      throw error
    }
  },
  
  // 获取单个攻略详情
  async getTravelPlanById(planId) {
    try {
      if (this.useSupabase) {
        // 从Supabase获取攻略详情
        const { data, error } = await supabase
          .from('travel_plans')
          .select('*')
          .eq('id', planId)
          .single()
        
        if (error) throw error
        
        return data
      } else {
        // 从本地存储获取攻略详情
        const plans = uni.getStorageSync('travel_plans') || []
        const plan = plans.find(p => p.id === planId)
        
        if (!plan) {
          throw new Error('攻略不存在')
        }
        
        // 获取关联数据（模拟）
        const planDays = uni.getStorageSync(`plan_days_${planId}`) || []
        const budgetItems = uni.getStorageSync(`budget_items_${planId}`) || []
        
        return {
          ...plan,
          plan_days: planDays,
          budget_items: budgetItems
        }
      }
    } catch (error) {
      console.error('获取攻略详情失败:', error)
      
      // 如果Supabase失败，回退到本地存储
      if (this.useSupabase) {
        console.log('回退到本地存储获取攻略详情')
        const plans = uni.getStorageSync('travel_plans') || []
        const plan = plans.find(p => p.id === planId)
        
        if (plan) {
          const planDays = uni.getStorageSync(`plan_days_${planId}`) || []
          const budgetItems = uni.getStorageSync(`budget_items_${planId}`) || []
          
          return {
            ...plan,
            plan_days: planDays,
            budget_items: budgetItems
          }
        }
      }
      
      throw error
    }
  },
  
  // 更新攻略
  async updateTravelPlan(planId, updateData) {
    try {
      if (this.useSupabase) {
        // 更新Supabase中的攻略
        const { data, error } = await supabase
          .from('travel_plans')
          .update({
            ...updateData,
            updated_at: new Date().toISOString()
          })
          .eq('id', planId)
          .select()
        
        if (error) throw error
        
        // 更新本地缓存
        if (data && data.length > 0) {
          this.updateLocalPlan(planId, data[0])
        }
        
        return data[0]
      } else {
        // 更新本地存储中的攻略
        let plans = uni.getStorageSync('travel_plans') || []
        const planIndex = plans.findIndex(p => p.id === planId)
        
        if (planIndex === -1) {
          throw new Error('攻略不存在')
        }
        
        plans[planIndex] = {
          ...plans[planIndex],
          ...updateData,
          updated_at: new Date().toISOString()
        }
        
        uni.setStorageSync('travel_plans', plans)
        return plans[planIndex]
      }
    } catch (error) {
      console.error('更新攻略失败:', error)
      throw error
    }
  },
  
  // 删除攻略
  async deleteTravelPlan(planId) {
    try {
      if (this.useSupabase) {
        // 从Supabase删除攻略
        const { error } = await supabase
          .from('travel_plans')
          .delete()
          .eq('id', planId)
        
        if (error) throw error
        
        // 从本地缓存删除
        this.deleteLocalPlan(planId)
        
        return true
      } else {
        // 从本地存储删除攻略
        let plans = uni.getStorageSync('travel_plans') || []
        plans = plans.filter(p => p.id !== planId)
        uni.setStorageSync('travel_plans', plans)
        
        // 删除关联数据
        uni.removeStorageSync(`plan_days_${planId}`)
        uni.removeStorageSync(`budget_items_${planId}`)
        
        return true
      }
    } catch (error) {
      console.error('删除攻略失败:', error)
      throw error
    }
  },
  
  // 发布攻略
  async publishPlan(planId) {
    return this.updateTravelPlan(planId, { status: 'published' })
  },
  
  // 获取攻略模板
  async getTemplates() {
    try {
      if (this.useSupabase) {
        // 从Supabase获取模板
        const { data, error } = await supabase
          .from('plan_templates')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        
        return data || []
      } else {
        // 返回预定义的河北攻略模板
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
    } catch (error) {
      console.error('获取模板失败:', error)
      
      // 如果Supabase失败，回退到本地模板
      if (this.useSupabase) {
        console.log('回退到本地模板')
        return this.getLocalTemplates()
      }
      
      throw error
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
  },
  
  // 本地存储辅助方法
  saveToLocalStorage(key, newItem) {
    try {
      let items = uni.getStorageSync(key) || []
      items.push(newItem)
      uni.setStorageSync(key, items)
    } catch (error) {
      console.error('保存到本地存储失败:', error)
    }
  },
  
  updateLocalPlan(planId, updatedPlan) {
    try {
      let plans = uni.getStorageSync('travel_plans') || []
      const planIndex = plans.findIndex(p => p.id === planId)
      
      if (planIndex !== -1) {
        plans[planIndex] = updatedPlan
        uni.setStorageSync('travel_plans', plans)
      }
    } catch (error) {
      console.error('更新本地攻略失败:', error)
    }
  },
  
  deleteLocalPlan(planId) {
    try {
      let plans = uni.getStorageSync('travel_plans') || []
      plans = plans.filter(p => p.id !== planId)
      uni.setStorageSync('travel_plans', plans)
      
      // 删除关联数据
      uni.removeStorageSync(`plan_days_${planId}`)
      uni.removeStorageSync(`budget_items_${planId}`)
    } catch (error) {
      console.error('删除本地攻略失败:', error)
    }
  },
  
  // 切换数据库模式
  toggleDatabaseMode(useSupabase) {
    this.useSupabase = useSupabase
    console.log(`切换到${useSupabase ? 'Supabase' : '本地存储'}模式`)
  }
}

export default travelService