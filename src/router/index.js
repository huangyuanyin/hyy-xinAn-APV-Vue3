import {
  createRouter,
  createWebHistory,
  createWebHashHistory
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
            component: () => import("@/views/APVAuto/overview/overView.vue"),
          },
          {
            path: "/APVAuto/deviceManagement",
            name: "DeviceManagement",
            meta: {
              title: "资源管理",
            },
            component: () =>
              import("@/views/APVAuto/deviceManagement/index.vue"),
          },
          {
            path: "/APVAuto/taskManagement",
            name: "TaskManagement",
            meta: {
              title: "任务管理",
              keepAlive: true
            },
            component: () =>
              import("@/views/APVAuto/taskManagement/index.vue"),
          },
          // {
          //   path: "/APVAuto/performanceTestTask",
          //   name: "PerformanceTestTask",
          //   meta: {
          //     title: "性能测试任务",
          //   },
          //   component: () =>
          //     import("@/views/APVAuto/performanceTestTask/index.vue"),
          // },
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
            component: () => import("@/views/APVAuto/templateReport/components/historyLayout.vue"),
            children: [
              {
                path: "",
                component: () => import("@/views/APVAuto/templateReport/index.vue"),
                meta: {
                  keepAlive: true,
                }
              },
              {
                path: "/APVAuto/reportDetail",
                name: "reportDetail",
                meta: {
                  title: "测试报告详情",
                },
                component: () =>
                  import("@/views/APVAuto/templateReport/reportDetail.vue"),
              },
              {
                path: "/APVAuto/templateReport/failNumDetail",
                name: "reportFailNumDetail",
                meta: {
                  title: "失败数详情",
                },
                component: () =>
                  import("@/views/APVAuto/templateReport/components/FailNumDetail.vue"),
              },
            ]
          },
          {
            path: "/APVAuto/historyReport/:reportId",
            name: "historyReport",
            meta: {
              title: "历史报告",
              keepAlive: true,
            },
            component: () =>
              import("@/views/APVAuto/templateReport/components/historyLayout.vue"),
            children: [
              {
                path: "",
                component: () =>
                  import("@/views/APVAuto/templateReport/components/historyReport.vue"),
              },
              {
                path: "detail/:detailId",
                name: "historyReportDetail",
                meta: {
                  title: "历史报告详情",
                  keepAlive: false,
                },
                component: () =>
                  import("@/views/APVAuto/templateReport/reportDetail.vue"),
              },
              {
                path: "failNumDetail",
                name: "FailNumDetail",
                meta: {
                  title: "失败数详情",
                },
                component: () =>
                  import("@/views/APVAuto/templateReport/components/FailNumDetail.vue"),
              },
            ]
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
  history: createWebHashHistory('/netapv/'),
  routes,
});

export default router;
