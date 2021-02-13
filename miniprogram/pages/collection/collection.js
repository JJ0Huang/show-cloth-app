const app = getApp()
Page({
  onShow() {
    let _openid = app.globalData.openid

    wx.cloud.callFunction({
      name: 'get',
      data: {
        dbName: 'collection',
        where: {
          _openid: _openid
        }
      }
    }).then(res => {
      console.log('[collection] [onload]', res.result.data);
      this.setData({
        goodList: res.result.data
      })
    })
  }
})