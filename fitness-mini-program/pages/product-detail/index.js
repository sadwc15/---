const app = getApp();

Page({
  data: {
    product: null
  },

  onLoad(options) {
    // 接收列表页传来的商品对象字符串
    if (options.item) {
      const item = JSON.parse(decodeURIComponent(options.item));
      this.setData({ product: item });
    }
  },

  handleBuy() {
    if (!app.checkLogin()) return;

    const p = this.data.product;
    wx.showModal({
      title: '确认购买',
      content: `确认支付 ¥${p.price} 购买 ${p.name} 吗？`,
      success: (res) => {
        if (res.confirm) {
          // 这里为了简化，直接调用之前的“扣余额”接口逻辑
          // 实际项目中应该有专门的 /api/shop/buy 接口
          // 这里我们演示前端模拟扣款反馈
          wx.showLoading({ title: '支付中...' });
          
          // 模拟网络延迟
          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({ title: '购买成功', icon: 'success' });
            // 实际应该调用后端减库存接口
          }, 1000);
        }
      }
    })
  }
})