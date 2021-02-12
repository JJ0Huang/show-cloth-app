//index.js
const app = getApp()
const db = wx.cloud.database()
import config from '../../config'

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',

    tabbarList: config.tabbarList,
    eTabbarList: config.eTabbarList,
    tabbarIndex: 0,

  },

  onLoad: function () {
    this.onGetOpenid()
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
              console.log('用户信息');
              console.log(res.userInfo);
              app.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })
  },
  /**
   * 监听 tabbarIndex，若发生改变，则展示对应内容
   */
  onTabbarIndex(e) {
    this.setData({
      tabbarIndex: e.detail
    })
    wx.cloud.callFunction({
      name: 'get',
      data: {
        dbName: config.eTabbarList[e.detail]
      }
    }).then(res => {
      this.setData({
        goodList: res.result.data
      })
      console.log(this.data.goodList);
    })
  },
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        this.setData({
          openid: res.result.openid
        })
        db.collection('servers').where({
          serverOpenid: this.data.openid
        }).get().then(res => {
          if (res.data.length == 1) {
            console.log(`[index] 欢迎管理员 [${this.data.openid}]`);
            app.globalData.isServer = true
          }
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  }
})