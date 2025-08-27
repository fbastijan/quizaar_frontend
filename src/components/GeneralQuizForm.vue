<template>
  <Card class="w-full mx-auto">
    <CardHeader>
      <CardTitle>Create Your Ai Quiz</CardTitle>
      <CardDescription>Hmmm.... What should we call this Quiz?</CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="sendForm()">
        <div class="flex flex-col space-y-4 w-full">
          <Label for="title">Title</Label>
          <Input
            id="title"
            placeholder="Title to your quiz"
            required
            v-model="title"
            class="w-full"
          />
          <Label for="description" class="mt-3">Description</Label>
          <Textarea
            id="description"
            wrap="soft"
            placeholder="Description of your quiz"
            class="h-24 resize-none break-words w-full"
            required
            v-model="description"
          />
        </div>

        
      </form>
    </CardContent>
    <CardFooter class="flex justify-between px-6 pb-6">
      <div></div>
      <Button type="submit" @click="sendForm">Next</Button>
    </CardFooter>
  </Card>
</template>

  <script>
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'vue-sonner'

export default {
  name: "NewQuiz",
  components: {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Input,
    Label,
    Button,
    Textarea,
 
  },
    props:{
        general: {
          type: Object,
         default: () => ({ title: '', description: '' })
        }
    },
  setup() {
  
  },
  data() {
    return {
      title: this.general.title || "",
      description: this.general.description ||""
    }
  },
  methods: {
  
    sendForm() {
    
      
    if (!this.title ) {
        toast.error('Please fill in all fields before proceeding.', {
          position: 'top-center',
          duration: 1000
         
        })

        return
    }
    else {
          const data = {
      title: this.title,
      description: this.description
    }
    this.$emit('next', data)
    }}
  }
}


</script>