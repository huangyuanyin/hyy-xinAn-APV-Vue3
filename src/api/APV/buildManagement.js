import request from "@/utils/request.js";
import qs from 'qs'

// build管理 - 获取
export function buildApi(params) {
  return request({
    url: "/base/files/",
    method: "get",
    urlType: "APV",
    data: params,
  });
}

// build管理 - 删除
export function deleteBuildApi(params) {
  return request({
    url: `/base/task/`,
    method: "DELETE",
    urlType: "APV",
    data: qs.stringify(params),
  });
}