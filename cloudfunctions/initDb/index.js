// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-0fbrj'
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event) => {
  try{
    return await db.createCollection(event.dbName)
  }catch(e){
    console.log(e);
  }
  return 'ok'
}