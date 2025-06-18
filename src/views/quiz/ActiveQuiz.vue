<template>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 lg:mx-50">
    
    <QuizQuestions v-if="activeQuiz && activeQuiz.questions && activeQuiz.questions.data" class="lg:col-span-2" :questions=" this.activeQuiz.questions.data" @delete-question="deleteQuestion" @update-question="openUpdateDialog" @add-question="openAddDialog"/>
  
  <div class="bg-white shadow-md rounded-lg p-6">
      <div>
    <h2 class="text-xl font-semibold mb-4">Active Users</h2>
    <ul class="space-y-2">
      <li v-for="user in addedPlayers" :key="user.id" class="flex items-center justify-between">
         <span :class="isPlayerReady(user) ? 'text-green-600 font-bold' : 'text-gray-400'"> {{ user.name }}</span>
     

          <Button variant="destructive" size="icon" class="px-1 py-1 text-xs h-6 min-w-0"  @click="deleteQuestion(question.id)">
      <Trash2 class="size-4" />
    </Button>
      </li>
    </ul>
      </div>
    
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
import { toast } from 'vue-sonner'
import { useSocketStore } from '@/stores/socket';
import { Trash2 } from 'lucide-vue-next';






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
       Trash2,
        QuizQuestions
    },  
    setup() {
    const quizStore = useQuizStore();
      const socketStore = useSocketStore();
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
      openAddDialog,
      socketStore
    };
  },
  data() {
    return {
        questions: [],
        activeUsers: [],
        addedPlayers: [],
    };
  },



  async created() {
 
       if (!this.activeQuiz || !this.activeQuiz.questions.data) {
          await  this.getQuiz()}

         await this.fetchPlayers();

    },
    async mounted() {

           
            try {
            let res = await this.socketStore.joinChannel(`quiz:${this.$route.params.join_code}`, {token: localStorage.getItem('token')});
            console.log('Joined channel:', res);
           
            } catch (error) { 
        
            console.log(error);
        }


        // Initialize presence tracking
      

        
        this.socketStore.presence.onSync(() => {
            this.activeUsers = this.socketStore.presence.list((id, { metas: [firstMeta] }) => ({
                id,
                ...firstMeta,
            }));
            console.log('Active users:', this.activeUsers);
        });

        this.socketStore.presence.onJoin((id, currentPresence, newPresence) => {
            toast.success(`${newPresence.metas[0].user_name} joined the quiz!`, {
                description: `User ID: ${id}`,
                position: "bottom-right"
                
            });
            
        });
     
    },
   
  methods: {
   async fetchPlayers() {
  try {
    const resp = await this.socketStore.push('get_players', { quiz_id: this.activeQuiz.id });
    // If resp is an array, get the last element
    let players = resp;
      console.log('Response from get_players:', resp);
    if (Array.isArray(resp)) {
      players = resp[resp.length - 1]?.response?.players || [];
    } else if (resp?.players) {
      players = resp.players;
    }
    this.addedPlayers = players;
    console.log('Added players:', this.addedPlayers);
  } catch (error) {
    console.error('Error fetching players:', error);
  }

},
  isPlayerReady(addedPlayer) {
    // Find a matching active user by a unique property (e.g., session_id or user_id)
    const match = this.activeUsers.find(user => {
      // Compare by session_id or user_id as appropriate
      return user.id === addedPlayer.session_id || user.id === addedPlayer.user_id
      
    });
    // If found, check if any of their metas are ready
    return match ? match.ready : false;
  },



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
  },
  
  
}

};

</script>