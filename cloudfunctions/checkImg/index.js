const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  var type = event.type
  var buffer = event.buffer
  console.log("===type==" + type)
  console.log("===buffer==" + buffer)
  try {
    const result = await cloud.openapi.security.imgSecCheck({
      media: {
        header: { 'Content-Type': 'application/octet-stream' },
        contentType: type,
        value: Buffer.from(buffer)
      }
    })
    return result
  } catch (err) {
    return err
  }
}