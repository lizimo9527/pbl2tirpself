# N8N 工作流配置文档

## 概述

本文档描述了 TripSelf 小程序中使用的 n8n 工作流配置。n8n 是一个开源的工作流自动化工具，用于处理旅行攻略生成、地理编码等任务。

## 当前配置

### Webhook 地址
- **主 Webhook URL**: `https://lzm.app.n8n.cloud/webhook/44c8111b-fc92-4461-abc7-d7181b2077ea`
- **配置位置**: `config/n8n.config.js` 和 `services/n8nService.js`

## 工作流设计

### 1. 旅行攻略生成工作流

#### 功能描述
根据用户输入的旅行需求（目的地、天数、预算、偏好等），生成个性化的旅行攻略。

#### 输入参数
工作流接收以下 JSON 格式的 POST 请求：

```json
{
  "userInput": {
    "destination": "北京",
    "days": 3,
    "budget": 5000,
    "preferences": "历史文化",
    "travelType": "家庭",
    "rawMessage": "我想去北京玩3天，预算5000元，喜欢历史文化"
  },
  "timestamp": "2024-01-01T12:00:00.000Z",
  "platform": "mini-program",
  "action": "generate-travel-plan"
}
```

#### 参数说明

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userInput.destination | string | 是 | 旅行目的地 |
| userInput.days | number | 否 | 旅行天数，默认3天 |
| userInput.budget | number | 否 | 预算金额（元），默认5000 |
| userInput.preferences | string | 否 | 旅行偏好：自然风光/历史文化/美食/购物/休闲/冒险 |
| userInput.travelType | string | 否 | 旅行类型：家庭/情侣/独自/朋友/商务 |
| userInput.rawMessage | string | 否 | 原始用户消息 |
| timestamp | string | 是 | 请求时间戳（ISO 8601格式） |
| platform | string | 是 | 平台标识，固定为 "mini-program" |
| action | string | 是 | 操作类型，固定为 "generate-travel-plan" |

#### 输出格式

工作流应返回以下格式的 JSON 响应：

```json
{
  "success": true,
  "plan": {
    "title": "北京3日游(家庭)",
    "destination": "北京",
    "days": 3,
    "budget": 5000,
    "preferences": "历史文化",
    "travelType": "家庭",
    "itinerary": [
      {
        "day": 1,
        "title": "第1天：天安门广场 - 故宫博物院",
        "activities": [
          "上午：参观天安门广场，观看升旗仪式",
          "下午：游览故宫博物院，了解明清历史",
          "晚上：王府井步行街品尝北京小吃"
        ],
        "attractions": [
          {
            "name": "天安门广场",
            "description": "中国政治中心，世界最大的城市广场",
            "longitude": 116.3974,
            "latitude": 39.9037
          },
          {
            "name": "故宫博物院",
            "description": "明清两朝皇宫，世界文化遗产",
            "longitude": 116.3972,
            "latitude": 39.9163
          }
        ]
      },
      {
        "day": 2,
        "title": "第2天：天坛 - 颐和园",
        "activities": [
          "上午：游览天坛公园，体验古代祭天文化",
          "下午：参观颐和园，欣赏皇家园林",
          "晚上：三里屯休闲购物"
        ],
        "attractions": [
          {
            "name": "天坛",
            "description": "明清皇帝祭天的场所",
            "longitude": 116.4074,
            "latitude": 39.8823
          }
        ]
      }
    ],
    "tips": [
      "建议提前预订故宫门票，避免排队",
      "北京天气变化较大，注意携带衣物",
      "地铁是最便捷的交通方式"
    ],
    "recommendations": [
      "推荐尝试北京烤鸭、炸酱面等特色美食",
      "可以购买一些北京特产作为纪念",
      "注意保护文物，文明旅游"
    ]
  },
  "mapData": {
    "destination": "北京",
    "coordinates": {
      "longitude": 116.3974,
      "latitude": 39.9093
    },
    "markers": [
      {
        "name": "天安门广场",
        "longitude": 116.3974,
        "latitude": 39.9037
      },
      {
        "name": "故宫博物院",
        "longitude": 116.3972,
        "latitude": 39.9163
      }
    ]
  }
}
```

#### 错误响应格式

```json
{
  "success": false,
  "error": "错误描述信息",
  "code": "ERROR_CODE"
}
```

### 2. 地理编码工作流（可选）

#### 功能描述
将目的地名称转换为地理坐标，用于地图显示。

#### 输入参数

```json
{
  "destination": "北京"
}
```

#### 输出格式

```json
{
  "destination": "北京",
  "coordinates": {
    "longitude": 116.3974,
    "latitude": 39.9093
  },
  "markers": [
    {
      "name": "北京",
      "longitude": 116.3974,
      "latitude": 39.9093
    }
  ]
}
```

## N8N 工作流节点建议

### 旅行攻略生成工作流节点结构

1. **Webhook 节点**
   - 接收来自小程序的 POST 请求
   - 配置路径：`/webhook/44c8111b-fc92-4461-abc7-d7181b2077ea`
   - HTTP Method: POST
   - Response Mode: Respond to Webhook

2. **数据提取节点（Set 节点）**
   - 从请求体中提取 `userInput` 数据
   - 设置默认值（如果某些字段缺失）

3. **条件判断节点（IF 节点）**
   - 验证必填字段（destination）
   - 验证数据格式

4. **AI/LLM 节点（可选）**
   - 如果使用 AI 生成攻略，可以集成 OpenAI、Claude 等
   - 构建提示词（Prompt），包含用户需求
   - 生成旅行攻略内容

5. **数据处理节点（Code 节点）**
   - 解析 AI 返回的内容
   - 结构化数据（提取行程、景点、建议等）
   - 格式化输出

6. **地理编码节点（HTTP Request 节点）**
   - 调用地图 API（如高德地图、百度地图、腾讯地图）
   - 获取目的地和景点的坐标信息

7. **数据合并节点（Merge 节点）**
   - 合并攻略内容和地图数据

8. **响应节点（Respond to Webhook 节点）**
   - 返回格式化的 JSON 响应

### 示例工作流配置

```
Webhook (接收请求)
  ↓
Set (提取和设置默认值)
  ↓
IF (验证必填字段)
  ↓ (true)
HTTP Request (调用AI服务生成攻略)
  ↓
Code (解析和结构化数据)
  ↓
HTTP Request (地理编码)
  ↓
Merge (合并数据)
  ↓
Respond to Webhook (返回响应)
```

## 支持的目的地

当前支持以下目的地（可在 `config/n8n.config.js` 中扩展）：

- 一线城市：北京、上海、广州、深圳
- 热门旅游城市：杭州、成都、西安、南京、武汉、重庆
- 旅游省份/地区：云南、大理、丽江、三亚、厦门、青岛、大连、苏州、无锡、宁波

## 旅行类型映射

| 中文 | 英文标识 |
|------|----------|
| 家庭 | family |
| 情侣 | couple |
| 独自 | solo |
| 朋友 | friends |
| 商务 | business |

## 偏好映射

| 中文 | 英文标识 |
|------|----------|
| 自然风光 | nature |
| 历史文化 | culture |
| 美食 | food |
| 购物 | shopping |
| 休闲 | relaxation |
| 冒险 | adventure |

## 集成说明

### 在小程序中调用

```javascript
import n8nService from '@/services/n8nService.js';

// 解析用户输入
const userInput = n8nService.parseUserInput("我想去北京玩3天，预算5000元");

// 调用工作流生成攻略
const result = await n8nService.generateTravelPlan(userInput);

if (result.success) {
  console.log('攻略生成成功:', result.data);
} else {
  console.error('攻略生成失败:', result.error);
}
```

### 错误处理

- 如果 n8n 工作流调用失败，服务会返回 `success: false` 和错误信息
- 小程序端可以根据错误信息进行相应的处理（如显示错误提示、使用备用方案等）

## 测试建议

1. **使用 n8n 的测试功能**
   - 在 n8n 编辑器中直接测试工作流
   - 使用示例数据验证输出格式

2. **小程序端测试**
   - 使用 `pages/test/test.vue` 页面进行连接测试
   - 验证请求和响应格式

3. **监控和日志**
   - 在 n8n 中启用执行历史记录
   - 监控工作流的执行时间和成功率

## 后续扩展

可以考虑添加以下工作流：

1. **天气预报工作流**
   - 根据目的地和日期获取天气预报
   - 为旅行攻略提供天气建议

2. **酒店推荐工作流**
   - 根据预算和偏好推荐酒店
   - 集成酒店预订 API

3. **交通规划工作流**
   - 规划城市间的交通路线
   - 提供交通方式和时间建议

## 注意事项

1. **安全性**
   - Webhook 地址应妥善保管，避免泄露
   - 如果需要对请求进行验证，可以在 n8n 中添加认证节点

2. **性能**
   - 工作流执行时间应控制在 30 秒以内
   - 对于耗时操作，考虑异步处理

3. **错误处理**
   - 工作流应包含完善的错误处理逻辑
   - 返回清晰的错误信息，便于调试

4. **数据格式**
   - 确保返回的数据格式符合小程序端的预期
   - 保持 API 接口的向后兼容性

## 联系方式

如有问题或需要调整工作流配置，请联系开发团队。

