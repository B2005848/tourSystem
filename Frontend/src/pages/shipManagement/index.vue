<template>
  <div
    class="container mx-auto p-4 border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="flex justify-between items-center mb-4">
      <div class="flex">
        <h1 class="text-2xl font-bold mb-4">DANH SÁCH TÀU/THUYỀN</h1>
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

      <!-- input search -->
      <div class="flex items-center">
        <input
          v-model="searchID"
          type="text"
          size="30"
          class="px-4 py-2 border border-gray-200 rounded"
          placeholder="Nhập thông tin tàu cần tìm..."
        />
        <button
          @click="search"
          class="px-4 py-2 bg-blue-500 text-white rounded ml-2"
        >
          Tìm kiếm
        </button>
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
          <th scope="col" class="px-6 py-3 text-center">STT</th>
          <th scope="col" class="px-6 py-3 text-center">TÊN TÀU</th>
          <th scope="col" class="px-6 py-3 text-center">QUỐC TỊCH</th>
          <th scope="col" class="px-6 py-3 text-center">CHIỀU DÀI</th>
          <th scope="col" class="px-6 py-3 text-center">MỚN NƯỚC</th>
          <th scope="col" class="px-6 py-3 text-center">GT</th>
          <th scope="col" class="px-6 py-3 text-center">ĐẠI LÝ</th>
          <th scope="col" class="px-6 py-3 text-center">CẬP NHẬT</th>
          <th scope="col" class="px-6 py-3 text-center">VỊ TRÍ HIỆN TẠI</th>
          <th scope="col" class="px-6 py-3 text-center">CÔNG CỤ</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
          v-for="(ship, index) in ships"
          :key="ship._id"
        >
          <!-- STT -->
          <td class="py-2 px-4 border-b text-center">
            {{ (currentPage - 1) * 10 + index + 1 }}
          </td>

          <!-- TÊN TÀU  -->
          <th
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center"
          >
            {{ ship.name }}
          </th>

          <!-- QUÓC TỊCH -->
          <td class="py-2 px-4 border-b text-center">{{ ship.nation }}</td>

          <!-- CHIỀU DÀI -->
          <td class="py-2 px-4 border-b text-center">{{ ship.length }}</td>

          <!-- MỚN NƯỚC -->
          <td class="py-2 px-4 border-b text-center">{{ ship.draft }}</td>

          <!-- GT -->
          <td class="py-2 px-4 border-b text-center">{{ ship.gt }}</td>

          <!-- ĐẠI LÝ -->
          <td class="py-2 px-4 border-b text-center">{{ ship.owner }}</td>

          <!-- VỊ TRÍ HIỆN TẠI -->
          <td class="py-2 px-4 border-b text-center" v-if="ship.visitting">
            {{ ship.visitting }}
          </td>

          <!-- NGÀY CẬP NHẬT -->
          <td class="py-2 px-4 border-b text-center">
            {{ formatDate.formatDateTime(ship.updated_at) }}
          </td>

          <td
            class="py-2 px-4 border-b text-center text-yellow-600"
            v-if="!ship.visitting"
          >
            Chưa cập nhật
          </td>

          <!-- CÔNG CỤ -->
          <td class="py-2 px-4 border-b text-center">
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

    <!-- -------------------------------------------------------------------TẠO HOA TIÊU MỚI-->
    <div
      v-if="showCreateForm"
      class="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-4 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-4">THÊM TÀU MỚI</h2>
        <form class="w-96" @submit.prevent="hanldeCreate">
          <div class="mb-4">
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mt-4"
            >
              TÊN TÀU<sup class="text-red-500">*</sup>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              v-model="shipForm.name"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            <label
              for="nation"
              class="block text-sm font-medium text-gray-700 mt-4"
            >
              QUÓC TỊCH
            </label>
            <input
              type="text"
              id="nation"
              name="nation"
              v-model="shipForm.nation"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            <label
              for="length"
              class="block text-sm font-medium text-gray-700 mt-4"
            >
              CHIỀU DÀI
            </label>
            <input
              type="text"
              id="length"
              name="length"
              v-model="shipForm.length"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            <label
              for="draft"
              class="block text-sm font-medium text-gray-700 mt-4"
            >
              MỚN NƯỚC
            </label>
            <input
              type="text"
              id="draft"
              name="draft"
              v-model="shipForm.draft"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            <label
              for="gt"
              class="block text-sm font-medium text-gray-700 mt-4"
            >
              GT
            </label>
            <input
              type="text"
              id="gt"
              name="gt"
              v-model="shipForm.gt"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            <label
              for="owner"
              class="block text-sm font-medium text-gray-700 mt-4"
            >
              ĐẠI LÝ
            </label>
            <input
              type="text"
              id="owner"
              name="owner"
              v-model="shipForm.owner"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            <div class="mt-4">
              <button
                type="submit"
                class="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Tạo mới
              </button>
              <button
                @click="showCreateForm = false"
                type="button"
                class="px-4 py-2 bg-red-500 text-white rounded ml-2"
              >
                Hủy
              </button>
            </div>
          </div>
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

const ships = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);

const fetchships = async (page = 1) => {
  try {
    const response = await axios.get("http://localhost:3000/api/ships", {
      params: { page, limit: 10 },
    });
    ships.value = response.data.ships;
    currentPage.value = response.data.currentPage;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error("Error fetching ships:", error);
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    fetchships(currentPage.value - 1);
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    fetchships(currentPage.value + 1);
  }
};
const refeshed = ref(true);
const handleRefesh = () => {
  refeshed.value = false;
  fetchships();
  setTimeout(() => {
    refeshed.value = true;
  }, 1000);
};

// form tạo mới hoa tiêu
const shipForm = ref({
  name: "",
  nation: "",
  length: "",
  draft: "",
  gt: "",
  owner: "",
});
const showCreateForm = ref(false);
const hanldeCreate = async () => {
  console.log(shipForm.value);
  try {
    if (!shipForm.value.name) {
      Swal.fire("Error", "Tên tàu không được để trống", "error");
      return;
    }
    const response = await axios.post(
      "http://localhost:3000/api/ships",
      shipForm.value
    );
    if (response.status === 201) {
      Swal.fire("Thành công", "Thêm tàu mới thành công", "success");
    }
    showCreateForm.value = false;
    fetchships();
  } catch (error) {
    console.error("Error creating ship:", error);
    Swal.fire(
      "Error",
      "Có lỗi trong quá trình thêm tàu mới, liên hệ quản trị viên để được xử lí",
      "error"
    );
  }
};

// Tìm kiếm hoa tiêu
const searchID = ref("");
const search = async () => {
  console.log("searching...");
  try {
    const response = await axios.get(
      `http://localhost:3000/api/ships/search?query=${searchID.value}`
    );
    console.log(response.data);

    ships.value = response.data;
  } catch (error) {
    console.error("Error searching ships:", error);
  }
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
          "http://localhost:3000/api/ships/export",
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
        console.error("Error exporting ships to Excel:", error);
      }
    }
  });
};

onMounted(() => {
  fetchships();
});
</script>

<style scoped></style>
