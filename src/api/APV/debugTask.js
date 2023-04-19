import request from '@/utils/request.js'

// 调试设备 - 获取
export function debugTaskApi(params) {
  return request({
    url: '/autoapv/debugtask/',
    method: 'get',
    urlType: 'APV',
    params
  })
}

// 调试设备 - 添加
export function addDebugTaskApi(params) {
  return request({
    url: '/autoapv/debugtask/',
    method: 'post',
    urlType: 'APV',
    data: params
  })
}

// 调试设备 - debug
export function toDebugApi(params) {
  return request({
    url: '/autoapv/debugtask/',
    method: 'put',
    urlType: 'APV',
    params
  })
}

// 调试设备 - 退出
export function exitDebugApi(id) {
  return request({
    url: `/autoapv/debugtask/?id=${id}`,
    method: 'delete',
    urlType: 'APV'
  })
}

// 一键升级
export function debugUpbuild(params) {
  return request({
    url: `/debug/upbuild/`,
    method: 'put',
    urlType: 'APV',
    params
  })
}

// 一键升级 - 查看日志
export function getDebugUpbuildLogApi(id) {
  return request({
    url: `/debug/upbuild/?id=${id}`,
    method: 'get',
    urlType: 'APV'
  })
}
