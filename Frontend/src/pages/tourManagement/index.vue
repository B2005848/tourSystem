<template>
  <!-- QUẢN LÍ LỊCH TRÌNH -->
  <div
    class="container mx-auto p-4 border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="flex justify-between items-center mb-4">
      <div class="flex">
        <h1 class="text-2xl font-bold mb-4">THEO DÕI LỊCH TRÌNH</h1>
        <span flex justify-between items-center>
          <button
            title="Làm mới"
            @click="handleRefesh"
            v-if="refeshed"
            class="ml-2"
          >
            <font-awesome-icon
              icon="fa-solid fa-arrows-rotate"
              style="color: #74c0fc"
            />
            Làm mới
          </button>

          <font-awesome-icon
            v-if="!refeshed"
            class="ml-2"
            icon="fa-solid fa-arrows-rotate"
            spin
            style="color: #74c0fc"
          />
        </span>
      </div>

      <!-- LỌC THEO NGÀY THÁNG NĂM -->
      <div class="flex space-x-4">
        <input
          type="date"
          v-model="date"
          @change="handleDateChange"
          class="px-4 py-2 border border-gray-200 rounded"
        />
        <button
          @click="fetchschedule(1)"
          class="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Lọc
        </button>
      </div>

      <div class="flex space-x-4">
        <button
          @click="showForm = true"
          class="px-4 py-2 bg-red-700 text-white rounded"
        >
          Xuất ra file excel
        </button>
      </div>
    </div>
    <table
      class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
    >
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th class="py-2 px-4 border-b text-center">STT</th>
          <th class="py-2 px-4 border-b text-center">MÃ HOA TIÊU</th>
          <th class="py-2 px-4 border-b text-center">TÀU ĐI</th>
          <th class="py-2 px-4 border-b text-center">NGÀY ĐI</th>
          <th class="py-2 px-4 border-b text-center">GIỜ ĐI</th>
          <th class="py-2 px-4 border-b text-center">ĐIỂM XUẤT PHÁT</th>
          <th class="py-2 px-4 border-b text-center">ĐIỂM ĐẾN</th>
          <th class="py-2 px-4 border-b text-center">GHI CHÚ</th>
          <th class="py-2 px-4 border-b text-center">CẬP NHẬT LẦN CUỐI</th>
          <th class="py-2 px-4 border-b text-center">TRẠNG THÁI</th>
          <th class="py-2 px-4 border-b text-center">THÊM LỊCH TRÌNH</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
          v-for="(schedule, index) in schedules"
          :key="schedule._id"
        >
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            {{ (currentPage - 1) * 10 + index + 1 }}
          </th>
          <td class="px-6 py-4 text-center">
            {{ schedule.idUser.id + "(" + schedule.idUser.name + ")" }}
          </td>
          <td class="px-6 py-4 text-center">{{ schedule.idShip.name }}</td>
          <td class="px-6 py-4 text-center">
            {{ formatDate.formatDate(schedule.date) }}
          </td>
          <td class="px-6 py-4 text-center">{{ schedule.time }}</td>
          <td class="px-6 py-4 text-center">{{ schedule.from }}</td>
          <td class="px-6 py-4 text-center">{{ schedule.to }}</td>
          <td class="px-6 py-4 text-center">{{ schedule.comments }}</td>
          <td class="px-6 py-4 text-center">
            {{ formatDate.formatDateTime(schedule.updated_at) }}
          </td>
          <td class="px-6 py-4 text-center">
            <span
              v-if="schedule.status === '1'"
              class="px-2 py-1 bg-green-200 text-green-800 rounded text-center"
            >
              Chuẩn bị
            </span>
            <span
              v-else
              class="px-2 py-1 bg-blue-300 text-blue-800 rounded text-center"
            >
              Đã hoàn thành
            </span>
          </td>
          <!-- CÔNG CỤ -->
          <td class="px-6 py-4 text-center">TẠO</td>
        </tr>
      </tbody>
    </table>

    <div class="mt-4 flex justify-between">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
      >
        Trước đó
      </button>
      <span>Trang {{ currentPage }}/ {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
      >
        Kế tiếp
      </button>
    </div>

    <!-- -------------------------------------------------------------------FORM LỰA CHỌN XUẤT FILE------------------------------------------------------------>
    <div
      v-if="showForm"
      class="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-4 rounded-lg shadow-lg">
        <div class="flex justify-center text-center">
          <span>
            <h2 class="text-2xl font-bold mb-4">
              LỰA CHỌN CÁCH XUẤT FILE
            </h2></span
          >
          <span class="ms-3">
            <button>
              <font-awesome-icon
                icon="fa-regular fa-circle-xmark"
                style="color: #d62e2e"
              />
            </button>
          </span>
        </div>
        <p class="text-xs font-normal italic text-center">
          "Vui lòng chọn 1 trong 2 cách xuất file ở bên dưới"
        </p>
        <div class="mt-5 flex justify-center">
          <div>
            <router-link
              :to="{ name: 'exportDate' }"
              type="button"
              class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Theo ngày
            </router-link>
          </div>

          <div>
            <router-link
              :to="{ name: 'exportMonth' }"
              type="button"
              class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Theo tháng
            </router-link>
          </div>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import formatDate from "@/helper/format-datetime";

const schedules = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const handleDateChange = () => {
  fetchschedule(1); // Reset về trang đầu tiên khi lọc theo ngày
};

const date = ref(new Date().toISOString().split("T")[0]); // Định dạng YYYY-MM-DD
const fetchschedule = async (page = 1) => {
  try {
    const selectedDate = formatDate.formateDateSort(date.value);
    const response = await axios.get(
      `http://localhost:3000/api/schedules/getbydate/${selectedDate}`,
      {
        params: { page, limit: 10 },
      }
    );

    schedules.value = response.data.schedules;
    currentPage.value = response.data.page;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error("Error fetching schedule:", error);
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    fetchschedule(currentPage.value - 1);
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    fetchschedule(currentPage.value + 1);
  }
};
const refeshed = ref(true);
const handleRefesh = () => {
  refeshed.value = false;
  fetchschedule();
  setTimeout(() => {
    refeshed.value = true;
  }, 1000);
};

// Form lựa chọn cách xuất file excel
const showForm = ref(false);

const exportToExcel = async () => {
  Swal.fire({
    title: "Xuất ra file Excel",
    text: "Bạn có chắc chắn muốn xuất ra file Excel không?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Xuất ra",
    cancelButtonText: "Hủy",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/schedule/export",
          {
            responseType: "blob",
          }
        );
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "DS TÀU.xlsx");
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error("Error exporting schedule to Excel:", error);
      }
    }
  });
};

onMounted(() => {
  fetchschedule();
});
</script>

<style scoped></style>
