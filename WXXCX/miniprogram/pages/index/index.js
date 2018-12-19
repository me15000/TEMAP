//index.js
const app = getApp()

Page({
  data: {

    scale: 14,
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
      }

      ,
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


    ],
    scrollTop: 0
  },
  bindmarkertap: function(e) {
    console.log(e);
  },

  bindregionchange: function(e) {
    console.log(e);
    //this.initData();
    let that = this;
    if (e.type == 'end') {
      that.initData();
    }
  },

  initData() {

    let that = this;
    if (that.st) {
      clearTimeout(that.st);
      that.st = null;
    }

    that.st = setTimeout(() => {
      that.mapctx = wx.createMapContext('map');
      if (that.mapctx) {
        that.mapctx.getRegion({
          success: function(e) {
            //东北
            let p1 = {
              lat: e.northeast.latitude,
              lng: e.northeast.longitude
            };

            //西南
            let p2 = {
              lat: e.southwest.latitude,
              lng: e.southwest.longitude
            };
            let dis = app.getDisance(p1, p2);
            if (dis > 30 * 1000) {

              wx.showToast({
                title: '当前范围太大，请缩小范围',
                icon: "none",
                success: function() {
                  that.setData({
                    scale: 14
                  });
                }
              });
              return;
            }


            /*
            wx.showToast({
              title: dis + '米'
            });
            */

            //获得中心点坐标
            that.mapctx.getCenterLocation({
              success: function(e) {
                let qdata = {
                  lat: e.latitude,
                  lng: e.longitude,
                  radius: Math.floor(dis / 2)
                };

                app.queryGEOData(qdata, (data) => {

                  if (!(data && data.length)) {
                    wx.showToast({
                      title: '暂无数据，请扩大范围',
                      icon: "none"
                    })
                    return;
                  }

                  let ids = [];
                  for (var i = 0; i < data.length; i++) {
                    ids.push(data[i].Member);
                  }


                  wx.cloud.init();
                  wx.cloud.callFunction({
                    name: 'querygeolist',
                    data: {
                      ids: ids
                    },
                    complete: res => {
                      let resultArray = res.result.result || [];
                      let deleteids = [];
                      if (resultArray.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                          let nowent = data[i];
                          let nowid = nowent.Member;
                          if (!resultArray.includes(nowid)) {
                            deleteids.push({
                              lat: nowent.Position.Latitude,
                              lng: nowent.Position.Longitude,
                              value: nowent.Member
                            });
                          }
                        }
                      } else {
                        for (var i = 0; i < data.length; i++) {
                          let nowent = data[i];
                          deleteids.push({
                            lat: nowent.Position.Latitude,
                            lng: nowent.Position.Longitude,
                            value: nowent.Member
                          });
                        }
                      }

                      if (deleteids && deleteids.length) {
                        app.removeGEOData(deleteids, () => {
                          console.log('remove success');
                        });
                      }
                    }
                  });


                  console.log(data);
                });
              }
            });
          }
        });
      }
    }, 1500);


  },

  onShow: function() {
    /*
    wx.showToast({
      title: app.getDisance({ lat: 31.35475, lng: 120.98181 }, { lat: 31.36475, lng: 120.98281 }).toString()
    })
    */
  },
  onLoad: function() {
    let that = this;

    app.getLocation((r) => {
      that.setData({
        latitude: r.latitude,
        longitude: r.longitude
      });
      that.initData();
    });
  }

})