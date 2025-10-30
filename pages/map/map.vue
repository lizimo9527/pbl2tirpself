<template>
	<view class="map-container">
		<view class="header">
			<text class="title">地图导航</text>
			<text class="subtitle">查看旅行路线和目的地</text>
		</view>
		
		<!-- 地图控件 -->
		<view class="map-controls">
			<button class="control-btn" @click="locateMe">
				<text class="control-icon">📍</text>
				<text class="control-text">定位</text>
			</button>
			<button class="control-btn" @click="searchLocation">
				<text class="control-icon">🔍</text>
				<text class="control-text">搜索</text>
			</button>
			<button class="control-btn" @click="showRoute">
				<text class="control-icon">🛣️</text>
				<text class="control-text">路线</text>
			</button>
		</view>
		
		<!-- 腾讯地图组件 -->
		<view class="map-content">
			<map 
				id="tencentMap"
				:longitude="mapCenter.longitude"
				:latitude="mapCenter.latitude"
				:scale="mapScale"
				:markers="markers"
				:polyline="polyline"
				:show-location="true"
				:enable-zoom="true"
				:enable-scroll="true"
				:enable-rotate="false"
				:enable-overlooking="false"
				:enable-satellite="false"
				:enable-traffic="false"
				class="tencent-map"
				@regionchange="onRegionChange"
				@markertap="onMarkerTap"
				@callouttap="onCalloutTap"
				@controltap="onControlTap"
				@tap="onMapTap"
			></map>
			
			<!-- 地图加载状态 -->
			<view class="map-loading" v-if="isLoading">
				<text class="loading-text">地图加载中...</text>
			</view>
		</view>
		
		<!-- 位置信息显示 -->
		<view class="location-info" v-if="currentLocation.address">
			<text class="location-title">当前位置</text>
			<text class="location-address">{{ currentLocation.address }}</text>
			<text class="location-coords">
				经度: {{ currentLocation.longitude.toFixed(6) }}, 
				纬度: {{ currentLocation.latitude.toFixed(6) }}
			</text>
		</view>
		
		<view class="action-buttons">
			<button class="action-btn" @click="goBack">
				<text>返回首页</text>
			</button>
		</view>
		
		<!-- 搜索模态框 -->
		<view class="modal" v-if="showSearchModal">
			<view class="modal-content">
				<view class="modal-header">
					<text class="modal-title">搜索地点</text>
					<button class="close-btn" @click="hideSearchModal">×</button>
				</view>
				<view class="search-input">
					<input 
						v-model="searchKeyword" 
						placeholder="输入地点名称或地址"
						class="search-field"
						@confirm="performSearch"
					/>
					<button class="search-btn" @click="performSearch">搜索</button>
				</view>
				<view class="search-results">
					<view 
						v-for="(result, index) in searchResults" 
						:key="index"
						class="search-result"
						@click="selectSearchResult(result)"
					>
						<text class="result-name">{{ result.title }}</text>
						<text class="result-address">{{ result.address }}</text>
					</view>
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
				// 地图中心点
				mapCenter: {
					longitude: mapConfig.defaultCenter.longitude,
					latitude: mapConfig.defaultCenter.latitude
				},
				// 地图缩放级别
				mapScale: mapConfig.zoomLevel,
				// 标记点
				markers: [],
				// 路线
				polyline: [],
				// 当前位置信息
				currentLocation: {
					longitude: 0,
					latitude: 0,
					address: ''
				},
				// 加载状态
				isLoading: false,
				// 搜索相关
				showSearchModal: false,
				searchKeyword: '',
				searchResults: []
			}
		},
		
		mounted() {
			this.initMap()
		},
		
		methods: {
			// 初始化地图
			async initMap() {
				this.isLoading = true
				try {
					// 获取当前位置
					const location = await mapUtils.getCurrentLocation()
					this.mapCenter.longitude = location.longitude
					this.mapCenter.latitude = location.latitude
					
					// 获取当前位置地址
					const addressInfo = await mapUtils.reverseGeocode(location.latitude, location.longitude)
					this.currentLocation = {
						longitude: location.longitude,
						latitude: location.latitude,
						address: addressInfo.address
					}
					
					// 添加当前位置标记
					this.addMarker({
						id: 0,
						longitude: location.longitude,
						latitude: location.latitude,
						title: '当前位置',
						iconPath: '/static/images/map/current-location.png',
						width: 40,
						height: 40
					})
					
					uni.showToast({
						title: '地图初始化成功',
						icon: 'success'
					})
				} catch (error) {
					console.error('地图初始化失败:', error)
					uni.showToast({
						title: '地图初始化失败，使用默认位置',
						icon: 'none'
					})
				} finally {
					this.isLoading = false
				}
			},
			
			// 定位到当前位置
			async locateMe() {
				try {
					const location = await mapUtils.getCurrentLocation()
					this.mapCenter.longitude = location.longitude
					this.mapCenter.latitude = location.latitude
					this.mapScale = 16 // 放大到更详细的级别
					
					uni.showToast({
						title: '已定位到当前位置',
						icon: 'success'
					})
				} catch (error) {
					console.error('定位失败:', error)
					uni.showToast({
						title: '定位失败，请检查权限设置',
						icon: 'none'
					})
				}
			},
			
			// 搜索地点
			searchLocation() {
				this.showSearchModal = true
			},
			
			// 执行搜索
			async performSearch() {
				if (!this.searchKeyword.trim()) {
					uni.showToast({
						title: '请输入搜索关键词',
						icon: 'none'
					})
					return
				}
				
				this.isLoading = true
				try {
					const results = await mapUtils.searchPlaces(this.searchKeyword)
					this.searchResults = results.map((place, index) => ({
						id: index,
						title: place.title,
						address: place.address,
						longitude: place.location.lng,
						latitude: place.location.lat
					}))
				} catch (error) {
					console.error('搜索失败:', error)
					uni.showToast({
						title: '搜索失败，请稍后重试',
						icon: 'none'
					})
				} finally {
					this.isLoading = false
				}
			},
			
			// 选择搜索结果
			selectSearchResult(result) {
				// 移动地图到搜索结果位置
				this.mapCenter.longitude = result.longitude
				this.mapCenter.latitude = result.latitude
				this.mapScale = 16
				
				// 添加标记
				this.addMarker({
					id: Date.now(),
					longitude: result.longitude,
					latitude: result.latitude,
					title: result.title,
					iconPath: '/static/images/map/marker.png',
					width: 30,
					height: 30,
					callout: {
						content: result.title,
						color: '#ffffff',
						bgColor: '#1A9E8F',
						display: 'ALWAYS'
					}
				})
				
				this.hideSearchModal()
				uni.showToast({
					title: `已定位到${result.title}`,
					icon: 'success'
				})
			},
			
			// 显示路线规划
			showRoute() {
				uni.showToast({
					title: '路线规划功能开发中',
					icon: 'none'
				})
			},
			
			// 添加标记点
			addMarker(marker) {
				this.markers.push(marker)
			},
			
			// 清除所有标记
			clearMarkers() {
				this.markers = this.markers.filter(marker => marker.id === 0) // 保留当前位置标记
			},
			
			// 地图区域变化事件
			onRegionChange(e) {
				// 可以在这里处理地图拖动或缩放事件
				if (e.type === 'end') {
					// 地图拖动结束，可以获取新的中心点坐标
				}
			},
			
			// 标记点点击事件
			onMarkerTap(e) {
				const markerId = e.markerId
				const marker = this.markers.find(m => m.id === markerId)
				if (marker) {
					uni.showModal({
						title: marker.title,
						content: '您想对这个地点做什么？',
						showCancel: true,
						cancelText: '取消',
						confirmText: '设为目的地',
						success: (res) => {
							if (res.confirm) {
								uni.showToast({
									title: '已设为目的地',
									icon: 'success'
								})
							}
						}
					})
				}
			},
			
			// 地图点击事件
			onMapTap(e) {
				// 可以在这里实现点击地图添加标记的功能
				const { latitude, longitude } = e.detail
				uni.showModal({
					title: '添加标记',
					content: '是否在此位置添加标记？',
					showCancel: true,
					cancelText: '取消',
					confirmText: '添加',
					success: (res) => {
						if (res.confirm) {
							this.addMarker({
								id: Date.now(),
								longitude: longitude,
								latitude: latitude,
								title: '自定义标记',
								iconPath: '/static/images/map/marker.png',
								width: 30,
								height: 30
							})
							uni.showToast({
								title: '标记添加成功',
								icon: 'success'
							})
						}
					}
				})
			},
			
			// 隐藏搜索模态框
			hideSearchModal() {
				this.showSearchModal = false
				this.searchKeyword = ''
				this.searchResults = []
			},
			
			goBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style>
	.map-container {
		min-height: 100vh;
		background-color: #f5f7fa;
		display: flex;
		flex-direction: column;
	}
	
	.header {
		text-align: center;
		padding: 30rpx 30rpx 20rpx;
		background: linear-gradient(135deg, #1A9E8F 0%, #2ECC71 100%);
		color: white;
	}
	
	.title {
		font-size: 36rpx;
		font-weight: bold;
		display: block;
		margin-bottom: 8rpx;
	}
	
	.subtitle {
		font-size: 24rpx;
		opacity: 0.9;
		display: block;
	}
	
	/* 地图控件样式 */
	.map-controls {
		display: flex;
		justify-content: space-around;
		padding: 20rpx 30rpx;
		background-color: white;
		border-bottom: 1rpx solid #e5e5e5;
	}
	
	.control-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		background: none;
		border: none;
		padding: 15rpx 25rpx;
		border-radius: 15rpx;
		transition: all 0.3s;
	}
	
	.control-btn:active {
		background-color: #f8f9fa;
		transform: scale(0.95);
	}
	
	.control-icon {
		font-size: 36rpx;
		margin-bottom: 8rpx;
	}
	
	.control-text {
		font-size: 22rpx;
		color: #666;
	}
	
	/* 地图内容区域 */
	.map-content {
		flex: 1;
		position: relative;
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
	
	/* 位置信息显示 */
	.location-info {
		background-color: white;
		padding: 25rpx 30rpx;
		border-top: 1rpx solid #e5e5e5;
	}
	
	.location-title {
		font-size: 26rpx;
		font-weight: bold;
		color: #333;
		display: block;
		margin-bottom: 10rpx;
	}
	
	.location-address {
		font-size: 24rpx;
		color: #666;
		display: block;
		margin-bottom: 8rpx;
	}
	
	.location-coords {
		font-size: 20rpx;
		color: #999;
		display: block;
	}
	
	/* 操作按钮 */
	.action-buttons {
		padding: 20rpx 30rpx;
		background-color: white;
		border-top: 1rpx solid #e5e5e5;
	}
	
	.action-btn {
		background-color: #1A9E8F;
		color: white;
		border-radius: 10rpx;
		padding: 25rpx;
		font-size: 28rpx;
		font-weight: bold;
		width: 100%;
	}
	
	/* 搜索模态框样式 */
	.modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
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
	
	.result-address {
		font-size: 22rpx;
		color: #666;
	}
</style>