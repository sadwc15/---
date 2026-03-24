App({
  globalData: {
    userInfo: null,
    role: null,
    isLogin: false,
    
    selectedCouponId: null,
    lastUsedCouponId: null,


    myCoupons: [
      { id: 1, amount: 50, title: '无门槛课程券', cond: '无门槛', date: '2025-12-31', status: 0 },
      { id: 2, amount: 20, title: '通用代金券', cond: '无门槛', date: '2025-12-31', status: 0 },
      { id: 3, amount: 10, title: '新人体验券', cond: '限首次', date: '已过期', status: 2 }
    ]
  },
  
  onLaunch() {
    const user = wx.getStorageSync('userInfo');
    if (user) {
      this.globalData.userInfo = user;
      this.globalData.role = user.role;
      this.globalData.isLogin = true;
    }
  },

  checkLogin() {
     if(this.globalData.userInfo) return true;
     wx.navigateTo({ url: '/pages/login/index' });
     return false;
  }
})