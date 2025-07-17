

<template>
  <div class="flex items-center justify-between w-full h-20 shrink-0 items-center px-4 md:px-6">
    <!-- Left side NavigationMenu -->
    <NavigationMenu>
      <NavigationMenuList class="flex">
        <NavigationMenuItem :class="[
          navigationMenuTriggerStyle(),
          'border-r',
          'rounded-none',
          'hover:bg-transparent focus:bg-transparent active:bg-transparent'
        ]">
          <!-- ...logo and Quizaar text... -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
          </svg>
          <span class="ms-3"> Quizaar</span>
        </NavigationMenuItem>
        <NavigationMenuLink href="/" :class="navigationMenuTriggerStyle()">
          <span>Home</span>
        </NavigationMenuLink>
        
        <NavigationMenuItem>
          <a href="/quiz"><NavigationMenuTrigger href="#" >Quiz</NavigationMenuTrigger> </a>
          <NavigationMenuContent>
            <ul class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              <li v-for="component in nav_components" :key="component.title">
                <NavigationMenuLink as-child>
                  <a
                    :href="component.href"
                    class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div class="text-sm font-medium leading-none">{{ component.title }}</div>
                    <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      {{ component.description }}
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
      </NavigationMenuList>
    </NavigationMenu>

    <!-- Right side NavigationMenu -->
    <NavigationMenu>
      <NavigationMenuList class="flex">
            <NavigationMenuItem>
          <NavigationMenuTrigger><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 me-1">
  <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>
Profile</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class=" ">

                    <li  v-if="accountStore.accountData">
                <NavigationMenuLink as-child href="/account/settings">
                  <a>
                    Settings
                  </a>
                  
                
                </NavigationMenuLink>
              </li>
              <li  v-if="accountStore.accountData">
                <NavigationMenuLink as-child href="#" @click="logOut()">  
                  <a>
                    Logout
                  </a>
                  
                
                </NavigationMenuLink>
              </li>
          

               <li v-if="!accountStore.accountData">
                <NavigationMenuLink as-child href="/login" >
                  <a>
                    Login
                  </a>
                  
                
                </NavigationMenuLink>
              </li>
                  <li  v-if="!accountStore.accountData">
                <NavigationMenuLink as-child href="/register">
                  <a>
                    Register
                  </a>
                  
                
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
       
      </NavigationMenuList>
    </NavigationMenu>
  </div>
</template>
<script>
import { useAccountStore } from '@/stores/account'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

export default {
  name: 'DesktopNavbar',
  components: {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
  },
  setup() {
    const accountStore = useAccountStore()
    return {
      accountStore,
    }
  },
  data() {
    return {
      nav_components: [
        {
          title: 'New Quiz',
          href: '/quiz/new',
          description: 'Start your quiz journey by creating a new quiz.',
        },
        {
          title: 'See Made Quizzes',
          href: '/quiz/list/user',
          description: 'See what you already made',
        },
        {
          title: 'Join Quiz',
          href: '/quiz/join',
          description: 'Ask your quiz administrator for a code and join here.',
        },
      ],
     
    }
  },
  methods: {
    logOut() {

      this.accountStore.logOut()
    },
    navigationMenuTriggerStyle,
  },
}
</script>