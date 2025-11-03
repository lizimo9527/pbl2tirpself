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
			sendMessage() {
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

				// 调用n8n工作流生成AI回复
				this.generateAIResponse(message);
			},

			// 生成AI回复（使用Dify工作流）
			async generateAIResponse(userMessage) {
				try {
					// 解析用户输入
					const userInput = difyService.parseUserInput(userMessage);
					
					// 调用Dify工作流生成旅行计划
					let aiResult;
					try {
						aiResult = await difyService.generateTravelPlan(userInput);
					} catch (error) {
						// 如果Dify服务不可用，使用模拟数据
						console.warn('Dify服务不可用，使用模拟数据:', error);
						aiResult = await difyService.mockAIResponse(userInput);
					}

					// 构建AI回复内容
					let responseContent = '';
					
					if (aiResult.success && aiResult.plan) {
						const plan = aiResult.plan;
						
						// 生成详细的旅行攻略
						responseContent = `根据您的需求，我为您定制了以下${plan.destination}${plan.days}日游路线：\n\n`;
						
						// 添加行程安排
						plan.itinerary.forEach(day => {
							responseContent += `📅 **${day.title}**\n`;
							day.activities.forEach(activity => {
								responseContent += `- ${activity}\n`;
							});
							responseContent += '\n';
						});
						
						// 添加预算建议
						if (plan.budget) {
							responseContent += `💰 **预算建议**：${plan.budget}元可以享受${plan.travelType || '舒适'}旅程\n\n`;
						}
						
						// 添加旅行提示
						if (plan.tips && plan.tips.length > 0) {
							responseContent += '💡 **旅行提示**：\n';
							plan.tips.forEach(tip => {
								responseContent += `- ${tip}\n`;
							});
							responseContent += '\n';
						}
						
						// 添加推荐
						if (plan.recommendations && plan.recommendations.length > 0) {
							responseContent += '🌟 **特别推荐**：\n';
							plan.recommendations.forEach(rec => {
								responseContent += `- ${rec}\n`;
							});
						}
						
						// 保存完整的AI计划数据
						this.aiPlanData = aiResult;
						
						// 设置地图标记数据
						if (aiResult.mapData) {
							this.destinationData = aiResult.mapData;
						}
					} else {
						// 如果信息不完整，请求更多信息
						responseContent = '感谢您分享旅行想法！为了更好地为您服务，请告诉我：\n\n' +
						'1. 具体的旅行目的地\n' +
						'2. 出行时间（几天）\n' +
						'3. 预算范围\n' +
						'4. 您的兴趣偏好（自然风光/历史文化/美食/购物等）\n\n' +
						'我会根据这些信息为您定制专属的旅行路线。';
					}

					// 创建AI回复消息
					const response = {
						type: 'ai',
						content: responseContent,
						time: this.getCurrentTime()
					};

					this.aiResponse = responseContent;
					this.messages.push(response);
					this.isAIThinking = false;
					this.showGenerateButton = true;
					
					// 滚动到底部
					this.$nextTick(() => {
						this.scrollToBottom();
					});
					
				} catch (error) {
					console.error('AI回复生成失败:', error);
					
					// 错误处理：显示友好的错误消息
					const errorResponse = {
						type: 'ai',
						content: '抱歉，AI助手暂时无法响应。请检查网络连接后重试，或稍后再试。',
						time: this.getCurrentTime()
					};
					
					this.messages.push(errorResponse);
					this.isAIThinking = false;
					
					// 滚动到底部
					this.$nextTick(() => {
						this.scrollToBottom();
					});
				}
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
					content: this.aiResponse,
					aiPlanData: this.aiPlanData // 携带完整的AI计划数据
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
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 20rpx;
	}

	.back-button {
		position: absolute;
		top: 40rpx;
		left: 20rpx;
		background: rgba(255, 255, 255, 0.2);
		border: none;
		border-radius: 50%;
		width: 80rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}

	.back-icon {
		font-size: 36rpx;
		color: white;
		font-weight: bold;
	}

	.app-header {
		text-align: center;
		margin-top: 60rpx;
		margin-bottom: 30rpx;
	}

	.main-title {
		font-size: 48rpx;
		font-weight: bold;
		color: white;
		display: block;
		margin-bottom: 10rpx;
	}

	.sub-title {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.8);
		display: block;
	}

	.chat-content {
		flex: 1;
		background: white;
		border-radius: 20rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
	}

	.message-list {
		height: 100%;
		max-height: 600rpx;
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
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 20rpx;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.avatar-icon {
		font-size: 36rpx;
	}

	.message-content {
		flex: 1;
		background: #f8f9fa;
		border-radius: 20rpx;
		padding: 20rpx;
		max-width: 70%;
		position: relative;
	}

	.user-message .message-content {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
		margin-top: 10rpx;
		display: block;
		text-align: right;
	}

	.user-message .message-time {
		color: rgba(255, 255, 255, 0.7);
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
		margin-bottom: 10rpx;
	}

	.thinking-dot {
		font-size: 36rpx;
		color: #667eea;
		animation: blink 1.4s infinite;
		margin: 0 5rpx;
	}

	.thinking-dot:nth-child(2) {
		animation-delay: 0.2s;
	}

	.thinking-dot:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes blink {
		0%, 100% { opacity: 0.2; }
		50% { opacity: 1; }
	}

	.thinking-text {
		font-size: 24rpx;
		color: #999;
	}

	.input-section {
		background: white;
		border-radius: 20rpx;
		padding: 20rpx;
		box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
	}

	.input-container {
		display: flex;
		align-items: flex-end;
		margin-bottom: 20rpx;
	}

	.message-input {
		flex: 1;
		background: #f8f9fa;
		border: none;
		border-radius: 20rpx;
		padding: 20rpx;
		font-size: 28rpx;
		min-height: 80rpx;
		max-height: 200rpx;
	}

	.send-btn {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border: none;
		border-radius: 20rpx;
		padding: 20rpx 30rpx;
		margin-left: 20rpx;
		color: white;
		font-size: 28rpx;
	}

	.send-btn:disabled {
		background: #ccc;
		opacity: 0.6;
	}

	.quick-tips {
		border-top: 1rpx solid #eee;
		padding-top: 20rpx;
	}

	.tips-title {
		font-size: 24rpx;
		color: #999;
		margin-bottom: 15rpx;
		display: block;
	}

	.tips-list {
		display: flex;
		flex-wrap: wrap;
		gap: 15rpx;
	}

	.tip-item {
		background: #f0f2f5;
		border-radius: 20rpx;
		padding: 15rpx 25rpx;
		font-size: 24rpx;
		color: #666;
		cursor: pointer;
		transition: all 0.3s;
	}

	.tip-item:active {
		background: #e4e6eb;
		transform: scale(0.95);
	}

	.generate-section {
		position: fixed;
		bottom: 30rpx;
		left: 50%;
		transform: translateX(-50%);
		z-index: 100;
	}

	.generate-btn {
		background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
		border: none;
		border-radius: 50rpx;
		padding: 25rpx 40rpx;
		color: white;
		font-size: 32rpx;
		font-weight: bold;
		display: flex;
		align-items: center;
		gap: 15rpx;
		box-shadow: 0 8rpx 25rpx rgba(255, 107, 107, 0.4);
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0% { transform: translateX(-50%) scale(1); }
		50% { transform: translateX(-50%) scale(1.05); }
		100% { transform: translateX(-50%) scale(1); }
	}

	.generate-icon {
		font-size: 36rpx;
	}

	.generate-text {
		font-size: 28rpx;
	}
</style>