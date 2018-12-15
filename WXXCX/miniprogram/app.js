//app.js
App({
  Global: {},

  getLocation: function (callback) {
    let that = this;
    wx.getLocation({
      type: "gcj02",
      altitude: true,
      success: function (r) {
        that.Global["location"] = r;
        callback(r);

        console.log(r);
      },
      fail: function () {
        wx.showToast({
          title: '获取位置失败',
          icon: "none"
        })
      }
    });
  },
  initSetting: function (key) {
    let that = this;
    wx.getSetting({
      success(res) {
        for (var i = 0; i < that.settings.length; i++) {
          let sett = that.settings[i];
          if (sett.key == key) {
            that.initSettingItem(res, i);
          }
        }
      }
    });
  },

  initSettingItem: function (res, i) {
    let that = this;
    let sett = that.settings[i];
    if (!res.authSetting[sett.key]) {
      wx.authorize({
        scope: sett.key,
        success() {

        },
        fail() {
          wx.showToast({
            title: sett.info,
            icon: "none"
          })
        }
      })
    }
  },
  settings: [
    { "key": "scope.userLocation", "info": "需要先同意授权地理位置" },
    { "key": "scope.writePhotosAlbum", "info": "需要先同意授权保存到相册" },
    { "key": "scope.camera", "info": "需要先同意授权摄像头" }
  ],


  initSettingAll: function () {
    let that = this;
    wx.getSetting({
      success(res) {
        for (var i = 0; i < that.settings.length; i++) {
          that.initSettingItem(res, i);
        }
      }
    });
  },



  onLaunch: function () {
    this.initSettingAll();
  }
})
