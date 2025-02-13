<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div
      class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
    >
      <img src="/logo.svg" alt="logo" width="200" />
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
            Đăng nhập vào tài khoản của bạn
          </h1>
          <form class="space-y-4 md:space-y-6" @submit.prevent="handleLogin">
            <div>
              <label
                for="username"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >username</label
              >
              <input
                v-model="username"
                name="username"
                id="username"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Mật khẩu</label
              >
              <input
                v-model="password"
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <div class="flex items-center justify-between">
              <a
                href="#"
                class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >Quên mật khẩu?</a
              >
            </div>
            <button
              type="submit"
              class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              ĐĂNG NHẬP
            </button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Bạn không có tài khoản? Liên hệ quản trị viên để
              <a
                href="https://www.facebook.com/coderNam/?locale=vi_VN"
                class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >đăng kí</a
              >
            </p>
          </form>
          <p class="text-sm font-light text-gray-500 dark:text-gray-400">
            License Copyright © 2025 TN. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import router from "@/routers";
import { ref } from "vue";
import Swal from "sweetalert2"; // Correct import statement

const username = ref("");
const password = ref("");

const handleLogin = async () => {
  const loginData = {
    username: username.value,
    password: password.value,
  };
  console.log(loginData);
  try {
    const response = await window.axios.post(
      "http://localhost:3000/api/accounts/login",
      loginData
    );
    console.log(response);

    if (response.status === 200) {
      localStorage.setItem("token", response.data.accessToken);
      router.push({ name: "homepage" });
    }
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "Lỗi",
      title: "Hmmm.....",
      text: "Tài khoản hoặc mật khẩu không chính xác",
    });
  }
};
</script>
