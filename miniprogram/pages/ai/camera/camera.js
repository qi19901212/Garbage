var md5 = require('../../../utils/md5.js')
var http = require('../../../utils/http.js')
var util = require('../../../utils/util.js')
Page({
  data: {
    accessToken: "",
    isShow: false,
    results: [],
    src: "",
    isCamera: true,
    btnTxt: "拍照",
    cWidth: 0,
    cHeight: 0
  },
  onLoad() {
    this.ctx = wx.createCameraContext()
    var time = wx.getStorageSync("time")
    var curTime = new Date().getTime()
    var timeInt = parseInt(time)
    var timeNum = parseInt((curTime - timeInt) / (1000 * 60 * 60 * 24))
    console.log("=======" + timeNum)
    var accessToken = wx.getStorageSync("access_token")
    console.log("====accessToken===" + accessToken + "a")
    if (timeNum > 28 || (accessToken == "" ||
        accessToken == null || accessToken == undefined)) {
      this.accessTokenFunc()
    } else {
      this.setData({
        accessToken: wx.getStorageSync("access_token")
      })
    }
  },
  takePhoto() {
    var that = this
    if (this.data.isCamera == false) {
      this.setData({
        isCamera: true,
        btnTxt: "拍照"
      })
      return
    }
    this.ctx.takePhoto({
      quality: 'low',
      success: (res) => {
        that.setData({
          src: res.tempImagePath,
          isCamera: false,
          btnTxt: "重拍"
        })
        wx.showLoading({
          title: '正在加载中',
        })
        var index = res.tempImagePath.lastIndexOf(".")
        console.log("===index===" + index)
        var mineType = res.tempImagePath.substr(index + 1)
        console.log("===mineType===" + mineType)
        mineType = "image/" + mineType
        wx.getImageInfo({
          src: res.tempImagePath,
          success: function (res) {
            that.cutImg(res)
          }
        })

       
      }
    })
  },
  cutImg: function(res) {
    var that = this
    var ratio = 3;
    var canvasWidth = res.width //图片原始长宽
    var canvasHeight = res.height
    while (canvasWidth > 100 || canvasHeight > 100) { // 保证宽高在400以内
      canvasWidth = Math.trunc(res.width / ratio)
      canvasHeight = Math.trunc(res.height / ratio)
      ratio++;
    }
    that.setData({
      cWidth: canvasWidth,
      cHeight: canvasHeight
    })
    //----------绘制图形并取出图片路径--------------
    var ctx = wx.createCanvasContext('canvas')
    ctx.drawImage(res.path, 0, 0, canvasWidth, canvasHeight)
    ctx.draw(false, setTimeout(function() {
      wx.canvasToTempFilePath({
        canvasId: 'canvas',
        fileType:'png',
        destWidth: canvasWidth,
        destHeight: canvasHeight,
        success: function(res) {
          console.log(res.tempFilePath) //最终图片路径

          wx.getFileSystemManager().readFile({
            filePath: res.tempFilePath,
            encoding: "base64",
            success: res => {
              that.onCheckImg( res.data)
            },
            fail: res => {
              wx.hideLoading()
              wx.showToast({
                title: '拍照失败,未获取相机权限或其他原因',
                icon: "none"
              })
            }
          })
        },
        fail: function(res) {
          wx.hideLoading()
          console.log(res.errMsg)
        }
      })
    }, 100))
  },
  // 默认图片不能超过1m
  onCheckImg: function(buffer) {
    var that = this
    wx.cloud.callFunction({
      name: "checkImg",
      data: {
        type: 'image/png',
        buffer: buffer
      },
      success: res => {
        console.log("=onCheckImg=success===" + JSON.stringify(res))
        if (res.result.errCode == 0) {
          that.req(that.data.accessToken, buffer)
        } else if (res.result.errCode == 87014) {
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '内容含有违法违规内容',
          })
        } else {
          wx.hideLoading()
        }
      },
      fail: err => {
        wx.hideLoading()
        console.log("=onCheckImg=err===" + JSON.stringify(err))
        // return cb(err)
      },
    })
  },
  req: function(token, image) {
    var that = this
    http.req("https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general?access_token=" + token, {
      "image": image
    }, function(res) {
      wx.hideLoading()
      console.log(JSON.stringify(res))
      var code = res.data.err_code
      if (code == 111 || code == 100 || code == 110) {
        wx.clearStorageSync("access_token")
        wx.clearStorageSync("time")
        that.accessTokenFunc()
        return
      }
      var num = res.result_num
      var results = res.data.result
      if (results != undefined && results != null) {
        that.setData({
          isShow: true,
          results: results
        })
        console.log(results)
      } else {
        wx.clearStorageSync("access_token")
        wx.showToast({
          icon: 'none',
          title: 'AI识别失败,请重新尝试',
        })
      }
    }, "POST")
  },
  accessTokenFunc: function() {
    var that = this
    console.log("accessTokenFunc is start")
    wx.cloud.callFunction({
      name: 'baiduAccessToken',
      success: res => {
        console.log("==baiduAccessToken==" + JSON.stringify(res))
        that.data.accessToken = res.result.data.access_token
        wx.setStorageSync("access_token", res.result.data.access_token)
        wx.setStorageSync("time", new Date().getTime())
      },
      fail: err => {
        wx.clearStorageSync("access_token")
        wx.showToast({
          icon: 'none',
          title: '调用失败,请重新尝试',
        })
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  radioChange: function(e) {
    console.log(e)
    console.log(e.detail)
    console.log(e.detail.value)
    wx.navigateTo({
      url: '/pages/result/list?keyword=' + e.detail.value,
    })
  },
  hideModal: function() {
    this.setData({
      isShow: false,
    })
  },
  stopRecord() {
    this.ctx.stopRecord({
      success: (res) => {
        this.setData({
          src: res.tempThumbPath,
          videoSrc: res.tempVideoPath
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  }

})