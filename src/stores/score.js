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
           console.log("Player scores fetched:", response);
          });
        
        } catch (e) {
          console.error("Error fetching score:", e);
        }
      }
      , async trackResults(channel) {
      try {
        channel.push('players_stats', { })
          .receive('ok', (response) => {
            this.PlayerScores = response.players;
            console.log('Player stats received:', this.PlayerScores);
          })
          .receive('error', (error) => {
            console.error('Error receiving player stats:', error);
          });
      } catch (error) {
        console.error("Error getting player stats:", error);
      }
    },
        
    },

   

});