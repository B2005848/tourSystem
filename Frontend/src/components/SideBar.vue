<!-- -----------------------------------TEMPLATE------------------------------ -->
<template>
  <div
    class="top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
  >
    <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
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
          <a
            href="#"
            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <font-awesome-icon
              :icon="['fas', 'calendar-days']"
              size="lg"
              style="color: #6b7280"
            />
            <span class="ms-3">QUẢN LÍ TOURS</span>
          </a>
        </li>

        <!-- Quản lí hoa tiêu -->
        <li>
          <a
            href="#"
            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <font-awesome-icon
              :icon="['fas', 'users']"
              size="lg"
              style="color: #6b7280"
            />
            <span class="ms-3">QUẢN LÍ HOA TIÊU</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
