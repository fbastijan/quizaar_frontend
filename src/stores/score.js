import {defineStore} from 'pinia';


export const useScoreStore = defineStore('score', {
  state: () => {
    return {
      PlayerScores: [],
    currentPlayerScore: null,
    pastScore: null,
      isLoading: false,
        higherPlayerScore: null,
        lowerPlayerScore: null,
        placement: null,
    };
  },
    actions: {
         async getScore(channel) {
       
        try {
          await channel.push('player_stats', { }).receive('ok', (response) => {
            this.higherPlayerScore= response.higher_player;
            this.currentPlayerScore = response.player.score;
            this.placement = response.player.placement;
            this.lowerPlayerScore= response.lower_player;
           
          });
        
        } catch (e) {
          throw e;
        }
      }
      , async trackResults(channel) {
      try {
        channel.push('players_stats', { })
          .receive('ok', (response) => {
            this.PlayerScores = response.players;
          })
          .receive('error', (error) => {
           throw error;
          });
      } catch (error) {
        throw error;
      }
    },
        
    },

   

});