"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../services/templateService.js");
const _sfc_main = {
  data() {
    return {
      templateId: "",
      templateData: null,
      expandedDays: {},
      expandedLocations: {},
      showMapModal: false,
      mapMarkers: [],
      mapPolyline: []
    };
  },
  onLoad(options) {
    this.templateId = options.id || "";
    this.loadTemplateData();
  },
  methods: {
    loadTemplateData() {
      const templates = {
        "hebei_classic_3days": {
          title: "河北经典3日游",
          subtitle: "承德避暑山庄、秦皇岛北戴河、山海关经典路线",
          image: "/static/images/templates/hebei1.jpg",
          days: [
            {
              day: 1,
              title: "第一天：承德避暑山庄",
              locations: [
                {
                  name: "承德避暑山庄",
                  desc: "清代皇家园林，世界文化遗产，占地564万平方米，是中国现存最大的古典皇家园林",
                  time: "4-6小时",
                  transport: [
                    { type: "🚇", route: "高铁至承德南站，转乘公交" },
                    { type: "🚕", route: "出租车约30分钟" }
                  ],
                  details: "避暑山庄始建于1703年，历经康熙、雍正、乾隆三朝，耗时89年建成。山庄由宫殿区、湖泊区、平原区、山峦区四部分组成，融合了南北园林艺术精华。"
                },
                {
                  name: "普陀宗乘之庙",
                  desc: "仿西藏布达拉宫建造，又称小布达拉宫",
                  time: "2-3小时",
                  transport: [
                    { type: "🚕", route: "从避暑山庄打车约15分钟" }
                  ],
                  details: "为庆祝乾隆皇帝60寿辰而建，是承德外八庙中规模最大的一座。建筑群依山而建，气势宏伟。"
                }
              ]
            },
            {
              day: 2,
              title: "第二天：秦皇岛北戴河",
              locations: [
                {
                  name: "北戴河海滨",
                  desc: "著名海滨度假胜地，沙质细腻，海水清澈",
                  time: "3-4小时",
                  transport: [
                    { type: "🚇", route: "高铁至秦皇岛站" },
                    { type: "🚕", route: "出租车约20分钟" }
                  ],
                  details: "北戴河是中国四大避暑胜地之一，海岸线长达22.5公里。这里气候宜人，是观海、游泳、日光浴的理想场所。"
                },
                {
                  name: "鸽子窝公园",
                  desc: "观日出最佳地点，毛泽东曾在此写下《浪淘沙·北戴河》",
                  time: "1-2小时",
                  transport: [
                    { type: "🚕", route: "从北戴河海滨打车约10分钟" }
                  ],
                  details: "公园内有一块形似雄鹰的巨石，是观赏海上日出的绝佳位置。每年春秋季节，这里还是候鸟迁徙的重要驿站。"
                }
              ]
            },
            {
              day: 3,
              title: "第三天：山海关长城",
              locations: [
                {
                  name: "山海关",
                  desc: "天下第一关，明代长城起点，军事要塞",
                  time: "3-5小时",
                  transport: [
                    { type: "🚇", route: "高铁至山海关站" },
                    { type: "🚕", route: "步行可达" }
                  ],
                  details: '山海关是明长城的东北关隘之一，素有"天下第一关"之称。关城周长约4公里，与长城相连，是古代重要的军事防御体系。'
                },
                {
                  name: "老龙头",
                  desc: "长城入海处，唯一的海上长城",
                  time: "2-3小时",
                  transport: [
                    { type: "🚕", route: "从山海关打车约15分钟" }
                  ],
                  details: "老龙头是明长城的东部起点，长城从这里入海，犹如龙头探入大海，因此得名。这里可以欣赏到长城与大海交汇的壮观景象。"
                }
              ]
            }
          ],
          tips: [
            "提前预订高铁票，节假日车票紧张，建议提前1-2周购票",
            "夏季注意防晒，海边紫外线较强，建议携带防晒霜和遮阳帽",
            "品尝当地特色：承德烤全羊、秦皇岛海鲜、山海关浑锅",
            "承德避暑山庄面积较大，建议穿舒适的运动鞋",
            "北戴河海滨早晚温差较大，建议携带薄外套"
          ],
          mapMarkers: [
            { longitude: 117.9398, latitude: 40.9762, title: "承德避暑山庄" },
            { longitude: 117.95, latitude: 40.98, title: "普陀宗乘之庙" },
            { longitude: 119.6005, latitude: 39.9354, title: "北戴河海滨" },
            { longitude: 119.61, latitude: 39.94, title: "鸽子窝公园" },
            { longitude: 119.775, latitude: 40.0086, title: "山海关" },
            { longitude: 119.785, latitude: 40.015, title: "老龙头" }
          ],
          mapPolyline: [
            {
              points: [
                { longitude: 117.9398, latitude: 40.9762 },
                { longitude: 117.95, latitude: 40.98 },
                { longitude: 119.6005, latitude: 39.9354 },
                { longitude: 119.61, latitude: 39.94 },
                { longitude: 119.775, latitude: 40.0086 },
                { longitude: 119.785, latitude: 40.015 }
              ],
              color: "#165DFF",
              width: 6,
              dottedLine: false
            }
          ]
        },
        "hebei_cultural_5days": {
          title: "河北文化深度5日游",
          subtitle: "保定直隶总督署、正定古城、赵州桥文化之旅",
          image: "/static/images/templates/baoding.jpg",
          days: [
            {
              day: 1,
              title: "第一天：保定直隶总督署",
              locations: [
                {
                  name: "直隶总督署",
                  desc: "清代直隶省最高行政机构，中国现存最完整的清代省级衙署",
                  time: "2-3小时",
                  transport: [
                    { type: "🚇", route: "高铁至保定东站" },
                    { type: "🚕", route: "出租车约15分钟" }
                  ],
                  details: "直隶总督署始建于明洪武年间，是清代直隶省的最高行政机构。衙署建筑群保存完好，是研究清代官署建筑和行政制度的重要实物资料。"
                },
                {
                  name: "古莲花池",
                  desc: '北方古代园林明珠，有"城市蓬莱"之称',
                  time: "1-2小时",
                  transport: [
                    { type: "🚕", route: "从总督署步行约10分钟" }
                  ],
                  details: "古莲花池始建于元朝，是保定著名的古典园林。园内亭台楼阁错落有致，池水清澈，荷花盛开时景色尤为迷人。"
                }
              ]
            },
            {
              day: 2,
              title: "第二天：正定古城",
              locations: [
                {
                  name: "正定古城",
                  desc: "历史文化名城，拥有隆兴寺、临济寺等古建筑群",
                  time: "4-5小时",
                  transport: [
                    { type: "🚇", route: "高铁至正定机场站" },
                    { type: "🚕", route: "出租车约25分钟" }
                  ],
                  details: "正定古城历史悠久，城内保存有隆兴寺、临济寺、开元寺等多处国家级文物保护单位。隆兴寺内的千手观音像高达21.3米，是中国现存最高的古代铜铸佛像。"
                },
                {
                  name: "荣国府",
                  desc: "仿古建筑群，电视剧《红楼梦》拍摄地",
                  time: "2-3小时",
                  transport: [
                    { type: "🚕", route: "从古城中心打车约10分钟" }
                  ],
                  details: "荣国府是为拍摄电视剧《红楼梦》而建的仿古建筑群，再现了清代贵族府邸的宏伟气势。园内建筑精美，是了解清代建筑艺术的好去处。"
                }
              ]
            },
            {
              day: 3,
              title: "第三天：赵州桥",
              locations: [
                {
                  name: "赵州桥",
                  desc: "世界上最古老的石拱桥，隋代建筑杰作",
                  time: "2-3小时",
                  transport: [
                    { type: "🚇", route: "高铁至石家庄站" },
                    { type: "🚕", route: "出租车约40分钟" }
                  ],
                  details: "赵州桥建于隋朝，距今已有1400多年历史，是世界上现存最早、保存最完整的古代敞肩石拱桥。桥的设计科学合理，体现了古代工匠的高超技艺。"
                },
                {
                  name: "柏林禅寺",
                  desc: "北方著名佛教寺院，禅宗祖庭之一",
                  time: "1-2小时",
                  transport: [
                    { type: "🚕", route: "从赵州桥打车约15分钟" }
                  ],
                  details: "柏林禅寺始建于东汉，是中国北方著名的佛教寺院。寺内古柏参天，环境清幽，是禅宗的重要道场之一。"
                }
              ]
            }
          ],
          tips: [
            "建议聘请专业导游讲解历史文化背景，深度了解景点内涵",
            "古城内步行较多，建议穿舒适的运动鞋，携带饮用水",
            "品尝当地特色美食：保定驴肉火烧、正定烧饼、赵县雪花梨",
            "春秋季节是最佳游览时间，气候宜人，景色优美",
            "注意文物保护，不要在古迹上涂鸦或刻字"
          ],
          mapMarkers: [
            { longitude: 115.4907, latitude: 38.873, title: "直隶总督署" },
            { longitude: 115.5, latitude: 38.88, title: "古莲花池" },
            { longitude: 114.57, latitude: 38.147, title: "正定古城" },
            { longitude: 114.58, latitude: 38.15, title: "荣国府" },
            { longitude: 114.69, latitude: 37.76, title: "赵州桥" },
            { longitude: 114.7, latitude: 37.77, title: "柏林禅寺" }
          ],
          mapPolyline: [
            {
              points: [
                { longitude: 115.4907, latitude: 38.873 },
                { longitude: 115.5, latitude: 38.88 },
                { longitude: 114.57, latitude: 38.147 },
                { longitude: 114.58, latitude: 38.15 },
                { longitude: 114.69, latitude: 37.76 },
                { longitude: 114.7, latitude: 37.77 }
              ],
              color: "#FF7D00",
              width: 6,
              dottedLine: false
            }
          ]
        },
        "hebei_natural_4days": {
          title: "河北自然风光4日游",
          subtitle: "野三坡、白石山、苍岩山自然风光探索",
          image: "/static/images/templates/baishishan.jpg",
          days: [
            {
              day: 1,
              title: "第一天：野三坡",
              locations: [
                {
                  name: "野三坡景区",
                  desc: "国家级风景名胜区，百里峡、鱼谷洞等景点组成",
                  time: "5-6小时",
                  transport: [
                    { type: "🚇", route: "高铁至涞水站" },
                    { type: "🚕", route: "景区专线车" }
                  ],
                  details: "野三坡景区由百里峡、鱼谷洞、龙门天关等多个景点组成，以雄、险、奇、幽的自然景观著称。百里峡是景区的精华，峡谷内溪流潺潺，植被茂密。"
                },
                {
                  name: "鱼谷洞",
                  desc: "天然溶洞，洞内有地下河和钟乳石景观",
                  time: "2-3小时",
                  transport: [
                    { type: "🚕", route: "从百里峡景区内乘车" }
                  ],
                  details: "鱼谷洞是一处天然溶洞，洞内钟乳石、石笋、石幔等喀斯特地貌发育完整。洞内有地下河，水质清澈，可以乘船游览。"
                }
              ]
            },
            {
              day: 2,
              title: "第二天：白石山",
              locations: [
                {
                  name: "白石山国家地质公园",
                  desc: '以白色大理石峰林闻名，有"北方黄山"之称',
                  time: "4-5小时",
                  transport: [
                    { type: "🚇", route: "高铁至涞源站" },
                    { type: "🚕", route: "景区班车" }
                  ],
                  details: '白石山因山体多为白色大理石而得名，主峰海拔2096米。景区内峰林奇特，云海壮观，有"北方黄山"的美誉。玻璃栈道是景区的特色体验项目。'
                },
                {
                  name: "十瀑峡",
                  desc: "瀑布群景观，夏季水量充沛时最为壮观",
                  time: "2-3小时",
                  transport: [
                    { type: "🚕", route: "从白石山景区内步行" }
                  ],
                  details: "十瀑峡是白石山景区的重要组成部分，峡谷内分布着大小不一的瀑布群。夏季雨季时，瀑布水量充沛，水声轰鸣，景色十分壮观。"
                }
              ]
            },
            {
              day: 3,
              title: "第三天：苍岩山",
              locations: [
                {
                  name: "苍岩山风景区",
                  desc: "佛教圣地，以悬空寺和桥楼殿闻名",
                  time: "3-4小时",
                  transport: [
                    { type: "🚇", route: "高铁至井陉站" },
                    { type: "🚕", route: "出租车约30分钟" }
                  ],
                  details: "苍岩山是华北地区重要的佛教圣地，以悬空寺和桥楼殿最为著名。桥楼殿建在两座悬崖之间，是中国三大悬空寺之一，建筑工艺精湛。"
                },
                {
                  name: "福庆寺",
                  desc: "苍岩山主寺，隋代皇家寺院",
                  time: "1-2小时",
                  transport: [
                    { type: "🚕", route: "从苍岩山景区内步行" }
                  ],
                  details: "福庆寺是苍岩山的主寺，始建于隋代，曾是皇家寺院。寺内保存有历代碑刻和佛教文物，是研究佛教历史的重要场所。"
                }
              ]
            }
          ],
          tips: [
            "山区天气多变，建议携带雨具和保暖衣物",
            "登山注意安全，穿防滑登山鞋，携带登山杖",
            "景区内餐饮较少，建议自备干粮和充足饮用水",
            "最佳游览季节为春秋两季，夏季注意防暑，冬季注意防寒",
            "拍照时注意安全，不要在危险地段停留过久"
          ],
          mapMarkers: [
            { longitude: 115.32, latitude: 39.7, title: "野三坡" },
            { longitude: 115.33, latitude: 39.71, title: "鱼谷洞" },
            { longitude: 114.69, latitude: 39.2, title: "白石山" },
            { longitude: 114.7, latitude: 39.21, title: "十瀑峡" },
            { longitude: 114.13, latitude: 38.03, title: "苍岩山" },
            { longitude: 114.14, latitude: 38.04, title: "福庆寺" }
          ],
          mapPolyline: [
            {
              points: [
                { longitude: 115.32, latitude: 39.7 },
                { longitude: 115.33, latitude: 39.71 },
                { longitude: 114.69, latitude: 39.2 },
                { longitude: 114.7, latitude: 39.21 },
                { longitude: 114.13, latitude: 38.03 },
                { longitude: 114.14, latitude: 38.04 }
              ],
              color: "#00B42A",
              width: 6,
              dottedLine: false
            }
          ]
        },
        "hebei_greatwall_2days": {
          title: "河北长城精华2日游",
          subtitle: "金山岭长城、喜峰口长城长城文化体验",
          image: "/static/images/templates/qinhuangdao.jpg",
          days: [
            {
              day: 1,
              title: "第一天：金山岭长城",
              locations: [
                {
                  name: "金山岭长城",
                  desc: "明代长城精华段，保存最完好，摄影胜地",
                  time: "4-5小时",
                  transport: [
                    { type: "🚇", route: "高铁至密云站" },
                    { type: "🚕", route: "景区专车" }
                  ],
                  details: "金山岭长城是明长城中最具代表性的一段，全长10.5公里，敌楼密集，建筑精美。这里的长城保存完好，没有经过大规模修复，保持了历史的原貌。"
                },
                {
                  name: "司马台长城",
                  desc: '以险峻著称，有"长城之最"美誉',
                  time: "2-3小时",
                  transport: [
                    { type: "🚕", route: "从金山岭长城景区内步行" }
                  ],
                  details: "司马台长城以险峻著称，城墙依山势而建，最陡处达70度。这里的长城保留了明代的原貌，是摄影爱好者和登山爱好者的天堂。"
                }
              ]
            },
            {
              day: 2,
              title: "第二天：喜峰口长城",
              locations: [
                {
                  name: "喜峰口长城",
                  desc: "长城抗战重要战场，历史意义重大",
                  time: "3-4小时",
                  transport: [
                    { type: "🚇", route: "高铁至迁西站" },
                    { type: "🚕", route: "出租车约40分钟" }
                  ],
                  details: "喜峰口长城是抗日战争时期的重要战场，1933年这里发生了著名的喜峰口战役。长城沿线保留有抗战时期的工事和纪念碑，具有重要的历史教育意义。"
                },
                {
                  name: "潘家口水库",
                  desc: "水下长城奇观，长城入水处",
                  time: "2-3小时",
                  transport: [
                    { type: "🚕", route: "从喜峰口长城打车约20分钟" }
                  ],
                  details: "潘家口水库建成后，部分长城被淹没在水中，形成了独特的水下长城景观。在枯水期，部分长城会露出水面，是摄影的绝佳时机。"
                }
              ]
            }
          ],
          tips: [
            "长城徒步较累，建议带足饮用水和高能量食物",
            "注意防晒，长城上紫外线强，建议戴帽子和太阳镜",
            "穿防滑运动鞋，避免高跟鞋，长城台阶较陡",
            "春秋季节是最佳游览时间，夏季注意防暑，冬季注意防寒",
            "拍照时注意安全，不要在危险地段停留过久"
          ],
          mapMarkers: [
            { longitude: 117.24, latitude: 40.65, title: "金山岭长城" },
            { longitude: 117.25, latitude: 40.66, title: "司马台长城" },
            { longitude: 118.2, latitude: 40.4, title: "喜峰口长城" },
            { longitude: 118.21, latitude: 40.41, title: "潘家口水库" }
          ],
          mapPolyline: [
            {
              points: [
                { longitude: 117.24, latitude: 40.65 },
                { longitude: 117.25, latitude: 40.66 },
                { longitude: 118.2, latitude: 40.4 },
                { longitude: 118.21, latitude: 40.41 }
              ],
              color: "#F53F3F",
              width: 6,
              dottedLine: false
            }
          ]
        }
      };
      this.templateData = templates[this.templateId] || templates["hebei_classic_3days"];
      this.expandedDays = {};
      this.expandedLocations = {};
      if (this.templateData.days) {
        this.templateData.days.forEach((day, index) => {
          this.expandedDays[`day${index + 1}`] = index === 0;
          if (day.locations) {
            day.locations.forEach((location, locIndex) => {
              this.expandedLocations[`location${index + 1}_${locIndex + 1}`] = false;
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
          iconPath: "/static/map-marker.png",
          width: 30,
          height: 30
        }));
      }
      if (this.templateData.mapPolyline) {
        this.mapPolyline = this.templateData.mapPolyline;
      }
    },
    goBack() {
      common_vendor.index.navigateBack();
    },
    toggleDay(day) {
      this.expandedDays[day] = !this.expandedDays[day];
    },
    toggleLocation(location) {
      this.expandedLocations[location] = !this.expandedLocations[location];
    },
    showMap() {
      this.showMapModal = true;
    },
    closeMap() {
      this.showMapModal = false;
    },
    useTemplate() {
      const templateData = {
        title: this.templateData.title,
        subtitle: this.templateData.subtitle,
        image: this.templateData.image,
        days: this.templateData.days,
        tips: this.templateData.tips,
        mapMarkers: this.templateData.mapMarkers,
        mapPolyline: this.templateData.mapPolyline
      };
      common_vendor.index.navigateTo({
        url: `/pages/guide/edit/edit?templateData=${encodeURIComponent(JSON.stringify(templateData))}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.t($data.templateData ? $data.templateData.title : "攻略模板详情"),
    c: common_vendor.o((...args) => $options.useTemplate && $options.useTemplate(...args)),
    d: common_vendor.o((...args) => $options.showMap && $options.showMap(...args)),
    e: $data.templateData
  }, $data.templateData ? common_vendor.e({
    f: $data.templateData.image,
    g: common_vendor.t($data.templateData.title),
    h: common_vendor.t($data.templateData.subtitle),
    i: common_vendor.f($data.templateData.days, (day, dayIndex, i0) => {
      return common_vendor.e({
        a: common_vendor.t(day.day),
        b: common_vendor.t(day.title),
        c: $data.expandedDays["day" + (dayIndex + 1)] ? 1 : "",
        d: common_vendor.o(($event) => $options.toggleDay("day" + (dayIndex + 1)), dayIndex),
        e: $data.expandedDays["day" + (dayIndex + 1)]
      }, $data.expandedDays["day" + (dayIndex + 1)] ? {
        f: common_vendor.f(day.locations, (location, locIndex, i1) => {
          return common_vendor.e({
            a: common_vendor.t(location.name),
            b: common_vendor.t(location.desc),
            c: common_vendor.t(location.time),
            d: $data.expandedLocations["location" + (dayIndex + 1) + "_" + (locIndex + 1)]
          }, $data.expandedLocations["location" + (dayIndex + 1) + "_" + (locIndex + 1)] ? common_vendor.e({
            e: common_vendor.f(location.transport, (transport, transIndex, i2) => {
              return {
                a: common_vendor.t(transport.type),
                b: common_vendor.t(transport.type === "🚇" ? "地铁" : transport.type === "🚕" ? "出租车" : transport.type === "🚌" ? "公交" : "其他"),
                c: common_vendor.t(transport.route),
                d: transIndex
              };
            }),
            f: location.details
          }, location.details ? {
            g: common_vendor.t(location.details)
          } : {}) : {}, {
            h: locIndex,
            i: common_vendor.o(($event) => $options.toggleLocation("location" + (dayIndex + 1) + "_" + (locIndex + 1)), locIndex)
          });
        })
      } : {}, {
        g: dayIndex
      });
    }),
    j: $data.templateData.tips && $data.templateData.tips.length > 0
  }, $data.templateData.tips && $data.templateData.tips.length > 0 ? {
    k: common_vendor.f($data.templateData.tips, (tip, tipIndex, i0) => {
      return {
        a: common_vendor.t(tipIndex === 0 ? "ℹ️" : tipIndex === 1 ? "📍" : tipIndex === 2 ? "☀️" : "🍽️"),
        b: common_vendor.t(tip),
        c: tipIndex
      };
    })
  } : {}) : {}, {
    l: $data.showMapModal
  }, $data.showMapModal ? {
    m: common_vendor.o((...args) => $options.closeMap && $options.closeMap(...args)),
    n: common_vendor.t($data.templateData ? $data.templateData.title + "地图" : "景点地图"),
    o: common_vendor.o((...args) => $options.closeMap && $options.closeMap(...args)),
    p: $data.mapMarkers.length > 0 ? $data.mapMarkers[0].longitude : 116.3974,
    q: $data.mapMarkers.length > 0 ? $data.mapMarkers[0].latitude : 39.9093,
    r: $data.mapMarkers,
    s: $data.mapPolyline
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/template-detail/template-detail.js.map
