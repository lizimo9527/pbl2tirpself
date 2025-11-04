<template>
	<view class="template-detail-container">
		<!-- 顶部导航栏 -->
		<view class="detail-header">
			<view class="header-back" @click="goBack">
				<text class="back-icon">←</text>
				<text class="back-text">返回</text>
			</view>
			<view class="header-title">{{templateData ? templateData.title : '攻略模板详情'}}</view>
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
					<image :src="templateData.image" mode="aspectFill" class="banner-image" />
					<view class="banner-overlay"></view>
					<view class="banner-content">
						<text class="guide-title">{{templateData.title}}</text>
						<text class="guide-subtitle">{{templateData.subtitle}}</text>
					</view>
				</view>
				
				<!-- 折叠式菜单区域 -->
				<view class="content-section">
					<view class="day-section" v-for="(day, dayIndex) in templateData.days" :key="dayIndex">
						<view class="day-header" @click="toggleDay('day' + (dayIndex + 1))">
							<view class="day-title">
								<view class="day-number">{{day.day}}</view>
								<text class="day-text">{{day.title}}</text>
							</view>
							<view class="day-icon" :class="{ 'rotate-180': expandedDays['day' + (dayIndex + 1)] }">
								<text>▼</text>
							</view>
						</view>
						
						<view class="day-content" v-if="expandedDays['day' + (dayIndex + 1)]">
							<view class="location-list">
								<view class="location-card" v-for="(location, locIndex) in day.locations" :key="locIndex" @click="toggleLocation('location' + (dayIndex + 1) + '_' + (locIndex + 1))">
									<view class="location-header">
										<view class="location-info">
											<text class="location-name">{{location.name}}</text>
											<text class="location-desc">{{location.desc}}</text>
										</view>
										<view class="location-time">
											<text class="time-icon">⏱️</text>
											<text class="time-text">{{location.time}}</text>
										</view>
									</view>
									<view class="location-details" v-if="expandedLocations['location' + (dayIndex + 1) + '_' + (locIndex + 1)]">
										<view class="transportation-info">
											<text class="transport-title">交通方式</text>
											<view class="transport-grid">
												<view class="transport-item" v-for="(transport, transIndex) in location.transport" :key="transIndex">
													<text class="transport-icon">{{transport.type}}</text>
													<view class="transport-details">
														<text class="transport-type">{{transport.type === '🚇' ? '地铁' : '出租车'}}</text>
														<text class="transport-route">{{transport.route}}</text>
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
				<view class="tips-section" v-if="templateData.tips && templateData.tips.length > 0">
					<text class="tips-title">旅行小贴士</text>
					<view class="tips-list">
						<view class="tip-item" v-for="(tip, tipIndex) in templateData.tips" :key="tipIndex">
							<text class="tip-icon">{{tipIndex === 0 ? 'ℹ️' : tipIndex === 1 ? '📍' : tipIndex === 2 ? '☀️' : '🍽️'}}</text>
							<text class="tip-text">{{tip}}</text>
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				templateId: '',
				templateData: null,
				expandedDays: {},
				expandedLocations: {},
				showMapModal: false,
				mapMarkers: [],
				mapPolyline: []
			}
		},
		onLoad(options) {
			this.templateId = options.id || '';
			this.loadTemplateData();
		},
		methods: {
			loadTemplateData() {
				const templates = {
					'hebei_classic_3days': {
						title: '河北经典3日游',
						subtitle: '承德避暑山庄、秦皇岛北戴河、山海关经典路线',
						image: '/static/images/templates/hebei1.jpg',
						days: [
							{
								day: 1,
								title: '第一天：承德避暑山庄',
								locations: [
									{
										name: '承德避暑山庄',
										desc: '清代皇家园林，世界文化遗产，占地564万平方米，是中国现存最大的古典皇家园林',
										time: '4-6小时',
										transport: [
											{ type: '🚇', route: '高铁至承德南站，转乘公交' },
											{ type: '🚕', route: '出租车约30分钟' }
										],
										details: '避暑山庄始建于1703年，历经康熙、雍正、乾隆三朝，耗时89年建成。山庄由宫殿区、湖泊区、平原区、山峦区四部分组成，融合了南北园林艺术精华。'
									},
									{
										name: '普陀宗乘之庙',
										desc: '仿西藏布达拉宫建造，又称小布达拉宫',
										time: '2-3小时',
										transport: [
											{ type: '🚕', route: '从避暑山庄打车约15分钟' }
										],
										details: '为庆祝乾隆皇帝60寿辰而建，是承德外八庙中规模最大的一座。建筑群依山而建，气势宏伟。'
									}
								]
							},
							{
								day: 2,
								title: '第二天：秦皇岛北戴河',
								locations: [
									{
										name: '北戴河海滨',
										desc: '著名海滨度假胜地，沙质细腻，海水清澈',
										time: '3-4小时',
										transport: [
											{ type: '🚇', route: '高铁至秦皇岛站' },
											{ type: '🚕', route: '出租车约20分钟' }
										],
										details: '北戴河是中国四大避暑胜地之一，海岸线长达22.5公里。这里气候宜人，是观海、游泳、日光浴的理想场所。'
									},
									{
										name: '鸽子窝公园',
										desc: '观日出最佳地点，毛泽东曾在此写下《浪淘沙·北戴河》',
										time: '1-2小时',
										transport: [
											{ type: '🚕', route: '从北戴河海滨打车约10分钟' }
										],
										details: '公园内有一块形似雄鹰的巨石，是观赏海上日出的绝佳位置。每年春秋季节，这里还是候鸟迁徙的重要驿站。'
									}
								]
							},
							{
								day: 3,
								title: '第三天：山海关长城',
								locations: [
									{
										name: '山海关',
										desc: '天下第一关，明代长城起点，军事要塞',
										time: '3-5小时',
										transport: [
											{ type: '🚇', route: '高铁至山海关站' },
											{ type: '🚕', route: '步行可达' }
										],
										details: '山海关是明长城的东北关隘之一，素有"天下第一关"之称。关城周长约4公里，与长城相连，是古代重要的军事防御体系。'
									},
									{
										name: '老龙头',
										desc: '长城入海处，唯一的海上长城',
										time: '2-3小时',
										transport: [
											{ type: '🚕', route: '从山海关打车约15分钟' }
										],
										details: '老龙头是明长城的东部起点，长城从这里入海，犹如龙头探入大海，因此得名。这里可以欣赏到长城与大海交汇的壮观景象。'
									}
								]
							}
						],
						tips: [
							'提前预订高铁票，节假日车票紧张，建议提前1-2周购票',
							'夏季注意防晒，海边紫外线较强，建议携带防晒霜和遮阳帽',
							'品尝当地特色：承德烤全羊、秦皇岛海鲜、山海关浑锅',
							'承德避暑山庄面积较大，建议穿舒适的运动鞋',
							'北戴河海滨早晚温差较大，建议携带薄外套'
						],
						mapMarkers: [
							{longitude: 117.9398, latitude: 40.9762, title: '承德避暑山庄'},
							{longitude: 117.9500, latitude: 40.9800, title: '普陀宗乘之庙'},
							{longitude: 119.6005, latitude: 39.9354, title: '北戴河海滨'},
							{longitude: 119.6100, latitude: 39.9400, title: '鸽子窝公园'},
							{longitude: 119.7750, latitude: 40.0086, title: '山海关'},
							{longitude: 119.7850, latitude: 40.0150, title: '老龙头'}
						],
						mapPolyline: [
							{
								points: [
									{longitude: 117.9398, latitude: 40.9762},
									{longitude: 117.9500, latitude: 40.9800},
									{longitude: 119.6005, latitude: 39.9354},
									{longitude: 119.6100, latitude: 39.9400},
									{longitude: 119.7750, latitude: 40.0086},
									{longitude: 119.7850, latitude: 40.0150}
								],
								color: '#165DFF',
								width: 6,
								dottedLine: false
							}
						]
					},
					'hebei_cultural_5days': {
						title: '河北文化深度5日游',
						subtitle: '保定直隶总督署、正定古城、赵州桥文化之旅',
						image: '/static/images/templates/baoding.jpg',
						days: [
							{
								day: 1,
								title: '第一天：保定直隶总督署',
								locations: [
									{
										name: '直隶总督署',
										desc: '清代直隶省最高行政机构，中国现存最完整的清代省级衙署',
										time: '2-3小时',
										transport: [
											{ type: '🚇', route: '高铁至保定东站' },
											{ type: '🚕', route: '出租车约15分钟' }
										],
										details: '直隶总督署始建于明洪武年间，是清代直隶省的最高行政机构。衙署建筑群保存完好，是研究清代官署建筑和行政制度的重要实物资料。'
									},
									{
										name: '古莲花池',
										desc: '北方古代园林明珠，有"城市蓬莱"之称',
										time: '1-2小时',
										transport: [
											{ type: '🚕', route: '从总督署步行约10分钟' }
										],
										details: '古莲花池始建于元朝，是保定著名的古典园林。园内亭台楼阁错落有致，池水清澈，荷花盛开时景色尤为迷人。'
									}
								]
							},
							{
								day: 2,
								title: '第二天：正定古城',
								locations: [
									{
										name: '正定古城',
										desc: '历史文化名城，拥有隆兴寺、临济寺等古建筑群',
										time: '4-5小时',
										transport: [
											{ type: '🚇', route: '高铁至正定机场站' },
											{ type: '🚕', route: '出租车约25分钟' }
										],
										details: '正定古城历史悠久，城内保存有隆兴寺、临济寺、开元寺等多处国家级文物保护单位。隆兴寺内的千手观音像高达21.3米，是中国现存最高的古代铜铸佛像。'
									},
									{
										name: '荣国府',
										desc: '仿古建筑群，电视剧《红楼梦》拍摄地',
										time: '2-3小时',
										transport: [
											{ type: '🚕', route: '从古城中心打车约10分钟' }
										],
										details: '荣国府是为拍摄电视剧《红楼梦》而建的仿古建筑群，再现了清代贵族府邸的宏伟气势。园内建筑精美，是了解清代建筑艺术的好去处。'
									}
								]
							},
							{
								day: 3,
								title: '第三天：赵州桥',
								locations: [
									{
										name: '赵州桥',
										desc: '世界上最古老的石拱桥，隋代建筑杰作',
										time: '2-3小时',
										transport: [
											{ type: '🚇', route: '高铁至石家庄站' },
											{ type: '🚕', route: '出租车约40分钟' }
										],
										details: '赵州桥建于隋朝，距今已有1400多年历史，是世界上现存最早、保存最完整的古代敞肩石拱桥。桥的设计科学合理，体现了古代工匠的高超技艺。'
									},
									{
										name: '柏林禅寺',
										desc: '北方著名佛教寺院，禅宗祖庭之一',
										time: '1-2小时',
										transport: [
											{ type: '🚕', route: '从赵州桥打车约15分钟' }
										],
										details: '柏林禅寺始建于东汉，是中国北方著名的佛教寺院。寺内古柏参天，环境清幽，是禅宗的重要道场之一。'
									}
								]
							}
						],
						tips: [
							'建议聘请专业导游讲解历史文化背景，深度了解景点内涵',
							'古城内步行较多，建议穿舒适的运动鞋，携带饮用水',
							'品尝当地特色美食：保定驴肉火烧、正定烧饼、赵县雪花梨',
							'春秋季节是最佳游览时间，气候宜人，景色优美',
							'注意文物保护，不要在古迹上涂鸦或刻字'
						],
						mapMarkers: [
							{longitude: 115.4907, latitude: 38.8730, title: '直隶总督署'},
							{longitude: 115.5000, latitude: 38.8800, title: '古莲花池'},
							{longitude: 114.5700, latitude: 38.1470, title: '正定古城'},
							{longitude: 114.5800, latitude: 38.1500, title: '荣国府'},
							{longitude: 114.6900, latitude: 37.7600, title: '赵州桥'},
							{longitude: 114.7000, latitude: 37.7700, title: '柏林禅寺'}
						],
						mapPolyline: [
							{
								points: [
									{longitude: 115.4907, latitude: 38.8730},
									{longitude: 115.5000, latitude: 38.8800},
									{longitude: 114.5700, latitude: 38.1470},
									{longitude: 114.5800, latitude: 38.1500},
									{longitude: 114.6900, latitude: 37.7600},
									{longitude: 114.7000, latitude: 37.7700}
								],
								color: '#FF7D00',
								width: 6,
								dottedLine: false
							}
						]
					},
					'hebei_natural_4days': {
						title: '河北自然风光4日游',
						subtitle: '野三坡、白石山、苍岩山自然风光探索',
						image: '/static/images/templates/baishishan.jpg',
						days: [
							{
								day: 1,
								title: '第一天：野三坡',
								locations: [
									{
										name: '野三坡景区',
										desc: '国家级风景名胜区，百里峡、鱼谷洞等景点组成',
										time: '5-6小时',
										transport: [
											{ type: '🚇', route: '高铁至涞水站' },
											{ type: '🚕', route: '景区专线车' }
										],
										details: '野三坡景区由百里峡、鱼谷洞、龙门天关等多个景点组成，以雄、险、奇、幽的自然景观著称。百里峡是景区的精华，峡谷内溪流潺潺，植被茂密。'
									},
									{
										name: '鱼谷洞',
										desc: '天然溶洞，洞内有地下河和钟乳石景观',
										time: '2-3小时',
										transport: [
											{ type: '🚕', route: '从百里峡景区内乘车' }
										],
										details: '鱼谷洞是一处天然溶洞，洞内钟乳石、石笋、石幔等喀斯特地貌发育完整。洞内有地下河，水质清澈，可以乘船游览。'
									}
								]
							},
							{
								day: 2,
								title: '第二天：白石山',
								locations: [
									{
										name: '白石山国家地质公园',
										desc: '以白色大理石峰林闻名，有"北方黄山"之称',
										time: '4-5小时',
										transport: [
											{ type: '🚇', route: '高铁至涞源站' },
											{ type: '🚕', route: '景区班车' }
										],
										details: '白石山因山体多为白色大理石而得名，主峰海拔2096米。景区内峰林奇特，云海壮观，有"北方黄山"的美誉。玻璃栈道是景区的特色体验项目。'
									},
									{
										name: '十瀑峡',
										desc: '瀑布群景观，夏季水量充沛时最为壮观',
										time: '2-3小时',
										transport: [
											{ type: '🚕', route: '从白石山景区内步行' }
										],
										details: '十瀑峡是白石山景区的重要组成部分，峡谷内分布着大小不一的瀑布群。夏季雨季时，瀑布水量充沛，水声轰鸣，景色十分壮观。'
									}
								]
							},
							{
								day: 3,
								title: '第三天：苍岩山',
								locations: [
									{
										name: '苍岩山风景区',
										desc: '佛教圣地，以悬空寺和桥楼殿闻名',
										time: '3-4小时',
										transport: [
											{ type: '🚇', route: '高铁至井陉站' },
											{ type: '🚕', route: '出租车约30分钟' }
										],
										details: '苍岩山是华北地区重要的佛教圣地，以悬空寺和桥楼殿最为著名。桥楼殿建在两座悬崖之间，是中国三大悬空寺之一，建筑工艺精湛。'
									},
									{
										name: '福庆寺',
										desc: '苍岩山主寺，隋代皇家寺院',
										time: '1-2小时',
										transport: [
											{ type: '🚕', route: '从苍岩山景区内步行' }
										],
										details: '福庆寺是苍岩山的主寺，始建于隋代，曾是皇家寺院。寺内保存有历代碑刻和佛教文物，是研究佛教历史的重要场所。'
									}
								]
							}
						],
						tips: [
							'山区天气多变，建议携带雨具和保暖衣物',
							'登山注意安全，穿防滑登山鞋，携带登山杖',
							'景区内餐饮较少，建议自备干粮和充足饮用水',
							'最佳游览季节为春秋两季，夏季注意防暑，冬季注意防寒',
							'拍照时注意安全，不要在危险地段停留过久'
						],
						mapMarkers: [
							{longitude: 115.3200, latitude: 39.7000, title: '野三坡'},
							{longitude: 115.3300, latitude: 39.7100, title: '鱼谷洞'},
							{longitude: 114.6900, latitude: 39.2000, title: '白石山'},
							{longitude: 114.7000, latitude: 39.2100, title: '十瀑峡'},
							{longitude: 114.1300, latitude: 38.0300, title: '苍岩山'},
							{longitude: 114.1400, latitude: 38.0400, title: '福庆寺'}
						],
						mapPolyline: [
							{
								points: [
									{longitude: 115.3200, latitude: 39.7000},
									{longitude: 115.3300, latitude: 39.7100},
									{longitude: 114.6900, latitude: 39.2000},
									{longitude: 114.7000, latitude: 39.2100},
									{longitude: 114.1300, latitude: 38.0300},
									{longitude: 114.1400, latitude: 38.0400}
								],
								color: '#00B42A',
								width: 6,
								dottedLine: false
							}
						]
					},
					'hebei_greatwall_2days': {
						title: '河北长城精华2日游',
						subtitle: '金山岭长城、喜峰口长城长城文化体验',
						image: '/static/images/templates/qinhuangdao.jpg',
						days: [
							{
								day: 1,
								title: '第一天：金山岭长城',
								locations: [
									{
										name: '金山岭长城',
										desc: '明代长城精华段，保存最完好，摄影胜地',
										time: '4-5小时',
										transport: [
											{ type: '🚇', route: '高铁至密云站' },
											{ type: '🚕', route: '景区专车' }
										],
										details: '金山岭长城是明长城中最具代表性的一段，全长10.5公里，敌楼密集，建筑精美。这里的长城保存完好，没有经过大规模修复，保持了历史的原貌。'
									},
									{
										name: '司马台长城',
										desc: '以险峻著称，有"长城之最"美誉',
										time: '2-3小时',
										transport: [
											{ type: '🚕', route: '从金山岭长城景区内步行' }
										],
										details: '司马台长城以险峻著称，城墙依山势而建，最陡处达70度。这里的长城保留了明代的原貌，是摄影爱好者和登山爱好者的天堂。'
									}
								]
							},
							{
								day: 2,
								title: '第二天：喜峰口长城',
								locations: [
									{
										name: '喜峰口长城',
										desc: '长城抗战重要战场，历史意义重大',
										time: '3-4小时',
										transport: [
											{ type: '🚇', route: '高铁至迁西站' },
											{ type: '🚕', route: '出租车约40分钟' }
										],
										details: '喜峰口长城是抗日战争时期的重要战场，1933年这里发生了著名的喜峰口战役。长城沿线保留有抗战时期的工事和纪念碑，具有重要的历史教育意义。'
									},
									{
										name: '潘家口水库',
										desc: '水下长城奇观，长城入水处',
										time: '2-3小时',
										transport: [
											{ type: '🚕', route: '从喜峰口长城打车约20分钟' }
										],
										details: '潘家口水库建成后，部分长城被淹没在水中，形成了独特的水下长城景观。在枯水期，部分长城会露出水面，是摄影的绝佳时机。'
									}
								]
							}
						],
						tips: [
							'长城徒步较累，建议带足饮用水和高能量食物',
							'注意防晒，长城上紫外线强，建议戴帽子和太阳镜',
							'穿防滑运动鞋，避免高跟鞋，长城台阶较陡',
							'春秋季节是最佳游览时间，夏季注意防暑，冬季注意防寒',
							'拍照时注意安全，不要在危险地段停留过久'
						],
						mapMarkers: [
							{longitude: 117.2400, latitude: 40.6500, title: '金山岭长城'},
							{longitude: 117.2500, latitude: 40.6600, title: '司马台长城'},
							{longitude: 118.2000, latitude: 40.4000, title: '喜峰口长城'},
							{longitude: 118.2100, latitude: 40.4100, title: '潘家口水库'}
						],
						mapPolyline: [
							{
								points: [
									{longitude: 117.2400, latitude: 40.6500},
									{longitude: 117.2500, latitude: 40.6600},
									{longitude: 118.2000, latitude: 40.4000},
									{longitude: 118.2100, latitude: 40.4100}
								],
								color: '#F53F3F',
								width: 6,
								dottedLine: false
							}
						]
					}
				};

				this.templateData = templates[this.templateId] || templates['hebei_classic_3days'];
				
				// 初始化展开状态
				this.expandedDays = {};
				this.expandedLocations = {};
				
				if (this.templateData.days) {
					this.templateData.days.forEach((day, index) => {
						this.expandedDays[`day${index + 1}`] = index === 0; // 默认展开第一天
						
						if (day.locations) {
							day.locations.forEach((location, locIndex) => {
								this.expandedLocations[`location${index + 1}_${locIndex + 1}`] = false;
							});
						}
					});
				}
				
				// 设置地图标记和连线
				if (this.templateData.mapMarkers) {
					this.mapMarkers = this.templateData.mapMarkers.map((marker, index) => ({
						id: index + 1,
						longitude: marker.longitude,
						latitude: marker.latitude,
						title: marker.title,
						iconPath: '/static/map-marker.png',
						width: 30,
						height: 30
					}));
				}
				
				// 设置地图连线
				if (this.templateData.mapPolyline) {
					this.mapPolyline = this.templateData.mapPolyline;
				}
			},
			goBack() {
				uni.navigateBack()
			},
			toggleDay(day) {
				this.expandedDays[day] = !this.expandedDays[day]
			},
			toggleLocation(location) {
				this.expandedLocations[location] = !this.expandedLocations[location]
			},
			showMap() {
				this.showMapModal = true
			},
			closeMap() {
				this.showMapModal = false
			}
		}
	}
</script>

<style>
	.template-detail-container {
		min-height: 100vh;
		background: #f8fafc;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
	}

	.detail-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 30rpx 20rpx;
		background: linear-gradient(135deg, #165DFF 0%, #0E4BCC 100%);
		color: white;
		box-shadow: 0 4rpx 20rpx rgba(22, 93, 255, 0.3);
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

	.guide-title {
		font-size: 48rpx;
		font-weight: bold;
		color: white;
		display: block;
		margin-bottom: 10rpx;
		text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
	}

	.guide-subtitle {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.9);
		display: block;
		text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
	}

	.content-section {
		padding: 40rpx;
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

	.day-title {
		display: flex;
		align-items: center;
		gap: 20rpx;
	}

	.day-number {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		background: #165DFF;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		font-weight: bold;
	}

	.day-text {
		font-size: 32rpx;
		font-weight: bold;
		color: #165DFF;
	}

	.day-icon {
		font-size: 24rpx;
		color: #165DFF;
		transition: transform 0.3s ease;
	}

	.day-icon.rotate-180 {
		transform: rotate(180deg);
	}

	.day-content {
		margin-top: 20rpx;
	}

	.location-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.location-card {
		background: #f8fafc;
		border-radius: 16rpx;
		padding: 30rpx;
		cursor: pointer;
		transition: all 0.3s ease;
		border: 2rpx solid transparent;
	}

	.location-card:active {
		transform: translateY(1rpx);
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		border-color: #165DFF;
	}

	.location-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 20rpx;
	}

	.location-info {
		flex: 1;
		margin-right: 20rpx;
	}

	.location-name {
		font-size: 32rpx;
		font-weight: 600;
		color: #1E293B;
		display: block;
		margin-bottom: 8rpx;
	}

	.location-desc {
		font-size: 26rpx;
		color: #64748B;
		display: block;
		line-height: 1.4;
	}

	.location-time {
		display: flex;
		align-items: center;
		gap: 8rpx;
		background: rgba(255, 125, 0, 0.1);
		padding: 8rpx 16rpx;
		border-radius: 20rpx;
		color: #FF7D00;
		font-size: 24rpx;
		font-weight: 500;
	}

	.time-icon {
		font-size: 22rpx;
	}

	.location-details {
		margin-top: 20rpx;
		padding-top: 20rpx;
		border-top: 1rpx solid #e2e8f0;
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

	.details-text {
		font-size: 26rpx;
		color: #475569;
		line-height: 1.6;
		display: block;
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

	.details-text {
		font-size: 26rpx;
		color: #475569;
		line-height: 1.6;
		display: block;
	}

	.transportation-info {
		background: white;
		border-radius: 12rpx;
		padding: 24rpx;
		border: 1rpx solid #e2e8f0;
	}

	.transport-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #1E293B;
		display: block;
		margin-bottom: 16rpx;
	}

	.transport-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16rpx;
	}

	.transport-item {
		display: flex;
		align-items: center;
		gap: 12rpx;
		padding: 16rpx;
		border: 1rpx solid #e2e8f0;
		border-radius: 8rpx;
		background: #f8fafc;
	}

	.transport-icon {
		font-size: 32rpx;
	}

	.transport-details {
		display: flex;
		flex-direction: column;
		gap: 4rpx;
	}

	.transport-type {
		font-size: 26rpx;
		font-weight: 500;
		color: #1E293B;
	}

	.transport-route {
		font-size: 22rpx;
		color: #64748B;
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

	.tip-text {
		font-size: 26rpx;
		color: #475569;
		line-height: 1.5;
		flex: 1;
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
</style>