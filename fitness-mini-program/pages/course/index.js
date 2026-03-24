const app = getApp();

Page({
  data: {
    fullList: [],   // 存放从后端拿到的（已按类型筛选过的）原始数据
    courseList: [], // 存放用于页面渲染的数据（可能经过搜索框再次筛选）
    searchText: '',
    filterType: null,
    bookedIds: [] // 初始必须是空数组
  },

  onLoad(options) {
    if (options.filter) {
      this.data.filterType = options.filter;
      let title = '全部课程';
      // 设置顶部标题
      if (options.filter === 'private') title = '私教严选';
      if (options.filter === 'group') title = '热门团课';
      if (options.filter === 'project') title = '专项训练营';
      wx.setNavigationBarTitle({ title });
    }
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.fetchCourses();
  },

  fetchCourses() {
    wx.showLoading({ title: '加载中' });

    // === 修改点 1：构造带参数的 URL ===
    let url = 'http://localhost:8081/api/public/courses';
    if (this.data.filterType) {
      // 如果有筛选类型 (private, group, project)，拼接到 URL 后面
      url += `?type=${this.data.filterType}`;
    }

    wx.request({
      url: url,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          let list = res.data || [];
          
          // 处理标签和时间
          list.forEach(item => {
            if (item.coach && item.coach.tags) {
              item.tagsArray = item.coach.tags.split('|');
            } else {
              item.tagsArray = ['热门', '推荐'];
            }
            // 简单处理时间显示 (把 2025-12-01T10:00:00 变成 12-01 10:00)
            if(item.startTime && item.startTime.includes('T')) {
                item.startTime = item.startTime.substring(5, 16).replace('T', ' ');
            }
          });

          this.data.fullList = list; // 存入原始数据
          
          // 获取完课程后，再去查我的预约状态
          this.fetchMyBookedIds(); 
        }
      },
      fail: () => {
         wx.hideLoading();
         // 失败清空
         this.setData({ courseList: [] });
      }
      // 注意：complete 移到 fetchMyBookedIds 里处理，或者单独处理
    });
  },

  fetchMyBookedIds() {
    // 如果没登录，直接渲染，不查预约状态
    if (!app.checkLogin()) {
      this.renderList(); // 渲染列表
      wx.hideLoading();
      return;
    }

    const uid = app.globalData.userInfo.id;
    wx.request({
      url: `http://localhost:8081/api/business/my-course-ids?memberId=${uid}`,
      success: (res) => {
        const ids = Array.isArray(res.data) ? res.data : [];
        this.setData({ bookedIds: ids });
        this.renderList(); // 拿到状态后渲染
      },
      fail: () => {
        this.setData({ bookedIds: [] });
        this.renderList();
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  // === 修改点 2：这里只负责搜索过滤和注入状态，不再负责类型过滤 ===
  // 因为类型过滤在 fetchCourses 请求后端时已经做完了
  renderList() {
    let list = this.data.fullList; // 这里面已经是后端筛选好的数据了
    const txt = this.data.searchText;
    const myIds = this.data.bookedIds || [];

    // 1. 前端搜索框过滤 (如果用户输入了字)
    if (txt) {
      list = list.filter(c => 
        c.title.includes(txt) || 
        (c.coach && c.coach.name && c.coach.name.includes(txt))
      );
    }

    // 2. 注入 "isBooked" 状态
    list.forEach(item => {
      item.isBooked = myIds.includes(item.id);
    });

    this.setData({ courseList: list });
  },

  // 搜索框输入
  onSearchInput(e) {
    this.setData({ searchText: e.detail.value });
  },
  // 点击搜索按钮
  handleSearch() {
    this.renderList();
  },

  // 跳转
  goBooking(e) {
    const item = e.currentTarget.dataset.item;
    // 需要登录才能约课
    if(!app.checkLogin()) return;
    
    const str = encodeURIComponent(JSON.stringify(item));
    wx.navigateTo({
      url: `/pages/course/booking?data=${str}`
    });
  }
})