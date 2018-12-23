// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  let type = event.type;
  let openid = wxContext.OPENID;

  const db = cloud.database();
  const cmd = db.command;
  let qresult = null;

  if (type == "my") {
    qresult = await db.collection('info').where({
      openid: cmd.eq(openid)
    }).orderBy('date', 'desc').get();

  } else if (type == "fav") {

    let favs = await db.collection('infofav').where({
      openid: cmd.eq(openid)
    }).limit(100).get();

    if (favs && favs.data && favs.data.length) {
      let ids = [];

      for (let n = 0; n < favs.data.length; n++) {
        ids.push(favs.data[n].id);
      }

      qresult = await db.collection('info').where({
        _id: cmd.in(ids)
      }).orderBy('date', 'desc').get();
    }
  }

  let result = [];

  if (qresult && qresult.data && qresult.data.length) {
    result = qresult.data;
  }

  return {
    event,
    result,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID
  }
}