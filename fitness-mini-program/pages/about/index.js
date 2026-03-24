Page({
  data: {},

  // 拨打客服电话
  makeCall() {
    wx.makePhoneCall({
      phoneNumber: '13800008888'
    });
  },

  // 跳转去个人中心 (因为你可能需要登录入口)
  goProfile() {
    // 如果 profile 是 TabBar 页面，必须用 switchTab
    // 如果 profile 是普通页面，用 navigateTo
    // 这里做了双重保障
    wx.switchTab({
      url: '/pages/profile/index',
      fail: () => {
        wx.navigateTo({ url: '/pages/profile/index' });
      }
    });
  },
  
  // 分享给朋友
  onShareAppMessage() {
    return {
      title: '极速健身预约 - 专业健身管理平台',
      path: '/pages/about/index'
    }
  }
})