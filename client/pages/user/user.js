// pages/user/user.js
const app = getApp()
const  qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js')
 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // userInfo: {
      // nickName: '呜拉巴哈'
    // }
    userInfo : null,
  },

  onTapLogin() {
    app.login({
      success: ({userInfo}) => {
        this.setData({
          userInfo
        })
      }
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
    app.checkSession({
      success: ({userInfo}) => {
        this.setData({
          userInfo
        })
      }
    })
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
  onTapAddress:  ()  => {
    wx.showToast({
      title: '该功能暂未开放',
    })
  },
  onTapKf: () => {
    wx.showToast({
      title: '该功能暂未开发',
    })
  }
})