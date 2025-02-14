<template>
  <div class="space-x-4 top-1 border-sky-400 border-t-2 p-2">
    <label for="date">Vui lòng chọn ngày muốn xuất file:</label>
    <input
      v-model="selectedDate"
      name="date"
      type="date"
      class="px-4 py-2 border border-gray-200 rounded"
    />
    <button
      @click="exportToExcel"
      class="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Xuất
    </button>
    <p class="italic text-center mt-4 text-sm">
      Nếu bạn không chọn ngày thì mặc định sẽ lấy ngày hiện tại
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import formatDate from "@/helper/format-datetime";

const date = ref(new Date().toISOString().split("T")[0]); // Định dạng YYYY-MM-DD
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
        const selectedDate = formatDate.formateDateSort(date.value);
        const response = await axios.get(
          `http://localhost:3000/api/schedules/exportbydate/${selectedDate}`,
          {
            responseType: "blob",
          }
        );
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `XEP TUA ${selectedDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        Swal.fire("Không có dữ liệu để xuất");
        console.error("Error exporting schedule to Excel:", error);
      }
    }
  });
};
</script>
