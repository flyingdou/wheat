var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.source) {
      this.setData({
        source: options.source
      })
    }

    // 初始化
    this.methods.init(options.productId, this);
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

  /**
   * 用户触发分享
   */
  onShareAppMessage: function () {
    var product = this.data.product;
    var title = `“${product.memberName}”发布的“${product.name}”为您提供专业的健身指导服务`;
    var path = '/pages/privateProduct/privateProduct?productId=' + product.id + '&source=1';
    return {
      title: title,
      path: path
    }
  },

  // 用户选择改变日期
  changeDate: function (e) {
    var product = this.data.product;
    product.currentDate = e.detail.value;
    this.setData({
      product: product
    });
  },

  // 用户点击购买按钮
  goBuy: function () {
    // 验证登录
    if (!wx.getStorageSync('memberId')) {
      wx.reLaunch({
        url: '../mine/mine?source=privateProduct&productId=' + this.data.product.id,
      })
      return;
    }

    var param = {
      productId: this.data.product.id,
      productName: this.data.product.name,
      productPrice: this.data.product.price,
      image: this.data.product.image,
      productType: 'product',
      time: this.data.product.currentDate
    }
    var product_data = encodeURI(JSON.stringify(param));
    wx.navigateTo({
      url: `../order/order?product=${product_data}`
    });
  },

  /**
  * wxml绑定函数:主页按钮点击绑定(回到主页)
  */
  goHome: function () {
    wx.switchTab({
      url: '../index/index'
    });
  },

  /**
   * 自定义函数
   */
  methods: {
    /**
     * 初始化
     */
    init: function (productId ,obj) {
      wx.request({
        url: 'https://www.ecartoon.com.cn/coachmp!getPrivateInfo.asp',
        data: {
          id: productId
        },
        success: function (res) {
          var product = res.data;
          product.currentDate = util.formatTime(new Date());
          obj.setData({
            product: product
          });
        }
      })
    }
  }
})