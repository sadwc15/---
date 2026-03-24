const app = getApp();
const request = require('../../../utils/request.js');

Page({
  data: {
    loading: true,
    btnLoading: false,
    error: '',
    bookingId: null,
    sessionInfo: null
  },

  onLoad(options) {
    console.log('课堂详情参数:', options);
    const bookingId = options.bookingId;
    
    if (!bookingId) {
      this.setData({
        error: '参数错误：缺少课程ID',
        loading: false
      });
      return;
    }

    this.setData({ bookingId });
    this.fetchSessionInfo();
  },

  // 获取课程信息
  fetchSessionInfo() {
    this.setData({ loading: true, error: '' });

    request.get(`/session/info?bookingId=${this.data.bookingId}`)
      .then(res => {
        console.log('获取课程信息成功:', res);
        
        if (res) {
          this.setData({
            sessionInfo: res,
            loading: false
          });
        } else {
          this.setData({
            error: '课程信息不存在',
            loading: false
          });
        }
      })
      .catch(err => {
        console.error('获取课程信息失败:', err);
        this.setData({
          error: '获取课程信息失败',
          loading: false
        });
      });
  },

  // 下课
  handleFinish() {
    wx.showModal({
      title: '确认下课',
      content: '确定要结束本次课程吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ btnLoading: true });

          request.post(`/session/finish?bookingId=${this.data.bookingId}`)
            .then(res => {
              console.log('下课成功:', res);
              
              wx.showToast({
                title: '课程已结束',
                icon: 'success'
              });

              // 更新本地状态
              if (this.data.sessionInfo) {
                const updatedInfo = {
                  ...this.data.sessionInfo,
                  sessionStatus: 2  // 设置为已完成
                };
                this.setData({ sessionInfo: updatedInfo });
              }

              // 延迟返回上一页
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                });
              }, 1500);
            })
            .catch(err => {
              console.error('下课失败:', err);
              wx.showToast({
                title: '操作失败',
                icon: 'none'
              });
            })
            .finally(() => {
              this.setData({ btnLoading: false });
            });
        }
      }
    });
  },

  // 格式化时间
  formatTime(isoString) {
    if (!isoString) return '未知时间';
    
    try {
      const date = new Date(isoString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hour = date.getHours().toString().padStart(2, '0');
      const minute = date.getMinutes().toString().padStart(2, '0');
      
      return `${year}-${month}-${day} ${hour}:${minute}`;
    } catch (e) {
      return isoString.substring(0, 16).replace('T', ' ');
    }
  },

  // 重试加载
  retryLoad() {
    this.fetchSessionInfo();
  },

  // 返回上一页
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  }
});