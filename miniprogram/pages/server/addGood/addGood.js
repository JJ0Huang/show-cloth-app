Page({
  data: {
    good: {},
    swiperFileIds:[]
  },
  onLoad(query) {
    this.setData({
      eTabbarName: query.eTabbarName
    })
  },
  addGood() {
    wx.cloud.callFunction({
      name: 'add',
      data: {
        dbName: this.data.eTabbarName,
        data: {
          goodName: this.data.good.name,
          goodSize: this.data.good.size,
          goodId: this.data.good.id,
          goodWeight: this.data.good.weight,
          goodShrinkage: this.data.good.shrinkage,
          goodRemark: this.data.good.remark,
          goodDescribe: this.data.good.describe,
          goodLongPicture: this.data.longPictureFileId,
          goodSwiper: this.data.swiperFileIds
        }
      }
    }).then(res => {
      wx.showToast({
        title: '新增商品成功',
      })
      console.log('[addGood.js] [addGood]', `[${this.data.eTabbarName}]`, res);
    })
  },

  upload(){
    this.uploadLongPicture()
    this.uploadSwiper()
  },

  /**
   * 监听输入框
   */
  onName(e) {
    this.setData({
      ['good.name']: e.detail
    })
  },
  onDescribe(e) {
    this.setData({
      ['good.describe']: e.detail
    })
  },
  onId(e) {
    this.setData({
      ['good.id']: e.detail
    })
  },
  onWeight(e) {
    this.setData({
      ['good.weight']: e.detail
    })
  },
  onSize(e) {
    this.setData({
      ['good.size']: e.detail
    })
  },
  onShrinkage(e) {
    this.setData({
      ['good.shrinkage']: e.detail
    })
  },
  onRemark(e) {
    this.setData({
      ['good.remark']: e.detail
    })
  },


  // 上传图片
  chooseSwiper() {
    // 选择图片
    wx.chooseImage({
      count: -1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera']
    }).then(res => {
      this.setData({
        tempFilePaths: res.tempFilePaths
      })
      console.log('轮播图：', res.tempFilePaths);
    })
  },
  chooseLongPhoto() {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera']
    }).then(res => {
      this.setData({
        tempFilePath: res.tempFilePaths[0]
      })
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
          console.log('[上传文件] 成功：', res)
          this.data.swiperFileIds.push(res.fileID)
          this.setData({
            swiperFileIds: this.data.swiperFileIds
          })
          console.log('test:',this.data.swiperFileIds);
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
  uploadLongPicture() {
    let union = new Date().getTime() + `_long`
    let filePath = this.data.tempFilePath
    const cloudPath = `${union}${filePath.match(/\.[^.]+?$/)}`
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: res => {
        console.log('[上传文件] 成功：', res)
        this.setData({
          longPictureFileId: res.fileID
        })
      },
      fail: e => {
        console.error('[上传文件] 失败：', e)
      }
    })
  }
})