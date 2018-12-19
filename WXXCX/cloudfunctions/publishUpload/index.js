// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();


  let req = {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    id: event.id,
    imgs: event.imgs
  };

  const db = cloud.database();
  const cmd = db.command;



  var result = await db.collection('info').where({
    _id: cmd.eq(req.id),
    openid: cmd.eq(req.openid)
  }).update({
    data: {
      imgs: req.imgs
    }
  });



  return {
    event,
    result
  }
}