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
 export default {
  setup(){
    
    const socketStore = useSocketStore();

    return {
      socketStore
    };
  },
   components: {
     CurrentQuestion,
     SkeletonCurrentQuestion
   },


   data() {
     return {
       currentQuestion: null,
       token: localStorage.getItem('token'),
       sessionId: localStorage.getItem('session_id'),
        username: localStorage.getItem('name'),
        timeLeft: 0, // Initialize timeLeft to 0
      isClosed: false, // Track if the question is closed
    
     };
   },
   methods: {
    handleAnswer2(answer) {
        // Emit the answer to the parent component
        console.log("Answer submitted:", answer);
      },
      async handleAnswer(answer) {
        if (!this.socketStore.channel) {
          console.error("Channel not initialized on socketStore");
          return;
        }
        try {
          await this.socketStore.channel.push('answer_question', { answer })
            .receive('ok', (response) => {
              console.log("Answer submitted successfully:", response);
            })
            .receive('error', (error) => {
              console.error("Error submitting answer:", error);
            });
        } catch (e) {
          console.error("Error submitting answer:", e);
        }
      },
   },
 async mounted() {
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
    await this.socketStore.channel.push('get_current_question', {})
      .receive('ok', (response) => {
           
        this.currentQuestion = response.question.data;
        this.timeLeft = response.time_left || 0; // Set timeLeft from the response
        console.log("Current question fetched:", response);
        console.log("Current question data:", this.currentQuestion);
      })
      .receive('error', (error) => {
        console.error("Error fetching current question:", error);
      });
  } catch (e) {
    console.error("Error fetching current question:", e);
  }
  this.socketStore.channel.on('question_closed', (payload) => {
    toast.warning("Question closed", {
      description: `The question has been closed. You can no longer answer.`,
      position: "top-center"
    });
    console.log("Current question updated:", payload);
    this.isClosed = true;
  });
  this.socketStore.channel.on('question_served', (payload) => {
    console.log("New question served:", payload);
    this.currentQuestion = payload.question.data;
    this.timeLeft = payload.time_left || 0; // Reset timeLeft for the new question
    this.isClosed = false; // Reset isClosed for the new question
    toast.success("New question available", {
      description: `A new question has been served. You can now answer.`,
      position: "top-center"
    });
  });
}
 
 }


</script>