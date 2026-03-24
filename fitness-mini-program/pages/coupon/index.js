const app = getApp();

Page({
  data: {
    coupons: []
  },

  onShow() {
    // 1. 检查是否刚用完一张券
    const usedId = app.globalData.lastUsedCouponId;
    if (usedId) {
      this.markGlobalAsUsed(usedId);
      app.globalData.lastUsedCouponId = null;
    }

    // 2. 获取列表
    this.setData({
      coupons: app.globalData.myCoupons
    });
  },

  goUse(e) {
    const id = e.currentTarget.dataset.id;
    app.globalData.selectedCouponId = id;
    
    // 判断 ID 是否为 1 (私教券)
    if (String(id) === '1') {
      // 直接用 navigateTo，不尝试 switchTab 了
      wx.navigateTo({
        url: '/pages/course/index',
        success: () => wx.showToast({ title: '请选择课程', icon: 'none' }),
        fail: (err) => console.error('跳转失败', err)
      });
    } else {
      // 商城通常是 Tab 页，所以保持 switchTab
      wx.switchTab({
        url: '/pages/shop/index',
        fail: () => {
           // 万一商城也不是 Tab 页，回退到 navigateTo
           wx.navigateTo({ url: '/pages/shop/index' });
        }
      });
    }
  },

  markGlobalAsUsed(id) {
    const list = app.globalData.myCoupons;
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        list[i].status = 1;
        break;
      }
    }
    this.setData({
      coupons: list
    });
  }
})