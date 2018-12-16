//app.js
function toRad(d) {
  return d * Math.PI / 180;
}

let Global = {
  user:{}
};

let AppObject = {
  Global: Global
};

function request(url, data, callback) {
  wx.request({
    url: url,
    method: data.method || 'GET',
    data: data.data || {},
    header: data.header || {
      'content-type': 'application/json'
    },
    success: function(res) {
      if (res.statusCode != 200) {
        return;
      }

      if (callback) {
        callback(res.data);
      }
    },
    fail: function() {

    }
  })

}


const updateFormId = function(authcode, formid) {
  let requestData = {
    method: 'GET',
    data: {
      authcode: authcode,
      formid: formid
    }
  };

  request('https://api.fun5.cn/WeixinAPI/FormId',
    requestData,
    (r) => {
      console.log("uinfo.do:" + r);
    });
}







//获得用户信息

const checkSession = function(callback) {
  wx.checkSession({
    success: function() {
      //登录成功
      callback(true);
    },
    fail: function() {
      //登录态过期
      callback(false);
    }
  });
}

const userLogin = function(callback, callbackFun) {
  wx.login({
    success: function(res) {
      callback(res, callbackFun);
    }
  });
}

const getSetting = function(callback) {
  wx.getSetting({
    success: (res) => {
      callback(res);
    }
  })
}




const getSysInfo = function(callback) {
  callback = callback || function() {};
  let sysinfo = Global.sysinfo;
  if (sysinfo) {
    callback(sysinfo);
    return;
  }

  var callbakfun = (res) => {
    Global.sysinfo = res;
    callback(res);
  };

  wx.getSystemInfo({
    success: function(res) {
      callbakfun(res);
    },
    fail: function() {
      callbakfun(null);
    }
  })
}



//用户登录并获得用户信息
const userLoginAndGetUserInfo = function(callback) {

  let testData = () => {
    if (Global.user) {
      if (Global.user.authcode && Global.user.openid) {
        callback({
          authcode: Global.user.authcode,
          openid: Global.user.openid
        });
        return true;
      }
    }

    return false;
  };

  if (testData()) {
    return;
  }

  userLogin((res) => {
    if (!res.code) {
      console.log('error:res.code is null or empty');
      return;
    }

    let requestData = {
      data: {
        code: res.code
      }
    };

    let reqfun = () => {
      let url = 'https://api.fun5.cn/WeixinAPI/Login';
      request(url,
        requestData,
        (r) => {

          if (r.authcode && r.code == 0) {
            Global.user.authcode = r.authcode;
            Global.user.openid = r.openid;

            callback({
              authcode: r.authcode,
              openid: r.openid
            });
          }
        }, false);
    };

    if (!Global.userIGeting) {
      Global.userIGeting = true;
      reqfun();
    } else {
      let si = null;
      si = setInterval(() => {
        if (testData()) {
          if (si) {
            clearInterval(si);
          }
        }
      }, 200);
    }
  });
}

const getUserInfoMain = function(callback) {

  if (Global.user && Global.user.authcode) {
    //直接获得用户信息
    callback({
      authcode: Global.user.authcode,
      openid: Global.user.openid
    });
  } else {
    //登录并获得用户信息
    userLoginAndGetUserInfo(callback);
  }
}



AppObject.updateFormId = updateFormId;

AppObject.getUserInfoMain = getUserInfoMain;

AppObject.submitGEOData = function(data) {
  getUserInfoMain((info) => {
    wx.request({
      url: 'https://api.fun5.cn/GEO/Submit',
      data: {
        project: "temap",
        lat: data.lat,
        lng: data.lng,
        id: data.id,
        authcode: info.authcode
      }
    });
  });

};

AppObject.queryGEOData = function(data, callback) {
  getUserInfoMain((info) => {
    wx.request({
      url: 'https://api.fun5.cn/GEO/List',
      data: {
        project: "temap",
        lat: data.lat,
        lng: data.lng,
        radius: data.radius || 10000,
        authcode: info.authcode
      },
      success: function(res) {
        callback(res.data);
      }
    });
  });
};

AppObject.getDisance = function(p1, p2) {
  let lat1 = p1.lat,
    lng1 = p1.lng,
    lat2 = p2.lat,
    lng2 = p2.lng;

  var dis = 0;
  var radLat1 = toRad(lat1);
  var radLat2 = toRad(lat2);
  var deltaLat = radLat1 - radLat2;
  var deltaLng = toRad(lng1) - toRad(lng2);
  var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
  return dis * 6378137;
};


AppObject.getLocation = function(callback) {
  let that = this;
  wx.getLocation({
    type: "gcj02",
    altitude: true,
    success: function(r) {
      that.Global["location"] = r;
      callback(r);
    },
    fail: function() {
      wx.showToast({
        title: '获取位置失败',
        icon: "none"
      })
    }
  });
};


AppObject.settings = [{
    "key": "scope.userLocation",
    "info": "需要先同意授权地理位置"
  },
  {
    "key": "scope.writePhotosAlbum",
    "info": "需要先同意授权保存到相册"
  },
  {
    "key": "scope.camera",
    "info": "需要先同意授权摄像头"
  }
];



AppObject.initSetting = function(key) {
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
};

AppObject.initSettingItem = function(res, i) {
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
};

AppObject.initSettingAll = function() {
  let that = this;
  wx.getSetting({
    success(res) {
      for (var i = 0; i < that.settings.length; i++) {
        that.initSettingItem(res, i);
      }
    }
  });
};



AppObject.onLaunch = function() {
  getUserInfoMain((info) => {
    
  });
  this.initSettingAll();
};


App(AppObject);