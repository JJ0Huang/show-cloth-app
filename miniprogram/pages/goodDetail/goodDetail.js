const app = getApp()
Page({
  data: {
    collected: false
  },
  onLoad(query) {
    this.isCollected()
    this.setData({
      dbName: query.dbName,
      goodId: query._id
    })
    wx.showLoading({
      title: '努力加载中……',
    })
    wx.cloud.callFunction({
      name: 'get',
      data: {
        dbName: query.dbName,
        where: {
          _id: query._id
        }
      }
    }).then(res => {
      this.setData({
        good: res.result.data[0]
      })
      wx.hideLoading()
    })
  },
  isCollected() {
    let collected = false;
    wx.showLoading({
      title: '努力加载中……',
    })
    wx.cloud.callFunction({
      name: 'get',
      data: {
        dbName: 'collection',
        where: {
          _openid: app.globalData.openid,
          goodId: this.data.goodId
        }
      }
    }).then(res => {
      console.log('[goodDetail.js] [isCollected]', res.result.data.length != 0);
      this.setData({
        collected: res.result.data.length != 0
      })
      if (res.result.data.length != 0) {
        this.setData({
          collectionId: res.result.data[0]._id
        })
      }
      wx.hideLoading()
    })
  },
  /**
   * 收藏商品
   */
  collectGood() {
    if (!this.data.collected) {
      wx.showLoading({
        title: '努力加载中……',
      })
      wx.cloud.callFunction({
        name: 'add',
        data: {
          dbName: 'collection',
          data: {
            _openid: app.globalData.openid,
            dbName: this.data.dbName,
            goodId: this.data.goodId,
            goodDescribe: this.data.good.goodDescribe,
            goodName: this.data.good.goodName,
            goodSwiper: this.data.good.goodSwiper
          }
        }
      }).then(res => {
        console.log('[goodDetail.js] [collectGood]', res.result);
        this.setData({
          collected: true,
          collectionId: res.result._id
        })
        wx.hideLoading()
      })
    } else {
      wx.showLoading({
        title: '努力加载中……',
      })
      wx.cloud.callFunction({
        name: 'remove',
        data: {
          dbName: 'collection',
          _id: this.data.collectionId
        }
      }).then(res => {
        console.log('[goodDetail.js] [collectGood]', res.result);
        this.setData({
          collected: false
        })
        wx.hideLoading()
      })
    }
  }
})