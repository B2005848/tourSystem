<template>
  <div class="relative overflow-x-auto">
    <table
      class="text-center w-full text-sm rtl:text-right text-gray-500 dark:text-gray-400"
    >
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th scope="col" class="px-6 py-3">MÃ HOA TIÊU</th>
          <th scope="col" class="px-6 py-3">TÊN</th>
          <th scope="col" class="px-6 py-3">TỔNG SỐ LƯỢT ĐI</th>
          <th scope="col" class="px-6 py-3">CHI TIẾT LỊCH TRÌNH</th>
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
            {{ user.userId }}
          </th>
          <td class="px-6 py-4">{{ user.name }}</td>
          <td class="px-6 py-4">{{ user.count }}</td>
          <td class="px-6 py-4">
            <button
              @click="viewScheduleDetails(user.idUser)"
              class="text-blue-500 hover:underline"
            >
              Xem chi tiết
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const users = ref([]);

const fetchUsers = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/schedules/count/month/2025/05"
    );
    users.value = response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const viewScheduleDetails = (idUser) => {
  // Implement the logic to view schedule details for the user
  console.log(`View schedule details for user: ${idUser}`);
};

onMounted(() => {
  fetchUsers();
});
</script>
