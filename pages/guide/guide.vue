<template>
	<view class="guide-container">
		<view class="guide-header">
			<text class="header-title">我的攻略</text>
			<view class="header-actions">
				<button class="create-btn" @click="createGuide">
					<text class="btn-icon">+</text>
					<text class="btn-text">新建攻略</text>
				</button>
			</view>
		</view>

		<view class="search-section">
			<view class="search-input">
				<text class="search-icon">🔍</text>
				<input 
					class="search-field" 
					placeholder="搜索攻略标题、目的地或标签"
					@input="onSearchInput"
					:value="searchKeyword"
				/>
			</view>
		</view>

		<view class="guide-list">
			<view v-if="filteredGuides.length === 0" class="empty-state">
				<text class="empty-icon">📝</text>
				<text class="empty-text">{{ searchKeyword ? '未找到相关攻略' : '暂无攻略' }}</text>
				<text class="empty-subtext">{{ searchKeyword ? '尝试其他关键词' : '点击"新建攻略"开始创建' }}</text>
			</view>

			<view v-else class="guide-items">
				<view 
					v-for="guide in filteredGuides" 
					:key="guide.id"
					class="guide-item"
					@click="viewGuideDetail(guide.id)"
				>
					<view class="guide-image">
						<image 
							v-if="guide.imagePath" 
							:src="guide.imagePath" 
							mode="aspectFill"
							class="guide-img"
						/>
						<view v-else class="guide-img-placeholder">
							<text class="placeholder-icon">🏞️</text>
						</view>
					</view>
					
					<view class="guide-content">
						<view class="guide-header-info">
							<text class="guide-title">{{ guide.title }}</text>
							<view class="guide-status" :class="guide.status">
								<text>{{ guide.status === 'published' ? '已发布' : '草稿' }}</text>
							</view>
						</view>
						
						<text class="guide-destination">📍 {{ guide.destination || '未设置目的地' }}</text>
						
						<view class="guide-meta">
							<text class="meta-item">{{ formatDate(guide.updateTime || guide.createTime) }}</text>
							<text class="meta-divider">•</text>
							<text class="meta-item">{{ guide.content ? guide.content.length + '字' : '0字' }}</text>
						</view>

						<view v-if="guide.tags && guide.tags.length > 0" class="guide-tags">
							<view 
								v-for="(tag, index) in guide.tags.slice(0, 3)" 
								:key="index"
								class="tag"
							>
								<text class="tag-text">{{ tag }}</text>
							</view>
							<text v-if="guide.tags.length > 3" class="tag-more">+{{ guide.tags.length - 3 }}</text>
						</view>
					</view>

					<view class="guide-actions">
						<button class="action-btn edit-btn" @click.stop="editGuide(guide.id)">
							<text class="action-icon">✏️</text>
						</button>
						<button class="action-btn delete-btn" @click.stop="deleteGuide(guide.id)">
							<text class="action-icon">🗑️</text>
						</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import guideService from '@/services/guideService.js'

	export default {
		data() {
			return {
				guides: [],
				searchKeyword: '',
				filteredGuides: []
			}
		},
		methods: {
			// 加载攻略列表
			loadGuides() {
				this.guides = guideService.getUserGuides();
				this.filterGuides();
			},

			// 搜索输入处理
			onSearchInput(e) {
				this.searchKeyword = e.detail.value;
				this.filterGuides();
			},

			// 过滤攻略
			filterGuides() {
				if (this.searchKeyword) {
					this.filteredGuides = guideService.searchGuides(this.searchKeyword);
				} else {
					this.filteredGuides = [...this.guides];
				}
			},

			// 创建新攻略
			createGuide() {
				uni.navigateTo({
					url: '/pages/create/create'
				});
			},

			// 查看攻略详情
			viewGuideDetail(guideId) {
				uni.navigateTo({
					url: `/pages/guide/detail/detail?id=${guideId}`
				});
			},

			// 编辑攻略
			editGuide(guideId) {
				uni.navigateTo({
					url: `/pages/create/create?id=${guideId}&mode=edit`
				});
			},

			// 删除攻略
			deleteGuide(guideId) {
				uni.showModal({
					title: '确认删除',
					content: '确定要删除这个攻略吗？此操作不可恢复。',
					success: (res) => {
						if (res.confirm) {
							const success = guideService.deleteGuide(guideId);
							if (success) {
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								});
								this.loadGuides();
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

			// 格式化日期
			formatDate(dateString) {
				const date = new Date(dateString);
				const now = new Date();
				const diff = now - date;
				
				if (diff < 60000) return '刚刚';
				if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
				if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
				if (diff < 604800000) return Math.floor(diff / 86400000) + '天前';
				
				return date.getFullYear() + '-' + 
					(date.getMonth() + 1).toString().padStart(2, '0') + '-' + 
					date.getDate().toString().padStart(2, '0');
			}
		},
		onShow() {
			this.loadGuides();
		}
	}
</script>

<style>
	.guide-container {
		min-height: 100vh;
		background-color: #f5f5f5;
		padding: 30rpx;
	}

	.guide-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.header-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}

	.create-btn {
		display: flex;
		align-items: center;
		background: linear-gradient(135deg, #1A9E8F, #2BB8A9);
		color: white;
		border: none;
		border-radius: 10rpx;
		padding: 15rpx 25rpx;
		font-size: 26rpx;
	}

	.btn-icon {
		margin-right: 8rpx;
		font-size: 28rpx;
	}

	.search-section {
		margin-bottom: 30rpx;
	}

	.search-input {
		display: flex;
		align-items: center;
		background: white;
		border-radius: 15rpx;
		padding: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
	}

	.search-icon {
		font-size: 28rpx;
		margin-right: 15rpx;
		color: #999;
	}

	.search-field {
		flex: 1;
		font-size: 28rpx;
		color: #333;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 100rpx 0;
	}

	.empty-icon {
		font-size: 80rpx;
		margin-bottom: 20rpx;
		opacity: 0.5;
	}

	.empty-text {
		font-size: 28rpx;
		color: #666;
		margin-bottom: 10rpx;
	}

	.empty-subtext {
		font-size: 24rpx;
		color: #999;
	}

	.guide-item {
		display: flex;
		background: white;
		border-radius: 15rpx;
		padding: 25rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
	}

	.guide-image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 10rpx;
		overflow: hidden;
		margin-right: 20rpx;
		flex-shrink: 0;
	}

	.guide-img {
		width: 100%;
		height: 100%;
	}

	.guide-img-placeholder {
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.placeholder-icon {
		font-size: 40rpx;
		opacity: 0.5;
	}

	.guide-content {
		flex: 1;
		min-width: 0;
	}

	.guide-header-info {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 10rpx;
	}

	.guide-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		flex: 1;
		margin-right: 15rpx;
	}

	.guide-status {
		font-size: 20rpx;
		padding: 4rpx 12rpx;
		border-radius: 6rpx;
		flex-shrink: 0;
	}

	.guide-status.published {
		background: #e8f5e8;
		color: #52c41a;
	}

	.guide-status.draft {
		background: #fff7e6;
		color: #fa8c16;
	}

	.guide-destination {
		font-size: 26rpx;
		color: #666;
		margin-bottom: 10rpx;
		display: block;
	}

	.guide-meta {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.meta-item {
		font-size: 22rpx;
		color: #999;
	}

	.meta-divider {
		margin: 0 10rpx;
		color: #ddd;
		font-size: 20rpx;
	}

	.guide-tags {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 8rpx;
	}

	.tag {
		background: #f0f2f5;
		border-radius: 6rpx;
		padding: 4rpx 10rpx;
	}

	.tag-text {
		font-size: 20rpx;
		color: #666;
	}

	.tag-more {
		font-size: 20rpx;
		color: #999;
	}

	.guide-actions {
		display: flex;
		flex-direction: column;
		gap: 10rpx;
		margin-left: 15rpx;
		flex-shrink: 0;
	}

	.action-btn {
		width: 60rpx;
		height: 60rpx;
		border: none;
		border-radius: 8rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
	}

	.edit-btn {
		background: #e6f7ff;
		color: #1890ff;
	}

	.delete-btn {
		background: #fff2f0;
		color: #ff4d4f;
	}
</style>