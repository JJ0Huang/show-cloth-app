const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    isServer: false,
    serversLength: -1
  },
  onLoad() {
    this.getServers()
    this.getUserInfo()
    this.isChoose()
    let interval = setInterval(() => {
      if (app.globalData.isServer) {
        clearInterval(interval)
        this.setData({
          isServer: app.globalData.isServer
        })
      }
    }, 500);
    setTimeout(() => {
      clearInterval(interval)
    }, 3000)
  },
  /**
   * 检验是否已申请
   */
  isChoose() {
    let interval = setInterval(() => {
      if (app.globalData.openid) {
        clearInterval(interval)
        wx.cloud.callFunction({
          name: 'get',
          data: {
            dbName: 'servers',
            where: {
              beAServer: app.globalData.openid
            }
          }
        }).then(res => {
          console.log('[mine.js] [isChoose] [是否已申请]', res.result.data.length > 0);
          this.setData({
            isAsk: res.result.data.length > 0
          })
        })
      }
    }, 500);
    setTimeout(() => {
      clearInterval(interval)
    }, 10000)
  },
  /**
   * 管理员申请
   */
  beAServer() {
    wx.cloud.callFunction({
      name: 'add',
      data: {
        dbName: 'servers',
        data: {
          beAServer: app.globalData.openid,
          nickName: app.globalData.userInfo.nickName,
          serverOpenid: -1
        }
      }
    }).then(res => {
      console.log('[mine.js] [be a server] [管理员申请]', res.result);
      wx.reLaunch({
        url: '../index/index',
      })
    })
  },
  /**
   * 获取数量
   */
  getServers() {
    wx.cloud.callFunction({
      name: 'get',
      data: {
        dbName: 'servers'
      }
    }).then(res => {
      console.log('[mine.js] [getServers] [管理员数量]', res.result.data.length);
      console.log('[mine.js] [getServers] [管理员]', res.result.data);
      this.setData({
        serversLength: res.result.data.length,
        servers: res.result.data
      })
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
   * 初始化第一个管理员，以 openid 为标志
   */
  initServer() {
    wx.showLoading({
      title: '努力加载中……',
    })
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        db.collection('servers').add({
          data: {
            serverOpenid: res.result.openid
          }
        }).then(() => {
          console.log('[db] [servers] [initServer] 新增客服成功');
          wx.reLaunch({
            url: '../index/index',
          })
          wx.hideLoading()
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  sure(e) {
    console.log(e.currentTarget.dataset);
    wx.cloud.callFunction({
      name: 'update',
      data: {
        dbName: 'servers',
        _id: e.currentTarget.dataset._id,
        data: {
          serverOpenid: e.currentTarget.dataset._beaserver
        }
      }
    }).then(res => {
      console.log('[mine.js] [sure]', res.result);
      this.getServers()
    })
  },
  reject(e) {
    wx.cloud.callFunction({
      name: 'remove',
      data: {
        dbName: 'servers',
        _id: e.currentTarget.dataset._id
      }
    }).then(res => {
      console.log('[mine.js] [reject]', res.result);
      this.getServers()
    })
  }
})