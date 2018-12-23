//index.js
const app = getApp()

Page({
  data: {
    scale: 12,
    markers: [],
    scrollTop: 0
  },
  bindmarkertap: function (e) {
    wx.navigateTo({
      url: '/pages/detail/index?id=' + e.markerId
    })
  },

  bindregionchange: function (e) {
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
          success: function (e) {
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
            if (dis > 80 * 1000) {

              wx.showToast({
                title: '当前范围太大，请缩小范围',
                icon: "none",
                success: function () {
                  that.setData({
                    scale: 12
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
              success: function (e) {
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

                  console.log(ids);
                  wx.cloud.init();
                  wx.cloud.callFunction({
                    name: 'querygeolist',
                    data: {
                      ids: ids
                    },
                    complete: res => {
                      let resultArray = res.result.result || [];
                      console.log(resultArray);

                      var markers = [];
                      for (var i = 0; i < resultArray.length; i++) {
                        let ent = resultArray[i];
                        ent.icon = "/style/imgs/p-" + ent.catekey + ".png";
                        ent.date = app.getDateFromTS(ent.date);

                        markers.push({
                          id: ent._id,
                          latitude: ent.lat,
                          longitude: ent.lng,
                          iconPath: ent.icon,
                          width: 25,
                          height: 25,
                          label: {
                            content: ' '+ent.title+' ',
                            fontSize: 11,
                            color: "#fff",
                            bgColor: "#F24056",
                            padding: 1,
                            borderRadius: 3,
                            anchorX: -20,
                            anchorY: -40
                          }
                        });
                      }

                      that.setData({
                        markers: markers,
                        datalist: resultArray
                      });


                      /*
                                            console.log(resultArray);
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
                                            */
                      /*
                                            if (deleteids && deleteids.length) {
                                              app.removeGEOData(deleteids, () => {
                                                console.log('remove success');
                                              });
                                            }*/
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

  onShow: function () {

    let that = this;

    app.getLocation((r) => {
      that.setData({
        latitude: r.latitude,
        longitude: r.longitude
      });
      that.initData();
    });

    /*
    wx.showToast({
      title: app.getDisance({ lat: 31.35475, lng: 120.98181 }, { lat: 31.36475, lng: 120.98281 }).toString()
    })
    */
  },
  onLoad: function () {
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