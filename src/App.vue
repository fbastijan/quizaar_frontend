
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


<script>
import DesktopNavbar from '@/components/desktop_navbar.vue'
import MobileNavbar from './components/mobile_navbar.vue';
import { useAccountStore } from '@/stores/account'
export default {
 
  name: 'App',
  components: {
    DesktopNavbar,
    MobileNavbar
  },
  setup() {
    const accountStore = useAccountStore()
    
    if (localStorage.getItem("token") )
    {
      accountStore.getCurrentUser()

    }
    else {
      accountStore.accountData = null
    }
    return {
      accountStore
    }


  }
  
}


</script>