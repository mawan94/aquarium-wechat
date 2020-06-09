//app.js
var util = require('./utils/util.js');
var api = require('./config/api.js');
var QQMapWX = require('./lib/qqmap-wx-jssdk.min.js');
var qqmapsdk = new QQMapWX({
  key: 'HWVBZ-VUALV-EEVPJ-U2TE2-2FVQ3-L3BNH' // 申请的key
})
App({
  onLaunch: function() {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    // wx.login({
    // success: res => {
    // util.request(api.Code2Session, { js_code: res.code}).then(result => {
    //   console.error(result)
    // })
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    // }
    // })

    // 获取用户信息
    // wx.getSetting({
    // success: res => {
    // if (res.authSetting['scope.userInfo']) {
    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    // wx.getUserInfo({
    // success: res => {
    // 可以将 res 发送给后台解码出 unionId
    // this.globalData.userInfo = res.userInfo

    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
    // if (this.userInfoReadyCallback) {
    // this.userInfoReadyCallback(res)
    // }
    // }
    // })
    // }
    // }
    // })
    this.userLogin()
   
    // this.getOpenId()
  },

  // 用户微信登录
  getUserInfo: function(openId) {
    let _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              _this.updateUserInfo(openId, res.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  // 更新用户信息
  updateUserInfo: function(openId, userInfo) {
    let _this = this;
    util.request(api.UserInfoUpdate, {
      openId,
      ...userInfo
    }, 'POST').then(res => {
      // wx.setStorageSync('userInfo', res.data); //将userInfo存入本地缓存
      _this.globalData.userInfo = res.data
    })
  },

  // 获取openId
  userLogin: function() {
    wx.login({
      success: res => {
        util.request(api.Code2Session, {
          js_code: res.code
        }).then(result => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          this.getUserInfo(result.data.openid)
        })
      }
    })
  },

  globalData: { 
    userInfo: null,
    qqmapsdk: qqmapsdk,
    selectedAddress: {},// 当前addressSelector页面下选中的提示地址
    checkoutAddressClick: null, // 下单时点击的收货地址
    checkoutCouponClick: null // 下单时点击的优惠券
  }
})