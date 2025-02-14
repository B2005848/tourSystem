<template>
  <div class="space-x-4 top-1 border-sky-400 border-t-2 p-2">
    <label for="date">Vui lòng chọn ngày muốn xuất file:</label>
    <select
      v-model="month"
      name="month"
      class="px-4 py-2 border border-gray-200 rounded"
    >
      <option v-for="m in 12" :key="m" :value="m">{{ m }}</option>
    </select>
    /
    <select
      v-model="year"
      name="year"
      class="px-4 py-2 border border-gray-200 rounded"
    >
      <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
    </select>
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

const month = ref(new Date().getMonth() + 1);
const year = ref(new Date().getFullYear());
const years = ref([]);

onMounted(() => {
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= currentYear - 10; i--) {
    years.value.push(i);
  }
});

// handle export to excel file
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
          `http://localhost:3000/api/schedules/exportbymonth/${year.value}/${month.value}`,
          {
            responseType: "blob",
          }
        );
        if (!response.data || response.data.size === 0) {
          throw new Error("Không có dữ liệu để xuất");
        }
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `XẾP TUA ${month.value}/${year.value}.xlsx`
        );
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
