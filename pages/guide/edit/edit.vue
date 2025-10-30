<template>
	<view class="edit-container">
		<view class="edit-header">
			<view class="header-actions">
				<button class="action-btn save-btn" @click="saveDraft">保存草稿</button>
				<button class="action-btn publish-btn" @click="publishGuide">发布</button>
			</view>
		</view>

		<scroll-view class="edit-content" scroll-y>
			<view class="form-section">
				<view class="form-item">
					<text class="form-label">攻略标题</text>
					<input class="form-input" placeholder="请输入攻略标题" @input="onTitleInput" :value="title" />
				</view>
				
				<view class="form-item">
					<text class="form-label">目的地</text>
					<input class="form-input" placeholder="请输入目的地" @input="onDestinationInput" :value="destination" />
				</view>

				<!-- 地图展示模块 -->
				<view class="form-item">
					<view class="map-section-header">
						<text class="form-label">地图定位</text>
						<view class="map-controls">
							<button class="map-control-btn" @click="locateOnMap">定位</button>
							<button class="map-control-btn" @click="searchOnMap">搜索</button>
							<button class="map-control-btn" @click="clearMarkers">清除标记</button>
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
							<text class="loading-text">地图加载中...</text>
						</view>
						
						<!-- 坐标信息显示 -->
						<view class="map-coordinates" v-if="selectedLocation">
							<text class="coordinate-text">经度: {{selectedLocation.longitude.toFixed(6)}}</text>
							<text class="coordinate-text">纬度: {{selectedLocation.latitude.toFixed(6)}}</text>
							<text class="coordinate-text" v-if="selectedLocation.address">地址: {{selectedLocation.address}}</text>
						</view>
					</view>
				</view>
				
				<view class="form-item">
					<text class="form-label">攻略内容</text>
					<textarea class="form-textarea" placeholder="请输入详细的攻略内容..." @input="onContentInput" :value="content" maxlength="1000" />
				</view>
				
				<view class="form-item">
					<text class="form-label">上传图片</text>
					<view class="image-upload">
						<view class="upload-btn" @click="chooseImage">
							<text class="upload-icon">+</text>
							<text class="upload-text">添加图片</text>
						</view>
						<view class="image-preview" v-if="imagePath">
							<image :src="imagePath" mode="aspectFill" class="preview-image" />
							<view class="remove-btn" @click="removeImage">×</view>
						</view>
					</view>
				</view>
				
				<view class="form-item">
					<text class="form-label">标签</text>
					<view class="tags-container">
						<view class="tag-input-container">
							<input class="tag-input" placeholder="输入标签后按回车" @input="onTagInput" :value="tagInput" @confirm="addTag" />
						</view>
						<view class="tags-list">
							<view class="tag-item" v-for="(tag, index) in tags" :key="index">
								<text class="tag-text">{{tag}}</text>
								<text class="tag-remove" @click="removeTag(index)">×</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { mapConfig, mapUtils } from '@/config/map.config.js'
	import guideService from '@/services/guideService.js'
	
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
				polyline: []
			}
		},
		methods: {
			onTitleInput(e) {
				this.title = e.detail.value;
			},
			onDestinationInput(e) {
				this.destination = e.detail.value;
			},
			onContentInput(e) {
				this.content = e.detail.value;
			},
			onTagInput(e) {
				this.tagInput = e.detail.value;
			},
			addTag() {
				const tag = this.tagInput.trim();
				if (tag && this.tags.length < 5) {
					this.tags = [...this.tags, tag];
					this.tagInput = '';
				}
			},
			removeTag(index) {
				const newTags = [...this.tags];
				newTags.splice(index, 1);
				this.tags = newTags;
			},
			chooseImage() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						this.imagePath = res.tempFilePaths[0];
					}
				});
			},
			removeImage() {
				this.imagePath = '';
			},

			// 地图相关方法
			async locateOnMap() {
				if (!this.destination.trim()) {
					uni.showToast({
						title: '请先输入目的地',
						icon: 'none'
					});
					return;
				}
				
				this.isMapLoading = true;
				uni.showLoading({
					title: '正在定位...'
				});
				
				try {
					// 使用腾讯地图API进行地理编码
					const result = await mapUtils.geocode(this.destination);
					if (result && result.location) {
						this.selectedLocation = {
							longitude: result.location.lng,
							latitude: result.location.lat,
							address: result.address
						};
						
						// 移动地图到目的地
						this.mapCenter.longitude = result.location.lng;
						this.mapCenter.latitude = result.location.lat;
						this.mapScale = 16;
						
						// 添加目的地标记
						this.addMarker({
							id: Date.now(),
							longitude: result.location.lng,
							latitude: result.location.lat,
							title: this.destination,
							iconPath: '/static/images/map/marker.png',
							width: 30,
							height: 30,
							callout: {
								content: this.destination,
								color: '#ffffff',
								bgColor: '#1A9E8F',
								display: 'ALWAYS'
							}
						});
						
						uni.showToast({
							title: '定位成功',
							icon: 'success'
						});
					}
				} catch (error) {
					console.error('定位失败:', error);
					uni.showToast({
						title: '定位失败，请检查地址是否正确',
						icon: 'none'
					});
				} finally {
					this.isMapLoading = false;
					uni.hideLoading();
				}
			},

			searchOnMap() {
				uni.showToast({
					title: '请在地图上点击添加标记',
					icon: 'none'
				});
			},

			// 地图点击事件
			onMapTap(e) {
				const { latitude, longitude } = e.detail;
				
				uni.showModal({
					title: '添加标记',
					content: '是否在此位置添加标记？',
					showCancel: true,
					cancelText: '取消',
					confirmText: '添加',
					success: async (res) => {
						if (res.confirm) {
							try {
								// 获取地址信息
								const addressInfo = await mapUtils.reverseGeocode(latitude, longitude);
								
								this.addMarker({
									id: Date.now(),
									longitude: longitude,
									latitude: latitude,
									title: addressInfo.address || '自定义标记',
									iconPath: '/static/images/map/marker.png',
									width: 30,
									height: 30
								});
								
								// 更新选中位置信息
								this.selectedLocation = {
									longitude: longitude,
									latitude: latitude,
									address: addressInfo.address
								};
								
								uni.showToast({
									title: '标记添加成功',
									icon: 'success'
								});
							} catch (error) {
								console.error('添加标记失败:', error);
								uni.showToast({
									title: '标记添加失败',
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
				const marker = this.markers.find(m => m.id === markerId);
				if (marker) {
					uni.showModal({
						title: marker.title,
						content: '您想对这个地点做什么？',
						showCancel: true,
						cancelText: '取消',
						confirmText: '设为目的地',
						success: (res) => {
							if (res.confirm) {
								this.destination = marker.title;
								uni.showToast({
									title: '已设为目的地',
									icon: 'success'
								});
							}
						}
					});
				}
			},

			// 添加标记
			addMarker(marker) {
				this.markers.push(marker);
				// 更新折线
				this.updatePolyline();
			},

			// 自动添加多个地图标记（用于AI生成的攻略）
			autoAddMarkers(markerList) {
				if (!markerList || markerList.length === 0) return;
				
				// 清空现有标记
				this.markers = [];
				
				// 添加所有标记
				markerList.forEach((markerInfo, index) => {
					this.addMarker({
						id: Date.now() + index,
						longitude: markerInfo.longitude,
						latitude: markerInfo.latitude,
						title: markerInfo.name,
						iconPath: '/static/images/map/marker.png',
						width: 30,
						height: 30,
						callout: {
							content: markerInfo.name,
							color: '#ffffff',
							bgColor: '#1A9E8F',
							display: 'ALWAYS'
						}
					});
				});
				
				// 设置地图中心为第一个标记点
				if (markerList.length > 0) {
					this.mapCenter.longitude = markerList[0].longitude;
					this.mapCenter.latitude = markerList[0].latitude;
					this.mapScale = 10; // 适当缩放级别
				}
				
				uni.showToast({
					title: `已自动添加${markerList.length}个地点标记`,
					icon: 'success'
				});
			},

			// 更新折线连接
			updatePolyline() {
				if (this.markers.length < 2) {
					this.polyline = [];
					return;
				}

				// 创建折线路径
				const points = this.markers.map(marker => ({
					longitude: marker.longitude,
					latitude: marker.latitude
				}));

				this.polyline = [{
					points: points,
					color: '#1A9E8F',
					width: 4,
					arrowLine: true,
					borderWidth: 2,
					borderColor: '#FFFFFF'
				}];
			},

			clearMarkers() {
				if (this.markers.length === 0) {
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
							this.markers = [];
							this.selectedLocation = null;
							this.polyline = [];
							uni.showToast({
								title: '标记已清除',
								icon: 'success'
							});
						}
					}
				});
			},
			saveDraft() {
				if (!this.title.trim()) {
					uni.showToast({
						title: '请输入攻略标题',
						icon: 'none'
					});
					return;
				}

				const guideData = {
					title: this.title,
					destination: this.destination,
					content: this.content,
					tags: this.tags,
					imagePath: this.imagePath,
					mapMarkers: this.markers,
					selectedLocation: this.selectedLocation,
					status: 'draft'
				};

				// 如果是编辑模式，设置ID
				if (this.editMode && this.guideId) {
					guideData.id = this.guideId;
				}

				try {
					const success = guideService.saveGuide(guideData);
					if (success) {
						uni.showToast({
							title: '草稿保存成功',
							icon: 'success'
						});
						
						// 延迟跳转到首页
						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
					} else {
						uni.showToast({
							title: '保存失败',
							icon: 'none'
						});
					}
				} catch (e) {
					uni.showToast({
						title: '保存失败',
						icon: 'none'
					});
				}
			},
			publishGuide() {
				if (!this.title.trim()) {
					uni.showToast({
						title: '请输入攻略标题',
						icon: 'none'
					});
					return;
				}

				if (!this.content.trim()) {
					uni.showToast({
						title: '请输入攻略内容',
						icon: 'none'
					});
					return;
				}

				const guideData = {
					title: this.title,
					destination: this.destination,
					content: this.content,
					tags: this.tags,
					imagePath: this.imagePath,
					mapMarkers: this.markers,
					selectedLocation: this.selectedLocation,
					publishTime: new Date().toISOString(),
					status: 'published',
					author: 'default'
				};

				// 如果是编辑模式，设置ID
				if (this.editMode && this.guideId) {
					guideData.id = this.guideId;
				}

				uni.showLoading({
					title: this.editMode ? '更新中...' : '发布中...'
				});

				setTimeout(() => {
					const success = guideService.saveGuide(guideData);
					
					if (success) {
						uni.hideLoading();
						uni.showToast({
							title: this.editMode ? '更新成功' : '发布成功',
							icon: 'success'
						});
						
						// 发布成功后跳转到首页
						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
					} else {
						uni.hideLoading();
						uni.showToast({
							title: this.editMode ? '更新失败' : '发布失败',
							icon: 'none'
						});
					}
				}, 1000);
			},
			
			// 加载攻略数据（编辑模式）
			loadGuideData() {
				const guide = guideService.getGuideById(this.guideId);
				if (guide) {
					this.title = guide.title || '';
					this.destination = guide.destination || '';
					this.content = guide.content || '';
					this.tags = guide.tags || [];
					this.imagePath = guide.imagePath || '';
					this.markers = guide.mapMarkers || [];
					this.selectedLocation = guide.selectedLocation || null;
					
					// 如果有位置信息，设置地图中心
					if (this.selectedLocation) {
						this.mapCenter.longitude = this.selectedLocation.longitude;
						this.mapCenter.latitude = this.selectedLocation.latitude;
						this.mapScale = 14;
					}
				}
			},
			
			goBack() {
				uni.navigateBack();
			}
		},
		
		onLoad(options) {
			// 检查是否是编辑模式
			if (options.id) {
				this.editMode = true;
				this.guideId = options.id;
				this.loadGuideData();
			} else {
				// 新建模式，清空所有数据
				this.title = '';
				this.destination = '';
				this.content = '';
				this.imagePath = '';
				this.tags = [];
				this.markers = [];
				this.selectedLocation = null;
				this.editMode = false;
				this.guideId = '';
				
				// 检查是否有AI数据传入
				if (options.aiData) {
					try {
						const aiData = JSON.parse(decodeURIComponent(options.aiData));
						if (aiData.title) {
							this.title = aiData.title;
						}
						if (aiData.content) {
							this.content = aiData.content;
						}
						
						// 检查是否有目的地和地图标记数据
						if (aiData.destinationData) {
							this.destination = aiData.destinationData.destination;
							this.autoAddMarkers(aiData.destinationData.markers);
						}
					} catch (error) {
						console.error('解析AI数据失败:', error);
					}
				}
			}
		}
	}
</script>

<style>
	.edit-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
		padding: 30rpx;
	}
	
	.edit-header {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-bottom: 30rpx;
	}
	
	.header-actions {
		display: flex;
		gap: 15rpx;
	}
	
	.action-btn {
		padding: 12rpx 20rpx;
		border-radius: 8rpx;
		font-size: 24rpx;
		font-weight: bold;
		border: none;
	}
	
	.save-btn {
		background: #f8f9fa;
		color: #666;
		border: 1rpx solid #e5e5e5;
	}
	
	.publish-btn {
		background: #1A9E8F;
		color: white;
	}
	
	.edit-content {
		flex: 1;
		height: calc(100vh - 120rpx);
	}
	
	.form-section {
		flex: 1;
	}
	
	.form-item {
		margin-bottom: 40rpx;
	}
	
	.form-label {
		display: block;
		font-size: 28rpx;
		font-weight: bold;
		color: #333333;
		margin-bottom: 15rpx;
	}
	
	.form-input {
		width: 100%;
		height: 80rpx;
		padding: 0 20rpx;
		border: 2rpx solid #e5e5e5;
		border-radius: 10rpx;
		font-size: 28rpx;
		background-color: #f9f9f9;
	}
	
	.form-textarea {
		width: 100%;
		height: 200rpx;
		padding: 20rpx;
		border: 2rpx solid #e5e5e5;
		border-radius: 10rpx;
		font-size: 28rpx;
		background-color: #f9f9f9;
	}

	/* 地图模块样式 */
	.map-section-header {
		display: flex;
		flex-direction: column;
		margin-bottom: 15rpx;
	}

	.map-controls {
		display: flex;
		flex-direction: column;
		gap: 15rpx;
		margin-top: 15rpx;
	}

	.map-control-btn {
		background-color: #1A9E8F;
		color: white;
		border-radius: 8rpx;
		padding: 15rpx 20rpx;
		font-size: 28rpx;
		border: none;
	}

	.map-container {
		position: relative;
		height: 400rpx;
		border-radius: 10rpx;
		overflow: hidden;
		border: 2rpx solid #e5e5e5;
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
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(255, 255, 255, 0.9);
		z-index: 10;
	}

	.loading-text {
		font-size: 28rpx;
		color: #666;
	}

	.map-coordinates {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.7);
		color: white;
		padding: 15rpx;
		font-size: 24rpx;
		z-index: 5;
	}

	.coordinate-text {
		display: block;
		margin-bottom: 5rpx;
	}

	.image-upload {
		display: flex;
		align-items: center;
	}
	
	.upload-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 150rpx;
		height: 150rpx;
		border: 2rpx dashed #e5e5e5;
		border-radius: 10rpx;
		background-color: #f9f9f9;
	}
	
	.upload-icon {
		font-size: 48rpx;
		color: #999999;
		margin-bottom: 10rpx;
	}
	
	.upload-text {
		font-size: 24rpx;
		color: #999999;
	}
	
	.image-preview {
		position: relative;
		margin-left: 20rpx;
	}
	
	.preview-image {
		width: 150rpx;
		height: 150rpx;
		border-radius: 10rpx;
	}
	
	.remove-btn {
		position: absolute;
		top: -10rpx;
		right: -10rpx;
		width: 40rpx;
		height: 40rpx;
		background-color: #ff4444;
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		font-weight: bold;
	}
	
	.tags-container {
		display: flex;
		flex-direction: column;
	}
	
	.tag-input-container {
		margin-bottom: 20rpx;
	}
	
	.tag-input {
		width: 100%;
		height: 60rpx;
		padding: 0 20rpx;
		border: 2rpx solid #e5e5e5;
		border-radius: 10rpx;
		font-size: 28rpx;
		background-color: #f9f9f9;
	}
	
	.tags-list {
		display: flex;
		flex-wrap: wrap;
		gap: 15rpx;
	}
	
	.tag-item {
		display: flex;
		align-items: center;
		padding: 10rpx 20rpx;
		background-color: #1A9E8F;
		border-radius: 20rpx;
		color: white;
	}
	
	.tag-text {
		font-size: 24rpx;
		margin-right: 10rpx;
	}
	
	.tag-remove {
		font-size: 20rpx;
		font-weight: bold;
		cursor: pointer;
	}
</style>