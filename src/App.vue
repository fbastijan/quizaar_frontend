
<template>
<div >
  <Toaster position="top-center" />
  
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
import {Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css' 
import DesktopNavbar from '@/components/desktop_navbar.vue'
import MobileNavbar from './components/mobile_navbar.vue';
import { useAccountStore } from '@/stores/account'
import { useSocketStore } from './stores/socket';



export default {
 
  name: 'App',
  components: {
    DesktopNavbar,
    MobileNavbar,

    Toaster
  },
  setup() {
    const accountStore = useAccountStore()
    const socketStore = useSocketStore()
    
    if (localStorage.getItem("token") )
    {
      accountStore.getCurrentUser()

    }
    else {
      accountStore.accountData = null
    }
    return {
      accountStore,
      socketStore
      
      
    }


  },
  
 async mounted() {
  try {
    console.log("Connecting to socket...");
     await  this.socketStore.connect();
 
  }catch(e) {
    console.error("Error connecting to socket:", e);
  }
  },
}


</script>