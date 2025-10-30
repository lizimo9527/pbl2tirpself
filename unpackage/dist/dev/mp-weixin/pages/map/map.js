"use strict";
const common_vendor = require("../../common/vendor.js");
const config_map_config = require("../../config/map.config.js");
const _sfc_main = {
  data() {
    return {
      // 地图中心点
      mapCenter: {
        longitude: config_map_config.mapConfig.defaultCenter.longitude,
        latitude: config_map_config.mapConfig.defaultCenter.latitude
      },
      // 地图缩放级别
      mapScale: config_map_config.mapConfig.zoomLevel,
      // 标记点
      markers: [],
      // 路线
      polyline: [],
      // 当前位置信息
      currentLocation: {
        longitude: 0,
        latitude: 0,
        address: ""
      },
      // 加载状态
      isLoading: false,
      // 搜索相关
      showSearchModal: false,
      searchKeyword: "",
      searchResults: []
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    // 初始化地图
    async initMap() {
      this.isLoading = true;
      try {
        const location = await config_map_config.mapUtils.getCurrentLocation();
        this.mapCenter.longitude = location.longitude;
        this.mapCenter.latitude = location.latitude;
        const addressInfo = await config_map_config.mapUtils.reverseGeocode(location.latitude, location.longitude);
        this.currentLocation = {
          longitude: location.longitude,
          latitude: location.latitude,
          address: addressInfo.address
        };
        this.addMarker({
          id: 0,
          longitude: location.longitude,
          latitude: location.latitude,
          title: "当前位置",
          iconPath: "/static/images/map/current-location.png",
          width: 40,
          height: 40
        });
        common_vendor.index.showToast({
          title: "地图初始化成功",
          icon: "success"
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/map/map.vue:172", "地图初始化失败:", error);
        common_vendor.index.showToast({
          title: "地图初始化失败，使用默认位置",
          icon: "none"
        });
      } finally {
        this.isLoading = false;
      }
    },
    // 定位到当前位置
    async locateMe() {
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
        common_vendor.index.__f__("error", "at pages/map/map.vue:195", "定位失败:", error);
        common_vendor.index.showToast({
          title: "定位失败，请检查权限设置",
          icon: "none"
        });
      }
    },
    // 搜索地点
    searchLocation() {
      this.showSearchModal = true;
    },
    // 执行搜索
    async performSearch() {
      if (!this.searchKeyword.trim()) {
        common_vendor.index.showToast({
          title: "请输入搜索关键词",
          icon: "none"
        });
        return;
      }
      this.isLoading = true;
      try {
        const results = await config_map_config.mapUtils.searchPlaces(this.searchKeyword);
        this.searchResults = results.map((place, index) => ({
          id: index,
          title: place.title,
          address: place.address,
          longitude: place.location.lng,
          latitude: place.location.lat
        }));
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/map/map.vue:229", "搜索失败:", error);
        common_vendor.index.showToast({
          title: "搜索失败，请稍后重试",
          icon: "none"
        });
      } finally {
        this.isLoading = false;
      }
    },
    // 选择搜索结果
    selectSearchResult(result) {
      this.mapCenter.longitude = result.longitude;
      this.mapCenter.latitude = result.latitude;
      this.mapScale = 16;
      this.addMarker({
        id: Date.now(),
        longitude: result.longitude,
        latitude: result.latitude,
        title: result.title,
        iconPath: "/static/images/map/marker.png",
        width: 30,
        height: 30,
        callout: {
          content: result.title,
          color: "#ffffff",
          bgColor: "#1A9E8F",
          display: "ALWAYS"
        }
      });
      this.hideSearchModal();
      common_vendor.index.showToast({
        title: `已定位到${result.title}`,
        icon: "success"
      });
    },
    // 显示路线规划
    showRoute() {
      common_vendor.index.showToast({
        title: "路线规划功能开发中",
        icon: "none"
      });
    },
    // 添加标记点
    addMarker(marker) {
      this.markers.push(marker);
    },
    // 清除所有标记
    clearMarkers() {
      this.markers = this.markers.filter((marker) => marker.id === 0);
    },
    // 地图区域变化事件
    onRegionChange(e) {
      if (e.type === "end")
        ;
    },
    // 标记点点击事件
    onMarkerTap(e) {
      const markerId = e.markerId;
      const marker = this.markers.find((m) => m.id === markerId);
      if (marker) {
        common_vendor.index.showModal({
          title: marker.title,
          content: "您想对这个地点做什么？",
          showCancel: true,
          cancelText: "取消",
          confirmText: "设为目的地",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.showToast({
                title: "已设为目的地",
                icon: "success"
              });
            }
          }
        });
      }
    },
    // 地图点击事件
    onMapTap(e) {
      const { latitude, longitude } = e.detail;
      common_vendor.index.showModal({
        title: "添加标记",
        content: "是否在此位置添加标记？",
        showCancel: true,
        cancelText: "取消",
        confirmText: "添加",
        success: (res) => {
          if (res.confirm) {
            this.addMarker({
              id: Date.now(),
              longitude,
              latitude,
              title: "自定义标记",
              iconPath: "/static/images/map/marker.png",
              width: 30,
              height: 30
            });
            common_vendor.index.showToast({
              title: "标记添加成功",
              icon: "success"
            });
          }
        }
      });
    },
    // 隐藏搜索模态框
    hideSearchModal() {
      this.showSearchModal = false;
      this.searchKeyword = "";
      this.searchResults = [];
    },
    goBack() {
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.locateMe && $options.locateMe(...args)),
    b: common_vendor.o((...args) => $options.searchLocation && $options.searchLocation(...args)),
    c: common_vendor.o((...args) => $options.showRoute && $options.showRoute(...args)),
    d: $data.mapCenter.longitude,
    e: $data.mapCenter.latitude,
    f: $data.mapScale,
    g: $data.markers,
    h: $data.polyline,
    i: common_vendor.o((...args) => $options.onRegionChange && $options.onRegionChange(...args)),
    j: common_vendor.o((...args) => $options.onMarkerTap && $options.onMarkerTap(...args)),
    k: common_vendor.o((...args) => _ctx.onCalloutTap && _ctx.onCalloutTap(...args)),
    l: common_vendor.o((...args) => _ctx.onControlTap && _ctx.onControlTap(...args)),
    m: common_vendor.o((...args) => $options.onMapTap && $options.onMapTap(...args)),
    n: $data.isLoading
  }, $data.isLoading ? {} : {}, {
    o: $data.currentLocation.address
  }, $data.currentLocation.address ? {
    p: common_vendor.t($data.currentLocation.address),
    q: common_vendor.t($data.currentLocation.longitude.toFixed(6)),
    r: common_vendor.t($data.currentLocation.latitude.toFixed(6))
  } : {}, {
    s: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    t: $data.showSearchModal
  }, $data.showSearchModal ? {
    v: common_vendor.o((...args) => $options.hideSearchModal && $options.hideSearchModal(...args)),
    w: common_vendor.o((...args) => $options.performSearch && $options.performSearch(...args)),
    x: $data.searchKeyword,
    y: common_vendor.o(($event) => $data.searchKeyword = $event.detail.value),
    z: common_vendor.o((...args) => $options.performSearch && $options.performSearch(...args)),
    A: common_vendor.f($data.searchResults, (result, index, i0) => {
      return {
        a: common_vendor.t(result.title),
        b: common_vendor.t(result.address),
        c: index,
        d: common_vendor.o(($event) => $options.selectSearchResult(result), index)
      };
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/map/map.js.map
