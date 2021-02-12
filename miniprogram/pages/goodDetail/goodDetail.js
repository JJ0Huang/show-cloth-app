Page({
  data: {
    collected: false
  },
  onLoad(query) {
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
    })
  },
  /**
   * 收藏商品
   */
  collectGood() {
    this.setData({
      collected: !this.data.collected
    })
    console.log(this.data.collected);
  }
})