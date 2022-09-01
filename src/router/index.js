import {
  createRouter,
  createWebHistory,
} from "vue-router";

import Layout from "@/views/Layout/index.vue"; // 布局组件 不需要懒加载

const routes = [
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "登录页面",
    },
    component: () => import("@/views/Login/index.vue"),
  },
  {
    path: "/page",
    name: "Page",
    meta: {
      title: "测试页面",
    },
    component: () => import("@/views/page/card.vue"),
  },
  {
    path: "/",
    redirect: "/APVAuto/overview",
    component: Layout,
  },
  {
    path: "/home",
    component: Layout,
    children: [
      {
        path: "/APVAuto",
        name: "APVAuto",
        meta: {
          title: "APV自动化",
        },
        redirect: "/APVAuto/overview", // 该配置是若点击选择一级菜单时，默认选中并跳转到该一级菜单下的第一个二级菜单
        component: () => import("@/views/APVAuto/index.vue"),
        children: [
          {
            path: "/APVAuto/overview",
            name: "Overview",
            meta: {
              title: "概览",
            },
            component: () => import("@/views/APVAuto/overview/index.vue"),
          },
          {
            path: "/APVAuto/deviceManagement",
            name: "DeviceManagement",
            meta: {
              title: "设备管理",
            },
            component: () =>
              import("@/views/APVAuto/deviceManagement/index.vue"),
          },
          {
            path: "/APVAuto/buildManagement",
            name: "BuildManagement",
            meta: {
              title: "build管理",
            },
            component: () =>
              import("@/views/APVAuto/buildManagement/index.vue"),
          },
          {
            path: "/APVAuto/taskManagement",
            name: "TaskManagement",
            meta: {
              title: "任务管理",
            },
            component: () =>
              import("@/views/APVAuto/taskManagement/index.vue"),
          },
          {
            path: "/APVAuto/performanceTestTask",
            name: "PerformanceTestTask",
            meta: {
              title: "性能测试任务",
            },
            component: () =>
              import("@/views/APVAuto/performanceTestTask/index.vue"),
          },
          {
            path: "/APVAuto/taskDetail",
            name: "TaskDetail",
            meta: {
              title: "性能测试任务详情",
            },
            component: () =>
              import("@/views/APVAuto/performanceTestTask/taskDetail.vue"),
          },
          {
            path: "/APVAuto/templateReport",
            name: "TemplateReport",
            meta: {
              title: "测试报告",
            },
            component: () => import("@/views/APVAuto/templateReport/index.vue"),
          },
          {
            path: "/APVAuto/dataAnalysis",
            name: "DataAnalysis",
            meta: {
              title: "数据分析",
            },
            component: () =>
              import("@/views/APVAuto/templateReport/dataAnalysis.vue"),
          },
          {
            path: "/APVAuto/reportDetail",
            name: "reportDetail",
            meta: {
              title: "报告详情",
            },
            component: () =>
              import("@/views/APVAuto/templateReport/reportDetail.vue"),
          },
        ],
      },
      {
        path: "/test",
        name: "Test",
        meta: {
          title: "测试",
        },
        redirect: "/test/overview", // 该配置是若点击选择一级菜单时，默认选中并跳转到该一级菜单下的第一个二级菜单
        component: () => import("@/views/test/index.vue"),
        children: [
          {
            path: "/test/overview",
            meta: {
              title: "概览",
            },
            component: () => import("@/views/test/overview.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    meta: {
      title: "404页面",
    },
    component: () => import("@/views/exception/404.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
