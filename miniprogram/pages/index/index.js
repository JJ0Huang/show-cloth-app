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
    swiperFileIds: []
  },

  onShow() {

    wx.cloud.callFunction({
      name: 'get',
      data: {
        dbName: 'swiper'
      }
    }).then(res => {
      if (res.result.data.length > 0) {
        console.log('[index.js] [onload]', res.result.data[0].swiperFileIds);
        this.setData({
          swiperFileIds: res.result.data[0].swiperFileIds
        })
      } else {
        wx.cloud.callFunction({
          name: 'add',
          data: {
            dbName: 'swiper',
            data: {
              swiperFileIds: [0, 1]
            }
          }
        }).then((res) => {
          console.log('[index.js] [onload] [initSwiper]', res.result);
          this.setData({
            swiperFileIds: [0, 1]
          })
        })
      }
    })


    this.onTabbarIndex({
      detail: 0
    })
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
              console.log('用户信息', res.userInfo);
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
    wx.showLoading({
      title: '努力加载中……',
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
      wx.hideLoading()
    })
  },
  onGetOpenid: function () {
    // 调用云函数
    wx.showLoading({
      title: '努力加载中……',
    })
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
          }else{
            console.log('[index.js] [onGetOpenid] [您还不是管理员]');
            app.globalData.isServer = false
          }
          wx.hideLoading()
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  }
})