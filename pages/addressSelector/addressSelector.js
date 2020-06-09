// pages/addressSelector/addressSelector.js
// const constant = require('../../constant.js')
const app = getApp()
var QQMapWX = require('../../lib/qqmap-wx-jssdk.min.js')
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city:'',
    // currentAddr: '', // 当前用户地址
    // aroundAddress: [], // 附近地址
    // customerAddress: [],
    actionType: '' // 1 客户新增地址选择
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      city: options.city
    })
    // qqmapsdk = new QQMapWX({
    //   key: 'HWVBZ-VUALV-EEVPJ-U2TE2-2FVQ3-L3BNH' // 申请的key
    // })
  },

  //数据回填方法
  backfill: function (e) {
    var id = e.currentTarget.id;
    let location = {};
    for (var i = 0; i < this.data.suggestion.length; i++) {
      if (i == id) {
        location = this.data.suggestion[i]
        this.setData({
          backfill: this.data.suggestion[i].title
        });
      }
    }
    // 判断地址是否在配送范围
    let selectedAddress = {}
    selectedAddress.lat = location.latitude
    selectedAddress.lng = location.longitude
    selectedAddress.address = this.data.backfill
    app.globalData.selectedAddress = selectedAddress;
    wx.navigateBack({})// 跳转页面
  },

  //触发关键词输入提示事件
  getsuggest: function (e) {
    var _this = this;
    //调用关键词提示接口
    app.globalData.qqmapsdk.getSuggestion({
      //获取输入框值并设置keyword参数
      keyword: e.detail.value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
      region: _this.data.city , //设置城市名，限制关键词所示的地域范围，非必填参数
      success: function (res) { //搜索成功后的回调
        var sug = [];
        for (var i = 0; i < res.data.length; i++) {
          sug.push({ // 获取返回结果，放到sug数组中
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          });
        }
        _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
          suggestion: sug
        });
      }
    });
    if (!e.detail.value) {
      _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
        suggestion: []
      });
    }
  },

})