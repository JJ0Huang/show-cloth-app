import config from '../../../config'
Page({
  data: {
    eTabbarName: ''
  },
  onLoad(query) {
    this.setData({
      tabbarName: config.tabbarList[query.index],
      eTabbarName: config.eTabbarList[query.index]
    })
    wx.setNavigationBarTitle({
      title: this.data.tabbarName,
    })
  },

  removeGood() {
    wx.cloud.callFunction({
      name: 'remove',
      data: {
        dbName: this.data.eTabbarName,
      }
    })
  },
  updateGood() {
    wx.cloud.callFunction({
      name: 'update',
      data: {
        dbName: this.data.eTabbarName,
        data: {
          index: 1
        }
      }
    })
  }
})