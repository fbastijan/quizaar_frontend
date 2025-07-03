<template>
  <div class="space-y-4">
    <div
      class="shadcn-card p-4 rounded-lg border bg-background shadow min-h-160"
      :class="answers && answers.length > 5 ? 'max-h-80 overflow-y-auto ': ''"
      
    >
      <h3 class="font-semibold text-lg mb-3">User Answers</h3>
      <ul class="divide-y divide-border">
        <li
          v-for="answer in answers"
          :key="answer.id"
          class="flex items-center justify-between py-2"
        >
          <div>
            <span class="font-medium text-foreground">{{ answer.player?.name || 'Unknown' }}</span>
            <span class="mx-2 text-muted-foreground">answered</span>
            <span class="text-foreground">{{ answer.text }}</span>
          </div>

           <Button variant="ghost" class="ms-auto" @click="fixAnswer(answer)"> <Pen></Pen></Button>
          <span
            :class="answer.is_correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
            class="px-2 py-1 rounded text-xs font-semibold"
          >
           
            {{ answer.is_correct ? 'Correct' : 'Incorrect' }}
          </span>
        </li>
      </ul>
      <div v-if="!answers || answers.length === 0" class="text-muted-foreground py-2">No answers yet.</div>
    </div>
  </div>
</template>

<script>
import { Pen } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
export default {

  name: 'UserAnswers',
  props: {
    answers: {
      type: Array,
      required: true
    }
  },

  components: {
    Pen,
    Button

  },
  methods: {
    fixAnswer(answer) {

      this.$emit('answer', answer);
      
    }
  }
};
</script>
