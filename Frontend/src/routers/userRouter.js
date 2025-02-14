const userRouter = [
  // TRANG ĐĂNG NHẬP
  {
    path: "/login",
    name: "login",
    component: () => import("../layouts/login.vue"),
    meta: {
      title: "TOURS SYSTEM - Đăng nhập",
    },
  },

  // TRANG CHỦ
  {
    path: "/home",
    name: "homepage",
    component: () => import("../layouts/homepage.vue"),
    meta: {
      title: "TOURS SYSTEM - Trang chủ",
    },
    children: [
      // TRANG THỐNG KÊ
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("../pages/dashboard/index..vue"),
        meta: {
          title: "TOURS SYSTEM - THỐNG KÊ",
        },
      },

      // TRANG QUẢN LÍ TOURS
      {
        path: "tours_management",
        name: "tours.mng",
        component: () => import("../pages/tourManagement/index.vue"),
        meta: {
          title: "TOURS SYSTEM - QUẢN LÍ TOURS",
        },
        children: [
          {
            path: "exportExcelDate",
            name: "exportDate",
            component: () =>
              import("../pages/tourManagement/exportExcelByDate.vue"),
          },

          {
            path: "exportExcelMonth",
            name: "exportMonth",
            component: () =>
              import("../pages/tourManagement/exportExcelByMonth.vue"),
          },
        ],
      },

      // TRANG QUẢN LÍ HOA TIÊU
      {
        path: "memberships_management",
        name: "members.mng",
        component: () => import("../pages/membershipManagement/index.vue"),
        meta: {
          title: "TOURS SYSTEM - QUẢN LÍ HOA TIÊU",
        },
      },

      // TRANG QUẢN LÍ TÀU THUYỀN
      {
        path: "ships_management",
        name: "ships.mng",
        component: () => import("../pages/shipManagement/index.vue"),
        meta: {
          title: "TOURS SYSTEM - QUẢN LÍ TÀU THUYỀN",
        },
      },
    ],
  },
];

export default userRouter;
