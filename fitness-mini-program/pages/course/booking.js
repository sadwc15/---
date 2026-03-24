const app = getApp();

Page({
  data: {
    course: null,
    
    // 日期相关
    dateList: [],       // 存放未来7天
    selectedDateIndex: 0, // 默认选第1个(今天)
    selectedTime: '',
    
    // 价格相关
    originalPrice: 0,
    finalPrice: 0,
    discountAmount: 0,
    
    // 优惠券相关
    usingCoupon: false,
    currentCoupon: null, // 当前选中的券对象
    couponList: [],      // 可用的券列表(用于弹窗选择)
    showCouponModal: false // 控制弹窗显示
  },

  onLoad(options) {
    const courseId = options.courseId;
    if (!courseId) return wx.showToast({ title: '参数错误', icon: 'none' });

    // 1. 生成未来7天日期
    this.generateDates();

    // 2. 获取课程详情
    this.fetchCourse(courseId);
  },

  generateDates() {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const list = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().substring(0, 10);
      const dayStr = i === 0 ? '今天' : days[d.getDay()];
      list.push({ full: dateStr, label: dayStr, day: d.getDate() });
    }
    this.setData({ dateList: list });
  },

  fetchCourse(id) {
    wx.request({
      url: `http://localhost:8081/api/public/courses/${id}`,
      success: (res) => {
        if (res.statusCode === 200) {
          const course = res.data;
          this.setData({ course: course });
          
          // 获取全局优惠券并尝试自动匹配一张
          this.initCoupons(course.price);
        }
      }
    });
  },

  // === 优惠券初始化 & 自动选择 ===
  initCoupons(price) {
    // 获取所有未使用的券
    const all = app.globalData.myCoupons || [];
    // 过滤出状态为0(未使用)的
    const validCoupons = all.filter(c => c.status === 0);
    
    this.setData({ couponList: validCoupons });

    // 检查是否有从上一页带过来的 selectedCouponId
    const preSelectedId = app.globalData.selectedCouponId;
    let matched = null;

    if (preSelectedId) {
      matched = validCoupons.find(c => String(c.id) === String(preSelectedId));
    }

    // 如果没有预选，也可以在这里做一个自动推荐逻辑(比如选金额最大的)
    // if (!matched && validCoupons.length > 0) matched = validCoupons[0];

    if (matched) {
      this.applyCoupon(matched, price);
    } else {
      this.calcFinalPrice(null, price); // 不用券
    }
  },

  // === 应用某张优惠券计算价格 ===
  applyCoupon(coupon, price) {
    let final = price - coupon.amount;
    if (final < 0) final = 0;

    this.setData({
      currentCoupon: coupon,
      usingCoupon: true,
      originalPrice: price,
      discountAmount: coupon.amount,
      finalPrice: parseFloat(final.toFixed(2))
    });
  },

  // === 不用券计算价格 ===
  calcFinalPrice(coupon, price) {
    this.setData({
      currentCoupon: null,
      usingCoupon: false,
      originalPrice: price,
      discountAmount: 0,
      finalPrice: price
    });
  },

  // === 交互事件 ===

  // 切换日期
  selectDate(e) {
    this.setData({ selectedDateIndex: e.currentTarget.dataset.index });
  },

  // 切换时间
  selectTime(e) {
    this.setData({ selectedTime: e.currentTarget.dataset.time });
  },

  // 打开优惠券选择弹窗
  openCouponModal() {
    if (this.data.couponList.length === 0) {
      return wx.showToast({ title: '暂无可用优惠券', icon: 'none' });
    }
    this.setData({ showCouponModal: true });
  },

  // 关闭弹窗
  closeCouponModal() {
    this.setData({ showCouponModal: false });
  },

  // 选中某张券
  chooseCoupon(e) {
    const coupon = e.currentTarget.dataset.item;
    // 如果点的是当前已选的，就是取消选择
    if (this.data.currentCoupon && this.data.currentCoupon.id === coupon.id) {
        this.calcFinalPrice(null, this.data.course.price);
    } else {
        this.applyCoupon(coupon, this.data.course.price);
    }
    this.setData({ showCouponModal: false });
  },

  // === 提交支付 ===
  submitPayment() {
    if (!this.data.selectedTime) {
      return wx.showToast({ title: '请选择时间段', icon: 'none' });
    }

    const user = app.globalData.userInfo;
    const payPrice = this.data.finalPrice; // 实付金额

    console.log(`余额:${user.balance}, 需付:${payPrice}`);

    // 余额检查
    if (user.balance < payPrice) {
      return wx.showModal({
        title: '余额不足',
        content: `当前余额 ¥${user.balance}，需支付 ¥${payPrice}`,
        confirmText: '去充值',
        success: (res) => {
          if(res.confirm) wx.navigateTo({ url: '/pages/recharge/index' });
        }
      });
    }

    wx.showLoading({ title: '支付中...' });

    // 构造完整的时间字符串 (例如: 2025-12-05 14:00:00)
    const dateObj = this.data.dateList[this.data.selectedDateIndex];
    // const fullTime = `${dateObj.full} ${this.data.selectedTime}:00`; // 如果后端需要时间，可传这个

    wx.request({
      url: 'http://localhost:8081/api/business/book',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        memberId: user.id,
        courseId: this.data.course.id,
        
        // ★★★ 核心修复：将实付金额传给后端 ★★★
        // 这样后端就不会傻傻地按原价去扣费了
        payAmount: payPrice 
      },
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200) {
          
          // 1. 本地扣余额 (保持显示同步)
          app.globalData.userInfo.balance -= payPrice;

          // 2. 核销选中的券
          if (this.data.usingCoupon && this.data.currentCoupon) {
            // 记录刚用的
            app.globalData.lastUsedCouponId = this.data.currentCoupon.id;
            app.globalData.selectedCouponId = null; 

            // 更新全局列表状态
            const list = app.globalData.myCoupons;
            list.forEach(c => {
              if (c.id === this.data.currentCoupon.id) c.status = 1;
            });
            app.globalData.myCoupons = list;
          }

          wx.showToast({ title: '预约成功' });
          setTimeout(() => {
            wx.redirectTo({ url: '/pages/my-bookings/index' });
          }, 1500);

        } else {
          wx.showToast({ title: res.data || '失败', icon: 'none' });
        }
      }
    });
  }
})