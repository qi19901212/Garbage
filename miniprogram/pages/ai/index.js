Page({

  data: {
    SHOW_TOP: true,
  },

  onLoad: function(options) {
    console.log("AAAAAAAAA")
    var myDate = new Date();
    var isShowed=wx.getStorageSync("tip")
    if(isShowed!=1){
      setTimeout(() => {
        this.setData({
          SHOW_TOP: false
        })
        wx.setStorageSync("tip", 1)
      }, 2 * 1000)
    }else{
      this.setData({
        SHOW_TOP: false
      })
    }
  },

  goSearch: function() {
    wx.navigateTo({
      url: 'search',
    })
  },
  onBindCamera: function() {
    wx.navigateTo({
      url: 'camera/camera',
    })
  },
  onAikefu: function() {
    wx.navigateTo({
      url: '/pages/android/qa',
    })
  },
  onShareAppMessage: function() {
    return {
      title: "智能分类垃圾",
      imageUrl: "https://6c61-laji-bopv4-1259505195.tcb.qcloud.la/laji.png?sign=7c8d38e435eb3104fcf5933ebff667f5&t=1561904613",
      path: "pages/ai/index"
    }
  }
})