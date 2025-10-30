"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      messages: [],
      inputMessage: "",
      isAIThinking: false,
      scrollTop: 0,
      showGenerateButton: false,
      aiResponse: "",
      destinationData: null
      // 存储目的地和地图标记数据
    };
  },
  methods: {
    // 发送消息
    sendMessage() {
      if (!this.inputMessage.trim() || this.isAIThinking)
        return;
      const userMessage = {
        type: "user",
        content: this.inputMessage.trim(),
        time: this.getCurrentTime()
      };
      this.messages.push(userMessage);
      const message = this.inputMessage;
      this.inputMessage = "";
      this.isAIThinking = true;
      this.$nextTick(() => {
        this.scrollToBottom();
      });
      setTimeout(() => {
        this.generateAIResponse(message);
      }, 1500);
    },
    // 生成AI回复
    generateAIResponse(userMessage) {
      let response = {
        type: "ai",
        content: "",
        time: this.getCurrentTime()
      };
      if (userMessage.includes("云南") || userMessage.includes("大理") || userMessage.includes("丽江")) {
        response.content = "根据您的需求，我为您推荐以下云南5日游路线：\n\n🏔️ **Day 1：抵达昆明**\n- 上午：抵达昆明长水机场\n- 下午：游览滇池、西山龙门\n- 晚上：品尝过桥米线\n\n🏞️ **Day 2：大理古城**\n- 上午：动车前往大理，游览大理古城\n- 下午：环洱海骑行，欣赏苍山洱海\n- 晚上：古城酒吧街体验\n\n🏯 **Day 3-4：丽江古城**\n- 游览丽江古城、木府\n- 玉龙雪山一日游\n- 束河古镇休闲游\n\n💰 **预算建议**：8000元足够享受舒适旅程，包含机票、住宿、餐饮和景点门票。";
        this.destinationData = {
          destination: "云南",
          markers: [
            { name: "昆明", longitude: 102.7123, latitude: 25.0406 },
            { name: "大理", longitude: 100.2676, latitude: 25.6065 },
            { name: "丽江", longitude: 100.233, latitude: 26.8721 }
          ]
        };
      } else if (userMessage.includes("北京")) {
        response.content = "为您推荐北京家庭轻松游路线：\n\n🏛️ **Day 1：天安门广场 & 故宫**\n- 上午：天安门广场拍照留念\n- 下午：游览故宫（建议预约导游讲解）\n- 晚上：王府井小吃街\n\n🐼 **Day 2：动物园 & 颐和园**\n- 上午：北京动物园（适合小朋友）\n- 下午：颐和园游船赏景\n- 晚上：老北京涮羊肉\n\n🏮 **Day 3：天坛 & 前门大街**\n- 上午：天坛公园晨练\n- 下午：前门大街购物休闲\n- 行程轻松，适合老人小孩";
        this.destinationData = {
          destination: "北京",
          markers: [
            { name: "天安门广场", longitude: 116.3974, latitude: 39.9093 },
            { name: "故宫", longitude: 116.397, latitude: 39.9175 },
            { name: "颐和园", longitude: 116.2732, latitude: 39.9998 },
            { name: "天坛", longitude: 116.41, latitude: 39.8822 }
          ]
        };
      } else if (userMessage.includes("杭州") || userMessage.includes("西湖")) {
        response.content = "杭州周末休闲游推荐：\n\n🌸 **周六：西湖环湖游**\n- 上午：断桥残雪 → 白堤 → 孤山\n- 下午：苏堤春晓 → 花港观鱼\n- 晚上：西湖音乐喷泉\n\n🍵 **周日：龙井村 & 美食探索**\n- 上午：龙井村品茶，体验茶文化\n- 下午：河坊街品尝杭州小吃\n- 推荐美食：西湖醋鱼、东坡肉、龙井虾仁";
        this.destinationData = {
          destination: "杭州",
          markers: [
            { name: "西湖", longitude: 120.1551, latitude: 30.2741 },
            { name: "断桥残雪", longitude: 120.1486, latitude: 30.2568 },
            { name: "龙井村", longitude: 120.1047, latitude: 30.2345 },
            { name: "河坊街", longitude: 120.1696, latitude: 30.2342 }
          ]
        };
      } else {
        response.content = "感谢您分享旅行想法！为了更好地为您服务，请告诉我：\n\n1. 具体的旅行目的地\n2. 出行时间（几天）\n3. 预算范围\n4. 您的兴趣偏好（自然风光/历史文化/美食/购物等）\n\n我会根据这些信息为您定制专属的旅行路线。";
      }
      this.aiResponse = response.content;
      this.messages.push(response);
      this.isAIThinking = false;
      this.showGenerateButton = true;
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
        common_vendor.index.showToast({
          title: "请先与AI助手交流",
          icon: "none"
        });
        return;
      }
      const aiData = {
        recommendation: this.aiResponse,
        title: "AI定制旅行攻略",
        content: this.aiResponse
      };
      if (this.destinationData) {
        aiData.destinationData = this.destinationData;
      }
      common_vendor.index.navigateTo({
        url: "/pages/guide/edit/edit?aiData=" + encodeURIComponent(JSON.stringify(aiData))
      });
    },
    // 获取当前时间
    getCurrentTime() {
      const now = /* @__PURE__ */ new Date();
      return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    },
    // 滚动到底部
    scrollToBottom() {
      this.scrollTop = 99999;
    },
    // 返回上一页
    goBack() {
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.f($data.messages, (message, index, i0) => {
      return {
        a: common_vendor.t(message.type === "user" ? "👤" : "🤖"),
        b: common_vendor.t(message.content),
        c: common_vendor.t(message.time),
        d: index,
        e: common_vendor.n(message.type === "user" ? "user-message" : "ai-message")
      };
    }),
    c: $data.isAIThinking
  }, $data.isAIThinking ? {} : {}, {
    d: $data.scrollTop,
    e: $data.isAIThinking,
    f: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    g: $data.inputMessage,
    h: common_vendor.o(($event) => $data.inputMessage = $event.detail.value),
    i: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    j: !$data.inputMessage.trim() || $data.isAIThinking,
    k: common_vendor.o(($event) => $options.fillExample("我想去云南大理丽江玩5天，预算8000元")),
    l: common_vendor.o(($event) => $options.fillExample("带家人去北京旅游，有老人小孩，行程要轻松")),
    m: common_vendor.o(($event) => $options.fillExample("周末去杭州西湖周边，喜欢自然风光和美食")),
    n: $data.showGenerateButton
  }, $data.showGenerateButton ? {
    o: common_vendor.o((...args) => $options.generateGuide && $options.generateGuide(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/ai-chat/ai-chat.js.map
