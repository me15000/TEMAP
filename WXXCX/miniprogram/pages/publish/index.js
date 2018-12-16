// pages/publish/index.js
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    hiddupload: false,
    latitude: '0',
    longitude: '0',
    categorys: [{
        key: "oil",
        "name": "燃油"
      },
      {
        key: "shop",
        "name": "商店"
      },
      {
        key: "food",
        "name": "美食"
      },
      {
        key: "other",
        "name": "其他"
      }
    ],
    categoryIndex: -1,

    files: []
  },

  bindCategoryChange: function(e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      categoryIndex: e.detail.value
    })
  },

  exitsFiles: function(file) {
    let that = this;
    let files = that.data.files;
    for (var i = 0; i < files.length; i++) {
      let f = files[i];
      if (f == file) {
        return true;
      }
    }
    return false;
  },
  chooseImage: function(e) {

    var that = this;
    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log(res);

        for (var i = 0; i < res.tempFilePaths.length; i++) {
          let f = res.tempFilePaths[i];
          if (!that.exitsFiles(f)) {
            that.setData({
              files: that.data.files.concat([f])
            });
          }
        }

        if (that.data.files.length >= 3) {
          that.setData({
            hiddupload: true
          });
          return;
        }


      }
    })
  },
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  setpoint: function() {
    let that = this;
    app.getLocation((r) => {
      wx.chooseLocation({
        latitude: r.latitude,
        longitude: r.longitude,
        success: function(e) {
          that.setData({
            latitude: e.latitude,
            longitude: e.longitude,
            address: e.address
          });
        }
      });
    });
  },

  formReset: function(e) {
    let that = this;
    that.is_submit = false;
    that.setData({
      files: [],
      latitude: 0,
      longitude: 0,
      address: '',
      categoryIndex: -1,
      title: ''
    });
  },

  formSubmit: function(e) {
    let formid = e.formId;
    let that = this;
    if (that.is_submit) {
      wx.showToast({
        title: '表单已提交',
        icon: "none"
      });
      return;
    }

    let ev = e.detail.value;

    let files = that.data.files;
    if (files.length > 3) {
      wx.showToast({
        title: '不能超出3个文件',
        icon: "none"
      });
      return;
    }

    let title = ev.title || '';
    if (!title || title.length > 10 || title.length < 1) {
      wx.showToast({
        title: '请设置标题',
        icon: "none"
      });
      return;
    }


    let cate = ev.category;
    if (cate < 0 || cate >= that.data.categorys.length) {
      wx.showToast({
        title: '请选择类型',
        icon: "none"
      });
      return;
    }

    let catekey = that.data.categorys[cate].key;
    let lat = that.data.latitude;
    let lng = that.data.longitude;
    if (!lat || !lng || lat == '0' || lng == '0') {
      wx.showToast({
        title: '请选择位置',
        icon: "none"
      });
      return;
    }
    //that.is_submit = true;

    that.submitData({
      title,
      catekey,
      lat,
      lng,
      formid
    });
  },

  submitData: function(data) {
    let that = this;
    wx.cloud.init();
    wx.cloud.callFunction({
      name: 'publish',
      data: {
        title: data.title,
        catekey: data.catekey,
        lat: data.lat,
        lng: data.lng,
        formid: data.formid
      },
      complete: res => {
        if (!res.result.result) {
          wx.showToast({
            title: '发生错误',
            icon: "none"
          });
          console.log('callFunction test result: ', res);
          return;
        }

        let result_id = res.result.result._id;
        if (!result_id) {
          wx.showToast({
            title: '发生错误',
            icon: "none"
          });
          return;
        }

        app.submitGEOData({
          id: result_id,
          lat: data.lat,
          lng: data.lng
        });


        wx.showLoading({
          title: '正在上传图片'
        });

        that.uploadFiles(result_id, files, (arr) => {
          wx.cloud.callFunction({
            name: 'publishUpload',
            data: {
              id: result_id,
              imgs: arr
            },
            complete: res => {
              wx.hideLoading();
            }
          });
        });
      }
    });
  },

  uploadFiles: function(result_id, files, callback) {
    let uploadsucc = [];
    let n = 0;

    let uploadFun = () => {
      let fn = files[n];
      let mat = /\.(png|jpg|gif)/i.exec(fn);
      let ext = mat && mat.length ? mat[0] : '.png';

      let date = new Date();
      let ddate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      let cloudpath = ddate + "-" + result_id + "-" + n + ext;

      wx.cloud.uploadFile({
        cloudPath: cloudpath,
        filePath: fn,
        success: res => {
          uploadsucc.push(res.fileID);
        },
        fail: err => {
          console.log(err);
        },
        complete: function() {
          n++;
          if (n < files.length) {
            uploadFun();
          } else {
            callback(uploadsucc);
          }
        }
      });
    };

    uploadFun();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})