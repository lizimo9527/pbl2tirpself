// 网络请求封装
const BASE_URL = 'https://api.example.com' // 请替换为实际API地址

export const request = (options = {}) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: BASE_URL + (options.url || ''),
			method: options.method || 'GET',
			data: options.data || {},
			header: {
				'Content-Type': 'application/json',
				...options.header
			},
			success: (res) => {
				if (res.statusCode === 200) {
					resolve(res.data)
				} else {
					reject(res)
				}
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

// 获取位置信息
export const getCurrentLocation = () => {
	return new Promise((resolve, reject) => {
		uni.getLocation({
			type: 'gcj02',
			success: resolve,
			fail: reject
		})
	})
}

// 显示提示信息
export const showToast = (title, icon = 'none') => {
	uni.showToast({
		title,
		icon,
		duration: 2000
	})
}

// 显示加载中
export const showLoading = (title = '加载中...') => {
	uni.showLoading({
		title,
		mask: true
	})
}

// 隐藏加载
export const hideLoading = () => {
	uni.hideLoading()
}