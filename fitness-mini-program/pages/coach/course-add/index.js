const app = getApp();

Page({
  data: {
    title: '',
    price: '',
    description: '', // 新增：简介
    duration: 60,
    image: '',
    startDate: '',
    startTime: ''
  },

  // 通用输入处理
  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [field]: e.detail.value });
  },

  // 日期时间选择
  onDateChange(e) { this.setData({ startDate: e.detail.value }); },
  onTimeChange(e) { this.setData({ startTime: e.detail.value }); },

  // 选择图片
  chooseImage() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        // 实际项目这里需要 wx.uploadFile 上传到服务器
        this.setData({ image: res.tempFilePaths[0] });
      }
    });
  },

  // 提交新增
  submit() {
    const { title, price, description, startDate, startTime, duration, image } = this.data;
    
    if (!title || !price || !startDate || !startTime) {
      return wx.showToast({ title: '请填写完整', icon: 'none' });
    }

    wx.showLoading({ title: '发布中...' });
    
    // 拼接时间格式：2025-12-01T10:00:00
    const startDateTime = `${startDate}T${startTime}:00`;

    wx.request({
      url: 'http://localhost:8081/api/coach/courses',
      method: 'POST',
      header: { 'content-type': 'application/json' },
      data: {
        coachId: app.globalData.userInfo.id,
        title: title,
        price: parseFloat(price),
        description: description, // 提交简介
        startTime: startDateTime,
        duration: parseInt(duration),
        image: image || 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500', // 默认图
        type: 'PRIVATE',
        capacity: 1
      },
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200) {
          wx.showToast({ title: '发布成功' });
          setTimeout(() => wx.navigateBack(), 1500);
        } else {
          wx.showToast({ title: '发布失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });
  }
})