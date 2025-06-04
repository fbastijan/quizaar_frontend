<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

const count = ref(0)
</script>

<template>
    <div class="">
      <Button>CLICK ME SHAD</button>
  
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
<script>
import { Button } from "@/components/ui/button"
export default {
  components: {
    Button,
  },
}


</script>