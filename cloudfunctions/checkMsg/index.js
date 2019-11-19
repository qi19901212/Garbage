const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async(event, context) => {
  var content = event.content
  try {
    const result = await cloud.openapi.security.msgSecCheck({
      content: content
    })
    return result
  } catch (err) {
    return err
  }
}