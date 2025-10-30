<template>
	<view class="guide-container">
		<view class="header">
			<text class="title">攻略详情</text>
			<text class="subtitle">查看完整的旅行攻略</text>
		</view>
		
		<view class="guide-content">
			<view class="placeholder-guide">
				<text class="guide-icon">📋</text>
				<text class="guide-text">攻略详情页面</text>
				<text class="guide-desc">这里将显示完整的旅行攻略内容</text>
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
	.guide-container {
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
	
	.guide-content {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 60rpx 0;
	}
	
	.placeholder-guide {
		text-align: center;
		padding: 60rpx 40rpx;
		background-color: #f8f9fa;
		border-radius: 20rpx;
		border: 2rpx dashed #dee2e6;
	}
	
	.guide-icon {
		font-size: 80rpx;
		display: block;
		margin-bottom: 20rpx;
	}
	
	.guide-text {
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
		display: block;
		margin-bottom: 10rpx;
	}
	
	.guide-desc {
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