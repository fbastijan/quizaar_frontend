<template>
  <Card class="mx-auto max-w-sm">
    <CardHeader>
      <CardTitle class="text-2xl">
        Login
      </CardTitle>
      <CardDescription>
        Enter your email below to login to your account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form class="grid gap-4" @submit.prevent="loginAccount(email, password)">
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
</template>

<script>
import { useAccountStore } from '@/stores/account'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
  setup() { 
    const accountStore = useAccountStore()
    return {
      accountStore
    }
  },
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    loginAccount(email, password) {
      this.accountStore.loginAccount(email, password)
        .then(() => {
          this.$router.push('/') // Redirect to dashboard after successful login
        })
        .catch((error) => {
          console.error('Login failed:', error)
          // Handle error (e.g., show a notification)
        })
    }
  }
}
</script>