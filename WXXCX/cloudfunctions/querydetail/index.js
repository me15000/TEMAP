// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()

  let id = event.id;

  const db = cloud.database();
  const cmd = db.command;

  let qresult = await db.collection('info').where({
    _id: cmd.eq(id)
  }).get();

  let dataentity = null;
  if (qresult && qresult.data && qresult.data.length) {
    dataentity = qresult.data[0];
  }


  return {
    event,
    result: dataentity
  }
}