var util = require('../../utils/util.js');
var api = require('../../config/api.js');

var app = getApp();

Page({
  data: {
    fileRootUrl: api.fileRootUrl,
    cartGoods: [],
    cartTotal: {
      "goodsCount": 0, // 购物车商品总数
      "goodsAmount": 0.00, // 购物车商品总价值
      "checkedGoodsCount": 0,// 选中购物车商品总数
      "checkedGoodsAmount": 0.00// 选中购物车商品总价值
    },
    isEditCart: false,
    checkedAllStatus: true,
    editCartList: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数


  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    this.getCartList();
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  getCartList: function () {
    let customerId = app.globalData.userInfo ? app.globalData.userInfo.customerId : ''
     util.request(api.CartList, {customerId}).then(res => {
       let goodsCount = 0;
      let goodsAmount = 0.00;
      let checkedGoodsCount = 0;
      let checkedGoodsAmount = 0.00
        let cartGoods = res.data;
        for (let i = 0; i < cartGoods.length; i++ ){
          goodsCount = goodsCount + cartGoods[i].num
          goodsAmount = goodsAmount + (goodsCount * cartGoods[i].retailPrice)
          if (cartGoods[i].selected == 1) {
            // 选中状态
            checkedGoodsCount = checkedGoodsCount + cartGoods[i].num
            checkedGoodsAmount = checkedGoodsAmount + (checkedGoodsCount * cartGoods[i].retailPrice )
          }
        }
        this.setData({
          cartGoods,
          cartTotal: { goodsCount, goodsAmount, checkedGoodsCount, checkedGoodsAmount}
        });
      this.setData({
        checkedAllStatus: this.isCheckedAll()
      });
    });
  },
  isCheckedAll: function () {
    //判断购物车商品已全选
    return this.data.cartGoods.every(function (element, index, array) {
      if (element.selected == 1) {
        return true;
      } else {
        return false;
      }
    });
  },
  checkedItem: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let item = event.target.dataset.item;
    let that = this;
    let customerId = app.globalData.userInfo ? app.globalData.userInfo.customerId: ''
    item.selected = item.selected == 1? 2 :1;
    item.type = 2;
    if (!this.data.isEditCart) {
      util.request(api.CartChange, { customerId,  ...item,}, 'POST').then(function (res) {
        that.getCartList()
      });
    } else {
      //编辑状态
      let tmpCartData = this.data.cartGoods.map(function (element, index, array) {
        if (index == itemIndex){
          element.selected = element.selected == 1? 2:1
        }
        return element;
      });
      that.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
    }
  },
  getCheckedGoodsCount: function(){
    let checkedGoodsCount = 0;
    this.data.cartGoods.forEach(function (v) {
      if (v.selected == 1) {
        checkedGoodsCount += v.num;
      }
    });
    console.log(checkedGoodsCount);
    return checkedGoodsCount;
  },

  checkedAll: function () {
 
    if (!this.data.isEditCart) {
      let cartIds = []
      let checked = !this.isCheckedAll()
      // console.error(checked)// TODO 
      let cartGoods = this.data.cartGoods
      for (let i = 0; i < cartGoods.length; i++) {
        cartIds.push(cartGoods[i].cartId)
      }
      util.request(api.CartChecked, { cartIds, checked }, 'POST').then((res) => {
        this.getCartList()
      });
    } else {
      //编辑状态
      let checkedAllStatus = this.isCheckedAll();
      let tmpCartData = this.data.cartGoods.map(function (v) {
        v.selected = !checkedAllStatus;
        return v;
      });

      this.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: this.isCheckedAll(),
        'cartTotal.checkedGoodsCount': this.getCheckedGoodsCount()
      });
    }

  },


  editCart: function () {
    var that = this;
    if (this.data.isEditCart) {
      this.getCartList();
      this.setData({
        isEditCart: !this.data.isEditCart
      });
    } else {
      //编辑状态
      let tmpCartList = this.data.cartGoods.map(function (v) {
        v.checked = false;
        return v;
      });
      this.setData({
        editCartList: this.data.cartGoods,
        cartGoods: tmpCartList,
        isEditCart: !this.data.isEditCart,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
    }

  },
  updateCart: function (productId, skuId, num) {
    let that = this;
    let customerId = app.globalData.userInfo ? app.globalData.userInfo.customerId: ''
    util.request(api.CartChange, {
      customerId,
      productId,
      skuId,
      num,
      type: 2
    }, 'POST').then(function (res) {
        // console.log(res.data);
      //   that.setData({
      //     cartGoods: res.data,
      //     cartTotal: res.data.length
      //   });
      // that.setData({
      //   checkedAllStatus: that.isCheckedAll()
      // });
    });

  },
  cutNumber: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let item = event.target.dataset.item;
    let cartItem = this.data.cartGoods[itemIndex];
    let num = (cartItem.num - 1 > 1) ? cartItem.num - 1 : 1;
    cartItem.num = num;
    this.setData({
      cartGoods: this.data.cartGoods
    });
    this.updateCart(item.productId, item.skuId, num);
  },

  addNumber: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let item = event.target.dataset.item;
    let cartItem = this.data.cartGoods[itemIndex];
    let num = cartItem.num + 1;
    cartItem.num = num;
    this.setData({
      cartGoods: this.data.cartGoods
    });
    this.updateCart(item.productId, item.skuId, num);

  },
  checkoutOrder: function () {
    //获取已选择的商品
    var checkedGoods = this.data.cartGoods.filter(function (element, index, array) {
      if (element.selected == 1) {
        return true;
      } else {
        return false;
      }
    });

    if (checkedGoods.length <= 0) {
      return false;
    }

    wx.navigateTo({
      url: '../shopping/checkout/checkout'
    })
  },

  deleteCart: function () {
    //获取已选择的商品
    let cartIds = []
    let cartGoods = this.data.cartGoods
    for (let i = 0; i < cartGoods.length;i++) {
      if (cartGoods[i].selected == 1) {
        cartIds.push(cartGoods[i].cartId)
      }
    }
    util.request(api.CartDelete, {cartIds}, 'POST').then( (res) => {
      this.getCartList()
    });
  }
})