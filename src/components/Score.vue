<template>
    <div class="flex flex-col items-center justify-center h-full">
   
   <h1 class="text-4xl font-bold "> Your Score: </h1>
    
  <span class="text-4xl font-bold text-green-600 flex items-center justify-center">
    {{ Math.round(displayedScore) }}
  </span>

   <h2 class="text-2xl font-bold "> You are currently: {{ placement }}. </h2>
  <div v-if ="higher.name  || lower.name " >


    <p class="text-lg  mt-2" v-if="higher.name">You are chasing: {{ higher.score }} {{ higher.name }}</p> 
    <p class="text-lg  mt-2" v-if="lower.name">You are chased by: {{ lower.score }} {{ lower.name }}</p> 
</div>
<div v-else ><p class="text-lg  mt-2" >You are all alone in this fight...</p> </div>
    </div>
</template>

<script>
export default {
  name: "Score",
  props: {

    higher: {
      type: Object,
      default: {score: null,
        name: null
      }, 
    },
    lower: {
      type: Object,
     default: {score: null,
        name:null
      },
    },
    oldScore: {
      type: Number,
      required: true,
    },
    newScore: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      default: 800, // ms
    },
    placement: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      displayedScore: this.oldScore,
      animationFrame: null,
    };
  },
  watch: {
    newScore:{
      immediate: true,
      handler(newVal) {
        this.animateScore(this.displayedScore, newVal);
      },
    },
  },
  methods: {
    animateScore(from, to) {
      if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
      if (from === to) {
        this.displayedScore = to;
        return;
      }
      const start = performance.now();
      const animate = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / this.duration, 1);
        this.displayedScore = from + (to - from) * progress;
        if (progress < 1) {
          this.animationFrame = requestAnimationFrame(animate);
        } else {
          this.displayedScore = to;
          this.animationFrame = null;
        }
      };
      this.animationFrame = requestAnimationFrame(animate);
    },
  },
  beforeUnmount() {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
  },
};
</script>