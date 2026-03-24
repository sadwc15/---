const app = getApp();

Page({
  data: {
    phone: '',
    memberId: null,
    name: '',
    birthday: '',
    gender: 0,
    address: '',
    avatar: ''
  },

  onLoad(options) {
    // 从 URL 获取手机号
    const phone = options.phone;
    this.setData({ phone });
    this.loadMemberByPhone(phone);
  },

  onShow() {
    // 检查登录
    if (!app.checkLogin()) {
      wx.navigateTo({
        url: '/pages/login/index'
      });
      return;
    }
  },

  // 根据手机号查询会员信息
  loadMemberByPhone(phone) {
    if (!phone || phone === 'undefined') {
      wx.showToast({ title: '手机号无效', icon: 'none' });
      return;
    }
    
    wx.request({
      url: `http://localhost:8081/api/members/by-phone?phone=${phone}`,
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          const member = res.data;
          this.setData({
            memberId: member.id,
            name: member.name || '',
            avatar: member.avatar || ''
          });
          this.loadProfile(member.id);
        } else {
          wx.showToast({ title: '会员不存在', icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '网络请求失败', icon: 'none' });
      }
    });
  },

  // 加载扩展信息
  loadProfile(memberId) {
    if (!memberId || memberId === 'undefined') {
      console.error('memberId 无效:', memberId);
      wx.showToast({ title: '用户ID无效', icon: 'none' });
      return;
    }
    
    wx.request({
      url: `http://localhost:8081/api/member/profile/${memberId}`,
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          const data = res.data;
          this.setData({
            birthday: data.birthday || '',
            gender: data.gender ?? 0,
            address: data.address || ''
          });
        }
      },
      fail: (err) => {
        console.error('加载扩展信息失败:', err);
      }
    });
  },

  // 输入事件
  onNameInput(e) {
    this.setData({ name: e.detail.value });
  },

  onBirthdayChange(e) {
    this.setData({ birthday: e.detail.value });
  },

  onGenderChange(e) {
    this.setData({ gender: parseInt(e.detail.value) });
  },

  onAddressInput(e) {
    this.setData({ address: e.detail.value });
  },

  // 选择头像
  chooseAvatar() {
    wx.showActionSheet({
      itemList: ['输入头像URL', '使用默认头像'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 输入URL
          wx.showModal({
            title: '输入头像URL',
            content: '',
            editable: true,
            placeholderText: '请输入图片地址',
            success: (modalRes) => {
              if (modalRes.confirm && modalRes.content) {
                this.updateAvatar(modalRes.content);
              }
            }
          });
        } else {
          // 使用默认头像
          const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200';
          this.updateAvatar(defaultAvatar);
        }
      }
    });
  },

  // 更新头像
  updateAvatar(avatarUrl) {
    wx.showLoading({ title: '更新中...' });
    
    wx.request({
      url: 'http://localhost:8081/api/member/profile/update-avatar',
      method: 'POST',
      data: {
        memberId: this.data.memberId,
        avatar: avatarUrl
      },
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200) {
          this.setData({ avatar: res.data.avatar });
          wx.showToast({ title: '头像已更新', icon: 'success' });
        } else {
          wx.showToast({ title: '更新失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });
  },

  // 保存个人信息（生日、性别、地址）
  saveProfile() {
    wx.showLoading({ title: '保存中...' });
    
    const profile = {
      memberId: this.data.memberId,
      birthday: this.data.birthday,
      gender: this.data.gender,
      address: this.data.address
    };
    
    wx.request({
      url: 'http://localhost:8081/api/member/profile/update',
      method: 'POST',
      data: profile,
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200) {
          wx.showToast({ title: '保存成功', icon: 'success' });
        } else {
          wx.showToast({ title: '保存失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });
  }
});