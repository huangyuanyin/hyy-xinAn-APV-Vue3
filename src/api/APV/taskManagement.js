import request from "@/utils/request.js";
import qs from 'qs'

// 任务管理 - 获取
export function taskApi(params) {
  return request({
    url: "/autoapv/task/",
    method: "get",
    urlType: "APV",
    params,
  });
}

// 任务管理 - 添加
export function addTaskApi(params) {
  return request({
    url: "/autoapv/task/",
    method: "post",
    urlType: "APV",
    data: qs.stringify(params),
  });
}

// 任务管理 - 编辑
export function editTaskApi(params) {
  return request({
    url: "/autoapv/task/",
    method: "PUT",
    urlType: "APV",
    data: qs.stringify(params),
  });
}

// 任务管理 - 删除
export function deleteTaskApi(params) {
  return request({
    url: `/autoapv/task/`,
    method: "DELETE",
    urlType: "APV",
    params,
  });
}