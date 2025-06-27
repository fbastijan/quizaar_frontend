<template>
   <div>
      <CurrentQuestion
        v-if="currentQuestion"
        :question="currentQuestion"
        :time_left="timeLeft"
        @answer="handleAnswer"
        :isClosed="isClosed"
      />
      <div v-else>
        <SkeletonCurrentQuestion />
      </div>
    
</div>
</template>

<script>
import CurrentQuestion from '@/components/CurrentQuestion.vue';
import { useSocketStore } from '@/stores/socket';
import SkeletonCurrentQuestion from '@/components/SkeletonCurrentQuestion.vue';
import {toast } from 'vue-sonner';
import { useQuestionStore } from '@/stores/question';

 export default {
  setup(){
    
    const socketStore = useSocketStore();
    const questionStore = useQuestionStore();

    return {
      socketStore, 
      questionStore
    };
  },
   components: {
     CurrentQuestion,
     SkeletonCurrentQuestion
   },


   data() {
     return {
    
       token: localStorage.getItem('token'),
       sessionId: localStorage.getItem('session_id'),
        username: localStorage.getItem('name'),
       
      isClosed: false, // Track if the question is closed
    
     };
   },
   methods: {
 


    
      async handleAnswer(answer) {
        if (!this.socketStore.channel) {
          console.error("Channel not initialized on socketStore");
          return;
        }
        try {
          await this.socketStore.channel.push('answer_question', { answer, question: this.currentQuestion })
            .receive('ok', (response) => {
             
              this.isClosed = true; 
            })
            .receive('error', (error) => {
              toast.error("Error submitting answer: " + error.message);
            });
        } catch (e) {
          console.error("Error submitting answer:", e);
        }
      },
   },

    computed: {
      currentQuestion() {
        return this.questionStore.currentQuestion;
      },
      timeLeft() {
        return this.questionStore.timeLeft;
      }
    },
 async mounted() {



  // Check if the socketStore channel is already initializ
 if (!this.socketStore.channel) {
      const joinCode = this.$route.params.join_code;
      if (!joinCode) {
        console.error("No join_code in route params");
        return;
      }
      await this.socketStore.joinChannel(`quiz:${joinCode}`, { token: localStorage.getItem('token') , session_id: this.sessionId, name: this.username });
    }

  // Fetch the current question when the component is mounted
  try {
    if (!this.socketStore.channel) {
      console.error("Channel not initialized on socketStore");
      return;
    }

  } catch (e) {
    console.error("Error fetching current question:", e);
  }
  const channel = this.socketStore.channel;

   try { 
    await this.questionStore.ActiveQuestion(channel)
  console.log("Current question fetched successfully:")}
    catch (e) {
      toast.error("Error fetching current question: " + e.message);
    
    }
  try{
    await this.questionStore.QuestionServed(channel, () => {
    this.isClosed = false; // Reset isClosed when a new question is served
    });
  }catch(e) {
    console.error("Error fetching current question:", e);
  }
  channel.on('question_closed', (data) => {
      this.isClosed = true; // Set isClosed to true when the question is closed
      console.log('Question closed:', data);
    });

    channel.on('answer_received', (data) => {
      console.log('Answer received:', data);
      this.questionStore.trackAnswers(channel); // Update answers when a new answer is received
    });

  

 

}
 
 }


</script>