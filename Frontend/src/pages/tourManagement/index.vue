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

      <div class="flex space-x-4">
        <button
          @click="showCreateForm = true"
          class="px-4 py-2 bg-lime-500 text-white rounded"
        >
          Thêm mới
        </button>

        <button
          @click="exportToExcel"
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
          <th class="py-2 px-4 border-b">STT</th>
          <th class="py-2 px-4 border-b">MÃ HOA TIÊU</th>
          <th class="py-2 px-4 border-b">NGÀY ĐI</th>
          <th class="py-2 px-4 border-b">GIỜ ĐI</th>
          <th class="py-2 px-4 border-b">TÀU ĐI</th>
          <th class="py-2 px-4 border-b">ĐIỂM XUẤT PHÁT</th>
          <th class="py-2 px-4 border-b">ĐIỂM ĐẾN</th>
          <th class="py-2 px-4 border-b">CẬP NHẬT LẦN CUỐI</th>
          <th class="py-2 px-4 border-b">VỊ TRÍ HIỆN TẠI</th>
          <th class="py-2 px-4 border-b">TRẠNG THÁI</th>
          <th class="py-2 px-4 border-b">NGÀY KẾ TIẾP</th>
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
          <td class="px-6 py-4">{{ schedule.idUser }}</td>
          <td class="px-6 py-4">{{ schedule.idShip.name }}</td>
          <td class="px-6 py-4">{{ schedule.to }}</td>
          <td class="px-6 py-4">{{ schedule.from }}</td>
          <td class="px-6 py-4">{{ schedule.time }}</td>
          <td class="px-6 py-4">{{ schedule.comments }}</td>
          <!-- CÔNG CỤ -->
          <td class="px-6 py-4">
            <select class="px-2 py-1 border border-gray-300 rounded">
              <option>Chọn hành động</option>
              <option value="edit">Sửa thông tin</option>
              <option value="view">Cập nhật vị trí tàu</option>
              <option value="delete" class="text-red-600">Xóa</option>
            </select>
          </td>
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

    <!-- -------------------------------------------------------------------TẠO LỊCH TRÌNH MỚI------------------------------------------------------------>
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
const date = new Date();
const fetchschedule = async (page = 1) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/schedules/getbydate/${date.getFullYear()}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`,
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
