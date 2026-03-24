const app = getApp();
Page({
  data: { balance: 0 },
  onShow() {
    // 显示真实余额
    this.setData({ balance: app.globalData.userInfo.balance });
  }
})