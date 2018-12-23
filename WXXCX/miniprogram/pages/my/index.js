// pages/my/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddupload: false,
    files: [],
    favdata: [],
    mydata: [],
    tabs: ["我的设置", "我收藏的", "我发布的"],
    tabsKeys: ["set", "fav", "my"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },


  uploadFile: function (openid, fn, callback) {


    let mat = /\.(png|jpg|gif)/i.exec(fn);
    let ext = mat && mat.length ? mat[0] : '.png';

    let date = new Date();
    let cloudpath = "user_qrcode_" + openid + ext;

    console.log(cloudpath);

    wx.cloud.uploadFile({
      cloudPath: cloudpath,
      filePath: fn,
      success: res => {

        callback(res.fileID);
      },
      fail: err => {
        console.log(err);
      },
      complete: function () {

      }
    });

  },


  userFormSubmit: function (e) {
    let that = this;

    /*
    if (that.is_submit) {
      wx.showToast({
        title: '表单已提交',
        icon: "none"
      });
      return;
    }*/

    let ev = e.detail.value;

    let files = that.data.files;
    if (files.length > 1) {
      wx.showToast({
        title: '不能超出1个文件',
        icon: "none"
      });
      return;
    }

    console.log("files");
    console.log(files);

    let qrcode = files.length == 1 ? files[0] : null;
    if (!qrcode) {
      wx.showToast({
        title: '请选择打赏码并上传',
        icon: "none"
      });
      return;
    }


    wx.cloud.init();

    app.getUserInfoMain((info) => {
      that.uploadFile(info.openid, qrcode, (fileID) => {
        console.log('uploadFile succ');

        wx.cloud.callFunction({
          name: 'douserqrcode',
          data: {
            qrcode: fileID
          },
          complete: res => {
            //成功重新加载数据
            console.log('douserqrcode succ');
            wx.showToast({
              title: '保存成功'
            });

            that.initUserInfo();
            that.setData({
              disabledsubmit: true
            });
          }
        });
      });
    });
  },

  chooseImage: function (e) {

    var that = this;
    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: function (res) {

        that.setData({
          files: res.tempFilePaths
        });

        if (that.data.files.length >= 1) {
          that.setData({
            hiddupload: true
          });
          return;
        }
      }
    })
  },

  setInfo: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        let sliderWidth = res.windowWidth / 3;
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  initInfoData: function (type) {
    let that = this;
    wx.cloud.init();
    wx.cloud.callFunction({
      name: 'querylist',
      data: {
        type: type
      },
      complete: res => {
        console.log('querylist' + type);
        let result = res.result.result || [];
        for (var i = 0; i < result.length; i++) {
          let ent = result[i];
          ent.icon = "/style/imgs/p-" + ent.catekey + ".png";
          ent.date = app.getDateFromTS(ent.date);
        }

        let setdata = {};
        if (type == 'my') {
          setdata.mydata = result;
        } else if (type == 'fav') {
          setdata.favdata = result;
        }
        that.setData(setdata);
        console.log(setdata);
      }
    });

  },

  initUserInfo: function () {
    let that = this;
    wx.cloud.init();
    wx.cloud.callFunction({
      name: 'queryuserinfo',

      complete: res => {
        console.log(res);

        that.setData({
          userinfo: res.result.result
        });
      }
    });
  },

  initData: function () {
    let that = this;
    let key = that.data.tabsKeys[that.data.activeIndex];
    if (key == "set") {
      that.initUserInfo();
    } else if (key == "fav") {
      that.initInfoData(key);
    } else if (key == "my") {
      that.initInfoData(key);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    that.setInfo();
    that.initData();
  },
  tabClick: function (e) {

    let that = this;
    that.data.activeIndex = e.currentTarget.id;
    that.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });

    that.initData();
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