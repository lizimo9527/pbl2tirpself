/*
 * 微信小程序端专用配置
 * 解决微信小程序特有的兼容性问题
 */

// 微信小程序平台检测
export const isWeixinMP = typeof wx !== 'undefined' && wx.getSystemInfoSync

// 微信小程序安全区域适配
export const getSafeArea = () => {
  if (isWeixinMP) {
    const systemInfo = wx.getSystemInfoSync()
    return {
      top: systemInfo.statusBarHeight || 44,
      bottom: systemInfo.screenHeight - systemInfo.safeArea.bottom
    }
  }
  return { top: 0, bottom: 0 }
}

// 微信小程序导航栏高度
export const getNavBarHeight = () => {
  if (isWeixinMP) {
    const systemInfo = wx.getSystemInfoSync()
    return systemInfo.statusBarHeight + 44 // 状态栏高度 + 导航栏高度
  }
  return 0
}

// 微信小程序兼容性处理
export const wxCompatible = {
  // 解决微信小程序中某些CSS属性不支持的问题
  cssFix: {
    // 微信小程序不支持grid布局的fallback
    gridFallback: (columns) => {
      if (isWeixinMP) {
        return {
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between'
        }
      }
      return {}
    }
  },
  
  // 微信小程序API兼容性处理
  api: {
    // 统一的位置获取方法
    getLocation: () => {
      return new Promise((resolve, reject) => {
        if (isWeixinMP) {
          wx.getLocation({
            type: 'gcj02',
            success: resolve,
            fail: reject
          })
        } else {
          uni.getLocation({
            type: 'wgs84',
            success: resolve,
            fail: reject
          })
        }
      })
    }
  }
}

// 微信小程序样式工具类
export const wxStyle = {
  // 安全区域适配样式
  safeArea: () => {
    const { top, bottom } = getSafeArea()
    return {
      paddingTop: `${top}px`,
      paddingBottom: `${bottom}px`
    }
  },
  
  // 导航栏适配样式
  navBar: () => {
    const height = getNavBarHeight()
    return {
      height: `${height}px`,
      paddingTop: `${getSafeArea().top}px`
    }
  }
}