// pages/game/game.js
Page({

  data: {

  },

  onLoad: function (options) {

  },
  onSkip:function(){
    wx.navigateToMiniProgram({
      appId: 'wx17128b374eab7c51',
      path: 'page/index/index',
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })
  }
})