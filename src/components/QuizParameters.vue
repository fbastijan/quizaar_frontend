<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>Parameters</CardTitle>
      <CardDescription>What is this Quiz about?</CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <div class="flex flex-col space-y-4 w-full">
          <Label for="title">Topic</Label>
          <Input id="title" placeholder="Give your quiz a topic..." v-model="parameters.topic" class="w-full" />

          <NumberField :default-value="10" :min="5" :max="100" class="w-full mt-3" v-model="parameters.questions">
            <Label class="mb-2">How many questions do you want?</Label>
            <div class="flex justify-between">
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </div>
          </NumberField>

          <Label class="mt-3">Difficulty</Label>
          <Slider
            v-model="slide"
            :min="1"
            :max="5"
            :step="1"
            class="mt-2"
          />
          <div class="flex justify-between text-xs text-muted-foreground mt-1 px-1">
            <span>Very Easy</span>
            <span>Easy</span>
            <span>Medium</span>
            <span>Hard</span>
            <span>Very Hard</span>
          </div>
          <div class="text-right text-sm mt-1">Selected: <b>{{ difficultyLabel }}</b></div>

          <Label class="mt-3">Additional context</Label>
          <Textarea id="description" placeholder="Do you want to specify anything?" class="h-24 resize-none break-words w-full" v-model="parameters.context"/>
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex justify-between px-6 pb-6">
      <Button variant="outline" @click="$emit('back')">Back</Button>
      <Button @click="handleStart">Start</Button>
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
import { Slider } from '@/components/ui/slider'
import {toast} from 'vue-sonner'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'

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
    NumberField,
    NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput,
    Slider
  },

 

  data() {
    return {
      slide: [1],
      difficultyLabels: [
        "Very Easy",
        "Easy",
        "Medium",
        "Hard",
        "Very Hard"
      ],
      parameters:{
        topic: '',
        questions: 10,  
        difficulty: '',
        context: ''
      }
    }

  
  },
  methods: {

    handleStart() {
      if (!this.parameters.topic ) {
        toast.error('Please fill in all fields before proceeding.', {
          position: 'top-center',
          duration: 1000
        })
        return
      }
      this.parameters.difficulty = this.difficultyLabels[this.slide - 1]
      console.log('Starting quiz with parameters:', this.parameters)
      this.$emit('start', this.parameters)
    }
  },
  computed: {
    difficultyLabel() {
      // slide is 1-based, array is 0-based
      return this.difficultyLabels[this.slide - 1]
    }
  }
}
</script>