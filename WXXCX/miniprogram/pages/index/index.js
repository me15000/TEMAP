//index.js
const app = getApp()

Page({
  data: {
    markers: [{
        id: 1,
        latitude: 31.35475,
        longitude: 120.98181,
        iconPath: "/style/imgs/p.png",
        width: 30,
        height: 30,
        label: {
          content: "xxxxxxx",
          fontSize: 14,
          color: "#fff",
          bgColor: "#795548",
          padding: 2,
          borderRadius: 3,
          anchorX: -25,
          anchorY: -50
        }
      },
      {
        id: 2,
        latitude: 31.36475,
        longitude: 120.98281,
        iconPath: "/style/imgs/p.png",
        width: 30,
        height: 30,
        label: {
          content: "xxxxxxx",
          fontSize: 14,
          color: "#fff",
          bgColor: "#795548",
          padding: 2,
          borderRadius: 3,
          anchorX: -25,
          anchorY: -50
        }
      },
      {
        id: 3,
        latitude: 31.37475,
        longitude: 120.98381,
        iconPath: "/style/imgs/p.png",
        width: 30,
        height: 30,
        label: {
          content: "xxxxxxx",
          fontSize: 14,
          color: "#fff",
          bgColor: "#795548",
          padding: 2,
          borderRadius: 3,
          anchorX: -25,
          anchorY: -50
        }
      },
      {
        id: 4,
        latitude: 31.38475,
        longitude: 120.98481,
        iconPath: "/style/imgs/p.png",
        width: 30,
        height: 30,
        label: {
          content: "xxxxxxx",
          fontSize: 14,
          color: "#fff",
          bgColor: "#795548",
          padding: 2,
          borderRadius: 3,
          anchorX: -25,
          anchorY: -50
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
          bgColor: "#795548",
          padding: 2,
          borderRadius: 3,
          anchorX: -25,
          anchorY: -50
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
  },

  onShow: function() {
    let that = this;
    app.getLocation((r) => {
      that.setData({
        latitude: r.latitude,
        longitude: r.longitude
      });
    });
  },
  onLoad: function() {

  }

})