// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  let now = new Date();
  let req = {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    title: event.title,
    catekey: event.catekey,
    lat: event.lat,
    lng: event.lng,
    formid: event.formid,
    date: now.getTime()
  };

  const db = cloud.database();
  const cmd = db.command;


  //删除7天前数据
  db.collection('info').where({
    date: cmd.lt(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  }).remove();



  //let temdate = new Date();
  let temtime = now.getTime() - 10 * 60 * 60 * 1000;
  //temdate.setTime(ms);

  let qresult = await db.collection('info').where({
    openid: cmd.eq(req.openid),
    lat: req.lat,
    lng: req.lng,
    date: cmd.gt(temtime)
  }).get();

  let savedata = {
    title: req.title,
    openid: req.openid,
    formid: req.formid,
    catekey: req.catekey,
    date: req.date,
    lng: req.lng,
    lat: req.lat,
    location: new db.Geo.Point(req.lng, req.lat),
    imgs: []
  };

  let result = null;

  try {
    if (qresult && qresult.data && qresult.data.length) {
      //已存在
      let qitem = qresult.data[0];

      result = await db.collection('info').where({
        _id: qitem._id
      }).update({
        data: savedata
      });

      result = {
        _id: qitem._id
      };

    } else {
      result = await db.collection('info').add({
        data: savedata
      });
    }

  } catch (e) {
    console.error(e)
  }

  return {
    event,
    result
  }
}