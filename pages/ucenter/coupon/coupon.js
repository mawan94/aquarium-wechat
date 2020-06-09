var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({
  data: {
    couponList: [],
    back: ''
  },

  onLoad: function (options) {
    if (options.back) {
      this.setData({
        back: options.back
      })
    }
  },

  onReady: function () {
  },

  onShow: function () {
    util.request(api.CustomerCoupon).then( (res) => {
      console.log(res)
      this.setData({ couponList: res.data})
    });
  },

  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  // 点击优惠券
  handleClickCoupon: function(event) {
    let customerCoupon = event.currentTarget.dataset.item
    let back = this.data.back;
    if(back) {
      app.globalData.checkoutCouponClick = customerCoupon
      wx.navigateTo({
        url: '/pages/shopping/checkout/checkout',
      })
    }
  }
})