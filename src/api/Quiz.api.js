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
}
}
export default quizApi;