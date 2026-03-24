const app = getApp();

Page({
  data: {
    scheduleList: [], // 课程表
    myBookedIds: []   // 我预约过的课程ID列表
  },

  onShow() {
    this.fetchSchedule();
  },

  // 并行获取“课程列表”和“我的预约记录”
  fetchSchedule() {
    wx.showLoading({ title: '加载课表中...' });

    // 1. 获取所有课程
    const p1 = new Promise((resolve) => {
      wx.request({
        url: 'http://localhost:8081/api/courses',
        success: (res) => resolve(res.data || [])
      });
    });

    // 2. 获取我已预约的ID (如果未登录则跳过)
    const p2 = new Promise((resolve) => {
      if (app.globalData.isLogin && app.globalData.userInfo) {
        wx.request({
          url: `http://localhost:8081/api/business/my-course-ids?memberId=${app.globalData.userInfo.id}`,
          success: (res) => resolve(res.data || [])
        });
      } else {
        resolve([]);
      }
    });

    Promise.all([p1, p2]).then(([courses, bookedIds]) => {
      wx.hideLoading();
      
      // 处理数据：格式化时间
      courses.forEach(c => {
        const dt = new Date(c.startTime);
        c.dateStr = `${dt.getMonth()+1}月${dt.getDate()}日`;
        c.timeStr = `${dt.getHours().toString().padStart(2,'0')}:${dt.getMinutes().toString().padStart(2,'0')}`;
        
        // 计算状态逻辑
        if (bookedIds.includes(c.id)) {
          c.status = 'BOOKED'; // 已预约
        } else if (c.capacity <= 0) {
          c.status = 'FULL';   // 已满
        } else {
          c.status = 'OPEN';   // 可约
        }
      });

      // 排序
      courses.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

      this.setData({
        scheduleList: courses,
        myBookedIds: bookedIds
      });
    });
  },

  // 处理点击卡片
  handleCardTap(e) {
    if (!app.checkLogin()) return;

    const item = e.currentTarget.dataset.item;
    
    if (item.status === 'BOOKED') {
      // 退票逻辑
      this.handleRefund(item);
    } else if (item.status === 'FULL') {
      // 候补逻辑
      this.handleWaitlist(item);
    } else {
      // 正常预约
      this.handleBook(item);
    }
  },

  // 退票
  handleRefund(item) {
    wx.showModal({
      title: '退票确认',
      content: `确定要取消 ${item.dateStr} 的 ${item.title} 吗？资金将退回余额。`,
      cancelText: '再想想',
      confirmText: '确认退票',
      confirmColor: '#ff4d4f',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: `http://localhost:8081/api/business/cancel?memberId=${app.globalData.userInfo.id}&courseId=${item.id}`,
            method: 'POST',
            success: () => {
              wx.showToast({ title: '退票成功' });
              this.fetchSchedule(); // 刷新状态
            }
          });
        }
      }
    })
  },

  // 候补
  handleWaitlist(item) {
    wx.showModal({
      title: '加入候补',
      content: '当前课程已满员，是否加入候补队列？有空位时将短信通知您。',
      success: (res) => {
        if (res.confirm) {
          // 这里仅做前端模拟，实际项目需后端支持
          wx.showToast({ title: '已加入候补', icon: 'success' });
        }
      }
    })
  },

  // 预约 (复用之前的逻辑)
  handleBook(item) {
    wx.showModal({
      title: '确认预约',
      content: `支付 ¥${item.price} 预约该课程？`,
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: `http://localhost:8081/api/business/book?memberId=${app.globalData.userInfo.id}&courseId=${item.id}`,
            method: 'POST',
            success: (res) => {
              if(res.statusCode === 200) {
                wx.showToast({ title: '预约成功' });
                this.fetchSchedule();
              } else {
                wx.showToast({ title: res.data || '失败', icon: 'none' });
              }
            }
          });
        }
      }
    })
  }
})