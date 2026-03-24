// utils/api.js
const BASE_URL = 'http://localhost:8081/api';

// 通用请求函数
const request = (url, method = 'GET', data = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject({ message: '请求失败', statusCode: res.statusCode });
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

module.exports = {
  // 获取课程信息
  getSessionInfo(bookingId) {
    return request(`/session/info?bookingId=${bookingId}`);
  },

  // 开始上课
  startSession(bookingId) {
    return request(`/session/start?bookingId=${bookingId}`, 'POST');
  },

  // 结束上课
  finishSession(bookingId) {
    return request(`/session/finish?bookingId=${bookingId}`, 'POST');
  },

  // 获取当前用户的上课中课程
  getMyActiveSession(memberId) {
    return request(`/session/member/active-session?memberId=${memberId}`);
  }
};