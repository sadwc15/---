const app = getApp();

Page({
  data: { courses: [] },

  onShow() {
    this.fetchData();
  },

  fetchData() {
    wx.showLoading({ title: '加载数据' });
    const coachId = app.globalData.userInfo.id; // 确保获取到 ID
    wx.request({
      url: `http://localhost:8081/api/coach/${coachId}/courses`,
      success: (res) => {
        wx.hideLoading();
        let list = res.data || [];
        
        // 格式化时间: 2025-12-01T10:00:00 -> 12月01日 10:00
        list.forEach(item => {
          if(item.startTime) {
            const dt = new Date(item.startTime);
            const m = (dt.getMonth()+1).toString().padStart(2,'0');
            const d = dt.getDate().toString().padStart(2,'0');
            const h = dt.getHours().toString().padStart(2,'0');
            const min = dt.getMinutes().toString().padStart(2,'0');
            item.timeStr = `${m}月${d}日 ${h}:${min}`;
          }
        });

        // 按时间排序
        list.sort((a,b) => new Date(a.startTime) - new Date(b.startTime));
        this.setData({ courses: list });
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '加载失败', icon: 'none' });
      }
    })
  },

  // === 新增逻辑：跳转到专门的新增页 ===
  goAdd() {
    wx.navigateTo({ 
      url: '/pages/coach/course-add/index' 
    });
  },

  // === 修改逻辑：跳转到专门的修改页，只传 ID ===
  goEdit(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ 
      url: `/pages/coach/course-edit/index?id=${id}` 
    });
  },

  // 删除逻辑
  handleDelete(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '警告', 
      content: '确定取消这门课吗？', 
      confirmColor: '#ff4d4f',
      success: (res) => {
        if(res.confirm) {
          wx.request({
            // 注意：建议统一用 /courses (复数)，保持与 edit 页面一致
            url: `http://localhost:8081/api/coach/courses/${id}`,
            method: 'DELETE',
            success: (apiRes) => {
              if(apiRes.statusCode === 200) {
                wx.showToast({ title: '已取消' });
                this.fetchData(); // 重新刷新列表
              } else {
                wx.showToast({ title: '删除失败', icon: 'none' });
              }
            }
          })
        }
      }
    })
  }
})