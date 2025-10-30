"use strict";
const common_vendor = require("../../common/vendor.js");
const config_map_config = require("../../config/map.config.js");
const services_guideService = require("../../services/guideService.js");
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
      isMapLoading: false
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
        common_vendor.index.__f__("error", "at pages/create/create.vue:220", "定位失败:", error);
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
              common_vendor.index.__f__("error", "at pages/create/create.vue:276", "添加标记失败:", error);
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
      const draftData = {
        title: this.title,
        destination: this.destination,
        content: this.content,
        tags: this.tags,
        imagePath: this.imagePath,
        mapMarkers: this.markers,
        selectedLocation: this.selectedLocation,
        createTime: (/* @__PURE__ */ new Date()).toISOString(),
        status: "draft"
      };
      try {
        const guideData = {
          ...draftData,
          status: "draft",
          publishTime: null
        };
        const success = services_guideService.guideService.saveGuide(guideData);
        if (success) {
          common_vendor.index.showToast({
            title: "草稿保存成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.switchTab({
              url: "/pages/index/index"
            });
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
          try {
            common_vendor.index.removeStorageSync("guideDraft");
          } catch (e) {
            common_vendor.index.__f__("log", "at pages/create/create.vue:448", "清除草稿失败");
          }
          setTimeout(() => {
            common_vendor.index.switchTab({
              url: "/pages/index/index"
            });
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
    // 清空草稿数据（不再加载草稿）
    clearDraftData() {
      try {
        common_vendor.index.removeStorageSync("guideDraft");
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/create/create.vue:473", "清除草稿数据失败");
      }
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
    // 清空表单数据
    clearFormData() {
      this.title = "";
      this.destination = "";
      this.content = "";
      this.imagePath = "";
      this.tags = [];
      this.markers = [];
      this.selectedLocation = null;
      this.tagInput = "";
      this.mapCenter = {
        longitude: config_map_config.mapConfig.defaultCenter.longitude,
        latitude: config_map_config.mapConfig.defaultCenter.latitude
      };
      this.mapScale = config_map_config.mapConfig.zoomLevel;
    }
  },
  onLoad(options) {
    if (options.id && options.mode === "edit") {
      this.editMode = true;
      this.guideId = options.id;
      this.loadGuideData();
    } else {
      this.clearFormData();
      this.clearDraftData();
    }
  },
  onShow() {
    if (!this.editMode) {
      this.clearFormData();
      this.clearDraftData();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.onTitleInput && $options.onTitleInput(...args)),
    b: $data.title,
    c: common_vendor.o((...args) => $options.onDestinationInput && $options.onDestinationInput(...args)),
    d: $data.destination,
    e: common_vendor.o((...args) => $options.locateOnMap && $options.locateOnMap(...args)),
    f: common_vendor.o((...args) => $options.searchOnMap && $options.searchOnMap(...args)),
    g: common_vendor.o((...args) => $options.clearMarkers && $options.clearMarkers(...args)),
    h: $data.mapCenter.longitude,
    i: $data.mapCenter.latitude,
    j: $data.mapScale,
    k: $data.markers,
    l: common_vendor.o((...args) => $options.onMapTap && $options.onMapTap(...args)),
    m: common_vendor.o((...args) => $options.onMarkerTap && $options.onMarkerTap(...args)),
    n: $data.isMapLoading
  }, $data.isMapLoading ? {} : {}, {
    o: $data.selectedLocation
  }, $data.selectedLocation ? common_vendor.e({
    p: common_vendor.t($data.selectedLocation.longitude.toFixed(6)),
    q: common_vendor.t($data.selectedLocation.latitude.toFixed(6)),
    r: $data.selectedLocation.address
  }, $data.selectedLocation.address ? {
    s: common_vendor.t($data.selectedLocation.address)
  } : {}) : {}, {
    t: common_vendor.o((...args) => $options.onContentInput && $options.onContentInput(...args)),
    v: $data.content,
    w: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args)),
    x: $data.imagePath
  }, $data.imagePath ? {
    y: $data.imagePath,
    z: common_vendor.o((...args) => $options.removeImage && $options.removeImage(...args))
  } : {}, {
    A: common_vendor.o((...args) => $options.onTagInput && $options.onTagInput(...args)),
    B: $data.tagInput,
    C: common_vendor.o((...args) => $options.addTag && $options.addTag(...args)),
    D: common_vendor.f($data.tags, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: common_vendor.o(($event) => $options.removeTag(index), index),
        c: index
      };
    }),
    E: common_vendor.o((...args) => $options.saveDraft && $options.saveDraft(...args)),
    F: common_vendor.o((...args) => $options.publishGuide && $options.publishGuide(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/create/create.js.map
