<template>
	<view class="community-container">
		<!-- 社区头部 -->
		<view class="community-header">
			<view class="header-content">
				<text class="page-title">旅行社区</text>
				<text class="page-subtitle">与志同道合的旅行者交流分享</text>
			</view>
		</view>
		
		<!-- 搜索栏 -->
		<view class="search-section">
			<view class="search-container">
				<input class="search-input" placeholder="搜索帖子、用户或话题..." @input="onSearchInput" :value="searchText" />
				<button class="search-btn" @click="searchPosts">搜索</button>
			</view>
		</view>
		
		<!-- 内容区域 -->
		<view class="main-content">
			<!-- 热门分类 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">热门分类</text>
				</view>
				<view class="category-grid">
					<view class="category-item" v-for="category in hotCategories" :key="category.id" @click="viewCategory(category.name)">
						<view class="category-icon">{{category.icon}}</view>
						<text class="category-name">{{category.name}}</text>
						<text class="category-count">{{category.count}} 讨论</text>
					</view>
				</view>
			</view>
			
			<!-- 旅行风格 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">旅行风格</text>
				</view>
				<view class="style-grid">
					<view class="style-item" v-for="style in travelStyles" :key="style.id" @click="selectTravelStyle(style.name)">
						<view class="style-icon">{{style.icon}}</view>
						<text class="style-name">{{style.name}}</text>
						<text class="style-desc">{{style.desc}}</text>
					</view>
				</view>
			</view>
			
			<!-- 最新帖子 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">最新帖子</text>
					<text class="view-all" @click="viewAllPosts">查看全部</text>
				</view>
				<view class="posts-list">
					<view class="post-item" v-for="post in latestPosts" :key="post.id" @click="viewPostDetail(post.id)">
						<view class="post-header">
							<image class="author-avatar" :src="post.authorAvatar" mode="aspectFill"></image>
							<view class="author-info">
								<text class="author-name">{{post.authorName}}</text>
								<text class="post-time">{{post.createTime}}</text>
							</view>
						</view>
						<view class="post-content">
							<text class="post-title">{{post.title}}</text>
							<text class="post-excerpt">{{post.content}}</text>
						</view>
						<view class="post-footer">
							<view class="post-stats">
								<text class="stat-item">❤️ {{post.likes}}</text>
								<text class="stat-item">💬 {{post.comments}}</text>
							</view>
							<text class="post-tag">{{post.tag}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 发布按钮 -->
		<view class="publish-fab" @click="createPost">
			<text class="fab-icon">+</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchText: '',
				hotCategories: [
					{ id: 1, name: '饮食', icon: '🍽️', count: 312 },
					{ id: 2, name: '交通', icon: '🚗', count: 156 },
					{ id: 3, name: '住宿', icon: '🏨', count: 234 },
					{ id: 4, name: '景点', icon: '🏞️', count: 189 }
				],
				travelStyles: [
					{ id: 1, name: '特种兵式', icon: '⚡', desc: '高效打卡' },
					{ id: 2, name: '拍照打卡式', icon: '📸', desc: '记录美好' },
					{ id: 3, name: '细品慢游式', icon: '🌿', desc: '深度体验' }
				],
				latestPosts: [
					{
						id: 1,
						authorAvatar: '/static/images/default-avatar.png',
						authorName: '旅行达人',
						createTime: '2小时前',
						title: '云南大理深度游攻略',
						content: '分享我在大理7天的深度游玩体验，包括小众景点和美食推荐...',
						likes: 45,
						comments: 23,
						tag: '国内游'
					},
					{
						id: 2,
						authorAvatar: '/static/images/default-avatar.png',
						authorName: '摄影爱好者',
						createTime: '5小时前',
						title: '日本京都红叶季摄影指南',
						content: '京都红叶季最佳拍摄地点和时间安排，附详细路线规划...',
						likes: 78,
						comments: 34,
						tag: '出境游'
					},
					{
						id: 3,
						authorAvatar: '/static/images/default-avatar.png',
						authorName: '自驾游玩家',
						createTime: '1天前',
						title: '川西环线自驾游全攻略',
						content: '成都出发，7天川西小环线自驾游路线，包含住宿和美食推荐...',
						likes: 112,
						comments: 56,
						tag: '自驾游'
					}
				]
			}
		},
		methods: {
			onSearchInput(e) {
				this.searchText = e.detail.value;
			},
			searchPosts() {
				if (!this.searchText.trim()) {
					uni.showToast({
						title: '请输入搜索内容',
						icon: 'none'
					});
					return;
				}

				uni.showLoading({
					title: '搜索中...'
				});

				setTimeout(() => {
					uni.hideLoading();
					uni.showToast({
						title: '搜索完成',
						icon: 'success'
					});
				}, 1000);
			},
			viewCategory(category) {
				uni.showToast({
					title: `查看分类: ${category}`,
					icon: 'none'
				});
			},
			selectTravelStyle(style) {
				uni.showToast({
					title: `选择旅行风格: ${style}`,
					icon: 'none'
				});
			},
			viewAllPosts() {
				uni.showToast({
					title: '查看全部帖子',
					icon: 'none'
				});
			},
			viewPostDetail(postId) {
				uni.showToast({
					title: `查看帖子详情: ${postId}`,
					icon: 'none'
				});
			},
			createPost() {
				uni.navigateTo({
					url: '/pages/publish/publish'
				});
			}
		},
		onShow() {
			console.log('社区页面显示');
		}
	}
</script>

<style>
	.community-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
	}
	
	.community-header {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 60rpx 30rpx 40rpx;
		color: white;
	}
	
	.header-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}
	
	.page-title {
		font-size: 48rpx;
		font-weight: bold;
		margin-bottom: 15rpx;
	}
	
	.page-subtitle {
		font-size: 28rpx;
		opacity: 0.9;
	}
	
	.search-section {
		padding: 30rpx;
		background-color: #f8f9fa;
	}
	
	.search-container {
		display: flex;
		align-items: center;
		gap: 15rpx;
	}
	
	.search-input {
		flex: 1;
		height: 70rpx;
		padding: 0 25rpx;
		border: 2rpx solid #e5e5e5;
		border-radius: 35rpx;
		font-size: 28rpx;
		background-color: white;
	}
	
	.search-btn {
		height: 70rpx;
		padding: 0 30rpx;
		background-color: #1A9E8F;
		color: white;
		border-radius: 35rpx;
		font-size: 28rpx;
		font-weight: bold;
		border: none;
	}
	
	.main-content {
		flex: 1;
		padding: 30rpx;
	}
	
	.section {
		margin-bottom: 50rpx;
	}
	
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 25rpx;
	}
	
	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
	}
	
	.view-all {
		font-size: 24rpx;
		color: #1A9E8F;
	}
	
	.category-grid {
		display: flex;
		flex-wrap: nowrap;
		gap: 15rpx;
		justify-content: space-between;
	}
	
	.category-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20rpx 10rpx;
		background-color: #f8f9fa;
		border: 1rpx solid #e9ecef;
		border-radius: 12rpx;
		width: calc(25% - 12rpx);
		box-sizing: border-box;
		color: #333333;
		transition: all 0.2s ease;
	}
	
	.category-item:hover {
		background-color: #ffffff;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
		transform: translateY(-2rpx);
	}
	
	.category-icon {
		font-size: 36rpx;
		margin-bottom: 12rpx;
		color: #1A9E8F;
	}
	
	.category-name {
		font-size: 24rpx;
		font-weight: 600;
		margin-bottom: 6rpx;
		color: #333333;
	}
	
	.category-count {
		font-size: 18rpx;
		color: #666666;
		opacity: 0.8;
	}
	
	.style-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
	}
	
	.style-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 25rpx 15rpx;
		background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
		border-radius: 15rpx;
		width: calc(33.333% - 14rpx);
		box-sizing: border-box;
		color: white;
		transition: all 0.2s ease;
	}
	
	.style-icon {
		font-size: 48rpx;
		margin-bottom: 10rpx;
	}
	
	.style-name {
		font-size: 24rpx;
		font-weight: bold;
		margin-bottom: 5rpx;
	}
	
	.style-desc {
		font-size: 20rpx;
		opacity: 0.9;
	}
	
	.posts-list {
		display: flex;
		flex-direction: column;
		gap: 25rpx;
	}
	
	.post-item {
		padding: 30rpx;
		background-color: #f8f9fa;
		border-radius: 15rpx;
		border: 2rpx solid #e9ecef;
	}
	
	.post-header {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.author-avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		margin-right: 15rpx;
	}
	
	.author-info {
		display: flex;
		flex-direction: column;
	}
	
	.author-name {
		font-size: 26rpx;
		font-weight: bold;
		color: #333333;
		margin-bottom: 5rpx;
	}
	
	.post-time {
		font-size: 22rpx;
		color: #666666;
	}
	
	.post-content {
		margin-bottom: 20rpx;
	}
	
	.post-title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333333;
		margin-bottom: 10rpx;
		display: block;
	}
	
	.post-excerpt {
		font-size: 24rpx;
		color: #666666;
		line-height: 1.5;
	}
	
	.post-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.post-stats {
		display: flex;
		gap: 20rpx;
	}
	
	.stat-item {
		font-size: 22rpx;
		color: #666666;
	}
	
	.post-tag {
		font-size: 22rpx;
		color: #1A9E8F;
		background-color: rgba(26, 158, 143, 0.1);
		padding: 5rpx 15rpx;
		border-radius: 10rpx;
	}
	
	.publish-fab {
		position: fixed;
		right: 40rpx;
		bottom: 40rpx;
		width: 100rpx;
		height: 100rpx;
		background-color: #1A9E8F;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4rpx 20rpx rgba(26, 158, 143, 0.3);
	}
	
	.fab-icon {
		font-size: 40rpx;
		color: white;
		font-weight: bold;
	}
</style>