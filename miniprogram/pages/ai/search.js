const db = wx.cloud.database()
Page({

  
  data: {
    MAX_LIMIT:20,
    page:0,
    dataCount:0,
    datas:[],
    searchTxt:"",
    logo:"",
    isSHow:false
  },
 
  onLoad: function (options) {
    this.data.dataCount = db.collection('product').count()
  },
  searchIcon:function(e){
    this.data.searchTxt= e.detail.value
    console.log("====="+e.detail.value)
    this.data.page=0
    this.onGetData()
  },
  onGetData:function(){
    wx.showLoading({
      title: '正在加载数据中.....',
    })
    if (this.data.dataCount < this.data.page * this.data.MAX_LIMIT){
      wx.showToast({
        title: '数据已经加载完',
        icon: "none"
      })
      wx.hideLoading()
      return
    }
    var that=this
    console.log("=====" + this.data.page)
    if(this.data.page==0){
      this.data.datas=[]
    }
    var datas = db.collection('product').skip(this.data.page * this.data.MAX_LIMIT).limit(this.data.MAX_LIMIT).where({
      name: db.RegExp({
        regexp: that.data.searchTxt,
      })
    }).get({
      success: function (res) {
        wx.hideLoading()
        that.data.page = that.data.page +1
        for (var i=0;i < res.data.length;i++){
          that.data.datas.push(res.data[i])
        }
       that.setData({
         datas:that.data.datas
       })
      },fail:res=>{
        wx.hideLoading()
        wx.showToast({
          title: '数据加载失败',
          icon:"none"
        })
      }
    })
  },
  onItemClick:function(event){
    var index =event.currentTarget.dataset.index
    var logoImg=""
    console.log(index)
    switch (parseInt(index)) {
      case 1:
        logoImg = "/images/RecycleableWaste.jpg"
        break;
      case 2:
        logoImg = "/images/HazardouAwaste.jpg"
        break;
      case 3:
        logoImg = "/images/HouseholdfoodWaste.jpg"
        break;
      case 4:
        logoImg = "/images/ResidualWaste.png"
        break;
    }
    console.log(logoImg)
    this.setData({
      logo:logoImg,
      isShow:!this.data.isShow
    })
  },
  hideModal:function(){
    this.setData({
      isShow: !this.data.isShow
    })
  },
  onPullDownRefresh: function () {
    this.data.page=0
    this.data.datas=[]
    this.onGetData()
  },

  onReachBottom: function () {
    this.onGetData()
  },
  
})