<template>
    <div class="grid grid-rows-3   gap-4 p-4">
   
        
        <div class ="flex flex-col gap-4 text-center items-center justify-center  row-span-2 bg-gray-100 p-4 ">
            <h1 class="text-3xl font-bold mb-2" v-if="localTimeLeft > 0">{{localTimeLeft}}</h1>
            <h1 class="text-2xl font-bold mb-4 text-red-500" v-if="localTimeLeft === 0">Time is up!</h1>
            <h2 class="text-2xl font-bold mb-4">Question</h2>
            <p class="text-lg">{{ question.text }}</p>
            <p class="text-sm text-gray-500 mb-4" v-if="isClosed">Correct Answer: {{ question.answer }}</p>


        </div>
        <div class=" row-span-1">
            
   
     <ul class="grid grid-cols-2 gap-4 p-4 h-full" v-if="question.options && question.options.length > 0">
        <li
          v-for="(option, idx) in question.options"
          :key="option"
          @click="answerQuestion(option)"
            :disabled="isClosed"
            class="flex items-center gap-4 cursor-pointer transition-colors duration-200
                   p-4 rounded-xl shadow-lg h-full w-full font-semibold
                   border border-black bg-white text-black
                   hover:bg-black hover:text-white "
            :class="[
              isClosed ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
              selectedOption === option ? 'bg-black text-white ring-4 ring-blue-400 border-blue-500 !bg-black' : ''
            ]"
          >
          <span
            class="flex items-center justify-center rounded-full border-2 border-black bg-white text-black font-bold w-12 h-12 text-xl
                   mr-2 transition-colors duration-200
                   hover:bg-black hover:text-white"
            :class="selectedOption === option ? 'bg-black text-white border-blue-500 !bg-black' : ''"
          >
            {{ String.fromCharCode(65 + idx) }}
          </span>
          <span>{{ option }}</span>
        </li>
      </ul>
      <div class="grid grid-cols-2 gap-4 p-4 h-full" v-else>
        
        <Textarea
          
          class="col-span-2"
          placeholder="Type your answer here..."
          v-model="userAnswer"
          :disabled="isClosed"
        />
        <Button @click="answerQuestion(userAnswer)" class="col-span-2" :disabled="isClosed">
          Submit
        </Button>

      </div>
      
        </div>
      
    </div>



</template>

<script>
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

 export default {
    props: {
      question: {
        type: Object,
        required: true,
      },
        time_left: {
            type: Number,
            required: true,
        },
        isClosed: {
          type: Boolean,
          required: true,
        },
        answer: {
          type: Object,
          default: {data: {text: ''}},
        }
    },
    components: {
        Textarea,
        Button,
    },
  name: 'QuestionView',
  data() {
    return {
        localTimeLeft: 0,
        userAnswer: '',
        timer: null,
        selectedOption: null, 

    

      correctAnswer: 'Paris',
    };
  },
   watch: {
    time_left: {
      immediate: true,
      handler(newVal) {
        this.localTimeLeft = newVal;
        this.startTimer();
      },
    },
       question: {
      deep: true,
      handler() {
       
        this.localTimeLeft = this.time_left;
        this.startTimer();
        this.selectedOption = null; 
        this.userAnswer = ''; 
    },},
      answer: {
    immediate: true,
    handler(newVal) {
      if (newVal && typeof newVal === 'object' && newVal.data && newVal.data.text) {
        this.selectedOption = newVal.data.text;
      } else if (typeof newVal === 'string') {
        this.selectedOption = newVal;
      } else {
        this.selectedOption = null;
      }
    }
  }

  
  },

  methods: {
    answerQuestion(answer) {
      if (this.question.options && this.question.options.length > 0) {
        this.selectedOption = answer; 
      }
      this.$emit('answer', answer);
    },
      startTimer() {
      this.clearTimer();
      if (this.localTimeLeft > 0) {
        this.timer = setInterval(() => {
          if (this.localTimeLeft > 0) {
            this.localTimeLeft--;
          }
          if (this.localTimeLeft === 0) {
            this.clearTimer();
           
          }
        }, 1000);
      }
    },
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    checkAnswer(selectedOption) {
      if (selectedOption === this.correctAnswer) {
        alert('Correct!');
      } else {
        alert('Incorrect, try again!');
      }
    },
  },
  beforeUnmount() {
    this.clearTimer();
  },


 }


</script>