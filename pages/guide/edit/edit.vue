<template>
	<view class="edit-container">
			<!-- 顶部导航栏 -->
		<view class="detail-header">
			<!-- 第一行：返回按钮和标题 -->
			<view class="header-top-row">
				<view class="header-back" @click="goBack">
					<text class="back-icon">←</text>
					<text class="back-text">返回</text>
				</view>
				<view class="header-title">{{templateData ? templateData.title : '编辑攻略'}}</view>
				<view style="width: 120rpx;"></view> <!-- 占位，保持平衡 -->
			</view>
			
			<!-- 第二行：按钮 -->
				<view class="header-actions">
				<button class="action-btn map-btn" @click="showMap">
					<text class="action-icon">🗺️</text>
					<text class="action-text">地图</text>
					</button>
				</view>
			</view>

		<scroll-view class="detail-content" scroll-y v-if="templateData">
			<!-- 旅行攻略卡片 -->
			<view class="travel-guide-card">
				<!-- 背景图区域 -->
				<view class="banner-section">
					<image :src="templateData.image" mode="aspectFill" class="banner-image" @click="changeBannerImage" />
					<view class="banner-overlay"></view>
					<view class="banner-content">
						<view class="title-wrapper">
							<text 
								class="guide-title editable" 
								:class="{ editing: editingTitle }"
								@tap="startEditTitle"
								v-if="!editingTitle"
							>{{templateData.title}}</text>
							<input 
								v-else
								class="title-input"
								v-model="templateData.title"
								@blur="saveTitle"
								@confirm="saveTitle"
								:focus="editingTitle"
							/>
						</view>
						<view class="subtitle-wrapper">
							<text 
								class="guide-subtitle editable" 
								:class="{ editing: editingSubtitle }"
								@tap="startEditSubtitle"
								v-if="!editingSubtitle"
							>{{templateData.subtitle}}</text>
							<input 
								v-else
								class="subtitle-input"
								v-model="templateData.subtitle"
								@blur="saveSubtitle"
								@confirm="saveSubtitle"
								:focus="editingSubtitle"
							/>
						</view>
					</view>
				</view>

				<!-- 折叠式菜单区域 -->
				<view class="content-section">
					<!-- 新增天数按钮 -->
					<view class="add-day-wrapper">
						<button class="add-day-btn" @click="addNewDay">
							<text class="add-icon">+</text>
							<text class="add-text">新增天数</text>
								</button>
						</view>
						
					<view 
						class="day-section" 
						v-for="(day, dayIndex) in templateData.days" 
						:key="dayIndex"
					>
						<view class="day-header" @tap="toggleDay(dayIndex)">
							<view class="day-title-wrapper">
								<view 
									class="day-number" 
									:class="{ 'delete-highlight': deletingDayIndex === dayIndex }"
									@tap.stop="showDeleteDayConfirm(dayIndex)"
								>
									{{day.day || (dayIndex + 1)}}
							</view>
								<view class="day-title-input-wrapper">
									<text 
										class="day-title editable" 
										:class="{ editing: editingDayTitle === dayIndex }"
										@tap.stop="startEditDayTitle(dayIndex)"
										v-if="editingDayTitle !== dayIndex"
									>{{day.title || `第${dayIndex + 1}天：行程`}}</text>
									<input 
										v-else
										class="day-title-input"
										v-model="day.title"
										@blur="saveDayTitle(dayIndex)"
										@confirm="saveDayTitle(dayIndex)"
										:focus="editingDayTitle === dayIndex"
									/>
							</view>
						</view>
							<text 
								class="day-toggle-icon" 
								:class="{ rotated: day.expanded }"
							>▼</text>
					</view>
					
						<view class="day-content" v-show="day.expanded">
							<!-- 新增地点按钮 -->
							<view class="add-location-wrapper">
								<button class="add-location-btn" @click="addNewLocation(dayIndex)">
									<text class="add-icon-small">+</text>
									<text class="add-text-small">新增地点</text>
							</button>
					</view>
					
							<view class="locations-list">
								<view 
									class="location-card" 
									v-for="(location, locIndex) in day.locations" 
									:key="locIndex"
									:class="{ 'delete-highlight': deletingLocationId === `${dayIndex}-${locIndex}` }"
									@tap="toggleLocationDetails(dayIndex, locIndex)"
									@longpress="showDeleteLocationConfirm(dayIndex, locIndex)"
								>
									<view class="location-header">
										<view class="location-info">
											<view class="location-name-wrapper">
												<text 
													class="location-name editable" 
													:class="{ editing: editingLocationName === `${dayIndex}-${locIndex}` }"
													@tap.stop="startEditLocationName(dayIndex, locIndex)"
													v-if="editingLocationName !== `${dayIndex}-${locIndex}`"
												>{{location.name || '新地点'}}</text>
												<input 
													v-else
													class="location-name-input"
													v-model="location.name"
													@blur="saveLocationName(dayIndex, locIndex)"
													@confirm="saveLocationName(dayIndex, locIndex)"
													:focus="editingLocationName === `${dayIndex}-${locIndex}`"
												/>
						</view>
											<view class="location-desc-wrapper">
												<text 
													class="location-desc editable" 
													:class="{ editing: editingLocationDesc === `${dayIndex}-${locIndex}` }"
													@tap.stop="startEditLocationDesc(dayIndex, locIndex)"
													v-if="editingLocationDesc !== `${dayIndex}-${locIndex}`"
												>{{location.desc || location.description || '请输入地点描述'}}</text>
												<input 
													v-else
													class="location-desc-input"
													v-model="location.desc"
													@blur="saveLocationDesc(dayIndex, locIndex)"
													@confirm="saveLocationDesc(dayIndex, locIndex)"
													:focus="editingLocationDesc === `${dayIndex}-${locIndex}`"
												/>
											</view>
						</view>
										<view class="location-actions">
											<view class="time-badge">
												<text class="time-icon">⏰</text>
												<view class="time-input-wrapper">
													<text 
														class="time-text editable" 
														:class="{ editing: editingLocationTime === `${dayIndex}-${locIndex}` }"
														@tap.stop="startEditLocationTime(dayIndex, locIndex)"
														v-if="editingLocationTime !== `${dayIndex}-${locIndex}`"
													>{{location.time || '1-2小时'}}</text>
													<input 
														v-else
														class="time-input"
														v-model="location.time"
														@blur="saveLocationTime(dayIndex, locIndex)"
														@confirm="saveLocationTime(dayIndex, locIndex)"
														:focus="editingLocationTime === `${dayIndex}-${locIndex}`"
													/>
					</view>
				</view>
											<button 
												class="location-btn" 
												@tap.stop="showLocationOnMap(dayIndex, locIndex)"
											>
												<text class="location-icon">📍</text>
					</button>
				</view>
			</view>

									<!-- 地点详情 -->
									<view class="location-details" v-show="location.showDetails">
										<view class="transport-section">
											<view class="transport-title-wrapper">
												<text class="transport-title">交通方式</text>
						</view>
											<view class="transport-grid">
												<view class="transport-item" v-for="(transport, transIndex) in location.transport" :key="transIndex">
													<text class="transport-icon">{{transport.type}}</text>
													<view class="transport-info">
														<view class="transport-type-wrapper">
															<text 
																class="transport-type editable" 
																:class="{ editing: editingTransportType === `${dayIndex}-${locIndex}-${transIndex}` }"
																@tap.stop="startEditTransportType(dayIndex, locIndex, transIndex)"
																v-if="editingTransportType !== `${dayIndex}-${locIndex}-${transIndex}`"
															>{{transport.type === '🚇' ? '地铁' : transport.type === '🚕' ? '出租车' : transport.type === '🚌' ? '公交' : '其他'}}</text>
															<input 
																v-else
																class="transport-type-input"
																v-model="transport.type"
																@blur="saveTransportType(dayIndex, locIndex, transIndex)"
																@confirm="saveTransportType(dayIndex, locIndex, transIndex)"
																:focus="editingTransportType === `${dayIndex}-${locIndex}-${transIndex}`"
															/>
					</view>
														<view class="transport-detail-wrapper">
															<text 
																class="transport-detail editable" 
																:class="{ editing: editingTransportRoute === `${dayIndex}-${locIndex}-${transIndex}` }"
																@tap.stop="startEditTransportRoute(dayIndex, locIndex, transIndex)"
																v-if="editingTransportRoute !== `${dayIndex}-${locIndex}-${transIndex}`"
															>{{transport.route}}</text>
															<input 
																v-else
																class="transport-detail-input"
																v-model="transport.route"
																@blur="saveTransportRoute(dayIndex, locIndex, transIndex)"
																@confirm="saveTransportRoute(dayIndex, locIndex, transIndex)"
																:focus="editingTransportRoute === `${dayIndex}-${locIndex}-${transIndex}`"
															/>
							</view>
						</view>
									</view>
								</view>
											</view>
										<view class="details-content" v-if="location.details">
											<text class="details-title">景点详情</text>
											<view class="details-text-wrapper">
												<text 
													class="details-text editable" 
													:class="{ editing: editingLocationDetails === `${dayIndex}-${locIndex}` }"
													@tap.stop="startEditLocationDetails(dayIndex, locIndex)"
													v-if="editingLocationDetails !== `${dayIndex}-${locIndex}`"
												>{{location.details}}</text>
												<textarea 
													v-else
													class="details-text-input"
													v-model="location.details"
													@blur="saveLocationDetails(dayIndex, locIndex)"
													:focus="editingLocationDetails === `${dayIndex}-${locIndex}`"
												/>
												</view>
													</view>
												</view>
											</view>
										</view>
									</view>
						</view>
					</view>

				<!-- 攻略总结 -->
				<view class="tips-section" v-if="templateData.tips && templateData.tips.length > 0">
						<text class="tips-title">旅行小贴士</text>
						<view class="tips-list">
						<view class="tip-item" v-for="(tip, tipIndex) in templateData.tips" :key="tipIndex">
							<text class="tip-icon">{{tipIndex === 0 ? 'ℹ️' : tipIndex === 1 ? '📍' : tipIndex === 2 ? '☀️' : '🍽️'}}</text>
							<view class="tip-text-wrapper">
								<text 
									class="tip-text editable" 
									:class="{ editing: editingTipIndex === tipIndex }"
									@tap="startEditTip(tipIndex)"
									v-if="editingTipIndex !== tipIndex"
								>{{tip}}</text>
								<input 
									v-else
									class="tip-text-input"
									v-model="templateData.tips[tipIndex]"
									@blur="saveTip(tipIndex)"
									@confirm="saveTip(tipIndex)"
									:focus="editingTipIndex === tipIndex"
								/>
							</view>
							</view>
							</view>
							</view>
						</view>
		</scroll-view>

		<!-- 加载状态 -->
		<view class="loading-container" v-else>
			<view class="loading-content">
				<text class="loading-text">加载中...</text>
						</view>
						</view>

		<!-- 删除确认对话框 -->
		<view class="delete-overlay" v-if="showDeleteConfirm" @tap="cancelDelete"></view>
		<view class="delete-confirm" v-if="showDeleteConfirm">
			<text class="delete-title">确认删除</text>
			<text class="delete-message">{{ deleteMessage }}</text>
			<view class="delete-actions">
				<button class="cancel-delete-btn" @tap="cancelDelete">取消</button>
				<button class="confirm-delete-btn" @tap="confirmDelete">确认删除</button>
					</view>
		</view>

		<!-- 地图弹窗 -->
		<view class="map-modal" v-if="showMapModal">
			<view class="modal-overlay" @click="closeMap"></view>
			<view class="modal-content">
				<view class="modal-header">
					<text class="modal-title">{{templateData ? templateData.title + '地图' : '景点地图'}}</text>
					<view class="modal-close" @click="closeMap">
						<text>×</text>
					</view>
				</view>
				<view class="map-container">
					<map 
						:longitude="mapMarkers.length > 0 ? mapMarkers[0].longitude : 116.3974" 
						:latitude="mapMarkers.length > 0 ? mapMarkers[0].latitude : 39.9093" 
						scale="12"
						:markers="mapMarkers"
						:polyline="mapPolyline"
						class="detail-map"
					></map>
				</view>
			</view>
		</view>

		<!-- 全屏地图视图 -->
		<view class="full-map-container" v-if="showFullMap" @tap="closeFullMap">
			<view class="map-header" @tap.stop>
				<button class="map-close-btn" @tap="closeFullMap">
					<text class="close-icon">×</text>
				</button>
				<text class="map-title">{{ currentLocationName || '地点定位' }}</text>
					</view>
			<view class="map-content" @tap.stop>
				<map 
					v-if="showFullMap"
					:key="`map-${mapKey}`"
					id="fullMap"
					:longitude="staticMapLongitude"
					:latitude="staticMapLatitude"
					:scale="staticMapScale"
					:markers="markersLocked ? fullMapMarkers : []"
					:show-location="false"
					:enable-zoom="true"
					:enable-scroll="true"
					:enable-rotate="false"
					:enable-overlooking="false"
					:enable-poi="true"
					:enable-building="true"
					class="full-map"
					@markertap="onMapMarkerTap"
					@regionchange="onMapRegionChange"
					@tap="onMapTap"
					@updated="onMapUpdated"
				></map>
			</view>
		</view>
	</view>
</template>

<script>
	import locationService from '@/services/location.service.js'
	import { mapConfig } from '@/config/map.config.js'
	
	export default {
		data() {
			return {
				templateData: null,
				showMapModal: false,
				mapMarkers: [],
				mapPolyline: [],
				
				// 编辑状态
				editingTitle: false,
				editingSubtitle: false,
				editingDayTitle: null,
				editingLocationName: null,
				editingLocationDesc: null,
				editingLocationTime: null,
				editingTransportType: null,
				editingTransportRoute: null,
				editingLocationDetails: null,
				editingTipIndex: null,
				
				// 删除确认
				showDeleteConfirm: false,
				deleteMessage: '',
				deleteType: null, // 'day' or 'location'
				deleteDayIndex: null,
				deleteLocationDayIndex: null,
				deleteLocationIndex: null,
				deletingDayIndex: null,
				deletingLocationId: null,
				
				// 全屏地图
				showFullMap: false,
				currentLocationName: '',
				staticMapLongitude: mapConfig.defaultCenter.longitude,
				staticMapLatitude: mapConfig.defaultCenter.latitude,
				staticMapScale: 16,
				fullMapMarkers: [],
				mapKey: 0,
				markersLocked: false,
				isMapUpdating: false,
				mapInitialized: false
			}
		},
		onLoad(options) {
			// 从URL参数中获取模板数据
			if (options.templateData) {
				try {
					const decodedData = decodeURIComponent(options.templateData)
					this.templateData = JSON.parse(decodedData)
					this.initTemplateData()
				} catch (error) {
					console.error('解析模板数据失败:', error)
					uni.showToast({
						title: '加载模板失败',
						icon: 'none'
					})
				}
			}
		},
		methods: {
			initTemplateData() {
				if (!this.templateData) return
				
				if (this.templateData.days) {
					this.templateData.days.forEach((day, index) => {
						// 初始化展开状态，使用 day.expanded 属性
						if (typeof day.expanded === 'undefined') {
							this.$set(day, 'expanded', index === 0) // 默认展开第一天
						}
						
						if (day.locations) {
							day.locations.forEach((location, locIndex) => {
								// 初始化地点详情展开状态，使用 location.showDetails 属性
								if (typeof location.showDetails === 'undefined') {
									this.$set(location, 'showDetails', false)
								}
								// 统一字段：如果有 description 但没有 desc，将 description 赋值给 desc
								if (location.description && !location.desc) {
									this.$set(location, 'desc', location.description)
								}
								// 为每个地点添加坐标属性（如果还没有）
								if (!location.coordinates && this.templateData.mapMarkers) {
									const marker = this.templateData.mapMarkers.find(m => m.title === location.name)
									if (marker) {
										location.coordinates = {
											lat: marker.latitude,
											lng: marker.longitude
										}
									}
								}
							})
						}
					})
				}
				
				// 设置地图标记和连线
				if (this.templateData.mapMarkers) {
					this.mapMarkers = this.templateData.mapMarkers.map((marker, index) => ({
						id: index + 1,
						longitude: marker.longitude,
						latitude: marker.latitude,
						title: marker.title,
						iconPath: '/static/images/map/marker.png',
						width: 30,
						height: 30
					}))
				}
				
				// 设置地图连线
				if (this.templateData.mapPolyline) {
					this.mapPolyline = this.templateData.mapPolyline
				}
			},
			
			// 编辑功能
			startEditTitle() {
				this.editingTitle = true
			},
			saveTitle() {
				this.editingTitle = false
			},
			startEditSubtitle() {
				this.editingSubtitle = true
			},
			saveSubtitle() {
				this.editingSubtitle = false
			},
			startEditDayTitle(dayIndex) {
				this.editingDayTitle = dayIndex
			},
			saveDayTitle(dayIndex) {
				this.editingDayTitle = null
			},
			startEditLocationName(dayIndex, locIndex) {
				this.editingLocationName = `${dayIndex}-${locIndex}`
			},
			saveLocationName(dayIndex, locIndex) {
				this.editingLocationName = null
			},
			startEditLocationDesc(dayIndex, locIndex) {
				this.editingLocationDesc = `${dayIndex}-${locIndex}`
			},
			saveLocationDesc(dayIndex, locIndex) {
				this.editingLocationDesc = null
			},
			startEditLocationTime(dayIndex, locIndex) {
				this.editingLocationTime = `${dayIndex}-${locIndex}`
			},
			saveLocationTime(dayIndex, locIndex) {
				this.editingLocationTime = null
			},
			startEditTransportType(dayIndex, locIndex, transIndex) {
				this.editingTransportType = `${dayIndex}-${locIndex}-${transIndex}`
			},
			saveTransportType(dayIndex, locIndex, transIndex) {
				this.editingTransportType = null
			},
			startEditTransportRoute(dayIndex, locIndex, transIndex) {
				this.editingTransportRoute = `${dayIndex}-${locIndex}-${transIndex}`
			},
			saveTransportRoute(dayIndex, locIndex, transIndex) {
				this.editingTransportRoute = null
			},
			startEditLocationDetails(dayIndex, locIndex) {
				this.editingLocationDetails = `${dayIndex}-${locIndex}`
			},
			saveLocationDetails(dayIndex, locIndex) {
				this.editingLocationDetails = null
			},
			startEditTip(tipIndex) {
				this.editingTipIndex = tipIndex
			},
			saveTip(tipIndex) {
				this.editingTipIndex = null
			},
			
			// 天数管理
			toggleDay(dayIndex) {
				if (this.templateData.days[dayIndex]) {
					this.$set(this.templateData.days[dayIndex], 'expanded', !this.templateData.days[dayIndex].expanded)
				}
			},
			addNewDay() {
				if (!this.templateData.days) {
					this.templateData.days = []
				}
				const newDay = {
					day: this.templateData.days.length + 1,
					title: `第${this.templateData.days.length + 1}天：行程`,
					expanded: true,
					locations: []
				}
				this.templateData.days.push(newDay)
			},
			showDeleteDayConfirm(dayIndex) {
				this.deleteType = 'day'
				this.deleteDayIndex = dayIndex
				this.deletingDayIndex = dayIndex
				this.deleteMessage = '您确定要删除这一天的所有行程吗？'
				this.showDeleteConfirm = true
			},
			
			// 地点管理
			toggleLocationDetails(dayIndex, locIndex) {
				const location = this.templateData.days[dayIndex].locations[locIndex]
				if (location) {
					this.$set(location, 'showDetails', !location.showDetails)
				}
			},
			addNewLocation(dayIndex) {
				if (!this.templateData.days[dayIndex].locations) {
					this.templateData.days[dayIndex].locations = []
				}
				const newLocation = {
					name: '新地点',
					desc: '请输入地点描述',
					time: '1-2小时',
					showDetails: false,
					transport: [
						{ type: '🚇', route: '请输入地铁线路' },
						{ type: '🚕', route: '请输入出租车信息' }
					],
					details: '',
					coordinates: null
				}
				this.templateData.days[dayIndex].locations.push(newLocation)
			},
			showDeleteLocationConfirm(dayIndex, locIndex) {
				this.deleteType = 'location'
				this.deleteLocationDayIndex = dayIndex
				this.deleteLocationIndex = locIndex
				this.deletingLocationId = `${dayIndex}-${locIndex}`
				this.deleteMessage = '您确定要删除这个地点吗？'
				this.showDeleteConfirm = true
			},
			
			// 删除确认
			confirmDelete() {
				if (this.deleteType === 'day') {
					this.templateData.days.splice(this.deleteDayIndex, 1)
					// 重新编号天数
					this.templateData.days.forEach((day, index) => {
						day.day = index + 1
						day.title = day.title.replace(/第\d+天/, `第${index + 1}天`)
					})
					// 重新初始化展开状态
					this.initTemplateData()
				} else if (this.deleteType === 'location') {
					this.templateData.days[this.deleteLocationDayIndex].locations.splice(this.deleteLocationIndex, 1)
				}
				this.cancelDelete()
					// 更新地图标记
				this.updateMapMarkers()
			},
			cancelDelete() {
				this.showDeleteConfirm = false
				this.deleteType = null
				this.deleteDayIndex = null
				this.deleteLocationDayIndex = null
				this.deleteLocationIndex = null
				this.deletingDayIndex = null
				this.deletingLocationId = null
			},
			
			// 地图功能
			showMap() {
				this.updateMapMarkers()
				this.showMapModal = true
			},
			closeMap() {
				this.showMapModal = false
			},
			updateMapMarkers() {
				this.mapMarkers = []
				this.mapPolyline = []
				
				if (this.templateData && this.templateData.days) {
					const allPoints = []
					let markerId = 0
					
					this.templateData.days.forEach((day, dayIndex) => {
						if (day.locations) {
							day.locations.forEach((location, locIndex) => {
								if (location.coordinates && location.coordinates.lng && location.coordinates.lat) {
									const marker = {
										id: markerId++,
										longitude: location.coordinates.lng,
										latitude: location.coordinates.lat,
										title: location.name,
										iconPath: '/static/images/map/marker.png',
										width: 30,
										height: 30
									}
									this.mapMarkers.push(marker)
									allPoints.push({
										longitude: location.coordinates.lng,
										latitude: location.coordinates.lat
									})
								}
							})
						}
					})
					
					if (allPoints.length > 1) {
						this.mapPolyline = [{
							points: allPoints,
							color: '#165DFF',
							width: 6,
							dottedLine: false
						}]
					}
				}
			},
			
			// 地点定位
			async showLocationOnMap(dayIndex, locIndex) {
				const location = this.templateData.days[dayIndex].locations[locIndex]
				
				if (!location || !location.name || !location.name.trim()) {
				uni.showToast({
						title: '地点名称不能为空',
					icon: 'none'
				})
					return
				}
				
				// 如果没有坐标，尝试获取
				if (!location.coordinates) {
					uni.showLoading({
						title: '正在定位...'
					})
					try {
						const coords = await locationService.getCoordinatesByName(location.name.trim())
						if (coords && coords.latitude && coords.longitude) {
							location.coordinates = {
								lat: coords.latitude,
								lng: coords.longitude
							}
					} else {
							throw new Error('获取坐标失败')
					}
				} catch (error) {
						console.error('获取坐标失败:', error)
						uni.hideLoading()
					uni.showToast({
							title: '无法获取地点坐标，请检查地点名称',
							icon: 'none',
							duration: 2000
						})
						return
					}
					uni.hideLoading()
				}
				
				// 验证坐标是否有效
				if (!location.coordinates || !location.coordinates.lng || !location.coordinates.lat) {
					uni.showToast({
						title: '地点坐标无效，无法显示地图',
						icon: 'none',
						duration: 2000
					})
					return
				}
				
				// 显示全屏地图
				this.currentLocationName = location.name
				this.staticMapLongitude = Number(Number(location.coordinates.lng).toFixed(6))
				this.staticMapLatitude = Number(Number(location.coordinates.lat).toFixed(6))
				this.staticMapScale = 16
				this.mapInitialized = false
				this.markersLocked = false
				this.isMapUpdating = true
				this.mapKey++
				this.showFullMap = true
				
				// 准备标记
				const markerToAdd = {
					id: 0,
					longitude: this.staticMapLongitude,
					latitude: this.staticMapLatitude,
					title: location.name,
					iconPath: '/static/images/map/marker.png',
					width: 30,
					height: 30,
					callout: {
						content: location.name,
						color: '#ffffff',
						fontSize: 14,
						borderRadius: 4,
						bgColor: '#165DFF',
						padding: 8,
						display: 'ALWAYS',
						textAlign: 'center'
					}
				}
				
				// 等待地图组件渲染完成后再添加标记
				this.$nextTick(() => {
					setTimeout(() => {
						this.fullMapMarkers = [markerToAdd]
						this.mapInitialized = true
						this.markersLocked = true
						
					setTimeout(() => {
							this.isMapUpdating = false
						}, 1000)
					}, 300)
				})
			},
			closeFullMap() {
				this.showFullMap = false
				this.isMapUpdating = false
				this.mapInitialized = false
				this.markersLocked = false
				this.fullMapMarkers = []
			},
			onMapMarkerTap(e) {
				const markerId = e.detail.markerId
				const marker = this.fullMapMarkers.find(m => m.id === markerId)
				if (marker) {
					uni.showToast({
						title: marker.title,
						icon: 'none'
					})
				}
			},
			onMapTap(e) {
				// 地图点击事件
			},
			onMapUpdated() {
				// 地图更新完成事件
			},
			onMapRegionChange(e) {
				if (this.isMapUpdating) {
					return
				}
				if (this.markersLocked) {
					const causedBy = e.causedBy || ''
					const type = e.type || ''
					if (type === 'end' && (causedBy === 'drag' || causedBy === 'scale' || causedBy === 'gesture')) {
						return
					}
					if (type === 'begin' || type === 'update') {
						if (causedBy !== 'drag' && causedBy !== 'scale' && causedBy !== 'gesture') {
							return
						}
					}
					return
				}
			},
			
			// 更换背景图
			changeBannerImage() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						this.templateData.image = res.tempFilePaths[0]
					}
				})
			},
			
			// 返回
			goBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style>
	.edit-container {
		min-height: 100vh;
		background: #f8fafc;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
	}
	
	.detail-header {
		display: flex;
		flex-direction: column;
		padding: 30rpx 30rpx 20rpx;
		background: linear-gradient(135deg, #165DFF 0%, #0E4BCC 100%);
		color: white;
		box-shadow: 0 4rpx 20rpx rgba(22, 93, 255, 0.3);
		position: relative;
		z-index: 10;
	}

	.header-top-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
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
		font-size: 36rpx;
		font-weight: 600;
		letter-spacing: 0.5rpx;
		text-align: center;
		flex: 1;
		margin: 0 40rpx;
	}
	
	.header-actions {
		display: flex;
		justify-content: center;
		gap: 20rpx;
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

	.map-btn {
		background: linear-gradient(135deg, #FF7D00 0%, #E66A00 100%);
		color: white;
	}
	
	.detail-content {
		height: calc(100vh - 120rpx);
		padding: 20rpx;
	}
	
	.travel-guide-card {
		background: white;
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: 0 10rpx 25rpx -5rpx rgba(0, 0, 0, 0.1), 0 8rpx 10rpx -6rpx rgba(0, 0, 0, 0.1);
		margin-bottom: 20rpx;
	}

	.banner-section {
		position: relative;
		height: 320rpx;
	}

	.banner-image {
		width: 100%;
		height: 100%;
	}

	.banner-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
	}

	.banner-content {
		position: absolute;
		bottom: 0;
		left: 0;
		padding: 40rpx;
		width: 100%;
	}

	.title-wrapper, .subtitle-wrapper {
		position: relative;
		margin-bottom: 10rpx;
	}

	.guide-title {
		font-size: 48rpx;
		font-weight: bold;
		color: white;
		display: block;
		margin-bottom: 10rpx;
		text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
	}

	.title-input {
		width: 100%;
		background: rgba(255, 255, 255, 0.95);
		padding: 12rpx 16rpx;
		border-radius: 8rpx;
		font-size: 48rpx;
		font-weight: bold;
		box-sizing: border-box;
	}

	.guide-subtitle {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.9);
		display: block;
		text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
	}

	.subtitle-input {
		width: 100%;
		background: rgba(255, 255, 255, 0.95);
		padding: 10rpx 14rpx;
		border-radius: 8rpx;
		font-size: 28rpx;
		box-sizing: border-box;
	}

	.content-section {
		padding: 40rpx;
	}

	.add-day-wrapper {
		text-align: center;
		margin-bottom: 30rpx;
	}
	
	.add-day-btn {
		background-color: #165DFF;
		color: white;
		font-size: 26rpx;
		font-weight: 500;
		padding: 14rpx 28rpx;
		border-radius: 12rpx;
		border: none;
		display: inline-flex;
		align-items: center;
		line-height: 1;
	}

	.add-icon {
		margin-right: 8rpx;
		font-size: 32rpx;
	}

	.add-icon-small {
		margin-right: 4rpx;
		font-size: 24rpx;
	}

	.add-text-small {
		font-size: 24rpx;
	}

	.day-section {
		margin-bottom: 40rpx;
		border-bottom: 2rpx solid #e2e8f0;
		padding-bottom: 40rpx;
	}

	.day-section:last-child {
		border-bottom: none;
		margin-bottom: 0;
		padding-bottom: 0;
	}

	.day-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
		padding: 20rpx 0;
	}

	.day-title-wrapper {
		display: flex;
		align-items: center;
		flex: 1;
		min-width: 0;
	}

	.day-number {
		width: 56rpx;
		height: 56rpx;
		min-width: 56rpx;
		border-radius: 50%;
		background-color: #165DFF;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		font-weight: bold;
		margin-right: 20rpx;
	}

	.day-number.delete-highlight {
		background-color: #f87171;
	}

	.day-title-input-wrapper {
		flex: 1;
		position: relative;
		min-width: 0;
	}

	.day-title {
		font-size: 40rpx;
		font-weight: bold;
		color: #165DFF;
		word-break: break-word;
		line-height: 1.4;
	}

	.day-title-input {
		width: 100%;
		background: #f9f9f9;
		padding: 12rpx 16rpx;
		border-radius: 8rpx;
		font-size: 40rpx;
		font-weight: bold;
		box-sizing: border-box;
	}

	.day-toggle-icon {
		font-size: 28rpx;
		color: #165DFF;
		transition: transform 0.3s;
		flex-shrink: 0;
	}

	.day-toggle-icon.rotated {
		transform: rotate(180deg);
	}

	.day-content {
		margin-top: 24rpx;
	}

	.add-location-wrapper {
		text-align: center;
		margin-bottom: 24rpx;
	}

	.add-location-btn {
		background-color: #FF7D00;
		color: white;
		font-size: 22rpx;
		font-weight: 500;
		padding: 10rpx 20rpx;
		border-radius: 10rpx;
		border: none;
		display: inline-flex;
		align-items: center;
		line-height: 1;
	}

	.locations-list {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
	}

	.location-card {
		background-color: #f9f9f9;
		border-radius: 20rpx;
		padding: 24rpx;
		box-sizing: border-box;
	}

	.location-card.delete-highlight {
		background-color: #fee2e2;
	}

	.location-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 16rpx;
	}

	.location-info {
		flex: 1;
		min-width: 0;
	}

	.location-name-wrapper, .location-desc-wrapper {
		position: relative;
		margin-bottom: 12rpx;
	}

	.location-name {
		font-size: 32rpx;
		font-weight: 600;
		color: #1E293B;
		display: block;
		margin-bottom: 8rpx;
		word-break: break-word;
	}

	.location-name-input {
		width: 100%;
		background: white;
		padding: 10rpx 12rpx;
		border-radius: 8rpx;
		font-size: 32rpx;
		font-weight: 600;
		box-sizing: border-box;
	}

	.location-desc {
		font-size: 26rpx;
		color: #64748B;
		display: block;
		line-height: 1.4;
		word-break: break-word;
	}

	.location-desc-input {
		width: 100%;
		background: white;
		padding: 10rpx 12rpx;
		border-radius: 8rpx;
		font-size: 26rpx;
		box-sizing: border-box;
	}

	.location-actions {
		display: flex;
		align-items: center;
		gap: 12rpx;
		flex-shrink: 0;
	}

	.time-badge {
		background-color: rgba(255, 125, 0, 0.1);
		color: #FF7D00;
		padding: 6rpx 16rpx;
		border-radius: 16rpx;
		font-size: 22rpx;
		display: flex;
		align-items: center;
		white-space: nowrap;
	}

	.time-icon {
		margin-right: 6rpx;
		font-size: 22rpx;
	}

	.time-input-wrapper {
		position: relative;
	}

	.time-text {
		font-size: 22rpx;
	}

	.time-input {
		width: 100rpx;
		background: white;
		padding: 4rpx 6rpx;
		border-radius: 4rpx;
		font-size: 22rpx;
		box-sizing: border-box;
	}

	.location-btn {
		width: 44rpx;
		height: 44rpx;
		min-width: 44rpx;
		max-width: 44rpx;
		border-radius: 50%;
		background-color: #165DFF;
		color: white;
		border: none;
		padding: 0;
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
		flex-shrink: 0;
		box-sizing: border-box;
		line-height: 1;
	}

	.location-icon {
		font-size: 24rpx;
	}

	.location-details {
		margin-top: 20rpx;
		padding-top: 20rpx;
		border-top: 1rpx solid #e2e8f0;
	}
	
	.transport-section {
		background-color: white;
		border-radius: 12rpx;
		padding: 20rpx;
		border: 2rpx solid #e5e5e5;
		box-sizing: border-box;
	}

	.transport-title-wrapper {
		position: relative;
		margin-bottom: 12rpx;
	}

	.transport-title {
		font-size: 28rpx;
		font-weight: 500;
		color: #1E293B;
	}

	.transport-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12rpx;
	}

	.transport-item {
		display: flex;
		align-items: center;
		padding: 12rpx;
		border: 2rpx solid #e5e5e5;
		border-radius: 10rpx;
		box-sizing: border-box;
	}

	.transport-icon {
		font-size: 36rpx;
		margin-right: 12rpx;
		flex-shrink: 0;
	}

	.transport-info {
		flex: 1;
		min-width: 0;
	}

	.transport-type-wrapper, .transport-detail-wrapper {
		position: relative;
		margin-bottom: 6rpx;
	}

	.transport-type {
		font-size: 26rpx;
		font-weight: 500;
		color: #1E293B;
		display: block;
		word-break: break-word;
	}

	.transport-type-input {
		width: 100%;
		background: #f9f9f9;
		padding: 6rpx 8rpx;
		border-radius: 4rpx;
		font-size: 26rpx;
		font-weight: 500;
		box-sizing: border-box;
	}

	.transport-detail {
		font-size: 22rpx;
		color: #666;
		display: block;
		word-break: break-word;
		line-height: 1.4;
	}

	.transport-detail-input {
		width: 100%;
		background: #f9f9f9;
		padding: 6rpx 8rpx;
		border-radius: 4rpx;
		font-size: 22rpx;
		box-sizing: border-box;
	}

	.details-content {
		margin-bottom: 24rpx;
		padding: 20rpx;
		background: #f8fafc;
		border-radius: 12rpx;
		border-left: 4rpx solid #165DFF;
	}

	.details-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #165DFF;
		display: block;
		margin-bottom: 12rpx;
	}

	.details-text-wrapper {
		position: relative;
	}

	.details-text {
		font-size: 26rpx;
		color: #475569;
		line-height: 1.6;
		display: block;
		word-break: break-word;
	}

	.details-text-input {
		width: 100%;
		background: white;
		padding: 10rpx 12rpx;
		border-radius: 8rpx;
		font-size: 26rpx;
		min-height: 120rpx;
		box-sizing: border-box;
	}

	.tips-section {
		background: rgba(22, 93, 255, 0.05);
		padding: 40rpx;
		border-top: 1rpx solid #e2e8f0;
	}

	.tips-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #165DFF;
		display: block;
		margin-bottom: 24rpx;
	}
	
	.tips-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.tip-item {
		display: flex;
		align-items: flex-start;
		gap: 16rpx;
	}

	.tip-icon {
		font-size: 24rpx;
		margin-top: 4rpx;
		flex-shrink: 0;
	}

	.tip-text-wrapper {
		flex: 1;
		position: relative;
		min-width: 0;
	}

	.tip-text {
		font-size: 26rpx;
		color: #475569;
		line-height: 1.5;
		flex: 1;
		word-break: break-word;
	}

	.tip-text-input {
		width: 100%;
		background: white;
		padding: 10rpx 12rpx;
		border-radius: 8rpx;
		font-size: 26rpx;
		box-sizing: border-box;
	}

	.editable {
		cursor: pointer;
	}

	.editable.editing {
		outline: 2rpx solid #165DFF;
		border-radius: 4rpx;
	}

	.loading-container {
		display: flex;
		align-items: center;
		justify-content: center;
		height: calc(100vh - 120rpx);
	}

	.loading-content {
		text-align: center;
	}

	.loading-text {
		font-size: 28rpx;
		color: #64748B;
	}

	/* 删除确认对话框 */
	.delete-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 40;
	}

	.delete-confirm {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: white;
		padding: 32rpx 24rpx;
		border-radius: 16rpx;
		box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.2);
		z-index: 50;
		min-width: 480rpx;
		max-width: 90%;
		box-sizing: border-box;
	}

	.delete-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #ef4444;
		display: block;
		margin-bottom: 24rpx;
	}

	.delete-message {
		font-size: 26rpx;
		color: #666;
		display: block;
		margin-bottom: 32rpx;
		line-height: 1.5;
		word-break: break-word;
	}
	
	.delete-actions {
		display: flex;
		justify-content: flex-end;
		gap: 16rpx;
	}

	.cancel-delete-btn, .confirm-delete-btn {
		padding: 16rpx 32rpx;
		border-radius: 12rpx;
		font-size: 26rpx;
		border: none;
		line-height: 1;
	}

	.cancel-delete-btn {
		background-color: #f8f9fa;
		color: #666;
		border: 2rpx solid #e5e5e5;
	}

	.confirm-delete-btn {
		background-color: #ef4444;
		color: white;
	}

	.map-modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1000;
	}
	
	.modal-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4rpx);
	}
	
	.modal-content {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 90%;
		height: 70%;
		background: white;
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.3);
	}
	
	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1rpx solid #e2e8f0;
		background: #f8fafc;
	}
	
	.modal-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #1E293B;
	}
	
	.modal-close {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		background: #f1f5f9;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 36rpx;
		color: #64748B;
		cursor: pointer;
		transition: all 0.3s ease;
	}
	
	.modal-close:active {
		background: #e2e8f0;
		transform: scale(0.95);
	}

	.map-container {
		height: calc(100% - 120rpx);
	}

	.detail-map {
		width: 100%;
		height: 100%;
	}

	/* 全屏地图 */
	.full-map-container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: white;
		z-index: 100;
		display: flex;
		flex-direction: column;
	}

	.map-header {
		position: relative;
		height: 100rpx;
		background: white;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 24rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
		z-index: 101;
		box-sizing: border-box;
	}

	.map-close-btn {
		position: absolute;
		left: 20rpx;
		background: #165DFF;
		color: white;
		border: none;
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		flex-shrink: 0;
	}

	.map-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #1E293B;
		text-align: center;
		word-break: break-word;
		flex: 1;
		padding: 0 80rpx;
		box-sizing: border-box;
	}

	.map-content {
		flex: 1;
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.full-map {
		width: 100%;
		height: 100%;
		min-height: 600rpx;
	}
</style>
