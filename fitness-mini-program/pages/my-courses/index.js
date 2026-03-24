const app = getApp();
const request = require('../../utils/request.js');

Page({
  data: {
    loading: true,
    btnLoading: false,
    error: '',
    bookingId: null,
    sessionInfo: null,
    timer: null,
    formattedTime: '00:00',
    elapsedSeconds: 0,
    // 状态常量
    SESSION_STATUS: {
      PENDING: 0,     // 待开始
      ACTIVE: 1,      // 上课中
      COMPLETED: 2,   // 已完成
      CANCELLED: 3    // 已取消
    }
  },

  onLoad(options) {
    console.log('页面参数:', options);
    // 获取URL参数中的bookingId (可能是 id 或 bookingId)
    const bookingId = options.id || options.bookingId;
    this.setData({ bookingId });
    
    // 初始化页面数据
    this.initPage();
  },

  onShow() {
    // 每次显示页面时刷新数据
    if (!this.data.loading) {
      this.initPage();
    }
  },

  onUnload() {
    // 页面卸载时清除定时器
    this.clearTimer();
  },

  // 初始化页面
  initPage() {
    this.setData({ loading: true, error: '' });
    
    if (this.data.bookingId) {
      // 有bookingId：获取指定课程信息
      this.fetchSessionInfo(this.data.bookingId);
    } else {
      // 无bookingId：获取当前用户的上课中课程
      this.fetchActiveSession();
    }
  },

  // 获取指定课程信息
  fetchSessionInfo(bookingId) {
    console.log('获取课程信息, bookingId:', bookingId);
    
    request.get(`/session/info?bookingId=${bookingId}`).then(res => {
      console.log('课程信息返回:', res);
      
      // 根据实际返回格式构建sessionInfo
      const sessionInfo = this.buildSessionInfo(res, bookingId);
      this.setData({ sessionInfo, loading: false });
      this.handleSessionStatus(sessionInfo);
    }).catch(err => {
      console.error('获取课程信息异常:', err);
      this.setData({ 
        error: '获取课程信息失败',
        loading: false 
      });
    });
  },

  // 获取当前用户的上课中课程
  fetchActiveSession() {
    const memberId = app.globalData.userInfo?.id;
    if (!memberId) {
      this.setData({ 
        error: '用户未登录',
        loading: false 
      });
      return;
    }

    console.log('获取活跃课程, memberId:', memberId);
    
    request.get(`/session/member/active-session?memberId=${memberId}`).then(res => {
      console.log('活跃课程返回:', res);
      
      // 检查返回是否为空
      if (res && Object.keys(res).length > 0) {
        // 有进行中的课程
        const sessionInfo = this.buildSessionInfo(res);
        this.setData({ sessionInfo, loading: false });
        this.handleSessionStatus(sessionInfo);
      } else {
        // 没有进行中的课程
        console.log('没有进行中的课程');
        this.setData({ 
          sessionInfo: null,
          loading: false 
        });
      }
    }).catch(err => {
      console.error('获取活跃课程失败:', err);
      this.setData({ 
        error: '获取课程失败',
        loading: false 
      });
    });
  },

  // 构建统一的sessionInfo格式
  buildSessionInfo(data, bookingId) {
    console.log('构建sessionInfo, 原始数据:', data);
    
    // 根据实际返回格式适配
    // 格式: { sessionStatus: 1, course: {...}, bookingId: 21 }
    
    const sessionStatus = data.sessionStatus !== undefined ? data.sessionStatus : 
                         (data.status !== undefined ? data.status : 0);
    
    const courseData = data.course || data;
    
    // 处理图片URL
    let courseImage = '/images/default-course.png';
    if (courseData.image) {
      // 如果是完整URL就直接用，否则加上基础URL
      courseImage = courseData.image.startsWith('http') ? courseData.image : courseData.image;
    }
    
    return {
      bookingId: data.bookingId || bookingId,
      sessionStatus: sessionStatus,
      courseTitle: courseData.title || '课程',
      courseImage: courseImage,
      bookingTime: data.bookingTime || this.formatDateTime(new Date()),
      coachName: courseData.coach?.name || '店内教练',
      startTime: data.startTime || null,
      // 保留原始数据
      rawData: data
    };
  },

  // 格式化日期时间
  formatDateTime(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}`;
  },

  // 处理课程状态
  handleSessionStatus(sessionInfo) {
    console.log('处理课程状态:', sessionInfo.sessionStatus);
    
    if (sessionInfo.sessionStatus === this.data.SESSION_STATUS.ACTIVE) {
      // 上课中：开始倒计时
      this.startTimer(sessionInfo);
    } else {
      // 其他状态：清除定时器
      this.clearTimer();
      this.setData({ formattedTime: '00:00' });
    }
  },

  // 开始倒计时
  startTimer(sessionInfo) {
    this.clearTimer(); // 先清除旧的定时器
    
    // 如果有startTime，计算已上课时间
    if (sessionInfo.startTime) {
      const startTime = new Date(sessionInfo.startTime).getTime();
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000); // 已上课秒数
      this.setData({ elapsedSeconds: Math.max(0, elapsed) });
      this.updateFormattedTime();
    }

    // 每秒更新
    const timer = setInterval(() => {
      const seconds = this.data.elapsedSeconds + 1;
      this.setData({ elapsedSeconds: seconds });
      this.updateFormattedTime();
    }, 1000);

    this.setData({ timer });
  },

  // 更新格式化时间
  updateFormattedTime() {
    const seconds = this.data.elapsedSeconds;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    this.setData({ formattedTime });
  },

  // 清除定时器
  clearTimer() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.setData({ timer: null });
    }
  },

  // 开始上课
  handleStart() {
    const bookingId = this.data.sessionInfo?.bookingId || this.data.bookingId;
    if (!bookingId) return;

    wx.showModal({
      title: '确认开始',
      content: '确定要开始上课吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ btnLoading: true });
          
          request.post(`/session/start?bookingId=${bookingId}`).then(res => {
            console.log('开始上课返回:', res);
            
            wx.showToast({ title: '开始上课', icon: 'success' });
            
            // 更新当前显示的状态
            if (this.data.sessionInfo) {
              const updatedInfo = { 
                ...this.data.sessionInfo, 
                sessionStatus: 1  // 设置为上课中
              };
              this.setData({ sessionInfo: updatedInfo });
              this.handleSessionStatus(updatedInfo);
            }
            
            // 重新获取数据
            setTimeout(() => {
              this.initPage();
            }, 1500);
            
          }).catch(err => {
            console.error('开始上课失败:', err);
            wx.showToast({ title: '操作失败', icon: 'none' });
          }).finally(() => {
            this.setData({ btnLoading: false });
          });
        }
      }
    });
  },

  // 下课
  handleFinish() {
    const bookingId = this.data.sessionInfo?.bookingId || this.data.bookingId;
    if (!bookingId) return;

    wx.showModal({
      title: '确认下课',
      content: '确定要结束本次课程吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ btnLoading: true });
          
          request.post(`/session/finish?bookingId=${bookingId}`).then(res => {
            console.log('下课返回:', res);
            
            // 根据你的返回格式：{ sessionStatus: 2, message: "下课成功", bookingId: 21 }
            wx.showToast({ title: '课程结束', icon: 'success' });
            
            // 更新当前显示的状态
            if (this.data.sessionInfo) {
              const updatedInfo = { 
                ...this.data.sessionInfo, 
                sessionStatus: 2  // 设置为已完成
              };
              this.setData({ sessionInfo: updatedInfo });
              this.handleSessionStatus(updatedInfo);
            }
            
            // 重新获取数据
            setTimeout(() => {
              this.initPage();
            }, 1500);
            
          }).catch(err => {
            console.error('下课失败:', err);
            wx.showToast({ title: '操作失败', icon: 'none' });
          }).finally(() => {
            this.setData({ btnLoading: false });
          });
        }
      }
    });
  }
});