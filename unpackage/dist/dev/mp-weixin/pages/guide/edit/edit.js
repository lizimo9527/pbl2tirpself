"use strict";
const common_vendor = require("../../../common/vendor.js");
const config_map_config = require("../../../config/map.config.js");
const services_guideService = require("../../../services/guideService.js");
const _sfc_main = {
  data() {
    return {
      title: "",
      destination: "",
      content: "",
      imagePath: "",
      tagInput: "",
      tags: [],
      // 编辑模式相关
      editMode: false,
      guideId: "",
      // 地图相关数据
      mapCenter: {
        longitude: config_map_config.mapConfig.defaultCenter.longitude,
        latitude: config_map_config.mapConfig.defaultCenter.latitude
      },
      mapScale: config_map_config.mapConfig.zoomLevel,
      markers: [],
      selectedLocation: null,
      isMapLoading: false,
      // 折线相关数据
      polyline: []
    };
  },
  methods: {
    onTitleInput(e) {
      this.title = e.detail.value;
    },
    onDestinationInput(e) {
      this.destination = e.detail.value;
    },
    onContentInput(e) {
      this.content = e.detail.value;
    },
    onTagInput(e) {
      this.tagInput = e.detail.value;
    },
    addTag() {
      const tag = this.tagInput.trim();
      if (tag && this.tags.length < 5) {
        this.tags = [...this.tags, tag];
        this.tagInput = "";
      }
    },
    removeTag(index) {
      const newTags = [...this.tags];
      newTags.splice(index, 1);
      this.tags = newTags;
    },
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          this.imagePath = res.tempFilePaths[0];
        }
      });
    },
    removeImage() {
      this.imagePath = "";
    },
    // 地图相关方法
    async locateOnMap() {
      if (!this.destination.trim()) {
        common_vendor.index.showToast({
          title: "请先输入目的地",
          icon: "none"
        });
        return;
      }
      this.isMapLoading = true;
      common_vendor.index.showLoading({
        title: "正在定位..."
      });
      try {
        const result = await config_map_config.mapUtils.geocode(this.destination);
        if (result && result.location) {
          this.selectedLocation = {
            longitude: result.location.lng,
            latitude: result.location.lat,
            address: result.address
          };
          this.mapCenter.longitude = result.location.lng;
          this.mapCenter.latitude = result.location.lat;
          this.mapScale = 16;
          this.addMarker({
            id: Date.now(),
            longitude: result.location.lng,
            latitude: result.location.lat,
            title: this.destination,
            iconPath: "/static/images/map/marker.png",
            width: 30,
            height: 30,
            callout: {
              content: this.destination,
              color: "#ffffff",
              bgColor: "#1A9E8F",
              display: "ALWAYS"
            }
          });
          common_vendor.index.showToast({
            title: "定位成功",
            icon: "success"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/guide/edit/edit.vue:224", "定位失败:", error);
        common_vendor.index.showToast({
          title: "定位失败，请检查地址是否正确",
          icon: "none"
        });
      } finally {
        this.isMapLoading = false;
        common_vendor.index.hideLoading();
      }
    },
    searchOnMap() {
      common_vendor.index.showToast({
        title: "请在地图上点击添加标记",
        icon: "none"
      });
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
        success: async (res) => {
          if (res.confirm) {
            try {
              const addressInfo = await config_map_config.mapUtils.reverseGeocode(latitude, longitude);
              this.addMarker({
                id: Date.now(),
                longitude,
                latitude,
                title: addressInfo.address || "自定义标记",
                iconPath: "/static/images/map/marker.png",
                width: 30,
                height: 30
              });
              this.selectedLocation = {
                longitude,
                latitude,
                address: addressInfo.address
              };
              common_vendor.index.showToast({
                title: "标记添加成功",
                icon: "success"
              });
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/guide/edit/edit.vue:280", "添加标记失败:", error);
              common_vendor.index.showToast({
                title: "标记添加失败",
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
              this.destination = marker.title;
              common_vendor.index.showToast({
                title: "已设为目的地",
                icon: "success"
              });
            }
          }
        });
      }
    },
    // 添加标记
    addMarker(marker) {
      this.markers.push(marker);
      this.updatePolyline();
    },
    // 自动添加多个地图标记（用于AI生成的攻略）
    autoAddMarkers(markerList) {
      if (!markerList || markerList.length === 0)
        return;
      this.markers = [];
      markerList.forEach((markerInfo, index) => {
        this.addMarker({
          id: Date.now() + index,
          longitude: markerInfo.longitude,
          latitude: markerInfo.latitude,
          title: markerInfo.name,
          iconPath: "/static/images/map/marker.png",
          width: 30,
          height: 30,
          callout: {
            content: markerInfo.name,
            color: "#ffffff",
            bgColor: "#1A9E8F",
            display: "ALWAYS"
          }
        });
      });
      if (markerList.length > 0) {
        this.mapCenter.longitude = markerList[0].longitude;
        this.mapCenter.latitude = markerList[0].latitude;
        this.mapScale = 10;
      }
      common_vendor.index.showToast({
        title: `已自动添加${markerList.length}个地点标记`,
        icon: "success"
      });
    },
    // 更新折线连接
    updatePolyline() {
      if (this.markers.length < 2) {
        this.polyline = [];
        return;
      }
      const points = this.markers.map((marker) => ({
        longitude: marker.longitude,
        latitude: marker.latitude
      }));
      this.polyline = [{
        points,
        color: "#1A9E8F",
        width: 4,
        arrowLine: true,
        borderWidth: 2,
        borderColor: "#FFFFFF"
      }];
    },
    clearMarkers() {
      if (this.markers.length === 0) {
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
            this.markers = [];
            this.selectedLocation = null;
            this.polyline = [];
            common_vendor.index.showToast({
              title: "标记已清除",
              icon: "success"
            });
          }
        }
      });
    },
    saveDraft() {
      if (!this.title.trim()) {
        common_vendor.index.showToast({
          title: "请输入攻略标题",
          icon: "none"
        });
        return;
      }
      const guideData = {
        title: this.title,
        destination: this.destination,
        content: this.content,
        tags: this.tags,
        imagePath: this.imagePath,
        mapMarkers: this.markers,
        selectedLocation: this.selectedLocation,
        status: "draft"
      };
      if (this.editMode && this.guideId) {
        guideData.id = this.guideId;
      }
      try {
        const success = services_guideService.guideService.saveGuide(guideData);
        if (success) {
          common_vendor.index.showToast({
            title: "草稿保存成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        } else {
          common_vendor.index.showToast({
            title: "保存失败",
            icon: "none"
          });
        }
      } catch (e) {
        common_vendor.index.showToast({
          title: "保存失败",
          icon: "none"
        });
      }
    },
    publishGuide() {
      if (!this.title.trim()) {
        common_vendor.index.showToast({
          title: "请输入攻略标题",
          icon: "none"
        });
        return;
      }
      if (!this.content.trim()) {
        common_vendor.index.showToast({
          title: "请输入攻略内容",
          icon: "none"
        });
        return;
      }
      const guideData = {
        title: this.title,
        destination: this.destination,
        content: this.content,
        tags: this.tags,
        imagePath: this.imagePath,
        mapMarkers: this.markers,
        selectedLocation: this.selectedLocation,
        publishTime: (/* @__PURE__ */ new Date()).toISOString(),
        status: "published",
        author: "default"
      };
      if (this.editMode && this.guideId) {
        guideData.id = this.guideId;
      }
      common_vendor.index.showLoading({
        title: this.editMode ? "更新中..." : "发布中..."
      });
      setTimeout(() => {
        const success = services_guideService.guideService.saveGuide(guideData);
        if (success) {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: this.editMode ? "更新成功" : "发布成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        } else {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: this.editMode ? "更新失败" : "发布失败",
            icon: "none"
          });
        }
      }, 1e3);
    },
    // 加载攻略数据（编辑模式）
    loadGuideData() {
      const guide = services_guideService.guideService.getGuideById(this.guideId);
      if (guide) {
        this.title = guide.title || "";
        this.destination = guide.destination || "";
        this.content = guide.content || "";
        this.tags = guide.tags || [];
        this.imagePath = guide.imagePath || "";
        this.markers = guide.mapMarkers || [];
        this.selectedLocation = guide.selectedLocation || null;
        if (this.selectedLocation) {
          this.mapCenter.longitude = this.selectedLocation.longitude;
          this.mapCenter.latitude = this.selectedLocation.latitude;
          this.mapScale = 14;
        }
      }
    },
    goBack() {
      common_vendor.index.navigateBack();
    }
  },
  onLoad(options) {
    if (options.id) {
      this.editMode = true;
      this.guideId = options.id;
      this.loadGuideData();
    } else {
      this.title = "";
      this.destination = "";
      this.content = "";
      this.imagePath = "";
      this.tags = [];
      this.markers = [];
      this.selectedLocation = null;
      this.editMode = false;
      this.guideId = "";
      if (options.aiData) {
        try {
          const aiData = JSON.parse(decodeURIComponent(options.aiData));
          if (aiData.title) {
            this.title = aiData.title;
          }
          if (aiData.content) {
            this.content = aiData.content;
          }
          if (aiData.destinationData) {
            this.destination = aiData.destinationData.destination;
            this.autoAddMarkers(aiData.destinationData.markers);
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/guide/edit/edit.vue:583", "解析AI数据失败:", error);
        }
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.saveDraft && $options.saveDraft(...args)),
    b: common_vendor.o((...args) => $options.publishGuide && $options.publishGuide(...args)),
    c: common_vendor.o((...args) => $options.onTitleInput && $options.onTitleInput(...args)),
    d: $data.title,
    e: common_vendor.o((...args) => $options.onDestinationInput && $options.onDestinationInput(...args)),
    f: $data.destination,
    g: common_vendor.o((...args) => $options.locateOnMap && $options.locateOnMap(...args)),
    h: common_vendor.o((...args) => $options.searchOnMap && $options.searchOnMap(...args)),
    i: common_vendor.o((...args) => $options.clearMarkers && $options.clearMarkers(...args)),
    j: $data.mapCenter.longitude,
    k: $data.mapCenter.latitude,
    l: $data.mapScale,
    m: $data.markers,
    n: $data.polyline,
    o: common_vendor.o((...args) => $options.onMapTap && $options.onMapTap(...args)),
    p: common_vendor.o((...args) => $options.onMarkerTap && $options.onMarkerTap(...args)),
    q: $data.isMapLoading
  }, $data.isMapLoading ? {} : {}, {
    r: $data.selectedLocation
  }, $data.selectedLocation ? common_vendor.e({
    s: common_vendor.t($data.selectedLocation.longitude.toFixed(6)),
    t: common_vendor.t($data.selectedLocation.latitude.toFixed(6)),
    v: $data.selectedLocation.address
  }, $data.selectedLocation.address ? {
    w: common_vendor.t($data.selectedLocation.address)
  } : {}) : {}, {
    x: common_vendor.o((...args) => $options.onContentInput && $options.onContentInput(...args)),
    y: $data.content,
    z: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args)),
    A: $data.imagePath
  }, $data.imagePath ? {
    B: $data.imagePath,
    C: common_vendor.o((...args) => $options.removeImage && $options.removeImage(...args))
  } : {}, {
    D: common_vendor.o((...args) => $options.onTagInput && $options.onTagInput(...args)),
    E: $data.tagInput,
    F: common_vendor.o((...args) => $options.addTag && $options.addTag(...args)),
    G: common_vendor.f($data.tags, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: common_vendor.o(($event) => $options.removeTag(index), index),
        c: index
      };
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/guide/edit/edit.js.map
