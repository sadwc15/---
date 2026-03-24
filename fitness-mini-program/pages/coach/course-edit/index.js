const app = getApp();

Page({
  data: {
    id: null,
    title: '',
    price: '',
    description: '', // 新增：简介
    duration: 60,
    image: '',
    startDate: '',
    startTime: ''
  },

  onLoad(options) {
    // 必须要有 ID
    if (options.id) {
      this.setData({ id: options.id });
      this.fetchDetail(options.id);
    }
  },

  // 获取详情进行回显
  fetchDetail(id) {
    wx.showLoading({ title: '加载中' });
    wx.request({
      url: `http://localhost:8081/api/public/courses/${id}`,
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200) {
          const c = res.data;
          // 处理时间格式
          const datePart = c.startTime ? c.startTime.split('T')[0] : '';
          const timePart = c.startTime ? c.startTime.split('T')[1].substring(0, 5) : '';

          this.setData({
            title: c.title,
            price: c.price,
            description: c.description || '', // 回显简介
            duration: c.duration,
            image: c.image,
            startDate: datePart,
            startTime: timePart
          });
        }
      }
    });
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [field]: e.detail.value });
  },
  onDateChange(e) { this.setData({ startDate: e.detail.value }); },
  onTimeChange(e) { this.setData({ startTime: e.detail.value }); },

  chooseImage() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        this.setData({ image: res.tempFilePaths[0] });
      }
    });
  },

  // 保存修改
  submit() {
    const { id, title, price, description, startDate, startTime, duration, image } = this.data;
    
    wx.showLoading({ title: '保存中...' });

    wx.request({
      url: 'http://localhost:8081/api/coach/courses',
      method: 'POST', 
      header: { 'content-type': 'application/json' },
      data: {
        id: id, // 传ID表示修改
        coachId: app.globalData.userInfo.id,
        title,
        price: parseFloat(price),
        description, // 提交简介
        startTime: `${startDate}T${startTime}:00`,
        duration: parseInt(duration),
        image,
        type: 'PRIVATE'
      },
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200) {
          wx.showToast({ title: '修改成功' });
          setTimeout(() => wx.navigateBack(), 1500);
        } else {
          wx.showToast({ title: '修改失败', icon: 'none' });
        }
      }
    });
  },

  // 删除课程
  deleteCourse() {
    wx.showModal({
      title: '警告',
      content: '确定删除该课程吗？',
      confirmColor: '#ff4d4f',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: `http://localhost:8081/api/coach/courses/${this.data.id}`,
            method: 'DELETE',
            success: () => {
              wx.showToast({ title: '已删除' });
              setTimeout(() => wx.navigateBack(), 1500);
            }
          });
        }
      }
    })
  }
})