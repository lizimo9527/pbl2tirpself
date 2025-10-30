<template>
	<view class="publish-container">
		<view class="header">
			<text class="title">发布帖子</text>
			<text class="subtitle">分享你的旅行经验和心得</text>
		</view>
		
		<view class="form-content">
			<view class="form-group">
				<text class="label">帖子标题</text>
				<input class="input" placeholder="请输入帖子标题" v-model="postTitle" />
			</view>
			
			<view class="form-group">
				<text class="label">帖子内容</text>
				<textarea class="textarea" placeholder="请输入帖子内容" v-model="postContent" />
			</view>
			
			<view class="form-group">
				<text class="label">添加图片</text>
				<view class="image-upload">
					<view class="upload-btn" @click="chooseImage">
						<text class="upload-icon">📷</text>
						<text class="upload-text">选择图片</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="action-buttons">
			<button class="publish-btn" @click="publishPost">
				<text>发布帖子</text>
			</button>
			<button class="cancel-btn" @click="goBack">
				<text>取消</text>
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				postTitle: '',
				postContent: ''
			}
		},
		methods: {
			chooseImage() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						console.log('选择的图片:', res.tempFilePaths)
					}
				})
			},
			publishPost() {
				if (!this.postTitle.trim()) {
					uni.showToast({
						title: '请输入帖子标题',
						icon: 'none'
					})
					return
				}
				
				if (!this.postContent.trim()) {
					uni.showToast({
						title: '请输入帖子内容',
						icon: 'none'
					})
					return
				}
				
				uni.showLoading({
					title: '发布中...'
				})
				
				setTimeout(() => {
					uni.hideLoading()
					uni.showToast({
						title: '发布成功',
						icon: 'success'
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
				}, 2000)
			},
			goBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style>
	.publish-container {
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
	
	.form-content {
		margin-bottom: 40rpx;
	}
	
	.form-group {
		margin-bottom: 30rpx;
	}
	
	.label {
		font-size: 28rpx;
		font-weight: bold;
		color: #333333;
		display: block;
		margin-bottom: 15rpx;
	}
	
	.input {
		border: 2rpx solid #e9ecef;
		border-radius: 10rpx;
		padding: 20rpx;
		font-size: 28rpx;
		background-color: #f8f9fa;
	}
	
	.textarea {
		border: 2rpx solid #e9ecef;
		border-radius: 10rpx;
		padding: 20rpx;
		font-size: 28rpx;
		background-color: #f8f9fa;
		height: 200rpx;
	}
	
	.image-upload {
		margin-top: 10rpx;
	}
	
	.upload-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border: 2rpx dashed #dee2e6;
		border-radius: 10rpx;
		padding: 40rpx 20rpx;
		background-color: #f8f9fa;
	}
	
	.upload-icon {
		font-size: 48rpx;
		margin-bottom: 10rpx;
	}
	
	.upload-text {
		font-size: 24rpx;
		color: #666666;
	}
	
	.action-buttons {
		display: flex;
		gap: 20rpx;
	}
	
	.publish-btn {
		flex: 1;
		background-color: #1A9E8F;
		color: white;
		border-radius: 10rpx;
		padding: 20rpx 40rpx;
		font-size: 28rpx;
		font-weight: bold;
	}
	
	.cancel-btn {
		flex: 1;
		background-color: #6c757d;
		color: white;
		border-radius: 10rpx;
		padding: 20rpx 40rpx;
		font-size: 28rpx;
		font-weight: bold;
	}
</style>