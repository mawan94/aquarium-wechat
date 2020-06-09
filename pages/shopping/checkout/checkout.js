var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');

var app = getApp();

Page({
  data: {
    fileRootUrl: api.fileRootUrl,
    checkedGoodsList: [],
    checkedAddress: null,
    checkedCoupon: null,
    // couponList: [],
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00,    //快递费
    couponPrice: 0.00,     //优惠券的价格
    orderTotalPrice: 0.00,  //订单总价
    actualPrice: 0.00,     //实际需要支付的总价
    appendDeliveryFee: 0.00, // 按距离需要追加的配送费
    // addressId: 0,
    // couponId: 0,
  },
  onLoad: function (options) {
    this.getActualPrice()
  },

  getCheckoutInfo: function () {
    let customerId = app.globalData.userInfo ? app.globalData.userInfo.customerId: ''
    util.request(api.CartCheckout, { customerId }).then( (res) => {
        this.setData({ 
          checkedGoodsList: res.data.cart,
          packagingFee: res.data.packagingFee,
          serviceFee: res.data.serviceFee,
          freightPrice: res.data.deliveryFee,
          goodsTotalPrice: res.data.productTotalPrice,
          orderTotalPrice: res.data.totalPrice
        });
    });
  },


  selectAddress() {
    wx.navigateTo({
      url: '../../ucenter/address/address?back=checkout',
    })
  },

  selectCoupon() {
    wx.navigateTo({
      url: '../../ucenter/coupon/coupon?back=checkout',
    })
  },

  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 地址页面选择的地址
    let checkoutAddressClick = app.globalData.checkoutAddressClick
    // 优惠券页面选择的优惠券
    let checkoutCouponClick = app.globalData.checkoutCouponClick
    // 选中的地址
    if (checkoutAddressClick) {
      this.setData({
        checkedAddress: checkoutAddressClick
      })
       //计算配送步长价格
      this.getDeliveryAppendFee(checkoutAddressClick.customerReceiveId)
    }else {
      checkedAddress: null
    }
    // 选中的优惠券
    if (checkoutCouponClick) {
      this.checkCouponAvailable()
    }
    this.getCheckoutInfo();

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  },


  // 获取实付款 (刷新检测)
  getActualPrice: function() {
    setInterval(() => {
      let { orderTotalPrice, appendDeliveryFee, checkedCoupon} = this.data;
      console.log(`orderTotalPrice:${orderTotalPrice}`)
      console.log(`appendDeliveryFee:${appendDeliveryFee}`)
      console.log(`checkedCoupon:${checkedCoupon}`)
      
      let actualPrice = orderTotalPrice + appendDeliveryFee;
      console.log( `actualPrice:${actualPrice}`)
      if (checkedCoupon) {
        actualPrice = actualPrice - checkedCoupon.deduction
      } 
      this.setData({ actualPrice})
    }, 1000)
  },

  // 校验优惠券是否可用
  checkCouponAvailable: function(customerCoupon) {
    let tryTimes = 0;
    let interval = setInterval((coupon, tryTimes) => {
      // 抵扣金额 使用门槛 使用限制(微信&&余额，余额)
      let { deduction, priceLimit, useLimit} = customerCoupon
      // 包装费  服务费  配送费  商品总价 综合总价格（按基本距离计算的配送费）
      let { packagingFee, serviceFee, freightPrice, goodsTotalPrice, orderTotalPrice, appendDeliveryFee} = this.data;
      let orderTotalMoney = appendDeliveryFee + orderTotalPrice
      // 不满足条件情况下重试等待(网络异步)
      if (orderTotalMoney < priceLimit) {
        if (tryTimes > 5) {
          app.globalData.checkoutCouponClick = null;
          clearInterval(interval)
        } else {
          tryTimes = tryTimes + 1
        }
      }else {
        this.setData({
          checkedCoupon: coupon
        })
      }
    }, 1000, customerCoupon, tryTimes)
  },

  // 按照距离长度计算的附加配送费
  getDeliveryAppendFee: function (customerReceiveId) {
    util.request(api.AppendDeliveryFee, { customerReceiveId}).then(res => {
      console.log(res)
      this.setData({ appendDeliveryFee:res.data})
    });
  },


  submitOrder: function () {
    // if (this.data.addressId <= 0) {
    //   util.showErrorToast('请选择收货地址');
    //   return false;
    // }
    // util.request(api.OrderSubmit, { addressId: this.data.addressId, couponId: this.data.couponId }, 'POST').then(res => {
    //   if (res.errno === 0) {
    //     const orderId = res.data.orderInfo.id;
    //     pay.payOrder(parseInt(orderId)).then(res => {
    //       wx.redirectTo({
    //         url: '/pages/payResult/payResult?status=1&orderId=' + orderId
    //       });
    //     }).catch(res => {
    //       wx.redirectTo({
    //         url: '/pages/payResult/payResult?status=0&orderId=' + orderId
    //       });
    //     });
    //   } else {
    //     util.showErrorToast('下单失败');
    //   }
    // });
  }
})