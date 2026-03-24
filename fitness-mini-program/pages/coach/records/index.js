const app = getApp();

Page({
  data: {
    list: []
  },

  onShow() {
    // 每次显示页面都刷新，确保写完报告回来能更新状态
    this.fetchRecords();
  },

  fetchRecords() {
    const coachId = app.globalData.userInfo.id;
    wx.showLoading({ title: '加载中' });
    
    wx.request({
      url: `http://localhost:8081/api/coach/my-schedule?coachId=${coachId}`,
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200) {
          let data = res.data;
          
          // 按时间倒序排列（最新的在最上面）
          data.sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime));
          
          // 格式化时间
          data.forEach(item => {
            if(item.bookingTime) {
              item.timeStr = item.bookingTime.replace('T', ' ').substring(0, 16);
            }
          });
          
          this.setData({ list: data });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '加载失败', icon: 'none' });
      }
    });
  },

  // 跳转去写报告
  goWrite(e) {
    const bid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/coach/write-record/index?id=${bid}`
    });
  }
})