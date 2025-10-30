"use strict";
const common_vendor = require("../../../common/vendor.js");
const config_map_config = require("../../../config/map.config.js");
const _sfc_main = {
  data() {
    return {
      currentDateIndex: 0,
      dates: [
        { name: "7月3号", desc: "第一天" },
        { name: "7月4号", desc: "第二天" },
        { name: "7月5号", desc: "第三天" },
        { name: "7月6号", desc: "第四天" }
      ],
      locations: {
        0: [
          {
            name: "北京故宫",
            type: "景点",
            transport: "驾车",
            distance: "7km",
            duration: "21分钟",
            note: "建议上午9点到达，游览时间约3小时",
            longitude: 116.3974,
            latitude: 39.9093
          },
          {
            name: "王府井大街",
            type: "购物",
            transport: "步行",
            distance: "3km",
            duration: "11分钟",
            note: "午餐推荐：全聚德烤鸭",
            longitude: 116.4179,
            latitude: 39.9089
          }
        ],
        1: [],
        2: [],
        3: []
      },
      // 地图相关数据
      mapCenter: {
        longitude: config_map_config.mapConfig.defaultCenter.longitude,
        latitude: config_map_config.mapConfig.defaultCenter.latitude
      },
      mapScale: config_map_config.mapConfig.zoomLevel,
      mapMarkers: [],
      routePolyline: [],
      isMapLoading: false,
      showSearch: false,
      showNoteModal: false,
      searchKeyword: "",
      searchResults: [
        { name: "天安门广场", type: "景点" },
        { name: "颐和园", type: "景点" },
        { name: "北京首都国际机场", type: "交通枢纽" },
        { name: "北京饭店", type: "住宿" },
        { name: "全聚德烤鸭店", type: "餐饮" }
      ],
      currentNote: "",
      currentEditingLocation: null,
      routeInfo: {
        totalDistance: "10km",
        totalDuration: "32分钟",
        segments: [
          { distance: "7km", duration: "21分钟" },
          { distance: "3km", duration: "11分钟" }
        ]
      }
    };
  },
  computed: {
    currentLocations() {
      return this.locations[this.currentDateIndex] || [];
    }
  },
  methods: {
    // 日期切换
    switchDate(index) {
      this.currentDateIndex = index;
    },
    // 地图控制
    zoomIn() {
      if (this.mapScale < 20) {
        this.mapScale += 1;
      }
    },
    zoomOut() {
      if (this.mapScale > 3) {
        this.mapScale -= 1;
      }
    },
    // 定位到当前位置
    async locateCurrent() {
      try {
        const location = await config_map_config.mapUtils.getCurrentLocation();
        this.mapCenter.longitude = location.longitude;
        this.mapCenter.latitude = location.latitude;
        this.mapScale = 16;
        common_vendor.index.showToast({
          title: "已定位到当前位置",
          icon: "success"
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/plan/edit/edit.vue:268", "定位失败:", error);
        common_vendor.index.showToast({
          title: "定位失败，请检查权限设置",
          icon: "none"
        });
      }
    },
    // 清除标记
    clearMarkers() {
      if (this.mapMarkers.length === 0) {
        common_vendor.index.showToast({
          title: "暂无标记可清除",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showModal({
        title: "确认清除",
        content: "确定要清除所有地图标记吗？",
        success: (res) => {
          if (res.confirm) {
            this.mapMarkers = [];
            this.routePolyline = [];
            common_vendor.index.showToast({
              title: "标记已清除",
              icon: "success"
            });
          }
        }
      });
    },
    // 地图点击事件
    onMapTap(e) {
      const { latitude, longitude } = e.detail;
      common_vendor.index.showModal({
        title: "添加地点",
        content: "是否在此位置添加旅行地点？",
        showCancel: true,
        cancelText: "取消",
        confirmText: "添加",
        success: async (res) => {
          if (res.confirm) {
            try {
              const addressInfo = await config_map_config.mapUtils.reverseGeocode(latitude, longitude);
              const newLocation = {
                name: addressInfo.address || "自定义地点",
                type: "景点",
                transport: "驾车",
                distance: "0km",
                duration: "0分钟",
                note: "",
                longitude,
                latitude
              };
              if (!this.locations[this.currentDateIndex]) {
                this.locations[this.currentDateIndex] = [];
              }
              this.locations[this.currentDateIndex].push(newLocation);
              this.addMapMarker(newLocation);
              common_vendor.index.showToast({
                title: "地点添加成功",
                icon: "success"
              });
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/plan/edit/edit.vue:343", "添加地点失败:", error);
              common_vendor.index.showToast({
                title: "地点添加失败",
                icon: "none"
              });
            }
          }
        }
      });
    },
    // 标记点点击事件
    onMarkerTap(e) {
      const markerId = e.markerId;
      const marker = this.mapMarkers.find((m) => m.id === markerId);
      if (marker) {
        common_vendor.index.showModal({
          title: marker.title,
          content: "您想对这个地点做什么？",
          showCancel: true,
          cancelText: "取消",
          confirmText: "查看详情",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.showToast({
                title: "查看地点详情",
                icon: "none"
              });
            }
          }
        });
      }
    },
    // 地图区域变化事件
    onRegionChange(e) {
      if (e.type === "end")
        ;
    },
    // 添加地图标记
    addMapMarker(location) {
      const marker = {
        id: Date.now(),
        longitude: location.longitude,
        latitude: location.latitude,
        title: location.name,
        iconPath: "/static/images/map/marker.png",
        width: 30,
        height: 30,
        callout: {
          content: location.name,
          color: "#ffffff",
          bgColor: "#1A9E8F",
          display: "ALWAYS"
        }
      };
      this.mapMarkers.push(marker);
    },
    // 更新地图标记
    updateMapMarkers() {
      this.mapMarkers = [];
      const currentLocations = this.locations[this.currentDateIndex] || [];
      currentLocations.forEach((location) => {
        this.addMapMarker(location);
      });
    },
    // 搜索功能
    showSearchModal() {
      this.showSearch = true;
    },
    hideSearchModal() {
      this.showSearch = false;
      this.searchKeyword = "";
    },
    searchLocations() {
      if (!this.searchKeyword.trim()) {
        common_vendor.index.showToast({ title: "请输入搜索关键词", icon: "none" });
        return;
      }
      common_vendor.index.showToast({ title: `搜索: ${this.searchKeyword}`, icon: "none" });
    },
    // 地点管理
    addLocationFromSearch(result) {
      const newLocation = {
        name: result.name,
        type: result.type,
        transport: "驾车",
        distance: "0km",
        duration: "0分钟",
        note: ""
      };
      this.locations[this.currentDateIndex].push(newLocation);
      this.hideSearchModal();
      common_vendor.index.showToast({ title: "地点添加成功", icon: "success" });
    },
    editLocation(location) {
      this.currentEditingLocation = location;
      this.currentNote = location.note || "";
      this.showNoteModal = true;
    },
    deleteLocation(index) {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除这个地点吗？",
        success: (res) => {
          if (res.confirm) {
            this.locations[this.currentDateIndex].splice(index, 1);
            common_vendor.index.showToast({ title: "删除成功", icon: "success" });
          }
        }
      });
    },
    // 备注管理
    hideNoteModal() {
      this.showNoteModal = false;
      this.currentNote = "";
      this.currentEditingLocation = null;
    },
    saveNote() {
      if (this.currentEditingLocation) {
        this.currentEditingLocation.note = this.currentNote;
        common_vendor.index.showToast({ title: "备注保存成功", icon: "success" });
      }
      this.hideNoteModal();
    },
    // 路线规划
    generateRoute() {
      if (this.currentLocations.length < 2) {
        common_vendor.index.showToast({ title: "请至少添加2个地点进行路线规划", icon: "none" });
        return;
      }
      common_vendor.index.showToast({ title: "正在生成智能路线...", icon: "loading" });
      setTimeout(() => {
        this.routeInfo = {
          totalDistance: `${this.currentLocations.length * 5}km`,
          totalDuration: `${this.currentLocations.length * 15}分钟`,
          segments: this.currentLocations.map((_, index) => ({
            distance: `${index + 1}km`,
            duration: `${index + 5}分钟`
          }))
        };
        common_vendor.index.showToast({ title: "路线规划完成", icon: "success" });
      }, 1e3);
    },
    // 地图聚焦
    focusOnLocation(location) {
      common_vendor.index.showToast({
        title: `聚焦到: ${location.name}`,
        icon: "none"
      });
    },
    goBack() {
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.dates, (date, index, i0) => {
      return {
        a: common_vendor.t(date.name),
        b: common_vendor.t(date.desc),
        c: index,
        d: $data.currentDateIndex === index ? 1 : "",
        e: common_vendor.o(($event) => $options.switchDate(index), index)
      };
    }),
    b: common_vendor.o((...args) => $options.locateCurrent && $options.locateCurrent(...args)),
    c: common_vendor.o((...args) => $options.zoomIn && $options.zoomIn(...args)),
    d: common_vendor.o((...args) => $options.zoomOut && $options.zoomOut(...args)),
    e: common_vendor.o((...args) => $options.clearMarkers && $options.clearMarkers(...args)),
    f: $data.mapCenter.longitude,
    g: $data.mapCenter.latitude,
    h: $data.mapScale,
    i: $data.mapMarkers,
    j: $data.routePolyline,
    k: common_vendor.o((...args) => $options.onMapTap && $options.onMapTap(...args)),
    l: common_vendor.o((...args) => $options.onMarkerTap && $options.onMarkerTap(...args)),
    m: common_vendor.o((...args) => $options.onRegionChange && $options.onRegionChange(...args)),
    n: $data.isMapLoading
  }, $data.isMapLoading ? {} : {}, {
    o: common_vendor.o((...args) => $options.showSearchModal && $options.showSearchModal(...args)),
    p: common_vendor.f($options.currentLocations, (location, index, i0) => {
      return {
        a: common_vendor.t(location.name),
        b: common_vendor.t(location.transport),
        c: common_vendor.t(location.distance),
        d: common_vendor.t(location.duration),
        e: common_vendor.o(($event) => $options.editLocation(location), index),
        f: common_vendor.o(($event) => $options.deleteLocation(index), index),
        g: index,
        h: common_vendor.o(($event) => $options.focusOnLocation(location), index)
      };
    }),
    q: common_vendor.o((...args) => $options.generateRoute && $options.generateRoute(...args)),
    r: common_vendor.t($data.routeInfo.totalDistance),
    s: common_vendor.t($data.routeInfo.totalDuration),
    t: common_vendor.f($data.routeInfo.segments, (segment, index, i0) => {
      return {
        a: common_vendor.t(segment.distance),
        b: common_vendor.t(segment.duration),
        c: index
      };
    }),
    v: $data.showSearch
  }, $data.showSearch ? {
    w: common_vendor.o((...args) => $options.hideSearchModal && $options.hideSearchModal(...args)),
    x: $data.searchKeyword,
    y: common_vendor.o(($event) => $data.searchKeyword = $event.detail.value),
    z: common_vendor.o((...args) => $options.searchLocations && $options.searchLocations(...args)),
    A: common_vendor.f($data.searchResults, (result, index, i0) => {
      return {
        a: common_vendor.t(result.name),
        b: common_vendor.t(result.type),
        c: index,
        d: common_vendor.o(($event) => $options.addLocationFromSearch(result), index)
      };
    })
  } : {}, {
    B: $data.showNoteModal
  }, $data.showNoteModal ? {
    C: common_vendor.o((...args) => $options.hideNoteModal && $options.hideNoteModal(...args)),
    D: $data.currentNote,
    E: common_vendor.o(($event) => $data.currentNote = $event.detail.value),
    F: common_vendor.t($data.currentNote.length),
    G: common_vendor.o((...args) => $options.hideNoteModal && $options.hideNoteModal(...args)),
    H: common_vendor.o((...args) => $options.saveNote && $options.saveNote(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/plan/edit/edit.js.map
