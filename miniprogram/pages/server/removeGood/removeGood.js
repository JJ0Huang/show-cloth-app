Page({
  onLoad(query) {
    this.setData({
      eTabbarName: query.eTabbarName
    })
    this.getGoods()
  },
  getGoods() {
    wx.cloud.callFunction({
      name: 'get',
      data: {
        dbName: this.data.eTabbarName
      }
    }).then(res => {
      console.log('[removeGood.js] [onload] [获取商品数据]', res.result.data);
      this.setData({
        goodList: res.result.data
      })
    })
  },
  removeGood(e) {
    wx.cloud.callFunction({
      name: 'remove',
      data: {
        dbName: this.data.eTabbarName,
        _id: e.currentTarget.dataset._id
      }
    }).then(res => {
      console.log('[removeGood.js] [removeGood] [删除商品]', res.result);
      this.getGoods()
    })
  }
})