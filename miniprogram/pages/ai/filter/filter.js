const db = wx.cloud.database()
Page({


  data: {
    MAX_LIMIT: 20,
    page: 0,
    dataCount: 0,
    datas: [],
    type: 1,
    logo:""
  },


  onLoad: function(options) {
    console.log(JSON.stringify(options))
    this.data.type = options.type
    var typeInt = parseInt(this.data.type)
    var title = ""
    var logoImg=""
    switch (typeInt) {
      case 1:
        title = '可回收物'
        logoImg ="/images/RecycleableWaste.jpg"
        break;
      case 2:
        title = '有害垃圾'
        logoImg = "/images/HazardouAwaste.jpg"
        break;
      case 3:
        title = '湿垃圾'
        logoImg = "/images/HouseholdfoodWaste.jpg"
        break;
      case 4:
        title = '干垃圾'
        logoImg = "/images/ResidualWaste.png"
        break;
    }
    wx.setNavigationBarTitle({
      title: title,
    })
    this.setData({
      logo:logoImg
    })
    var that=this
    db.collection('product').where({
      sortId: parseInt(this.data.type) 
    }).count({
      success: function (res) {
        that.data.dataCount=res.total
      }
    })
    this.onGetData()
  },
  onGetData: function() {
    wx.showLoading({
      title: '正在加载数据中.....',
    })
    if (this.data.dataCount < this.data.page * this.data.MAX_LIMIT) {
      wx.showToast({
        title: '数据已经加载完',
        icon: "none"
      })
      wx.hideLoading()
      return
    }
    var that = this
    if (this.data.page == 0) {
      this.data.datas = []
    }
    var datas = db.collection('product').skip(this.data.page * this.data.MAX_LIMIT).limit(this.data.MAX_LIMIT).where({
      sortId: parseInt(that.data.type)
    }).get({
      success: function(res) {
        console.log(res.data)
        wx.hideLoading()
        that.data.page = that.data.page + 1
        for (var i = 0; i < res.data.length; i++) {
          that.data.datas.push(res.data[i])
        }
        that.setData({
          datas: that.data.datas
        })
      },
      fail: res => {
        wx.hideLoading()
        wx.showToast({
          title: '数据加载失败',
          icon: "none"
        })
      }
    })
  },
  onPullDownRefresh: function() {
    this.data.page = 0
    this.onGetData()
  },

  onReachBottom: function() {
    this.onGetData()
  },

})