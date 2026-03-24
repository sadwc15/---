const app = getApp();

Page({
  data: {
    product: null,
    finalPrice: 0,
    couponAmount: 0,
    usingCoupon: false,
    receiverInfo: null
  },

  onLoad(options) {
    if (options.data) {
      const item = JSON.parse(decodeURIComponent(options.data));
      
      const couponId = app.globalData.selectedCouponId;
      
      let discount = 0;
      let isUsing = false;

      if (couponId == 1) {
        discount = 50;
        isUsing = true;
      } else if (couponId == 2) {
        discount = 20;
        isUsing = true;
      }

      let final = item.price - discount;
      if (final < 0) final = 0;

      this.setData({ 
        product: item,
        couponAmount: discount,
        usingCoupon: isUsing,
        finalPrice: parseFloat(final.toFixed(2))
      });
    }
  },

  // 跳转到填写收货信息
  goToReceiverForm() {
    if (!this.data.product || !this.data.product.id) {
      wx.showToast({ title: '商品信息错误', icon: 'none' });
      return;
    }
    
    wx.navigateTo({
      url: `/pages/order/receiver-form/index?productId=${this.data.product.id}`
    });
  },

  // 确认支付
  confirmPay() {
    if (!this.data.receiverInfo) {
      wx.showModal({
        title: '提示',
        content: '请先填写收货信息',
        confirmText: '去填写',
        success: (res) => {
          if (res.confirm) {
            this.goToReceiverForm();
          }
        }
      });
      return;
    }
    
    const priceStr = this.data.finalPrice;
    const couponMsg = this.data.usingCoupon ? `(已抵扣 ¥${this.data.couponAmount})` : '';

    wx.showModal({
      title: '确认支付',
      content: `实付 ¥${priceStr} ${couponMsg}，确认购买吗？`,
      confirmColor: '#07c160', 
      success: (res) => {
        if(res.confirm) {
          this.doPay();
        }
      }
    });
  },

  doPay() {
    wx.showLoading({ title: '支付中...' });
    
    wx.request({
      url: 'http://localhost:8081/api/shop/buy',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        memberId: app.globalData.userInfo.id,
        productId: this.data.product.id
      },
      success: (res) => {
        if(res.statusCode === 200) {
          let orderId = null;
          if (typeof res.data === 'object' && res.data !== null) {
            orderId = res.data.id || res.data.orderId;
          } else {
            orderId = res.data;
          }
          
          if (!orderId) {
            wx.hideLoading();
            wx.showToast({ title: '订单创建失败', icon: 'none' });
            return;
          }
          
          const receiverData = {
            productOrdersId: orderId,
            name: this.data.receiverInfo.name,
            phone: this.data.receiverInfo.phone,
            address: this.data.receiverInfo.address
          };
          
          wx.request({
            url: 'http://localhost:8081/api/shop/save-receiver',
            method: 'POST',
            data: receiverData,
            success: (saveRes) => {
              if (saveRes.statusCode === 200) {
                if (this.data.usingCoupon) {
                  app.globalData.userInfo.balance += this.data.couponAmount; 
                  app.globalData.lastUsedCouponId = app.globalData.selectedCouponId;
                  app.globalData.selectedCouponId = null; 
                }
                
                wx.hideLoading();
                wx.showToast({ title: '购买成功' });

                setTimeout(() => {
                  wx.redirectTo({ url: '/pages/order/index' });
                }, 1500);
              } else {
                wx.hideLoading();
                wx.showToast({ title: '保存收货信息失败', icon: 'none' });
              }
            },
            fail: () => {
              wx.hideLoading();
              wx.showToast({ title: '网络错误', icon: 'none' });
            }
          });
        } else {
          wx.hideLoading();
          wx.showModal({ title: '购买失败', content: res.data, showCancel: false });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });
  }
});