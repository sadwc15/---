const app = getApp();

Page({
  data: { 
    list: [] 
  },

  onShow() {
    if (!app.checkLogin()) return;
    this.fetchList();
  },

  // 跳转到课程详情页
  goToClassDetail(e) {
    console.log("卡片被点击，准备跳转到我的课堂");
    const id = e.currentTarget.dataset.id;  // 获取卡片id
    wx.navigateTo({
      url: `/pages/my-courses/index?id=${id}`,  // 跳转到我的课堂，并传递id
      fail: (err) => {
        console.error('跳转失败:', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  // 获取预约列表
  fetchList() {
    wx.showLoading({ title: '加载中' });
    const uid = app.globalData.userInfo.id;
    wx.request({
      url: `http://localhost:8081/api/business/my-bookings?memberId=${uid}`,
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200) {
          let data = res.data;
          // 简单排序
          data.sort((a, b) => b.id - a.id);
          // 时间格式简单处理
          data.forEach(d => {
            if(d.bookingTime) d.bookingTime = d.bookingTime.replace('T', ' ').substring(0,16);
          });
          this.setData({ list: data });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        console.error('请求失败:', err);
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });
  },

  // 模拟上课完成
  handleSimulate(e) {
    const id = e.currentTarget.dataset.id;
    wx.showLoading({ title: '生成报告中...' });
    
    wx.request({
      url: `http://localhost:8081/api/business/simulate-finish?bookingId=${id}`,
      method: 'POST',
      success: (res) => {
        wx.hideLoading();
        if(res.statusCode === 200) {
          wx.showToast({ title: '上课完成!' });
          this.fetchList(); // 刷新列表，按钮会变成“查看报告”
        } else {
          wx.showToast({ title: res.data, icon: 'none' });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        console.error('模拟完成失败:', err);
        wx.showToast({ title: '操作失败', icon: 'none' });
      }
    });
  },

  // 查看报告
  goRecord(e) {
    // 先判断有没有 recordId
    const item = e.currentTarget.dataset.item;
    console.log('查看报告:', item);
    
    if (item.hasRecord && item.recordId) {
       wx.navigateTo({
         url: `/pages/class-record/index?id=${item.recordId}`
       });
    } else {
       wx.showToast({ title: '暂无报告数据', icon: 'none' });
    }
  },

  // 取消预约
  handleCancel(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示', 
      content: '确定取消吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '取消中...' });
          wx.request({
            url: `http://localhost:8081/api/business/cancel?bookingId=${id}`,
            method: 'POST',
            success: (res) => {
              wx.hideLoading();
              if (res.statusCode === 200) {
                wx.showToast({ title: '已取消' });
                this.fetchList();
              } else {
                wx.showToast({ title: '取消失败', icon: 'none' });
              }
            },
            fail: (err) => {
              wx.hideLoading();
              console.error('取消失败:', err);
              wx.showToast({ title: '网络错误', icon: 'none' });
            }
          });
        }
      }
    });
  }
});