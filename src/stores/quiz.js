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
                console.log("Creating question with data:", this.activeQuiz);
                
                questionData.quiz_id = this.activeQuiz.id; // Ensure the question is linked to the active quiz
                
               const response = await quizApi.createQuestion(questionData);
                const newQuestion = response.data;
                this.activeQuiz.questions.data.push(newQuestion);
                console.log("New question created:", newQuestion);
                // Simulate an API call to create a new question
             
                
                
               
            } catch (error) {
                console.error("Failed to create question:", error);
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
             router.push("/quiz/" +newQuiz.data.join_code);

            return newQuiz; 
        } catch (error) {
            console.error("Failed to create quiz:", error);
        }
        },
        async joinQuiz(joinCode) {
        try {
            // Simulate an API call to join a quiz
            const response = await fetch(`/api/quizzes/join/${joinCode}`);
            this.activeQuiz = await response.json();
        } catch (error) {
            console.error("Failed to join quiz:", error);
        }
        },
        async fetchQuiz(joinCode) {
            try {
                const res = await quizApi.getQuiz(joinCode);
             
                this.activeQuiz = res.data.quiz;
                this.activeQuiz.questions = res.data.questions;
                console.log("Fetched quiz:", this.activeQuiz);
                return res
            } catch (error) {
                console.error("Failed to fetch quiz:", error);
            }
        },

        async deleteQuestion(question_id) {
            try {
                const response = await quizApi.deleteQuestion(question_id);
                //console.log("Question deleted:", response);
                //console.log("Active quiz before deletion:", this.activeQuiz.questions);
                this.activeQuiz.questions.data = this.activeQuiz.questions.data.filter(q => q.id !== question_id);
              
            } catch (error) {
                console.error("Failed to delete question:", error);
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
                console.error("Failed to update question:", error);
            }
}

    },

    });


