<template>
  <!-- QUẢN LÍ LỊCH TRÌNH -->
  <div
    class="container mx-auto p-4 border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="flex justify-between items-center mb-4">
      <div class="flex">
        <h1 class="text-2xl font-bold mb-4">LỊCH TRÌNH HÔM NAY</h1>
        <span flex justify-between items-center>
          <button title="Làm mới" @click="handleRefesh" v-if="refeshed" class="ml-2">
            <font-awesome-icon icon="fa-solid fa-arrows-rotate" style="color: #74c0fc" />
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
          @click="showFormCreate = true"
          class="px-4 py-2 bg-lime-500 text-white rounded"
        >
          Tạo tua mới
        </button>
        <button
          @click="showFormExport = true"
          class="px-4 py-2 bg-red-700 text-white rounded"
        >
          Xuất ra file excel
        </button>
      </div>
    </div>
    <div class="mb-3">
      Chú thích công cụ:
      <ul>
        <li>
          <font-awesome-icon
            icon="fa-solid fa-calendar-check"
            size="lg"
            style="color: #63e6be"
          />
          : Xác nhận lịch trình đã hoàn thành
        </li>

        <li>
          <font-awesome-icon
            icon="fa-regular fa-trash-can"
            size="lg"
            style="color: #d21919"
          />
          : Xóa lịch trình
        </li>
      </ul>
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
          <th class="py-2 px-4 border-b text-center">CÔNG CỤ</th>
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
              v-if="schedule.status === 1"
              class="px-2 py-1 bg-green-200 text-green-800 rounded text-center"
            >
              Chuẩn bị
            </span>
            <span v-else class="px-2 py-1 bg-blue-300 text-blue-800 rounded text-center">
              Đã hoàn thành
            </span>
          </td>
          <!-- CÔNG CỤ -->
          <td class="px-6 py-4 text-center">
            <div class="flex justify-between">
              <button
                @click="
                  handleCompleted(schedule._id, schedule.idUser._id, schedule.idShip._id)
                "
                class="me-5"
                title="Xác nhận hoàn thành"
              >
                <font-awesome-icon
                  icon="fa-solid fa-calendar-check"
                  size="lg"
                  style="color: #63e6be"
                />
              </button>

              <button @click="handleDelete(schedule._id)" title="Hủy lịch trình">
                <font-awesome-icon
                  icon="fa-regular fa-trash-can"
                  size="lg"
                  style="color: #d21919"
                />
              </button>
            </div>
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

    <!-- -------------------------------------------------------------------FORM LỰA CHỌN XUẤT FILE------------------------------------------------------------>
    <div
      v-if="showFormExport"
      class="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-4 rounded-lg shadow-lg">
        <div class="flex justify-center text-center">
          <span> <h2 class="text-2xl font-bold mb-4">LỰA CHỌN CÁCH XUẤT FILE</h2></span>
          <span class="ms-3">
            <button @click="showFormExport = false">
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
        <div class="mt-5">
          <router-view></router-view>
        </div>
      </div>
    </div>

    <!-- form tạo tua mới -->
    <div
      v-if="showFormCreate"
      class="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center"
    >
      <div class="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold text-center mb-6">THÊM TUA MỚI</h2>

        <form @submit.prevent="handleCreate">
          <!-- Ngày và Giờ -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label for="date" class="block text-sm font-medium text-gray-700"
                >CHỌN NGÀY KHỞI HÀNH</label
              >
              <input
                v-model="scheduleCreate.date"
                type="date"
                id="date"
                name="date"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
                @change="handleDateChangeForm"
              />
            </div>
            <div class="relative">
              <label for="time" class="block text-sm font-medium text-gray-700"
                >CHỌN GIỜ KHỞI HÀNH</label
              >
              <div
                class="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none"
              >
                <svg
                  class="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <input
                v-model="scheduleCreate.time"
                type="time"
                id="time"
                class="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                min="06:00"
                max="18:00"
                value="00:00"
                @change="handleTimeChange"
              />
            </div>
          </div>

          <!-- ID Ship và ID User -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label for="idUser" class="block text-sm font-medium text-gray-700"
                >CHỌN HOA TIÊU
                <font-awesome-icon
                  icon="fa-solid fa-person-military-pointing"
                  size="sm"
                  style="color: #74c0fc"
              /></label>
              <select
                @click="getallusers"
                v-model="scheduleCreate.idUser"
                class="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="" disabled>Chọn một hoa tiêu</option>
                <option v-for="user in users" :key="user._id" :value="user._id">
                  {{ user.id }} - {{ user.name }}
                </option>
              </select>
            </div>
            <div>
              <label for="idShip" class="block text-sm font-medium text-gray-700"
                >CHỌN TÀU
                <font-awesome-icon
                  icon="fa-solid fa-ship"
                  size="sm"
                  style="color: #74c0fc"
              /></label>
              <select
                @click="getallships"
                v-model="scheduleCreate.idShip"
                class="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="" disabled>Chọn một tàu</option>
                <option v-for="ship in ships" :key="ship._id" :value="ship._id">
                  {{ ship.name }} - {{ ship.nation }}
                </option>
              </select>
            </div>
          </div>

          <!-- Từ và Đến -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label for="from" class="block text-sm font-medium text-gray-700"
                >ĐIỂM ĐI
                <font-awesome-icon
                  icon="fa-solid fa-anchor"
                  size="sm"
                  style="color: #74c0fc"
              /></label>
              <select
                @click="getallport"
                v-model="scheduleCreate.from"
                class="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="" disabled>Chọn điểm xuất phát</option>
                <option v-for="port in ports" :key="port._id" :value="port.id">
                  {{ port.id }} - {{ port.name }}
                </option>
              </select>
            </div>
            <div>
              <label for="to" class="block text-sm font-medium text-gray-700"
                >ĐIỂM ĐẾN
                <font-awesome-icon
                  icon="fa-solid fa-anchor"
                  size="sm"
                  style="color: #74c0fc"
              /></label>
              <select
                @click="getallport"
                v-model="scheduleCreate.to"
                class="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="" disabled>Chọn điểm đến</option>
                <option v-for="port in ports" :key="port._id" :value="port.id">
                  {{ port.id }} - {{ port.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Ghi Chú -->
          <div class="mb-4">
            <label for="comments" class="block text-sm font-medium text-gray-700"
              >Ghi Chú</label
            >
            <textarea
              v-model="scheduleCreate.comments"
              id="comments"
              name="comments"
              rows="4"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Nhập ghi chú (nếu có)"
            ></textarea>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Tạo Lịch Trình
          </button>

          <button
            @click="showFormCreate = false"
            class="mt-5 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500-500 focus:ring-offset-2"
          >
            Hủy
          </button>
        </form>
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
const handleRefesh = async () => {
  refeshed.value = false;
  const dateref = ref(new Date().toISOString().split("T")[0]); // Định dạng YYYY-MM-DD

  const selectedDateref = formatDate.formateDateSort(dateref.value);
  const response = await axios.get(
    `http://localhost:3000/api/schedules/getbydate/${selectedDateref}`,
    {
      params: { page: 1, limit: 10 },
    }
  );

  schedules.value = response.data.schedules;
  currentPage.value = response.data.page;
  totalPages.value = response.data.totalPages;

  setTimeout(() => {
    refeshed.value = true;
  }, 1000);
};

// Form lựa chọn cách xuất file excel
const showFormExport = ref(false);
//Xác nhận lịch trình đã hoàn thành
const handleCompleted = async (id_schedule, idUser, idShip) => {
  Swal.fire({
    title: "XÁC NHẬN",
    text: "Bạn có chắc chắn là xác nhận lịch trình đã hoàn thành?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "XÁC NHẬN",
    cancelButtonText: "HỦY",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await axios.put(
          `http://localhost:3000/api/schedules/${id_schedule}`,
          {
            idUser: idUser,
            idShip: idShip,
            status: 0,
          }
        );

        if (response.status === 200) {
          Swal.fire({
            title: "HOÀN THÀNH",
            text: "Đã xác nhận thành công",
            icon: "success",
            timer: 1500,
          });
          fetchschedule(1);
        }
      } catch (error) {
        console.error("Error update status schedule :", error);
      }
    }
  });
};

// Form lựa chọn cách xuất file excel
const showFormCreate = ref(false);
const ships = ref([]);

const handleTimeChange = (event) => {
  console.log("Giờ đã chọn:", event.target.value); // In ra giờ 24h (HH:mm)
};
const handleDateChangeForm = (event) => {
  console.log("Giờ đã chọn:", event.target.value); // In ra giờ 24h (HH:mm)
};
const getallships = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/ships/getall");
    if (response.status === 200) {
      ships.value = response.data.ships;
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tàu:", error);
  }
};

const users = ref([]);
const getallusers = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/users/getallusers");
    if (response.status === 200) {
      users.value = response.data.Users;
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách hoa tiêu:", error);
  }
};

const ports = ref([]);
const getallport = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/depotships");
    if (response.status === 200) {
      ports.value = response.data.depotShips;
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách cầu bến:", error);
  }
};
// --------------------------------------------------THÊM LỊCH TRÌNH-------------------------
// Dữ liệu lịch trình
const scheduleCreate = ref({
  idUser: "",
  idShip: "",
  date: "",
  to: "",
  from: "",
  time: "",
  comments: "",
});
const handleCreate = async (id_schedule) => {
  Swal.fire({
    title: "THÊM LỊCH MỚI",
    text: "Bạn có chắc chắn muốn thêm lịch trình này không?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "OK",
    cancelButtonText: "HỦY",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/schedules",
          scheduleCreate.value
        );

        if (response.status === 201) {
          Swal.fire({
            title: "HOÀN THÀNH",
            text: "Đã xác nhận thành công",
            icon: "success",
            timer: 1500,
          });
          fetchschedule(1);
        }
      } catch (error) {
        console.error("Error update status schedule :", error);
      }
    }
  });
};

// --------------------------------------------XÓA LỊCH TRÌNH--------------------
const handleDelete = async (id_schedule) => {
  Swal.fire({
    title: "XÓA LỊCH TRÌNH",
    text: "Bạn có chắc chắn muốn xóa lịch trình này không?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "XÓA",
    cancelButtonText: "HỦY",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/schedules/${id_schedule}`
        );

        if (response.status === 200) {
          Swal.fire({
            title: "ĐÃ XÓA",
            text: "Lịch trình đã được xóa thành công",
            icon: "success",
            timer: 1500,
          });
          fetchschedule(1);
        }
      } catch (error) {
        console.error("Error deleting schedule:", error);
      }
    }
  });
};

onMounted(() => {
  fetchschedule();
});
</script>

<style scoped></style>
