import request from "@/utils/request.js";
import qs from 'qs'

// 测试报告 - 获取
export function getReportApi(params) {
  return request({
    url: "/autoapv/report/",
    method: "get",
    urlType: "APV",
    params,
  });
}

// 测试报告详情 - 获取
export function getReportDetailApi(params) {
  return request({
    url: "/autoapv/report/",
    method: "get",
    urlType: "APV",
    params,
  });
}

// 日志详情 - 获取
export function getLogApi(url) {
  return request({
    url: url,
    method: "get",
    urlType: "Log",
  });
}

// 历史报告 - 获取
export function getHistoryReportApi(params) {
  return request({
    url: "/autoapv/report_history/",
    method: "get",
    urlType: "APV",
    params,
  });
}

// 历史报告详情 - 获取
export function getHistoryReportDetailApi(params) {
  return request({
    url: "/autoapv/report_history/",
    method: "get",
    urlType: "APV",
    params,
  });
}