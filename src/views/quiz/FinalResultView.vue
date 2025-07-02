<template>

<StatsTable :results="results" />


</template>
<script>

import { useSocketStore } from '@/stores/socket';
import { useScoreStore } from '@/stores/score';
import StatsTable from '@/components/StatsTable.vue';
export default {
  name: "FinalResultView",
    components: {
        StatsTable},

  setup() {
    const socketStore = useSocketStore();
    const scoreStore = useScoreStore();
    return {
        socketStore,
        scoreStore
    };
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

  this.scoreStore.trackResults(channel);

  },


computed: {
    results() {
      return this.scoreStore.PlayerScores;
    }

  },

  methods: {
    closeQuiz() {
      this.socketStore.channel.push('close_quiz', { join_code: this.$route.params.join_code });
      this.$router.push({ name: 'QuizLobby', params: { join_code: this.$route.params.join_code } });
    }
  }

};

</script>