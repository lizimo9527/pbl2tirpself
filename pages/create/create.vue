<template>
	<view class="create-container">
		<view class="create-header">
			<text class="create-title">创建攻略</text>
		</view>
		
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
						id="createMap"
						:longitude="mapCenter.longitude"
						:latitude="mapCenter.latitude"
						:scale="mapScale"
						:markers="markers"
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
		
		<view class="action-buttons">
			<button class="save-btn" @click="saveDraft">保存草稿</button>
			<button class="publish-btn" @click="publishGuide">发布攻略</button>
		</view>
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
				isMapLoading: false
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

				const draftData = {
					title: this.title,
					destination: this.destination,
					content: this.content,
					tags: this.tags,
					imagePath: this.imagePath,
					mapMarkers: this.markers,
					selectedLocation: this.selectedLocation,
					createTime: new Date().toISOString(),
					status: 'draft'
				};

				try {
					// 保存为草稿攻略
					const guideData = {
						...draftData,
						status: 'draft',
						publishTime: null
					};
					
					const success = guideService.saveGuide(guideData);
					if (success) {
						uni.showToast({
							title: '草稿保存成功',
							icon: 'success'
						});
						
						// 延迟跳转到首页
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/index/index'
							});
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
						
						// 清除草稿
						try {
							uni.removeStorageSync('guideDraft');
						} catch (e) {
							console.log('清除草稿失败');
						}
						
						// 发布成功后跳转到首页
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/index/index'
							});
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
			
			// 清空草稿数据（不再加载草稿）
			clearDraftData() {
				try {
					// 清除本地存储的草稿数据
					uni.removeStorageSync('guideDraft');
				} catch (e) {
					console.log('清除草稿数据失败');
				}
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

			// 清空表单数据
			clearFormData() {
				this.title = '';
				this.destination = '';
				this.content = '';
				this.imagePath = '';
				this.tags = [];
				this.markers = [];
				this.selectedLocation = null;
				this.tagInput = '';
				
				// 重置地图中心
				this.mapCenter = {
					longitude: mapConfig.defaultCenter.longitude,
					latitude: mapConfig.defaultCenter.latitude
				};
				this.mapScale = mapConfig.zoomLevel;
			}
		},
		
		onLoad(options) {
			// 检查是否是编辑模式
			if (options.id && options.mode === 'edit') {
				this.editMode = true;
				this.guideId = options.id;
				this.loadGuideData();
			} else {
				// 正常创建模式，清空所有数据，确保每次进入都是空的
				this.clearFormData();
				this.clearDraftData();
			}
		},

		onShow() {
			// 如果是创建模式，每次显示时清空数据
			if (!this.editMode) {
				this.clearFormData();
				this.clearDraftData();
			}
		}
	}
</script>

<style>
	.create-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
		padding: 30rpx;
	}
	
	.create-header {
		margin-bottom: 30rpx;
	}
	
	.create-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333333;
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
		text-align: center;
		transition: all 0.2s ease;
	}

	.map-control-btn:active {
		background-color: #15897A;
		transform: scale(0.98);
	}

	.map-container {
		background-color: white;
		border-radius: 15rpx;
		padding: 20rpx;
		border: 2rpx solid #e5e5e5;
		position: relative;
	}

	.tencent-map {
		width: 100%;
		height: 300rpx;
		border-radius: 10rpx;
		margin-bottom: 15rpx;
	}

	/* 地图加载状态 */
	.map-loading {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: rgba(255, 255, 255, 0.9);
		padding: 20rpx 30rpx;
		border-radius: 15rpx;
		box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.1);
		z-index: 10;
	}

	.loading-text {
		font-size: 24rpx;
		color: #666;
	}

	.map-coordinates {
		margin-top: 15rpx;
		padding: 15rpx;
		background-color: rgba(26, 158, 143, 0.1);
		border-radius: 8rpx;
		text-align: left;
	}

	.coordinate-text {
		font-size: 20rpx;
		color: #1A9E8F;
		display: block;
		margin: 5rpx 0;
		line-height: 1.4;
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
	
	.action-buttons {
		display: flex;
		gap: 20rpx;
		margin-top: 40rpx;
	}
	
	.save-btn, .publish-btn {
		flex: 1;
		height: 80rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		font-weight: bold;
	}
	
	.save-btn {
		background-color: #f8f9fa;
		color: #666666;
		border: 2rpx solid #e5e5e5;
	}
	
	.publish-btn {
		background-color: #1A9E8F;
		color: white;
		border: none;
	}
</style>