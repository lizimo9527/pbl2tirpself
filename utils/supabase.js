// Supabase REST API配置
const supabaseUrl = 'https://brcwdpcpgruzvbsohwat.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyY3dkcGNwZ3J1enZic29od2F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0Njg1NjIsImV4cCI6MjA3NjA0NDU2Mn0.2HquSawSHutiVM0hKaP8uHR0E2u0a5LW3xX6cq0ehIA'

// Supabase REST API封装
const supabase = {
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
  
  // 查询数据
  async from(table) {
    return {
      select: (columns = '*') => supabase.request(`/${table}?select=${columns}`),
      
      insert: (data) => supabase.request(`/${table}`, {
        method: 'POST',
        data
      }),
      
      update: (data, conditions = '') => supabase.request(`/${table}?${conditions}`, {
        method: 'PATCH',
        data
      }),
      
      delete: (conditions = '') => supabase.request(`/${table}?${conditions}`, {
        method: 'DELETE'
      }),
      
      eq: (column, value) => `${column}=eq.${value}`,
      
      neq: (column, value) => `${column}=neq.${value}`,
      
      gt: (column, value) => `${column}=gt.${value}`,
      
      lt: (column, value) => `${column}=lt.${value}`,
      
      gte: (column, value) => `${column}=gte.${value}`,
      
      lte: (column, value) => `${column}=lte.${value}`,
      
      like: (column, value) => `${column}=like.${value}`,
      
      ilike: (column, value) => `${column}=ilike.${value}`,
      
      in: (column, values) => `${column}=in.(${values.join(',')})`,
      
      is: (column, value) => `${column}=is.${value}`,
      
      or: (conditions) => `or(${conditions.join(',')})`,
      
      and: (conditions) => `and(${conditions.join(',')})`,
      
      order: (column, ascending = true) => `order=${column}.${ascending ? 'asc' : 'desc'}`,
      
      limit: (count) => `limit=${count}`,
      
      offset: (count) => `offset=${count}`
    }
  },
  
  // 用户认证相关
  auth: {
    // 用户注册
    async signUp(email, password, userData = {}) {
      try {
        const response = await supabase.request('/auth/v1/signup', {
          method: 'POST',
          data: { 
            email, 
            password,
            ...userData 
          }
        })
        
        if (response.access_token) {
          // 保存token到本地存储
          uni.setStorageSync('supabase_token', response.access_token)
          uni.setStorageSync('supabase_user', response.user)
        }
        
        return response
      } catch (error) {
        console.error('注册失败:', error)
        throw error
      }
    },
    
    // 用户登录
    async signIn(email, password) {
      try {
        const response = await supabase.request('/auth/v1/token?grant_type=password', {
          method: 'POST',
          data: { email, password }
        })
        
        if (response.access_token) {
          // 保存token到本地存储
          uni.setStorageSync('supabase_token', response.access_token)
          uni.setStorageSync('supabase_user', response.user)
        }
        
        return response
      } catch (error) {
        console.error('登录失败:', error)
        throw error
      }
    },
    
    // 获取当前用户
    getCurrentUser() {
      try {
        return uni.getStorageSync('supabase_user')
      } catch (error) {
        console.error('获取用户信息失败:', error)
        return null
      }
    },
    
    // 获取token
    getToken() {
      try {
        return uni.getStorageSync('supabase_token')
      } catch (error) {
        return null
      }
    },
    
    // 检查是否已登录
    isLoggedIn() {
      const token = this.getToken()
      const user = this.getCurrentUser()
      return !!(token && user)
    },
    
    // 用户登出
    async signOut() {
      try {
        // 调用Supabase登出接口
        await supabase.request('/auth/v1/logout', {
          method: 'POST'
        })
      } catch (error) {
        console.error('登出失败:', error)
      } finally {
        // 清除本地存储的token和用户信息
        uni.removeStorageSync('supabase_token')
        uni.removeStorageSync('supabase_user')
      }
    },
    
    // 发送密码重置邮件
    async resetPassword(email) {
      try {
        return await supabase.request('/auth/v1/recover', {
          method: 'POST',
          data: { email }
        })
      } catch (error) {
        console.error('发送重置邮件失败:', error)
        throw error
      }
    }
  },
  
  // 获取认证请求头
  getAuthHeaders() {
    const token = this.auth.getToken()
    return {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${token || supabaseAnonKey}`,
      'Content-Type': 'application/json'
    }
  }
}

export default supabase