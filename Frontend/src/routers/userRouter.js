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
        component: () => import("../pages/dashboard/index.vue"),
        meta: {
          title: "TOURS SYSTEM - THỐNG KÊ",
        },
      },

      // TRANG QUẢN LÍ TOURS
      {
        path: "tours-today-management",
        name: "toursnowday.mng",
        component: () => import("../pages/tourManagement/index.vue"),
        meta: {
          title: "TOURS SYSTEM - LỊCH TRÌNH HÔM NAY",
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

      // LỊCH TRÌNH THEO THÁNG
      {
        path: "tours-month-management",
        name: "toursmonth.mng",
        component: () => import("../pages/tourMonth/index.vue"),
        meta: {
          title: "TOURS SYSTEM - LỊCH TRÌNH THÁNG",
        },
      },

      // TRANG QUẢN LÍ HOA TIÊU
      {
        path: "memberships-management",
        name: "members.mng",
        component: () => import("../pages/membershipManagement/index.vue"),
        meta: {
          title: "TOURS SYSTEM - QUẢN LÍ HOA TIÊU",
        },
      },
      {
        path: "memberships-management/:id",
        name: "detail.user",
        component: () => import("../pages/membershipManagement/detail.vue"),
        meta: {
          title: "TOURS SYSTEM - THÔNG TIN HOA TIÊU",
        },
      },

      // TRANG QUẢN LÍ TÀU THUYỀN
      {
        path: "ships-management",
        name: "ships.mng",
        component: () => import("../pages/shipManagement/index.vue"),
        meta: {
          title: "TOURS SYSTEM - QUẢN LÍ TÀU THUYỀN",
        },
      },

      // TRANG QUẢN LÍ CẦU BẾN
      {
        path: "ports-management",
        name: "ports.mng",
        component: () => import("../pages/portManagement/index.vue"),
        meta: {
          title: "TOURS SYSTEM - QUẢN LÍ CẦU BẾN",
        },
      },

      // TRANG QUẢN LÍ NGHỈ PHÉP
      {
        path: "leave-management",
        name: "leaves.mng",
        component: () => import("../pages/leaveDayManagement/index.vue"),
        meta: {
          title: "TOURS SYSTEM - QUẢN LÍ NGÀY PHÉP",
        },
      },

      // TRANG QUẢN LÍ TOUR SÔNG TIỀN
      {
        path: "tour-ST-management",
        name: "tourST.mng",
        component: () => import("../pages/tourSTManagement/index.vue"),
        meta: {
          title: "TOURS SYSTEM - QUẢN LÍ TOUR SÔNG TIỀN",
        },
      },
    ],
  },
];

export default userRouter;
