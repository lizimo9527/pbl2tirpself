<template>
	<view class="test-container">
		<view class="header">
			<text class="title">Dify AI 集成测试</text>
			<text class="subtitle">测试 AI 聊天功能是否正常工作</text>
		</view>

		<view class="test-section">
			<button class="test-btn" @click="testDifyConnection">
				<text class="btn-text">测试 Dify 连接</text>
			</button>
			
			<button class="test-btn" @click="testChatFunction">
				<text class="btn-text">测试聊天功能</text>
			</button>
			
			<button class="test-btn" @click="testFallback">
				<text class="btn-text">测试备用回复</text>
			</button>
		</view>

		<view class="result-section">
			<text class="result-title">测试结果：</text>
			<scroll-view class="result-content" scroll-y>
				<text class="result-text">{{ testResult }}</text>
			</scroll-view>
		</view>

		<view class="info-section">
			<text class="info-title">配置信息：</text>
			<text class="info-text">Dify 服务器：{{ difyConfig.server.baseURL }}</text>
			<text class="info-text">应用 ID：{{ difyConfig.applications.travelAssistant.appId }}</text>
			<text class="info-text">聊天端点：{{ difyConfig.applications.travelAssistant.chatEndpoint }}</text>
		</view>
	</view>
</template>

<script>
	import difyChatService from '@/services/difyChatService.js';
	import difyConfig from '@/config/dify.config.js';

	export default {
		data() {
			return {
				testResult: '点击上方按钮开始测试...',
				difyConfig: difyConfig
			}
		},
		methods: {
			async testDifyConnection() {
				this.testResult = '正在测试 Dify 连接...\n';
				
				try {
					// 测试简单的消息发送
					const result = await difyChatService.sendMessage('你好');
					
					if (result.success) {
						this.testResult += '✅ Dify 连接测试成功！\n';
						this.testResult += `💬 AI回复：${result.content.substring(0, 100)}...\n`;
						this.testResult += `🆔 会话ID：${result.conversationId}\n`;
					} else {
						this.testResult += '⚠️ Dify 连接失败，使用备用回复\n';
						this.testResult += `💬 备用回复：${result.content.substring(0, 100)}...\n`;
					}
				} catch (error) {
					this.testResult += `❌ 连接测试失败：${error.message}\n`;
				}
			},
			
			async testChatFunction() {
				this.testResult = '正在测试聊天功能...\n';
				
				const testMessages = [
					'我想去云南大理丽江玩5天，预算8000元',
					'带家人去北京旅游，有老人小孩，行程要轻松',
					'周末去杭州西湖周边，喜欢自然风光和美食'
				];
				
				for (let i = 0; i < testMessages.length; i++) {
					const message = testMessages[i];
					this.testResult += `\n📝 测试消息 ${i+1}："${message}"\n`;
					
					try {
						const result = await difyChatService.sendMessage(message);
						
						if (result.success) {
							this.testResult += '✅ AI回复成功\n';
							
							// 检查是否提取了旅行信息
							if (result.travelInfo && result.travelInfo.destination) {
								this.testResult += `📍 提取目的地：${result.travelInfo.destination}\n`;
							}
							
							// 显示部分回复内容
							const preview = result.content.substring(0, 80) + '...';
							this.testResult += `💬 回复预览：${preview}\n`;
						} else {
							this.testResult += '⚠️ 使用备用回复\n';
						}
					} catch (error) {
						this.testResult += `❌ 测试失败：${error.message}\n`;
					}
					
					// 添加分隔线
					this.testResult += '---\n';
					
					// 等待一下避免请求过快
					await new Promise(resolve => setTimeout(resolve, 500));
				}
			},
			
			async testFallback() {
				this.testResult = '正在测试备用回复功能...\n';
				
				// 测试一些特殊消息，可能会触发备用回复
				const testMessages = [
					'这是一个测试消息，应该会使用备用回复',
					'随机文本测试备用回复机制',
					'测试网络异常情况下的备用回复'
				];
				
				for (let i = 0; i < testMessages.length; i++) {
					const message = testMessages[i];
					this.testResult += `\n📝 测试消息 ${i+1}："${message}"\n`;
					
					try {
						const result = await difyChatService.sendMessage(message);
						
						this.testResult += '✅ 回复生成成功\n';
						
						// 显示回复内容
						const preview = result.content.substring(0, 100) + '...';
						this.testResult += `💬 回复内容：${preview}\n`;
						
						// 检查是否使用了备用回复
						if (result.content.includes('感谢您分享旅行想法') || 
						    result.content.includes('为了更好地为您服务')) {
							this.testResult += '🔧 检测到备用回复机制正常工作\n';
						}
						
					} catch (error) {
						this.testResult += `❌ 测试失败：${error.message}\n`;
					}
					
					this.testResult += '---\n';
					await new Promise(resolve => setTimeout(resolve, 500));
				}
			}
		}
	}
</script>

<style>
	.test-container {
		padding: 40rpx;
		background-color: #f8f9fa;
		min-height: 100vh;
	}

	.header {
		text-align: center;
		margin-bottom: 40rpx;
	}

	.title {
		font-size: 48rpx;
		font-weight: bold;
		color: #1A9E8F;
		display: block;
		margin-bottom: 16rpx;
	}

	.subtitle {
		font-size: 28rpx;
		color: #666;
		display: block;
	}

	.test-section {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
		margin-bottom: 40rpx;
	}

	.test-btn {
		background: linear-gradient(135deg, #1A9E8F 0%, #15847a 100%);
		border: none;
		border-radius: 25rpx;
		padding: 25rpx;
		color: white;
		font-size: 28rpx;
		font-weight: 500;
	}

	.btn-text {
		font-size: 28rpx;
	}

	.result-section {
		background: white;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 40rpx;
		box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
	}

	.result-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		display: block;
		margin-bottom: 20rpx;
	}

	.result-content {
		max-height: 400rpx;
		background: #f8f9fa;
		border-radius: 15rpx;
		padding: 20rpx;
	}

	.result-text {
		font-size: 24rpx;
		line-height: 1.6;
		color: #333;
		white-space: pre-line;
		font-family: 'Courier New', monospace;
	}

	.info-section {
		background: white;
		border-radius: 20rpx;
		padding: 30rpx;
		box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
	}

	.info-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		display: block;
		margin-bottom: 20rpx;
	}

	.info-text {
		font-size: 24rpx;
		color: #666;
		display: block;
		margin-bottom: 8rpx;
		font-family: 'Courier New', monospace;
	}
</style>