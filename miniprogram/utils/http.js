var md5 = require('md5.js')
function req(url, data, cb, method) {

  for (var Key in data) {
    if (data[Key] === null) {
      delete data[Key];
    }
  }

  wx.request({
    url:  url,
    data: data,
    method: method || 'GET',
    header: {
      "content-type": "application/x-www-form-urlencoded",
      
    },
    success: function (res) {
      return typeof cb == "function" && cb(res)
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    }
  })
}
module.exports = {
  req: req,
}