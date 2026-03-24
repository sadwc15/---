const app = getApp();

Page({
  data: {
    userInfo: null,
    role: null,
    phone: '',
    totalClasses: 0, // 教练累计上课数
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
      phone: localUser.phone || ''
    });

    // 2. 教练端
    if (role === 'COACH') {
      wx.hideTabBar();
      this.setData({
        userInfo: localUser
      });
      
      // 加载教练累计上课数
      this.loadCoachTotalClasses(localUser.phone);
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
              phone: newUser.phone || '',
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

  // 加载教练累计上课数
  loadCoachTotalClasses(phone) {
    if (!phone) return;
    
    wx.request({
      url: `http://localhost:8081/api/stats/coach/total-classes?phone=${phone}`,
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            totalClasses: res.data || 0
          });
        }
      },
      fail: (err) => {
        console.error('加载累计上课数失败', err);
      }
    });
  },

  // === 跳转功能 ===
  goToProfile() {
    if (!this.data.userInfo) return this.goLogin();
    
    let phone = this.data.phone;
    if ((!phone || phone === 'undefined') && this.data.userInfo) {
      phone = this.data.userInfo.phone;
      this.setData({ phone });
    }
    
    if (!phone || phone === 'undefined') {
      wx.showToast({ title: '手机号不存在', icon: 'none' });
      return;
    }
    
    wx.navigateTo({
      url: `/pages/my-info/index?phone=${phone}`
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

  // 教练端专用跳转
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