<!-- -----------------------------------TEMPLATE------------------------------ -->
<template>
  <div
    class="top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
  >
    <div
      class="h-full rounded-md px-3 py-4 overflow-y-auto bg-gray-200 dark:bg-gray-800"
    >
      <ul class="space-y-2 font-medium">
        <!-- Thống kê -->
        <li>
          <router-link
            :to="{ name: 'dashboard' }"
            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <font-awesome-icon
              :icon="['fas', 'chart-pie']"
              size="lg"
              style="color: #6b7280"
            />
            <span class="ms-3">THỐNG KÊ</span>
          </router-link>
        </li>

        <!-- Quản lí tours -->
        <li>
          <router-link
            :to="{ name: 'toursnowday.mng' }"
            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <font-awesome-icon
              :icon="['fas', 'arrow-right']"
              size="lg"
              style="color: #6b7280"
            />
            <span class="ms-3">LỊCH TRÌNH HÔM NAY</span>
          </router-link>
        </li>

        <li>
          <router-link
            :to="{ name: 'toursmonth.mng' }"
            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <font-awesome-icon
              :icon="['fas', 'calendar-days']"
              size="lg"
              style="color: #6b7280"
            />
            <span class="ms-3">LỊCH TRÌNH THÁNG</span>
          </router-link>
        </li>

        <!-- Quản lí hoa tiêu -->
        <li>
          <router-link
            :to="{ name: 'members.mng' }"
            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <font-awesome-icon
              :icon="['fas', 'users']"
              size="lg"
              style="color: #6b7280"
            />
            <span class="ms-3">QUẢN LÍ HOA TIÊU</span>
          </router-link>
        </li>

        <!-- Quản lí tàu/ thuyền -->
        <li>
          <router-link
            :to="{ name: 'ships.mng' }"
            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <font-awesome-icon
              :icon="['fas', 'ship']"
              size="lg"
              style="color: #6b7280"
            />
            <span class="ms-3">QUẢN LÍ TÀU/THUYỀN</span>
          </router-link>
        </li>

        <!-- Quản lí cầu cảng  -->
        <li>
          <router-link
            :to="{ name: 'ports.mng' }"
            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <font-awesome-icon
              :icon="['fas', 'warehouse']"
              size="lg"
              style="color: #6b7280"
            />
            <span class="ms-3">QUẢN LÍ CẦU CẢNG</span>
          </router-link>
        </li>

        <!-- Quản lí ngày phép-->
        <li>
          <router-link
            :to="{ name: 'leaves.mng' }"
            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <font-awesome-icon
              :icon="['fas', 'circle-xmark']"
              size="lg"
              style="color: #6b7280"
            />
            <span class="ms-3">QUẢN LÍ NGÀY PHÉP</span>
          </router-link>
        </li>

        <!-- Quản lí tour sông tiền -->
        <li>
          <router-link
            :to="{ name: 'tourST.mng' }"
            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <font-awesome-icon
              :icon="['fas', 'water']"
              size="lg"
              style="color: #6b7280"
            />
            <span class="ms-3">QUẢN LÍ TUA SÔNG TIỀN</span>
          </router-link>
        </li>
        <!-- Tiện ích -->
        <li>
          <router-link
            :to="{ name: '' }"
            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <font-awesome-icon
              :icon="['fas', 'tools']"
              size="lg"
              style="color: #6b7280"
            />
            <span class="ms-3">TIỆN ÍCH</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
