<template>
  <div
    class="container mx-auto p-4 border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="relative overflow-x-auto">
      <h1 class="text-2xl font-bold mb-4">LỊCH NGHỈ PHÉP</h1>

      <!-- LỌC THEO THÁNG NĂM -->
      <div class="flex space-x-4 mb-4">
        <label for="date">Vui lòng chọn tháng muốn lọc:</label>
        <select
          v-model="month"
          name="month"
          class="px-4 py-2 border border-gray-200 rounded"
        >
          <option v-for="m in 12" :key="m" :value="m">{{ m }}</option>
        </select>

        <select
          v-model="year"
          name="year"
          class="px-4 py-2 border border-gray-200 rounded"
        >
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>

        <button
          @click="fetchOnleave()"
          class="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Lọc
        </button>
      </div>

      <!-- BẢNG DỮ LIỆU -->
      <table
        class="text-center w-full text-sm rtl:text-right text-gray-500 dark:text-gray-400"
      >
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3">MÃ HOA TIÊU</th>
            <th scope="col" class="px-6 py-3">NGÀY NGHỈ</th>
            <th scope="col" class="px-6 py-3">NGÀY KẾT THÚC</th>
            <th scope="col" class="px-6 py-3">(LÝ DO)</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.idUser"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
          >
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {{ user.username }}
            </th>
            <td class="px-6 py-4">
              {{ formatDate.formatDate(user.startDate) }}
            </td>
            <td class="px-6 py-4">
              {{ formatDate.formatDate(user.endDate) }}
            </td>

            <td class="px-6 py-4">
              {{ user.reason }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import formatDate from "@/helper/format-datetime";
const users = ref([]);
const month = ref(new Date().getMonth() + 1);
const year = ref(new Date().getFullYear());
const years = ref([]);

// Khởi tạo danh sách năm
onMounted(() => {
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= currentYear - 10; i--) {
    years.value.push(i);
  }
});

// Hàm lấy dữ liệu lịch trình theo tháng & năm được chọn
const fetchOnleave = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/onleave?month=${month.value}&year=${year.value}`
    );
    users.value = response.data;
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu:", error);
  }
};

// Gọi API ngay khi component được mount
onMounted(() => {
  fetchOnleave();
});
</script>
