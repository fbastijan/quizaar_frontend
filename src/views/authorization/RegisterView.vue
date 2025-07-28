<template>
  <div class="flex bg-background p-4">
    <Card class="w-full max-w-sm min-w-[320px] flex-grow-0 min-h-0 mx-auto">
      <CardHeader>
        <CardTitle class="text-xl">
          Sign Up
        </CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form class="grid gap-4" @submit.prevent="registerAccount">
          <div class="grid  gap-4">
            <div class="grid gap-2">
              <Label for="username">Username</Label>
              <Input id="username" placeholder="Master23" required v-model="full_name"/>
            </div>
          </div>
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              v-model="email"
            />
          </div>
          <div class="grid gap-2">
            <Label for="password">Password</Label>    
            <Input id="password" type="password" v-model:model-value="password" placeholder="*****"/>
          </div>
          <Button type="submit" class="w-full">
            Create an account
          </Button>
        </form>
        <div class="mt-4 text-center text-sm">
          Already have an account?
          <a href="/login" class="underline" >
            Sign in
          </a>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script>
import { useAccountStore } from '@/stores/account'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'vue-sonner'



export default {
  components: {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    Label
  },
  setup() {
    const accountStore = useAccountStore()
    return {
      accountStore
    }
  },
  name: 'RegisterView',
  meta: {
    title: 'Register',
    description: 'A sign up form with first name, last name, email and password inside a card. There\'s an option to sign up with GitHub and a link to login if you already have an account'
  },


  data(){
    return {
      full_name: '',
      email: '',
      password: ''
    }
  },

  methods:{
    async registerAccount() {
    
      this.accountStore.registerAccount(this.full_name, this.email, this.password)
        .then(() => {
   
          this.$router.push('/login')
        })
        .catch((error) => {

          toast.error('Registration failed. User already exists.')
        })
    }
  }
}


</script>