<template>  
  <div class="bg-white shadow-md rounded-lg p-6 lg:col-span-2">
    <h2 class="text-xl font-semibold mb-4">Questions</h2>
    <div
      v-for="(question, idx) in paginatedQuestions"
      :key="question.id"
      class="grid-rows border rounded py-2 mb-2"
    
    >
     <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mx-2">
 
  <div class="flex-1">
    <p class="text-sm font-semibold">Question: {{ question.text }}</p>
    <p class="text-xs text-gray-500">Options: {{ question.options.join(', ') }}</p>
    <p class="text-xs text-gray-500">Answer: {{ question.answer }}</p>
  </div>
  <div class="flex gap-2 mt-2 sm:mt-0 ml-auto">
    <Button variant="outline" size="icon" @click="updateQuestion(question)">
      <Pencil class="size-4" />
    </Button>
    <Button variant="destructive" size="icon" @click="deleteQuestion(question.id)">
      <Trash2 class="size-4" />
    </Button>
  </div>
</div>
    </div>
<div class="flex justify-between mt-4">
  <Button :disabled="current_page === 1" @click="previousPage">Previous</Button>
  <span>Page {{ current_page }} of {{ totalPages }}</span>
  <Button :disabled="!isThereNextPage" @click="nextPage">Next</Button>
</div>
  </div>
</template>

<script>
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-vue-next'    

export default {
  name: 'QuizQuestions',
  components: {
    Button,
    Pencil,
    Trash2,
    
  },

    props: {
        questions: {
        type: Array,
        default: () => []
        }
    },
  data() {
    return {
   
      current_page: 1,

    };
  },
  methods: {
    nextPage() {
      
        if (this.isThereNextPage) {
            this.current_page++;
            
        } else {
            return
        }
    },
    previousPage() {
        if (this.current_page > 1) {
            this.current_page--;
          
        } else {
            return
        }
    },
    deleteQuestion(questionId) {
      this.$emit('delete-question', questionId);

    },
    updateQuestion(question) {
      this.$emit('update-question', question, "update");
    
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.questions.length / 5); // Assuming 10 questions per page
    },
    isThereNextPage() {
      return this.current_page < this.totalPages;
    },
      paginatedQuestions() {
    const start = (this.current_page - 1) * 5;
    return this.questions.slice(start, start + 5);
  }
  }
}


</script>