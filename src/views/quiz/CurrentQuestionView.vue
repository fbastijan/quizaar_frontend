<template>
  
</template>

<script>
import { useQuizStore } from '@/stores/quiz';

export default {
  setup() {
    const quizStore = useQuizStore();
    const currentQuestion = quizStore.activeQuiz.currentQuestion;

    return {
      currentQuestion
    };
  }
};
</script>