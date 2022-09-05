export const cheshiMenuData = [
  {
    id: "01",
    title: "测试",
    path: null,
    isDisabled: true,
    type: 1,
    children: [],
  },
  {
    id: "02",
    title: "概览",
    path: "/test/overview",
    isDisabled: false,
    children: [],
  },
  {
    id: "03",
    title: "测试管理",
    path: null,
    isDisabled: false,
    children: [
      {
        id: "0301",
        title: "测试一",
        path: "/ceshiOne",
        isDisabled: false,
        children: [],
      },
    ],
  },
];

export const APVAutoMenuData = [
  {
    id: "01",
    title: "APV自动化",
    path: null,
    isDisabled: true,
    type: 1,
    children: [],
  },
  {
    id: "02",
    title: "概览",
    path: "/APVAuto/overview",
    isDisabled: false,
    children: [],
  },
  {
    id: "0301",
    title: "资源管理",
    path: "/APVAuto/deviceManagement",
    isDisabled: false,
    children: [],
  },
  {
    id: "0304",
    title: "任务管理",
    path: "/APVAuto/taskManagement",
    isDisabled: false,
    children: [],
  },
  {
    id: "0302",
    title: "性能测试任务",
    path: "/APVAuto/performanceTestTask",
    isDisabled: false,
    children: [],
  },
  {
    id: "0303",
    title: "测试报告",
    path: "/APVAuto/templateReport",
    isDisabled: false,
    children: [],
  },
];
