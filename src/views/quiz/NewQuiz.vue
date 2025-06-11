<template>  

    <div class="flex justify-center  min-h-screen mt-10">
          <div class="flex flex-col items-center">
    <Stepper class="flex w-xl items-start gap-2 mb-3">
    <StepperItem
      v-for="step in steps"
      :key="step.step"
      class="relative flex w-full flex-col items-center justify-center"
      :step="step.step"
   
    >
      <StepperSeparator
        v-if="step.step !== steps[steps.length - 1].step"
        class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary"
      />

      <StepperTrigger as-child>
        <Button
          :variant="step.state === 'completed' || step.state === 'active' ? 'default' : 'outline'"
          size="icon"
          class="z-10 rounded-full shrink-0 pointer-events-none"
         
          :class="[step.state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background']"
        >
          <Check v-if="step.state === 'completed'" class="size-5" />
          <Circle v-if="step.state === 'active'" />
          <Dot v-if="step.state === 'inactive'" />
        </Button>
      </StepperTrigger>

      <div class="mt-5 flex flex-col items-center text-center">
        <StepperTitle
          :class="[step.state === 'active' && 'text-primary']"
          class="text-sm font-semibold transition lg:text-base"
        >
          {{ step.title }}
        </StepperTitle>
        <StepperDescription
          :class="[step.state === 'active' && 'text-primary']"
          class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm"
        >
          {{ step.description }}
        </StepperDescription>
      </div>
    </StepperItem>
  </Stepper>
          
   <GeneralQuizForm v-if="currentStep === 1" :general="GeneralQuizForm" @next="handleNext"/>
    <QuizParameters v-if="currentStep === 2" @back="handlePrevious" @start="handleStart"/>
             
    </div>
   </div>
</template>

<script>

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from '@/components/ui/textarea'

import { Check, Circle, Dot } from 'lucide-vue-next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper'
import GeneralQuizForm from "@/components/GeneralQuizForm.vue"
import QuizParameters from "@/components/QuizParameters.vue"
import quizApi from "@/api/Quiz.api"

export default {
  name: "NewQuiz",
  components: {
  
    Input,
    Label,
    Button,
    Textarea,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    GeneralQuizForm,
    QuizParameters,
    Stepper,
    StepperDescription,
    StepperIndicator,
    StepperItem,
    StepperSeparator,
    StepperTitle,
    StepperTrigger,
    Check,
    Circle,
    Dot

  },
  setup() {
    // Setup logic can go here if needed
  },

  data() {
    return {
      steps : [
  {
    step: 1,
    title: 'General',
    description: 'Basic information about your quiz',
    state: 'active', // Set the initial state for the first step
  },
  {
    step: 2,
    title: 'Parameters',
    description: 'Set parameters for your quiz',
    state: 'inactive', // Set the initial state for the second step
  },
  // <-- Add this
 
],
    currentStep: 1, 
    GeneralQuizForm: {
        title: '',
        description: ''
      }

    }
   
    
  },

  methods: {
    async handleStart(parameters) {
        try {
          // Assuming you have a method to create a quiz
          const response = await quizApi.createQuiz({quiz: {...this.GeneralQuizForm}});

          console.log('Quiz created:', response.data.data.id);
          const questions = await quizApi.generateQuestions(response.data.data.id, {
            topic: parameters.topic, // Example topic
            number: parameters.questions, // Example number of questions
            difficulty: parameters.difficulty, // Example difficulty
            description: parameters.context // Example context
          });
          
           // Handle the response as needed
          console.log('Quiz created successfully:', response, questions);
           // Redirect to the quiz list or another page
        } catch (error) {
          console.error('Error creating quiz:', error);
          // Handle error (e.g., show a toast notification)
        }
    },
      handleNext(formData) {
    // formData contains { title, description }
    console.log('Received from child:', formData)
    this.GeneralQuizForm.title = formData.title;
    this.GeneralQuizForm.description = formData.description;
    this.changeStep(this.currentStep+1); // Move to the next step


    // Do something with the data (e.g., save to store, go to next step)
  },
  handlePrevious() {
      if (this.currentStep > 1) {
        this.changeStep(this.currentStep - 1);
      }
    },


    changeStep(step) {
      this.currentStep = step;
      this.updateStepStates();
    },

    // Method to update the state of each step based on the current step
    updateStepStates() {
      this.steps.forEach((step, index) => {
        if (index < this.currentStep - 1) {
          step.state = 'completed';
        } else if (index === this.currentStep - 1) {
          step.state = 'active';
        } else {
          step.state = 'inactive';
        }
      });
    },
  },
}


</script>