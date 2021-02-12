// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-0fbrj'
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event) => {
  if(!event.where){
    return await db.collection(event.dbName).get()
  }else if(event.where){
    return await db.collection(event.dbName).where(event.where).get()
  }
}