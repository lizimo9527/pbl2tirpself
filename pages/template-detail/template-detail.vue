<template>
	<view class="template-detail-container">
		<view class="header">
			<text class="title">模板详情</text>
			<text class="subtitle">查看攻略模板详情</text>
		</view>
		
		<view class="template-content">
			<view class="placeholder-template">
				<text class="template-icon">📋</text>
				<text class="template-text">模板详情</text>
				<text class="template-desc">这里将显示攻略模板的详细信息</text>
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
	.template-detail-container {
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
	
	.template-content {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 60rpx 0;
	}
	
	.placeholder-template {
		text-align: center;
		padding: 60rpx 40rpx;
		background-color: #f8f9fa;
		border-radius: 20rpx;
		border: 2rpx dashed #dee2e6;
	}
	
	.template-icon {
		font-size: 80rpx;
		display: block;
		margin-bottom: 20rpx;
	}
	
	.template-text {
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
		display: block;
		margin-bottom: 10rpx;
	}
	
	.template-desc {
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