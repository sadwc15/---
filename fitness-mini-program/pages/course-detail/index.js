const app = getApp();

Page({
  data: {
    course: null
  },

  onLoad(options) {
    // 获取页面传参的 id
    const id = options.id;
    this.fetchDetail(id);
  },

  // 获取课程详情数据
  fetchDetail(id) {
    wx.showLoading({ title: '加载中' });
    wx.request({
      url: `http://localhost:8081/api/public/courses/${id}`,
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200) {
          this.setData({ course: res.data });
        } else {
          wx.showToast({ title: '课程不存在', icon: 'none' });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });
  },

  // 点击“立即预约”按钮
  
  handleBook() {
    if (!app.checkLogin()) return;

    // === 调试日志：看看当前 course 到底是啥 ===
    console.log('当前课程对象:', this.data.course);

    if (!this.data.course || !this.data.course.id) {
      wx.showToast({ title: '数据加载中，请稍后', icon: 'none' });
      return;
    }

    // 带着课程ID跳转
    wx.navigateTo({
      url: `/pages/course/booking?courseId=${this.data.course.id}`
    });
  }
});