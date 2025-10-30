<template>
	<view class="database-container">
		<view class="header">
			<text class="title">数据库管理</text>
			<text class="subtitle">管理旅行数据和配置</text>
		</view>
		
		<view class="database-content">
			<view class="placeholder-database">
				<text class="database-icon">🗄️</text>
				<text class="database-text">数据库管理</text>
				<text class="database-desc">这里将显示数据库管理功能</text>
			</view>
		</view>
		
		<view class="action-buttons">
			<button class="action-btn" @click="goBack">
				<text>返回</text>
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		methods: {
			goBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style>
	.database-container {
		min-height: 100vh;
		background-color: #ffffff;
		padding: 30rpx;
	}
	
	.header {
		text-align: center;
		margin-bottom: 40rpx;
	}
	
	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333333;
		display: block;
		margin-bottom: 10rpx;
	}
	
	.subtitle {
		font-size: 24rpx;
		color: #666666;
		display: block;
	}
	
	.database-content {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 60rpx 0;
	}
	
	.placeholder-database {
		text-align: center;
		padding: 60rpx 40rpx;
		background-color: #f8f9fa;
		border-radius: 20rpx;
		border: 2rpx dashed #dee2e6;
	}
	
	.database-icon {
		font-size: 80rpx;
		display: block;
		margin-bottom: 20rpx;
	}
	
	.database-text {
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
		display: block;
		margin-bottom: 10rpx;
	}
	
	.database-desc {
		font-size: 24rpx;
		color: #666666;
		display: block;
	}
	
	.action-buttons {
		margin-top: 40rpx;
	}
	
	.action-btn {
		background-color: #1A9E8F;
		color: white;
		border-radius: 10rpx;
		padding: 20rpx 40rpx;
		font-size: 28rpx;
		font-weight: bold;
	}
</style>