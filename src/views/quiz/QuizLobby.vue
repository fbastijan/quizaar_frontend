<template>
<Card class="max-w-md mx-auto mt-8">
    <CardHeader>
        <CardTitle>Quiz Lobby</CardTitle>
        <CardDescription>Waiting for the host to start the quiz...</CardDescription>
    </CardHeader>
    <CardContent class="text-center">
        <p class="mb-4">You have joined the quiz as: </p>
        <p class="font-semibold text-xl mb-4">{{ username }}</p>
        <Button @click="readyUp" class="w-full"   :disabled="isReady">Ready Up</Button>
    </CardContent>
    <CardFooter class="flex justify-between">
        <span>Session ID: {{sessionId}}</span>
        <span>Join Code: {{ $route.params.join_code }}</span>
    </CardFooter>
</Card>

</template>
<script>

import { useSocketStore } from '@/stores/socket';

import {Button} from '@/components/ui/button';
import { useQuestionStore } from '@/stores/question';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
export default {
  name: 'QuizLobby',
  components: {
    Button,
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    
  },
  setup() {
    const socketStore = useSocketStore();
    const questionStore = useQuestionStore();
    return { socketStore, questionStore };
  },
  data() {
    return {
      
      sessionId: localStorage.getItem('session_id'),
      username: localStorage.getItem('name'),
      token: localStorage.getItem('token'),
     
      addedPlayers: [],
       isReady: false,
    };
  },
  methods: {
    
  },
  computed:{
    currentQuestion() {
      return this.questionStore.currentQuestion;
    },
  },
 async mounted() {

     try {

     
            let res = await this.socketStore.joinChannel(`quiz:${this.$route.params.join_code}`, {name: this.$route.query.name, token: this.token, session_id: this.sessionId});
          
            console.log("Joined quiz channel:", res);
        } catch (e) {
            console.log(e);
        }
       const channel= this.socketStore.channel;

      channel.on('guest_joined', (data) => {
              console.log('Guest joined:', data);
              // Store session_id and name in sessionStorage
             
             localStorage.setItem('session_id', data.session_id);
             localStorage.setItem('name', data.name);
           
        });
      try{
        await this.questionStore.QuestionServed(channel, () => {
  this.$router.push(`/quiz/${this.$route.params.join_code}/current_question`);
});

      }catch(e) {
        console.error("Error joining channel:", e);
      }
      
  },
  methods: {
    async readyUp() {
      this.isReady = true;
     await this.socketStore.channel.push('ready_up', { })
        .receive('ok', (response) => {
          console.log('Ready up successful:', response);
        })
        .receive('error', (error) => {
          console.error('Ready up failed:', error);
        });
    },
  },
};




</script>