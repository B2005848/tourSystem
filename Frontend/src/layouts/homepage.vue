<template>
  <div class="flex contain-content">
    <div class="flex-none">
      <SideBar></SideBar>
    </div>
    <div class="flex-1 px-5 py-5">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import SideBar from "../components/SideBar.vue";
</script>
