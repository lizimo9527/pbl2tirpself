<template>
	<view class="edit-container">
		<!-- 编辑模式 -->
		<view v-if="!showPreview">
			<!-- 顶部导航栏 -->
			<view class="edit-header">
				<view class="header-back" @click="goBack">
					<text class="back-icon">←</text>
					<text class="back-text">返回</text>
				</view>
				<view class="header-title">{{editMode ? '编辑攻略' : '创建攻略'}}</view>
				<view class="header-actions">
					<button class="action-btn preview-btn" @click="togglePreview" v-if="content">
						<text class="action-icon">👁️</text>
						<text class="action-text">预览</text>
					</button>
					<button class="action-btn save-btn" @click="saveDraft">
						<text class="action-icon">💾</text>
						<text class="action-text">保存草稿</text>
					</button>
					<button class="action-btn publish-btn" @click="publishGuide">
						<text class="action-icon">🚀</text>
						<text class="action-text">发布</text>
					</button>
				</view>
			</view>

			<scroll-view class="edit-content" scroll-y>
				<!-- 封面图片上传 -->
				<view class="cover-section">
					<view class="cover-upload">
						<view class="cover-placeholder" v-if="!imagePath" @click="chooseImage">
							<text class="placeholder-icon">🏞️</text>
							<text class="placeholder-text">点击上传封面图片</text>
						</view>
						<view class="cover-preview" v-else>
							<image :src="imagePath" mode="aspectFill" class="cover-image" />
							<view class="cover-overlay">
								<button class="cover-change-btn" @click="chooseImage">更换图片</button>
								<button class="cover-remove-btn" @click="removeImage">删除</button>
							</view>
						</view>
					</view>
				</view>

				<!-- 基本信息表单 -->
				<view class="form-section">
					<view class="form-item">
						<text class="form-label">攻略标题</text>
						<input class="form-input" placeholder="请输入攻略标题（必填）" @input="onTitleInput" :value="title" />
					</view>
					
					<view class="form-item">
						<text class="form-label">目的地</text>
						<input class="form-input" placeholder="请输入目的地（必填）" @input="onDestinationInput" :value="destination" />
					</view>

					<!-- 地图定位模块 -->
					<view class="map-section">
						<view class="section-header">
							<text class="section-title">地图定位</text>
							<view class="map-controls">
								<button class="map-control-btn" @click="locateOnMap">
									<text class="map-btn-icon">📍</text>
									<text>定位</text>
								</button>
								<button class="map-control-btn" @click="searchOnMap">
									<text class="map-btn-icon">🔍</text>
									<text>搜索</text>
								</button>
								<button class="map-control-btn clear-btn" @click="clearMarkers">
									<text class="map-btn-icon">🗑️</text>
									<text>清除</text>
								</button>
							</view>
						</view>
						
						<view class="map-container">
							<map 
								id="editMap"
								:longitude="mapCenter.longitude"
								:latitude="mapCenter.latitude"
								:scale="mapScale"
								:markers="markers"
								:polyline="polyline"
								:show-location="true"
								:enable-zoom="true"
								:enable-scroll="true"
								class="tencent-map"
								@tap="onMapTap"
								@markertap="onMarkerTap"
							></map>
							
							<!-- 地图加载状态 -->
							<view class="map-loading" v-if="isMapLoading">
								<text class="loading-icon">⏳</text>
								<text class="loading-text">地图加载中...</text>
							</view>
							
							<!-- 坐标信息显示 -->
							<view class="map-coordinates" v-if="selectedLocation">
								<text class="coordinate-text">📍 {{selectedLocation.address || '自定义位置'}}</text>
								<text class="coordinate-text">经度: {{selectedLocation.longitude.toFixed(6)}} 纬度: {{selectedLocation.latitude.toFixed(6)}}</text>
							</view>
						</view>
					</view>
					
					<!-- 攻略内容 -->
					<view class="content-section">
						<view class="section-header">
							<text class="section-title">攻略内容</text>
							<button class="ai-generate-btn" @click="generateWithAI" :disabled="isGenerating">
								<text class="ai-icon">🤖</text>
								<text class="ai-text">{{isGenerating ? '生成中...' : 'AI生成'}}</text>
							</button>
						</view>
						<textarea class="content-textarea" placeholder="请输入详细的攻略内容...（必填）" @input="onContentInput" :value="content" maxlength="2000" />
						<view class="word-count">{{content.length}}/2000</view>
					</view>
					
					<!-- 标签管理 -->
					<view class="tags-section">
						<text class="section-title">标签</text>
						<view class="tags-input-container">
							<input class="tags-input" placeholder="输入标签后按回车添加" @input="onTagInput" :value="tagInput" @confirm="addTag" />
							<text class="tags-hint">最多可添加5个标签</text>
						</view>
						<view class="tags-list">
							<view class="tag-item" v-for="(tag, index) in tags" :key="index">
								<text class="tag-text">{{tag}}</text>
								<text class="tag-remove" @click="removeTag(index)">×</text>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 预览模式 -->
		<view v-else class="template-detail-container">
			<!-- 顶部导航栏 -->
			<view class="detail-header">
				<!-- 第一行：返回按钮和标题 -->
				<view class="header-top-row">
					<view class="header-back" @click="togglePreview">
						<text class="back-icon">←</text>
						<text class="back-text">返回编辑</text>
					</view>
					<view class="header-title">{{title || '未命名攻略'}}</view>
					<view style="width: 120rpx;"></view> <!-- 占位，保持平衡 -->
				</view>
				
				<!-- 第二行：按钮 -->
				<view class="header-actions">
					<button class="action-btn save-btn" @click="saveDraft">
						<text class="action-icon">💾</text>
						<text class="action-text">保存草稿</text>
					</button>
					<button class="action-btn publish-btn" @click="publishGuide">
						<text class="action-icon">🚀</text>
						<text class="action-text">发布</text>
					</button>
				</view>
			</view>

			<scroll-view class="detail-content" scroll-y>
				<!-- 旅行攻略卡片 -->
				<view class="travel-guide-card">
					<!-- 背景图区域 -->
					<view class="banner-section">
						<image :src="imagePath || '/static/images/default-cover.jpg'" mode="aspectFill" class="banner-image" />
						<view class="banner-overlay"></view>
						<view class="banner-content">
							<text class="guide-title">{{title || '未命名攻略'}}</text>
							<text class="guide-subtitle">{{destination ? `探索${destination}的精彩旅程` : '创建您的专属旅行攻略'}}</text>
						</view>
					</view>
					
					<!-- 按天行程展示 -->
					<view class="days-section">
						<view class="section-header">
							<text class="section-title">行程安排</text>
							<view class="days-actions" v-if="days && days.length > 0">
								<button class="action-btn batch-coordinates-btn" @click="batchAddCoordinates" v-if="days.some(day => day.attractions && day.attractions.some(attraction => !attraction.coordinates))">
									<text class="action-icon">📍</text>
									<text class="action-text">批量添加坐标</text>
								</button>
								<button class="action-btn refresh-map-btn" @click="generateMapMarkersFromDays">
									<text class="action-icon">🔄</text>
									<text class="action-text">刷新地图</text>
								</button>
							</view>
						</view>
						<view class="days-container" v-if="days && days.length > 0">
							<view class="day-item" v-for="day in days" :key="day.day">
								<view class="day-header" @click="toggleDay(day.day)">
									<view class="day-badge">
										<text class="day-number">第{{day.day}}天</text>
									</view>
									<text class="day-title">{{day.title}}</text>
									<text class="day-expand-icon">{{day.expanded ? '▼' : '▶'}}</text>
								</view>
								<view class="day-content" v-if="day.expanded">
									<view class="attractions-list">
										<view class="attraction-item" v-for="(attraction, index) in day.attractions" :key="attraction.id">
											<view class="attraction-header" @click="toggleAttraction(attraction.id)">
												<view class="attraction-order">{{index + 1}}</view>
												<text class="attraction-name">{{attraction.name}}</text>
												<text class="attraction-expand-icon">{{attraction.expanded ? '▼' : '▶'}}</text>
											</view>
											<view class="attraction-details" :class="{'expanded': attraction.expanded}" v-if="attraction.expanded">
												<text class="attraction-description">{{attraction.description}}</text>
												<view class="attraction-meta">
													<text class="attraction-duration">⏱️ {{attraction.duration}}</text>
													<text class="coordinates-status" :class="{ 'has-coordinates': attraction.coordinates, 'no-coordinates': !attraction.coordinates }">
														{{attraction.coordinates ? '📍 已添加坐标' : '❌ 未添加坐标'}}
													</text>
												</view>
												<view class="transportation-preview">
													<text class="transportation-title">🚗 交通方式：</text>
													<view class="transportation-options">
														<text v-if="attraction.transportation && attraction.transportation.subway" class="transportation-option">
															🚇 地铁：{{attraction.transportation.subway.time}}，费用{{attraction.transportation.subway.cost}}
														</text>
														<text v-if="attraction.transportation && attraction.transportation.taxi" class="transportation-option">
															🚕 出租车：{{attraction.transportation.taxi.time}}，费用{{attraction.transportation.taxi.cost}}
														</text>
														<text v-if="!attraction.transportation || (!attraction.transportation.subway && !attraction.transportation.taxi)" class="transportation-option">
															暂无交通信息
														</text>
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view v-else class="no-data-tips">
							<text class="no-data-icon">📝</text>
							<text class="no-data-text">暂无行程安排，请先编辑攻略内容</text>
						</view>
					</view>

					<!-- 攻略内容 -->
					<view class="content-section">
						<view class="section-header">
							<text class="section-title">攻略内容</text>
						</view>
						<view class="content-text">{{content || '暂无内容，请添加详细的攻略内容...'}}</view>
					</view>

					<!-- 标签区域 -->
					<view class="tags-section" v-if="tags.length > 0">
						<text class="section-title">标签</text>
						<view class="tags-list">
							<view class="tag-item" v-for="(tag, index) in tags" :key="index">
								<text class="tag-text">{{tag}}</text>
							</view>
						</view>
					</view>

					<!-- 旅行小贴士 -->
					<view class="tips-section">
						<text class="tips-title">旅行小贴士</text>
						<view class="tips-list">
							<view class="tip-item">
								<text class="tip-icon">ℹ️</text>
								<text class="tip-text">建议提前规划行程，合理安排时间</text>
							</view>
							<view class="tip-item">
								<text class="tip-icon">📍</text>
								<text class="tip-text">携带必要的旅行用品和药品</text>
							</view>
							<view class="tip-item">
								<text class="tip-icon">☀️</text>
								<text class="tip-text">根据天气情况准备合适的衣物</text>
							</view>
							<view class="tip-item">
								<text class="tip-icon">🍽️</text>
								<text class="tip-text">品尝当地特色美食，体验地道文化</text>
							</view>
						</view>
					</view>

					<!-- 行程地图 -->
					<view class="map-section">
						<view class="section-header">
							<text class="section-title">行程地图</text>
							<button class="map-control-btn" @click="showMapModal = true">
								<text class="map-btn-icon">🗺️</text>
								<text>查看大图</text>
							</button>
						</view>
						<view class="map-container">
							<map 
								id="previewMap"
								:longitude="mapCenter.longitude"
								:latitude="mapCenter.latitude"
								:scale="mapScale"
								:markers="markers"
								:polyline="polyline"
								:show-location="true"
								class="tencent-map"
							></map>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 地图弹窗 -->
		<view class="map-modal" v-if="showMapModal">
			<view class="modal-overlay" @click="showMapModal = false"></view>
			<view class="modal-content">
				<view class="modal-header">
					<text class="modal-title">{{title || '攻略'}} - 行程地图</text>
					<view class="modal-close" @click="showMapModal = false">
						<text>×</text>
					</view>
				</view>
				<view class="map-container">
					<map 
						:longitude="mapCenter.longitude"
						:latitude="mapCenter.latitude"
						:scale="mapScale"
						:markers="markers"
						:polyline="polyline"
						:show-location="true"
						class="detail-map"
					></map>
				</view>
			</view>
		</view>

		<!-- 交通方式弹窗 -->
		<view class="transportation-modal" v-if="showTransportationModal">
			<view class="modal-overlay" @click="showTransportationModal = false"></view>
			<view class="modal-content">
				<view class="modal-header">
					<text class="modal-title">{{currentAttraction?.name}} - 交通方式</text>
					<view class="modal-close" @click="showTransportationModal = false">
						<text>×</text>
					</view>
				</view>
				<view class="transportation-options">
					<view class="transportation-item subway">
						<text class="transportation-icon">🚇</text>
						<view class="transportation-info">
							<text class="transportation-title">地铁</text>
							<text class="transportation-details">预计时间：{{currentAttraction?.transportation?.subway?.time}}</text>
							<text class="transportation-details">预计费用：{{currentAttraction?.transportation?.subway?.cost}}</text>
						</view>
					</view>
					<view class="transportation-item taxi">
						<text class="transportation-icon">🚕</text>
						<view class="transportation-info">
							<text class="transportation-title">出租车</text>
							<text class="transportation-details">预计时间：{{currentAttraction?.transportation?.taxi?.time}}</text>
							<text class="transportation-details">预计费用：{{currentAttraction?.transportation?.taxi?.cost}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapConfig, mapUtils } from '@/config/map.config.js'
	import guideService from '@/services/guideService.js'
	import aiService from '@/services/aiService.js'
	
	export default {
		data() {
			return {
				title: '',
				destination: '',
				content: '',
				imagePath: '',
				tagInput: '',
				tags: [],
				
				// 编辑模式相关
				editMode: false,
				guideId: '',
				
				// 地图相关数据
				mapCenter: {
					longitude: mapConfig.defaultCenter.longitude,
					latitude: mapConfig.defaultCenter.latitude
				},
				mapScale: mapConfig.zoomLevel,
				markers: [],
				selectedLocation: null,
				isMapLoading: false,
				
				// 折线相关数据
				polyline: [],
				
				// 预览模式相关
				showPreview: false,
				showMapModal: false,
				showTransportationModal: false,
				
				// 用户信息
				userInfo: {
					nickName: '游客'
				},
				
				// 行程数据
				days: [],
				currentAttraction: null,
				
				// AI生成状态
				isGenerating: false
			}
		},
		
		onLoad(options) {
			if (options.id) {
				this.editMode = true
				this.guideId = options.id
				this.loadGuideData()
			}
			
			// 初始化地图数据
			this.initMapData()
		},
		
		methods: {
			// 初始化地图数据
			initMapData() {
				// 初始化地图标记和折线
				this.markers = []
				this.polyline = []
			},
			
			// 加载攻略数据
			async loadGuideData() {
				try {
					const guideData = await guideService.getGuideById(this.guideId)
					this.title = guideData.title
					this.destination = guideData.destination
					this.content = guideData.content
					this.imagePath = guideData.imagePath
					this.tags = guideData.tags || []
					this.days = guideData.days || []
					
					// 更新地图标记
					this.generateMapMarkersFromDays()
				} catch (error) {
					console.error('加载攻略数据失败:', error)
					uni.showToast({
						title: '加载失败',
						icon: 'none'
					})
				}
			},
			
			// 标题输入
			onTitleInput(e) {
				this.title = e.detail.value
			},
			
			// 目的地输入
			onDestinationInput(e) {
				this.destination = e.detail.value
			},
			
			// 内容输入
			onContentInput(e) {
				this.content = e.detail.value
			},
			
			// 标签输入
			onTagInput(e) {
				this.tagInput = e.detail.value
			},
			
			// 添加标签
			addTag() {
				if (this.tagInput.trim() && this.tags.length < 5) {
					this.tags.push(this.tagInput.trim())
					this.tagInput = ''
				}
			},
			
			// 移除标签
			removeTag(index) {
				this.tags.splice(index, 1)
			},
			
			// 选择图片
			chooseImage() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						this.imagePath = res.tempFilePaths[0]
					}
				})
			},
			
			// 移除图片
			removeImage() {
				this.imagePath = ''
			},
			
			// 地图点击
			onMapTap(e) {
				const { latitude, longitude } = e.detail
				this.selectedLocation = {
					latitude,
					longitude
				}
				
				// 添加标记
				this.addMarker(latitude, longitude)
			},
			
			// 标记点击
			onMarkerTap(e) {
				const markerId = e.detail.markerId
				const marker = this.markers.find(m => m.id === markerId)
				if (marker) {
					this.selectedLocation = {
						latitude: marker.latitude,
						longitude: marker.longitude
					}
				}
			},
			
			// 添加标记
			addMarker(latitude, longitude) {
				const markerId = this.markers.length + 1
				this.markers.push({
					id: markerId,
					latitude,
					longitude,
					iconPath: '/static/images/marker.png',
					width: 30,
					height: 30
				})
				
				// 更新折线
				this.updatePolyline()
			},
			
			// 更新折线
			updatePolyline() {
				if (this.markers.length > 1) {
					this.polyline = [{
						points: this.markers.map(marker => ({
							latitude: marker.latitude,
							longitude: marker.longitude
						})),
						color: '#1A9E8F',
						width: 4,
						dottedLine: false
					}]
				} else {
					this.polyline = []
				}
			},
			
			// 清除标记
			clearMarkers() {
				this.markers = []
				this.polyline = []
				this.selectedLocation = null
			},
			
			// 地图定位
			locateOnMap() {
				uni.getLocation({
					type: 'gcj02',
					success: (res) => {
						this.mapCenter.latitude = res.latitude
						this.mapCenter.longitude = res.longitude
						this.addMarker(res.latitude, res.longitude)
					}
				})
			},
			
			// 地图搜索
			searchOnMap() {
				uni.showToast({
					title: '搜索功能开发中',
					icon: 'none'
				})
			},
			
			// AI生成攻略
			async generateWithAI() {
				if (!this.destination) {
					uni.showToast({
						title: '请先填写目的地',
						icon: 'none'
					})
					return
				}
				
				this.isGenerating = true
				try {
					const result = await aiService.generateGuide({
						destination: this.destination,
						days: 3
					})
					
					this.content = result.content
					this.days = result.days || []
					
					// 更新地图标记
					this.generateMapMarkersFromDays()
					
					uni.showToast({
						title: 'AI生成成功',
						icon: 'success'
					})
				} catch (error) {
					console.error('AI生成失败:', error)
					uni.showToast({
						title: '生成失败，请重试',
						icon: 'none'
					})
				} finally {
					this.isGenerating = false
				}
			},
			
			// 根据天数生成地图标记
			generateMapMarkersFromDays() {
				this.markers = []
				
				if (this.days && this.days.length > 0) {
					this.days.forEach(day => {
						if (day.attractions && day.attractions.length > 0) {
							day.attractions.forEach((attraction, index) => {
								if (attraction.coordinates) {
									this.markers.push({
										id: attraction.id || `${day.day}-${index}`,
										latitude: attraction.coordinates.latitude,
										longitude: attraction.coordinates.longitude,
										title: attraction.name,
										iconPath: '/static/images/marker.png',
										width: 30,
										height: 30
									})
								}
							})
						}
					})
					
					// 更新折线
					this.updatePolyline()
				}
			},
			
			// 批量添加坐标
			batchAddCoordinates() {
				uni.showToast({
					title: '批量添加坐标功能开发中',
					icon: 'none'
				})
			},
			
			// 切换天数展开状态
			toggleDay(dayNumber) {
				const day = this.days.find(d => d.day === dayNumber)
				if (day) {
					day.expanded = !day.expanded
				}
			},
			
			// 切换景点展开状态
			toggleAttraction(attractionId) {
				for (const day of this.days) {
					if (day.attractions) {
						const attraction = day.attractions.find(a => a.id === attractionId)
						if (attraction) {
							attraction.expanded = !attraction.expanded
							break
						}
					}
				}
			},
			
			// 切换预览模式
			togglePreview() {
				this.showPreview = !this.showPreview
				if (this.showPreview) {
					// 更新地图标记
					this.generateMapMarkersFromDays()
				}
			},
			
			// 保存草稿
			async saveDraft() {
				try {
					const guideData = {
						title: this.title,
						destination: this.destination,
						content: this.content,
						imagePath: this.imagePath,
						tags: this.tags,
						days: this.days
					}
					
					if (this.editMode) {
						await guideService.updateGuide(this.guideId, guideData)
					} else {
						await guideService.createGuide(guideData)
					}
					
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					})
				} catch (error) {
					console.error('保存草稿失败:', error)
					uni.showToast({
						title: '保存失败',
						icon: 'none'
					})
				}
			},
			
			// 发布攻略
			async publishGuide() {
				if (!this.validateForm()) {
					return
				}
				
				try {
					const guideData = {
						title: this.title,
						destination: this.destination,
						content: this.content,
						imagePath: this.imagePath,
						tags: this.tags,
						days: this.days,
						published: true
					}
					
					if (this.editMode) {
						await guideService.updateGuide(this.guideId, guideData)
					} else {
						const result = await guideService.createGuide(guideData)
						this.guideId = result.id
					}
					
					uni.showToast({
						title: '发布成功',
						icon: 'success'
					})
					
					// 返回上一页
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
				} catch (error) {
					console.error('发布攻略失败:', error)
					uni.showToast({
						title: '发布失败',
						icon: 'none'
					})
				}
			},
			
			// 表单验证
			validateForm() {
				if (!this.title.trim()) {
					uni.showToast({
						title: '请填写攻略标题',
						icon: 'none'
					})
					return false
				}
				
				if (!this.destination.trim()) {
					uni.showToast({
						title: '请填写目的地',
						icon: 'none'
					})
					return false
				}
				
				if (!this.content.trim()) {
					uni.showToast({
						title: '请填写攻略内容',
						icon: 'none'
					})
					return false
				}
				
				return true
			},
			
			// 返回上一页
			goBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style>
	.edit-container {
		min-height: 100vh;
		background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
	}
	
	/* 编辑模式样式 */
	.edit-header {
		height: 120rpx;
		background: white;
		border-bottom: 1rpx solid #e5e7eb;
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: sticky;
		top: 0;
		z-index: 100;
	}
	
	.header-back {
		display: flex;
		align-items: center;
		gap: 10rpx;
		color: #374151;
		font-size: 28rpx;
		font-weight: 500;
	}
	
	.back-icon {
		font-size: 32rpx;
		font-weight: bold;
	}
	
	.header-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #1f2937;
	}
	
	.header-actions {
		display: flex;
		gap: 20rpx;
		align-items: center;
	}
	
	.action-btn {
		display: flex;
		align-items: center;
		gap: 8rpx;
		padding: 12rpx 24rpx;
		border-radius: 8rpx;
		font-size: 24rpx;
		font-weight: 500;
		border: none;
		background: transparent;
	}
	
	.preview-btn {
		background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
		color: white;
	}
	
	.save-btn {
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		color: white;
	}
	
	.publish-btn {
		background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
		color: white;
	}
	
	.action-icon {
		font-size: 24rpx;
	}
	
	.edit-content {
		height: calc(100vh - 120rpx);
		padding: 20rpx;
	}
	
	.cover-section {
		margin-bottom: 30rpx;
	}
	
	.cover-upload {
		width: 100%;
		height: 300rpx;
		border-radius: 16rpx;
		border: 2rpx dashed #d1d5db;
		background: white;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s ease;
	}
	
	.cover-upload:active {
		background: #f9fafb;
		border-color: #3b82f6;
	}
	
	.cover-placeholder {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20rpx;
		color: #6b7280;
	}
	
	.placeholder-icon {
		font-size: 64rpx;
	}
	
	.placeholder-text {
		font-size: 28rpx;
	}
	
	.cover-preview {
		position: relative;
		width: 100%;
		height: 100%;
		border-radius: 16rpx;
		overflow: hidden;
	}
	
	.cover-image {
		width: 100%;
		height: 100%;
	}
	
	.cover-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.6);
		padding: 20rpx;
		display: flex;
		gap: 20rpx;
		justify-content: center;
	}
	
	.cover-change-btn,
	.cover-remove-btn {
		padding: 12rpx 24rpx;
		border-radius: 8rpx;
		font-size: 24rpx;
		color: white;
		border: 1rpx solid rgba(255, 255, 255, 0.3);
		background: rgba(255, 255, 255, 0.1);
	}
	
	.cover-change-btn:active,
	.cover-remove-btn:active {
		background: rgba(255, 255, 255, 0.2);
	}
	
	.form-section {
		background: white;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
	}
	
	.form-item {
		margin-bottom: 30rpx;
	}
	
	.form-label {
		display: block;
		font-size: 28rpx;
		font-weight: 600;
		color: #374151;
		margin-bottom: 15rpx;
	}
	
	.form-input {
		width: 100%;
		padding: 20rpx;
		border: 1rpx solid #d1d5db;
		border-radius: 8rpx;
		font-size: 28rpx;
		background: #f9fafb;
	}
	
	.form-input:focus {
		outline: none;
		border-color: #3b82f6;
		background: white;
	}
	
	.map-section {
		background: white;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
	}
	
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.section-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #374151;
	}
	
	.map-controls {
		display: flex;
		gap: 15rpx;
	}
	
	.map-control-btn {
		display: flex;
		align-items: center;
		gap: 8rpx;
		padding: 12rpx 20rpx;
		border: 1rpx solid #d1d5db;
		border-radius: 8rpx;
		background: white;
		font-size: 24rpx;
		color: #374151;
	}
	
	.clear-btn {
		color: #ef4444;
		border-color: #ef4444;
	}
	
	.map-container {
		position: relative;
		width: 100%;
		height: 400rpx;
		border-radius: 8rpx;
		overflow: hidden;
	}
	
	.tencent-map {
		width: 100%;
		height: 100%;
	}
	
	.map-loading {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(255, 255, 255, 0.9);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 20rpx;
		color: #6b7280;
	}
	
	.map-coordinates {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.8);
		padding: 15rpx;
		color: white;
		font-size: 24rpx;
	}
	
	.content-section {
		background: white;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
	}
	
	.ai-generate-btn {
		display: flex;
		align-items: center;
		gap: 8rpx;
		padding: 12rpx 20rpx;
		background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
		color: white;
		border: none;
		border-radius: 8rpx;
		font-size: 24rpx;
		font-weight: 500;
		transition: all 0.3s ease;
		box-shadow: 0 2rpx 8rpx rgba(245, 158, 11, 0.3);
	}
	
	.ai-generate-btn:active {
		transform: translateY(1rpx);
		box-shadow: 0 1rpx 4rpx rgba(245, 158, 11, 0.3);
	}
	
	.ai-generate-btn:disabled {
		background: linear-gradient(135deg, #cccccc 0%, #bbbbbb 100%);
		box-shadow: none;
	}
	
	.content-textarea {
		width: 100%;
		height: 300rpx;
		padding: 20rpx;
		border: 1rpx solid #d1d5db;
		border-radius: 8rpx;
		font-size: 28rpx;
		background: #f9fafb;
		resize: none;
	}
	
	.word-count {
		text-align: right;
		font-size: 24rpx;
		color: #6b7280;
		margin-top: 10rpx;
	}
	
	.tags-section {
		background: white;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
	}
	
	.tags-input-container {
		margin-bottom: 20rpx;
	}
	
	.tags-input {
		width: 100%;
		padding: 20rpx;
		border: 1rpx solid #d1d5db;
		border-radius: 8rpx;
		font-size: 28rpx;
		background: #f9fafb;
		margin-bottom: 10rpx;
	}
	
	.tags-hint {
		font-size: 24rpx;
		color: #6b7280;
	}
	
	.tags-list {
		display: flex;
		flex-wrap: wrap;
		gap: 15rpx;
	}
	
	.tag-item {
		display: flex;
		align-items: center;
		gap: 10rpx;
		padding: 12rpx 20rpx;
		background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
		color: white;
		border-radius: 20rpx;
		font-size: 24rpx;
	}
	
	.tag-remove {
		cursor: pointer;
		font-size: 28rpx;
		font-weight: bold;
		padding: 0 5rpx;
	}
	
	/* 预览模式样式 */
	.template-detail-container {
		min-height: 100vh;
		background: #f8fafc;
	}
	
	.detail-header {
		height: 200rpx;
		background: white;
		border-bottom: 1rpx solid #e5e7eb;
		padding: 30rpx;
		position: sticky;
		top: 0;
		z-index: 100;
	}
	
	.header-top-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}
	
	.detail-content {
		height: calc(100vh - 200rpx);
		padding: 20rpx;
	}
	
	.travel-guide-card {
		background: white;
		border-radius: 16rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
		margin-bottom: 30rpx;
	}
	
	.banner-section {
		position: relative;
		height: 400rpx;
	}
	
	.banner-image {
		width: 100%;
		height: 100%;
	}
	
	.banner-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.6) 100%);
	}
	
	.banner-content {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 40rpx;
		color: white;
	}
	
	.guide-title {
		font-size: 40rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
		display: block;
	}
	
	.guide-subtitle {
		font-size: 28rpx;
		opacity: 0.9;
	}
	
	.days-section {
		padding: 30rpx;
	}
	
	.days-actions {
		display: flex;
		gap: 15rpx;
	}
	
	.days-container {
		margin-top: 20rpx;
	}
	
	.day-item {
		margin-bottom: 30rpx;
		border: 1rpx solid #e5e7eb;
		border-radius: 12rpx;
		overflow: hidden;
	}
	
	.day-header {
		display: flex;
		align-items: center;
		gap: 20rpx;
		padding: 25rpx;
		background: #f9fafb;
		cursor: pointer;
		transition: background 0.3s ease;
	}
	
	.day-header:active {
		background: #f3f4f6;
	}
	
	.day-badge {
		background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
		color: white;
		padding: 8rpx 16rpx;
		border-radius: 20rpx;
		font-size: 22rpx;
		font-weight: 600;
	}
	
	.day-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #374151;
		flex: 1;
	}
	
	.day-expand-icon {
		font-size: 24rpx;
		color: #6b7280;
	}
	
	.day-content {
		padding: 25rpx;
		background: white;
	}
	
	.attractions-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}
	
	.attraction-item {
		border: 1rpx solid #f3f4f6;
		border-radius: 8rpx;
		overflow: hidden;
	}
	
	.attraction-header {
		display: flex;
		align-items: center;
		gap: 15rpx;
		padding: 20rpx;
		background: #f9fafb;
		cursor: pointer;
		transition: background 0.3s ease;
	}
	
	.attraction-header:active {
		background: #f3f4f6;
	}
	
	.attraction-order {
		width: 40rpx;
		height: 40rpx;
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		font-size: 20rpx;
		font-weight: 600;
	}
	
	.attraction-name {
		font-size: 26rpx;
		font-weight: 600;
		color: #374151;
		flex: 1;
	}
	
	.attraction-expand-icon {
		font-size: 20rpx;
		color: #6b7280;
	}
	
	.attraction-details {
		padding: 20rpx;
		background: white;
		border-top: 1rpx solid #f3f4f6;
	}
	
	.attraction-description {
		font-size: 24rpx;
		color: #6b7280;
		line-height: 1.6;
		margin-bottom: 15rpx;
		display: block;
	}
	
	.attraction-meta {
		display: flex;
		gap: 20rpx;
		margin-bottom: 15rpx;
	}
	
	.attraction-duration,
	.coordinates-status {
		font-size: 22rpx;
		color: #6b7280;
	}
	
	.has-coordinates {
		color: #10b981;
	}
	
	.no-coordinates {
		color: #ef4444;
	}
	
	.transportation-preview {
		background: #f8fafc;
		padding: 15rpx;
		border-radius: 6rpx;
	}
	
	.transportation-title {
		font-size: 22rpx;
		font-weight: 600;
		color: #374151;
		margin-bottom: 10rpx;
		display: block;
	}
	
	.transportation-options {
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}
	
	.transportation-option {
		font-size: 20rpx;
		color: #6b7280;
	}
	
	.no-data-tips {
		text-align: center;
		padding: 60rpx 30rpx;
		color: #9ca3af;
	}
	
	.no-data-icon {
		font-size: 64rpx;
		display: block;
		margin-bottom: 20rpx;
	}
	
	.content-section {
		padding: 30rpx;
		border-top: 1rpx solid #f3f4f6;
	}
	
	.content-text {
		font-size: 26rpx;
		color: #4b5563;
		line-height: 1.6;
		white-space: pre-wrap;
	}
	
	.tags-section {
		padding: 30rpx;
		border-top: 1rpx solid #f3f4f6;
	}
	
	.tips-section {
		padding: 30rpx;
		border-top: 1rpx solid #f3f4f6;
	}
	
	.tips-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #374151;
		margin-bottom: 20rpx;
		display: block;
	}
	
	.tips-list {
		display: flex;
		flex-direction: column;
		gap: 15rpx;
	}
	
	.tip-item {
		display: flex;
		align-items: center;
		gap: 15rpx;
		padding: 15rpx;
		background: #f8fafc;
		border-radius: 8rpx;
	}
	
	.tip-icon {
		font-size: 24rpx;
	}
	
	.tip-text {
		font-size: 24rpx;
		color: #6b7280;
		flex: 1;
	}
	
	.map-section {
		padding: 30rpx;
		border-top: 1rpx solid #f3f4f6;
	}
	
	/* 弹窗样式 */
	.map-modal,
	.transportation-modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 1000;
	}
	
	.modal-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
	}
	
	.modal-content {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 90vw;
		max-width: 600rpx;
		height: 80vh;
		background: white;
		border-radius: 16rpx;
		overflow: hidden;
	}
	
	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx;
		border-bottom: 1rpx solid #e5e7eb;
		background: #f9fafb;
	}
	
	.modal-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #374151;
		flex: 1;
	}
	
	.modal-close {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		background: #e5e7eb;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		font-weight: bold;
		color: #6b7280;
		cursor: pointer;
	}
	
	.modal-close:active {
		background: rgba(255, 255, 255, 0.3);
	}
	
	/* 更多样式定义... */
</style>