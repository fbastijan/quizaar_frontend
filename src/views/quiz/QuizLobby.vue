<template>

<Button @click ="readyUp"> Readyup</Button>


</template>
<script>

import { useSocketStore } from '@/stores/socket';

import {Button} from '@/components/ui/button';

export default {
  name: 'QuizLobby',
  components: {
    Button,
  },
  setup() {
    const socketStore = useSocketStore();
    return { socketStore };
  },
  data() {
    return {
      channel: null,
    
    };
  },
  methods: {
    
  },
 async mounted() {
     try {
      console.log("Joining quiz channel with join code:", this.$route.params.join_code);
            let res = await this.socketStore.joinChannel(`quiz:${this.$route.params.join_code}`, {name: this.$route.query.name, token: localStorage.getItem('token'), session_id: localStorage.getItem('session_id')});
          
            console.log("Joined quiz channel:", res);
        } catch (e) {
            console.log(e);
        }
        this.channel= this.socketStore.channel;

        this.channel.on('guest_joined', (data) => {
             sessionStorage.setItem('session_id', data.session_id);
              sessionStorage.setItem('name', data.name);
           
        });

      
  },
  methods: {
    async readyUp() {
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