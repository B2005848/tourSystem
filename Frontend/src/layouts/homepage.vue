<template>
  <div>
    <NavBar></NavBar>
    <div class="flex contain-content">
      <div class="flex-none">
        <SideBar></SideBar>
      </div>
      <div class="flex-1 px-5">
        <router-view class="fade-in"></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import SideBar from "@/components/SideBar.vue";
import NavBar from "@/components/NavBar.vue";
</script>

<style scoped>
@import "@/assets/animation__page.css";
</style>
