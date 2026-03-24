import request from '@/utils/request'

// 查询教练信息管理列表
export function listCoaches(query) {
  return request({
    url: '/fitness-backend/coaches/list',
    method: 'get',
    params: query
  })
}

// 查询教练信息管理详细
export function getCoaches(id) {
  return request({
    url: '/fitness-backend/coaches/' + id,
    method: 'get'
  })
}

// 新增教练信息管理
export function addCoaches(data) {
  return request({
    url: '/fitness-backend/coaches',
    method: 'post',
    data: data
  })
}

// 修改教练信息管理
export function updateCoaches(data) {
  return request({
    url: '/fitness-backend/coaches',
    method: 'put',
    data: data
  })
}

// 删除教练信息管理
export function delCoaches(id) {
  return request({
    url: '/fitness-backend/coaches/' + id,
    method: 'delete'
  })
}
