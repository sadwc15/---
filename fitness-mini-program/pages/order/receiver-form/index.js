Page({
  data: {
    productId: null,
    name: '',
    phone: '',
    address: ''
  },

  onLoad(options) {
    console.log('收货信息页接收参数:', options);
    this.setData({ 
      productId: options.productId,
      name: '',
      phone: '',
      address: ''
    });
  },

  onNameInput(e) {
    this.setData({ name: e.detail.value });
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  onAddressInput(e) {
    this.setData({ address: e.detail.value });
  },

  submitReceiver() {
    const { name, phone, address, productId } = this.data;
    
    // 表单验证
    if (!name || !name.trim()) {
      wx.showToast({ title: '请输入收货人姓名', icon: 'none' });
      return;
    }
    
    if (!phone || !phone.trim()) {
      wx.showToast({ title: '请输入手机号码', icon: 'none' });
      return;
    }
    
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({ title: '手机号格式不正确', icon: 'none' });
      return;
    }
    
    if (!address || !address.trim()) {
      wx.showToast({ title: '请输入收货地址', icon: 'none' });
      return;
    }
    
    // 返回上一页并传递数据，但不立即支付
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    prevPage.setData({
      receiverInfo: { name, phone, address },
      showConfirmButton: true // 让上一页显示确认支付按钮
    });
    
    wx.navigateBack();
  }
});