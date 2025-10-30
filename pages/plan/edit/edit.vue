<template>
	<view class="plan-container">
		<!-- 顶部标题栏 -->
		<view class="header">
			<text class="title">旅行规划</text>
			<text class="subtitle">在地图上规划您的完美行程</text>
		</view>

		<!-- 日期切换模块 -->
		<view class="date-tabs">
			<scroll-view class="date-scroll" scroll-x="true">
				<view 
					v-for="(date, index) in dates" 
					:key="index"
					class="date-tab"
					:class="{ active: currentDateIndex === index }"
					@click="switchDate(index)"
				>
					<text class="date-text">{{ date.name }}</text>
					<text class="date-desc">{{ date.desc }}</text>
				</view>
			</scroll-view>
		</view>

		<!-- 地图展示模块 -->
		<view class="map-section">
			<view class="map-header">
				<text class="section-title">地图展示</text>
				<view class="map-controls">
					<button class="control-btn" @click="locateCurrent">📍</button>
					<button class="control-btn" @click="zoomIn">+</button>
					<button class="control-btn" @click="zoomOut">-</button>
					<button class="control-btn" @click="clearMarkers">🗑️</button>
				</view>
			</view>
			<view class="map-container">
				<map 
					id="planMap"
					:longitude="mapCenter.longitude"
					:latitude="mapCenter.latitude"
					:scale="mapScale"
					:markers="mapMarkers"
					:polyline="routePolyline"
					:show-location="true"
					:enable-zoom="true"
					:enable-scroll="true"
					class="tencent-map"
					@tap="onMapTap"
					@markertap="onMarkerTap"
					@regionchange="onRegionChange"
				></map>
				
				<!-- 地图加载状态 -->
				<view class="map-loading" v-if="isMapLoading">
					<text class="loading-text">地图加载中...</text>
				</view>
			</view>
		</view>

		<!-- 地点列表模块 -->
		<view class="locations-section">
			<view class="section-header">
				<text class="section-title">当日行程</text>
				<button class="add-btn" @click="showSearchModal">+ 添加地点</button>
			</view>
			<view class="locations-list">
				<view 
					v-for="(location, index) in currentLocations" 
					:key="index"
					class="location-item"
					@click="focusOnLocation(location)"
				>
					<view class="location-info">
						<text class="location-name">{{ location.name }}</text>
						<text class="location-details">{{ location.transport }} · {{ location.distance }} · {{ location.duration }}</text>
					</view>
					<view class="location-actions">
						<button class="action-btn edit-btn" @click.stop="editLocation(location)">编辑</button>
						<button class="action-btn delete-btn" @click.stop="deleteLocation(index)">删除</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 路线规划模块 -->
		<view class="route-section">
			<view class="section-header">
				<text class="section-title">路线规划</text>
				<button class="route-btn" @click="generateRoute">智能路线规划</button>
			</view>
			<view class="route-info">
				<text class="route-total">总行程：{{ routeInfo.totalDistance }} · {{ routeInfo.totalDuration }}</text>
				<view class="route-segments">
					<view 
						v-for="(segment, index) in routeInfo.segments" 
						:key="index"
						class="route-segment"
					>
						<text class="segment-info">{{ segment.distance }} {{ segment.duration }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 搜索模态框 -->
		<view class="modal" v-if="showSearch">
			<view class="modal-content">
				<view class="modal-header">
					<text class="modal-title">搜索地点</text>
					<button class="close-btn" @click="hideSearchModal">×</button>
				</view>
				<view class="search-input">
					<input 
						v-model="searchKeyword" 
						placeholder="输入景点、住宿、交通枢纽等关键词"
						class="search-field"
					/>
					<button class="search-btn" @click="searchLocations">搜索</button>
				</view>
				<view class="search-results">
					<view 
						v-for="(result, index) in searchResults" 
						:key="index"
						class="search-result"
						@click="addLocationFromSearch(result)"
					>
						<text class="result-name">{{ result.name }}</text>
						<text class="result-type">{{ result.type }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 备注编辑模态框 -->
		<view class="modal" v-if="showNoteModal">
			<view class="modal-content">
				<view class="modal-header">
					<text class="modal-title">添加备注</text>
					<button class="close-btn" @click="hideNoteModal">×</button>
				</view>
				<view class="note-input">
					<textarea 
						v-model="currentNote" 
						placeholder="输入对该地点的行程安排、特色说明等备注信息"
						class="note-field"
						maxlength="200"
					></textarea>
					<text class="note-count">{{ currentNote.length }}/200</text>
				</view>
				<view class="modal-actions">
					<button class="cancel-btn" @click="hideNoteModal">取消</button>
					<button class="confirm-btn" @click="saveNote">保存</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapConfig, mapUtils } from '@/config/map.config.js'
	
	export default {
		data() {
			return {
				currentDateIndex: 0,
				dates: [
					{ name: '7月3号', desc: '第一天' },
					{ name: '7月4号', desc: '第二天' },
					{ name: '7月5号', desc: '第三天' },
					{ name: '7月6号', desc: '第四天' }
				],
				locations: {
					0: [
						{ 
							name: '北京故宫', 
							type: '景点',
							transport: '驾车',
							distance: '7km',
							duration: '21分钟',
							note: '建议上午9点到达，游览时间约3小时',
							longitude: 116.3974,
							latitude: 39.9093
						},
						{ 
							name: '王府井大街', 
							type: '购物',
							transport: '步行',
							distance: '3km',
							duration: '11分钟',
							note: '午餐推荐：全聚德烤鸭',
							longitude: 116.4179,
							latitude: 39.9089
						}
					],
					1: [],
					2: [],
					3: []
				},
				
				// 地图相关数据
				mapCenter: {
					longitude: mapConfig.defaultCenter.longitude,
					latitude: mapConfig.defaultCenter.latitude
				},
				mapScale: mapConfig.zoomLevel,
				mapMarkers: [],
				routePolyline: [],
				isMapLoading: false,
				
				showSearch: false,
				showNoteModal: false,
				searchKeyword: '',
				searchResults: [
					{ name: '天安门广场', type: '景点' },
					{ name: '颐和园', type: '景点' },
					{ name: '北京首都国际机场', type: '交通枢纽' },
					{ name: '北京饭店', type: '住宿' },
					{ name: '全聚德烤鸭店', type: '餐饮' }
				],
				currentNote: '',
				currentEditingLocation: null,
				routeInfo: {
					totalDistance: '10km',
					totalDuration: '32分钟',
					segments: [
						{ distance: '7km', duration: '21分钟' },
						{ distance: '3km', duration: '11分钟' }
					]
				}
			}
		},
		computed: {
			currentLocations() {
				return this.locations[this.currentDateIndex] || []
			}
		},
		methods: {
			// 日期切换
			switchDate(index) {
				this.currentDateIndex = index
			},

			// 地图控制
			zoomIn() {
				if (this.mapScale < 20) {
					this.mapScale += 1;
				}
			},
			zoomOut() {
				if (this.mapScale > 3) {
					this.mapScale -= 1;
				}
			},
			
			// 定位到当前位置
			async locateCurrent() {
				try {
					const location = await mapUtils.getCurrentLocation();
					this.mapCenter.longitude = location.longitude;
					this.mapCenter.latitude = location.latitude;
					this.mapScale = 16;
					
					uni.showToast({
						title: '已定位到当前位置',
						icon: 'success'
					});
				} catch (error) {
					console.error('定位失败:', error);
					uni.showToast({
						title: '定位失败，请检查权限设置',
						icon: 'none'
					});
				}
			},
			
			// 清除标记
			clearMarkers() {
				if (this.mapMarkers.length === 0) {
					uni.showToast({
						title: '暂无标记可清除',
						icon: 'none'
					});
					return;
				}
				
				uni.showModal({
					title: '确认清除',
					content: '确定要清除所有地图标记吗？',
					success: (res) => {
						if (res.confirm) {
							this.mapMarkers = [];
							this.routePolyline = [];
							uni.showToast({
								title: '标记已清除',
								icon: 'success'
							});
						}
					}
				});
			},
			
			// 地图点击事件
			onMapTap(e) {
				const { latitude, longitude } = e.detail;
				
				uni.showModal({
					title: '添加地点',
					content: '是否在此位置添加旅行地点？',
					showCancel: true,
					cancelText: '取消',
					confirmText: '添加',
					success: async (res) => {
						if (res.confirm) {
							try {
								// 获取地址信息
								const addressInfo = await mapUtils.reverseGeocode(latitude, longitude);
								
								// 添加到当前日期的地点列表
								const newLocation = {
									name: addressInfo.address || '自定义地点',
									type: '景点',
									transport: '驾车',
									distance: '0km',
									duration: '0分钟',
									note: '',
									longitude: longitude,
									latitude: latitude
								};
								
								if (!this.locations[this.currentDateIndex]) {
									this.locations[this.currentDateIndex] = [];
								}
								this.locations[this.currentDateIndex].push(newLocation);
								
								// 添加地图标记
								this.addMapMarker(newLocation);
								
								uni.showToast({
									title: '地点添加成功',
									icon: 'success'
								});
							} catch (error) {
								console.error('添加地点失败:', error);
								uni.showToast({
									title: '地点添加失败',
									icon: 'none'
								});
							}
						}
					}
				});
			},
			
			// 标记点点击事件
			onMarkerTap(e) {
				const markerId = e.markerId;
				const marker = this.mapMarkers.find(m => m.id === markerId);
				if (marker) {
					uni.showModal({
						title: marker.title,
						content: '您想对这个地点做什么？',
						showCancel: true,
						cancelText: '取消',
						confirmText: '查看详情',
						success: (res) => {
							if (res.confirm) {
								// 可以在这里实现跳转到地点详情的功能
								uni.showToast({
									title: '查看地点详情',
									icon: 'none'
								});
							}
						}
					});
				}
			},
			
			// 地图区域变化事件
			onRegionChange(e) {
				// 可以在这里处理地图拖动或缩放事件
				if (e.type === 'end') {
					// 地图拖动结束，可以获取新的中心点坐标
				}
			},
			
			// 添加地图标记
			addMapMarker(location) {
				const marker = {
					id: Date.now(),
					longitude: location.longitude,
					latitude: location.latitude,
					title: location.name,
					iconPath: '/static/images/map/marker.png',
					width: 30,
					height: 30,
					callout: {
						content: location.name,
						color: '#ffffff',
						bgColor: '#1A9E8F',
						display: 'ALWAYS'
					}
				};
				this.mapMarkers.push(marker);
			},
			
			// 更新地图标记
			updateMapMarkers() {
				this.mapMarkers = [];
				const currentLocations = this.locations[this.currentDateIndex] || [];
				currentLocations.forEach(location => {
					this.addMapMarker(location);
				});
			},

			// 搜索功能
			showSearchModal() {
				this.showSearch = true
			},
			hideSearchModal() {
				this.showSearch = false
				this.searchKeyword = ''
			},
			searchLocations() {
				if (!this.searchKeyword.trim()) {
					uni.showToast({ title: '请输入搜索关键词', icon: 'none' })
					return
				}
				// 模拟搜索
				uni.showToast({ title: `搜索: ${this.searchKeyword}`, icon: 'none' })
			},

			// 地点管理
			addLocationFromSearch(result) {
				const newLocation = {
					name: result.name,
					type: result.type,
					transport: '驾车',
					distance: '0km',
					duration: '0分钟',
					note: ''
				}
				this.locations[this.currentDateIndex].push(newLocation)
				this.hideSearchModal()
				uni.showToast({ title: '地点添加成功', icon: 'success' })
			},

			editLocation(location) {
				this.currentEditingLocation = location
				this.currentNote = location.note || ''
				this.showNoteModal = true
			},

			deleteLocation(index) {
				uni.showModal({
					title: '确认删除',
					content: '确定要删除这个地点吗？',
					success: (res) => {
						if (res.confirm) {
							this.locations[this.currentDateIndex].splice(index, 1)
							uni.showToast({ title: '删除成功', icon: 'success' })
						}
					}
				})
			},

			// 备注管理
			hideNoteModal() {
				this.showNoteModal = false
				this.currentNote = ''
				this.currentEditingLocation = null
			},

			saveNote() {
				if (this.currentEditingLocation) {
					this.currentEditingLocation.note = this.currentNote
					uni.showToast({ title: '备注保存成功', icon: 'success' })
				}
				this.hideNoteModal()
			},

			// 路线规划
			generateRoute() {
				if (this.currentLocations.length < 2) {
					uni.showToast({ title: '请至少添加2个地点进行路线规划', icon: 'none' })
					return
				}
				uni.showToast({ title: '正在生成智能路线...', icon: 'loading' })
				// 模拟路线规划
				setTimeout(() => {
					this.routeInfo = {
						totalDistance: `${this.currentLocations.length * 5}km`,
						totalDuration: `${this.currentLocations.length * 15}分钟`,
						segments: this.currentLocations.map((_, index) => ({
							distance: `${index + 1}km`,
							duration: `${index + 5}分钟`
						}))
					}
					uni.showToast({ title: '路线规划完成', icon: 'success' })
				}, 1000)
			},

			// 地图聚焦
			focusOnLocation(location) {
				uni.showToast({ 
					title: `聚焦到: ${location.name}`,
					icon: 'none' 
				})
			},

			goBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style>
	.plan-container {
		min-height: 100vh;
		background-color: #f5f7fa;
		padding: 20rpx;
	}
	
	.header {
		text-align: center;
		margin-bottom: 30rpx;
		padding: 20rpx 0;
		background: linear-gradient(135deg, #1A9E8F 0%, #2ECC71 100%);
		border-radius: 20rpx;
		color: white;
	}
	
	.title {
		font-size: 40rpx;
		font-weight: bold;
		display: block;
		margin-bottom: 10rpx;
	}
	
	.subtitle {
		font-size: 26rpx;
		opacity: 0.9;
		display: block;
	}
	
	/* 日期标签样式 */
	.date-tabs {
		margin-bottom: 30rpx;
	}
	
	.date-scroll {
		white-space: nowrap;
	}
	
	.date-tab {
		display: inline-block;
		padding: 20rpx 30rpx;
		margin-right: 15rpx;
		background-color: white;
		border-radius: 15rpx;
		text-align: center;
		min-width: 150rpx;
		box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
		transition: all 0.3s;
	}
	
	.date-tab.active {
		background: linear-gradient(135deg, #1A9E8F 0%, #2ECC71 100%);
		color: white;
	}
	
	.date-text {
		font-size: 28rpx;
		font-weight: bold;
		display: block;
	}
	
	.date-desc {
		font-size: 22rpx;
		opacity: 0.8;
		display: block;
		margin-top: 5rpx;
	}
	
	/* 地图区域样式 */
	.map-section {
		background-color: white;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
	}
	
	.map-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	
	.map-controls {
		display: flex;
		gap: 10rpx;
	}
	
	.control-btn {
		width: 60rpx;
		height: 60rpx;
		background-color: #1A9E8F;
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		font-weight: bold;
	}
	
	.map-container {
		position: relative;
		height: 400rpx;
		border-radius: 15rpx;
		overflow: hidden;
	}
	
	.tencent-map {
		width: 100%;
		height: 100%;
	}
	
	/* 地图加载状态 */
	.map-loading {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: rgba(255, 255, 255, 0.9);
		padding: 30rpx 50rpx;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
		z-index: 10;
	}
	
	.loading-text {
		font-size: 28rpx;
		color: #666;
	}
	
	/* 地点列表样式 */
	.locations-section {
		background-color: white;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
	}
	
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.add-btn {
		background-color: #1A9E8F;
		color: white;
		border-radius: 10rpx;
		padding: 15rpx 25rpx;
		font-size: 24rpx;
	}
	
	.locations-list {
		max-height: 400rpx;
		overflow-y: auto;
	}
	
	.location-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		border-bottom: 1rpx solid #eee;
		transition: background-color 0.3s;
	}
	
	.location-item:last-child {
		border-bottom: none;
	}
	
	.location-item:active {
		background-color: #f8f9fa;
	}
	
	.location-info {
		flex: 1;
	}
	
	.location-name {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		display: block;
		margin-bottom: 5rpx;
	}
	
	.location-details {
		font-size: 22rpx;
		color: #666;
	}
	
	.location-actions {
		display: flex;
		gap: 10rpx;
	}
	
	.action-btn {
		padding: 10rpx 20rpx;
		border-radius: 8rpx;
		font-size: 22rpx;
	}
	
	.edit-btn {
		background-color: #ffa726;
		color: white;
	}
	
	.delete-btn {
		background-color: #ef5350;
		color: white;
	}
	
	/* 路线规划样式 */
	.route-section {
		background-color: white;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
	}
	
	.route-btn {
		background-color: #1A9E8F;
		color: white;
		border-radius: 10rpx;
		padding: 15rpx 25rpx;
		font-size: 24rpx;
	}
	
	.route-info {
		margin-top: 20rpx;
	}
	
	.route-total {
		font-size: 26rpx;
		font-weight: bold;
		color: #333;
		display: block;
		margin-bottom: 15rpx;
	}
	
	.route-segments {
		display: flex;
		flex-direction: column;
		gap: 10rpx;
	}
	
	.route-segment {
		padding: 15rpx;
		background-color: #f8f9fa;
		border-radius: 10rpx;
		border-left: 4rpx solid #1A9E8F;
	}
	
	.segment-info {
		font-size: 22rpx;
		color: #666;
	}
	
	/* 模态框样式 */
	.modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0,0,0,0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}
	
	.modal-content {
		background-color: white;
		border-radius: 20rpx;
		width: 90%;
		max-width: 600rpx;
		max-height: 80%;
		overflow: hidden;
	}
	
	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1rpx solid #eee;
	}
	
	.modal-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	
	.close-btn {
		background: none;
		border: none;
		font-size: 40rpx;
		color: #999;
		padding: 0;
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.search-input {
		padding: 30rpx;
		display: flex;
		gap: 15rpx;
	}
	
	.search-field {
		flex: 1;
		border: 1rpx solid #ddd;
		border-radius: 10rpx;
		padding: 20rpx;
		font-size: 26rpx;
	}
	
	.search-btn {
		background-color: #1A9E8F;
		color: white;
		border-radius: 10rpx;
		padding: 20rpx 30rpx;
		font-size: 26rpx;
	}
	
	.search-results {
		max-height: 400rpx;
		overflow-y: auto;
		padding: 0 30rpx 30rpx;
	}
	
	.search-result {
		padding: 20rpx;
		border-bottom: 1rpx solid #eee;
		transition: background-color 0.3s;
	}
	
	.search-result:last-child {
		border-bottom: none;
	}
	
	.search-result:active {
		background-color: #f8f9fa;
	}
	
	.result-name {
		font-size: 26rpx;
		font-weight: bold;
		color: #333;
		display: block;
		margin-bottom: 5rpx;
	}
	
	.result-type {
		font-size: 22rpx;
		color: #666;
	}
	
	.note-input {
		padding: 30rpx;
	}
	
	.note-field {
		width: 100%;
		height: 200rpx;
		border: 1rpx solid #ddd;
		border-radius: 10rpx;
		padding: 20rpx;
		font-size: 26rpx;
		margin-bottom: 15rpx;
	}
	
	.note-count {
		font-size: 22rpx;
		color: #999;
		text-align: right;
		display: block;
	}
	
	.modal-actions {
		display: flex;
		gap: 15rpx;
		padding: 0 30rpx 30rpx;
		justify-content: flex-end;
	}
	
	.cancel-btn {
		background-color: #f8f9fa;
		color: #666;
		border-radius: 10rpx;
		padding: 20rpx 30rpx;
		font-size: 26rpx;
	}
	
	.confirm-btn {
		background-color: #1A9E8F;
		color: white;
		border-radius: 10rpx;
		padding: 20rpx 30rpx;
		font-size: 26rpx;
	}
</style>