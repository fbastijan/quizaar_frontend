<template>
<Card class="max-w-md mx-auto ">
    <CardHeader>
        <CardTitle>Quiz Lobby</CardTitle>
        <CardDescription>Waiting for the host to start the quiz...</CardDescription>
    </CardHeader>
    <CardContent class="text-center">
        <p class="mb-4">You have joined the quiz as: </p>
        <p class="font-semibold text-xl mb-4">{{ username2 }}</p>
        <Button @click="readyUp" class="w-full"   :disabled="isReady">Ready Up</Button>
    </CardContent>
    <CardFooter class="flex justify-between">
        <span v-if="sessionId">Session ID: {{sessionId}}</span>
        <span>Join Code: {{ $route.params.join_code }}</span>
    </CardFooter>
</Card>

</template>
<script>

import { useSocketStore } from '@/stores/socket';

import {Button} from '@/components/ui/button';
import { useQuestionStore } from '@/stores/question';
import { useAccountStore } from '@/stores/account';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from 'vue-sonner';
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
    const accountStore = useAccountStore();
    return { socketStore, questionStore, accountStore };
  },
  data() {
    return {
      
      sessionId: localStorage.getItem('session_id'),
      token: localStorage.getItem('token'),
      username2: 'Guest', // <-- add this
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
          toast.error("Failed to join quiz channel. Please check your join code and try again.");
          this.socketStore.disconnect();
          this.$router.push({ name: 'QuizView' });
          return;
        }
       const channel= this.socketStore.channel;

      channel.on('guest_joined', (data) => {
              console.log('Guest joined:', data);
              // Store session_id and name in sessionStorage
             
             localStorage.setItem('session_id', data.session_id);
             localStorage.setItem('name', data.name);
           
        });

         let account = await this.accountStore.getCurrentUser();
          if (!account || !account.user) {
            this.username2 = localStorage.getItem('name') || 'Guest';
          } else {
            this.username2 = account.user.full_name;
          }
      try{
        await this.questionStore.QuestionServed(channel, () => {
            this.$router.push(`/quiz/${this.$route.params.join_code}/current_question`);
});

      }catch(e) {
        console.error("Error joining channel:", e);
      }
      
  },

  methods: {

    async getName(){

    },
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