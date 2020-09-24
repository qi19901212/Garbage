# 垃圾分类小程序
## 小程序使用到的云开发内容
> 不了解小程序云开发请访问[文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

云函数，云数据库：
- 数据库：存储四种垃圾分类的相关垃圾数据， 创建表commit,sort，product。把sort.json 和product.csv 导入云数据库即可
- 云函数：获取百度识别库的accessToken
[百度AI识别库地址](http://ai.baidu.com/docs#/ImageClassify-API/ebc492b1)
[QQ AI地址](https://ai.qq.com/)

## 需要修改为自己的key 
1. 小程序key 在文件project.config.json->appid 记住创建小程序的时候选择云开发
2. 百度key 主要做拍照识别的cloudfunctions->baiduAccessToken->index->apiKey和secretKey
此处替换为：API Key 和 Secret Key
3. 智能询问采用ai.qq 的智能闲聊接口 key在pages->android->qa->app_id和appKey 

## 云开发管理系统
此管理系统用来管理这个小程序的数据，这样子我们彻底不需要服务器了。
[GarbageAdmin](https://github.com/qi19901212/GarbageAdmin)
方便管理小程序云的数据

## 常见错误
1. 没有自己部署云函数
2. 数据库没有给与相应的权限，最好给最大权限
3. 需要的key 配置错误。
4. 没有创建数据库名称

## 最常见错误（遇到的人最多）
![错误](https://6c61-laji-bopv4-1259505195.tcb.qcloud.la/11111111111.png?sign=27ab0e0c9ea4f776c7da31155148feb8&t=1582555839
)
![解决办法](https://6c61-laji-bopv4-1259505195.tcb.qcloud.la/2222222.png?sign=f40dcc35a1057378883bf0fb99c17c16&t=1582556012)

## 直接扫码体验
![垃圾分类智能工具](https://6c61-laji-bopv4-1259505195.tcb.qcloud.la/%E4%B8%8B%E8%BD%BD.png?sign=9ac1d35da98fdf1ff62950948e267f05&t=1562463997)
## 其他兄弟的垃圾分类小程序
![一键查垃圾分类](https://github.com/qi19901212/Garbage/blob/master/miniprogram/qr/laji1.jpg)
![222](https://github.com/qi19901212/Garbage/blob/master/miniprogram/qr/222222.jpg)
![333](https://github.com/qi19901212/Garbage/blob/master/miniprogram/qr/3333333.jpg)
![444](https://github.com/qi19901212/Garbage/blob/master/miniprogram/qr/44444.jpg)
![555](https://github.com/qi19901212/Garbage/blob/master/miniprogram/qr/55555.jpg)
![666](https://github.com/qi19901212/Garbage/blob/master/miniprogram/qr/66666.jpg)


## 有什么问题可以访问我的群
https://gitee.com/sunqi/personal-contact-information
## 垃圾库 新增
https://pan.baidu.com/s/1PM7ZUB5-bVyktVbSefYDZg?errno=0&errmsg=Auth%20Login%20Sucess&&bduss=&ssnerror=0&traceid=


## 转载问题
转载请署名作者，不得作为商业用途，禁止售卖。
[协议](https://github.com/qi19901212/Garbage/blob/master/LICENSE)

 


