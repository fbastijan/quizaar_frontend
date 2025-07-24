<template>  
  <div class="flex justify-center  items-center px-2">
    <div class="flex flex-col items-center w-full max-w-2xl">
      <Stepper class="flex w-full items-start gap-2 mb-3">
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
      <GeneralQuizForm v-if="currentStep === 1" :general="GeneralQuizForm" @next="handleNext" class="w-full" />
      <QuizParameters v-if="currentStep === 2" @back="handlePrevious" @start="handleStart" :loading="loading" class="w-full" />
    </div>
  </div>
</template>

<script>

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from '@/components/ui/textarea'
import { useQuizStore } from "@/stores/quiz"
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
    const quizStore = useQuizStore();
    return { quizStore };
  },

  data() {
    return {
      steps : [
  {
    step: 1,
    title: 'General',
    description: 'Basic information about your quiz',
    state: 'active', 
  },
  {
    step: 2,
    title: 'Parameters',
    description: 'Set parameters for your quiz',
    state: 'inactive', 
  },

 
],
    currentStep: 1, 
    GeneralQuizForm: {
        title: '',
        description: ''
      },
      loading: false,

    }
   
    
  },

  methods: {
    async handleStart(parameters) {
      this.loading = true;
      let response;
      try {
        
           response = await this.quizStore.createQuiz( {quiz: {...this.GeneralQuizForm}}, parameters);

         
             
          console.log('Quiz created successfully:', response);
          
        } catch (error) {
          console.error('Error creating quiz:', error);
          
        } finally {
        this.loading = false;
      }

        
    },
      handleNext(formData) {
    
    console.log('Received from child:', formData)
    this.GeneralQuizForm.title = formData.title;
    this.GeneralQuizForm.description = formData.description;
    this.changeStep(this.currentStep+1); 


  
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