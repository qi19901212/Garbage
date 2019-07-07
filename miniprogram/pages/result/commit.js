const db = wx.cloud.database()
Page({
  data: {
    keyword:"",
    isCommiting:false,
  },
  onLoad: function (options) {
  var keyword=  options.keyword
  this.setData({
    keyword: keyword
  })
  },
  formSubmit:function(e){
    console.log(e)
    console.log(e.detail)
    console.log(e.detail.value)
    var keyword = e.detail.value.keyword
    if (keyword == undefined || keyword == null || keyword==""){
      wx.showToast({
        title: '请输入垃圾名称',
        icon:"none"
      })
      return
    }
      this.setData({
        isCommiting:true
      })
   
    db.collection('commit').add({
      data:{
        keyword: keyword
      },
      success:res=>{
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
      },fail:res=>{
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