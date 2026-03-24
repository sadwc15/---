Page({
  data: { record: null },
  onLoad(opt) {
    wx.request({
      url: `http://localhost:8081/api/business/record/${opt.id}`,
      success: res => {
        // 简单处理时间
        if(res.data.recordTime) res.data.timeStr = res.data.recordTime.replace('T', ' ');
        this.setData({ record: res.data });
      }
    })
  }
})