<template>
  <div class="grid grid-rows-3 h-screen gap-4 p-4">
    <div class="flex flex-col gap-4 text-center items-center justify-center row-span-2 bg-gray-100 p-4">
      <Skeleton class="h-8 w-24 mb-2" />
      <Skeleton class="h-6 w-32 mb-4" />
      <Skeleton class="h-5 w-3/4" />
    </div>
    <div class="row-span-1">
      <ul class="grid grid-cols-2 gap-4 p-4 h-full">
        <li v-for="idx in 4" :key="idx">
          <Skeleton class="p-4 rounded-xl h-full w-full" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Skeleton } from '@/components/ui/skeleton';

export default {
  name: 'SkeletonCurrentQuestion',
  components: {
    Skeleton,
  },
};
</script>
