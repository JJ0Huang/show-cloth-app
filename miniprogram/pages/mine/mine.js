const app = getApp()
const db = wx.cloud.database()
Page({
  data:{
    isServer: false
  },
  onLoad() {
    this.getUserInfo()
    this.isHaveServer()
    this.setData({
      isServer: app.globalData.isServer
    })
  },
  /**
   * 获取用户信息，设置定时，保证获取成功
   */
  getUserInfo() {
    let appUserInfo = app.globalData.userInfo
    if (appUserInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      setTimeout(() => {
        this.getUserInfo()
      }, 500)
    }
  },

  /**
   * 检查是否有管理员
   */
  isHaveServer() {
    db.collection('servers').get().then(res => {
      if (res.data.length == 0) {
        this.setData({
          serversDb: 'empty'
        })
      } else {
        this.setData({
          serversDb: 'not empty'
        })
      }
    })
  },

  /**
   * 初始化第一个管理员，以 openid 为标志
   */
  initServer() {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        db.collection('servers').add({
          data: {
            serverOpenid: res.result.openid
          }
        }).then(()=>{
          console.log('[db] [servers] [initServer] 新增客服成功');
          wx.reLaunch({
            url: '../index/index',
          })
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  }
})