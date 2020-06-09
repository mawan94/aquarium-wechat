var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    fileRootUrl: api.fileRootUrl,
    sameLevelCategories: [],



    // text:"这是一个页面"
    navList: [],
    goodsList: [],
    id: 0,
    currentCategory: {},
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,

    pageIndex: 1,
    pageSize: 12
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    if (options.id) {
      that.setData({
        id: options.id
      });
    }
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    this.getCategoryInfo();

  },
  getCategoryInfo: function() {
    let that = this;
    util.request(api.CategoriesSameLevel, {id: this.data.id})
      .then(function(res) {
        that.setData({
          sameLevelCategories: res.data,
          currentCategory: res.data.filter(item => item.categoryId == that.data.id)[0]
        });

        //nav位置
        let currentIndex = 0;
        let navListCount = that.data.sameLevelCategories.length;
        for (let i = 0; i < navListCount; i++) {
          currentIndex += 1;
          if (that.data.sameLevelCategories[i].categoryId == that.data.categoryId) {
            break;
          }
        }
        if (currentIndex > navListCount / 2 && navListCount > 5) {
          that.setData({
            scrollLeft: currentIndex * 60
          });
        }
        that.getGoodsList();
      });
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
    // console.log(1);
  },
  onHide: function() {
    // 页面隐藏
  },
  getGoodsList: function() {
    var that = this;
    util.request(api.GoodsList, {
        categoryId: that.data.id,
      pageIndex: that.data.pageIndex,
      pageSize: that.data.pageSize
      })
      .then(function(res) {
        console.log(res)
        that.setData({
          goodsList: res.data.records,
          total: res.data.total
        });
      });
  },
  onUnload: function() {
    // 页面关闭
  },
  switchCate: function(event) {
    if (this.data.id == event.currentTarget.dataset.id) {
      return false;
    }
    var that = this;
    var clientX = event.detail.x;
    var currentTarget = event.currentTarget;
    if (clientX < 60) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft - 60
      });
    } else if (clientX > 330) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft
      });
    }
    this.setData({
      id: event.currentTarget.dataset.id
    });
    this.getCategoryInfo();
  }
})