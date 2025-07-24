<template>

   <div>
    
    <Score :oldScore="pastScore" :newScore="currentPlayerScore" :duration="400"  :higher="higher" :lower="lower" :placement="placement"/>
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
import { useScoreStore } from '@/stores/score';
import { useQuizStore } from '@/stores/quiz';
import Score from '@/components/Score.vue';

 export default {
  setup(){
    
    const socketStore = useSocketStore();
    const questionStore = useQuestionStore();
    const scoreStore = useScoreStore();
    const quizStore = useQuizStore();
    return {
      socketStore, 
      questionStore,
      scoreStore,
      quizStore
    };
  },
   components: {
     CurrentQuestion,
     SkeletonCurrentQuestion,
     Score

   },


   data() {
     return {
    
       token: localStorage.getItem('token'),
       sessionId: localStorage.getItem('session_id'),
        username: localStorage.getItem('name'),
       
      isClosed: false, 
      pastScore: 0,
    
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
              toast.error("Error submitting answer: " + error);
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
      },
      currentPlayerScore() {
        return this.scoreStore.currentPlayerScore || 0; 
      },
      higher() {
        return this.scoreStore.higherPlayerScore || { score: null, name: null }; // Default value if not provided
      },
      lower() {
        return this.scoreStore.lowerPlayerScore || { score: null, name: null }; // Default value if not provided
      },
      placement() {
        return this.scoreStore.placement || 0; // Default value if not provided
      }
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
  
 
  try {
    if (!this.socketStore.channel) {
      console.error("Channel not initialized on socketStore");
      return;
    }

  } catch (e) {
    console.error("Error fetching current question:", e);
  }
  const channel = this.socketStore.channel;
await this.scoreStore.getScore(channel);
  this.pastScore = this.scoreStore.currentPlayerScore ?? 0;
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

  this.quizStore.quizEnd(channel, (response) => {
       const join_code = this.$route.params.join_code;
        this.$router.push('/quiz/'+ join_code +'/results');
        toast.success("Quiz has ended!");
      
    });

    // Listen for question closed event

  channel.on('question_closed', (data) => {
      this.isClosed = true; // Set isClosed to true when the question is closed
      console.log('Question closed:', data);
    });

    channel.on('answer_received', (data) => {
      
    
       this.pastScore = this.scoreStore.currentPlayerScore ?? 0; // Save the old score
      this.scoreStore.getScore(channel); // This will update currentPlayerScore

    });

  

 

}
 
 }


</script>