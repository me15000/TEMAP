// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  let openid = wxContext.OPENID;
  const db = cloud.database();
  const cmd = db.command;

  let id = event.id;

  let favs = await db.collection('infofav').where({
    openid: cmd.eq(openid),
    id: cmd.eq(id)
  }).get();

  if (!(favs && favs.data && favs.data.length)) {
    let savedata = {
      id: id,
      openid: openid
    };

    await db.collection('infofav').add({
      data: savedata
    });
  }

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}