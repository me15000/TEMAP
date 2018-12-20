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
    wx.cloud.init();
    wx.cloud.callFunction({
      name: 'querydetail',
      data: {
        id: id
      },
      complete: r => {

        let ent = r.result.result;

        that.setData({
          markers: [{
            id: ent._id,
            latitude: ent.lat,
            longitude: ent.lng,
            iconPath: "/style/imgs/p-" + ent.catekey + ".png",
            width: 30,
            height: 30,
            label: {
              content: ent.title,
              fontSize: 14,
              color: "#fff",
              bgColor: "#aaa",
              padding: 2,
              borderRadius: 3,
              anchorX: -25,
              anchorY: -56
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
  doPreview: function (e) {
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      urls: [src],
      current: src
    })
  },

  doFav: function () {
    //收藏
  },
  goNavi: function () {
    let that = this;
    wx.openLocation({
      latitude: that.data.latitude,
      longitude: that.data.longitude
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