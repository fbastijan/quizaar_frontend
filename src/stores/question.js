import { defineStore } from 'pinia';
import {toast} from 'vue-sonner';

import { useRoute } from 'vue-router'

const route = useRoute()
export const useQuestionStore = defineStore('question', {
  state: () => {
    return {
      currentQuestion: null,
        timeLeft: 0, 
    };
  },
  actions: {
   async getCurrentQuestion(channel) {
       await channel.push('get_current_question', {})
        .receive('ok', (response) => {
          this.currentQuestion = response.question.data;
          this.timeLeft = response.time_left || 0;
          
        })
        .receive('error', (error) => {
          toast.error('Failed to fetch current question', {
            description: error.message || 'An error occurred while fetching the current question.',
            duration: 2000,
          });
        });
      
    },
    async ActiveQuestion(channel) { 
      await channel.on('active_question' , (response) => {
          this.currentQuestion = response.question.data;
          this.timeLeft = response.time_left || 0;
        
        });
      

    },

    async ServeQuestion(channel) {
      await channel.push('serve_question')
        .receive('ok', (response) => {
          this.currentQuestion = response.question.data;
          this.timeLeft = response.time_left || 0;
         
        })
        .receive('error', (error) => {
          return error
        
        });
    },

    
   async QuestionServed(channel, onServed) {
  channel.on('question_served', (response) => {
    this.currentQuestion = response.question.data;
    this.timeLeft = response.time_left || 0;
    if (onServed) onServed();
  });

 
    
   },  
   },
  

   
        

});