//index.js
//获取应用实例
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const recharge = require('../../services/pay.js');

const app = getApp()

Page({
  data: {
    data:[],
    active: null,
    show:false,
    num: null,
    showadd: false
  },
  chooseAdd() {
    this.setData({
      showadd: !this.data.showadd
    })
  },
  
  handleClickCard (e) {
    this.setData({
      active: e.currentTarget.dataset.index,
      show: false,
      num: null
    })
    this.pay(e.currentTarget.dataset.rechargeRuleId)
  },

  setVal (e) {
    this.setData({
      num : e.detail.value
    })
  },
  showmodel () {
    this.setData({
      show: !this.data.show,
      num: null,
      active: null
    })
  },
  handleRecharge( rechargeRuleId ) {
    let num = this.data.num;
     if (!num) {
      wx.showToast({
        title: '请输入金额',
        icon: 'none'
      })
      return
    } 
    this.pay('', num)
  },

  pay(rechargeRuleId, customAmount) {
    util.request(api.Recharge, { customAmount, rechargeRuleId, }, 'POST').then((res) => {
      console.log(res)
      let payParam = res.data
      wx.requestPayment({
        'timeStamp': payParam.timeStamp,
        'nonceStr': payParam.nonceStr,
        'package': payParam.package,
        'signType': payParam.signType,
        'paySign': payParam.paySign,
        'success': function (res) {
          console.log(res)
        },
        'fail': function (res) {
          console.log(res)
        },
        'complete': function (res) {
          console.log(res)
        }
      });
    });
  },

  onLoad: function () {
  },

  onShow: function() {
    // 加载充值卡片数据
    util.request(api.RechargeRuleList).then((res) => {
      //  console.log(res)
       this.setData({
         data: res.data
       })
    });
  }

})
