import { defineStore } from 'pinia';
import quizApi from '@/api/Quiz.api';
import router from '@/router';
import { toast } from 'vue-sonner';


export const useQuizStore = defineStore('quiz', {
    state: () => {
        return {
        quizzes: [],
        activeQuiz: null,
        }
    },
    actions: {
        async createQuestion(questionData) {
            try {
                
                
                questionData.quiz_id = this.activeQuiz.id; 
                
               const response = await quizApi.createQuestion(questionData);
                const newQuestion = response.data;
                this.activeQuiz.questions.data.push(newQuestion);
               
            
             
                
                
               
            } catch (error) {
                
                throw error; 
            }
        },
        async createQuiz(quizData ,parameters) {
        try {
           
          const response = await quizApi.createQuiz(quizData);
            const newQuiz = response.data;
            this.quizzes.push(newQuiz);
            this.activeQuiz = newQuiz; 
            const questions = await quizApi.generateQuestions(newQuiz.data.id, {
            topic: parameters.topic, 
            number: parameters.questions, 
            difficulty: parameters.difficulty, 
            description: parameters.context 
          });
            newQuiz.questions = questions.data; 
             router.push("/quiz/active/" +newQuiz.data.join_code);

            return newQuiz; 
        } catch (error) {
        
            throw error; 
        }
        },
        async joinQuiz(joinCode) {
        try {
          
            const response = await fetch(`/api/quizzes/join/${joinCode}`);
            this.activeQuiz = await response.json();
        } catch (error) {
            throw error;
        }
        },
        async fetchQuiz(joinCode) {
            try {
                const res = await quizApi.getQuiz(joinCode);
             
                this.activeQuiz = res.data.quiz;
                this.activeQuiz.questions = res.data.questions;
               
                return res
            } catch (error) {
                    throw error;
            }
        },

        async deleteQuestion(question_id) {
            try {
                const response = await quizApi.deleteQuestion(question_id);
              
                this.activeQuiz.questions.data = this.activeQuiz.questions.data.filter(q => q.id !== question_id);
              
            } catch (error) {
              
                throw error;
            }
        },
      async updateQuestion(updatedQuestion) {
            try {
                
                const response = await quizApi.updateQuestion(updatedQuestion.id, updatedQuestion);
              
                const index = this.activeQuiz.questions.data.findIndex(q => q.id === updatedQuestion.id);
                if (index !== -1) {
                    
                    this.activeQuiz.questions.data[index] = response.data.data;
                }
            } catch (error) {
              
                throw error;
            }
            
},   
    async quizEnd(channel, callback) {
        channel.on('quiz_ended', (response) => {
            
            this.activeQuiz = null; 
            toast.success("Quiz has ended!"); 
           callback(response);
           
        });
    }

    }});


