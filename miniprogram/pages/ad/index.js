let videoAd = null
Page({
  data: {
    score:0,
    isLogin:false,
  },

  onLoad: function (options) {
    var scoreStr=wx.getStorageSync("score")
    if(scoreStr!=""){
      this.data.score = parseInt(scoreStr)
      this.setData({
        score: this.data.score
      })
    }
    
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-c1cddb00bb10218c'
      })
      var that=this
      videoAd.onLoad(() => { })
      videoAd.onError((err) => { })
      videoAd.onClose((res) => { 
          if (res && res.isEnded) {
            that.data.score =that.data.score+10
            that.setData({
              score: that.data.score
            })
            wx.setStorageSync("score", that.data.score)
            wx.showToast({
              title: '获取积分成功',
              icon:"none"
            })
          } else {
            wx.showToast({
              title: '打赏失败',
              icon: "none"
            })
          }

      })
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res.userInfo)
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                isLogin:true
              })
            }
          })
        }else{
            this.setData({
              isLogin:false
            })
        }
      }
    })
  },
  onGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      this.setData({
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
         isLogin: true
      })
      this.onOpenAd()
    }
  },
  onOpenAd:function(){
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            console.log('激励视频 广告显示失败')
          })
      })
    }
  }
})