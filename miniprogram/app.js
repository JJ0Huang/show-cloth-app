//app.js
import config from './config'
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: config.env,
        traceUser: true,
      })
    }

    this.globalData = {}

    for (let index = 0; index < config.eTabbarList.length; index++) {
      this.initDb(config.eTabbarList[index])
    }
    this.initDb('collection')
    this.initDb('chatroom')
    this.initDb('servers')
    this.initDb('swiper')

    // this.initSwiper()
  },
  initSwiper() {
    wx.cloud.callFunction({
      name: 'get',
      data: {
        dbName: 'swiper'
      }
    }).then(res => {
      console.log('[app.js] [initSwiper]', res.result.data);
      if (res.result.data.length == 0) {
        wx.cloud.callFunction({
          name: 'add',
          data: {
            dbName: 'swiper',
            data: {
              swiperFileIds: [0, 1]
            }
          }
        })
      }
    })

  },
  initDb(dbName) {
    try {
      wx.cloud.callFunction({
        name: 'initDb',
        data: {
          dbName: dbName
        }
      })
    } catch (e) {}
  }
})