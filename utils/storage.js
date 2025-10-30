// 本地存储工具函数
const storage = {
  // 设置存储
  set(key, value) {
    try {
      uni.setStorageSync(key, value)
      return true
    } catch (e) {
      console.error('存储失败:', e)
      return false
    }
  },
  
  // 获取存储
  get(key, defaultValue = null) {
    try {
      const value = uni.getStorageSync(key)
      return value || defaultValue
    } catch (e) {
      console.error('获取存储失败:', e)
      return defaultValue
    }
  },
  
  // 删除存储
  remove(key) {
    try {
      uni.removeStorageSync(key)
      return true
    } catch (e) {
      console.error('删除存储失败:', e)
      return false
    }
  },
  
  // 清空所有存储
  clear() {
    try {
      uni.clearStorageSync()
      return true
    } catch (e) {
      console.error('清空存储失败:', e)
      return false
    }
  }
}

// 用户相关存储
const userStorage = {
  // 保存用户信息
  saveUserInfo(userInfo) {
    return storage.set('userInfo', userInfo)
  },
  
  // 获取用户信息
  getUserInfo() {
    return storage.get('userInfo', {})
  },
  
  // 保存搜索历史
  saveSearchHistory(history) {
    return storage.set('searchHistory', history)
  },
  
  // 获取搜索历史
  getSearchHistory() {
    return storage.get('searchHistory', [])
  },
  
  // 保存旅行人格测试结果
  savePersonalityResult(result) {
    return storage.set('personalityResult', result)
  },
  
  // 获取旅行人格测试结果
  getPersonalityResult() {
    return storage.get('personalityResult', null)
  }
}

// 攻略相关存储
const guideStorage = {
  // 保存攻略列表
  saveGuideList(guides) {
    return storage.set('guideList', guides)
  },
  
  // 获取攻略列表
  getGuideList() {
    return storage.get('guideList', [])
  },
  
  // 保存单个攻略
  saveGuide(guide) {
    const guides = this.getGuideList()
    const index = guides.findIndex(g => g.id === guide.id)
    
    if (index >= 0) {
      guides[index] = guide
    } else {
      guides.push(guide)
    }
    
    return this.saveGuideList(guides)
  },
  
  // 获取单个攻略
  getGuide(id) {
    const guides = this.getGuideList()
    return guides.find(guide => guide.id === id) || null
  },
  
  // 删除攻略
  deleteGuide(id) {
    const guides = this.getGuideList()
    const filteredGuides = guides.filter(guide => guide.id !== id)
    return this.saveGuideList(filteredGuides)
  }
}

// 帖子相关存储
const postStorage = {
  // 保存帖子列表
  savePostList(posts) {
    return storage.set('postList', posts)
  },
  
  // 获取帖子列表
  getPostList() {
    return storage.get('postList', [])
  },
  
  // 保存单个帖子
  savePost(post) {
    const posts = this.getPostList()
    const index = posts.findIndex(p => p.id === post.id)
    
    if (index >= 0) {
      posts[index] = post
    } else {
      posts.unshift(post)
    }
    
    return this.savePostList(posts)
  },
  
  // 获取单个帖子
  getPost(id) {
    const posts = this.getPostList()
    return posts.find(post => post.id === id) || null
  },
  
  // 删除帖子
  deletePost(id) {
    const posts = this.getPostList()
    const filteredPosts = posts.filter(post => post.id !== id)
    return this.savePostList(filteredPosts)
  }
}

export {
  storage,
  userStorage,
  guideStorage,
  postStorage
}