<template>
	<view class="user-container">
		<!-- 用户信息头部 -->
		<view class="user-header">
			<view class="header-content">
				<image class="user-avatar" src="/static/images/default-avatar.png" mode="aspectFill"></image>
				<view class="user-info">
					<text class="user-name">{{userInfo.name}}</text>
					<text class="user-level">{{userInfo.level}}</text>
					<text class="user-desc">{{userInfo.desc}}</text>
				</view>
			</view>
			<view class="user-stats">
				<view class="stat-item">
					<text class="stat-number">{{userInfo.stats.plans}}</text>
					<text class="stat-label">攻略</text>
				</view>
				<view class="stat-item">
					<text class="stat-number">{{userInfo.stats.followers}}</text>
					<text class="stat-label">粉丝</text>
				</view>
				<view class="stat-item">
					<text class="stat-number">{{userInfo.stats.following}}</text>
					<text class="stat-label">关注</text>
				</view>
				<view class="stat-item">
					<text class="stat-number">{{userInfo.stats.likes}}</text>
					<text class="stat-label">点赞</text>
				</view>
			</view>
		</view>
		
		<!-- 主要内容区域 -->
		<view class="main-content">
			<!-- 我的功能 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">我的功能</text>
				</view>
				<view class="function-grid">
					<view class="function-item" @click="viewMyPlans" hover-class="function-item-hover">
						<view class="function-icon">📝</view>
						<text class="function-name">我的攻略</text>
					</view>
					<view class="function-item" @click="viewMyMatches" hover-class="function-item-hover">
						<view class="function-icon">👥</view>
						<text class="function-name">我的搭子</text>
					</view>
					<view class="function-item" @click="viewMyPosts" hover-class="function-item-hover">
						<view class="function-icon">📰</view>
						<text class="function-name">我的帖子</text>
					</view>
					<view class="function-item" @click="viewMyFavorites" hover-class="function-item-hover">
						<view class="function-icon">❤️</view>
						<text class="function-name">我的收藏</text>
					</view>
				</view>
			</view>
			
			<!-- 热门分类 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">热门分类</text>
				</view>
				<view class="category-grid">
					<view class="category-item" @click="viewFoodCategory" hover-class="category-item-hover">
						<view class="category-icon">🍽️</view>
						<text class="category-name">饮食</text>
					</view>
					<view class="category-item" @click="viewTransportCategory" hover-class="category-item-hover">
						<view class="category-icon">🚗</view>
						<text class="category-name">交通</text>
					</view>
					<view class="category-item" @click="viewAccommodationCategory" hover-class="category-item-hover">
						<view class="category-icon">🏨</view>
						<text class="category-name">住宿</text>
					</view>
					<view class="category-item" @click="viewAttractionsCategory" hover-class="category-item-hover">
						<view class="category-icon">🏞️</view>
						<text class="category-name">景点</text>
					</view>
				</view>
			</view>
			
			<!-- 旅行风格 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">旅行风格</text>
				</view>
				<view class="style-grid">
					<view class="style-item" @click="selectSpecialForcesStyle" hover-class="style-item-hover">
						<view class="style-icon">⚡</view>
						<text class="style-name">特种兵式</text>
						<text class="style-desc">高效打卡</text>
					</view>
					<view class="style-item" @click="selectPhotoStyle" hover-class="style-item-hover">
						<view class="style-icon">📸</view>
						<text class="style-name">拍照打卡式</text>
						<text class="style-desc">记录美好</text>
					</view>
					<view class="style-item" @click="selectSlowTravelStyle" hover-class="style-item-hover">
						<view class="style-icon">🌿</view>
						<text class="style-name">细品慢游式</text>
						<text class="style-desc">深度体验</text>
					</view>
				</view>
			</view>
			
			<!-- 设置选项 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">设置</text>
				</view>
				<view class="settings-list">
					<view class="setting-item" @click="editProfile" hover-class="setting-item-hover">
						<view class="setting-left">
							<view class="setting-icon">👤</view>
							<text class="setting-name">编辑资料</text>
						</view>
						<text class="setting-arrow">></text>
					</view>
					<view class="setting-item" @click="accountSettings" hover-class="setting-item-hover">
						<view class="setting-left">
							<view class="setting-icon">⚙️</view>
							<text class="setting-name">账号设置</text>
						</view>
						<text class="setting-arrow">></text>
					</view>
					<view class="setting-item" @click="notificationSettings" hover-class="setting-item-hover">
						<view class="setting-left">
							<view class="setting-icon">🔔</view>
							<text class="setting-name">通知设置</text>
						</view>
						<text class="setting-arrow">></text>
					</view>
					<view class="setting-item" @click="privacySettings" hover-class="setting-item-hover">
						<view class="setting-left">
							<view class="setting-icon">🔒</view>
							<text class="setting-name">隐私设置</text>
						</view>
						<text class="setting-arrow">></text>
					</view>
					<view class="setting-item" @click="helpCenter" hover-class="setting-item-hover">
						<view class="setting-left">
							<view class="setting-icon">❓</view>
							<text class="setting-name">帮助中心</text>
						</view>
						<text class="setting-arrow">></text>
					</view>
					<view class="setting-item" @click="aboutApp" hover-class="setting-item-hover">
						<view class="setting-left">
							<view class="setting-icon">ℹ️</view>
							<text class="setting-name">关于TripSelf</text>
						</view>
						<text class="setting-arrow">></text>
					</view>
				</view>
			</view>
			
			<!-- 退出登录 -->
			<view class="logout-section">
				<button class="logout-btn" @click="logout">退出登录</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {
					name: '旅行爱好者',
					level: 'Lv.5 资深玩家',
					desc: '热爱旅行，喜欢探索未知的世界',
					stats: {
						plans: 12,
						followers: 156,
						following: 89,
						likes: 234
					}
				}
			}
		},
		methods: {
			viewMyPlans() {
				uni.navigateTo({
					url: '/pages/my-plans/my-plans'
				});
			},
			viewMyMatches() {
				uni.showToast({
					title: '查看我的搭子',
					icon: 'none'
				});
			},
			viewMyPosts() {
				uni.showToast({
					title: '查看我的帖子',
					icon: 'none'
				});
			},
			viewMyFavorites() {
				uni.showToast({
					title: '查看我的收藏',
					icon: 'none'
				});
			},
			// 热门分类方法
			viewFoodCategory() {
				uni.showToast({
					title: '查看饮食分类',
					icon: 'none'
				});
			},
			viewTransportCategory() {
				uni.showToast({
					title: '查看交通分类',
					icon: 'none'
				});
			},
			viewAccommodationCategory() {
				uni.showToast({
					title: '查看住宿分类',
					icon: 'none'
				});
			},
			viewAttractionsCategory() {
				uni.showToast({
					title: '查看景点分类',
					icon: 'none'
				});
			},
			// 旅行风格方法
			selectSpecialForcesStyle() {
				uni.showToast({
					title: '选择特种兵式旅行风格',
					icon: 'none'
				});
			},
			selectPhotoStyle() {
				uni.showToast({
					title: '选择拍照打卡式旅行风格',
					icon: 'none'
				});
			},
			selectSlowTravelStyle() {
				uni.showToast({
					title: '选择细品慢游式旅行风格',
					icon: 'none'
				});
			},
			editProfile() {
				uni.showToast({
					title: '编辑资料',
					icon: 'none'
				});
			},
			accountSettings() {
				uni.showToast({
					title: '账号设置',
					icon: 'none'
				});
			},
			notificationSettings() {
				uni.showToast({
					title: '通知设置',
					icon: 'none'
				});
			},
			privacySettings() {
				uni.showToast({
					title: '隐私设置',
					icon: 'none'
				});
			},
			helpCenter() {
				uni.showToast({
					title: '帮助中心',
					icon: 'none'
				});
			},
			aboutApp() {
				uni.showModal({
					title: '关于TripSelf',
					content: `TripSelf - 旅行自助服务平台

版本: 1.0.0

打造您的专属旅行体验`,
					showCancel: false
				});
			},
			logout() {
				uni.showModal({
					title: '确认退出',
					content: '确定要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '退出中...'
							});
							
							setTimeout(() => {
								uni.hideLoading();
								uni.showToast({
									title: '退出成功',
									icon: 'success'
								});
								
								setTimeout(() => {
									uni.switchTab({
										url: '/pages/index/index'
									});
								}, 1500);
							}, 1000);
						}
					}
				});
			}
		},
		onShow() {
			console.log('个人中心页面显示');
		}
	}
</script>

<style>
	.user-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
	}
	
	.user-header {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 60rpx 30rpx 40rpx;
		color: white;
	}
	
	.header-content {
		display: flex;
		align-items: center;
		margin-bottom: 40rpx;
	}
	
	.user-avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		margin-right: 30rpx;
		border: 4rpx solid rgba(255,255,255,0.3);
	}
	
	.user-info {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	
	.user-name {
		font-size: 36rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}
	
	.user-level {
		font-size: 24rpx;
		opacity: 0.9;
		margin-bottom: 8rpx;
	}
	
	.user-desc {
		font-size: 22rpx;
		opacity: 0.8;
	}
	
	.user-stats {
		display: flex;
		justify-content: space-around;
	}
	
	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.stat-number {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 5rpx;
	}
	
	.stat-label {
		font-size: 22rpx;
		opacity: 0.9;
	}
	
	.main-content {
		flex: 1;
		padding: 30rpx;
	}
	
	.section {
		margin-bottom: 40rpx;
	}
	
	.section-header {
		margin-bottom: 25rpx;
	}
	
	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
	}
	
	.function-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
	}
	
	.function-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 25rpx 15rpx;
		background-color: #f8f9fa;
		border-radius: 15rpx;
		width: calc(50% - 10rpx);
		box-sizing: border-box;
	}
	
	.function-item-hover {
		background-color: #e9ecef;
		transform: scale(0.98);
	}
	
	.function-icon {
		font-size: 48rpx;
		margin-bottom: 15rpx;
	}
	
	.function-name {
		font-size: 24rpx;
		font-weight: bold;
		color: #333333;
	}
	
	/* 热门分类样式 */
	.category-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
	}
	
	.category-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 25rpx 15rpx;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 15rpx;
		width: calc(25% - 15rpx);
		box-sizing: border-box;
		color: white;
	}
	
	.category-item-hover {
		transform: scale(0.98);
		background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
	}
	
	.category-icon {
		font-size: 48rpx;
		margin-bottom: 15rpx;
	}
	
	.category-name {
		font-size: 24rpx;
		font-weight: bold;
	}
	
	/* 旅行风格样式 */
	.style-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
	}
	
	.style-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 25rpx 15rpx;
		background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
		border-radius: 15rpx;
		width: calc(33.33% - 14rpx);
		box-sizing: border-box;
		color: white;
	}
	
	.style-item-hover {
		transform: scale(0.98);
		background: linear-gradient(135deg, #e882f0 0%, #e94c63 100%);
	}
	
	.style-icon {
		font-size: 48rpx;
		margin-bottom: 10rpx;
	}
	
	.style-name {
		font-size: 24rpx;
		font-weight: bold;
		margin-bottom: 5rpx;
	}
	
	.style-desc {
		font-size: 20rpx;
		opacity: 0.9;
	}
	
	.settings-list {
		display: flex;
		flex-direction: column;
		gap: 0;
		background-color: #f8f9fa;
		border-radius: 15rpx;
		overflow: hidden;
	}
	
	.setting-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 25rpx;
		background-color: white;
		border-bottom: 2rpx solid #f0f0f0;
	}
	
	.setting-item:last-child {
		border-bottom: none;
	}
	
	.setting-item-hover {
		background-color: #f5f5f5;
	}
	
	.setting-left {
		display: flex;
		align-items: center;
	}
	
	.setting-icon {
		font-size: 32rpx;
		margin-right: 20rpx;
	}
	
	.setting-name {
		font-size: 28rpx;
		color: #333333;
	}
	
	.setting-arrow {
		font-size: 28rpx;
		color: #999999;
	}
	
	.logout-section {
		margin-top: 40rpx;
	}
	
	.logout-btn {
		width: 100%;
		height: 80rpx;
		background-color: #ff4444;
		color: white;
		border-radius: 10rpx;
		font-size: 28rpx;
		font-weight: bold;
		border: none;
	}
</style>