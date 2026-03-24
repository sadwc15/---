const app = getApp();

Page({
  data: {
    isRegister: false,
    role: 'MEMBER', // MEMBER 或 COACH
    phone: '',
    password: '',
    name: ''
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [field]: e.detail.value });
  },

  toggleMode() {
    this.setData({ isRegister: !this.data.isRegister });
  },

  switchRole(e) {
    this.setData({ role: e.currentTarget.dataset.role });
  },

  handleSubmit() {
    const { phone, password, name, isRegister, role } = this.data;
    
    if (!phone || !password) {
      wx.showToast({ title: '请填写完整', icon: 'none' });
      return;
    }

    if (isRegister) {
      // --- 注册逻辑 ---
      wx.request({
        url: 'http://localhost:8081/api/auth/register',
        method: 'POST',
        data: { phone, password, name },
        success: (res) => {
          if (res.statusCode === 200) {
            wx.showToast({ title: '注册成功' });
            this.setData({ isRegister: false });
          } else {
            wx.showToast({ title: res.data || '注册失败', icon: 'none' });
          }
        }
      });
    } else {
      // --- 登录逻辑 ---
      wx.request({
        url: 'http://localhost:8081/api/auth/login',
        method: 'POST',
        data: { phone, password, role },
        success: (res) => {
          if (res.statusCode === 200) {
            // 保存全局状态
            app.globalData.userInfo = res.data.user;
            app.globalData.role = res.data.role;
            app.globalData.isLogin = true;

            wx.showToast({ title: '登录成功' });
            
            // === 关键修改：根据角色跳转 ===
            if (res.data.role === 'COACH') {
              // 教练：reLaunch 关闭所有页面，直接去个人中心 (实现无TabBar效果)
              wx.reLaunch({ url: '/pages/profile/index' });
            } else {
              // 会员：正常去首页 TabBar
              wx.switchTab({ url: '/pages/home/index' });
            }
          } else {
            wx.showToast({ title: '账号或密码错误', icon: 'none' });
          }
        }
      });
    }
  },

  goHome() {
    wx.switchTab({ url: '/pages/home/index' });
  }
})