// pages/detail/index.js
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let id = options.id;
    that.setData({
      dataid: id
    });
    wx.cloud.init();
    wx.cloud.callFunction({
      name: 'querydetail',
      data: {
        id: id
      },
      complete: r => {

        let ent = r.result.result;

        app.getUserInfoMain((info) => {
          that.initUserInfo(info.openid);
        });

        that.setData({
          markers: [{
            id: ent._id,
            latitude: ent.lat,
            longitude: ent.lng,
            iconPath: "/style/imgs/p-" + ent.catekey + ".png",
            width: 25,
            height: 25,
            label: {
              content: ' ' + ent.title + ' ',
              fontSize: 11,
              color: "#fff",
              bgColor: "#F24056",
              padding: 1,
              borderRadius: 3,
              anchorX: -20,
              anchorY: -40
            }
          }],
          info: ent,
          latitude: ent.lat,
          longitude: ent.lng
        });
        console.log(r);
      }
    });
  },
  doZan: function (e) {
    let that = this;
    if (that.data.userinfo) {
      let qrcode = that.data.userinfo.qrcode;
      if (qrcode) {
        wx.previewImage({
          urls: [qrcode],
          current: qrcode
        });
      }
    }
  },
  doPreview: function (e) {
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      urls: [src],
      current: src
    })
  },

  doFav: function (e) {
    //收藏

    let that = this;
    console.log(that.data.dataid);

    wx.cloud.init();
    wx.cloud.callFunction({
      name: 'doinfofav',
      data: {
        id: that.data.dataid
      },
      complete: res => {
        console.log(res);
        wx.showToast({
          title: '收藏成功'
        })
      }
    });

  },
  goNavi: function () {
    let that = this;
    wx.openLocation({
      latitude: that.data.latitude,
      longitude: that.data.longitude
    });

  },

  initUserInfo: function (openid) {
    let that = this;
    wx.cloud.init();
    wx.cloud.callFunction({
      name: 'queryuserinfo',
      data: {
        openid
      },
      complete: res => {
        console.log(res);

        that.setData({
          userinfo: res.result.result
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})