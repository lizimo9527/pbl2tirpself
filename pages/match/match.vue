<template>
	<view class="match-container">
		<!-- 匹配头部 -->
		<view class="match-header">
			<view class="header-content">
				<text class="page-title">匹配搭子</text>
				<text class="page-subtitle">找到志同道合的旅行伙伴</text>
			</view>
		</view>
		
		<!-- 筛选条件 -->
		<view class="filter-section">
			<view class="filter-container">
				<picker class="filter-picker" mode="selector" :range="destinationOptions" :value="destinationIndex" @change="onDestinationChange">
					<view class="filter-item">
						<text class="filter-label">目的地</text>
						<text class="filter-value">{{destinationOptions[destinationIndex]}}</text>
					</view>
				</picker>
				<picker class="filter-picker" mode="selector" :range="dateOptions" :value="dateIndex" @change="onDateChange">
					<view class="filter-item">
						<text class="filter-label">出行时间</text>
						<text class="filter-value">{{dateOptions[dateIndex]}}</text>
					</view>
				</picker>
				<button class="search-btn" @click="searchPartners">搜索</button>
			</view>
		</view>
		
		<!-- 内容区域 -->
		<view class="main-content">
			<!-- 推荐搭子 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">推荐搭子</text>
				</view>
				<view class="partners-list">
					<view class="partner-item" v-for="partner in recommendedPartners" :key="partner.id" @click="viewPartnerDetail(partner.id)">
						<view class="partner-header">
							<image class="partner-avatar" :src="partner.avatar" mode="aspectFill"></image>
							<view class="partner-info">
								<text class="partner-name">{{partner.name}}</text>
								<text class="partner-tags">{{partner.tags.join(' · ')}}</text>
							</view>
							<view class="match-rate">
								<text class="rate-text">{{partner.matchRate}}%</text>
								<text class="rate-label">匹配度</text>
							</view>
						</view>
						<view class="partner-details">
							<text class="destination">目的地: {{partner.destination}}</text>
							<text class="travel-date">出行时间: {{partner.travelDate}}</text>
							<text class="travel-style">旅行风格: {{partner.travelStyle}}</text>
						</view>
						<view class="partner-actions">
							<button class="contact-btn" @click="contactPartner(partner.id)">联系</button>
							<button class="like-btn" @click="likePartner(partner.id)">喜欢</button>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 我的匹配 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">我的匹配</text>
					<text class="view-all" @click="viewAllMatches">查看全部</text>
				</view>
				<view class="my-matches">
					<view class="match-item" v-for="match in myMatches" :key="match.id" @click="viewMatchDetail(match.id)">
						<image class="match-avatar" :src="match.avatar" mode="aspectFill"></image>
						<view class="match-info">
							<text class="match-name">{{match.name}}</text>
							<text class="match-status">{{match.status}}</text>
						</view>
						<text class="match-time">{{match.lastContact}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 创建匹配 -->
		<view class="create-match-fab" @click="createMatch">
			<text class="fab-icon">+</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				destinationOptions: ['全部目的地', '国内游', '出境游', '东南亚', '欧洲', '北美'],
				destinationIndex: 0,
				dateOptions: ['全部时间', '近期出行', '本月', '下个月', '半年内'],
				dateIndex: 0,
				recommendedPartners: [
					{
						id: 1,
						avatar: '/static/images/default-avatar.png',
						name: '旅行达人小王',
						tags: ['摄影', '美食', '文化'],
						matchRate: 85,
						destination: '云南大理',
						travelDate: '2024-12-15',
						travelStyle: '深度游'
					},
					{
						id: 2,
						avatar: '/static/images/default-avatar.png',
						name: '背包客小李',
						tags: ['徒步', '露营', '探险'],
						matchRate: 92,
						destination: '川西环线',
						travelDate: '2024-11-20',
						travelStyle: '自驾游'
					},
					{
						id: 3,
						avatar: '/static/images/default-avatar.png',
						name: '美食爱好者小张',
						tags: ['美食探店', '城市漫步', '休闲'],
						matchRate: 78,
						destination: '成都重庆',
						travelDate: '2024-12-01',
						travelStyle: '美食之旅'
					}
				],
				myMatches: [
					{
						id: 1,
						avatar: '/static/images/default-avatar.png',
						name: '摄影达人',
						status: '已匹配',
						lastContact: '2小时前'
					},
					{
						id: 2,
						avatar: '/static/images/default-avatar.png',
						name: '自驾游伙伴',
						status: '等待回复',
						lastContact: '1天前'
					}
				]
			}
		},
		methods: {
			onDestinationChange(e) {
				this.destinationIndex = e.detail.value;
			},
			onDateChange(e) {
				this.dateIndex = e.detail.value;
			},
			searchPartners() {
				uni.showLoading({
					title: '搜索中...'
				});

				setTimeout(() => {
					uni.hideLoading();
					uni.showToast({
						title: '搜索完成',
						icon: 'success'
					});
				}, 1500);
			},
			viewPartnerDetail(partnerId) {
				uni.showToast({
					title: `查看搭子详情: ${partnerId}`,
					icon: 'none'
				});
			},
			contactPartner(partnerId) {
				uni.showModal({
					title: '联系搭子',
					content: '确定要联系这位搭子吗？',
					success: (res) => {
						if (res.confirm) {
							uni.showToast({
								title: '联系请求已发送',
								icon: 'success'
							});
						}
					}
				});
			},
			likePartner(partnerId) {
				uni.showToast({
					title: '已添加到喜欢列表',
					icon: 'success'
				});
			},
			viewAllMatches() {
				uni.showToast({
					title: '查看全部匹配',
					icon: 'none'
				});
			},
			viewMatchDetail(matchId) {
				uni.showToast({
					title: `查看匹配详情: ${matchId}`,
					icon: 'none'
				});
			},
			createMatch() {
				uni.showModal({
					title: '创建匹配',
					content: '确定要创建新的匹配请求吗？',
					success: (res) => {
						if (res.confirm) {
							uni.showToast({
								title: '匹配请求已创建',
								icon: 'success'
							});
						}
					}
				});
			}
		},
		onShow() {
			console.log('匹配搭子页面显示');
		}
	}
</script>

<style>
	.match-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
	}
	
	.match-header {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 60rpx 30rpx 40rpx;
		color: white;
	}
	
	.header-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}
	
	.page-title {
		font-size: 48rpx;
		font-weight: bold;
		margin-bottom: 15rpx;
	}
	
	.page-subtitle {
		font-size: 28rpx;
		opacity: 0.9;
	}
	
	.filter-section {
		padding: 30rpx;
		background-color: #f8f9fa;
		border-bottom: 2rpx solid #e9ecef;
	}
	
	.filter-container {
		display: flex;
		align-items: center;
		gap: 15rpx;
	}
	
	.filter-picker {
		flex: 1;
	}
	
	.filter-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 25rpx;
		background-color: white;
		border: 2rpx solid #e5e5e5;
		border-radius: 10rpx;
	}
	
	.filter-label {
		font-size: 26rpx;
		color: #666666;
	}
	
	.filter-value {
		font-size: 26rpx;
		color: #333333;
		font-weight: bold;
	}
	
	.search-btn {
		height: 80rpx;
		padding: 0 30rpx;
		background-color: #1A9E8F;
		color: white;
		border-radius: 10rpx;
		font-size: 28rpx;
		font-weight: bold;
		border: none;
	}
	
	.main-content {
		flex: 1;
		padding: 30rpx;
	}
	
	.section {
		margin-bottom: 50rpx;
	}
	
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 25rpx;
	}
	
	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
	}
	
	.view-all {
		font-size: 24rpx;
		color: #1A9E8F;
	}
	
	.partners-list {
		display: flex;
		flex-direction: column;
		gap: 25rpx;
	}
	
	.partner-item {
		padding: 30rpx;
		background-color: #f8f9fa;
		border-radius: 15rpx;
		border: 2rpx solid #e9ecef;
	}
	
	.partner-header {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.partner-avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}
	
	.partner-info {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	
	.partner-name {
		font-size: 28rpx;
		font-weight: bold;
		color: #333333;
		margin-bottom: 8rpx;
	}
	
	.partner-tags {
		font-size: 22rpx;
		color: #666666;
	}
	
	.match-rate {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.rate-text {
		font-size: 24rpx;
		font-weight: bold;
		color: #1A9E8F;
	}
	
	.rate-label {
		font-size: 20rpx;
		color: #666666;
	}
	
	.partner-details {
		display: flex;
		flex-direction: column;
		gap: 10rpx;
		margin-bottom: 20rpx;
	}
	
	.destination, .travel-date, .travel-style {
		font-size: 24rpx;
		color: #666666;
	}
	
	.partner-actions {
		display: flex;
		gap: 15rpx;
	}
	
	.contact-btn, .like-btn {
		flex: 1;
		height: 60rpx;
		border-radius: 10rpx;
		font-size: 26rpx;
		font-weight: bold;
	}
	
	.contact-btn {
		background-color: #1A9E8F;
		color: white;
		border: none;
	}
	
	.like-btn {
		background-color: #f8f9fa;
		color: #666666;
		border: 2rpx solid #e5e5e5;
	}
	
	.my-matches {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}
	
	.match-item {
		display: flex;
		align-items: center;
		padding: 25rpx;
		background-color: #f8f9fa;
		border-radius: 15rpx;
		border: 2rpx solid #e9ecef;
	}
	
	.match-avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}
	
	.match-info {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	
	.match-name {
		font-size: 26rpx;
		font-weight: bold;
		color: #333333;
		margin-bottom: 5rpx;
	}
	
	.match-status {
		font-size: 22rpx;
		color: #666666;
	}
	
	.match-time {
		font-size: 22rpx;
		color: #999999;
	}
	
	.create-match-fab {
		position: fixed;
		right: 40rpx;
		bottom: 40rpx;
		width: 100rpx;
		height: 100rpx;
		background-color: #1A9E8F;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4rpx 20rpx rgba(26, 158, 143, 0.3);
	}
	
	.fab-icon {
		font-size: 40rpx;
		color: white;
		font-weight: bold;
	}
</style>