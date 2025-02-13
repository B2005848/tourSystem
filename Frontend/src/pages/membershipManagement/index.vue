<template>
  <div
    class="container mx-auto p-4 border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="flex justify-between items-center mb-4">
      <div class="flex">
        <h1 class="text-2xl font-bold mb-4">DANH SÁCH HOA TIÊU</h1>
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
          placeholder="Nhập thông tin hoa tiêu cần tìm..."
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
          to="/membership-management/export"
          class="px-4 py-2 bg-red-700 text-white rounded"
        >
          Xuất ra file excel
        </button>
      </div>
    </div>
    <table class="min-w-full bg-white">
      <thead>
        <tr>
          <th class="py-2 px-4 border-b">MÃ HOA TIÊU</th>
          <th class="py-2 px-4 border-b">HỌ VÀ TÊN</th>
          <th class="py-2 px-4 border-b">NGÀY SINH</th>
          <th class="py-2 px-4 border-b">SỐ ĐIỆN THOẠI</th>
          <th class="py-2 px-4 border-b">TRẠNG THÁI</th>
          <th class="py-2 px-4 border-b">VỊ TRÍ HIỆN TẠI</th>
          <th class="py-2 px-4 border-b">CÔNG CỤ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user._id">
          <!-- MÃ HOA TIÊU -->
          <td class="py-2 px-4 border-b text-center">{{ user.id }}</td>

          <!-- HỌ VÀ TÊN -->
          <td class="py-2 px-4 border-b text-center">{{ user.name }}</td>

          <!-- NGÀY SINH -->
          <td class="py-2 px-4 border-b text-center">{{ user.birthday }}</td>

          <!-- SỐ ĐIỆN THOẠI -->
          <td class="py-2 px-4 border-b text-center" v-if="user.phone">
            {{ user.phone }}
          </td>
          <td
            class="py-2 px-4 border-b text-center text-red-600"
            v-if="!user.phone"
          >
            Chưa cập nhật
          </td>

          <!-- TRẠNG THÁI -->
          <td
            class="py-2 px-4 border-b text-center text-green-500"
            v-if="user.status == 1"
          >
            Đang hoạt động
          </td>

          <td
            class="py-2 px-4 border-b text-center text-blue-400"
            v-if="user.status == 0"
          >
            Đang nghỉ phép
          </td>

          <!-- VỊ TRÍ HIỆN TẠI -->
          <td class="py-2 px-4 border-b text-center">{{ user.visitting }}</td>

          <!-- CÔNG CỤ -->
          <td class="py-2 px-4 border-b text-center">
            <select class="px-2 py-1 border border-gray-300 rounded">
              <option value="">Chọn hành động</option>
              <option value="edit">Sửa thông tin</option>
              <option value="register">Đăng kí lịch trình</option>
              <option value="delete">Xóa</option>
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
        <h2 class="text-2xl font-bold mb-4">Tạo hoa tiêu mới</h2>
        <form class="w-96" @submit.prevent="hanldeCreate">
          <div class="mb-4">
            <label for="id" class="block text-sm font-medium text-gray-700">
              Mã hoa tiêu (ID) <sup class="text-red-500">*</sup>
            </label>
            <input
              type="text"
              id="id"
              name="id"
              v-model="userForm.id"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mt-4"
            >
              Họ và tên <sup class="text-red-500">*</sup>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              v-model="userForm.name"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            <label
              for="birthday"
              class="block text-sm font-medium text-gray-700 mt-4"
            >
              Ngày sinh
            </label>
            <input
              type="date"
              id="birthday"
              name="birthday"
              v-model="userForm.birthday"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            <label
              for="phone"
              class="block text-sm font-medium text-gray-700 mt-4"
            >
              Số điện thoại
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              v-model="userForm.phone"
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

const users = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);

const fetchUsers = async (page = 1) => {
  try {
    const response = await axios.get("http://localhost:3000/api/users", {
      params: { page, limit: 10 },
    });
    users.value = response.data.users;
    currentPage.value = response.data.currentPage;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    fetchUsers(currentPage.value - 1);
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    fetchUsers(currentPage.value + 1);
  }
};
const refeshed = ref(true);
const handleRefesh = () => {
  refeshed.value = false;
  fetchUsers();
  setTimeout(() => {
    refeshed.value = true;
  }, 1000);
};

// form tạo mới hoa tiêu
const userForm = ref({
  id: "",
  name: "",
  birthday: "",
  phone: "",
  status: 1,
  visitting: "",
});
const showCreateForm = ref(false);
const hanldeCreate = async () => {
  console.log(userForm.value);
  try {
    if (!userForm.value.id) {
      Swal.fire("Error", "Vui lòng nhập mã hoa tiêu", "error");
      if (!userForm.value.name) {
        Swal.fire("Error", "Vui lòng nhập họ và tên", "error");
        return;
      }
    }
    const response = await axios.post(
      "http://localhost:3000/api/users",
      userForm.value
    );
    if (response.status === 201) {
      Swal.fire("Success", "Tạo mới hoa tiêu thành công", "success");
    }
    showCreateForm.value = false;
    fetchUsers();
  } catch (error) {
    console.error("Error creating user:", error);
    Swal.fire(
      "Error",
      "Có lỗi trong quá trình thêm hoa tiêu mới, liên hệ quản trị viên để được xử lí",
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
      `http://localhost:3000/api/users/search?query=${searchID.value}`
    );
    console.log(response.data);

    users.value = response.data;
  } catch (error) {
    console.error("Error searching users:", error);
  }
};
onMounted(() => {
  fetchUsers();
});
</script>

<style scoped></style>
