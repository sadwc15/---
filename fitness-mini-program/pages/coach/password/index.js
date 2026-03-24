const app = getApp();
Page({
  data: {
    p1: '',
    p2: ''
  },
  input(e) {
    this.setData({
      [e.currentTarget.dataset.k]: e.detail.value
    })
  },
  save() {
    if (this.data.p1 !== this.data.p2) return wx.showToast({
      title: '密码不一致',
      icon: 'none'
    });
    if (!this.data.p1) return wx.showToast({
      title: '不能为空',
      icon: 'none'
    });

    wx.request({
      url: 'http://localhost:8081/api/coach/password',
      method: 'POST',
      data: {
        id: app.globalData.userInfo.id,
        password: this.data.p1
      },
      success: () => {
        wx.showToast({
          title: '修改成功'
        });
        setTimeout(() => wx.navigateBack(), 1000);
      }
    })
  }
})