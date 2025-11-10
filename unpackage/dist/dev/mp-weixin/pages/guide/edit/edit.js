"use strict";
const common_vendor = require("../../../common/vendor.js");
const services_location_service = require("../../../services/location.service.js");
const config_map_config = require("../../../config/map.config.js");
const _sfc_main = {
  data() {
    return {
      templateData: null,
      showMapModal: false,
      mapMarkers: [],
      mapPolyline: [],
      // 编辑状态
      editingTitle: false,
      editingSubtitle: false,
      editingDayTitle: null,
      editingLocationName: null,
      editingLocationDesc: null,
      editingLocationTime: null,
      editingTransportType: null,
      editingTransportRoute: null,
      editingLocationDetails: null,
      editingTipIndex: null,
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
      // 全屏地图
      showFullMap: false,
      currentLocationName: "",
      staticMapLongitude: config_map_config.mapConfig.defaultCenter.longitude,
      staticMapLatitude: config_map_config.mapConfig.defaultCenter.latitude,
      staticMapScale: 16,
      fullMapMarkers: [],
      mapKey: 0,
      markersLocked: false,
      isMapUpdating: false,
      mapInitialized: false
    };
  },
  onLoad(options) {
    if (options.templateData) {
      try {
        const decodedData = decodeURIComponent(options.templateData);
        this.templateData = JSON.parse(decodedData);
        this.initTemplateData();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/guide/edit/edit.vue:426", "解析模板数据失败:", error);
        common_vendor.index.showToast({
          title: "加载模板失败",
          icon: "none"
        });
      }
    }
  },
  methods: {
    initTemplateData() {
      if (!this.templateData)
        return;
      if (this.templateData.days) {
        this.templateData.days.forEach((day, index) => {
          if (typeof day.expanded === "undefined") {
            this.$set(day, "expanded", index === 0);
          }
          if (day.locations) {
            day.locations.forEach((location, locIndex) => {
              if (typeof location.showDetails === "undefined") {
                this.$set(location, "showDetails", false);
              }
              if (location.description && !location.desc) {
                this.$set(location, "desc", location.description);
              }
              if (!location.coordinates && this.templateData.mapMarkers) {
                const marker = this.templateData.mapMarkers.find((m) => m.title === location.name);
                if (marker) {
                  location.coordinates = {
                    lat: marker.latitude,
                    lng: marker.longitude
                  };
                }
              }
            });
          }
        });
      }
      if (this.templateData.mapMarkers) {
        this.mapMarkers = this.templateData.mapMarkers.map((marker, index) => ({
          id: index + 1,
          longitude: marker.longitude,
          latitude: marker.latitude,
          title: marker.title,
          iconPath: "/static/images/map/marker.png",
          width: 30,
          height: 30
        }));
      }
      if (this.templateData.mapPolyline) {
        this.mapPolyline = this.templateData.mapPolyline;
      }
    },
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
    startEditTransportType(dayIndex, locIndex, transIndex) {
      this.editingTransportType = `${dayIndex}-${locIndex}-${transIndex}`;
    },
    saveTransportType(dayIndex, locIndex, transIndex) {
      this.editingTransportType = null;
    },
    startEditTransportRoute(dayIndex, locIndex, transIndex) {
      this.editingTransportRoute = `${dayIndex}-${locIndex}-${transIndex}`;
    },
    saveTransportRoute(dayIndex, locIndex, transIndex) {
      this.editingTransportRoute = null;
    },
    startEditLocationDetails(dayIndex, locIndex) {
      this.editingLocationDetails = `${dayIndex}-${locIndex}`;
    },
    saveLocationDetails(dayIndex, locIndex) {
      this.editingLocationDetails = null;
    },
    startEditTip(tipIndex) {
      this.editingTipIndex = tipIndex;
    },
    saveTip(tipIndex) {
      this.editingTipIndex = null;
    },
    // 天数管理
    toggleDay(dayIndex) {
      if (this.templateData.days[dayIndex]) {
        this.$set(this.templateData.days[dayIndex], "expanded", !this.templateData.days[dayIndex].expanded);
      }
    },
    addNewDay() {
      if (!this.templateData.days) {
        this.templateData.days = [];
      }
      const newDay = {
        day: this.templateData.days.length + 1,
        title: `第${this.templateData.days.length + 1}天：行程`,
        expanded: true,
        locations: []
      };
      this.templateData.days.push(newDay);
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
      const location = this.templateData.days[dayIndex].locations[locIndex];
      if (location) {
        this.$set(location, "showDetails", !location.showDetails);
      }
    },
    addNewLocation(dayIndex) {
      if (!this.templateData.days[dayIndex].locations) {
        this.templateData.days[dayIndex].locations = [];
      }
      const newLocation = {
        name: "新地点",
        desc: "请输入地点描述",
        time: "1-2小时",
        showDetails: false,
        transport: [
          { type: "🚇", route: "请输入地铁线路" },
          { type: "🚕", route: "请输入出租车信息" }
        ],
        details: "",
        coordinates: null
      };
      this.templateData.days[dayIndex].locations.push(newLocation);
    },
    showDeleteLocationConfirm(dayIndex, locIndex) {
      this.deleteType = "location";
      this.deleteLocationDayIndex = dayIndex;
      this.deleteLocationIndex = locIndex;
      this.deletingLocationId = `${dayIndex}-${locIndex}`;
      this.deleteMessage = "您确定要删除这个地点吗？";
      this.showDeleteConfirm = true;
    },
    // 删除确认
    confirmDelete() {
      if (this.deleteType === "day") {
        this.templateData.days.splice(this.deleteDayIndex, 1);
        this.templateData.days.forEach((day, index) => {
          day.day = index + 1;
          day.title = day.title.replace(/第\d+天/, `第${index + 1}天`);
        });
        this.initTemplateData();
      } else if (this.deleteType === "location") {
        this.templateData.days[this.deleteLocationDayIndex].locations.splice(this.deleteLocationIndex, 1);
      }
      this.cancelDelete();
      this.updateMapMarkers();
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
    showMap() {
      this.updateMapMarkers();
      this.showMapModal = true;
    },
    closeMap() {
      this.showMapModal = false;
    },
    updateMapMarkers() {
      this.mapMarkers = [];
      this.mapPolyline = [];
      if (this.templateData && this.templateData.days) {
        const allPoints = [];
        let markerId = 0;
        this.templateData.days.forEach((day, dayIndex) => {
          if (day.locations) {
            day.locations.forEach((location, locIndex) => {
              if (location.coordinates && location.coordinates.lng && location.coordinates.lat) {
                const marker = {
                  id: markerId++,
                  longitude: location.coordinates.lng,
                  latitude: location.coordinates.lat,
                  title: location.name,
                  iconPath: "/static/images/map/marker.png",
                  width: 30,
                  height: 30
                };
                this.mapMarkers.push(marker);
                allPoints.push({
                  longitude: location.coordinates.lng,
                  latitude: location.coordinates.lat
                });
              }
            });
          }
        });
        if (allPoints.length > 1) {
          this.mapPolyline = [{
            points: allPoints,
            color: "#165DFF",
            width: 6,
            dottedLine: false
          }];
        }
      }
    },
    // 地点定位
    async showLocationOnMap(dayIndex, locIndex) {
      const location = this.templateData.days[dayIndex].locations[locIndex];
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
          common_vendor.index.__f__("error", "at pages/guide/edit/edit.vue:717", "获取坐标失败:", error);
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "无法获取地点坐标，请检查地点名称",
            icon: "none",
            duration: 2e3
          });
          return;
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
      this.currentLocationName = location.name;
      this.staticMapLongitude = Number(Number(location.coordinates.lng).toFixed(6));
      this.staticMapLatitude = Number(Number(location.coordinates.lat).toFixed(6));
      this.staticMapScale = 16;
      this.mapInitialized = false;
      this.markersLocked = false;
      this.isMapUpdating = true;
      this.mapKey++;
      this.showFullMap = true;
      const markerToAdd = {
        id: 0,
        longitude: this.staticMapLongitude,
        latitude: this.staticMapLatitude,
        title: location.name,
        iconPath: "/static/images/map/marker.png",
        width: 30,
        height: 30,
        callout: {
          content: location.name,
          color: "#ffffff",
          fontSize: 14,
          borderRadius: 4,
          bgColor: "#165DFF",
          padding: 8,
          display: "ALWAYS",
          textAlign: "center"
        }
      };
      this.$nextTick(() => {
        setTimeout(() => {
          this.fullMapMarkers = [markerToAdd];
          this.mapInitialized = true;
          this.markersLocked = true;
          setTimeout(() => {
            this.isMapUpdating = false;
          }, 1e3);
        }, 300);
      });
    },
    closeFullMap() {
      this.showFullMap = false;
      this.isMapUpdating = false;
      this.mapInitialized = false;
      this.markersLocked = false;
      this.fullMapMarkers = [];
    },
    onMapMarkerTap(e) {
      const markerId = e.detail.markerId;
      const marker = this.fullMapMarkers.find((m) => m.id === markerId);
      if (marker) {
        common_vendor.index.showToast({
          title: marker.title,
          icon: "none"
        });
      }
    },
    onMapTap(e) {
    },
    onMapUpdated() {
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
    },
    // 更换背景图
    changeBannerImage() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          this.templateData.image = res.tempFilePaths[0];
        }
      });
    },
    // 返回
    goBack() {
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.t($data.templateData ? $data.templateData.title : "编辑攻略"),
    c: common_vendor.o((...args) => $options.showMap && $options.showMap(...args)),
    d: $data.templateData
  }, $data.templateData ? common_vendor.e({
    e: $data.templateData.image,
    f: common_vendor.o((...args) => $options.changeBannerImage && $options.changeBannerImage(...args)),
    g: !$data.editingTitle
  }, !$data.editingTitle ? {
    h: common_vendor.t($data.templateData.title),
    i: $data.editingTitle ? 1 : "",
    j: common_vendor.o((...args) => $options.startEditTitle && $options.startEditTitle(...args))
  } : {
    k: common_vendor.o((...args) => $options.saveTitle && $options.saveTitle(...args)),
    l: common_vendor.o((...args) => $options.saveTitle && $options.saveTitle(...args)),
    m: $data.editingTitle,
    n: $data.templateData.title,
    o: common_vendor.o(($event) => $data.templateData.title = $event.detail.value)
  }, {
    p: !$data.editingSubtitle
  }, !$data.editingSubtitle ? {
    q: common_vendor.t($data.templateData.subtitle),
    r: $data.editingSubtitle ? 1 : "",
    s: common_vendor.o((...args) => $options.startEditSubtitle && $options.startEditSubtitle(...args))
  } : {
    t: common_vendor.o((...args) => $options.saveSubtitle && $options.saveSubtitle(...args)),
    v: common_vendor.o((...args) => $options.saveSubtitle && $options.saveSubtitle(...args)),
    w: $data.editingSubtitle,
    x: $data.templateData.subtitle,
    y: common_vendor.o(($event) => $data.templateData.subtitle = $event.detail.value)
  }, {
    z: common_vendor.o((...args) => $options.addNewDay && $options.addNewDay(...args)),
    A: common_vendor.f($data.templateData.days, (day, dayIndex, i0) => {
      return common_vendor.e({
        a: common_vendor.t(day.day || dayIndex + 1),
        b: $data.deletingDayIndex === dayIndex ? 1 : "",
        c: common_vendor.o(($event) => $options.showDeleteDayConfirm(dayIndex), dayIndex),
        d: $data.editingDayTitle !== dayIndex
      }, $data.editingDayTitle !== dayIndex ? {
        e: common_vendor.t(day.title || `第${dayIndex + 1}天：行程`),
        f: $data.editingDayTitle === dayIndex ? 1 : "",
        g: common_vendor.o(($event) => $options.startEditDayTitle(dayIndex), dayIndex)
      } : {
        h: common_vendor.o(($event) => $options.saveDayTitle(dayIndex), dayIndex),
        i: common_vendor.o(($event) => $options.saveDayTitle(dayIndex), dayIndex),
        j: $data.editingDayTitle === dayIndex,
        k: day.title,
        l: common_vendor.o(($event) => day.title = $event.detail.value, dayIndex)
      }, {
        m: day.expanded ? 1 : "",
        n: common_vendor.o(($event) => $options.toggleDay(dayIndex), dayIndex),
        o: common_vendor.o(($event) => $options.addNewLocation(dayIndex), dayIndex),
        p: common_vendor.f(day.locations, (location, locIndex, i1) => {
          return common_vendor.e({
            a: $data.editingLocationName !== `${dayIndex}-${locIndex}`
          }, $data.editingLocationName !== `${dayIndex}-${locIndex}` ? {
            b: common_vendor.t(location.name || "新地点"),
            c: $data.editingLocationName === `${dayIndex}-${locIndex}` ? 1 : "",
            d: common_vendor.o(($event) => $options.startEditLocationName(dayIndex, locIndex), locIndex)
          } : {
            e: common_vendor.o(($event) => $options.saveLocationName(dayIndex, locIndex), locIndex),
            f: common_vendor.o(($event) => $options.saveLocationName(dayIndex, locIndex), locIndex),
            g: $data.editingLocationName === `${dayIndex}-${locIndex}`,
            h: location.name,
            i: common_vendor.o(($event) => location.name = $event.detail.value, locIndex)
          }, {
            j: $data.editingLocationDesc !== `${dayIndex}-${locIndex}`
          }, $data.editingLocationDesc !== `${dayIndex}-${locIndex}` ? {
            k: common_vendor.t(location.desc || location.description || "请输入地点描述"),
            l: $data.editingLocationDesc === `${dayIndex}-${locIndex}` ? 1 : "",
            m: common_vendor.o(($event) => $options.startEditLocationDesc(dayIndex, locIndex), locIndex)
          } : {
            n: common_vendor.o(($event) => $options.saveLocationDesc(dayIndex, locIndex), locIndex),
            o: common_vendor.o(($event) => $options.saveLocationDesc(dayIndex, locIndex), locIndex),
            p: $data.editingLocationDesc === `${dayIndex}-${locIndex}`,
            q: location.desc,
            r: common_vendor.o(($event) => location.desc = $event.detail.value, locIndex)
          }, {
            s: $data.editingLocationTime !== `${dayIndex}-${locIndex}`
          }, $data.editingLocationTime !== `${dayIndex}-${locIndex}` ? {
            t: common_vendor.t(location.time || "1-2小时"),
            v: $data.editingLocationTime === `${dayIndex}-${locIndex}` ? 1 : "",
            w: common_vendor.o(($event) => $options.startEditLocationTime(dayIndex, locIndex), locIndex)
          } : {
            x: common_vendor.o(($event) => $options.saveLocationTime(dayIndex, locIndex), locIndex),
            y: common_vendor.o(($event) => $options.saveLocationTime(dayIndex, locIndex), locIndex),
            z: $data.editingLocationTime === `${dayIndex}-${locIndex}`,
            A: location.time,
            B: common_vendor.o(($event) => location.time = $event.detail.value, locIndex)
          }, {
            C: common_vendor.o(($event) => $options.showLocationOnMap(dayIndex, locIndex), locIndex),
            D: common_vendor.f(location.transport, (transport, transIndex, i2) => {
              return common_vendor.e({
                a: common_vendor.t(transport.type),
                b: $data.editingTransportType !== `${dayIndex}-${locIndex}-${transIndex}`
              }, $data.editingTransportType !== `${dayIndex}-${locIndex}-${transIndex}` ? {
                c: common_vendor.t(transport.type === "🚇" ? "地铁" : transport.type === "🚕" ? "出租车" : transport.type === "🚌" ? "公交" : "其他"),
                d: $data.editingTransportType === `${dayIndex}-${locIndex}-${transIndex}` ? 1 : "",
                e: common_vendor.o(($event) => $options.startEditTransportType(dayIndex, locIndex, transIndex), transIndex)
              } : {
                f: common_vendor.o(($event) => $options.saveTransportType(dayIndex, locIndex, transIndex), transIndex),
                g: common_vendor.o(($event) => $options.saveTransportType(dayIndex, locIndex, transIndex), transIndex),
                h: $data.editingTransportType === `${dayIndex}-${locIndex}-${transIndex}`,
                i: transport.type,
                j: common_vendor.o(($event) => transport.type = $event.detail.value, transIndex)
              }, {
                k: $data.editingTransportRoute !== `${dayIndex}-${locIndex}-${transIndex}`
              }, $data.editingTransportRoute !== `${dayIndex}-${locIndex}-${transIndex}` ? {
                l: common_vendor.t(transport.route),
                m: $data.editingTransportRoute === `${dayIndex}-${locIndex}-${transIndex}` ? 1 : "",
                n: common_vendor.o(($event) => $options.startEditTransportRoute(dayIndex, locIndex, transIndex), transIndex)
              } : {
                o: common_vendor.o(($event) => $options.saveTransportRoute(dayIndex, locIndex, transIndex), transIndex),
                p: common_vendor.o(($event) => $options.saveTransportRoute(dayIndex, locIndex, transIndex), transIndex),
                q: $data.editingTransportRoute === `${dayIndex}-${locIndex}-${transIndex}`,
                r: transport.route,
                s: common_vendor.o(($event) => transport.route = $event.detail.value, transIndex)
              }, {
                t: transIndex
              });
            }),
            E: location.details
          }, location.details ? common_vendor.e({
            F: $data.editingLocationDetails !== `${dayIndex}-${locIndex}`
          }, $data.editingLocationDetails !== `${dayIndex}-${locIndex}` ? {
            G: common_vendor.t(location.details),
            H: $data.editingLocationDetails === `${dayIndex}-${locIndex}` ? 1 : "",
            I: common_vendor.o(($event) => $options.startEditLocationDetails(dayIndex, locIndex), locIndex)
          } : {
            J: common_vendor.o(($event) => $options.saveLocationDetails(dayIndex, locIndex), locIndex),
            K: $data.editingLocationDetails === `${dayIndex}-${locIndex}`,
            L: location.details,
            M: common_vendor.o(($event) => location.details = $event.detail.value, locIndex)
          }) : {}, {
            N: location.showDetails,
            O: locIndex,
            P: $data.deletingLocationId === `${dayIndex}-${locIndex}` ? 1 : "",
            Q: common_vendor.o(($event) => $options.toggleLocationDetails(dayIndex, locIndex), locIndex),
            R: common_vendor.o(($event) => $options.showDeleteLocationConfirm(dayIndex, locIndex), locIndex)
          });
        }),
        q: day.expanded,
        r: dayIndex
      });
    }),
    B: $data.templateData.tips && $data.templateData.tips.length > 0
  }, $data.templateData.tips && $data.templateData.tips.length > 0 ? {
    C: common_vendor.f($data.templateData.tips, (tip, tipIndex, i0) => {
      return common_vendor.e({
        a: common_vendor.t(tipIndex === 0 ? "ℹ️" : tipIndex === 1 ? "📍" : tipIndex === 2 ? "☀️" : "🍽️"),
        b: $data.editingTipIndex !== tipIndex
      }, $data.editingTipIndex !== tipIndex ? {
        c: common_vendor.t(tip),
        d: $data.editingTipIndex === tipIndex ? 1 : "",
        e: common_vendor.o(($event) => $options.startEditTip(tipIndex), tipIndex)
      } : {
        f: common_vendor.o(($event) => $options.saveTip(tipIndex), tipIndex),
        g: common_vendor.o(($event) => $options.saveTip(tipIndex), tipIndex),
        h: $data.editingTipIndex === tipIndex,
        i: $data.templateData.tips[tipIndex],
        j: common_vendor.o(($event) => $data.templateData.tips[tipIndex] = $event.detail.value, tipIndex)
      }, {
        k: tipIndex
      });
    })
  } : {}) : {}, {
    D: $data.showDeleteConfirm
  }, $data.showDeleteConfirm ? {
    E: common_vendor.o((...args) => $options.cancelDelete && $options.cancelDelete(...args))
  } : {}, {
    F: $data.showDeleteConfirm
  }, $data.showDeleteConfirm ? {
    G: common_vendor.t($data.deleteMessage),
    H: common_vendor.o((...args) => $options.cancelDelete && $options.cancelDelete(...args)),
    I: common_vendor.o((...args) => $options.confirmDelete && $options.confirmDelete(...args))
  } : {}, {
    J: $data.showMapModal
  }, $data.showMapModal ? {
    K: common_vendor.o((...args) => $options.closeMap && $options.closeMap(...args)),
    L: common_vendor.t($data.templateData ? $data.templateData.title + "地图" : "景点地图"),
    M: common_vendor.o((...args) => $options.closeMap && $options.closeMap(...args)),
    N: $data.mapMarkers.length > 0 ? $data.mapMarkers[0].longitude : 116.3974,
    O: $data.mapMarkers.length > 0 ? $data.mapMarkers[0].latitude : 39.9093,
    P: $data.mapMarkers,
    Q: $data.mapPolyline
  } : {}, {
    R: $data.showFullMap
  }, $data.showFullMap ? common_vendor.e({
    S: common_vendor.o((...args) => $options.closeFullMap && $options.closeFullMap(...args)),
    T: common_vendor.t($data.currentLocationName || "地点定位"),
    U: common_vendor.o(() => {
    }),
    V: $data.showFullMap
  }, $data.showFullMap ? {
    W: `map-${$data.mapKey}`,
    X: $data.staticMapLongitude,
    Y: $data.staticMapLatitude,
    Z: $data.staticMapScale,
    aa: $data.markersLocked ? $data.fullMapMarkers : [],
    ab: common_vendor.o((...args) => $options.onMapMarkerTap && $options.onMapMarkerTap(...args)),
    ac: common_vendor.o((...args) => $options.onMapRegionChange && $options.onMapRegionChange(...args)),
    ad: common_vendor.o((...args) => $options.onMapTap && $options.onMapTap(...args)),
    ae: common_vendor.o((...args) => $options.onMapUpdated && $options.onMapUpdated(...args))
  } : {}, {
    af: common_vendor.o(() => {
    }),
    ag: common_vendor.o((...args) => $options.closeFullMap && $options.closeFullMap(...args))
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/guide/edit/edit.js.map
