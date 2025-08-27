<template>
  <div class="flex flex-col items-center  bg-white">
    <div class="card w-full max-w-lg p-8 rounded-2xl shadow-lg flex flex-col items-center">
    
      <div class="flex items-center justify-center w-20 h-20 rounded-full bg-primary mb-6 shadow">
        <Sparkles class="h-10 w-10 text-primary-foreground" />
      </div>
  
      <h1 class="text-3xl font-bold text-foreground mb-3 text-center">
        Welcome to Quizaar!
      </h1>
  
      <p class="text-base text-muted-foreground mb-7 text-center">
        Instantly generate fun and challenging quizzes powered by AI.<br>
        Perfect for learning, teaching, or just having fun!
      </p>

      <router-link
        to="/quiz"
        class="btn btn-primary w-full sm:w-auto px-8 py-3 font-semibold rounded-lg shadow hover:scale-105 transition-transform duration-150"
      >
        Generate Your First Quiz
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { Sparkles } from 'lucide-vue-next'
</script>