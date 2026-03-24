Page({
  data: {
    news: null
  },

  onLoad(options) {
    const id = options.id;
    if (id) {
      this.fetchDetail(id);
    }
  },

  fetchDetail(id) {
    wx.showLoading({ title: '加载中' });
    wx.request({
      url: `http://localhost:8081/api/public/news/${id}`,
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200) {
          let item = res.data;
          // 简单格式化时间
          item.dateStr = item.publishTime.replace('T', ' ').substring(0, 16);
          this.setData({ news: item });
        }
      }
    })
  }
})