<template>
	<view class="ai-chat-container">
		<!-- 返回按钮 -->
		<button class="back-button" @click="goBack">
			<text class="back-icon">←</text>
		</button>
		
		<!-- 顶部标题区域 -->
		<view class="app-header">
			<text class="main-title">AI旅行助手</text>
			<text class="sub-title">智能定制您的专属旅行路线</text>
		</view>

		<!-- 聊天内容区域 -->
		<view class="chat-content">
			<scroll-view class="message-list" scroll-y :scroll-top="scrollTop">
				<!-- AI欢迎消息 -->
				<view class="message-item ai-message">
					<view class="message-avatar">
						<text class="avatar-icon">🤖</text>
					</view>
					<view class="message-content">
						<text class="message-text">您好！我是您的AI旅行助手，请告诉我您的旅行需求：</text>
						<view class="suggestion-list">
							<text class="suggestion-item">• 想去哪里旅游？</text>
							<text class="suggestion-item">• 旅行时长是多少天？</text>
							<text class="suggestion-item">• 预算范围是多少？</text>
							<text class="suggestion-item">• 喜欢什么类型的景点？</text>
						</view>
					</view>
				</view>

				<!-- 消息列表 -->
				<view 
					v-for="(message, index) in messages" 
					:key="index" 
					:class="['message-item', message.type === 'user' ? 'user-message' : 'ai-message']"
				>
					<view class="message-avatar">
						<text class="avatar-icon">{{ message.type === 'user' ? '👤' : '🤖' }}</text>
					</view>
					<view class="message-content">
						<text class="message-text">{{ message.content }}</text>
						<text class="message-time">{{ message.time }}</text>
					</view>
				</view>

				<!-- AI思考状态 -->
				<view v-if="isAIThinking" class="message-item ai-message">
					<view class="message-avatar">
						<text class="avatar-icon">🤖</text>
					</view>
					<view class="message-content">
						<view class="thinking-indicator">
							<text class="thinking-dot">.</text>
							<text class="thinking-dot">.</text>
							<text class="thinking-dot">.</text>
						</view>
						<text class="thinking-text">AI正在为您规划路线</text>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 输入区域 -->
		<view class="input-section">
			<view class="input-container">
				<textarea 
					class="message-input" 
					v-model="inputMessage" 
					placeholder="请描述您的旅行想法..."
					maxlength="300"
					:disabled="isAIThinking"
					@confirm="sendMessage"
				></textarea>
				<button class="send-btn" @click="sendMessage" :disabled="!inputMessage.trim() || isAIThinking">
					<text class="send-icon">发送</text>
				</button>
			</view>

			<!-- 快捷输入提示 -->
			<view class="quick-tips">
				<text class="tips-title">试试这样说：</text>
				<view class="tips-list">
					<text class="tip-item" @click="fillExample('我想去云南大理丽江玩5天，预算8000元')">云南大理丽江5日游</text>
					<text class="tip-item" @click="fillExample('带家人去北京旅游，有老人小孩，行程要轻松')">北京家庭轻松游</text>
					<text class="tip-item" @click="fillExample('周末去杭州西湖周边，喜欢自然风光和美食')">杭州周末休闲游</text>
				</view>
			</view>
		</view>

		<!-- 生成攻略按钮 -->
		<view class="generate-section" v-if="showGenerateButton">
			<button class="generate-btn" @click="generateGuide">
				<text class="generate-icon">✨</text>
				<text class="generate-text">一键生成旅游攻略</text>
			</button>
		</view>
	</view>
</template>

<script>
	import difyChatService from '@/services/difyChatService.js';

	export default {
		data() {
			return {
				messages: [],
				inputMessage: '',
				isAIThinking: false,
				scrollTop: 0,
				showGenerateButton: false,
				aiResponse: '',
				destinationData: null, // 存储目的地和地图标记数据
				aiPlanData: null // 存储完整的AI生成的攻略数据
			}
		},
		methods: {
			// 发送消息
			async sendMessage() {
				if (!this.inputMessage.trim() || this.isAIThinking) return;

				// 添加用户消息
				const userMessage = {
					type: 'user',
					content: this.inputMessage.trim(),
					time: this.getCurrentTime()
				};
				this.messages.push(userMessage);
				
				// 清空输入框
				const message = this.inputMessage;
				this.inputMessage = '';

				// 显示AI思考状态
				this.isAIThinking = true;
				
				// 滚动到底部
				this.$nextTick(() => {
					this.scrollToBottom();
				});

				// 调用Dify聊天服务生成AI回复
				await this.generateAIResponse(message);
			},

			// 生成AI回复
			async generateAIResponse(userMessage) {
				try {
					// 调用Dify聊天服务生成智能回复
					const aiResult = await difyChatService.sendMessage(userMessage);
					
					if (aiResult.success) {
						// 创建AI回复消息
						const response = {
							type: 'ai',
							content: aiResult.content,
							time: this.getCurrentTime()
						};

						// 保存AI回复内容
						this.aiResponse = aiResult.content;
						
						// 如果有旅行信息，设置目的地数据
						if (aiResult.travelInfo && aiResult.travelInfo.destination) {
							this.destinationData = difyChatService.generateMapData(aiResult.travelInfo.destination);
						} else {
							// 尝试从用户消息中提取目的地
							const userInput = difyChatService.parseUserInput(userMessage);
							if (userInput.destination) {
								this.destinationData = difyChatService.generateMapData(userInput.destination);
							}
						}
						
						// 添加AI回复到消息列表
						this.messages.push(response);
						this.isAIThinking = false;
						this.showGenerateButton = true;
						
						// 滚动到底部
						this.$nextTick(() => {
							this.scrollToBottom();
						});
					} else {
						// 如果Dify服务失败，使用备用回复
						this.useFallbackResponse(userMessage);
					}
				} catch (error) {
					console.error('AI回复生成失败:', error);
					// 使用备用回复
					this.useFallbackResponse(userMessage);
				}
			},
			
			// 备用回复方案
			useFallbackResponse(userMessage) {
				let response = {
					type: 'ai',
					content: '',
					time: this.getCurrentTime()
				};

				// 智能关键词匹配回复
				if (userMessage.includes('云南') || userMessage.includes('大理') || userMessage.includes('丽江')) {
					response.content = '根据您的需求，我为您推荐以下云南5日游路线：\n\n' +
					'🏔️ **Day 1：抵达昆明**\n' +
					'- 上午：抵达昆明长水机场\n' +
					'- 下午：游览滇池、西山龙门\n' +
					'- 晚上：品尝过桥米线\n\n' +
					'🏞️ **Day 2：大理古城**\n' +
					'- 上午：动车前往大理，游览大理古城\n' +
					'- 下午：环洱海骑行，欣赏苍山洱海\n' +
					'- 晚上：古城酒吧街体验\n\n' +
					'🏯 **Day 3-4：丽江古城**\n' +
					'- 游览丽江古城、木府\n' +
					'- 玉龙雪山一日游\n' +
					'- 束河古镇休闲游\n\n' +
					'💰 **预算建议**：8000元足够享受舒适旅程，包含机票、住宿、餐饮和景点门票。';
					
					// 设置目的地和地图标记数据
					this.destinationData = {
						destination: '云南',
						markers: [
							{ name: '昆明', longitude: 102.7123, latitude: 25.0406 },
							{ name: '大理', longitude: 100.2676, latitude: 25.6065 },
							{ name: '丽江', longitude: 100.2330, latitude: 26.8721 }
						]
					};
				} else if (userMessage.includes('北京')) {
					response.content = '为您推荐北京家庭轻松游路线：\n\n' +
					'🏛️ **Day 1：天安门广场 & 故宫**\n' +
					'- 上午：天安门广场拍照留念\n' +
					'- 下午：游览故宫（建议预约导游讲解）\n' +
					'- 晚上：王府井小吃街\n\n' +
					'🐼 **Day 2：动物园 & 颐和园**\n' +
					'- 上午：北京动物园（适合小朋友）\n' +
					'- 下午：颐和园游船赏景\n' +
					'- 晚上：老北京涮羊肉\n\n' +
					'🏮 **Day 3：天坛 & 前门大街**\n' +
					'- 上午：天坛公园晨练\n' +
					'- 下午：前门大街购物休闲\n' +
					'- 行程轻松，适合老人小孩';
					
					// 设置目的地和地图标记数据
					this.destinationData = {
						destination: '北京',
						markers: [
							{ name: '天安门广场', longitude: 116.3974, latitude: 39.9093 },
							{ name: '故宫', longitude: 116.3970, latitude: 39.9175 },
							{ name: '颐和园', longitude: 116.2732, latitude: 39.9998 },
							{ name: '天坛', longitude: 116.4100, latitude: 39.8822 }
						]
					};
				} else if (userMessage.includes('杭州') || userMessage.includes('西湖')) {
					response.content = '杭州周末休闲游推荐：\n\n' +
					'🌸 **周六：西湖环湖游**\n' +
					'- 上午：断桥残雪 → 白堤 → 孤山\n' +
					'- 下午：苏堤春晓 → 花港观鱼\n' +
					'- 晚上：西湖音乐喷泉\n\n' +
					'🍵 **周日：龙井村 & 美食探索**\n' +
					'- 上午：龙井村品茶，体验茶文化\n' +
					'- 下午：河坊街品尝杭州小吃\n' +
					'- 推荐美食：西湖醋鱼、东坡肉、龙井虾仁';
					
					// 设置目的地和地图标记数据
					this.destinationData = {
						destination: '杭州',
						markers: [
							{ name: '西湖', longitude: 120.1551, latitude: 30.2741 },
							{ name: '断桥残雪', longitude: 120.1486, latitude: 30.2568 },
							{ name: '龙井村', longitude: 120.1047, latitude: 30.2345 },
							{ name: '河坊街', longitude: 120.1696, latitude: 30.2342 }
						]
					};
				} else {
					response.content = '感谢您分享旅行想法！为了更好地为您服务，请告诉我：\n\n' +
					'1. 具体的旅行目的地\n' +
					'2. 出行时间（几天）\n' +
					'3. 预算范围\n' +
					'4. 您的兴趣偏好（自然风光/历史文化/美食/购物等）\n\n' +
					'我会根据这些信息为您定制专属的旅行路线。';
				}

				this.aiResponse = response.content;
				this.messages.push(response);
				this.isAIThinking = false;
				this.showGenerateButton = true;
				
				// 滚动到底部
				this.$nextTick(() => {
					this.scrollToBottom();
				});
			},
			
			// 填充示例
			fillExample(text) {
				this.inputMessage = text;
			},
			
			// 生成旅游攻略
			generateGuide() {
				if (!this.aiResponse) {
					uni.showToast({
						title: '请先与AI助手交流',
						icon: 'none'
					});
					return;
				}
				
				// 跳转到编辑页面，携带AI推荐数据和地图标记数据
				const aiData = {
					recommendation: this.aiResponse,
					title: 'AI定制旅行攻略',
					content: this.aiResponse
				};
				
				// 如果有目的地数据，添加到跳转参数中
				if (this.destinationData) {
					aiData.destinationData = this.destinationData;
				}
				
				uni.navigateTo({
					url: '/pages/guide/edit/edit?aiData=' + encodeURIComponent(JSON.stringify(aiData))
				});
			},

			// 获取当前时间
			getCurrentTime() {
				const now = new Date();
				return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
			},

			// 滚动到底部
			scrollToBottom() {
				this.scrollTop = 99999;
			},
			
			// 返回上一页
			goBack() {
				uni.navigateBack();
			}
		}
	}
</script>

<style>
	.ai-chat-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #ffffff;
		padding-top: 40rpx;
		box-sizing: border-box;
	}

	/* 返回按钮样式 */
	.back-button {
		position: absolute;
		top: 40rpx;
		left: 30rpx;
		background: none;
		border: none;
		color: #333;
		font-size: 48rpx;
		cursor: pointer;
		padding: 16rpx;
		border-radius: 50%;
		transition: background-color 0.3s;
		z-index: 10;
	}

	.back-button:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}

	.back-icon {
		font-size: 48rpx;
		font-weight: bold;
	}

	/* 标题区域样式 */
	.app-header {
		text-align: center;
		padding: 40rpx 32rpx 30rpx;
		background: linear-gradient(135deg, #1A9E8F 0%, #15847a 100%);
		color: white;
		margin: 0 30rpx 30rpx;
		border-radius: 25rpx;
		box-shadow: 0 4rpx 20rpx rgba(26, 158, 143, 0.3);
	}

	.main-title {
		font-size: 56rpx;
		font-weight: 700;
		color: white;
		margin: 0 0 20rpx 0;
		letter-spacing: 1rpx;
		display: block;
	}

	.sub-title {
		font-size: 32rpx;
		color: rgba(255, 255, 255, 0.9);
		margin: 0;
		font-weight: 400;
		display: block;
	}

	.chat-content {
		flex: 1;
		overflow: hidden;
		padding: 0 30rpx;
		background-color: #f8f9fa;
	}

	.message-list {
		height: 100%;
	}

	.message-item {
		display: flex;
		margin-bottom: 30rpx;
		align-items: flex-start;
	}

	.user-message {
		flex-direction: row-reverse;
	}

	.message-avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background: linear-gradient(135deg, #1A9E8F 0%, #15847a 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 20rpx;
		flex-shrink: 0;
	}

	.user-message .message-avatar {
		background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
	}

	.avatar-icon {
		font-size: 36rpx;
	}

	.message-content {
		flex: 1;
		background: white;
		padding: 25rpx;
		border-radius: 20rpx;
		max-width: 70%;
		box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
	}

	.ai-message .message-content {
		border-top-left-radius: 0;
	}

	.user-message .message-content {
		border-top-right-radius: 0;
		background: linear-gradient(135deg, #1A9E8F 0%, #15847a 100%);
		color: white;
	}

	.message-text {
		font-size: 28rpx;
		line-height: 1.6;
		white-space: pre-line;
	}

	.message-time {
		font-size: 22rpx;
		color: #999;
		margin-top: 15rpx;
		display: block;
	}

	.user-message .message-time {
		color: rgba(255,255,255,0.7);
		text-align: right;
	}

	.suggestion-list {
		margin-top: 15rpx;
	}

	.suggestion-item {
		display: block;
		font-size: 24rpx;
		color: #666;
		margin-bottom: 8rpx;
	}

	.thinking-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 5rpx;
		margin-bottom: 10rpx;
	}

	.thinking-dot {
		font-size: 40rpx;
		color: #666;
		animation: blink 1.4s infinite both;
	}

	.thinking-dot:nth-child(2) {
		animation-delay: 0.2s;
	}

	.thinking-dot:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes blink {
		0%, 80%, 100% {
			opacity: 0.3;
		}
		40% {
			opacity: 1;
		}
	}

	.thinking-text {
		font-size: 24rpx;
		color: #666;
		text-align: center;
	}

	.input-section {
		background: white;
		padding: 25rpx 30rpx;
		border-top: 2rpx solid #f0f0f0;
	}

	.input-container {
		display: flex;
		align-items: flex-end;
		gap: 20rpx;
		margin-bottom: 20rpx;
	}

	.message-input {
		flex: 1;
		background: #f8f9fa;
		border: 2rpx solid #e9ecef;
		border-radius: 25rpx;
		padding: 25rpx 30rpx;
		font-size: 28rpx;
		min-height: 100rpx;
		max-height: 200rpx;
		margin-right: 20rpx;
	}

	.send-btn {
		background: linear-gradient(135deg, #1A9E8F 0%, #15847a 100%);
		color: white;
		border: none;
		border-radius: 15rpx;
		width: 120rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		font-size: 28rpx;
		font-weight: 500;
	}

	.send-btn:disabled {
		background: #ccc;
	}

	.send-icon {
		font-size: 28rpx;
	}

	.quick-tips {
		margin-top: 20rpx;
	}

	.tips-title {
		font-size: 24rpx;
		color: #666;
		margin-bottom: 15rpx;
		display: block;
	}

	.tips-list {
		display: flex;
		flex-direction: column;
		gap: 12rpx;
	}

	.tip-item {
		background: #f8f9fa;
		padding: 15rpx 20rpx;
		border-radius: 20rpx;
		font-size: 26rpx;
		color: #1A9E8F;
		border: 1rpx solid #e9ecef;
	}

	.generate-section {
		padding: 25rpx 30rpx;
		background: white;
		border-top: 2rpx solid #f0f0f0;
	}

	.generate-btn {
		background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
		border: none;
		border-radius: 50rpx;
		padding: 25rpx 40rpx;
		color: white;
		font-size: 28rpx;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 15rpx;
		width: 100%;
	}

	.generate-icon {
		font-size: 32rpx;
	}

	.generate-text {
		font-size: 28rpx;
	}
</style>