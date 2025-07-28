import { defineStore } from 'pinia';
import quizApi from '@/api/Quiz.api';
import router from '@/router';



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
                
                
                questionData.quiz_id = this.activeQuiz.id; // Ensure the question is linked to the active quiz
                
               const response = await quizApi.createQuestion(questionData);
                const newQuestion = response.data;
                this.activeQuiz.questions.data.push(newQuestion);
               
                // Simulate an API call to create a new question
             
                
                
               
            } catch (error) {
                
                throw error; // Re-throw the error for further handling if needed
            }
        },
        async createQuiz(quizData ,parameters) {
        try {
            // Simulate an API call to create a new quiz
          const response = await quizApi.createQuiz(quizData);
            const newQuiz = response.data;
            this.quizzes.push(newQuiz);
            this.activeQuiz = newQuiz; 
            const questions = await quizApi.generateQuestions(newQuiz.data.id, {
            topic: parameters.topic, // Example topic
            number: parameters.questions, // Example number of questions
            difficulty: parameters.difficulty, // Example difficulty
            description: parameters.context // Example context
          });
            newQuiz.questions = questions.data; // Assuming the response contains the questions
             router.push("/quiz/active/" +newQuiz.data.join_code);

            return newQuiz; 
        } catch (error) {
        
            throw error; 
        }
        },
        async joinQuiz(joinCode) {
        try {
            // Simulate an API call to join a quiz
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
                // Send the updated question to the API
                const response = await quizApi.updateQuestion(updatedQuestion.id, updatedQuestion);
                // Update the question in the active quiz
                const index = this.activeQuiz.questions.data.findIndex(q => q.id === updatedQuestion.id);
                if (index !== -1) {
                    // Use the response from the API if you want to trust the backend,
                    // or just update with your local updatedQuestion object
                    this.activeQuiz.questions.data[index] = response.data.data;
                }
            } catch (error) {
              
                throw error;
            }
            
},   
    async quizEnd(channel, callback) {
        channel.on('quiz_ended', (response) => {
           callback(response);
           
        });
    }

    }});


