<template>
	<view class="search-container">
		<view class="search-header">
			<view class="search-bar">
				<input class="search-input" placeholder="搜索攻略、目的地、用户..." v-model="searchText" />
				<button class="search-btn" @click="handleSearch">搜索</button>
			</view>
		</view>
		
		<view class="search-content">
			<view class="placeholder-content">
				<text class="search-icon">🔍</text>
				<text class="search-text">搜索功能</text>
				<text class="search-desc">这里将显示搜索结果</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchText: ''
			}
		},
		methods: {
			handleSearch() {
				if (!this.searchText.trim()) {
					uni.showToast({
						title: '请输入搜索内容',
						icon: 'none'
					})
					return
				}
				
				uni.showLoading({
					title: '搜索中...'
				})
				
				setTimeout(() => {
					uni.hideLoading()
					uni.showToast({
						title: '搜索完成',
						icon: 'success'
					})
				}, 1500)
			}
		}
	}
</script>

<style>
	.search-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
	}
	
	.search-header {
		padding: 30rpx;
		background-color: #f8f9fa;
		border-bottom: 1rpx solid #e9ecef;
	}
	
	.search-bar {
		display: flex;
		gap: 20rpx;
		align-items: center;
	}
	
	.search-input {
		flex: 1;
		background-color: white;
		border: 2rpx solid #e9ecef;
		border-radius: 50rpx;
		padding: 20rpx 30rpx;
		font-size: 28rpx;
	}
	
	.search-btn {
		background-color: #1A9E8F;
		color: white;
		border-radius: 50rpx;
		padding: 20rpx 40rpx;
		font-size: 28rpx;
		font-weight: bold;
	}
	
	.search-content {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 100rpx 30rpx;
	}
	
	.placeholder-content {
		text-align: center;
		padding: 60rpx 40rpx;
		background-color: #f8f9fa;
		border-radius: 20rpx;
		border: 2rpx dashed #dee2e6;
	}
	
	.search-icon {
		font-size: 80rpx;
		display: block;
		margin-bottom: 20rpx;
	}
	
	.search-text {
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
		display: block;
		margin-bottom: 10rpx;
	}
	
	.search-desc {
		font-size: 24rpx;
		color: #666666;
		display: block;
	}
</style>