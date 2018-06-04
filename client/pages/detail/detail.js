// pages/detail/detail.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: {},
    /**
     * {"id":3,"image":"https://product-1252093296.cos.ap-beijing.myqcloud.com/product3.jpg","name":"红纹铁质装订机","price":28,"source":"国内·福建"}
     */
  },
  onTapShowComment() {
    let product = this.data.product
    if(product.commentCount) {
      wx.navigateTo({
        url: `/pages/comment/comment?id=${product.id}&price=${product.price}&name=${product.name}&image=${product.image}`,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProduct(options.id)
  },

  getProduct: function(id) {
    wx.showLoading({
      title: '数据加载中......',
    })
    qcloud.request({
      url: config.service.productDetail + id,
      success: result => {
        // console.log(JSON.stringify(result.data))
        wx.hideLoading()

        let data = result.data
        //data.code 为 0 是正常
        if (!data.code) {
          this.setData({
            product: data.data
          })
        } else {
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        }
      },
      fail: result => {
        wx.hideLoading()
        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      }
    })
  },

  addToTrolley() {
    wx.showLoading({
      title: '正在添加到购物车',
    })

    qcloud.request({
      url: config.service.addTrolley,
      login: true,
      method: 'PUT',
      data: {
        id: this.data.product.id
      },
      success: result => {
        wx.hideLoading()

        let data = result.data
        if (!data.code) {
          wx.showToast({
            title: '已添加到购物车',
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '添加失败',
          })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '添加失败！',
        })
      }
    })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  onTapBuy() {
    wx.showLoading({
      title: '商品购买中.....',
    })
    console.log('project: ' + JSON.stringify(this.data.product))

    let product = Object.assign({
      count: 1
    }, this.data.product)

    qcloud.request({
      url: config.service.addOrder,
      login: true,
      method: 'POST',
      data: {
        list: [product],
        isInstantBuy: true
      },
      success: result => {
        console.log('result: ' + JSON.stringify(result))
        wx.hideLoading()
        let data = result.data
        console.log('data: ' + JSON.stringify(data))
        if (!data.code) {
          wx.showToast({
            title: '商品购买成功',
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '商品购买失败',
          })
        }
      },
      fail: () => {
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '商品购买失败'
        })
      }
    })
  }
})