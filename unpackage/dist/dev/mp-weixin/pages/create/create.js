"use strict";
const common_vendor = require("../../common/vendor.js");
const config_map_config = require("../../config/map.config.js");
const services_location_service = require("../../services/location.service.js");
const services_guideService = require("../../services/guideService.js");
const locationCoordinates = {
  "故宫博物院": { lat: 39.916327, lng: 116.397128 },
  "天安门广场": { lat: 39.905466, lng: 116.391543 },
  "前门大街": { lat: 39.904692, lng: 116.395935 },
  "颐和园": { lat: 39.998576, lng: 116.275596 },
  "国家体育场（鸟巢）": { lat: 39.990884, lng: 116.396565 },
  "国家游泳中心（水立方）": { lat: 39.991826, lng: 116.395425 },
  "南锣鼓巷": { lat: 39.946942, lng: 116.407045 },
  "什刹海": { lat: 39.942226, lng: 116.397128 },
  "798艺术区": { lat: 39.998879, lng: 116.497012 }
};
const _sfc_main = {
  data() {
    return {
      // 基本信息
      title: "请输入标题",
      subtitle: "",
      bannerImage: "/static/images/background/banner.jpg",
      // 编辑状态
      editingTitle: false,
      editingSubtitle: false,
      editingDayTitle: null,
      editingLocationName: null,
      editingLocationDesc: null,
      editingLocationTime: null,
      editingTransportTitle: null,
      editingTransportType: null,
      editingTransportDetail: null,
      editingTipsTitle: false,
      editingTipIndex: null,
      tipsTitle: "旅行小贴士",
      // 天数数据
      days: [
        {
          id: "day1",
          title: "第一天",
          expanded: true,
          locations: []
        }
      ],
      // 旅行小贴士
      tips: [
        "提前预约故宫、颐和园等热门景点门票，避免耽误行程",
        "建议购买北京交通一卡通，方便乘坐地铁和公交车",
        "根据季节准备衣物，春秋季早晚温差较大",
        "品尝北京特色美食：北京烤鸭、炸酱面、豆汁焦圈等"
      ],
      // 删除确认
      showDeleteConfirm: false,
      deleteMessage: "",
      deleteType: null,
      // 'day' or 'location'
      deleteDayIndex: null,
      deleteLocationDayIndex: null,
      deleteLocationIndex: null,
      deletingDayIndex: null,
      deletingLocationId: null,
      // 地图相关
      showMap: false,
      mapTitle: "北京三日游路线地图",
      mapCenter: {
        longitude: config_map_config.mapConfig.defaultCenter.longitude,
        latitude: config_map_config.mapConfig.defaultCenter.latitude
      },
      mapScale: 12,
      mapMarkers: [],
      mapPolyline: [],
      mapIncludePoints: [],
      // 包含所有标记点的区域，用于固定地图视图范围
      // 使用静态的中心点，不在响应式系统中更新
      staticMapLongitude: config_map_config.mapConfig.defaultCenter.longitude,
      staticMapLatitude: config_map_config.mapConfig.defaultCenter.latitude,
      staticMapScale: 12,
      isMapUpdating: false,
      // 标记地图是否正在更新，防止自动移动
      mapInitialized: false,
      // 标记地图是否已初始化，防止重复移动
      mapKey: 0,
      // 用于强制重新创建地图组件
      markersLocked: false,
      // 标记 markers 是否已锁定，锁定后不再更新
      regionChangeTimer: null,
      // regionchange 事件防抖定时器
      // 编辑模式
      editMode: false,
      guideId: ""
    };
  },
  methods: {
    // 编辑功能
    startEditTitle() {
      this.editingTitle = true;
    },
    saveTitle() {
      this.editingTitle = false;
    },
    startEditSubtitle() {
      this.editingSubtitle = true;
    },
    saveSubtitle() {
      this.editingSubtitle = false;
    },
    startEditDayTitle(dayIndex) {
      this.editingDayTitle = dayIndex;
    },
    saveDayTitle(dayIndex) {
      this.editingDayTitle = null;
    },
    startEditLocationName(dayIndex, locIndex) {
      this.editingLocationName = `${dayIndex}-${locIndex}`;
    },
    saveLocationName(dayIndex, locIndex) {
      this.editingLocationName = null;
    },
    startEditLocationDesc(dayIndex, locIndex) {
      this.editingLocationDesc = `${dayIndex}-${locIndex}`;
    },
    saveLocationDesc(dayIndex, locIndex) {
      this.editingLocationDesc = null;
    },
    startEditLocationTime(dayIndex, locIndex) {
      this.editingLocationTime = `${dayIndex}-${locIndex}`;
    },
    saveLocationTime(dayIndex, locIndex) {
      this.editingLocationTime = null;
    },
    startEditTransportTitle(dayIndex, locIndex) {
      this.editingTransportTitle = `${dayIndex}-${locIndex}`;
    },
    saveTransportTitle(dayIndex, locIndex) {
      this.editingTransportTitle = null;
    },
    startEditTransportType(dayIndex, locIndex, type) {
      this.editingTransportType = `${dayIndex}-${locIndex}-${type}`;
    },
    saveTransportType(dayIndex, locIndex, type) {
      this.editingTransportType = null;
    },
    startEditTransportDetail(dayIndex, locIndex, type) {
      this.editingTransportDetail = `${dayIndex}-${locIndex}-${type}`;
    },
    saveTransportDetail(dayIndex, locIndex, type) {
      this.editingTransportDetail = null;
    },
    startEditTipsTitle() {
      this.editingTipsTitle = true;
    },
    saveTipsTitle() {
      this.editingTipsTitle = false;
    },
    startEditTip(tipIndex) {
      this.editingTipIndex = tipIndex;
    },
    saveTip(tipIndex) {
      this.editingTipIndex = null;
    },
    // 天数管理
    toggleDay(dayIndex) {
      this.days[dayIndex].expanded = !this.days[dayIndex].expanded;
    },
    addNewDay() {
      const newDay = {
        id: `day${this.days.length + 1}`,
        title: `第${this.days.length + 1}天：行程`,
        expanded: true,
        locations: []
      };
      this.days.push(newDay);
    },
    showDeleteDayConfirm(dayIndex) {
      this.deleteType = "day";
      this.deleteDayIndex = dayIndex;
      this.deletingDayIndex = dayIndex;
      this.deleteMessage = "您确定要删除这一天的所有行程吗？";
      this.showDeleteConfirm = true;
    },
    // 地点管理
    toggleLocationDetails(dayIndex, locIndex) {
      this.days[dayIndex].locations[locIndex].showDetails = !this.days[dayIndex].locations[locIndex].showDetails;
    },
    addNewLocation(dayIndex) {
      const newLocation = {
        id: `loc${dayIndex + 1}-${this.days[dayIndex].locations.length + 1}`,
        name: "新地点",
        description: "请输入地点描述",
        time: "1-2小时",
        showDetails: false,
        subwayType: "地铁",
        subwayDetail: "请输入地铁线路",
        taxiType: "出租车",
        taxiDetail: "请输入出租车信息",
        transportTitle: "交通方式",
        coordinates: null
      };
      this.days[dayIndex].locations.push(newLocation);
    },
    showDeleteLocationConfirm(dayIndex, locIndex) {
      this.deleteType = "location";
      this.deleteLocationDayIndex = dayIndex;
      this.deleteLocationIndex = locIndex;
      this.deletingLocationId = this.days[dayIndex].locations[locIndex].id;
      this.deleteMessage = "您确定要删除这个地点吗？";
      this.showDeleteConfirm = true;
    },
    // 删除确认
    confirmDelete() {
      if (this.deleteType === "day") {
        this.days.splice(this.deleteDayIndex, 1);
        this.days.forEach((day, index) => {
          day.title = day.title.replace(/第\d+天/, `第${index + 1}天`);
        });
      } else if (this.deleteType === "location") {
        this.days[this.deleteLocationDayIndex].locations.splice(this.deleteLocationIndex, 1);
      }
      this.cancelDelete();
    },
    cancelDelete() {
      this.showDeleteConfirm = false;
      this.deleteType = null;
      this.deleteDayIndex = null;
      this.deleteLocationDayIndex = null;
      this.deleteLocationIndex = null;
      this.deletingDayIndex = null;
      this.deletingLocationId = null;
    },
    // 地图功能
    showMapView() {
      this.mapTitle = this.title || "旅行攻略地图";
      this.mapInitialized = false;
      this.markersLocked = false;
      this.isMapUpdating = true;
      this.mapMarkers = [];
      this.mapPolyline = [];
      this.mapIncludePoints = [];
      this.mapKey++;
      this.showMap = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.initMapMarkers();
        }, 300);
      });
    },
    closeMap() {
      this.showMap = false;
      if (this.regionChangeTimer) {
        clearTimeout(this.regionChangeTimer);
        this.regionChangeTimer = null;
      }
      this.isMapUpdating = false;
      this.mapInitialized = false;
      this.markersLocked = false;
      this.mapMarkers = [];
      this.mapPolyline = [];
      this.mapIncludePoints = [];
    },
    onMapUpdated() {
    },
    initMapMarkers() {
      let allPoints = [];
      let markerIdCounter = 0;
      const markersToAdd = [];
      this.days.forEach((day, dayIndex) => {
        day.locations.forEach((location, locIndex) => {
          if (location.coordinates && location.coordinates.lng && location.coordinates.lat) {
            const lng = Number(location.coordinates.lng);
            const lat = Number(location.coordinates.lat);
            if (!isNaN(lng) && !isNaN(lat) && Math.abs(lng) <= 180 && Math.abs(lat) <= 90) {
              const marker = {
                id: markerIdCounter++,
                // 使用数字ID
                longitude: lng,
                latitude: lat,
                title: location.name,
                iconPath: "/static/images/map/marker.png",
                width: 30,
                height: 30,
                callout: {
                  content: `${dayIndex + 1}-${location.name}`,
                  color: "#ffffff",
                  fontSize: 14,
                  borderRadius: 4,
                  bgColor: this.getDayColor(dayIndex),
                  padding: 8,
                  display: "ALWAYS",
                  textAlign: "center"
                }
              };
              markersToAdd.push(marker);
              const point = {
                longitude: lng,
                latitude: lat
              };
              allPoints.push(point);
            }
          }
        });
      });
      if (allPoints.length > 0 && !this.mapInitialized) {
        this.mapInitialized = true;
        let centerLng = 0;
        let centerLat = 0;
        allPoints.forEach((point) => {
          centerLng += Number(point.longitude);
          centerLat += Number(point.latitude);
        });
        const targetLng = centerLng / allPoints.length;
        const targetLat = centerLat / allPoints.length;
        if (isNaN(targetLng) || isNaN(targetLat) || Math.abs(targetLng) > 180 || Math.abs(targetLat) > 90) {
          common_vendor.index.__f__("error", "at pages/create/create.vue:717", "计算的地图中心点坐标无效");
          return;
        }
        const targetScale = allPoints.length === 1 ? 16 : allPoints.length <= 3 ? 14 : 12;
        this.staticMapLongitude = Number(targetLng.toFixed(6));
        this.staticMapLatitude = Number(targetLat.toFixed(6));
        this.staticMapScale = targetScale;
        this.isMapUpdating = true;
        this.$nextTick(() => {
          setTimeout(() => {
            this.mapMarkers = markersToAdd;
            if (allPoints.length > 1) {
              this.mapPolyline = [{
                points: allPoints,
                color: "#1A9E8F",
                width: 4,
                dottedLine: false
              }];
            }
            this.markersLocked = true;
            setTimeout(() => {
              this.isMapUpdating = false;
            }, 1e3);
          }, 300);
        });
      } else if (this.mapInitialized && this.markersLocked) {
        return;
      } else if (allPoints.length === 0) {
        common_vendor.index.showToast({
          title: "暂无有效地点坐标",
          icon: "none",
          duration: 2e3
        });
      }
    },
    getDayColor(dayIndex) {
      const colors = ["#165DFF", "#FF7D00", "#10B981", "#8B5CF6", "#EC4899"];
      return colors[dayIndex % colors.length];
    },
    async showLocationOnMap(dayIndex, locIndex) {
      const location = this.days[dayIndex].locations[locIndex];
      if (!location || !location.name || !location.name.trim()) {
        common_vendor.index.showToast({
          title: "地点名称不能为空",
          icon: "none"
        });
        return;
      }
      if (!location.coordinates) {
        common_vendor.index.showLoading({
          title: "正在定位..."
        });
        try {
          const coords = await services_location_service.locationService.getCoordinatesByName(location.name.trim());
          if (coords && coords.latitude && coords.longitude) {
            location.coordinates = {
              lat: coords.latitude,
              lng: coords.longitude
            };
          } else {
            throw new Error("获取坐标失败");
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/create/create.vue:802", "获取坐标失败:", error);
          if (locationCoordinates[location.name]) {
            location.coordinates = {
              lat: locationCoordinates[location.name].lat,
              lng: locationCoordinates[location.name].lng
            };
          } else {
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({
              title: "无法获取地点坐标，请检查地点名称",
              icon: "none",
              duration: 2e3
            });
            return;
          }
        }
        common_vendor.index.hideLoading();
      }
      if (!location.coordinates || !location.coordinates.lng || !location.coordinates.lat) {
        common_vendor.index.showToast({
          title: "地点坐标无效，无法显示地图",
          icon: "none",
          duration: 2e3
        });
        return;
      }
      const targetLng = Number(Number(location.coordinates.lng).toFixed(6));
      const targetLat = Number(Number(location.coordinates.lat).toFixed(6));
      if (isNaN(targetLng) || isNaN(targetLat) || Math.abs(targetLng) > 180 || Math.abs(targetLat) > 90) {
        common_vendor.index.showToast({
          title: "地点坐标超出有效范围",
          icon: "none",
          duration: 2e3
        });
        return;
      }
      this.mapTitle = this.title || "旅行攻略地图";
      this.mapInitialized = false;
      this.markersLocked = false;
      this.isMapUpdating = true;
      this.mapMarkers = [];
      this.mapPolyline = [];
      this.mapIncludePoints = [];
      this.staticMapLongitude = targetLng;
      this.staticMapLatitude = targetLat;
      this.staticMapScale = 16;
      this.mapKey++;
      this.showMap = true;
      const markerToAdd = {
        id: 0,
        // 使用数字ID
        longitude: targetLng,
        latitude: targetLat,
        title: location.name,
        iconPath: "/static/images/map/marker.png",
        width: 30,
        height: 30,
        callout: {
          content: location.name,
          color: "#ffffff",
          fontSize: 14,
          borderRadius: 4,
          bgColor: this.getDayColor(dayIndex),
          padding: 8,
          display: "ALWAYS",
          textAlign: "center"
        }
      };
      this.$nextTick(() => {
        setTimeout(() => {
          this.mapMarkers = [markerToAdd];
          this.mapPolyline = [];
          this.mapInitialized = true;
          this.markersLocked = true;
          setTimeout(() => {
            this.isMapUpdating = false;
          }, 1e3);
        }, 300);
      });
    },
    onMapMarkerTap(e) {
      const markerId = e.detail.markerId;
      const marker = this.mapMarkers.find((m) => m.id === markerId);
      if (marker) {
        common_vendor.index.showToast({
          title: marker.title,
          icon: "none"
        });
      }
    },
    onMapTap(e) {
    },
    onMapRegionChange(e) {
      if (this.isMapUpdating) {
        return;
      }
      if (this.markersLocked) {
        const causedBy = e.causedBy || "";
        const type = e.type || "";
        if (type === "end" && (causedBy === "drag" || causedBy === "scale" || causedBy === "gesture")) {
          return;
        }
        if (type === "begin" || type === "update") {
          if (causedBy !== "drag" && causedBy !== "scale" && causedBy !== "gesture") {
            return;
          }
        }
        return;
      }
      if (this.mapInitialized && !this.markersLocked) {
        const causedBy = e.causedBy || "";
        if (causedBy !== "drag" && causedBy !== "scale" && causedBy !== "gesture") {
          return;
        }
      }
    },
    // 更换背景图
    changeBannerImage() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          this.bannerImage = res.tempFilePaths[0];
        }
      });
    },
    // 保存攻略
    saveGuide() {
      const guideData = {
        title: this.title,
        subtitle: this.subtitle,
        bannerImage: this.bannerImage,
        days: this.days,
        tips: this.tips,
        tipsTitle: this.tipsTitle,
        status: "draft",
        createTime: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (this.editMode && this.guideId) {
        guideData.id = this.guideId;
      }
      const success = services_guideService.guideService.saveGuide(guideData);
      if (success) {
        common_vendor.index.showToast({
          title: "保存成功",
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
    },
    // 加载攻略数据
    loadGuideData() {
      const guide = services_guideService.guideService.getGuideById(this.guideId);
      if (guide) {
        this.title = guide.title || "北京三日游路线";
        this.subtitle = guide.subtitle || "探索首都精华景点，感受历史与现代交融";
        this.bannerImage = guide.bannerImage || "/static/images/background/banner.jpg";
        this.days = guide.days || this.days;
        this.tips = guide.tips || this.tips;
        this.tipsTitle = guide.tipsTitle || "旅行小贴士";
      }
    }
  },
  onLoad(options) {
    if (options.id && options.mode === "edit") {
      this.editMode = true;
      this.guideId = options.id;
      this.loadGuideData();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.showMapView && $options.showMapView(...args)),
    b: $data.bannerImage,
    c: common_vendor.o((...args) => $options.changeBannerImage && $options.changeBannerImage(...args)),
    d: !$data.editingTitle
  }, !$data.editingTitle ? {
    e: common_vendor.t($data.title || "北京三日游路线"),
    f: $data.editingTitle ? 1 : "",
    g: common_vendor.o((...args) => $options.startEditTitle && $options.startEditTitle(...args))
  } : {
    h: common_vendor.o((...args) => $options.saveTitle && $options.saveTitle(...args)),
    i: common_vendor.o((...args) => $options.saveTitle && $options.saveTitle(...args)),
    j: $data.editingTitle,
    k: $data.title,
    l: common_vendor.o(($event) => $data.title = $event.detail.value)
  }, {
    m: common_vendor.o((...args) => $options.addNewDay && $options.addNewDay(...args)),
    n: common_vendor.f($data.days, (day, dayIndex, i0) => {
      return common_vendor.e({
        a: common_vendor.t(dayIndex + 1),
        b: $data.deletingDayIndex === dayIndex ? 1 : "",
        c: common_vendor.o(($event) => $options.showDeleteDayConfirm(dayIndex), day.id),
        d: $data.editingDayTitle !== dayIndex
      }, $data.editingDayTitle !== dayIndex ? {
        e: common_vendor.t(day.title || `第${dayIndex + 1}天：行程`),
        f: $data.editingDayTitle === dayIndex ? 1 : "",
        g: common_vendor.o(($event) => $options.startEditDayTitle(dayIndex), day.id)
      } : {
        h: common_vendor.o(($event) => $options.saveDayTitle(dayIndex), day.id),
        i: common_vendor.o(($event) => $options.saveDayTitle(dayIndex), day.id),
        j: $data.editingDayTitle === dayIndex,
        k: day.title,
        l: common_vendor.o(($event) => day.title = $event.detail.value, day.id)
      }, {
        m: day.expanded ? 1 : "",
        n: common_vendor.o(($event) => $options.toggleDay(dayIndex), day.id),
        o: common_vendor.o(($event) => $options.addNewLocation(dayIndex), day.id),
        p: common_vendor.f(day.locations, (location, locIndex, i1) => {
          return common_vendor.e({
            a: $data.editingLocationName !== `${dayIndex}-${locIndex}`
          }, $data.editingLocationName !== `${dayIndex}-${locIndex}` ? {
            b: common_vendor.t(location.name || "新地点"),
            c: $data.editingLocationName === `${dayIndex}-${locIndex}` ? 1 : "",
            d: common_vendor.o(($event) => $options.startEditLocationName(dayIndex, locIndex), location.id)
          } : {
            e: common_vendor.o(($event) => $options.saveLocationName(dayIndex, locIndex), location.id),
            f: common_vendor.o(($event) => $options.saveLocationName(dayIndex, locIndex), location.id),
            g: $data.editingLocationName === `${dayIndex}-${locIndex}`,
            h: location.name,
            i: common_vendor.o(($event) => location.name = $event.detail.value, location.id)
          }, {
            j: $data.editingLocationDesc !== `${dayIndex}-${locIndex}`
          }, $data.editingLocationDesc !== `${dayIndex}-${locIndex}` ? {
            k: common_vendor.t(location.description || "请输入地点描述"),
            l: $data.editingLocationDesc === `${dayIndex}-${locIndex}` ? 1 : "",
            m: common_vendor.o(($event) => $options.startEditLocationDesc(dayIndex, locIndex), location.id)
          } : {
            n: common_vendor.o(($event) => $options.saveLocationDesc(dayIndex, locIndex), location.id),
            o: common_vendor.o(($event) => $options.saveLocationDesc(dayIndex, locIndex), location.id),
            p: $data.editingLocationDesc === `${dayIndex}-${locIndex}`,
            q: location.description,
            r: common_vendor.o(($event) => location.description = $event.detail.value, location.id)
          }, {
            s: $data.editingLocationTime !== `${dayIndex}-${locIndex}`
          }, $data.editingLocationTime !== `${dayIndex}-${locIndex}` ? {
            t: common_vendor.t(location.time || "1-2小时"),
            v: $data.editingLocationTime === `${dayIndex}-${locIndex}` ? 1 : "",
            w: common_vendor.o(($event) => $options.startEditLocationTime(dayIndex, locIndex), location.id)
          } : {
            x: common_vendor.o(($event) => $options.saveLocationTime(dayIndex, locIndex), location.id),
            y: common_vendor.o(($event) => $options.saveLocationTime(dayIndex, locIndex), location.id),
            z: $data.editingLocationTime === `${dayIndex}-${locIndex}`,
            A: location.time,
            B: common_vendor.o(($event) => location.time = $event.detail.value, location.id)
          }, {
            C: common_vendor.o(($event) => $options.showLocationOnMap(dayIndex, locIndex), location.id),
            D: $data.editingTransportTitle !== `${dayIndex}-${locIndex}`
          }, $data.editingTransportTitle !== `${dayIndex}-${locIndex}` ? {
            E: $data.editingTransportTitle === `${dayIndex}-${locIndex}` ? 1 : "",
            F: common_vendor.o(($event) => $options.startEditTransportTitle(dayIndex, locIndex), location.id)
          } : {
            G: common_vendor.o(($event) => $options.saveTransportTitle(dayIndex, locIndex), location.id),
            H: common_vendor.o(($event) => $options.saveTransportTitle(dayIndex, locIndex), location.id),
            I: $data.editingTransportTitle === `${dayIndex}-${locIndex}`,
            J: location.transportTitle,
            K: common_vendor.o(($event) => location.transportTitle = $event.detail.value, location.id)
          }, {
            L: $data.editingTransportType !== `${dayIndex}-${locIndex}-subway`
          }, $data.editingTransportType !== `${dayIndex}-${locIndex}-subway` ? {
            M: common_vendor.t(location.subwayType || "地铁"),
            N: $data.editingTransportType === `${dayIndex}-${locIndex}-subway` ? 1 : "",
            O: common_vendor.o(($event) => $options.startEditTransportType(dayIndex, locIndex, "subway"), location.id)
          } : {
            P: common_vendor.o(($event) => $options.saveTransportType(dayIndex, locIndex, "subway"), location.id),
            Q: common_vendor.o(($event) => $options.saveTransportType(dayIndex, locIndex, "subway"), location.id),
            R: $data.editingTransportType === `${dayIndex}-${locIndex}-subway`,
            S: location.subwayType,
            T: common_vendor.o(($event) => location.subwayType = $event.detail.value, location.id)
          }, {
            U: $data.editingTransportDetail !== `${dayIndex}-${locIndex}-subway`
          }, $data.editingTransportDetail !== `${dayIndex}-${locIndex}-subway` ? {
            V: common_vendor.t(location.subwayDetail || "请输入地铁线路"),
            W: $data.editingTransportDetail === `${dayIndex}-${locIndex}-subway` ? 1 : "",
            X: common_vendor.o(($event) => $options.startEditTransportDetail(dayIndex, locIndex, "subway"), location.id)
          } : {
            Y: common_vendor.o(($event) => $options.saveTransportDetail(dayIndex, locIndex, "subway"), location.id),
            Z: common_vendor.o(($event) => $options.saveTransportDetail(dayIndex, locIndex, "subway"), location.id),
            aa: $data.editingTransportDetail === `${dayIndex}-${locIndex}-subway`,
            ab: location.subwayDetail,
            ac: common_vendor.o(($event) => location.subwayDetail = $event.detail.value, location.id)
          }, {
            ad: $data.editingTransportType !== `${dayIndex}-${locIndex}-taxi`
          }, $data.editingTransportType !== `${dayIndex}-${locIndex}-taxi` ? {
            ae: common_vendor.t(location.taxiType || "出租车"),
            af: $data.editingTransportType === `${dayIndex}-${locIndex}-taxi` ? 1 : "",
            ag: common_vendor.o(($event) => $options.startEditTransportType(dayIndex, locIndex, "taxi"), location.id)
          } : {
            ah: common_vendor.o(($event) => $options.saveTransportType(dayIndex, locIndex, "taxi"), location.id),
            ai: common_vendor.o(($event) => $options.saveTransportType(dayIndex, locIndex, "taxi"), location.id),
            aj: $data.editingTransportType === `${dayIndex}-${locIndex}-taxi`,
            ak: location.taxiType,
            al: common_vendor.o(($event) => location.taxiType = $event.detail.value, location.id)
          }, {
            am: $data.editingTransportDetail !== `${dayIndex}-${locIndex}-taxi`
          }, $data.editingTransportDetail !== `${dayIndex}-${locIndex}-taxi` ? {
            an: common_vendor.t(location.taxiDetail || "请输入出租车信息"),
            ao: $data.editingTransportDetail === `${dayIndex}-${locIndex}-taxi` ? 1 : "",
            ap: common_vendor.o(($event) => $options.startEditTransportDetail(dayIndex, locIndex, "taxi"), location.id)
          } : {
            aq: common_vendor.o(($event) => $options.saveTransportDetail(dayIndex, locIndex, "taxi"), location.id),
            ar: common_vendor.o(($event) => $options.saveTransportDetail(dayIndex, locIndex, "taxi"), location.id),
            as: $data.editingTransportDetail === `${dayIndex}-${locIndex}-taxi`,
            at: location.taxiDetail,
            av: common_vendor.o(($event) => location.taxiDetail = $event.detail.value, location.id)
          }, {
            aw: location.showDetails,
            ax: location.id,
            ay: $data.deletingLocationId === location.id ? 1 : "",
            az: common_vendor.o(($event) => $options.toggleLocationDetails(dayIndex, locIndex), location.id),
            aA: common_vendor.o(($event) => $options.showDeleteLocationConfirm(dayIndex, locIndex), location.id)
          });
        }),
        q: day.expanded,
        r: day.id
      });
    }),
    o: !$data.editingTipsTitle
  }, !$data.editingTipsTitle ? {
    p: $data.editingTipsTitle ? 1 : "",
    q: common_vendor.o((...args) => $options.startEditTipsTitle && $options.startEditTipsTitle(...args))
  } : {
    r: common_vendor.o((...args) => $options.saveTipsTitle && $options.saveTipsTitle(...args)),
    s: common_vendor.o((...args) => $options.saveTipsTitle && $options.saveTipsTitle(...args)),
    t: $data.editingTipsTitle,
    v: $data.tipsTitle,
    w: common_vendor.o(($event) => $data.tipsTitle = $event.detail.value)
  }, {
    x: common_vendor.f($data.tips, (tip, tipIndex, i0) => {
      return common_vendor.e({
        a: $data.editingTipIndex !== tipIndex
      }, $data.editingTipIndex !== tipIndex ? {
        b: common_vendor.t(tip),
        c: $data.editingTipIndex === tipIndex ? 1 : "",
        d: common_vendor.o(($event) => $options.startEditTip(tipIndex), tipIndex)
      } : {
        e: common_vendor.o(($event) => $options.saveTip(tipIndex), tipIndex),
        f: common_vendor.o(($event) => $options.saveTip(tipIndex), tipIndex),
        g: $data.editingTipIndex === tipIndex,
        h: $data.tips[tipIndex],
        i: common_vendor.o(($event) => $data.tips[tipIndex] = $event.detail.value, tipIndex)
      }, {
        j: tipIndex
      });
    }),
    y: $data.showDeleteConfirm
  }, $data.showDeleteConfirm ? {
    z: common_vendor.o((...args) => $options.cancelDelete && $options.cancelDelete(...args))
  } : {}, {
    A: $data.showDeleteConfirm
  }, $data.showDeleteConfirm ? {
    B: common_vendor.t($data.deleteMessage),
    C: common_vendor.o((...args) => $options.cancelDelete && $options.cancelDelete(...args)),
    D: common_vendor.o((...args) => $options.confirmDelete && $options.confirmDelete(...args))
  } : {}, {
    E: $data.showMap
  }, $data.showMap ? common_vendor.e({
    F: common_vendor.o((...args) => $options.closeMap && $options.closeMap(...args)),
    G: common_vendor.t($data.mapTitle),
    H: common_vendor.o(() => {
    }),
    I: $data.showMap
  }, $data.showMap ? {
    J: `map-${$data.mapKey}`,
    K: $data.staticMapLongitude,
    L: $data.staticMapLatitude,
    M: $data.staticMapScale,
    N: $data.markersLocked ? $data.mapMarkers : [],
    O: $data.markersLocked ? $data.mapPolyline : [],
    P: common_vendor.o((...args) => $options.onMapMarkerTap && $options.onMapMarkerTap(...args)),
    Q: common_vendor.o((...args) => $options.onMapRegionChange && $options.onMapRegionChange(...args)),
    R: common_vendor.o((...args) => $options.onMapTap && $options.onMapTap(...args)),
    S: common_vendor.o((...args) => $options.onMapUpdated && $options.onMapUpdated(...args))
  } : {}, {
    T: common_vendor.o(() => {
    }),
    U: common_vendor.o((...args) => $options.closeMap && $options.closeMap(...args))
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-98f0e4ec"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/create/create.js.map
