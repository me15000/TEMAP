// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let openid = wxContext.OPENID;
  let qrcode = event.qrcode;

  const db = cloud.database();
  const cmd = db.command;

  let qresult = await db.collection('user').where({
    openid: cmd.eq(openid)
  }).get();

  let savedata = {
    openid: openid,
    qrcode: qrcode
  };

  let result = null;

  if (qresult && qresult.data && qresult.data.length) {
    result = await db.collection('user').where({
      openid: openid
    }).update({
      data: savedata
    });

  } else {
    result = await db.collection('user').add({
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