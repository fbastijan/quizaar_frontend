<!-- filepath: src/components/UpdateQuestionDialog.vue -->
<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Question</DialogTitle>
      </DialogHeader>
      <div v-if="question">
        <Label class="block mb-2">Text</Label>
        <Input v-model="localQuestion.text" class="border rounded w-full mb-4" />
        <Label class="block mb-2">Options</Label>
        <Input
          v-for="(option, idx) in localQuestion.options"
          :key="idx"
          v-model="localQuestion.options[idx]"
          class="border rounded w-full mb-4"
          placeholder="Option"
        />
        <Label class="block mb-2">Answer</Label>
        <Input v-model="localQuestion.answer" class="border rounded w-full mb-4" />
      </div>
      <DialogFooter>
        <Button @click="save">Save</Button>
        <Button variant="outline" @click="close">Cancel</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, watch, toRefs } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const props = defineProps({
  modelValue: Boolean,
  question: Object
})
const emit = defineEmits(['update:modelValue', 'save'])
const open = ref(props.modelValue)
watch(() => props.modelValue, val => open.value = val)
watch(open, val => emit('update:modelValue', val))
const localQuestion = ref({ ...props.question })

watch(
  () => props.question,
  (newQ) => {
    localQuestion.value = { ...newQ }
  },
  { immediate: true }
)

function save() {
  emit('save', { ...localQuestion.value })
  emit('update:modelValue', false)
}
function close() {
  emit('update:modelValue', false)
}
</script>