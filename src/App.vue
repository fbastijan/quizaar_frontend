<script setup lang="ts">
import DesktopNavbar from '@/components/desktop_navbar.vue'
import MobileNavbar from './components/mobile_navbar.vue';

</script>

<template>
<div className="">
  <div class="hidden lg:block">
    <DesktopNavbar  />
  </div>
 <div class="lg:hidden">
 <MobileNavbar  />
 </div>
</div>
<RouterView />
</template>