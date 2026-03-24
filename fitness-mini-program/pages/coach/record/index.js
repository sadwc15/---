const app = getApp();

Page({
  data: {
    // 默认时间跨度设大一点，确保能看到数据
    start: '2024-01-01', 
    end: '2026-12-31',
    list: []
  },

  onShow() {
    // 每次进入页面都刷新
    this.fetch(); 
  },
  
  bindStart(e) {
    this.setData({ start: e.detail.value });
    this.fetch();
  },
  
  bindEnd(e) {
    this.setData({ end: e.detail.value });
    this.fetch();
  },

  fetch() {
    const id = app.globalData.userInfo.id;
    wx.showLoading({ title: '加载中' });
    
    wx.request({
      url: `http://localhost:8081/api/coach/${id}/schedule?startDate=${this.data.start}&endDate=${this.data.end}`,
      success: (res) => {
        wx.hideLoading();
        let data = res.data || [];
        // 格式化一下时间显示
        data.forEach(item => {
           item.course.timeStr = item.course.startTime.replace('T', ' ').substring(0, 16);
        });
        this.setData({ list: data });
      },
      fail: () => {
        wx.hideLoading();
      }
    })
  },

  goStudents(e) {
    const students = e.currentTarget.dataset.students;
    const str = encodeURIComponent(JSON.stringify(students));
    wx.navigateTo({ url: `/pages/coach/students/index?data=${str}` });
  }
})