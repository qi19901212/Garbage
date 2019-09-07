const rq = require('request-promise')
// 
/**
 * 获取百度ai AccessToken
 */
exports.main = async(event, context) => {
  let apiKey = '',
    grantType = 'client_credentials',
    secretKey = '',
    url = `https://aip.baidubce.com/oauth/2.0/token`

   return  await rq({
        method: 'POST',
        url,
        form: {
          "grant_type": grantType,
          "client_secret": secretKey,
          "client_id": apiKey
        },
        json: true
      }).then(data=>{
        return Promise.resolve({
          code: 0,
          data,
          info: '操作成功！'
        })
      }).catch(err=>{
        console.log(error)
        if (!error.code){
          return Promise.reject(error)
        } 
        return error
      })
}