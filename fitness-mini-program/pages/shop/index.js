const app = getApp();

Page({
  data: {
    products: []
  },

  onShow() {
    this.fetchProducts();
  },

  fetchProducts() {
    wx.showLoading({ title: '加载中' });
    wx.request({
      url: 'http://localhost:8081/api/public/products',
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200) {
          this.setData({ products: res.data });
        }
      },
      fail: () => {
        wx.hideLoading();
      }
    });
  },

  // 跳转到购买详情页
  goBuy(e) {
    if (!app.checkLogin()) return; // 检查登录
    const item = encodeURIComponent(JSON.stringify(e.currentTarget.dataset.item));
    wx.navigateTo({
      url: `/pages/shop/buy?data=${item}`
    });
  },

  // 收藏商品
  handleFav(e) {
    if (!app.checkLogin()) return;
    const pid = e.currentTarget.dataset.id;
    
    wx.request({
      url: 'http://localhost:8081/api/shop/favorite',
      method: 'POST',
      data: {
        memberId: app.globalData.userInfo.id,
        targetId: pid,
        type: 'PRODUCT' // 类型标记为商品
      },
      success: (res) => {
        if (res.statusCode === 200) {
          wx.showToast({ title: '已收藏' });
        }
      }
    })
  }
})