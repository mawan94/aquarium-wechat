// pages/my/recharge/recharge.js
// const constant = require('../../../constant.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rechargeRuleId: '',
    pageIndex: 1,
    pageSize: 9999,
    rechargeRuleList: [],
    saveParamter: {}
  },
  // 选择充值金额
  select: function (e) {
    const currentSelectItem = e.currentTarget.dataset.currentItem
    let {
      saveParamter
    } = this.data
    Object.assign(saveParamter, currentSelectItem);
    this.setData({
      rechargeRuleId: currentSelectItem.rechargeRuleId,
      saveParamter: saveParamter
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    return
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({ userInfo })
    if (userInfo) {
      this.handleLoadRechargeRuleList();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  handlePayMoney() {
    if (!this.data.rechargeRuleId) {
      wx.showToast({
        title: '请选择充值类型',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.showLoading({
      title: '请稍后',
      mask: "true"
    })
    wx.request({
      url: constant.host + '/frontend/customerRecharge/v1/recharge',
      method: 'POST',
      data: {
        rechargeRuleId: this.data.rechargeRuleId,
        customerId: this.data.userInfo.customerId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        console.error(res.data.data.data)
        let {
          appId,
          nonceStr,
          packageValue,
          paySign,
          signType,
          timeStamp
        } = res.data.data.data;
        wx.requestPayment({
          appId,
          timeStamp,
          nonceStr,
          'package': packageValue,
          paySign,
          signType,
          'success': function (res) {
            wx.switchTab({
              url: '/pages/my/my',
            })
          },
          'fail': function (res) {
          },
          'complete': function (res) {
          }
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  handleToIntroduction() {
    wx.navigateTo({
      url: '/pages/instruction/instruction?instructionKey=充值规则',
    })
  },
  // initPage
  handleLoadRechargeRuleList() {
    wx.request({
      url: constant.host + '/frontend/rechargeRule/v1/rechargeRuleFrontendList',
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        this.setData({
          rechargeRuleList: res.data.data
        })
      }
    })
  },

  handleToLogin: function () {
    // 跳转到登录頁面
    wx.navigateTo({
      url: '/pages/preIndex/preIndex',
    })
  }
})