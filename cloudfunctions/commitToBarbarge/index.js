// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("name====" + event.name)
      console.log("name====" + JSON.stringify(event))
      let dataBack = ""
      var datas = await db.collection('product').
        where({ name: event.name }).get()
      console.log(datas)
      dataBack = datas.data
      if (datas.data.length > 0) {
        var result = await db.collection('commit').where(
          { keyword: event.name, _id: event.id }).remove()
        console.log("===" + JSON.stringify(result))
        var resultStats=result.stats
        console.log("===" + JSON.stringify(resultStats))
        console.log("===" + JSON.stringify(resultStats.removed))
        if (resultStats.removed == 0 || resultStats.removed == 1) {
          dataBack = { errCode: 0, errMsg: "已经存在,commit 表删除成功" }
        } else {
          dataBack = { errCode: 1, errMsg: "已经存在，但commit表删除失败" }
        }
      } else {
        var result = await db.collection('product').add({
          data: {
            name: event.name,
            sortId: event.sortId
          }
        })
        if (result._id == undefined || result._id == "") {
          dataBack = { errCode: 0, errMsg: "插入失败" }
        } else {
          //去删除 commit 表的相关数据
          var result = await db.collection('commit').where(
            { keyword: event.name ,_id:event.id}).remove()
            console.log("==="+JSON.stringify(result))
          var resultStats = result.stats
          console.log("===" + JSON.stringify(resultStats))
          console.log("===" + JSON.stringify(resultStats.removed))
          if (resultStats.removed == 0 || resultStats.removed == 1){
            dataBack = { errCode: 0, errMsg: "完美成功" }
            }else{
            dataBack = { errCode: 1, errMsg: "插入成功，但commit表删除失败" }
            }
        }
      }
      resolve({
        data: dataBack,
      })
    } catch (error) {
      console.log(error)
      if (!error.code) reject(error)
      resolve(error)
    }
  })


}