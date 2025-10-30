<template>
	<view class="templates-container">
		<!-- 页面头部 -->
		<view class="templates-header">
			<view class="header-content">
				<text class="page-title">攻略模板</text>
				<text class="page-subtitle">选择模板快速创建攻略</text>
			</view>
		</view>
		
		<!-- 搜索栏 -->
		<view class="search-section">
			<view class="search-container">
				<input class="search-input" placeholder="搜索模板..." @input="onSearchInput" :value="searchText" />
				<button class="search-btn" @click="searchTemplates">搜索</button>
			</view>
		</view>
		
		<!-- 模板分类 -->
		<view class="category-section">
			<scroll-view class="category-scroll" scroll-x="true">
				<view class="category-tags">
					<text class="category-tag" :class="{ active: currentCategory === 'all' }" @click="filterTemplates('all')">全部</text>
					<text class="category-tag" :class="{ active: currentCategory === 'hebei' }" @click="filterTemplates('hebei')">河北省特色</text>
					<text class="category-tag" :class="{ active: currentCategory === 'domestic' }" @click="filterTemplates('domestic')">国内游</text>
					<text class="category-tag" :class="{ active: currentCategory === 'overseas' }" @click="filterTemplates('overseas')">出境游</text>
					<text class="category-tag" :class="{ active: currentCategory === 'self-driving' }" @click="filterTemplates('self-driving')">自驾游</text>
					<text class="category-tag" :class="{ active: currentCategory === 'backpacking' }" @click="filterTemplates('backpacking')">背包客</text>
					<text class="category-tag" :class="{ active: currentCategory === 'food' }" @click="filterTemplates('food')">美食之旅</text>
				</view>
			</scroll-view>
		</view>
		
		<!-- 模板列表 -->
		<view class="main-content">
			<view class="templates-grid">
				<view class="template-item" v-for="template in filteredTemplates" :key="template.id" @click="useTemplate(template.id)">
					<view class="template-image">
						<image :src="template.image" mode="aspectFill" class="template-img"></image>
						<view class="template-category">{{template.category}}</view>
					</view>
					<view class="template-content">
						<text class="template-title">{{template.title}}</text>
						<text class="template-desc">{{template.description}}</text>
						<view class="template-stats">
							<text class="template-stat">⭐ {{template.rating}}</text>
							<text class="template-stat">👥 {{template.usageCount}} 人使用</text>
						</view>
						<view class="template-tags">
							<text class="template-tag" v-for="tag in template.tags" :key="tag">{{tag}}</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 空状态 -->
			<view class="empty-state" v-if="templatesList.length === 0">
				<view class="empty-icon">📋</view>
				<text class="empty-text">暂无模板</text>
				<text class="empty-desc">更多模板正在开发中...</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchText: '',
				currentCategory: 'all',
				templatesList: [
					{
						id: 1,
						guideId: 'hebei_classic_3days',
						image: '/static/images/hebei-classic.jpg',
						category: '河北省特色',
						title: '河北经典3日游',
						description: '承德避暑山庄、秦皇岛北戴河、山海关经典路线',
						rating: 4.8,
						usageCount: 156,
						tags: ['3天行程', '经典路线', '历史古迹']
					},
					{
						id: 2,
						guideId: 'hebei_cultural_5days',
						image: '/static/images/hebei-cultural.jpg',
						category: '河北省特色',
						title: '河北文化深度5日游',
						description: '保定直隶总督署、正定古城、赵州桥文化之旅',
						rating: 4.7,
						usageCount: 89,
						tags: ['5天行程', '文化深度', '历史探索']
					},
					{
						id: 3,
						guideId: 'hebei_natural_4days',
						image: '/static/images/hebei-natural.jpg',
						category: '河北省特色',
						title: '河北自然风光4日游',
						description: '野三坡、白石山、苍岩山自然风光探索',
						rating: 4.9,
						usageCount: 123,
						tags: ['4天行程', '自然风光', '户外探险']
					},
					{
						id: 4,
						guideId: 'hebei_greatwall_2days',
						image: '/static/images/hebei-greatwall.jpg',
						category: '河北省特色',
						title: '河北长城精华2日游',
						description: '金山岭长城、喜峰口长城长城文化体验',
						rating: 4.6,
						usageCount: 78,
						tags: ['2天行程', '长城文化', '摄影之旅']
					}
				]
			}
		},
		computed: {
			filteredTemplates() {
				if (this.currentCategory === 'all') {
					return this.templatesList;
				} else if (this.currentCategory === 'hebei') {
					return this.templatesList.filter(template => template.category === '河北省特色');
				} else {
					return this.templatesList.filter(template => template.category === this.currentCategory);
				}
			}
		},
		methods: {
			onSearchInput(e) {
				this.searchText = e.detail.value;
			},
			searchTemplates() {
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
			filterTemplates(category) {
				this.currentCategory = category;
				uni.showToast({
					title: `筛选: ${category}`,
					icon: 'none'
				});
			},
			useTemplate(templateId) {
				const template = this.templatesList.find(item => item.id === templateId);
				if (template) {
					uni.navigateTo({
						url: `/pages/guide/detail/detail?id=${template.guideId}`
					});
				}
			}
		}
	}
</script>

<style>
	.templates-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
	}
	
	.templates-header {
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
		border-bottom: 2rpx solid #e9ecef;
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
	
	.category-section {
		padding: 20rpx 30rpx;
		background-color: white;
		border-bottom: 2rpx solid #f0f0f0;
	}
	
	.category-scroll {
		white-space: nowrap;
	}
	
	.category-tags {
		display: flex;
		gap: 20rpx;
	}
	
	.category-tag {
		padding: 15rpx 30rpx;
		background-color: #f8f9fa;
		border-radius: 25rpx;
		font-size: 26rpx;
		color: #666666;
		border: 2rpx solid transparent;
	}
	
	.category-tag.active {
		background-color: #1A9E8F;
		color: white;
		border-color: #1A9E8F;
	}
	
	.main-content {
		flex: 1;
		padding: 30rpx;
	}
	
	.templates-grid {
		display: flex;
		flex-direction: column;
		gap: 30rpx;
	}
	
	.template-item {
		background-color: #f8f9fa;
		border-radius: 15rpx;
		border: 2rpx solid #e9ecef;
		overflow: hidden;
	}
	
	.template-image {
		position: relative;
		height: 200rpx;
	}
	
	.template-img {
		width: 100%;
		height: 100%;
	}
	
	.template-category {
		position: absolute;
		top: 15rpx;
		left: 15rpx;
		background-color: rgba(26, 158, 143, 0.9);
		color: white;
		padding: 5rpx 15rpx;
		border-radius: 10rpx;
		font-size: 22rpx;
	}
	
	.template-content {
		padding: 25rpx;
	}
	
	.template-title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333333;
		margin-bottom: 10rpx;
		display: block;
	}
	
	.template-desc {
		font-size: 24rpx;
		color: #666666;
		line-height: 1.5;
		margin-bottom: 15rpx;
		display: block;
	}
	
	.template-stats {
		display: flex;
		gap: 20rpx;
		margin-bottom: 15rpx;
	}
	
	.template-stat {
		font-size: 22rpx;
		color: #666666;
	}
	
	.template-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 10rpx;
	}
	
	.template-tag {
		font-size: 20rpx;
		color: #1A9E8F;
		background-color: rgba(26, 158, 143, 0.1);
		padding: 5rpx 12rpx;
		border-radius: 8rpx;
	}
	
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 100rpx 30rpx;
		text-align: center;
	}
	
	.empty-icon {
		font-size: 80rpx;
		margin-bottom: 20rpx;
	}
	
	.empty-text {
		font-size: 28rpx;
		font-weight: bold;
		color: #333333;
		margin-bottom: 10rpx;
	}
	
	.empty-desc {
		font-size: 24rpx;
		color: #666666;
	}
</style>