<script setup>
import { Button } from '@/components/ui/button'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  
} from '@/components/ui/sheet'
import { navigationMenuTriggerStyle } from './ui/navigation-menu';


import { useAccountStore } from '@/stores/account'
const accountStore = useAccountStore()
</script>

<template>
   
  <Sheet >
  <span class="flex items-center gap-2 flex items-center  w-full h-20 shrink-0 px-4 md:px-6 ">
    <SheetTrigger as-child>
      <Button variant="outline">
       
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    
</svg>

      </Button>

    </SheetTrigger>
    <div :class="[
        navigationMenuTriggerStyle(),
        'border-l',
        'rounded-none',
        'hover:bg-transparent focus:bg-transparent active:bg-transparent'
      ]">
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
        </svg> <div class="ms-3">Quizaar</div></div></span>
    

    <SheetContent side="left">
      <SheetHeader>
        <SheetTitle> <span class="flex "> <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 me-3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
        </svg> Quizaar  </span></SheetTitle>
       
      </SheetHeader>
    
        <ul>
          <li>
            <router-link to="/" class="ms-6 flex w-full items-center py-2 text-lg font-semibold" >
                Home
            </router-link>
            </li>
            <li>
            <router-link to="/quiz" class="ms-6 flex w-full items-center py-2 text-lg font-semibold">
                Quiz
            </router-link>
            </li>
           
             <br>
            <li>
            <router-link to="/login" class="ms-6 flex w-full items-center py-2 text-lg font-semibold" v-if="!accountStore">
                Login
            </router-link>
            </li>
            <li>
            <router-link to="/register" class="ms-6 flex w-full items-center py-2 text-lg font-semibold" v-if="!accountStore">
                Register
            </router-link>
            </li>
           
              <li>
            <router-link to="/account/settings" class="ms-6 flex w-full items-center py-2 text-lg font-semibold" v-if="accountStore">
                Settings
            </router-link>
            </li>
             <li>
            <a class="ms-6 flex w-full items-center py-2 text-lg font-semibold" href="#" v-if="accountStore" @click="logOut">
                Logout
            </a>
            </li>

        </ul>
    </SheetContent>
  </Sheet>
</template>

<script>
import auth from '@/api/account.api';
export default {
  name: 'MobileNavbar',
  methods: {
    logOut() {
      auth.logOut().then(() => {
        this.$router.push('/login');
      }).catch((error) => {
        console.error('Logout failed:', error);
      });
    }
  },



};




</script>