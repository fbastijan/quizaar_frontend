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
          <UserAnswers :answers="answers" v-if="answers"/>
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
    // Import and use the socket store
    const socketStore = useSocketStore();
    const questionStore = useQuestionStore();
    return {
      socketStore,
      questionStore
    };
  },
  data() {
    return {
     
      isClosed: true, // Track if the question is closed
      answers: ref([]), // Store answers fetched from the server
      results: ref([]), // Store results fetched from the server
      mockAnswers: [
  { id: "1", is_correct: false, player: { id: "p1", name: "Alice" }, text: "42" },
  { id: "2", is_correct: true, player: { id: "p2", name: "Bob" }, text: "Paris" },
  { id: "3", is_correct: false, player: { id: "p3", name: "Charlie" }, text: "Blue" },
  { id: "4", is_correct: true, player: { id: "p4", name: "Diana" }, text: "Mount Everest" },
  { id: "5", is_correct: false, player: { id: "p5", name: "Eve" }, text: "Mercury" },
  { id: "6", is_correct: true, player: { id: "p6", name: "Frank" }, text: "Tesla" },
  { id: "7", is_correct: false, player: { id: "p7", name: "Grace" }, text: "Python" },
  { id: "8", is_correct: false, player: { id: "p8", name: "Heidi" }, text: "Pizza" },
  { id: "9", is_correct: true, player: { id: "p9", name: "Ivan" }, text: "Tokyo" },
  { id: "10", is_correct: false, player: { id: "p10", name: "Judy" }, text: "Einstein" },
    { id: "1", is_correct: false, player: { id: "p1", name: "Alice" }, text: "42" },
  { id: "2", is_correct: true, player: { id: "p2", name: "Bob" }, text: "Paris" },
  { id: "3", is_correct: false, player: { id: "p3", name: "Charlie" }, text: "Blue" },
  { id: "4", is_correct: true, player: { id: "p4", name: "Diana" }, text: "Mount Everest" },
  { id: "5", is_correct: false, player: { id: "p5", name: "Eve" }, text: "Mercury" },
  { id: "6", is_correct: true, player: { id: "p6", name: "Frank" }, text: "Tesla" },
  { id: "7", is_correct: false, player: { id: "p7", name: "Grace" }, text: "Python" },
  { id: "8", is_correct: false, player: { id: "p8", name: "Heidi" }, text: "Pizza" },
  { id: "9", is_correct: true, player: { id: "p9", name: "Ivan" }, text: "Tokyo" },
  { id: "10", is_correct: false, player: { id: "p10", name: "Judy" }, text: "Einstein" }
]
    };
  },
  methods: {
    handleAnswer(answer) {
      // Emit the answer to the parent component
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
    async trackResults(channel) {
      try {
        channel.push('player_stats', { })
          .receive('ok', (response) => {
            this.results = response.players;
            console.log('Player stats received:', this.results);
          })
          .receive('error', (error) => {
            console.error('Error receiving player stats:', error);
          });
      } catch (error) {
        console.error("Error getting player stats:", error);
      }
    },
    async nextQuestion(channel) {
      try {
        await this.questionStore.ServeQuestion(channel);
       
         this.trackAnswers(channel);
          this.trackResults(channel);
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

    const channel = this.socketStore.channel;
    try {
      await this.questionStore.getCurrentQuestion(channel);
    
    } catch (e) {
      console.error("Error fetching current question:", e);
    }

    this.trackAnswers(channel);

    channel.on('answer_received', (data) => {
     this.trackAnswers(channel);
      this.trackResults(channel);

    });
   this.trackResults(channel);

   

  
   

  }


  

};

</script>