<template>
	<view class="my-plans-container">
		<!-- 页面头部 -->
		<view class="my-plans-header">
			<view class="header-content">
				<text class="page-title">我的攻略</text>
				<text class="page-subtitle">查看和管理已创建的攻略</text>
			</view>
		</view>
		
		<!-- 筛选标签 -->
		<view class="filter-section">
			<scroll-view class="filter-scroll" scroll-x="true">
				<view class="filter-tags">
					<text class="filter-tag" :class="{ active: currentFilter === 'all' }" @click="filterPlans('all')">全部</text>
					<text class="filter-tag" :class="{ active: currentFilter === 'published' }" @click="filterPlans('published')">已发布</text>
					<text class="filter-tag" :class="{ active: currentFilter === 'draft' }" @click="filterPlans('draft')">草稿</text>
					<text class="filter-tag" :class="{ active: currentFilter === 'favorite' }" @click="filterPlans('favorite')">收藏</text>
				</view>
			</scroll-view>
		</view>
		
		<!-- 攻略列表 -->
		<view class="main-content">
			<view class="plans-list">
				<view class="plan-item" v-for="plan in plansList" :key="plan.id" @click="viewPlanDetail(plan.id)">
					<view class="plan-header">
						<text class="plan-title">{{plan.title}}</text>
						<text class="plan-status" :class="plan.status">{{plan.statusText}}</text>
					</view>
					<view class="plan-info">
						<text class="plan-destination">📍 {{plan.destination}}</text>
						<text class="plan-date">📅 {{plan.createTime}}</text>
					</view>
					<view class="plan-stats">
						<text class="plan-stat">👁️ {{plan.views}} 浏览</text>
						<text class="plan-stat">❤️ {{plan.likes}} 点赞</text>
						<text class="plan-stat">💬 {{plan.comments}} 评论</text>
					</view>
					<view class="plan-actions">
						<button class="action-btn edit-btn" @click="editPlan(plan.id)">编辑</button>
						<button class="action-btn delete-btn" @click="deletePlan(plan.id)">删除</button>
						<button class="action-btn share-btn" @click="sharePlan(plan.id)">分享</button>
					</view>
				</view>
			</view>
			
			<!-- 空状态 -->
			<view class="empty-state" v-if="plansList.length === 0">
				<view class="empty-icon">📂</view>
				<text class="empty-text">暂无攻略</text>
				<text class="empty-desc">开始创建您的第一个旅行攻略吧</text>
				<button class="create-btn" @click="createNewPlan">创建新攻略</button>
			</view>
		</view>
		
		<!-- 创建按钮 -->
		<view class="create-fab" @click="createNewPlan">
			<text class="fab-icon">+</text>
		</view>
	</view>
</template>

<script>
	import guideService from '@/services/guideService.js'

	export default {
		data() {
			return {
				currentFilter: 'all',
				plansList: []
			}
		},
		methods: {
			// 加载攻略数据
			loadPlans() {
				const allGuides = guideService.getGuides();
				// 过滤掉模板攻略，只显示用户创建的攻略
				const userGuides = allGuides.filter(guide => !guide.isTemplate);
				this.plansList = userGuides.map(guide => ({
					id: guide.id,
					title: guide.title,
					destination: guide.destination,
					createTime: guide.publishTime ? new Date(guide.publishTime).toLocaleDateString() : new Date(guide.createTime).toLocaleDateString(),
					status: guide.status || 'draft',
					statusText: guide.status === 'published' ? '已发布' : '草稿',
					views: guide.views || 0,
					likes: guide.likes || 0,
					comments: guide.comments || 0
				}));
			},
			
			filterPlans(filter) {
				this.currentFilter = filter;
				const allGuides = guideService.getGuides();
				// 过滤掉模板攻略，只显示用户创建的攻略
				const userGuides = allGuides.filter(guide => !guide.isTemplate);
				
				if (filter === 'all') {
					this.plansList = userGuides.map(guide => this.formatGuideData(guide));
				} else if (filter === 'published') {
					this.plansList = userGuides
						.filter(guide => guide.status === 'published')
						.map(guide => this.formatGuideData(guide));
				} else if (filter === 'draft') {
					this.plansList = userGuides
						.filter(guide => guide.status === 'draft')
						.map(guide => this.formatGuideData(guide));
				} else if (filter === 'favorite') {
					// 收藏功能暂未实现，显示所有用户攻略
					this.plansList = userGuides.map(guide => this.formatGuideData(guide));
				}
			},
			
			formatGuideData(guide) {
				return {
					id: guide.id,
					title: guide.title,
					destination: guide.destination,
					createTime: guide.publishTime ? new Date(guide.publishTime).toLocaleDateString() : new Date(guide.createTime).toLocaleDateString(),
					status: guide.status || 'draft',
					statusText: guide.status === 'published' ? '已发布' : '草稿',
					views: guide.views || 0,
					likes: guide.likes || 0,
					comments: guide.comments || 0
				};
			},
			
			viewPlanDetail(planId) {
				uni.navigateTo({
					url: `/pages/guide/detail/detail?id=${planId}`
				});
			},
			
			editPlan(planId) {
				uni.navigateTo({
					url: `/pages/create/create?id=${planId}&mode=edit`
				});
			},
			
			deletePlan(planId) {
				uni.showModal({
					title: '确认删除',
					content: '确定要删除这个攻略吗？此操作不可撤销。',
					success: (res) => {
						if (res.confirm) {
							const success = guideService.deleteGuide(planId);
							if (success) {
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								});
								// 重新加载数据
								this.loadPlans();
							} else {
								uni.showToast({
									title: '删除失败',
									icon: 'none'
								});
							}
						}
					}
				});
			},
			
			sharePlan(planId) {
				uni.showToast({
					title: '分享功能开发中',
					icon: 'none'
				});
			},
			
			createNewPlan() {
				uni.navigateTo({
					url: '/pages/create/create'
				});
			}
		},
		
		onLoad() {
			this.loadPlans();
		},
		
		onShow() {
			// 页面显示时重新加载数据，确保显示最新状态
			this.loadPlans();
		}
	}
</script>

<style>
	.my-plans-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
	}
	
	.my-plans-header {
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
	
	.filter-section {
		padding: 20rpx 30rpx;
		background-color: white;
		border-bottom: 2rpx solid #f0f0f0;
	}
	
	.filter-scroll {
		white-space: nowrap;
	}
	
	.filter-tags {
		display: flex;
		gap: 20rpx;
	}
	
	.filter-tag {
		padding: 15rpx 30rpx;
		background-color: #f8f9fa;
		border-radius: 25rpx;
		font-size: 26rpx;
		color: #666666;
		border: 2rpx solid transparent;
	}
	
	.filter-tag.active {
		background-color: #1A9E8F;
		color: white;
		border-color: #1A9E8F;
	}
	
	.main-content {
		flex: 1;
		padding: 30rpx;
	}
	
	.plans-list {
		display: flex;
		flex-direction: column;
		gap: 25rpx;
	}
	
	.plan-item {
		padding: 30rpx;
		background-color: #f8f9fa;
		border-radius: 15rpx;
		border: 2rpx solid #e9ecef;
	}
	
	.plan-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15rpx;
	}
	
	.plan-title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333333;
		flex: 1;
	}
	
	.plan-status {
		font-size: 22rpx;
		padding: 5rpx 15rpx;
		border-radius: 10rpx;
	}
	
	.plan-status.published {
		background-color: #d4edda;
		color: #155724;
	}
	
	.plan-status.draft {
		background-color: #fff3cd;
		color: #856404;
	}
	
	.plan-info {
		display: flex;
		gap: 20rpx;
		margin-bottom: 15rpx;
	}
	
	.plan-destination, .plan-date {
		font-size: 24rpx;
		color: #666666;
	}
	
	.plan-stats {
		display: flex;
		gap: 20rpx;
		margin-bottom: 20rpx;
	}
	
	.plan-stat {
		font-size: 22rpx;
		color: #666666;
	}
	
	.plan-actions {
		display: flex;
		gap: 15rpx;
	}
	
	.action-btn {
		flex: 1;
		height: 60rpx;
		border-radius: 10rpx;
		font-size: 26rpx;
		font-weight: bold;
	}
	
	.edit-btn {
		background-color: #1A9E8F;
		color: white;
		border: none;
	}
	
	.delete-btn {
		background-color: #f8f9fa;
		color: #666666;
		border: 2rpx solid #e5e5e5;
	}
	
	.share-btn {
		background-color: #f8f9fa;
		color: #666666;
		border: 2rpx solid #e5e5e5;
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
		margin-bottom: 30rpx;
	}
	
	.create-btn {
		background-color: #1A9E8F;
		color: white;
		border-radius: 10rpx;
		padding: 20rpx 40rpx;
		font-size: 28rpx;
		font-weight: bold;
		border: none;
	}
	
	.create-fab {
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