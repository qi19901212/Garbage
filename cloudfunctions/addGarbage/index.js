// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("name===="+event.name)
      let dataBack=""
      var datas =await db.collection('product').
      where({ name: event.name }).get()
      console.log(datas)
      dataBack=datas.data
      if (datas.data.length>0){
        dataBack = { errCode: 1, errMsg: "已经存在" }
      }else{
        var result = await db.collection('product').add({
          data: {
            name: event.name,
            sortId: event.sortId
          }
        })
        if (result._id == undefined || result._id == "" ){
          dataBack = { errCode: 0, errMsg: "插入失败" }
        }else{
          dataBack = { errCode: 0, errMsg: "插入成功" }
        }
      }
      resolve({
        data:dataBack,
      })
    } catch (error) {
      console.log(error)
      if (!error.code) reject(error)
      resolve(error)
    }
  })

  
}