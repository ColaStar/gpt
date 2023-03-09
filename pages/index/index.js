"use strict";
var common_vendor = require("../../common/vendor.js");
var common_uniCopy = require("../../common/uni-copy.js");
var common_config = require("../../common/config.js");
const ourLoading = () => "../../components/our-loading/our-loading.js";
var videoAd = null;
const _sfc_main = {
  components: {
    ourLoading
  },
  data() {
    return {
      isadj: false,
      apiurl: "",
      contactperson: "lddb1900",
      loadset: true,
      userid: "",
      manaaddnum: null,
      loading: true,
      show: "",
      adj1: "adunit-0b5f557216c365d7",
      adjvideo: "adunit-b37f86acf4e616bc",
      adj: "",
      managerstatu: false,
      modetype: 3,
      openid: "",
      range: [
        {
          value: 4,
          text: "绘画模式"
        },
        {
          value: 2,
          text: "问答模式"
        },
        {
          value: 3,
          text: "智能模式"
        }
      ],
      scrollInto: "",
      sentext: "发送",
      msgLoad: false,
      msgList: [{
        "msg": "来吧！",
        "my": false
      }],
      msgContent: "",
      msg: "",
      sendmsgcache: [],
      num: 0,
      informs: ""
    };
  },
  onLoad() {
    this.apiurl = common_config.config.apiurl;
    this.contactperson = common_config.config.contactperson;
    console.log(this.apiurl);
    this.sentext = "加载中";
    this.msgLoad = false;
    this.wxcode();
    this.getsetinfo();
    this.adLoad();
  },
  methods: {
    addnumcopy() {
      this.copy(this.openid);
      this.closeaddnumpop();
    },
    openaddnumpop() {
      this.$refs.addnumpop.open("center");
    },
    closeaddnumpop() {
      this.$refs.addnumpop.close("center");
    },
    getsetinfo() {
      console.log("获取配置信息");
      common_vendor.index.request({
        url: common_config.config.apiurl + "/getsetinfo",
        method: "GET",
        success: (res) => {
          console.log(res);
          this.isadj = res.data.isadj;
          if (res.data.manavx != null) {
            this.contactperson = res.data.manavx;
          }
        },
        fail: (err) => {
          this.toast(err);
        }
      });
    },
    onChooseAvatar(e) {
      console.log(e.detail);
      this.avatar = e.detail.avatarUrl;
      common_vendor.index.setStorage({
        key: "avat",
        data: apikey,
        success: function(res) {
          console.log("success", res);
        }
      });
    },
    toindex() {
      common_vendor.index.navigateTo({
        url: "/pages/index/index"
      });
    },
    togpt() {
      common_vendor.index.navigateTo({
        url: "/pages/gpt/gpt"
      });
    },
    onShareAppMessage(res) {
      if (res.from === "button") {
        console.log(res.target);
      }
      return {
        title: "AI智能问答",
        path: "/pages/index/index"
      };
    },
    onShareTimeline(res) {
      if (res.from === "button") {
        console.log(res.target);
      }
      return {
        title: "AI智能问答",
        path: "/pages/index/index"
      };
    },
    neterr(err) {
      this.msgList[this.msgList.length - 1].msg = err;
      let that = this;
      setTimeout(function() {
        that.msgLoad = false;
        that.sentext = "发送";
      }, 3e3);
    },
    toast(msg) {
      common_vendor.index.showToast({
        title: msg,
        duration: 2e3,
        icon: "none"
      });
    },
    chioceuse() {
      this.toast("暂未开放");
      common_vendor.index.getUserProfile({
        desc: "獲取您的昵稱、頭像、地區及性別",
        success: (infoRes) => {
          console.log(infoRes);
        },
        fail: (err) => {
          console.log("userInfo-err", JSON.stringify(err));
        }
      });
    },
    manaadd() {
      common_vendor.index.navigateTo({
        url: "/pages/index/ctrl"
      });
    },
    manaset() {
      common_vendor.index.navigateTo({
        url: "/pages/index/ctrl"
      });
      this.closeDrawer();
    },
    addnum(ty) {
      let data = JSON.stringify({
        openid: this.openid,
        type: ty
      });
      common_vendor.index.request({
        url: this.apiurl + "/addnum",
        data,
        method: "POST",
        success: (res) => {
          console.log("增加次数", res);
          if (res.data.code == 200) {
            this.num = res.data.num;
            this.toast("好开心！你又可以和我聊天了！");
            this.msgList[this.msgList.length - 1].msg = "好开心！你又可以和我聊天了！";
            this.close();
          }
          if (res.data.code == 201) {
            this.msgList[this.msgList.length - 1].msg = res.data.msg;
            this.toast(res.data.msg);
            this.close();
          }
        },
        fail: (err) => {
          this.neterr(err);
        }
      });
    },
    adLoad: function() {
      if (wx.createRewardedVideoAd) {
        videoAd = wx.createRewardedVideoAd({
          adUnitId: this.adjvideo
        });
        videoAd.onError((err) => {
        });
        videoAd.onClose((status) => {
          if (status && status.isEnded || status === void 0) {
            videoAd.offClose();
            console.log("播放完成");
            this.addnum("v");
          } else {
            console.log("退出播放");
          }
        });
      }
    },
    showAd() {
      if (videoAd) {
        videoAd.show().catch((err) => {
          videoAd.load().then(() => videoAd.show());
        });
      }
    },
    shar() {
      this.addnum("s");
    },
    open() {
      console.log("pop");
      this.$refs.popup.open("bottom");
    },
    close() {
      this.$refs.popup.close("bottom");
    },
    setPageScrollTo() {
      let len = this.msgList.length;
      this.scrollInto = "id" + (len - 1);
    },
    checkmsg() {
      this.msgLoad == false;
      let data = JSON.stringify({
        q: this.msg,
      });
      common_vendor.index.request({
        url: this.apiurl + "/chat",
        data,
        method: "GET",
        timeout: 3e5,
        success: (res) => {
          console.log(res);
          // if (res.data.code != 1) {
          //   this.toast("内容包含敏感词，请修改后再使用");
          //   return;
          // } else {
            this.sendmsg();
          // }
        }
      });
    },
    sendmsg() {
      console.log(this.msg.length);
      // if (this.sentext == "故障" || this.sentext == "重试") {
      //   this.checkserve();
      //   return 0;
      // }
      // if (this.num < 1 && this.sentext != "故障") {
      //   console.log("需充值");
      //   this.msgList.push({
      //     "msg": "你没次数了！",
      //     "my": false
      //   });
      //   this.open();
      //   return 0;
      // }
      if (this.msg == "") {
        console.log("msg\u4E3A\u7A7A");
        this.toast("你什么也没讲，我不知道说什么了！");
        return 0;
      }
      if (this.msgLoad == true) {
        console.log("load中");
        return 0;
      }
      this.sentext = "请求中";
      this.msgList.push({
        "msg": this.msg,
        "my": true
      });
      this.msgList.push({
        "msg": "思考中...",
        "my": false
      });
      let data = "";
      switch (this.modetype) {
        case 4:
          console.log(this.modetype, "4");
          data = JSON.stringify({
            msg: this.msg,
            maxtoken: 3664,
            openid: this.openid
          });
          break;
        case 3:
          console.log(this.modetype, "3");
          this.sendmsgcache.push("YOU:" + this.msg + "\n");
          this.msgContent = "";
          this.sendmsgcache.forEach((info) => {
            console.log("info", info);
            this.msgContent += info;
          });
          data = JSON.stringify({
            msg: this.msgContent,
            maxtoken: 1024,
            openid: this.openid
          });
          break;
        case 2:
          console.log(this.modetype, "2");
          data = JSON.stringify({
            msg: this.msg,
            maxtoken: 3700 - this.msg.length * 2,
            openid: this.openid
          });
          break;
      }
      console.log(data);
      this.msgLoad = true;
      this.msg = "";
      this.setPageScrollTo();
      let count = 0;
      let timer = setInterval(() => {
        count++;
        if (count == 30) {
          this.msgList[this.msgList.length - 1].msg = "我得想一想，等一下哦，马上就好....";
        }
        if (count == 60) {
          this.msgList[this.msgList.length - 1].msg = "我得好好想一想，马上就好........";
        }
      }, 1e3);
      console.log(this.modetype);
      if (this.modetype === 4) {
        common_vendor.index.request({
          url: this.apiurl + "/image",
          data,
          method: "POST",
          timeout: 18e4,
          success: (res) => {
            if (res.data.code == 200) {
              console.log(res);
              clearInterval(timer);
              timer = null;
              this.msgList[this.msgList.length - 1].msg = res.data.resmsg.data[0].url;

              this.setPageScrollTo();
              console.log("su", this.msgList);
              this.sendmsgcache.push(res.data.resmsg.data[0].url + "\n");
              this.num = res.data.num;
              this.msgLoad = false;
              this.sentext = "发送";
            } else {
              clearInterval(timer);
              timer = null;
              this.neterr(res.data.errinfo);
            }
          },
          fail: (res) => {
            this.neterr(res);
          }
        });
      } else {
        common_vendor.index.request({
          url: this.apiurl + "/supermessage",
          data,
          method: "POST",
          timeout: 3e5,
          success: (res) => {
            if (res.data.code == 200) {
              let text = res.data.resmsg.choices[0].text.replace("openai:", "").replace("openai：", "").replace(/^\n|\n$/g, "");
              console.log(text);
              let msglen = res.data.resmsg.usage.total_tokens;
              let msgcomplen = res.data.resmsg.usage.completion_tokens;
              if (msglen + msgcomplen > 1500) {
                for (let msg in this.sendmsgcache) {
                  this.sendmsgcache.shift();
                  if (this.msgContent.length * 1.6 + msglen < 800) {
                    console.log("ok");
                    break;
                  }
                }
              }
              clearInterval(timer);
              timer = null;
              if (text != "") {
                this.msgList[this.msgList.length - 1].msg = text;
              }
              if (text == "") {
                this.msgList[this.msgList.length - 1].msg = "我没明白你的意思！";
              }
              this.setPageScrollTo();
              console.log("su", this.msgList);
              this.sendmsgcache.push(text + "\n");
              this.num = res.data.num;
              this.msgLoad = false;
              this.sentext = "发送"
            } else {
              clearInterval(timer);
              timer = null;
              this.neterr(res.data.errinfo);
            }
          },
          fail: (res) => {
            this.neterr(res);
          }
        });
      }
    },
    topupnum() {
      console.log("次数点击");
    },
    copy(info) {
      common_uniCopy.uniCopy({
        content: info,
        success: (res) => {
          common_vendor.index.showToast({
            title: res,
            icon: "none"
          });
        },
        error: (e) => {
          common_vendor.index.showToast({
            title: e,
            icon: "none",
            duration: 3e3
          });
        }
      });
    },
    checkserve() {
      // this.msgLoad = true;
      this.sentext = "连接中";
      common_vendor.index.request({
        url: this.apiurl,
        method: "GET",
        success: (res) => {
          console.log("联通测试", res);
          if (res.data.code == 200) {
            console.log(res);
            this.sentext = "发送";
            this.msgLoad = false;
            this.adj = res.data.adj;
          } else {
            this.msgList.push({
              "msg": "服务器故障，请联系微信：" + this.contactperson + "  故障原因:" + res.data.resmsg,
              "my": false
            });
            this.sentext = "故障";
            // setTimeout(function() {
            //   this.msgLoad = true;
            // }, 1e4);
          }
        },
        fail: (err) => {
          this.neterr(err);
        }
      });
    },
    wxcode() {
      let that = this;
      common_vendor.index.login({
        provider: "weixin",
        success: function(loginRes) {
          console.log(loginRes.code);
          let data = JSON.stringify({
            code: loginRes.code
          });
          common_vendor.index.request({
            url: that.apiurl + "/login",
            data,
            method: "POST",
            success: (res) => {
              if (res.data.code == 200) {
                console.log(res);
                that.sentext = "\u53D1\u9001";
                // that.msgLoad = false;
                console.log(res);
                that.openid = res.data.resmsg.openid;
                that.num = res.data.num;
                if (res.data.resmsg.openid == res.data.mana) {
                  that.managerstatu = true;
                }
                that.loadset = false;
				console.log('我试试')
                that.checkserve();
              } else {
                that.msgList.push({
                  "msg": "服务器故障，请联系微信：" + that.contactperson + "  故障原因:" + res.data.resmsg,
                  "my": false
                });
                that.sentext = "故障";
                // setTimeout(function() {
                //   that.msgLoad = true;
                // }, 1e4);
              }
            },
            fail: (err) => {
              that.neterr(err);
            }
          });
        }
      });
    },
    change(e) {
      console.log("e:", e);
      this.sendmsgcache = [];
      this.toast("模式变更后，对话逻辑会从新开始");
      switch (e) {
        case 4:
          this.informs = "我可以帮你绘图了！";
          break;
        case 3:
          this.informs = "我可以根据上下文跟你聊天了！";
          break;
        case 2:
          this.informs = "你问一个问题，我回答一个问题！";
          break;
      }
      this.msgList.push({
        "msg": this.informs,
        "my": false
      });
    },
    showDrawer() {
      this.$refs.showRight.open();
    },
    closeDrawer() {
      this.$refs.showRight.close();
    }
  }
};
if (!Array) {
  const _component_ourLoading = common_vendor.resolveComponent("ourLoading");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_notice_bar2 = common_vendor.resolveComponent("uni-notice-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_drawer2 = common_vendor.resolveComponent("uni-drawer");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_component_ourLoading + _easycom_uni_data_select2 + _easycom_uni_notice_bar2 + _easycom_uni_icons2 + _easycom_uni_drawer2 + _easycom_uni_popup2)();
}
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_notice_bar = () => "../../uni_modules/uni-notice-bar/components/uni-notice-bar/uni-notice-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_drawer = () => "../../uni_modules/uni-drawer/components/uni-drawer/uni-drawer.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_data_select + _easycom_uni_notice_bar + _easycom_uni_icons + _easycom_uni_drawer + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.loadset,
    b: common_vendor.p({
      isFullScreen: false,
      active: false,
      text: "你想知道的,它都会告诉你...."
    }),
    c: common_vendor.o($options.change),
    d: common_vendor.o(($event) => $data.modetype = $event),
    e: common_vendor.p({
      localdata: $data.range,
      modelValue: $data.modetype
    }),
    f: $data.num > 0
  }, $data.num > 0 ? {
    g: common_vendor.t($data.num)
  } : {}, {
    h: $data.num <= 0
  }, $data.num <= 0 ? {} : {}, {
    i: common_vendor.o((...args) => $options.openaddnumpop && $options.openaddnumpop(...args)),
    j: common_vendor.p({
      showClose: true,
      text: $data.adj
    }),
    k: common_vendor.f($data.msgList, (x, i, i0) => {
      return common_vendor.e({
        a: x.my
      }, x.my ? {
        b: common_vendor.t(x.msg),
        c: "id" + i,
        d: common_vendor.o(($event) => $options.copy(x.msg))
      } : {}, {
        e: !x.my
      }, !x.my ? common_vendor.e({
        f: x.msg.indexOf("https://oaidalleapiprodscus") > -1
      }, x.msg.indexOf("https://oaidalleapiprodscus") > -1 ? {
        g: x.msg
      } : {
        h: common_vendor.t(x.msg)
      }, {
        i: "id" + i,
        j: common_vendor.o(($event) => $options.copy(x.msg))
      }) : {}, {
        k: i
      });
    }),
    l: $data.scrollInto,
    m: common_vendor.o($options.showDrawer),
    n: common_vendor.p({
      type: "settings-filled",
      size: "30"
    }),
    o: common_vendor.o((...args) => $options.checkmsg && $options.checkmsg(...args)),
    p: $data.msg,
    q: common_vendor.o(($event) => $data.msg = $event.detail.value),
    r: common_vendor.t($data.sentext),
    s: common_vendor.o((...args) => $options.checkmsg && $options.checkmsg(...args)),
    t: $data.msgLoad,
    v: common_vendor.t($data.openid),
    w: common_vendor.o(($event) => $options.copy($data.openid)),
    x: $data.managerstatu
  }, $data.managerstatu ? {
    y: common_vendor.o((...args) => $options.manaset && $options.manaset(...args))
  } : {}, {
    z: common_vendor.t($data.adj),
    A: $data.adj1,
    B: common_vendor.sr("showRight", "57280228-4"),
    C: common_vendor.p({
      mode: "left"
    }),
    D: $data.isadj
  }, $data.isadj ? {
    E: common_vendor.o((...args) => $options.showAd && $options.showAd(...args))
  } : {}, {
    F: common_vendor.o((...args) => $options.shar && $options.shar(...args)),
    G: common_vendor.t($data.contactperson),
    H: common_vendor.o((...args) => $options.openaddnumpop && $options.openaddnumpop(...args)),
    I: common_vendor.sr("popup", "57280228-5"),
    J: common_vendor.p({
      type: "bottom"
    }),
    K: common_vendor.o(($event) => $options.addnumcopy($data.openid)),
    L: common_vendor.t($data.contactperson),
    M: common_vendor.sr("addnumpop", "57280228-6"),
    N: common_vendor.p({
      type: "center"
    })
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-57280228"], ["__file", "F:/VUEobj/wxchat1/pages/index/index.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
