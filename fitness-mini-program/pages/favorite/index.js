const app = getApp();

Page({
  data: {
    list: []
  },

  onShow() {
    // 每次显示页面都刷新最新收藏
    this.fetchFavorites();
  },

  fetchFavorites() {
    if (!app.checkLogin()) return;
    
    wx.showLoading({ title: '加载中' });
    const uid = app.globalData.userInfo.id;
    
    wx.request({
      url: `http://localhost:8081/api/shop/favorites?memberId=${uid}`,
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200) {
          this.setData({ list: res.data });
        }
      },
      fail: () => wx.hideLoading()
    });
  },

  // 核心跳转逻辑
  goDetail(e) {
    const item = e.currentTarget.dataset.item;
    const detail = item.detail;
    const detailStr = encodeURIComponent(JSON.stringify(detail));

    if (item.type === 'PRODUCT') {
      // 如果是商品，跳到商品购买页
      wx.navigateTo({
        url: `/pages/shop/buy?data=${detailStr}`
      });
    } else if (item.type === 'COURSE') {
      // 如果是课程，跳到课程预约页
      // 注意：后端收藏存的是 detail，这需要匹配 course booking 页面的数据结构
      // 课程预约页通常需要 detail 里包含 coach 信息
      // 如果 detail 数据不全，可能需要重新查，但一般 entity 直接存的就是全的
      wx.navigateTo({
        url: `/pages/course/booking?data=${detailStr}`
      });
    }
  }
})