import request from "@/utils/request.js";

// 设备管理
export function deviceApi(params) {
  return request({
    url: "/device/",
    method: "get",
    urlType: "APV",
    params,
  });
}

// 分组
export function d_groupApi(params) {
  return request({
    url: "/d_group/",
    method: "get",
    urlType: "APV",
    params,
  });
}

// 设备类型
export function d_typeApi(params) {
  return request({
    url: "/d_type/",
    method: "get",
    urlType: "APV",
    params,
  });
}