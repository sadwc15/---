Page({
  data: {
    bookingId: null,
    mood: '非常专注',
    content: ''
  },
  onLoad(opt) {
    this.setData({ bookingId: opt.id });
  },
  selectMood(e) { this.setData({ mood: e.currentTarget.dataset.val }); },
  inputContent(e) { this.setData({ content: e.detail.value }); },
  
  submit() {
    if (!this.data.content) return wx.showToast({ title: '请填写评语', icon: 'none' });
    
    wx.showLoading({ title: '提交中' });
    wx.request({
      url: 'http://localhost:8081/api/business/write-record',
      method: 'POST',
      data: {
        bookingId: this.data.bookingId,
        mood: this.data.mood,
        content: this.data.content
      },
      success: (res) => {
        wx.hideLoading();
        if(res.statusCode === 200) {
          wx.showToast({ title: '提交成功' });
          setTimeout(() => wx.navigateBack(), 1500);
        }
      }
    })
  }
})