<template>
  <div class="flex  items-center justify-center  p-4">
  <Card class="w-full max-w-sm min-w-[320px] flex-grow-0 min-h-0 mx-auto">
    <CardHeader>
      <CardTitle class="text-2xl">
        Login
      </CardTitle>
      <CardDescription>
        Enter your email below to login to your account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form class="grid gap-4" @submit.prevent="loginAccount">
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
          <div class="flex items-center">
            <Label for="password">Password</Label>
            <a href="#" class="ml-auto inline-block text-sm underline">
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" placeholder="******" required v-model="password"/>
        </div>
        <Button type="submit" class="w-full">
          Login
        </Button>
      </form>
      <div class="mt-4 text-center text-sm">
        Don't have an account?
        <a href="/register" class="underline">
          Sign up
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
  name: 'LoginView',
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
  data() {
    return {
      email: '',
      password: '',
      accountStore: useAccountStore()
    }
  },
  methods: {
    loginAccount() {
      this.accountStore.loginAccount(this.email, this.password)
        .then((response) => {
          
          
          this.$router.push("/")
        })
        .catch((error) => {
          toast.error('Login failed. Please check your credentials.') 
        })
    }
  }
}
</script>