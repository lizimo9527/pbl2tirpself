# 腾讯地图API配置指南

## 1. 获取腾讯地图API密钥

### 步骤1：注册腾讯位置服务
1. 访问 [腾讯位置服务官网](https://lbs.qq.com/)
2. 注册并登录腾讯开发者账号
3. 进入控制台，创建新应用

### 步骤2：获取API密钥
1. 在应用管理页面，找到"密钥管理"
2. 复制您的API密钥（Key）
3. 将密钥配置到项目中

## 2. 项目配置

### 配置文件位置
- 配置文件：`/config/map.config.js`
- 需要修改的配置项：

```javascript
const mapConfig = {
  // 腾讯地图开发者密钥（需要申请）
  key: 'YOUR_TENCENT_MAP_KEY', // 请替换为实际的腾讯地图key
  
  // 其他配置保持不变...
}
```

### 配置步骤
1. 打开 `/config/map.config.js` 文件
2. 将 `YOUR_TENCENT_MAP_KEY` 替换为您的实际API密钥
3. 保存文件

## 3. 域名配置（小程序）

### 小程序域名配置
在微信小程序后台配置以下域名：

```
request合法域名：
https://apis.map.qq.com

uploadFile合法域名：
https://apis.map.qq.com

downloadFile合法域名：
https://apis.map.qq.com
```

### 配置步骤
1. 登录微信小程序后台
2. 进入"开发" -> "开发管理" -> "开发设置"
3. 在"服务器域名"中添加上述域名

## 4. 权限配置

### 小程序权限配置
在 `manifest.json` 中已配置以下权限：

```json
"mp-weixin": {
  "requiredPrivateInfos": [
    "getLocation"
  ],
  "permission": {
    "scope.userLocation": {
      "desc": "用于获取当前位置信息"
    }
  }
}
```

## 5. 功能说明

### 已实现的地图功能
1. **基础地图显示** - 显示腾讯地图
2. **定位功能** - 获取用户当前位置
3. **标记点管理** - 添加、删除地图标记
4. **地址解析** - 地址转坐标，坐标转地址
5. **地点搜索** - 搜索特定地点
6. **地图交互** - 缩放、拖动、点击交互

### 地图页面
- 主地图页面：`/pages/map/map.vue`
- 创建攻略地图：`/pages/create/create.vue`
- 编辑攻略地图：`/pages/plan/edit/edit.vue`

## 6. 常见问题

### Q: 地图显示空白
A: 检查API密钥是否正确配置，域名是否已配置

### Q: 定位功能无法使用
A: 检查小程序权限配置，确保用户已授权定位权限

### Q: 搜索功能返回错误
A: 检查API密钥是否有效，网络连接是否正常

### Q: 地图标记不显示
A: 检查标记图片路径是否正确，图片文件是否存在

## 7. 技术支持

- 腾讯地图官方文档：https://lbs.qq.com/
- 微信小程序地图组件文档：https://developers.weixin.qq.com/miniprogram/dev/component/map.html
- 项目问题反馈：联系项目开发团队

## 8. 注意事项

1. **API调用限制**：腾讯地图API有调用次数限制，请合理使用
2. **密钥安全**：不要将API密钥提交到公开代码仓库
3. **用户隐私**：遵守用户隐私政策，合理使用位置信息
4. **网络环境**：确保网络环境稳定，避免地图加载失败