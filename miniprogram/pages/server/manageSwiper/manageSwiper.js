Page({
  data: {
    swiperFileIds: []
  },
  onLoad() {
    wx.cloud.callFunction({
      name: 'get',
      data: {
        dbName: 'swiper'
      }
    }).then(res => {
      console.log('[manageSwiper.js] [onload]', res.result.data[0].swiperFileIds);
      this.setData({
        _id: res.result.data[0]._id
      })
      if (res.result.data[0].swiperFileIds) {
        this.setData({
          swiperFileIds: res.result.data[0].swiperFileIds
        })
      }
    })
  },
  chooseImage() {
    wx.chooseImage({
      count: -1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera']
    }).then(res => {
      this.setData({
        swiperFileIds: []
      })
      this.setData({
        tempFilePaths: res.tempFilePaths
      })
      console.log('[manageSwiper.js] [chooseImage]', res.tempFilePaths);
      this.uploadSwiper()
    })
  },
  uploadSwiper() {
    let filePaths = this.data.tempFilePaths
    let count = 0
    wx.showLoading({
      title: '图片上传中',
    })
    for (let index = 0; index < filePaths.length; index++) {
      let union = new Date().getTime() + `_${index}`
      let filePath = filePaths[index]
      const cloudPath = `${union}${filePath.match(/\.[^.]+?$/)}`
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
          this.data.swiperFileIds.push(res.fileID)
          this.setData({
            swiperFileIds: this.data.swiperFileIds
          })
          console.log('[manageSwiper.js] [uploadSwiper]', res.fileID);
          if (filePaths.length - 1 == index) {
            this.ik()
          }
        },
        fail: e => {
          console.error('[上传文件] 失败：', e)
        },
        complete: () => {
          count++;
          if (count == filePaths.length) {
            wx.hideLoading()
          }
        }
      })
    }
  },
  ik() {
    wx.cloud.callFunction({
      name: 'remove',
      data: {
        dbName: 'swiper',
        _id: this.data._id
      }
    }).then(res => {
      console.log('[manageSwiper.js] [云函数] [删除原swiper成功]', res.result);
      wx.cloud.callFunction({
        name: 'add',
        data: {
          dbName: 'swiper',
          data: {
            swiperFileIds: this.data.swiperFileIds
          }
        }
      }).then(res => {
        console.log('[manageSwiper] [将fileids存放到数据库swiper中]', res.result);
        this.onLoad()
      })
    })
  }
})