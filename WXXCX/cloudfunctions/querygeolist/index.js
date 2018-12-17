// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  let ids = event.ids;

  const db = cloud.database();
  const cmd = db.command;

  let qresult = await db.collection('info').where({
    _id: cmd.in(ids)
  }).get();

  const wxContext = cloud.getWXContext()

  return {
    event,
    result: qresult.data
  }
}