const app = getApp()
Page({
  onLoad() {
    this.getUserInfo()
  },
  /**
   * 获取用户信息，设置定时，保证获取成功
   */
  getUserInfo(){
    let appUserInfo = app.globalData.userInfo
    if (appUserInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      setInterval(()=>{
        this.getUserInfo()
      },500)
    }
  }
})