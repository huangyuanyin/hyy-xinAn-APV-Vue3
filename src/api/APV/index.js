import request from "@/utils/request.js";
import qs from 'qs'
// 设备管理 - 获取
export function deviceApi(params) {
  return request({
    url: "/device/",
    method: "get",
    urlType: "APV",
    params,
  });
}

// 设备管理 - 添加
export function addDeviceApi(params) {
  return request({
    url: "/device/",
    method: "post",
    urlType: "APV",
    data: qs.stringify(params),
  });
}

// 设备类型 - 获取
export function d_typeApi(params) {
  return request({
    url: "/d_type/",
    method: "get",
    urlType: "APV",
    params,
  });
}

// 设备类型 - 添加
export function addD_typeApi(params) {
  return request({
    url: "/d_type/",
    method: "post",
    urlType: "APV",
    data: qs.stringify(params),
  });
}

// 设备类型 - 删除
export function deleteD_typeApi(params) {
  return request({
    url: "/d_type/",
    method: "DELETE",
    urlType: "APV",
    data: qs.stringify(params),
  });
}

// 分组管理 - 获取
export function d_groupApi(params) {
  return request({
    url: "/d_group/",
    method: "get",
    urlType: "APV",
    params,
  });
}

// 分组管理 - 添加
export function addD_groupApi(params) {
  return request({
    url: "/d_group/",
    method: "post",
    urlType: "APV",
    data: qs.stringify(params),
  });
}

// 分组管理 - 删除
export function deleteD_groupApi(params) {
  return request({
    url: `/d_group/`,
    method: "DELETE",
    urlType: "APV",
    data: qs.stringify(params),
  });
}
