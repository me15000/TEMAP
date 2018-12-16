// pages/detail/index.js
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon: "/style/imgs/p-food.png",
    markers: [{
      id: 1,
      latitude: 31.35475,
      longitude: 120.98181,
      iconPath: "/style/imgs/p-food.png",
      width: 30,
      height: 30,
      label: {
        content: "xxxxxxx",
        fontSize: 14,
        color: "#fff",
        bgColor: "#aaa",
        padding: 2,
        borderRadius: 3,
        anchorX: -25,
        anchorY: -56
      }
    },
    {
      id: 2,
      latitude: 31.36475,
      longitude: 120.98281,
      iconPath: "/style/imgs/p-oil.png",
      width: 30,
      height: 30,
      label: {
        content: "xxxxxxx",
        fontSize: 14,
        color: "#fff",
        bgColor: "#aaa",
        padding: 2,
        borderRadius: 3,
        anchorX: -25,
        anchorY: -56
      }
    },
    {
      id: 3,
      latitude: 31.37475,
      longitude: 120.98381,
      iconPath: "/style/imgs/p-shop.png",
      width: 30,
      height: 30,
      label: {
        content: "xxxxxxx",
        fontSize: 14,
        color: "#fff",
        bgColor: "#aaa",
        padding: 2,
        borderRadius: 3,
        anchorX: -25,
        anchorY: -56
      }
    },
    {
      id: 4,
      latitude: 31.38475,
      longitude: 120.98481,
      iconPath: "/style/imgs/p-child.png",
      width: 30,
      height: 30,
      label: {
        content: "xxxxxxx",
        fontSize: 14,
        color: "#fff",
        bgColor: "#aaa",
        padding: 2,
        borderRadius: 3,
        anchorX: -25,
        anchorY: -56
      }
    },
    {
      id: 5,
      latitude: 31.39475,
      longitude: 120.98581,
      iconPath: "/style/imgs/p.png",
      width: 30,
      height: 30,
      label: {
        content: "xxxxxxx",
        fontSize: 14,
        color: "#fff",
        bgColor: "#aaa",
        padding: 2,
        borderRadius: 3,
        anchorX: -25,
        anchorY: -56
      }
    },
    {
      id: 7,
      latitude: 31.39675,
      longitude: 120.99781,
      iconPath: "/style/imgs/p-women.png",
      width: 30,
      height: 30,
      label: {
        content: "xxxxxxx",
        fontSize: 14,
        color: "#fff",
        bgColor: "#aaa",
        padding: 2,
        borderRadius: 3,
        anchorX: -25,
        anchorY: -56
      }
    }


    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let that = this;
    app.getLocation((r) => {
      that.setData({
        latitude: r.latitude,
        longitude: r.longitude
      });
    });
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