const app = getApp();
Page({
  data: { balance: 0, selected: 100 },
  onShow() {
    this.setData({ balance: app.globalData.userInfo.balance });
  },
  select(e) { this.setData({ selected: e.currentTarget.dataset.amount }); },
  handlePay() {
    wx.showLoading({title:'支付中'});
    wx.request({
      url: 'http://localhost:8081/api/business/recharge',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: { memberId: app.globalData.userInfo.id, amount: this.data.selected },
      success: (res) => {
        wx.hideLoading();
        // 更新全局余额
        app.globalData.userInfo.balance += this.data.selected;
        wx.showToast({ title: '充值成功' });
        setTimeout(() => wx.navigateBack(), 1000);
      }
    })
  }
})