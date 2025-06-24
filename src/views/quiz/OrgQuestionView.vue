<template>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
    <div class="">
    <CurrentQuestion :question="currentQuestion" :time_left="timeLeft" @answer="handleAnswer" :isClosed="isClosed" v-if="currentQuestion" />

    </div>

    <div class="">
        aafad   
    </div>
    <div class="">
        aafad   
    </div>
</div>


</template>
<script>
import CurrentQuestion from '@/components/CurrentQuestion.vue';
import { useSocketStore } from '@/stores/socket';
export default {
  components: {
    CurrentQuestion
  },
  setup() {
    // Import and use the socket store
    const socketStore = useSocketStore();
    return {
      socketStore
    };
  },
  data() {
    return {
      currentQuestion: null,
      timeLeft: 0, // Initialize timeLeft to 0
      isClosed: true, // Track if the question is closed
    };
  },
  methods: {
    handleAnswer(answer) {
      // Emit the answer to the parent component
      console.log("Answer submitted:", answer);
    }
  },
  async mounted() {
    // Fetch the current question when the component is mounted
        if (!this.socketStore.channel) {
      const joinCode = this.$route.params.join_code;
      if (!joinCode) {
        console.error("No join_code in route params");
        return;
      }
      await this.socketStore.joinChannel(`quiz:${joinCode}`, { token: localStorage.getItem('token') , session_id: this.sessionId, name: this.username });
    }


    try {
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

    try {
      const response = await this.socketStore.channel.push('get_all_answers_to_current', {  }).receive('ok', (response) => {
        this.answers = response.answers;
    
        console.log("Answers fetched successfully:", this.answers);
      });
    } catch (error) {
      console.error("Error getting answers:", error);
    }


  }

  

};

</script>