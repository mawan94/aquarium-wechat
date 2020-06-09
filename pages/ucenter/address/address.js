var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({
  data: {
    addressList: [],
    back: ''
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    if (options.back) {
      this.setData({
        back: options.back
      })
    }
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
    this.getAddressList();
  },
  getAddressList() {
    let customerId = app.globalData.userInfo ? app.globalData.userInfo.customerId : ''
    util.request(api.AddressList, {
      customerId
    }).then((res) => {
      this.setData({
        addressList: res.data
      });
    });
  },

  addressAddOrUpdate(event) {
    let back = this.data.back
    let customerReceiveId = event.currentTarget.dataset.customerReceiveId
    if (back && customerReceiveId) {
      util.request(api.AddressDetail, {
        customerReceiveId
      }).then((res) => {
        app.globalData.checkoutAddressClick = res.data
        wx.navigateTo({
          url: '/pages/shopping/checkout/checkout',
        })
      });
      return;
    }
    customerReceiveId ?
      wx.navigateTo({
        url: '/pages/ucenter/addressAdd/addressAdd?customerReceiveId=' + customerReceiveId
      }) : back ?
      wx.navigateTo({
        url: '/pages/ucenter/addressAdd/addressAdd?back=checkout'
      }) :
      wx.navigateTo({
        url: '/pages/ucenter/addressAdd/addressAdd'
      })
  },
  deleteAddress(event) {
    // console.log(event.target)
    // let that = this;
    // wx.showModal({
    //   title: '',
    //   content: '确定要删除地址？',
    //   success: function (res) {
    //     if (res.confirm) {
    //       let customerReceiveId = event.target.dataset.customerReceiveId;
    //       util.request(api.AddressDelete, {customerReceiveId }, 'POST').then(function (res) {
    //         that.getAddressList();
    //       });
    //     }
    //   }
    // })
    // return false;

  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})