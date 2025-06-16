import {Service} from '@/api/axiosService.js';
    const token = localStorage.getItem("token");
const quizApi = {


  async createQuiz(quizData) {
    try {
      let response = await Service.post('/quizzes/create', quizData, {
      headers: { Authorization: `Bearer ${token}` },
    });
      return response;
    } catch (error) {
      console.error("Error creating quiz:", error);
      throw error;
    }
    

},
async generateQuestions(quiz_id, params){
    try {
        let response = await Service.post(`/quizzes/${quiz_id}/generate_questions`, params, {
        headers: { Authorization: `Bearer ${token}` },
        });
        return response;
    } catch (error) {
        console.error("Error generating questions:", error);
        throw error;
    }
},
async getQuestions(quiz_id) {
    try {
      let response = await Service.get(`/quizzes/${quiz_id}/questions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (error) {
      console.error("Error fetching questions:", error);
      throw error;
    }
  },

  async getQuiz(joinCode) {
    try {
      let response = await Service.get(`/quizzes/${joinCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Quiz data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching questions:", error);
      throw error;
    }
  },
  async deleteQuestion( question_id) {
    try {
      let response = await Service.delete(`/questions/${question_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (error) {
      console.error("Error deleting question:", error);
      throw error;
    }
  },
  async updateQuestion(question_id, questionData) {
    try {
      let response = await Service.patch(`/questions/${question_id}`, {question: {...questionData}}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (error) {
      console.error("Error updating question:", error);
      throw error;
    }
  },
  async createQuestion(questionData) {
    try {
      let response = await Service.post('/questions/create', {question: {...questionData}}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (error) {
      console.error("Error creating question:", error);
      throw error;
    }
  }
}
export default quizApi;