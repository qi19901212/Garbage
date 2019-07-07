var md5 = require('../../utils/md5.js')
var http = require('../../utils/http.js')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: "",
    chats: [],
    StatusBar:0,
    scrollTop:0,
    inputvalue:""
  },
  requestData: {
    app_id: '',
    time_stamp: '',
    nonce_str: '',
    text: '',
    sign: ''
  },
  submitContent: function (content) {
    this.requestData.text = content
    console.log("this.requestData.text", this.requestData.text)
    if (this.requestData.text == '' || this.requestData.text == null) {
      wx.showToast({
        title: '请输入内容',
      })
      return
    }
    wx.showLoading({
      title: '正在加载中....',
    })
    this.requestData.time_stamp = Math.round(new Date().getTime() / 1000).toString();
    this.requestData.nonce_str = util.generateRandomString(24)
    var md5Str = md5.hexMD5(Date.now().toString()).toString()
    var map = new Map();
    map.set("app_id", this.requestData.app_id)
    map.set("time_stamp", this.requestData.time_stamp)
    map.set("nonce_str", this.requestData.nonce_str)
    map.set("session", md5Str)
    map.set("question", encodeURIComponent(this.requestData.text))
    console.log("encodeURIComponent===", encodeURIComponent(this.requestData.text.trim()))
    var md5Param = util.signTengxunAI(map)
    this.requestData.sign = md5Param
    var that = this
    http.req('https://api.ai.qq.com/fcgi-bin/nlp/nlp_textchat', {
      app_id: this.requestData.app_id,
      time_stamp: this.requestData.time_stamp,
      nonce_str: this.requestData.nonce_str,
      question: this.requestData.text,
      session: md5Str,
      sign: md5Param
    }, function (res) {
      wx.hideLoading()
      console.log("that.data=" + JSON.stringify(res.data.data))
      var content = { content: res.data.data.answer, type: 0 }
      that.data.chats.push(content)
      var height = that.data.chats.length * 100
      console.log("that.data.chats=" + JSON.stringify(that.data.chats))
      that.setData({
        chats: that.data.chats,
        scrollTop: height,
      })
    })
  },
  onLoad: function (options) { 
    wx.getSystemInfo({
      success: e => {
        this.data.StatusBar = e.statusBarHeight;
      }
    })
  },
  inputContent:function(e){
    this.setData({
      content: e.detail.value
    })
  },
  onSend:function(){
    if (this.data.chats.length>100) {
      this.data.chats=[]
    }
    if (this.data.content==""){
      wx.showToast({
        title: '请输入内容...',
        icon:"none"
      })
      return
    }
    var meContent={content:this.data.content,type:1}
    this.data.chats.push(meContent)
    var height = this.data.chats.length * 100 
    var lajiContent=this.data.content
    this.submitContent(lajiContent)
    this.setData({
      chats:this.data.chats,
      scrollTop: height,
      inputvalue:""
    })
    this.data.content=""
  }
})