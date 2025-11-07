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

			<!-- 特色特区（调换到上面位置，使用一行样式） -->
			<view class="quick-actions-section">
				<view class="quick-actions-grid">
					<view class="action-card" @click="showRoutePlanning">
						<view class="action-icon-wrapper">
							<text class="feature-icon">🗺️</text>
						</view>
						<text class="action-title">智能路线规划</text>
					</view>
					
				<view class="action-card" @click="showBudgetManagement">
					<view class="action-icon-wrapper">
						<text class="feature-icon">💰</text>
					</view>
					<text class="action-title">预算管理</text>
				</view>
					
					<view class="action-card" @click="showTimeArrangement">
						<view class="action-icon-wrapper">
							<text class="feature-icon">📅</text>
						</view>
						<text class="action-title">时间安排</text>
					</view>
					
					<view class="action-card" @click="showMultiDeviceSync">
						<view class="action-icon-wrapper">
							<text class="feature-icon">📱</text>
						</view>
						<text class="action-title">多端同步</text>
					</view>
				</view>
			</view>

			<!-- 功能入口区（移动到页面底部，使用两行两列样式） -->
			<view class="features-section">
				<view class="section-header">
					<view class="section-indicator"></view>
					<text class="section-title">功能入口</text>
				</view>
				
				<view class="features-grid">
					<view class="feature-card" @click="startPlanning">
						<view class="feature-icon-wrapper">
							<image src="/static/images/background/image1.png" class="action-card-image" mode="aspectFit"></image>
						</view>
						<text class="feature-title">创建新攻略</text>
					</view>
					
					<view class="feature-card" @click="viewMyPlans">
						<view class="feature-icon-wrapper">
							<image src="/static/images/background/image2.png" class="action-card-image" mode="aspectFit"></image>
						</view>
						<text class="feature-title">我的攻略</text>
					</view>
					
					<view class="feature-card" @click="viewTemplates">
						<view class="feature-icon-wrapper">
							<image src="/static/images/background/image4.png" class="action-card-image" mode="aspectFit"></image>
						</view>
						<text class="feature-title">攻略模板</text>
					</view>
					
					<view class="feature-card" @click="startAIChat">
						<view class="feature-icon-wrapper">
							<image src="/static/images/background/image3.png" class="action-card-image" mode="aspectFit"></image>
						</view>
						<text class="feature-title">一键定制旅行</text>
					</view>
				</view>
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
			},
			// 特色功能方法
			showRoutePlanning() {
				uni.showToast({
					title: '智能路线规划功能开发中',
					icon: 'none'
				})
			},
			showBudgetManagement() {
				uni.showToast({
					title: '预算管理功能开发中',
					icon: 'none'
				})
			},
			showTimeArrangement() {
				uni.showToast({
					title: '时间安排功能开发中',
					icon: 'none'
				})
			},
			showMultiDeviceSync() {
				uni.showToast({
					title: '多端同步功能开发中',
					icon: 'none'
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
		padding-bottom: 0;
		min-height: calc(100vh - 500rpx - 100rpx);
		display: flex;
		flex-direction: column;
	}
	
	/* 确保功能入口区域在底部 */
	.features-section {
		flex-grow: 1;
		margin-top: auto;
		margin-bottom: 100rpx; /* 紧贴底部导航栏 */
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
		margin: -40rpx 30rpx -10rpx 0rpx; /* 减少负margin，缩短向下延伸距离 */
		background: linear-gradient(to right, #e6f7ff, #fceeff, #fff0e6);
		opacity: 1;
		border-radius: 40rpx 40rpx 25rpx 25rpx; /* 微调底部圆角 */
		padding: 15rpx 15rpx 30rpx 15rpx; /* 减少底部内边距 */
		position: relative;
		z-index: 10; /* 提高z-index确保覆盖下面内容 */
		width: calc(100% - 30rpx);
		overflow: visible;
		min-height: 180rpx; /* 减少最小高度 */
		box-shadow: 0 8rpx 25rpx rgba(0, 0, 0, 0.15); /* 保持阴影效果 */
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
		padding: 20rpx 15rpx;
		transform: scale(1);
		transition: all 0.3s;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 12rpx;
		box-sizing: border-box;
		min-height: 140rpx;
		min-width: 180rpx;
	}
	
	.action-card:active {
		transform: scale(1.05);
		background: rgba(255, 255, 255, 0.1);
	}
	
	.action-icon-wrapper {
		width: 80rpx;
		height: 80rpx;
		border-radius: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: linear-gradient(135deg, #e6f7ff, #f0f8ff);
		flex-shrink: 0;
		padding: 10rpx;
		box-sizing: border-box;
	}
	
	.feature-icon {
		font-size: 48rpx;
	}
	
	.action-card-image {
		width: 60rpx;
		height: 60rpx;
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
		padding: 0 30rpx 60rpx; /* 增加底部内边距 */
		background: 
			linear-gradient(135deg, #e6f7ff 0%, #e6f7ff 5%, transparent 15%),
			linear-gradient(to right, #fceeff, #fff0e6);
		opacity: 0.95;
		border-radius: 40rpx; /* 增加圆角半径 */
		margin-top: -20rpx; /* 负边距向上移动，覆盖上面的内容 */
		position: relative;
		z-index: 10; /* 提高层级确保覆盖 */
		box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
		min-height: 450rpx; /* 进一步增加最小高度 */
		margin-bottom: 120rpx; /* 增加下边框距离 */
	}
	
	.section-header {
		display: flex;
		align-items: center;
		margin-bottom: 60rpx; /* 进一步增加与下面功能卡片的间距 */
		padding: 20rpx 20rpx 0rpx 20rpx; /* 增加顶部内边距，让文字向上移动 */
		margin-top: 10rpx; /* 从顶部开始有更多空间 */
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