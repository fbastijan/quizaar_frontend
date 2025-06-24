<template>
    <div class="grid grid-rows-3  h-screen gap-4 p-4">
   
        
        <div class ="flex flex-col gap-4 text-center items-center justify-center  row-span-2 bg-gray-100 p-4 ">
            <h1 class="text-3xl font-bold mb-2" v-if="localTimeLeft > 0">{{localTimeLeft}}</h1>
            <h1 class="text-2xl font-bold mb-4 text-red-500" v-if="localTimeLeft === 0">Time is up!</h1>
            <h2 class="text-2xl font-bold mb-4">Question</h2>
            <p class="text-lg">{{ question.text }}</p>


        </div>
        <div class=" row-span-1">
            
   
     <ul class="grid grid-cols-2 gap-4 p-4 h-full" v-if="question.options && question.options.length > 0">
        <li
          v-for="(option, idx) in question.options"
          :key="option"
          @click="answerQuestion(option)"
            :disabled="isClosed"
          :class="[
            colorClasses[idx % colorClasses.length],
            'hover:scale-105 transition-transform duration-200',
            'p-4 rounded-xl shadow-lg flex items-center justify-center h-full w-full cursor-pointer text-lg font-semibold'
          ]"
        >
          {{ option }}
        </li>
      </ul>
      <div class="grid grid-cols-2 gap-4 p-4 h-full" v-else>
        
        <Textarea
          
          class="col-span-2"
          placeholder="Type your answer here..."
          v-model="userAnswer"
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
    },
    components: {
        Textarea,
        Button,
    },
  name: 'QuestionView',
  data() {
    return {
        localTimeLeft: 0, // <-- Add this line
        userAnswer: '',
      colorClasses: [
        'bg-green-200 hover:bg-green-300 active:bg-green-400 focus:ring-2 focus:ring-green-400',
        'bg-blue-200 hover:bg-blue-300 active:bg-blue-400 focus:ring-2 focus:ring-blue-400',
        'bg-yellow-200 hover:bg-yellow-300 active:bg-yellow-400 focus:ring-2 focus:ring-yellow-400',
        'bg-red-200 hover:bg-red-300 active:bg-red-400 focus:ring-2 focus:ring-red-400'
      ],

      correctAnswer: 'Paris',
    };
  },
   watch: {
    time_left: {
      immediate: true,
      handler(newVal) {
        this.localTimeLeft = newVal;
        this.startTimer();
      }
    }
  },
  methods: {
 answerQuestion(answer) {
        
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
            // Optionally emit an event here, e.g. this.$emit('time-up')
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
 }


</script>