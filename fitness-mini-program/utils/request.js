const BASE_URL = 'http://localhost:8081/api';

const request = (url, method, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + url,
      method: method,
      data: data,
      header: { 'content-type': 'application/json' },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          wx.showToast({ title: '请求失败', icon: 'none' });
          reject(res);
        }
      },
      fail: (err) => {
        wx.showToast({ title: '网络异常', icon: 'none' });
        reject(err);
      }
    })
  })
}

module.exports = {
  get: (url) => request(url, 'GET'),
  post: (url, data) => request(url, 'POST', data)
}