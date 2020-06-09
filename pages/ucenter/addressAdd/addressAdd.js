var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    back:'',
    region: ['', '', ''],
    genderList: [{
        name: '女士',
        value: 2
      },
      {
        name: '先生',
        value: 1
      },
    ],
    tagList: [
      "家", "公司", "医院", "学校", "其他"
    ],
    tag: '',
    gender: 2,
    address: '',
    detailAddress:'',
    lat: '',
    lng: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.customerReceiveId) {
      this.setData({
        customerReceiveId: options.customerReceiveId
      })
      this.loadAddress(options.customerReceiveId)
    }
    if (options.back) {
      this.setData({
        back: options.back
      })
    }

    qqmapsdk = app.globalData.qqmapsdk;
    let _this = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        qqmapsdk.reverseGeocoder({
          location: {
            latitude,
            longitude
          },
          success: function(result) {
            console.log(result.result.address_component)
            let addressComponent = result.result.address_component
            _this.setData({
              region: [addressComponent.province, 
                addressComponent.city, 
                addressComponent.district],
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  loadAddress: function (customerReceiveId) {
    util.request(api.AddressDetail, { customerReceiveId }).then((res) => {
      this.setData({
        receiveName: res.data.receiveName,
        receiveTel: res.data.receiveTel,
        tag: res.data.tag,
        gender: res.data.gender,
        address: res.data.address,
        detailAddress: res.data.detailAddress,
        lat: res.data.lat,
        lng: res.data.lng,
        region: [res.data.province, res.data.city, res.data.district]
      });
    });
  },
  
  bindRegionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      address: '',
      lat: '',
      lng: '',
      region: e.detail.value
    })
    app.globalData.selectedAddress = {}
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let {
      lat,
      lng,
      address
    } = app.globalData.selectedAddress
    if (address && lat && lng) {
      this.setData({
        lat,
        lng,
        address
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    app.globalData.selectedAddress = {}
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  radioChange: function(e) {
    this.setData({
      gender: e.detail.value
    })
  },

  handleChangeText: function(e) {
    let tempObj = {}
    tempObj[e.currentTarget.dataset.field] = e.detail.value
    this.setData({
      ...tempObj
    })
  },

  handleClickTag: function(e) {
    this.setData({
      tag: e.currentTarget.dataset.tag
    })

  },

  handleToAddressSelector: function() {
    if (!this.data.region[1]) {
      this.showMsg('请选择城市')
      return;
    }
    wx.navigateTo({
      url: '/pages/addressSelector/addressSelector?city=' + this.data.region[1],
    })
  },
  

  // 表单提交
  handleSubmitForm: function() {
    let {
      customerReceiveId,
      region,
      receiveName,
      receiveTel,
      gender,
      city,
      address,
      detailAddress,
      tag,
      lat,
      lng
    } = this.data;

    if (!receiveName) {
      this.showMsg('请填写收货人')
      return;
    }
    if (!gender) {
      this.showMsg('请选择性别')
      return;
    }
    if (!receiveTel) {
      this.showMsg('请填写联系电话')
      return;
    } else {
      if (receiveTel.length > 11 || receiveTel.length < 7) {
        this.showMsg('请填写正确的号码')
        return;
      }
    }

    if (!region[0] && !region[1] && !region[2]) {
      this.showMsg('请选择城市')
      return;
    }
    if (!address) {
      this.showMsg('请选择收货地址')
      return;
    }
    if (!detailAddress) {
      this.showMsg('请填写详细地址')
      return;
    }
    if (!tag) {
      this.showMsg('请选择地址类型')
      return;
    }
    let customerId = app.globalData.userInfo ? app.globalData.userInfo.customerId: ''
    util.request(api.AddressEdit, { customerReceiveId,customerId, address, detailAddress, receiveName, receiveTel, gender, lat, lng, tag, province: region[0], city: region[1], district: region[2] },'POST').then((res) => {
      let url = this.data.back ? '../address/address?back=checkout' : '../address/address'
        wx.navigateTo({url})
    });
  },


  // 给出提示
  showMsg: function(msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    })
  },

  // 删除地址
  handleDelAddress: function() {
    wx.showModal({
      title: '',
      content: '确定要删除地址？',
      success:  (res) => {
        if (res.confirm) {
          let customerReceiveId = this.data.customerReceiveId;
          util.request(api.AddressDelete, { customerReceiveId }, 'POST').then(res=> {
            let checkoutAddressClick = app.globalData.checkoutAddressClick
            if (checkoutAddressClick && checkoutAddressClick.customerReceiveId == customerReceiveId) {
              app.globalData.checkoutAddressClick = {}
            }
            let url = this.data.back ? '../address/address?back=checkout' : '../address/address'
            wx.navigateTo({
              url,
            })
          });
        }
      }
    })
  }
})