Page({
  data: { list: [] },
  onLoad(opt) {
    if(opt.data) {
      const list = JSON.parse(decodeURIComponent(opt.data));
      this.setData({ list });
    }
  }
})