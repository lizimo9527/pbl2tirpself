<template>
	<view class="home-container">
		<!-- 欢迎信息栏 -->
		<view class="welcome-bar">
			<view class="welcome-info">
				<view class="app-logo">
					<text class="logo-icon">🌍</text>
				</view>
				<view class="user-details">
					<text class="user-name">欢迎使用TripSelf</text>
					<text class="user-welcome">开始规划您的完美旅程</text>
				</view>
			</view>
		</view>
		
		<!-- 英雄区域 -->
		<view class="header-bg">
			<view class="header-content">
				<text class="app-title">发现你的专属旅行方式</text>
				<text class="app-subtitle">TripSelf - 旅行自助服务平台</text>
				<view class="hero-buttons">
					<button class="start-planning-btn" @click="startPlanning">
						<text class="btn-icon">✏️</text>
						<text>开始制作攻略</text>
					</button>
				</view>
			</view>
		</view>
		
		<!-- 主要内容区域 -->
		<view class="main-content">
			<!-- 制作攻略引导区域 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">开始你的旅行规划</text>
				</view>
				<view class="planning-guide">
					<view class="guide-item" @click="startPlanning">
						<text class="guide-icon">📝</text>
						<view class="guide-content">
							<text class="guide-title">创建新攻略</text>
							<text class="guide-desc">从零开始规划你的完美旅程</text>
						</view>
						<text class="guide-arrow">→</text>
					</view>
					<view class="guide-item" @click="viewMyPlans">
						<text class="guide-icon">📂</text>
						<view class="guide-content">
							<text class="guide-title">我的攻略</text>
							<text class="guide-desc">查看和管理已创建的攻略</text>
						</view>
						<text class="guide-arrow">→</text>
					</view>
					<view class="guide-item" @click="viewTemplates">
						<text class="guide-icon">📋</text>
						<view class="guide-content">
							<text class="guide-title">攻略模板</text>
							<text class="guide-desc">使用模板快速开始规划</text>
						</view>
						<text class="guide-arrow">→</text>
					</view>
					<view class="guide-item" @click="startAIChat">
						<text class="guide-icon">🤖</text>
						<view class="guide-content">
							<text class="guide-title">一键定制旅行</text>
							<text class="guide-desc">AI助手智能推荐景点路线</text>
						</view>
						<text class="guide-arrow">→</text>
					</view>
				</view>
			</view>
			
			<!-- 攻略制作特色 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">攻略制作特色</text>
				</view>
				<view class="features-grid">
					<view class="feature-item">
						<text class="feature-icon">🗺️</text>
						<text class="feature-title">智能路线规划</text>
						<text class="feature-desc">自动优化行程路线，节省时间</text>
					</view>
					<view class="feature-item">
						<text class="feature-icon">💰</text>
						<text class="feature-title">预算管理</text>
						<text class="feature-desc">实时计算旅行费用</text>
					</view>
					<view class="feature-item">
						<text class="feature-icon">📅</text>
						<text class="feature-title">时间安排</text>
						<text class="feature-desc">合理分配每日行程</text>
					</view>
					<view class="feature-item">
						<text class="feature-icon">📱</text>
						<text class="feature-title">多端同步</text>
						<text class="feature-desc">随时随地查看攻略</text>
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
			}
		}
	}
</script>

<style>
	/* 全局样式 */
	.home-container {
		min-height: 100vh;
		background-color: #f5f7fa;
	}
	
	/* 欢迎区域样式 */
	.welcome-bar {
		background: linear-gradient(135deg, #2a9d8f 0%, #264653 100%);
		padding: 30rpx 30rpx 40rpx;
		color: white;
	}
	
	.welcome-info {
		display: flex;
		align-items: center;
	}
	
	.app-logo {
		width: 90rpx;
		height: 90rpx;
		background-color: rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 25rpx;
	}
	
	.logo-icon {
		font-size: 48rpx;
	}
	
	.user-details {
		display: flex;
		flex-direction: column;
	}
	
	.user-name {
		font-size: 34rpx;
		font-weight: bold;
		margin-bottom: 8rpx;
	}
	
	.user-welcome {
		font-size: 26rpx;
		opacity: 0.9;
	}
	
	/* 英雄区域样式 */
	.header-bg {
		background: linear-gradient(135deg, #2a9d8f 0%, #264653 100%);
		padding: 60rpx 30rpx;
		color: white;
	}
	
	.header-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}
	
	.app-title {
		font-size: 48rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}
	
	.app-subtitle {
		font-size: 28rpx;
		opacity: 0.9;
		margin-bottom: 40rpx;
	}
	
	.hero-buttons {
		display: flex;
		justify-content: center;
	}
	
	.start-planning-btn {
		background: white;
		color: #2a9d8f;
		border-radius: 50rpx;
		padding: 20rpx 60rpx;
		font-size: 28rpx;
		font-weight: bold;
		display: flex;
		align-items: center;
	}
	
	.btn-icon {
		font-size: 32rpx;
		margin-right: 15rpx;
	}
	
	/* 主要内容区域样式 */
	.main-content {
		padding: 40rpx 30rpx;
	}
	
	.section {
		margin-bottom: 60rpx;
	}
	
	.section-header {
		margin-bottom: 30rpx;
	}
	
	.section-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #264653;
		position: relative;
		padding-left: 15rpx;
	}
	
	.section-title::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 6rpx;
		height: 30rpx;
		background-color: #2a9d8f;
		border-radius: 3rpx;
	}
	
	/* 规划引导区域样式 */
	.planning-guide {
		display: flex;
		flex-direction: column;
	}
	
	.guide-item {
		display: flex;
		align-items: center;
		padding: 30rpx;
		background-color: white;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
		margin-bottom: 20rpx;
	}
	
	.guide-icon {
		font-size: 48rpx;
		color: #2a9d8f;
		margin-right: 25rpx;
		width: 50rpx;
		text-align: center;
	}
	
	.guide-content {
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	
	.guide-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #264653;
		margin-bottom: 5rpx;
	}
	
	.guide-desc {
		font-size: 24rpx;
		color: #6c757d;
	}
	
	.guide-arrow {
		font-size: 28rpx;
		color: #adb5bd;
	}
	
	/* 特色功能区域样式 - 两行两列式分布 */
	.features-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin-top: 20rpx;
	}
	
	.feature-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 35rpx 20rpx;
		background-color: white;
		border-radius: 20rpx;
		width: 48%;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
		height: 200rpx;
		justify-content: center;
		box-sizing: border-box;
		margin-bottom: 20rpx;
	}
	
	.feature-icon {
		font-size: 50rpx;
		color: #2a9d8f;
		margin-bottom: 20rpx;
	}
	
	.feature-title {
		font-size: 26rpx;
		font-weight: bold;
		color: #264653;
		margin-bottom: 10rpx;
	}
	
	.feature-desc {
		font-size: 22rpx;
		color: #6c757d;
		line-height: 1.5;
	}
</style>