<template>
	<view class="detail-container">
		<!-- 顶部导航栏 -->
		<view class="detail-header">
			<view class="header-back" @click="goBack">
				<text class="back-icon">←</text>
				<text class="back-text">返回</text>
			</view>
			<view class="header-title">攻略详情</view>
			<view class="header-actions">
				<button class="action-btn edit-btn" @click="editGuide">
					<text class="action-icon">✏️</text>
					<text class="action-text">编辑</text>
				</button>
				<button class="action-btn delete-btn" @click="deleteGuide">
					<text class="action-icon">🗑️</text>
					<text class="action-text">删除</text>
				</button>
			</view>
		</view>

		<scroll-view class="detail-content" scroll-y>
			<view v-if="loading" class="loading-state">
				<text class="loading-text">加载中...</text>
			</view>

			<view v-else-if="!guide" class="error-state">
				<text class="error-icon">❌</text>
				<text class="error-text">攻略不存在</text>
				<button class="back-btn" @click="goBack">返回列表</button>
			</view>

			<view v-else class="guide-detail">
				<!-- 封面图片 -->
				<view class="cover-section">
					<view v-if="guide.imagePath" class="cover-image">
						<image :src="guide.imagePath" mode="aspectFill" class="cover-img" />
					</view>
					<view v-else class="cover-placeholder">
						<text class="placeholder-icon">🏞️</text>
						<text class="placeholder-text">暂无封面</text>
					</view>
				</view>

				<!-- 基本信息 -->
				<view class="info-section">
					<view class="title-section">
						<text class="guide-title">{{ guide.title }}</text>
						<view class="status-badge" :class="guide.status">
							<text>{{ guide.status === 'published' ? '已发布' : '草稿' }}</text>
						</view>
					</view>

					<view class="destination-section">
						<text class="destination-icon">📍</text>
						<text class="destination-text">{{ guide.destination || '未设置目的地' }}</text>
					</view>

					<view class="meta-section">
						<view class="meta-item">
							<text class="meta-label">创建时间:</text>
							<text class="meta-value">{{ formatDate(guide.createTime) }}</text>
						</view>
						<view class="meta-item">
							<text class="meta-label">更新时间:</text>
							<text class="meta-value">{{ formatDate(guide.updateTime || guide.createTime) }}</text>
						</view>
						<view class="meta-item">
							<text class="meta-label">内容字数:</text>
							<text class="meta-value">{{ guide.content ? guide.content.length : 0 }}字</text>
						</view>
					</view>
				</view>

				<!-- 标签 -->
				<view v-if="guide.tags && guide.tags.length > 0" class="tags-section">
					<text class="section-title">标签</text>
					<view class="tags-list">
						<view 
							v-for="(tag, index) in guide.tags" 
							:key="index"
							class="tag"
						>
							<text class="tag-text">{{ tag }}</text>
						</view>
					</view>
				</view>

				<!-- 攻略内容 -->
				<view class="content-section">
					<text class="section-title">攻略内容</text>
					<view class="content-text">
						<text>{{ guide.content || '暂无内容' }}</text>
					</view>
				</view>

				<!-- 地图位置 -->
				<view v-if="guide.mapMarkers && guide.mapMarkers.length > 0" class="map-section">
					<text class="section-title">相关位置</text>
					<view class="map-container">
						<map 
							:longitude="guide.mapMarkers[0].longitude"
							:latitude="guide.mapMarkers[0].latitude"
							:scale="14"
							:markers="guide.mapMarkers"
							:polyline="getPolyline(guide.mapMarkers)"
							class="detail-map"
						></map>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import guideService from '@/services/guideService.js'

	export default {
		data() {
			return {
				guideId: '',
				guide: null,
				loading: true
			}
		},
		onLoad(options) {
			this.guideId = options.id;
			this.loadGuideDetail();
		},
		methods: {
			// 加载攻略详情
			loadGuideDetail() {
				this.loading = true;
				setTimeout(() => {
					this.guide = guideService.getGuideById(this.guideId);
					this.loading = false;
				}, 500);
			},

			// 返回上一页
			goBack() {
				uni.navigateBack();
			},

			// 编辑攻略
			editGuide() {
				uni.navigateTo({
					url: `/pages/guide/edit/edit?id=${this.guideId}`
				});
			},

			// 删除攻略
			deleteGuide() {
				uni.showModal({
					title: '确认删除',
					content: '确定要删除这个攻略吗？此操作不可恢复。',
					success: (res) => {
						if (res.confirm) {
							const success = guideService.deleteGuide(this.guideId);
							if (success) {
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								});
								setTimeout(() => {
									uni.navigateBack();
								}, 1500);
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
				return date.getFullYear() + '-' + 
					(date.getMonth() + 1).toString().padStart(2, '0') + '-' + 
					date.getDate().toString().padStart(2, '0') + ' ' +
					date.getHours().toString().padStart(2, '0') + ':' +
					date.getMinutes().toString().padStart(2, '0');
			},

			// 获取折线数据
			getPolyline(markers) {
				if (!markers || markers.length < 2) {
					return [];
				}

				// 创建折线路径
				const points = markers.map(marker => ({
					longitude: marker.longitude,
					latitude: marker.latitude
				}));

				return [{
					points: points,
					color: '#1A9E8F',
					width: 4,
					arrowLine: true,
					borderWidth: 2,
					borderColor: '#FFFFFF'
				}];
			}
		}
	}
</script>

<style>
	.detail-container {
		min-height: 100vh;
		background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
	}

	.detail-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 30rpx 20rpx;
		background: linear-gradient(135deg, #1A9E8F 0%, #2D8C7F 100%);
		color: white;
		box-shadow: 0 4rpx 20rpx rgba(26, 158, 143, 0.3);
		position: relative;
		z-index: 10;
	}

	.header-back {
		display: flex;
		align-items: center;
		gap: 8rpx;
		padding: 10rpx 15rpx;
		border-radius: 8rpx;
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(10rpx);
	}

	.back-icon {
		font-size: 28rpx;
		font-weight: bold;
	}

	.back-text {
		font-size: 26rpx;
	}

	.header-title {
		font-size: 32rpx;
		font-weight: 600;
		letter-spacing: 0.5rpx;
	}

	.header-back {
		display: flex;
		align-items: center;
		gap: 8rpx;
		padding: 10rpx 15rpx;
		border-radius: 8rpx;
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(10rpx);
	}

	.back-icon {
		font-size: 28rpx;
		font-weight: bold;
	}

	.back-text {
		font-size: 26rpx;
	}

	.header-title {
		font-size: 32rpx;
		font-weight: 600;
		letter-spacing: 0.5rpx;
	}

	.header-actions {
		display: flex;
		gap: 15rpx;
	}

	.action-btn {
		display: flex;
		align-items: center;
		padding: 14rpx 24rpx;
		border-radius: 12rpx;
		font-size: 26rpx;
		font-weight: 500;
		border: none;
		transition: all 0.3s ease;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	}

	.action-btn:active {
		transform: translateY(1rpx);
		box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.1);
	}

	.action-icon {
		margin-right: 8rpx;
		font-size: 26rpx;
	}

	.edit-btn {
		background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
		color: white;
	}

	.delete-btn {
		background: linear-gradient(135deg, #ff4d4f 0%, #cf1322 100%);
		color: white;
	}

	.detail-content {
		height: calc(100vh - 120rpx);
	}

	.loading-state, .error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 200rpx 0;
	}

	.loading-text {
		font-size: 28rpx;
		color: #666;
	}

	.error-icon {
		font-size: 80rpx;
		margin-bottom: 20rpx;
		opacity: 0.5;
	}

	.error-text {
		font-size: 28rpx;
		color: #666;
		margin-bottom: 30rpx;
	}

	.back-btn {
		background: linear-gradient(135deg, #1A9E8F 0%, #2D8C7F 100%);
		color: white;
		border: none;
		border-radius: 12rpx;
		padding: 18rpx 36rpx;
		font-size: 28rpx;
		font-weight: 500;
		box-shadow: 0 4rpx 12rpx rgba(26, 158, 143, 0.3);
		transition: all 0.3s ease;
	}

	.back-btn:active {
		transform: translateY(1rpx);
		box-shadow: 0 2rpx 6rpx rgba(26, 158, 143, 0.3);
	}

	.guide-detail {
		padding-bottom: 50rpx;
	}

	.cover-section {
		background: white;
		margin-bottom: 20rpx;
		border-radius: 16rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
	}

	.cover-image {
		height: 300rpx;
		overflow: hidden;
	}

	.cover-img {
		width: 100%;
		height: 100%;
	}

	.cover-placeholder {
		height: 200rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
		color: #6c757d;
	}

	.placeholder-icon {
		font-size: 60rpx;
		margin-bottom: 10rpx;
	}

	.placeholder-text {
		font-size: 24rpx;
	}

	.info-section {
		background: white;
		padding: 40rpx;
		margin-bottom: 20rpx;
		border-radius: 16rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
	}

	.title-section {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 20rpx;
	}

	.guide-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		flex: 1;
		margin-right: 20rpx;
	}

	.status-badge {
		font-size: 22rpx;
		padding: 6rpx 15rpx;
		border-radius: 8rpx;
		flex-shrink: 0;
	}

	.status-badge.published {
		background: #e8f5e8;
		color: #52c41a;
	}

	.status-badge.draft {
		background: #fff7e6;
		color: #fa8c16;
	}

	.destination-section {
		display: flex;
		align-items: center;
		margin-bottom: 25rpx;
	}

	.destination-icon {
		margin-right: 10rpx;
		font-size: 24rpx;
	}

	.destination-text {
		font-size: 28rpx;
		color: #666;
	}

	.meta-section {
		display: flex;
		flex-direction: column;
		gap: 12rpx;
	}

	.meta-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.meta-label {
		font-size: 24rpx;
		color: #999;
	}

	.meta-value {
		font-size: 24rpx;
		color: #666;
	}

	.tags-section, .content-section, .map-section {
		background: white;
		padding: 30rpx;
		margin-bottom: 20rpx;
	}

	.section-title {
		display: block;
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}

	.tags-list {
		display: flex;
		flex-wrap: wrap;
		gap: 15rpx;
	}

	.tag {
		background: #f0f2f5;
		border-radius: 8rpx;
		padding: 8rpx 15rpx;
	}

	.tag-text {
		font-size: 24rpx;
		color: #666;
	}

	.content-text {
		font-size: 28rpx;
		line-height: 1.6;
		color: #333;
		white-space: pre-wrap;
	}

	.map-container {
		height: 300rpx;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.detail-map {
		width: 100%;
		height: 100%;
	}
</style>