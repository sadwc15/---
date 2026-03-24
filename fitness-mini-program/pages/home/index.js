const app = getApp();

Page({
  data: {
    newsList: [], // 资讯列表数据
    // 六宫格配置
    gridItems: [
      { id: 1, name: '精选好物', icon: '/assets/images/course.png', type: 'shop' },
      { id: 2, name: '私教预约', icon: '/assets/images/profile.png', type: 'private' },
      { id: 3, name: '项目预约', icon: '/assets/images/home.png', type: 'project' },
      { id: 4, name: '团课预约', icon: '/assets/images/course.png', type: 'group' },
      { id: 5, name: '预约日历', icon: '/assets/images/home.png', type: 'calendar' },
      // 这里的 name 已经叫 "关于我们" 了，图标如果需要也可以换一下
      { id: 6, name: '关于我们', icon: '/assets/images/profile.png', type: 'about' }
    ]
  },

  /**
   * 页面加载生命周期
   */
  onLoad() {
    this.fetchNews();
  },

  /**
   * 获取资讯列表
   */
  fetchNews() {
    wx.request({
      url: 'http://localhost:8081/api/public/news',
      method: 'GET',
      success: (res) => {
        if(res.statusCode === 200) {
          this.setData({ newsList: res.data });
        }
      },
      fail: () => {
        console.log('获取资讯失败');
      }
    })
  },

  /**
   * 处理六宫格点击跳转
   */
  handleGridTap(e) {
    const type = e.currentTarget.dataset.type;
    
    // 1. 跳转到商城 (TabBar)
    if (type === 'shop') {
      wx.switchTab({ url: '/pages/shop/index' });
    } 
    // 2. 跳转到日历 (TabBar)
    else if (type === 'calendar') {
      wx.switchTab({ url: '/pages/calendar/index' });
    } 
    // 3. 跳转到课程列表 (普通页面，带筛选参数)
    // 注意：如果 pages/course/index 是 TabBar 页面，这里 navigateTo 是跳不过去的
    // 如果它是 TabBar，你需要用 wx.switchTab({ url: '/pages/course/index' })，但不能带参数
    else if (['private', 'group', 'project'].includes(type)) {
      wx.navigateTo({ 
        url: `/pages/course/index?filter=${type}`,
        fail: () => {
          // 如果跳转失败(比如它是tabbar)，尝试直接切换
          wx.switchTab({ url: '/pages/course/index' });
        }
      });
    } 
    // 4. 关于我们 (修改为跳转到专门的介绍页)
    else if (type === 'about') {
      wx.navigateTo({
        url: '/pages/about/index'
      });
    }
  },

  /**
   * 处理资讯点击跳转 (跳到详情页)
   */
  goNewsDetail(e) {
    const id = e.currentTarget.dataset.id;
    if (id) {
      wx.navigateTo({
        url: `/pages/news-detail/index?id=${id}`
      });
    }
  },
  goSearch() {
    // 跳转到课程页 (注意：如果 course 是 tabBar 页面，要用 switchTab)
    // 这里假设 course 是普通页面或者你想带参数跳
    // 如果 course 是 TabBar，你没法带搜索关键词过去，只能跳过去让用户再点一下
    
    // 方案 A: 如果 course 是普通页面
    wx.navigateTo({ url: '/pages/course/index?focus=true' });
    
    // 方案 B: 如果 course 是 TabBar
    // wx.switchTab({ url: '/pages/course/index' });
  },
})