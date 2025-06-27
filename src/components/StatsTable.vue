<template>
  <div class="shadcn-card rounded-lg border bg-background shadow p-4 min-h-160">
    <h2 class="text-lg font-semibold mb-4">Player Stats</h2>
    <div class="overflow-auto max-h-160">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Place</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(player, idx) in sortedResults" :key="player.id">
            <td class="px-4 py-2">{{ idx + 1 }}</td>
            <td class="px-4 py-2">{{ player.name }}</td>
            <td class="px-4 py-2">{{ player.score ?? '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="!results || results.length === 0" class="text-gray-500 mt-4">No stats available.</div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  results: {
    type: Array,
    required: true
  }
});
const sortedResults = computed(() =>
  [...props.results].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
);
</script>
