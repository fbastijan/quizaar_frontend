<template>
<div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 mx-3">
    <div>
      <div class="shadcn-cardrounded-lg border bg-background shadow">
        <CurrentQuestion :question="currentQuestion" :time_left="time_left" @answer="handleAnswer" :isClosed="isClosed" v-if="currentQuestion" />
      </div>
    </div>
    <div class="col-span-2">
      <Tabs defaultValue="answers" class="w-full mb-3">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="answers">Answers</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>
        <TabsContent value="answers">
          <UserAnswers :answers="answers" v-if="answers" @answer="fixAnswer"/>
        </TabsContent>
        <TabsContent value="stats">
          <StatsTable :results="results" v-if="results && results.length"/>
        </TabsContent>
      </Tabs>
      <Button class="flex ms-auto me-3" @click=" nextQuestion(socketChannel)"> Next  Question</Button>
    </div>
</div>
</template>
<script>
import CurrentQuestion from '@/components/CurrentQuestion.vue';
import { useSocketStore } from '@/stores/socket';
import { useQuestionStore } from '@/stores/question';
import UserAnswers from '@/components/UserAnswers.vue';
import StatsTable from '@/components/StatsTable.vue';
import { useScoreStore } from '@/stores/score';
import { useQuizStore } from '@/stores/quiz';
import { Button } from '@/components/ui/button';
import { ref } from 'vue';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'


export default {
  components: {
    CurrentQuestion,
    UserAnswers,
    StatsTable,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Button
    
  },
  setup() {
   
    const socketStore = useSocketStore();
    const questionStore = useQuestionStore();
    const scoreStore = useScoreStore();
    const quizStore = useQuizStore();
    
    return {
      socketStore,
      questionStore,
      scoreStore
      , quizStore
    };
  },
  data() {
    return {
     
      isClosed: true, 
      answers: ref([]), 
    

    };
  },
  methods: {
    handleAnswer(answer) {
     
      console.log("Answer submitted:", answer);
    },
    async trackAnswers(channel) {
       try {
      channel.push('get_all_answers_to_current', {  }).receive('ok', (response) => {
        this.answers = response.answers.data;
    
        console.log("Answers fetched successfully:", this.answers);
      });
    } catch (error) {
      console.error("Error getting answers:", error);
    }
     
    },
    async fixAnswer(answer){
      try {
        await this.socketStore.channel.push('fix_answer', { answer })
          .receive('ok',async (response) => {
            const i = this.answers.findIndex(a => a.id === answer.id);
            this.answers[i].is_correct = response.answer.data.is_correct;
            await this.scoreStore.trackResults(this.socketStore.channel);
          })
          .receive('error', (error) => {
            console.error("Error fixing answer:", error);
          });
      } catch (e) {
        console.error("Error fixing answer:", e);
      }
    },
    
    async nextQuestion(channel) {
      try {
        await this.questionStore.ServeQuestion(channel);
       
         this.trackAnswers(channel);
          this.scoreStore.trackResults(channel);
      } catch (error) {
        console.error("Error serving next question:", error);
      }
   
      
      }

  },

  computed: {
    currentQuestion() {
      return this.questionStore.currentQuestion;
    },
    time_left(){
      return this.questionStore.timeLeft;
    },
    socketChannel() {
      return this.socketStore.channel;
    },
    results() {
      return this.scoreStore.PlayerScores;
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

    const channel = this.socketStore.channel;
    try {
      await this.questionStore.getCurrentQuestion(channel);
    
    } catch (e) {
      console.error("Error fetching current question:", e);
    }

    this.trackAnswers(channel);

    channel.on('answer_received', (data) => {
      if (!data.fixed) {

           this.trackAnswers(channel);
      this.scoreStore.trackResults(channel);

      }
  
    });
   await this.scoreStore.trackResults(channel);
     this.quizStore.quizEnd(channel, (response) => {
       const join_code = this.$route.params.join_code;
        this.$router.push('/quiz/'+ join_code +'/results');
        toast.success("Quiz has ended!");
      
    });
   

  
   

  }


  

};

</script>