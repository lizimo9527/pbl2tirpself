<template>
	<view class="home-container">
		<!-- 1. 欢迎信息栏（保留原功能，改样式匹配图片顶部） -->
		<view class="welcome-bar">
			<view class="welcome-info">
				<!-- 保留原logo -->
				<view class="app-logo">
					<text class="logo-icon">🌍</text>
				</view>
				<view class="user-details">
					<text class="user-name">欢迎使用TripSelf</text>
					<text class="user-welcome">开始规划您的完美旅程</text>
				</view>
			</view>
		</view>
		
		<!-- 2. 英雄区域（保留原按钮功能，改样式匹配图片标题区） -->
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
		
		<!-- 3. 主要内容区域（仅保留原4个功能，改样式匹配图片网格布局） -->
		<view class="main-content">
			<!-- 制作攻略引导区（保留原4个功能，改样式为图片网格卡片） -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">开始你的旅行规划</text>
				</view>
				<!-- 关键修改：将原纵向列表改为图片风格的2列网格 -->
				<view class="planning-grid">
					<!-- 原功能1：创建新攻略 -->
					<view class="guide-card" @click="startPlanning">
						<text class="guide-icon">📝</text>
						<text class="guide-title">创建新攻略</text>
					</view>
					<!-- 原功能2：我的攻略 -->
					<view class="guide-card" @click="viewMyPlans">
						<text class="guide-icon">📂</text>
						<text class="guide-title">我的攻略</text>
					</view>
					<!-- 原功能3：攻略模板 -->
					<view class="guide-card" @click="viewTemplates">
						<text class="guide-icon">📋</text>
						<text class="guide-title">攻略模板</text>
					</view>
					<!-- 原功能4：一键定制旅行 -->
					<view class="guide-card" @click="startAIChat">
						<text class="guide-icon">🤖</text>
						<text class="guide-title">一键定制旅行</text>
					</view>
				</view>
			</view>
			
			<!-- 攻略制作特色（保留原4个特色，改样式+修正文案匹配图片） -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">攻略制作特色</text>
				</view>
				<!-- 关键修改：改为图片风格的3列网格，修正文案 -->
				<view class="features-grid">
					<!-- 原特色1：智能路线规划（改文案匹配图片） -->
					<view class="feature-card">
						<text class="feature-icon">🗺️</text>
						<text class="feature-title">智能路线规划</text>
						<text class="feature-desc">河状沱佳线等，谁用谁通</text>
					</view>
					<!-- 原特色2：预算管理（改文案匹配图片） -->
					<view class="feature-card">
						<text class="feature-icon">💰</text>
						<text class="feature-title">预算管理</text>
						<text class="feature-desc">实现计划旅行费用</text>
					</view>
					<!-- 原特色3：时间安排（保留核心） -->
					<view class="feature-card">
						<text class="feature-icon">📅</text>
						<text class="feature-title">时间安排</text>
						<text class="feature-desc">合理分配每日行程</text>
					</view>
					<!-- 原特色4：多端同步（保留核心） -->
					<view class="feature-card">
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
	
	/* 规划引导区域样式 - 2列网格布局 */
	.planning-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	
	.guide-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 40rpx 20rpx;
		background-color: white;
		border-radius: 20rpx;
		width: 48%;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
		height: 220rpx;
		justify-content: center;
		box-sizing: border-box;
		margin-bottom: 20rpx;
		transition: all 0.3s ease;
	}
	
	.guide-card:active {
		transform: scale(0.98);
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	}
	
	.guide-icon {
		font-size: 60rpx;
		color: #2a9d8f;
		margin-bottom: 20rpx;
	}
	
	.guide-title {
		font-size: 28rpx;
		font-weight: bold;
		color: #264653;
	}
	
	/* 特色功能区域样式 - 2列网格布局 */
	.features-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	
	.feature-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 35rpx 20rpx;
		background-color: white;
		border-radius: 20rpx;
		width: 48%;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
		height: 220rpx;
		justify-content: center;
		box-sizing: border-box;
		margin-bottom: 20rpx;
		transition: all 0.3s ease;
	}
	
	.feature-card:active {
		transform: scale(0.98);
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	}
	
	.feature-icon {
		font-size: 60rpx;
		color: #2a9d8f;
		margin-bottom: 20rpx;
	}
	
	.feature-title {
		font-size: 28rpx;
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