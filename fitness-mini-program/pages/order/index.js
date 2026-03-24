const app = getApp();

Page({
  data: {
    orders: []
  },

  onShow() {
    // 每次进入页面都刷新列表
    this.fetchOrders();
  },

  fetchOrders() {
    if (!app.checkLogin()) return;

    wx.showLoading({ title: '加载中' });
    const uid = app.globalData.userInfo.id;

    wx.request({
      url: `http://localhost:8081/api/shop/orders?memberId=${uid}`,
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200) {
          // 按时间倒序排列 (新的在上面)
          const list = res.data.sort((a, b) => {
             return new Date(b.createTime) - new Date(a.createTime);
          });
          
          // 简单处理时间格式
          list.forEach(item => {
             if(item.createTime) item.timeStr = item.createTime.replace('T', ' ').substring(0, 16);
          });

          this.setData({ orders: list });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });
  }
})