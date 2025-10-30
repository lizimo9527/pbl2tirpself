<template>
	<view class="home-container">
		<!-- 欢迎信息栏 -->
		<view class="welcome-bar">
			<view class="welcome-info">
				<image class="user-avatar" src="/static/images/default-avatar.png" mode="aspectFill"></image>
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
					<button class="start-planning-btn" @click="startPlanning" hover-class="button-hover">
						<text>✏️ 开始制作攻略</text>
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
					<view class="guide-item" @click="startPlanning" hover-class="guide-item-hover">
						<view class="guide-icon">📝</view>
						<view class="guide-content">
							<text class="guide-title">创建新攻略</text>
							<text class="guide-desc">从零开始规划你的完美旅程</text>
						</view>
					</view>
					<view class="guide-item" @click="viewMyPlans" hover-class="guide-item-hover">
						<view class="guide-icon">📂</view>
						<view class="guide-content">
							<text class="guide-title">我的攻略</text>
							<text class="guide-desc">查看和管理已创建的攻略</text>
						</view>
					</view>
					<view class="guide-item" @click="viewTemplates" hover-class="guide-item-hover">
						<view class="guide-icon">📋</view>
						<view class="guide-content">
							<text class="guide-title">攻略模板</text>
							<text class="guide-desc">使用模板快速开始规划</text>
						</view>
					</view>
					<view class="guide-item" @click="startAIChat" hover-class="guide-item-hover">
						<view class="guide-icon">🤖</view>
						<view class="guide-content">
							<text class="guide-title">一键定制旅行</text>
							<text class="guide-desc">AI助手智能推荐景点路线</text>
						</view>
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
						<view class="feature-icon">🗺️</view>
						<text class="feature-title">智能路线规划</text>
						<text class="feature-desc">自动优化行程路线，节省时间</text>
					</view>
					<view class="feature-item">
						<view class="feature-icon">💰</view>
						<text class="feature-title">预算管理</text>
						<text class="feature-desc">实时计算旅行费用</text>
					</view>
					<view class="feature-item">
						<view class="feature-icon">📅</view>
						<text class="feature-title">时间安排</text>
						<text class="feature-desc">合理分配每日行程</text>
					</view>
					<view class="feature-item">
						<view class="feature-icon">📱</view>
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
	.home-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
	}
	
	.welcome-bar {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 30rpx 30rpx 40rpx;
		color: white;
	}
	
	.welcome-info {
		display: flex;
		align-items: center;
	}
	
	.user-avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin-right: 20rpx;
		border: 2rpx solid rgba(255,255,255,0.3);
	}
	
	.user-details {
		display: flex;
		flex-direction: column;
	}
	
	.user-name {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 8rpx;
	}
	
	.user-welcome {
		font-size: 24rpx;
		opacity: 0.9;
	}
	
	.header-bg {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
		background: rgba(255,255,255,0.2);
		border: 2rpx solid rgba(255,255,255,0.5);
		border-radius: 50rpx;
		padding: 20rpx 40rpx;
		color: white;
		font-size: 28rpx;
		font-weight: bold;
	}
	
	.button-hover {
		background: rgba(255,255,255,0.3);
	}
	
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
		color: #333333;
	}
	
	.planning-guide {
		display: flex;
		flex-direction: column;
	}
	
	.guide-item {
		display: flex;
		align-items: center;
		padding: 30rpx;
		background-color: #f8f9fa;
		border-radius: 20rpx;
		border: 2rpx solid #e9ecef;
		margin-bottom: 20rpx;
	}
	
	.guide-item:last-child {
		margin-bottom: 0;
	}
	
	.guide-item-hover {
		background-color: #e9ecef;
		transform: scale(0.98);
	}
	
	.guide-icon {
		font-size: 48rpx;
		margin-right: 20rpx;
	}
	
	.guide-content {
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	
	.guide-title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333333;
		margin-bottom: 8rpx;
	}
	
	.guide-desc {
		font-size: 22rpx;
		color: #666666;
	}
	
	.features-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	
	.feature-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 25rpx 15rpx;
		background-color: #f8f9fa;
		border-radius: 15rpx;
		width: 48%;
		margin-bottom: 20rpx;
		box-sizing: border-box;
	}
	
	.feature-item:nth-child(2n) {
		margin-right: 0;
	}
	
	.feature-icon {
		font-size: 40rpx;
		margin-bottom: 15rpx;
	}
	
	.feature-title {
		font-size: 24rpx;
		font-weight: bold;
		color: #333333;
		margin-bottom: 8rpx;
	}
	
	.feature-desc {
		font-size: 20rpx;
		color: #666666;
		line-height: 1.4;
	}
</style>