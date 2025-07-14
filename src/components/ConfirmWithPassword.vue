<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
    DialogClose 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ref } from 'vue'
const current_password = ref('')
</script>

<template>
  <Dialog>
    <DialogTrigger>
        <slot>
            Edit Profile
        </slot>
     
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Password</DialogTitle>
        <DialogDescription>
            Confirm changes with your password.
        </DialogDescription>
        <Input
          v-model="current_password"
          type="password"
          placeholder="Current Password"
          class="mb-4 w-50"/>
      </DialogHeader>

      <DialogFooter>
        <DialogClose as-child>
        <Button type="submit" @click="$emit('confirm', current_password)">Confirm</Button>
        </DialogClose>
        
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>