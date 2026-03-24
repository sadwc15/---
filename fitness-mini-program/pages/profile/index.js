const app = getApp();

Page({
  data: {
    userInfo: null,
    role: null,
    phone: '', // 新增：存储手机号
    memberStatus: '暂未开通会员',
    couponCount: 0,
    cardCount: 1
  },

  onShow() {
    this.refreshUserInfo();
  },

  refreshUserInfo() {
    const localUser = app.globalData.userInfo;
    const role = app.globalData.role;

    // 1. 未登录处理
    if (!localUser) {
      this.setData({
        userInfo: null,
        role: null,
        phone: '',
        memberStatus: '请先登录',
        couponCount: 0,
        cardCount: 0
      });
      if (role !== 'COACH') wx.showTabBar();
      return;
    }

    this.setData({
      role: role,
      phone: localUser.phone || '' // 存储手机号
    });

    // 2. 教练端
    if (role === 'COACH') {
      wx.hideTabBar();
      this.setData({
        userInfo: localUser
      });
    }
    // 3. 学员端
    else {
      wx.showTabBar();

      // 计算可用的优惠券数量
      const allCoupons = app.globalData.myCoupons || [];
      const validCount = allCoupons.filter(c => c.status === 0).length;

      wx.request({
        url: `http://localhost:8081/api/members/${localUser.id}`,
        success: (res) => {
          if (res.statusCode === 200) {
            const newUser = res.data;
            app.globalData.userInfo = newUser;

            this.setData({
              userInfo: newUser,
              phone: newUser.phone || '', // 更新手机号
              memberStatus: newUser.balance > 0 ? '会员卡已激活' : '暂未开通会员',
              couponCount: validCount,
              cardCount: 1
            });
          }
        },
        fail: () => {
          this.setData({
            userInfo: localUser,
            couponCount: validCount
          });
        }
      });
    }
  },

  // === 跳转功能（修正个人中心跳转）===
  goToProfile() {
    if (!this.data.userInfo) return this.goLogin();
    wx.navigateTo({
      url: `/pages/my-info/index?phone=${this.data.phone}`
    });
  },

  goRecharge() {
    if (!this.data.userInfo) return this.goLogin();
    wx.navigateTo({ url: '/pages/recharge/index' });
  },

  goCoupons() {
    if (!this.data.userInfo) return this.goLogin();
    wx.navigateTo({ url: '/pages/coupon/index' });
  },

  goCards() {
    if (!this.data.userInfo) return this.goLogin();
    wx.navigateTo({ url: '/pages/card/index' });
  },

  goCollection() {
    if (!this.data.userInfo) return this.goLogin();
    wx.navigateTo({ url: '/pages/favorite/index' });
  },

  goLogin() {
    wx.navigateTo({ url: '/pages/login/index' });
  },

  // === 教练端专用跳转 ===
  goCoachCourse() {
    wx.navigateTo({ url: '/pages/coach/course-list' });
  },
  goCoachSchedule() {
    wx.navigateTo({ url: '/pages/coach/schedule' });
  },
  goCoachStats() {
    wx.navigateTo({ url: '/pages/coach/stats' });
  },
  goPreview() {
    wx.switchTab({
      url: '/pages/course/index',
      success: () => wx.showToast({ title: '请查看列表', icon: 'none' }),
      fail: () => wx.navigateTo({ url: '/pages/course/index' })
    });
  },

  handleLogout() {
    wx.showModal({
      title: '退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.globalData.userInfo = null;
          app.globalData.role = null;
          app.globalData.isLogin = false;
          wx.showTabBar();
          this.setData({
            userInfo: null,
            phone: ''
          });
          wx.reLaunch({ url: '/pages/home/index' });
        }
      }
    });
  }
});