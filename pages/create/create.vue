<template>
	<view class="create-container">
		<!-- 旅行攻略卡片 -->
		<view class="guide-card">
			<!-- 背景图区域 -->
			<view class="banner-section">
				<!-- 地图按钮 -->
				<view class="map-button-wrapper">
					<button class="map-button" @click="showMapView">
						<text class="map-button-icon">📍</text>
						<text class="map-button-text">查看地图</text>
					</button>
		</view>
				<image 
					:src="bannerImage" 
					mode="aspectFill" 
					class="banner-image"
					@click="changeBannerImage"
				></image>
				<view class="banner-overlay"></view>
				<view class="banner-content">
					<view class="title-wrapper">
						<text 
							class="guide-title editable" 
							:class="{ editing: editingTitle }"
							@tap="startEditTitle"
							v-if="!editingTitle"
						>{{ title || '北京三日游路线' }}</text>
						<input 
							v-else
							class="title-input"
							v-model="title"
							@blur="saveTitle"
							@confirm="saveTitle"
							:focus="editingTitle"
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

				<!-- 天数列表 -->
				<view 
					v-for="(day, dayIndex) in days" 
					:key="day.id"
					class="day-section"
				>
					<view class="day-header" @tap="toggleDay(dayIndex)">
						<view class="day-title-wrapper">
							<view 
								class="day-number" 
								:class="{ 'delete-highlight': deletingDayIndex === dayIndex }"
								@tap.stop="showDeleteDayConfirm(dayIndex)"
							>
								{{ dayIndex + 1 }}
					</view>
							<view class="day-title-input-wrapper">
								<text 
									class="day-title editable" 
									:class="{ editing: editingDayTitle === dayIndex }"
									@tap.stop="startEditDayTitle(dayIndex)"
									v-if="editingDayTitle !== dayIndex"
								>{{ day.title || `第${dayIndex + 1}天：行程` }}</text>
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
								v-for="(location, locIndex) in day.locations" 
								:key="location.id"
								class="location-card"
								:class="{ 'delete-highlight': deletingLocationId === location.id }"
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
											>{{ location.name || '新地点' }}</text>
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
											>{{ location.description || '请输入地点描述' }}</text>
											<input 
												v-else
												class="location-desc-input"
												v-model="location.description"
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
												>{{ location.time || '1-2小时' }}</text>
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
											<text 
												class="transport-title editable" 
												:class="{ editing: editingTransportTitle === `${dayIndex}-${locIndex}` }"
												@tap.stop="startEditTransportTitle(dayIndex, locIndex)"
												v-if="editingTransportTitle !== `${dayIndex}-${locIndex}`"
											>交通方式</text>
											<input 
												v-else
												class="transport-title-input"
												v-model="location.transportTitle"
												@blur="saveTransportTitle(dayIndex, locIndex)"
												@confirm="saveTransportTitle(dayIndex, locIndex)"
												:focus="editingTransportTitle === `${dayIndex}-${locIndex}`"
											/>
					</view>
										<view class="transport-grid">
											<view class="transport-item">
												<text class="transport-icon">🚇</text>
												<view class="transport-info">
													<view class="transport-type-wrapper">
														<text 
															class="transport-type editable" 
															:class="{ editing: editingTransportType === `${dayIndex}-${locIndex}-subway` }"
															@tap.stop="startEditTransportType(dayIndex, locIndex, 'subway')"
															v-if="editingTransportType !== `${dayIndex}-${locIndex}-subway`"
														>{{ location.subwayType || '地铁' }}</text>
														<input 
															v-else
															class="transport-type-input"
															v-model="location.subwayType"
															@blur="saveTransportType(dayIndex, locIndex, 'subway')"
															@confirm="saveTransportType(dayIndex, locIndex, 'subway')"
															:focus="editingTransportType === `${dayIndex}-${locIndex}-subway`"
														/>
													</view>
													<view class="transport-detail-wrapper">
														<text 
															class="transport-detail editable" 
															:class="{ editing: editingTransportDetail === `${dayIndex}-${locIndex}-subway` }"
															@tap.stop="startEditTransportDetail(dayIndex, locIndex, 'subway')"
															v-if="editingTransportDetail !== `${dayIndex}-${locIndex}-subway`"
														>{{ location.subwayDetail || '请输入地铁线路' }}</text>
														<input 
															v-else
															class="transport-detail-input"
															v-model="location.subwayDetail"
															@blur="saveTransportDetail(dayIndex, locIndex, 'subway')"
															@confirm="saveTransportDetail(dayIndex, locIndex, 'subway')"
															:focus="editingTransportDetail === `${dayIndex}-${locIndex}-subway`"
														/>
													</view>
												</view>
											</view>
											<view class="transport-item">
												<text class="transport-icon">🚕</text>
												<view class="transport-info">
													<view class="transport-type-wrapper">
														<text 
															class="transport-type editable" 
															:class="{ editing: editingTransportType === `${dayIndex}-${locIndex}-taxi` }"
															@tap.stop="startEditTransportType(dayIndex, locIndex, 'taxi')"
															v-if="editingTransportType !== `${dayIndex}-${locIndex}-taxi`"
														>{{ location.taxiType || '出租车' }}</text>
														<input 
															v-else
															class="transport-type-input"
															v-model="location.taxiType"
															@blur="saveTransportType(dayIndex, locIndex, 'taxi')"
															@confirm="saveTransportType(dayIndex, locIndex, 'taxi')"
															:focus="editingTransportType === `${dayIndex}-${locIndex}-taxi`"
														/>
													</view>
													<view class="transport-detail-wrapper">
														<text 
															class="transport-detail editable" 
															:class="{ editing: editingTransportDetail === `${dayIndex}-${locIndex}-taxi` }"
															@tap.stop="startEditTransportDetail(dayIndex, locIndex, 'taxi')"
															v-if="editingTransportDetail !== `${dayIndex}-${locIndex}-taxi`"
														>{{ location.taxiDetail || '请输入出租车信息' }}</text>
														<input 
															v-else
															class="transport-detail-input"
															v-model="location.taxiDetail"
															@blur="saveTransportDetail(dayIndex, locIndex, 'taxi')"
															@confirm="saveTransportDetail(dayIndex, locIndex, 'taxi')"
															:focus="editingTransportDetail === `${dayIndex}-${locIndex}-taxi`"
														/>
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 攻略总结 -->
			<view class="tips-section">
				<view class="tips-title-wrapper">
					<text 
						class="tips-title editable" 
						:class="{ editing: editingTipsTitle }"
						@tap="startEditTipsTitle"
						v-if="!editingTipsTitle"
					>旅行小贴士</text>
					<input 
						v-else
						class="tips-title-input"
						v-model="tipsTitle"
						@blur="saveTipsTitle"
						@confirm="saveTipsTitle"
						:focus="editingTipsTitle"
					/>
					</view>
				<view class="tips-list">
					<view 
						v-for="(tip, tipIndex) in tips" 
						:key="tipIndex"
						class="tip-item"
					>
						<text class="tip-icon">ℹ️</text>
						<view class="tip-text-wrapper">
							<text 
								class="tip-text editable" 
								:class="{ editing: editingTipIndex === tipIndex }"
								@tap="startEditTip(tipIndex)"
								v-if="editingTipIndex !== tipIndex"
							>{{ tip }}</text>
							<input 
								v-else
								class="tip-text-input"
								v-model="tips[tipIndex]"
								@blur="saveTip(tipIndex)"
								@confirm="saveTip(tipIndex)"
								:focus="editingTipIndex === tipIndex"
							/>
						</view>
					</view>
				</view>
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
		
		<!-- 页脚 -->
		<view class="footer">
			<text class="footer-text">© 2025 旅行攻略 | 设计与开发</text>
		</view>
		
		<!-- 全屏地图视图 -->
		<view class="map-container" v-if="showMap" @tap="closeMap">
			<view class="map-header" @tap.stop>
				<button class="map-close-btn" @tap="closeMap">
					<text class="close-icon">×</text>
				</button>
				<text class="map-title">{{ mapTitle }}</text>
			</view>
			<view class="map-content" @tap.stop>
				<!-- 使用key强制重新创建地图，避免响应式更新导致自动移动 -->
				<map 
					v-if="showMap"
					:key="`map-${mapKey}`"
					id="fullMap"
					:longitude="staticMapLongitude"
					:latitude="staticMapLatitude"
					:scale="staticMapScale"
					:markers="markersLocked ? mapMarkers : []"
					:polyline="markersLocked ? mapPolyline : []"
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
	import { mapConfig, mapUtils } from '../../config/map.config.js'
	import locationService from '../../services/location.service.js'
	import guideService from '../../services/guideService.js'
	
	// 预设地点坐标
	const locationCoordinates = {
		'故宫博物院': { lat: 39.916327, lng: 116.397128 },
		'天安门广场': { lat: 39.905466, lng: 116.391543 },
		'前门大街': { lat: 39.904692, lng: 116.395935 },
		'颐和园': { lat: 39.998576, lng: 116.275596 },
		'国家体育场（鸟巢）': { lat: 39.990884, lng: 116.396565 },
		'国家游泳中心（水立方）': { lat: 39.991826, lng: 116.395425 },
		'南锣鼓巷': { lat: 39.946942, lng: 116.407045 },
		'什刹海': { lat: 39.942226, lng: 116.397128 },
		'798艺术区': { lat: 39.998879, lng: 116.497012 }
	}
	
	export default {
		data() {
			return {
				// 基本信息
				title: '请输入标题',
				subtitle: '',
				bannerImage: '/static/images/background/banner.jpg',
				
				// 编辑状态
				editingTitle: false,
				editingSubtitle: false,
				editingDayTitle: null,
				editingLocationName: null,
				editingLocationDesc: null,
				editingLocationTime: null,
				editingTransportTitle: null,
				editingTransportType: null,
				editingTransportDetail: null,
				editingTipsTitle: false,
				editingTipIndex: null,
				tipsTitle: '旅行小贴士',
				
				// 天数数据
				days: [
					{
						id: 'day1',
						title: '第一天',
						expanded: true,
						locations: []
					}
				],
				
				// 旅行小贴士
				tips: [
					'提前预约故宫、颐和园等热门景点门票，避免耽误行程',
					'建议购买北京交通一卡通，方便乘坐地铁和公交车',
					'根据季节准备衣物，春秋季早晚温差较大',
					'品尝北京特色美食：北京烤鸭、炸酱面、豆汁焦圈等'
				],
				
				// 删除确认
				showDeleteConfirm: false,
				deleteMessage: '',
				deleteType: null, // 'day' or 'location'
				deleteDayIndex: null,
				deleteLocationDayIndex: null,
				deleteLocationIndex: null,
				deletingDayIndex: null,
				deletingLocationId: null,
				
				// 地图相关
				showMap: false,
				mapTitle: '北京三日游路线地图',
				mapCenter: {
					longitude: mapConfig.defaultCenter.longitude,
					latitude: mapConfig.defaultCenter.latitude
				},
				mapScale: 12,
				mapMarkers: [],
				mapPolyline: [],
				mapIncludePoints: [], // 包含所有标记点的区域，用于固定地图视图范围
				// 使用静态的中心点，不在响应式系统中更新
				staticMapLongitude: mapConfig.defaultCenter.longitude,
				staticMapLatitude: mapConfig.defaultCenter.latitude,
				staticMapScale: 12,
				isMapUpdating: false, // 标记地图是否正在更新，防止自动移动
				mapInitialized: false, // 标记地图是否已初始化，防止重复移动
				mapKey: 0, // 用于强制重新创建地图组件
				markersLocked: false, // 标记 markers 是否已锁定，锁定后不再更新
				regionChangeTimer: null, // regionchange 事件防抖定时器
				
				// 编辑模式
				editMode: false,
				guideId: ''
			}
		},
		
		methods: {
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
			startEditTransportTitle(dayIndex, locIndex) {
				this.editingTransportTitle = `${dayIndex}-${locIndex}`
			},
			saveTransportTitle(dayIndex, locIndex) {
				this.editingTransportTitle = null
			},
			startEditTransportType(dayIndex, locIndex, type) {
				this.editingTransportType = `${dayIndex}-${locIndex}-${type}`
			},
			saveTransportType(dayIndex, locIndex, type) {
				this.editingTransportType = null
			},
			startEditTransportDetail(dayIndex, locIndex, type) {
				this.editingTransportDetail = `${dayIndex}-${locIndex}-${type}`
			},
			saveTransportDetail(dayIndex, locIndex, type) {
				this.editingTransportDetail = null
			},
			startEditTipsTitle() {
				this.editingTipsTitle = true
			},
			saveTipsTitle() {
				this.editingTipsTitle = false
			},
			startEditTip(tipIndex) {
				this.editingTipIndex = tipIndex
			},
			saveTip(tipIndex) {
				this.editingTipIndex = null
			},
			
			// 天数管理
			toggleDay(dayIndex) {
				this.days[dayIndex].expanded = !this.days[dayIndex].expanded
			},
			addNewDay() {
				const newDay = {
					id: `day${this.days.length + 1}`,
					title: `第${this.days.length + 1}天：行程`,
					expanded: true,
					locations: []
				}
				this.days.push(newDay)
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
				this.days[dayIndex].locations[locIndex].showDetails = 
					!this.days[dayIndex].locations[locIndex].showDetails
			},
			addNewLocation(dayIndex) {
				const newLocation = {
					id: `loc${dayIndex + 1}-${this.days[dayIndex].locations.length + 1}`,
					name: '新地点',
					description: '请输入地点描述',
					time: '1-2小时',
					showDetails: false,
					subwayType: '地铁',
					subwayDetail: '请输入地铁线路',
					taxiType: '出租车',
					taxiDetail: '请输入出租车信息',
					transportTitle: '交通方式',
					coordinates: null
				}
				this.days[dayIndex].locations.push(newLocation)
			},
			showDeleteLocationConfirm(dayIndex, locIndex) {
				this.deleteType = 'location'
				this.deleteLocationDayIndex = dayIndex
				this.deleteLocationIndex = locIndex
				this.deletingLocationId = this.days[dayIndex].locations[locIndex].id
				this.deleteMessage = '您确定要删除这个地点吗？'
				this.showDeleteConfirm = true
			},
			
			// 删除确认
			confirmDelete() {
				if (this.deleteType === 'day') {
					this.days.splice(this.deleteDayIndex, 1)
					// 重新编号天数
					this.days.forEach((day, index) => {
						day.title = day.title.replace(/第\d+天/, `第${index + 1}天`)
					})
				} else if (this.deleteType === 'location') {
					this.days[this.deleteLocationDayIndex].locations.splice(this.deleteLocationIndex, 1)
				}
				this.cancelDelete()
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
			showMapView() {
				// 设置地图标题为攻略标题
				this.mapTitle = this.title || '旅行攻略地图'
				
				// 重置状态
				this.mapInitialized = false // 重置初始化标志
				this.markersLocked = false // 重置标记锁定
				this.isMapUpdating = true // 立即设置为更新中，防止regionchange触发
				// 清空标记，先不显示
				this.mapMarkers = []
				this.mapPolyline = []
				this.mapIncludePoints = []
				
				// 增加key值，强制重新创建地图组件
				this.mapKey++
				this.showMap = true
				
				// 等待地图组件渲染完成后再初始化
				this.$nextTick(() => {
					setTimeout(() => {
						this.initMapMarkers()
					}, 300) // 增加延迟时间，确保地图完全加载
				})
			},
			closeMap() {
				this.showMap = false
				// 清除定时器
				if (this.regionChangeTimer) {
					clearTimeout(this.regionChangeTimer)
					this.regionChangeTimer = null
				}
				// 重置地图更新标志和初始化标志
				this.isMapUpdating = false
				this.mapInitialized = false
				this.markersLocked = false
				this.mapMarkers = []
				this.mapPolyline = []
				this.mapIncludePoints = []
			},
			onMapUpdated() {
				// 地图更新完成事件，可以用来确认地图已加载
				// 现在不再需要创建地图上下文，因为我们直接通过属性绑定控制地图
			},
			initMapMarkers() {
				// 先准备标记数据，但不立即添加到地图
				let allPoints = []
				let markerIdCounter = 0
				const markersToAdd = []
				
				this.days.forEach((day, dayIndex) => {
					day.locations.forEach((location, locIndex) => {
						if (location.coordinates && location.coordinates.lng && location.coordinates.lat) {
							// 验证坐标有效性
							const lng = Number(location.coordinates.lng)
							const lat = Number(location.coordinates.lat)
							
							if (!isNaN(lng) && !isNaN(lat) && 
								Math.abs(lng) <= 180 && Math.abs(lat) <= 90) {
								const marker = {
									id: markerIdCounter++, // 使用数字ID
									longitude: lng,
									latitude: lat,
									title: location.name,
									iconPath: '/static/images/map/marker.png',
									width: 30,
									height: 30,
									callout: {
										content: `${dayIndex + 1}-${location.name}`,
										color: '#ffffff',
										fontSize: 14,
										borderRadius: 4,
										bgColor: this.getDayColor(dayIndex),
										padding: 8,
										display: 'ALWAYS',
										textAlign: 'center'
									}
								}
								markersToAdd.push(marker)
								const point = {
									longitude: lng,
									latitude: lat
								}
								allPoints.push(point)
							}
						}
					})
				})
				
				// 只在第一次初始化时设置地图中心
				if (allPoints.length > 0 && !this.mapInitialized) {
					this.mapInitialized = true
					
					// 计算所有点的中心位置（更准确）
					let centerLng = 0
					let centerLat = 0
					allPoints.forEach(point => {
						centerLng += Number(point.longitude)
						centerLat += Number(point.latitude)
					})
					const targetLng = centerLng / allPoints.length
					const targetLat = centerLat / allPoints.length
					
					// 验证中心点坐标有效性
					if (isNaN(targetLng) || isNaN(targetLat) || 
						Math.abs(targetLng) > 180 || Math.abs(targetLat) > 90) {
						console.error('计算的地图中心点坐标无效')
						return
					}
					
					// 根据标记点数量调整缩放级别
					const targetScale = allPoints.length === 1 ? 16 : (allPoints.length <= 3 ? 14 : 12)
					
					// 直接设置静态中心点（精确到6位小数）
					this.staticMapLongitude = Number(targetLng.toFixed(6))
					this.staticMapLatitude = Number(targetLat.toFixed(6))
					this.staticMapScale = targetScale
					
					// 直接通过绑定属性设置地图中心点，不需要使用 moveToLocation
					// 这样可以避免地图上下文相关的错误，并且定位更准确、更快
					// 设置更新标志，阻止 regionchange 事件
					this.isMapUpdating = true
					
					// 等待地图组件完全初始化后再添加标记和路线
					this.$nextTick(() => {
						setTimeout(() => {
							this.mapMarkers = markersToAdd
							
							// 添加路线连线
							if (allPoints.length > 1) {
								this.mapPolyline = [{
									points: allPoints,
									color: '#1A9E8F',
									width: 4,
									dottedLine: false
								}]
							}
							
							// 锁定 markers，防止后续更新导致地图移动
							this.markersLocked = true
							
							// 延迟重置更新标志，给地图时间稳定
							setTimeout(() => {
								this.isMapUpdating = false
							}, 1000)
						}, 300) // 增加延迟时间，确保地图完全加载
					})
				} else if (this.mapInitialized && this.markersLocked) {
					// 如果已经初始化且 markers 已锁定，不再更新
					// 保持现有标记不变
					return
				} else if (allPoints.length === 0) {
					// 如果没有有效的地点坐标，显示提示
					uni.showToast({
						title: '暂无有效地点坐标',
						icon: 'none',
						duration: 2000
					})
				}
			},
			getDayColor(dayIndex) {
				const colors = ['#165DFF', '#FF7D00', '#10B981', '#8B5CF6', '#EC4899']
				return colors[dayIndex % colors.length]
			},
			async showLocationOnMap(dayIndex, locIndex) {
				const location = this.days[dayIndex].locations[locIndex]
				
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
						// 使用预设坐标
						if (locationCoordinates[location.name]) {
							location.coordinates = {
								lat: locationCoordinates[location.name].lat,
								lng: locationCoordinates[location.name].lng
							}
						} else {
							uni.hideLoading()
							uni.showToast({
								title: '无法获取地点坐标，请检查地点名称',
								icon: 'none',
								duration: 2000
							})
							return
						}
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
				
				// 精确设置坐标（精确到6位小数）
				const targetLng = Number(Number(location.coordinates.lng).toFixed(6))
				const targetLat = Number(Number(location.coordinates.lat).toFixed(6))
				
				// 验证坐标范围
				if (isNaN(targetLng) || isNaN(targetLat) || 
					Math.abs(targetLng) > 180 || Math.abs(targetLat) > 90) {
					uni.showToast({
						title: '地点坐标超出有效范围',
						icon: 'none',
						duration: 2000
					})
					return
				}
				
				// 显示地图并定位
				// 先设置地图标题为攻略标题
				this.mapTitle = this.title || '旅行攻略地图'
				this.mapInitialized = false // 重置初始化标志
				this.markersLocked = false // 重置标记锁定
				this.isMapUpdating = true // 立即设置为更新中
				
				// 先清空标记
				this.mapMarkers = []
				this.mapPolyline = []
				this.mapIncludePoints = []
				
				// 设置静态中心点和缩放级别（在地图显示之前设置）
				this.staticMapLongitude = targetLng
				this.staticMapLatitude = targetLat
				this.staticMapScale = 16
				
				// 增加key值，强制重新创建地图组件
				this.mapKey++
				this.showMap = true
				
				// 准备标记
				const markerToAdd = {
					id: 0, // 使用数字ID
					longitude: targetLng,
					latitude: targetLat,
					title: location.name,
					iconPath: '/static/images/map/marker.png',
					width: 30,
					height: 30,
					callout: {
						content: location.name,
						color: '#ffffff',
						fontSize: 14,
						borderRadius: 4,
						bgColor: this.getDayColor(dayIndex),
						padding: 8,
						display: 'ALWAYS',
						textAlign: 'center'
					}
				}
				
				// 等待地图组件渲染完成后再添加标记
				this.$nextTick(() => {
					// 再次等待，确保地图组件完全初始化
					setTimeout(() => {
						this.mapMarkers = [markerToAdd]
						this.mapPolyline = []
						this.mapInitialized = true
						this.markersLocked = true // 锁定标记
						
						// 延迟重置更新标志，给地图时间稳定
						setTimeout(() => {
							this.isMapUpdating = false
						}, 1000)
					}, 300) // 增加延迟时间，确保地图完全加载
				})
			},
			onMapMarkerTap(e) {
				const markerId = e.detail.markerId
				const marker = this.mapMarkers.find(m => m.id === markerId)
				if (marker) {
					uni.showToast({
						title: marker.title,
						icon: 'none'
					})
				}
			},
			onMapTap(e) {
				// 地图点击事件，用于调试
				// console.log('地图被点击', e)
			},
			onMapRegionChange(e) {
				// 如果地图正在更新中，完全忽略所有事件
				if (this.isMapUpdating) {
					return
				}
				
				// 如果 markers 已锁定，说明地图已经稳定
				if (this.markersLocked) {
					// 检查是否是用户操作
					const causedBy = e.causedBy || ''
					const type = e.type || ''
					
					// 只允许用户的拖动、缩放等操作（end 事件）
					if (type === 'end' && (causedBy === 'drag' || causedBy === 'scale' || causedBy === 'gesture')) {
						// 用户操作，允许但不更新数据
						return
					}
					
					// begin 和 update 事件都忽略（防止自动移动）
					if (type === 'begin' || type === 'update') {
						// 如果是自动触发的变化，立即阻止
						if (causedBy !== 'drag' && causedBy !== 'scale' && causedBy !== 'gesture') {
							return
						}
					}
					
					// 其他情况（自动适配等），忽略这些事件
					// 因为我们已经通过 markersLocked 和静态中心点来固定地图位置
					// 不需要额外的操作，直接忽略即可
					return
				}
				
				// 如果地图已初始化但 markers 未锁定，说明正在添加 markers
				// 此时阻止所有自动变化
				if (this.mapInitialized && !this.markersLocked) {
					const causedBy = e.causedBy || ''
					// 只允许用户操作
					if (causedBy !== 'drag' && causedBy !== 'scale' && causedBy !== 'gesture') {
						return
					}
				}
			},
			
			// 更换背景图
			changeBannerImage() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						this.bannerImage = res.tempFilePaths[0]
					}
				})
			},
			
			// 保存攻略
			saveGuide() {
					const guideData = {
					title: this.title,
					subtitle: this.subtitle,
					bannerImage: this.bannerImage,
					days: this.days,
					tips: this.tips,
					tipsTitle: this.tipsTitle,
						status: 'draft',
					createTime: new Date().toISOString()
				}
				
				if (this.editMode && this.guideId) {
					guideData.id = this.guideId
				}
				
				const success = guideService.saveGuide(guideData)
					if (success) {
						uni.showToast({
						title: '保存成功',
							icon: 'success'
					})
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/index/index'
						})
					}, 1500)
					} else {
						uni.showToast({
							title: '保存失败',
							icon: 'none'
					})
				}
			},
			
			// 加载攻略数据
			loadGuideData() {
				const guide = guideService.getGuideById(this.guideId)
				if (guide) {
					this.title = guide.title || '北京三日游路线'
					this.subtitle = guide.subtitle || '探索首都精华景点，感受历史与现代交融'
					this.bannerImage = guide.bannerImage || '/static/images/background/banner.jpg'
					this.days = guide.days || this.days
					this.tips = guide.tips || this.tips
					this.tipsTitle = guide.tipsTitle || '旅行小贴士'
				}
			}
		},
		
		onLoad(options) {
			if (options.id && options.mode === 'edit') {
				this.editMode = true
				this.guideId = options.id
				this.loadGuideData()
			}
		}
	}
</script>

<style scoped>
	.create-container {
		min-height: 100vh;
		background-color: #f5f7fa;
		padding: 20rpx;
		box-sizing: border-box;
	}
	
	.guide-card {
		background-color: white;
		border-radius: 24rpx;
		overflow: hidden;
		box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.08);
		margin-bottom: 24rpx;
		max-width: 100%;
	}
	
	/* 背景图区域 */
	.banner-section {
		position: relative;
		height: 400rpx;
		min-height: 300rpx;
	}
	
	.map-button-wrapper {
		position: absolute;
		top: 20rpx;
		right: 20rpx;
		z-index: 10;
	}
	
	.map-button {
		background-color: rgba(255, 255, 255, 0.95);
		color: #165DFF;
		font-size: 24rpx;
		font-weight: 500;
		padding: 12rpx 24rpx;
		border-radius: 12rpx;
		border: none;
		display: flex;
		align-items: center;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
		line-height: 1;
	}
	
	.map-button-icon {
		margin-right: 6rpx;
		font-size: 28rpx;
	}
	
	.map-button-text {
		font-size: 24rpx;
	}
	
	.banner-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	
	.banner-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 150rpx;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
	}
	
	.banner-content {
		position: absolute;
		bottom: 0;
		left: 0;
		padding: 30rpx 24rpx;
		width: 100%;
		box-sizing: border-box;
	}
	
	.title-wrapper {
		position: relative;
		margin-bottom: 0;
	}
	
	.guide-title {
		font-size: 48rpx;
		font-weight: bold;
		color: white;
		text-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.4);
		display: block;
		line-height: 1.4;
		word-break: break-word;
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
	
	.editable {
		cursor: pointer;
	}
	
	.editable.editing {
		outline: 2rpx solid #165DFF;
		border-radius: 4rpx;
	}
	
	/* 内容区域 */
	.content-section {
		padding: 30rpx 24rpx;
		box-sizing: border-box;
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
	
	/* 天数区域 */
	.day-section {
		margin-bottom: 30rpx;
		border-bottom: 2rpx solid #e5e5e5;
		padding-bottom: 30rpx;
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
		margin-bottom: 24rpx;
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

	/* 地点卡片 */
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
		font-size: 36rpx;
		font-weight: 600;
		color: #1E293B;
		display: block;
		word-break: break-word;
		line-height: 1.4;
	}
	
	.location-name-input {
		width: 100%;
		background: white;
		padding: 10rpx 12rpx;
		border-radius: 8rpx;
		font-size: 36rpx;
		font-weight: 600;
		box-sizing: border-box;
	}
	
	.location-desc {
		font-size: 26rpx;
		color: #666;
		display: block;
		word-break: break-word;
		line-height: 1.5;
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
		width: 56rpx;
		height: 56rpx;
		min-width: 56rpx;
		border-radius: 50%;
		background-color: #165DFF;
		color: white;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
	}
	
	.location-icon {
		font-size: 28rpx;
	}
	
	/* 地点详情 */
	.location-details {
		margin-top: 20rpx;
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
	
	.transport-title-input {
		width: 100%;
		background: #f9f9f9;
		padding: 10rpx 12rpx;
		border-radius: 8rpx;
		font-size: 28rpx;
		font-weight: 500;
		box-sizing: border-box;
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
	
	/* 旅行小贴士 */
	.tips-section {
		background-color: rgba(22, 93, 255, 0.05);
		padding: 30rpx 24rpx;
		border-top: 2rpx solid #f0f0f0;
		box-sizing: border-box;
	}
	
	.tips-title-wrapper {
		position: relative;
		margin-bottom: 20rpx;
	}
	
	.tips-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #165DFF;
	}
	
	.tips-title-input {
		width: 100%;
		background: white;
		padding: 12rpx 16rpx;
		border-radius: 8rpx;
		font-size: 36rpx;
		font-weight: bold;
		box-sizing: border-box;
	}
	
	.tips-list {
		display: flex;
		flex-direction: column;
		gap: 12rpx;
	}
	
	.tip-item {
		display: flex;
		align-items: flex-start;
	}
	
	.tip-icon {
		margin-right: 12rpx;
		margin-top: 2rpx;
		font-size: 28rpx;
		flex-shrink: 0;
	}
	
	.tip-text-wrapper {
		flex: 1;
		position: relative;
		min-width: 0;
	}
	
	.tip-text {
		font-size: 26rpx;
		color: #333;
		line-height: 1.6;
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
	
	/* 页脚 */
	.footer {
		text-align: center;
		padding: 32rpx 0;
	}
	
	.footer-text {
		font-size: 24rpx;
		color: #999;
	}
	
	/* 全屏地图 */
	.map-container {
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