const db = wx.cloud.database()
Page({
  data: {
    keyword: "",
    isCommiting: false,
  },
  onLoad: function(options) {
    var keyword = options.keyword
    this.setData({
      keyword: keyword
    })
  },
  onCheckMsg: function(content, cb) {
    wx.cloud.callFunction({
      name: "checkMsg",
      data: {
        content: content
      },
      success: res => {
        return cb(res.result)
      },
      fail: err => {
        // return cb(err)
      },
    })
  },
  formSubmit: function(e) {
    var that=this
    var keyword = e.detail.value.keyword
    if (keyword == undefined || keyword == null || keyword == "") {
      wx.showToast({
        title: '请输入垃圾名称',
        icon: "none"
      })
      return
    }
    this.setData({
      isCommiting: true
    })
    this.onCheckMsg(keyword,function(res){
      console.log("res====" + JSON.stringify(res))
      if(res.errCode==0){
        that.onCommit(keyword)
      }else{
        that.setData({
          isCommiting: false
        })
        wx.showToast({
          title: '涉及敏感词汇',
          icon:"none"
        })
      }
    })
  },
  onCommit: function (keyword){
    db.collection('commit').add({
      data: {
        keyword: keyword
      },
      success: res => {
        console.log(res)
        this.setData({
          isCommiting: false
        })
        wx.showToast({
          title: '提交成功',
          icon: "none"
        })
        wx.switchTab({
          url: '/pages/ai/index',
        })
      },
      fail: res => {
        this.setData({
          isCommiting: false
        })
        wx.showToast({
          title: '提交失败',
          icon: "none"
        })
      }
    })
  }
})