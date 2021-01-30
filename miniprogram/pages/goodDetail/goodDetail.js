Page({
  data:{
    collected: false
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