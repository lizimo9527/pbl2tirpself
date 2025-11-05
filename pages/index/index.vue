<template>
	<view class="home-container">
		<!-- 主内容区 -->
		<view class="main-content">
			<!-- 头部 Banner 区 -->
			<view class="banner-section">
				<view class="banner-bg">
					<image 
						src="/static/images/background/banner.jpg" 
						class="banner-image"
						mode="aspectFill"
					></image>
					<view class="banner-overlay"></view>
				</view>
				
				<view class="banner-content">
					<view class="banner-welcome">
						<text class="welcome-icon">🗺️</text>
						<view class="welcome-texts">
							<text class="welcome-text">欢迎使用 TripSelf</text>
							<text class="welcome-subtitle">开始规划您的完美旅程</text>
						</view>
					</view>
					
					<view class="banner-main">
						<text class="banner-title">发现你的专属旅行方式</text>
						<text class="banner-subtitle">TripSelf - 旅行自助服务平台</text>
					</view>
					
					<button class="start-planning-btn" @click="startPlanning">
						<text>✏️ 开始制作攻略</text>
					</button>
				</view>
			</view>

			<!-- 功能入口区 -->
			<view class="quick-actions-section">
				<view class="quick-actions-grid">
					<view class="action-card" @click="startPlanning">
						<view class="action-icon-wrapper">
							<image src="/static/images/background/image1.png" class="action-card-image" mode="aspectFit"></image>
						</view>
						<text class="action-title">创建新攻略</text>
					</view>
					
				<view class="action-card" @click="viewMyPlans">
					<view class="action-icon-wrapper">
						<image src="/static/images/background/image2.png" class="action-card-image" mode="aspectFit"></image>
					</view>
					<text class="action-title">我的攻略</text>
				</view>
					
					<view class="action-card" @click="viewTemplates">
						<view class="action-icon-wrapper">
							<image src="/static/images/background/image4.png" class="action-card-image" mode="aspectFit"></image>
						</view>
						<text class="action-title">攻略模板</text>
					</view>
					
					<view class="action-card" @click="startAIChat">
						<view class="action-icon-wrapper">
							<image src="/static/images/background/image3.png" class="action-card-image" mode="aspectFit"></image>
						</view>
						<text class="action-title">一键定制旅行</text>
					</view>
				</view>
			</view>

			<!-- 特色特区 -->
			<view class="features-section">
				<view class="section-header">
					<view class="section-indicator"></view>
					<text class="section-title">特色特区</text>
				</view>
				
				<view class="features-grid">
					<view class="feature-card">
						<view class="feature-icon-wrapper">
							<text class="feature-icon">🗺️</text>
						</view>
						<text class="feature-title">智能路线规划</text>
						<text class="feature-desc">根据你的偏好，规划最优旅行路线，让旅途更顺畅</text>
					</view>
					
					<view class="feature-card">
						<view class="feature-icon-wrapper">
							<text class="feature-icon">💰</text>
						</view>
						<text class="feature-title">预算管理</text>
						<text class="feature-desc">实现智能旅行费用管理，合理控制旅行开支</text>
					</view>
					
					<view class="feature-card">
						<view class="feature-icon-wrapper">
							<text class="feature-icon">📅</text>
						</view>
						<text class="feature-title">时间安排</text>
						<text class="feature-desc">科学规划每日行程，充分利用旅行时间</text>
					</view>
					
					<view class="feature-card">
						<view class="feature-icon-wrapper">
							<text class="feature-icon">📱</text>
						</view>
						<text class="feature-title">多端同步</text>
						<text class="feature-desc">支持多设备同步，随时随地查看和编辑行程</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部导航栏 -->
		<view class="bottom-nav">
			<view class="nav-item active">
				<text class="nav-icon">🏠</text>
				<text class="nav-text">首页</text>
			</view>
			<view class="nav-item">
				<text class="nav-icon">📝</text>
				<text class="nav-text">制作攻略</text>
			</view>
			<view class="nav-item">
				<text class="nav-icon">👥</text>
				<text class="nav-text">发帖社区</text>
			</view>
			<view class="nav-item">
				<text class="nav-icon">🤝</text>
				<text class="nav-text">匹配搭子</text>
			</view>
			<view class="nav-item">
				<text class="nav-icon">👤</text>
				<text class="nav-text">我的</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 精简后的数据，专注于攻略制作
			}
		},
		methods: {
			startPlanning() {
				uni.switchTab({
					url: '/pages/create/create'
				})
			},
			viewMyPlans() {
				uni.navigateTo({
					url: '/pages/my-plans/my-plans'
				})
			},
			viewTemplates() {
				uni.navigateTo({
					url: '/pages/templates/templates'
				})
			},
			startAIChat() {
				uni.navigateTo({
					url: '/pages/ai-chat/ai-chat'
				})
			}
		}
	}
</script>

<style>
	/* 全局样式 */
	.home-container {
		min-height: 100vh;
		background: linear-gradient(to right, #e6f7ff, #fceeff);
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		opacity: 1;
	}
	
	/* 主内容区域 */
	.main-content {
		padding-top: 0;
		padding-bottom: 120rpx;
	}
	
	/* 头部 Banner 区样式 */
	.banner-section {
		position: relative;
		height: 500rpx; /* 减少高度让按钮上移 */
		overflow: hidden;
	}
	
	.banner-bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 0;
	}
	
	.banner-image {
		width: 100%;
		height: 100%;
	}
	
	.banner-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: transparent;
	}
	
	.banner-content {
		position: relative;
		z-index: 10;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		padding: 20rpx 40rpx 20rpx;
		gap: 40rpx;
	}
	
	.banner-welcome {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 20rpx;
	}
	
	.welcome-icon {
		font-size: 80rpx;
		opacity: 0.22;
		filter: blur(3rpx);
	}
	
	.welcome-texts {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
	
	.welcome-text {
		font-size: 40rpx; /* 约20px */
		font-weight: bold;
		color: white;
		margin-bottom: 5rpx;
	}
	
	.welcome-subtitle {
		font-size: 32rpx; /* 约16px */
		color: rgba(255, 255, 255, 0.9);
	}
	
	.banner-main {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}
	
	.banner-title {
		font-size: 56rpx; /* 约28px */
		font-weight: bold;
		color: white;
		margin-bottom: 10rpx;
	}
	
	.banner-subtitle {
		font-size: 36rpx; /* 约18px */
		color: rgba(255, 255, 255, 0.8);
	}
	
	.start-planning-btn {
		background: linear-gradient(to right, #ffe6f2, #e6f7ff);
		color: #20B2AA;
		font-weight: 600;
		font-size: 36rpx; /* 约18px */
		padding: 20rpx 60rpx;
		border-radius: 50rpx;
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
		transform: scale(1);
		transition: all 0.3s;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		align-self: center;
		opacity: 1;
		min-width: 300rpx;
		white-space: nowrap;
		margin-top: 0rpx;
	}
	
	.start-planning-btn:active {
		transform: scale(1.05);
		background: linear-gradient(to right, #ffd1e6, #d1ecff);
	}
	
	.btn-icon {
		font-size: 32rpx;
	}
	
	/* 功能入口区 */
	.quick-actions-section {
		margin: -40rpx 30rpx 0rpx 0rpx;
		background: linear-gradient(to bottom, #fceeff, #ffffff);
		opacity: 1;
		border-radius: 40rpx 40rpx 0rpx 0rpx;
		padding: 15rpx 15rpx;
		position: relative;
		z-index: 5;
		border: 2rpx solid rgba(0, 0, 0, 0.1);
		width: calc(100% - 30rpx);
		overflow: visible;
	}
	
	.quick-actions-grid {
		display: flex;
		justify-content: space-between;
		gap: 10rpx;
	}
	
	.action-card {
		flex: 1;
		background: transparent;
		border-radius: 20rpx;
		padding: 15rpx 10rpx;
		transform: scale(1);
		transition: all 0.3s;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8rpx;
		box-sizing: border-box;
		min-height: 100rpx;
		min-width: 160rpx;
	}
	
	.action-card:active {
		transform: scale(1.05);
		background: rgba(255, 255, 255, 0.1);
	}
	
	.action-icon-wrapper {
		width: 60rpx;
		height: 60rpx;
		border-radius: 15rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: linear-gradient(135deg, #e6f7ff, #f0f8ff);
		flex-shrink: 0;
		padding: 8rpx;
		box-sizing: border-box;
	}
	
	.action-card-icon {
		font-size: 32rpx;
	}
	
	.action-card-image {
		width: 48rpx;
		height: 48rpx;
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}
	
	.action-title {
		font-size: 26rpx; /* 约13px */
		font-weight: 500;
		color: #666;
		white-space: nowrap;
		flex-shrink: 0;
		text-align: center;
		width: 100%;
	}
	
	/* 特色特区 */
	.features-section {
		padding: 0 30rpx 40rpx;
		background: linear-gradient(to right, #fceeff, #fff0e6), linear-gradient(to bottom, #fceeff, #ffffff);
		opacity: 0.95;
		border-radius: 30rpx;
		margin-top: 10rpx;
		position: relative;
		z-index: 4;
		border: 2rpx solid rgba(0, 0, 0, 0.1);
	}
	
	.section-header {
		display: flex;
		align-items: center;
		margin-bottom: 40rpx;
		padding: 0 20rpx;
	}
	
	.section-indicator {
		width: 8rpx;
		height: 48rpx;
		background: #20B2AA;
		border-radius: 4rpx;
		margin-right: 20rpx;
	}
	
	.section-title {
		font-size: 36rpx; /* 约18px */
		font-weight: bold;
		color: #333;
	}
	
	.features-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 20rpx;
		padding: 0 20rpx;
	}
	
	.feature-card {
		width: calc(50% - 10rpx);
		background: rgba(255, 255, 255, 0.9);
		border-radius: 20rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
		transition: box-shadow 0.3s;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		backdrop-filter: blur(10rpx);
	}
	
	.feature-card:active {
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
	}
	
	.feature-icon-wrapper {
		width: 80rpx;
		height: 80rpx;
		border-radius: 20rpx;
		background: linear-gradient(135deg, #e3f2fd, #f3e5f5);
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.feature-icon {
		font-size: 36rpx;
	}
	
	.feature-title {
		font-size: 32rpx; /* 约16px */
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
	}
	
	.feature-desc {
		font-size: 24rpx; /* 约12px */
		color: #666;
		line-height: 1.4;
	}
	
	/* 底部导航栏 */
	.bottom-nav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 100rpx;
		background: white;
		display: flex;
		justify-content: space-around;
		align-items: center;
		border-top: 1rpx solid #eee;
		z-index: 100;
	}
	
	.nav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5rpx;
	}
	
	.nav-item.active .nav-icon,
	.nav-item.active .nav-text {
		color: #20B2AA;
	}
	
	.nav-item:not(.active) .nav-icon,
	.nav-item:not(.active) .nav-text {
		color: #999;
	}
	
	.nav-icon {
		font-size: 36rpx;
	}
	
	.nav-text {
		font-size: 24rpx; /* 约12px */
	}
	
	/* 基础动画定义 */
	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(40rpx); }
		to { opacity: 1; transform: translateY(0); }
	}
	
	/* 为元素添加动画 */
	.banner-welcome,
	.banner-main,
	.start-planning-btn,
	.action-card,
	.feature-card {
		animation: fadeIn 0.6s ease-out;
	}
	
	.action-card:nth-child(2) { animation-delay: 0.1s; }
	.action-card:nth-child(3) { animation-delay: 0.2s; }
	.action-card:nth-child(4) { animation-delay: 0.3s; }
	.feature-card:nth-child(2) { animation-delay: 0.1s; }
	.feature-card:nth-child(3) { animation-delay: 0.2s; }
	.feature-card:nth-child(4) { animation-delay: 0.3s; }
</style>