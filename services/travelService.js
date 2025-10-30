// 创建新攻略的独立函数
async function createTravelPlan(planData) {
  try {
    // 模拟创建攻略
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
    
    // 保存到本地存储
    saveToLocalStorage('travel_plans', newPlan)
    
    return newPlan
  } catch (error) {
    console.error('创建攻略失败:', error)
    throw error
  }
}

// 获取攻略模板的独立函数
async function getTemplates() {
  try {
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
  } catch (error) {
    console.error('获取模板失败:', error)
    throw error
  }
}

// 保存到本地存储的通用方法
function saveToLocalStorage(key, newItem) {
  try {
    let items = uni.getStorageSync(key) || []
    items.push(newItem)
    uni.setStorageSync(key, items)
  } catch (error) {
    console.error('保存到本地存储失败:', error)
  }
}

// 获取用户的所有攻略的独立函数
async function getUserPlans() {
  try {
    // 从本地存储获取所有攻略
    const plans = uni.getStorageSync('travel_plans') || []
    
    // 按创建时间倒序排列
    return plans.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  } catch (error) {
    console.error('获取用户攻略失败:', error)
    throw error
  }
}

// 删除攻略的独立函数
async function deleteTravelPlan(planId) {
  try {
    let plans = uni.getStorageSync('travel_plans') || []
    plans = plans.filter(p => p.id !== planId)
    uni.setStorageSync('travel_plans', plans)
    
    // 删除关联数据
    uni.removeStorageSync(`plan_days_${planId}`)
    uni.removeStorageSync(`budget_items_${planId}`)
    
    return true
  } catch (error) {
    console.error('删除攻略失败:', error)
    throw error
  }
}

// 发布攻略的独立函数
async function publishPlan(planId) {
  try {
    let plans = uni.getStorageSync('travel_plans') || []
    const planIndex = plans.findIndex(p => p.id === planId)
    
    if (planIndex === -1) {
      throw new Error('攻略不存在')
    }
    
    // 更新攻略状态为已发布
    plans[planIndex] = {
      ...plans[planIndex],
      status: 'published',
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    // 保存回本地存储
    uni.setStorageSync('travel_plans', plans)
    
    return plans[planIndex]
  } catch (error) {
    console.error('发布攻略失败:', error)
    throw error
  }
}

// 获取攻略详情的独立函数
async function getTravelPlan(planId) {
  try {
    // 从本地存储获取攻略
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
  } catch (error) {
    console.error('获取攻略详情失败:', error)
    throw error
  }
}

// 更新攻略的独立函数
async function updateTravelPlan(planId, updateData) {
  try {
    // 从本地存储获取攻略
    let plans = uni.getStorageSync('travel_plans') || []
    const planIndex = plans.findIndex(p => p.id === planId)
    
    if (planIndex === -1) {
      throw new Error('攻略不存在')
    }
    
    // 更新攻略数据
    plans[planIndex] = {
      ...plans[planIndex],
      ...updateData,
      updated_at: new Date().toISOString()
    }
    
    // 保存回本地存储
    uni.setStorageSync('travel_plans', plans)
    
    return plans[planIndex]
  } catch (error) {
    console.error('更新攻略失败:', error)
    throw error
  }
}

// 添加行程天的独立函数
async function addPlanDay(planId, dayData) {
  try {
    const newDay = {
      id: Date.now().toString(),
      plan_id: planId,
      day_number: dayData.day_number,
      date: dayData.date,
      title: dayData.title,
      description: dayData.description,
      created_at: new Date().toISOString()
    }
    
    // 保存到本地存储
    saveToLocalStorage(`plan_days_${planId}`, newDay)
    
    return newDay
  } catch (error) {
    console.error('添加行程天失败:', error)
    throw error
  }
}

// 添加预算项的独立函数
async function addBudgetItem(planId, itemData) {
  try {
    const newItem = {
      id: Date.now().toString(),
      plan_id: planId,
      category: itemData.category,
      item_name: itemData.item_name,
      amount: itemData.amount,
      notes: itemData.notes,
      created_at: new Date().toISOString()
    }
    
    // 保存到本地存储
    saveToLocalStorage(`budget_items_${planId}`, newItem)
    
    return newItem
  } catch (error) {
    console.error('添加预算项失败:', error)
    throw error
  }
}

// 删除预算项的独立函数
async function deleteBudgetItem(planId, itemId) {
  try {
    let items = uni.getStorageSync(`budget_items_${planId}`) || []
    items = items.filter(item => item.id !== itemId)
    uni.setStorageSync(`budget_items_${planId}`, items)
    
    return true
  } catch (error) {
    console.error('删除预算项失败:', error)
    throw error
  }
}

// 计算总预算的独立函数
function calculateTotalBudget(planId) {
  try {
    const items = uni.getStorageSync(`budget_items_${planId}`) || []
    const total = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
    return total
  } catch (error) {
    console.error('计算总预算失败:', error)
    return 0
  }
}

// 攻略相关服务类（使用本地存储模拟数据库）
class TravelService {
  
  // 创建新攻略
  async createTravelPlan(planData) {
    try {
      // 模拟创建攻略
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
      
      // 保存到本地存储
      this.saveToLocalStorage('travel_plans', newPlan)
      
      return newPlan
    } catch (error) {
      console.error('创建攻略失败:', error)
      throw error
    }
  }
  
  // 获取攻略详情
  async getTravelPlan(planId) {
    try {
      // 从本地存储获取攻略
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
    } catch (error) {
      console.error('获取攻略详情失败:', error)
      throw error
    }
  }

  // 更新攻略
  async updateTravelPlan(planId, updateData) {
    try {
      // 从本地存储获取攻略
      let plans = uni.getStorageSync('travel_plans') || []
      const planIndex = plans.findIndex(p => p.id === planId)
      
      if (planIndex === -1) {
        throw new Error('攻略不存在')
      }
      
      // 更新攻略数据
      plans[planIndex] = {
        ...plans[planIndex],
        ...updateData,
        updated_at: new Date().toISOString()
      }
      
      // 保存回本地存储
      uni.setStorageSync('travel_plans', plans)
      
      return plans[planIndex]
    } catch (error) {
      console.error('更新攻略失败:', error)
      throw error
    }
  }

  // 获取用户的所有攻略
  async getUserPlans() {
    try {
      // 从本地存储获取所有攻略
      const plans = uni.getStorageSync('travel_plans') || []
      
      // 按创建时间倒序排列
      return plans.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } catch (error) {
      console.error('获取用户攻略失败:', error)
      throw error
    }
  }

  // 获取攻略模板
  async getTemplates() {
    try {
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
    } catch (error) {
      console.error('获取模板失败:', error)
      throw error
    }
  }

  // 添加行程天
  async addPlanDay(planId, dayData) {
    try {
      const newDay = {
        id: Date.now().toString(),
        plan_id: planId,
        day_number: dayData.day_number,
        date: dayData.date,
        title: dayData.title,
        description: dayData.description,
        created_at: new Date().toISOString()
      }
      
      // 保存到本地存储
      this.saveToLocalStorage(`plan_days_${planId}`, newDay)
      
      return newDay
    } catch (error) {
      console.error('添加行程天失败:', error)
      throw error
    }
  }

  // 添加行程项
  async addPlanItem(dayId, itemData) {
    try {
      const newItem = {
        id: Date.now().toString(),
        day_id: dayId,
        item_type: itemData.item_type,
        title: itemData.title,
        description: itemData.description,
        location: itemData.location,
        start_time: itemData.start_time,
        end_time: itemData.end_time,
        cost: itemData.cost || 0,
        notes: itemData.notes,
        order_index: itemData.order_index || 0,
        created_at: new Date().toISOString()
      }
      
      // 保存到本地存储
      this.saveToLocalStorage(`plan_items_${dayId}`, newItem)
      
      return newItem
    } catch (error) {
      console.error('添加行程项失败:', error)
      throw error
    }
  }

  // 添加预算项
  async addBudgetItem(planId, itemData) {
    try {
      const newItem = {
        id: Date.now().toString(),
        plan_id: planId,
        category: itemData.category,
        item_name: itemData.item_name,
        amount: itemData.amount,
        notes: itemData.notes,
        created_at: new Date().toISOString()
      }
      
      // 保存到本地存储
      this.saveToLocalStorage(`budget_items_${planId}`, newItem)
      
      return newItem
    } catch (error) {
      console.error('添加预算项失败:', error)
      throw error
    }
  }

  // 获取行程天
  async getPlanDays(planId) {
    try {
      return uni.getStorageSync(`plan_days_${planId}`) || []
    } catch (error) {
      console.error('获取行程天失败:', error)
      throw error
    }
  }

  // 获取行程项
  async getPlanItems(dayId) {
    try {
      return uni.getStorageSync(`plan_items_${dayId}`) || []
    } catch (error) {
      console.error('获取行程项失败:', error)
      throw error
    }
  }

  // 获取预算项
  async getBudgetItems(planId) {
    try {
      return uni.getStorageSync(`budget_items_${planId}`) || []
    } catch (error) {
      console.error('获取预算项失败:', error)
      throw error
    }
  }

  // 删除攻略
  async deleteTravelPlan(planId) {
    try {
      let plans = uni.getStorageSync('travel_plans') || []
      plans = plans.filter(p => p.id !== planId)
      uni.setStorageSync('travel_plans', plans)
      
      // 删除关联数据
      uni.removeStorageSync(`plan_days_${planId}`)
      uni.removeStorageSync(`budget_items_${planId}`)
      
      return true
    } catch (error) {
      console.error('删除攻略失败:', error)
      throw error
    }
  }

  // 保存到本地存储的通用方法
  saveToLocalStorage(key, newItem) {
    try {
      let items = uni.getStorageSync(key) || []
      items.push(newItem)
      uni.setStorageSync(key, items)
    } catch (error) {
      console.error('保存到本地存储失败:', error)
    }
  }

  // 从模板生成攻略的详细内容
  async generatePlanFromTemplate(templateId, planId) {
    try {
      // 根据模板ID生成对应的行程安排
      const templateData = {
        1: this.generateCultureTemplate(),
        2: this.generateGreatWallTemplate(),
        3: this.generateGrasslandTemplate(),
        4: this.generateImperialGardenTemplate(),
        5: this.generateMountainTemplate(),
        6: this.generateFoodTemplate()
      }
      
      const template = templateData[templateId]
      if (!template) return
      
      // 生成行程天和行程项
      for (const dayData of template.days) {
        const day = await this.addPlanDay(planId, dayData)
        
        for (const itemData of dayData.items) {
          await this.addPlanItem(day.id, itemData)
        }
      }
      
      // 生成预算项
      for (const budgetData of template.budgets) {
        await this.addBudgetItem(planId, budgetData)
      }
      
    } catch (error) {
      console.error('从模板生成攻略失败:', error)
    }
  }

  // 河北文化深度游模板
  generateCultureTemplate() {
    return {
      days: [
        {
          day_number: 1,
          title: '承德避暑山庄',
          description: '游览世界文化遗产避暑山庄',
          items: [
            { item_type: '景点', title: '避暑山庄', location: '承德市', start_time: '09:00', end_time: '12:00', cost: 120 },
            { item_type: '餐饮', title: '承德特色午餐', location: '承德市区', start_time: '12:30', end_time: '13:30', cost: 80 },
            { item_type: '景点', title: '外八庙', location: '承德市', start_time: '14:00', end_time: '17:00', cost: 80 }
          ]
        },
        {
          day_number: 2,
          title: '山海关长城',
          description: '游览天下第一关山海关',
          items: [
            { item_type: '交通', title: '前往山海关', location: '承德-山海关', start_time: '08:00', end_time: '11:00', cost: 100 },
            { item_type: '景点', title: '山海关', location: '秦皇岛市', start_time: '11:30', end_time: '15:00', cost: 50 },
            { item_type: '景点', title: '老龙头', location: '秦皇岛市', start_time: '15:30', end_time: '17:30', cost: 50 }
          ]
        }
      ],
      budgets: [
        { category: '交通', item_name: '往返车费', amount: 500 },
        { category: '住宿', item_name: '3晚酒店', amount: 600 },
        { category: '餐饮', item_name: '每日餐饮', amount: 400 },
        { category: '门票', item_name: '景点门票', amount: 300 }
      ]
    }
  }

  // 其他模板生成方法（简化版）
  generateGreatWallTemplate() {
    return { days: [], budgets: [] }
  }
  
  generateGrasslandTemplate() {
    return { days: [], budgets: [] }
  }
  
  generateImperialGardenTemplate() {
    return { days: [], budgets: [] }
  }
  
  generateMountainTemplate() {
    return { days: [], budgets: [] }
  }
  
  generateFoodTemplate() {
    return { days: [], budgets: [] }
  }
}

// 导出函数
export {
  createTravelPlan,
  getTemplates,
  getUserPlans,
  deleteTravelPlan,
  publishPlan,
  getTravelPlan,
  updateTravelPlan,
  addPlanDay,
  addBudgetItem,
  deleteBudgetItem,
  calculateTotalBudget
}