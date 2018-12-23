// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  let openid = event.openid || wxContext.OPENID;


  const db = cloud.database();
  const cmd = db.command;


  let qresult = await db.collection('user').where({
    openid: cmd.eq(openid)
  }).get();

  let result = null;

  if (qresult && qresult.data && qresult.data.length) {
    result = qresult.data[0];
  }



  return {
    event,
    result,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID
  }
}