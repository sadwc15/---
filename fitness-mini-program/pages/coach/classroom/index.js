const app = getApp();
const request = require('../../../utils/request.js');

Page({
  data: {
    loading: true,
    sessions: []
  },

  onLoad() {
    this.fetchActiveSessions();
  },

  onShow() {
    // 每次显示页面时刷新数据（比如从详情页返回）
    if (!this.data.loading) {
      this.fetchActiveSessions();
    }
  },

  // 获取进行中的课程列表
  fetchActiveSessions() {
    const coachId = app.globalData.userInfo?.id;
    
    if (!coachId) {
      console.error('教练ID不存在');
      this.setData({ 
        loading: false,
        sessions: []
      });
      wx.showToast({
        title: '用户信息错误',
        icon: 'none'
      });
      return;
    }

    this.setData({ loading: true });

    request.get(`/session/coach/active-sessions?coachId=${coachId}`)
      .then(res => {
        console.log('获取课堂列表成功:', res);
        
        // 处理返回数据，确保是数组
        const sessions = Array.isArray(res) ? res : [];
        
        this.setData({
          sessions: sessions,
          loading: false
        });
      })
      .catch(err => {
        console.error('获取课堂列表失败:', err);
        this.setData({
          sessions: [],
          loading: false
        });
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        });
      });
  },

  // 格式化时间
  formatTime(isoString) {
    if (!isoString) return '未知时间';
    
    try {
      // 将 "2026-03-14T04:48:00" 转换为 "2026-03-14 04:48"
      const date = new Date(isoString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hour = date.getHours().toString().padStart(2, '0');
      const minute = date.getMinutes().toString().padStart(2, '0');
      
      return `${year}-${month}-${day} ${hour}:${minute}`;
    } catch (e) {
      console.error('时间格式化失败:', e);
      return isoString.substring(0, 16).replace('T', ' ');
    }
  },

  // 头像加载失败时的处理
  onAvatarError(e) {
    const index = e.currentTarget.dataset.index;
    const sessions = this.data.sessions;
    if (sessions[index]) {
      // 使用默认头像
      sessions[index].member.avatar = '/assets/images/default-avatar.png';
      this.setData({ sessions });
    }
  },

  // 进入课堂详情
  goToClassDetail(e) {
    const bookingId = e.currentTarget.dataset.bookingid;
    if (!bookingId) {
      wx.showToast({
        title: '参数错误',
        icon: 'none'
      });
      return;
    }

    wx.navigateTo({
      url: `/pages/coach/class-detail/index?bookingId=${bookingId}`,
      fail: (err) => {
        console.error('跳转失败:', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  // 下拉刷新（可选）
  onPullDownRefresh() {
    this.fetchActiveSessions();
    wx.stopPullDownRefresh();
  }
});