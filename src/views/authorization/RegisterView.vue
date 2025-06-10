<template>
  <Card class="mx-auto max-w-sm">
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
</template>

<script>
import { useAccountStore } from '@/stores/account'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'



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
      console.log('Registering account with:', {
        full_name: this.full_name,
        email: this.email,
        password: this.password
      })
      this.accountStore.registerAccount(this.full_name, this.email, this.password)
        .then(() => {
          console.log(this.accountStore.accountData)
          this.$router.push('/login')
        })
        .catch((error) => {
          console.error('Registration failed:', error)
          alert('Registration failed. Please try again.')
        })
    }
  }
}


</script>