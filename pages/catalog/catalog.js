var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    fileRootUrl: api.fileRootUrl,
    parentList: [],
    childList: [],
    currentSelectedParentCategory: {},
    goodsCount: 0,
  },
  onLoad: function (options) {
    this.getCatalog();
  },
  getCatalog: function () {

    let that = this;
    wx.showLoading({
      title: '加载中...',
    });

    util.request(api.CategoriesParent).then(function (res) {
      if (res.data) {
        that.setData({
          parentList: res.data,
          currentSelectedParentCategory: res.data[0]
        });
        that.getChildCategories(res.data[0].categoryId)
      }
      wx.hideLoading();
    });

    util.request(api.GoodsCount).then(function (res) {
      that.setData({
        goodsCount: res.data
      });
    });

  },
  getChildCategories: function (id) {
    let that = this;
    util.request(api.CategoriesChild, { id: id })
      .then(function (res) {
        that.setData({
          childList: res.data, 
          currentSelectedParentCategory: that.data.parentList.filter(item => item.categoryId == id)[0]
        });
      });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  switchCate: function (event) {
    let currentTarget = event.currentTarget;
    if (this.data.currentSelectedParentCategory.categoryId == event.currentTarget.dataset.id) {
      return false;
    }
    this.getChildCategories(event.currentTarget.dataset.id);
  }
})