<template>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 lg:mx-50">
    
    <QuizQuestions class="lg:col-span-2" :questions=" this.activeQuiz.questions.data" @delete-question="deleteQuestion" @update-question="openUpdateDialog"/>
    <Button class="mb-4" @click="openAddDialog()">Add Question</Button>
  <div class="bg-white shadow-md rounded-lg p-6">
    <h2 class="text-xl font-semibold mb-4">Quiz Settings</h2>
    <p class="text-gray-700 mb-4">Adjust your quiz settings.</p>
    <Button>Settings</Button>
  </div>
 <UpdateQuestionDialog
  v-model="showDialog"
  :question="selectedQuestion"
  @save="saveQuestion"
/>


</div>
</template>


<script >

import QuizQuestions from '@/components/QuizQuestions.vue';
import {ref} from 'vue'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import UpdateQuestionDialog from '@/components/QuestionDialog.vue'
import { useQuizStore } from '@/stores/quiz'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'





export default {


    
  name: 'ActiveQuiz',
    components: {
        ResizableHandle,
        ResizablePanel,
        ResizablePanelGroup,
        Button,
        Dialog,
        DialogTrigger,
        DialogContent,
        DialogHeader, 
        DialogTitle,
        DialogFooter,
        Input,
        Label,
       UpdateQuestionDialog,
       
        QuizQuestions
    },  
    setup() {
    const quizStore = useQuizStore();

     const showDialog = ref(false)
    const selectedQuestion = ref(null)

      function openAddDialog() {
        selectedQuestion.value = { text: '', options: ['', '', '', ''], answer: '' }
        showDialog.value = true
      }
      function openUpdateDialog(question) {
      selectedQuestion.value = { ...question } // clone to avoid mutating original
      
      showDialog.value = true
    }
    function closeDialog() {
      showDialog.value = false
      selectedQuestion.value = null
    }
      async function saveQuestion(question) {
            if (!question.id) {
              // Add new question
              await quizStore.createQuestion(question)
            } else {
              // Update existing question
              await quizStore.updateQuestion(question)
            }
            closeDialog()
         
    }
    return {
      quizStore,
      showDialog,
      selectedQuestion,
      openUpdateDialog,
      closeDialog,
      saveQuestion,
      openAddDialog
    };
  },
  data() {
    return {
        questions: [],
    };
  },



   async created() {
        // Fetch questions when the component is mounted
       console.log(this.activeQuiz);

       if (!this.activeQuiz || !this.activeQuiz.questions.data) {
          await  this.getQuiz()}
     
        // If you need to access the ID specifically
  
      
    },
   
  methods: {
   async getQuiz() {
     let res = await this.quizStore.fetchQuiz(this.$route.params.join_code);
     console.log('Quiz fetched:', res);

  },
  deleteQuestion(questionId) {
    this.quizStore.deleteQuestion(questionId)
      .then(() => {
        console.log(`Question with ID ${questionId} deleted`);
        this.getQuiz(); // Refresh the quiz after deletion
      })
      .catch((error) => {
        console.error('Error deleting question:', error);
      });
    },
  updateQuestion(question, ) {
    this.quizStore.updateQuestion(question)
      .then(() => {
        console.log(`Question with ID ${question.id} updated`);
        this.getQuiz(); // Refresh the quiz after update
      })
      .catch((error) => {
        console.error('Error updating question:', error);
      });
  }
   
},
  computed: {
  activeQuiz() {
    return this.quizStore.activeQuiz
  }
}
};

</script>