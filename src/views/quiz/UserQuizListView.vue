<template>
  <Pagination v-slot="{ page }" :items-per-page="itemsPerPage" :total="quizzes.length" :default-page="1">
    <PaginationContent v-slot="{ items }">
      <div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6 min-h-[70vh]">
          <Card
            v-for="quiz in paginatedQuizzes(page)"
            :key="quiz.id"
            class="flex flex-col justify-between mx-auto lg:w-100 w-100 overflow-hidden"
          >
            <CardHeader>
              <CardTitle
                class="text-xl md:text-2xl lg:text-3xl mb-2 break-words"
                style="word-break: break-word; overflow-wrap: break-word;"
                :title="quiz.title"
              >
                {{ quiz.title }}
              </CardTitle>
            </CardHeader>
            <CardContent class="flex flex-col flex-1">
              <p
                class="mb-4 text-sm md:text-base lg:text-lg text-gray-600 flex-1 break-words truncate"
                style="word-break: break-word; overflow-wrap: break-word; max-height: 6em;"
                :title="quiz.description"
              >
                {{ quiz.description }}
              </p>
              <div class="text-sm text-gray-400 mb-4 break-words" style="word-break: break-word;">
                Join code: {{ quiz.join_code }}
              </div>
              <router-link :to="`/quiz/${quiz.join_code}`" class="text-blue-600 hover:underline text-lg mt-auto break-words">
                View Quiz
              </router-link>
            </CardContent>
          </Card>
        </div>
        <div class="flex justify-center mt-8">
          <PaginationPrevious />
          <template v-for="(item, index) in items" :key="index">
            <PaginationItem
              v-if="item.type === 'page'"
              :value="item.value"
              :is-active="item.value === page"
            >
              {{ item.value }}
            </PaginationItem>
          </template>
          <PaginationEllipsis :index="4" />
          <PaginationNext />
        </div>
      </div>
    </PaginationContent>
  </Pagination>
</template>
<script>
import quizApi from '@/api/Quiz.api';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default {
  name: 'UserQuizListView',
  data() {
    return {
      quizzes: [],
      loading: true,
      itemsPerPage: 6,
    };
  },
  components: {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
    Card,
    CardHeader,
    CardTitle,
    CardContent,
  },
  methods: {
    paginatedQuizzes(page) {
      const start = (page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.quizzes.slice(start, end);
    },
  },
  async created() {
    try {
      const response = await quizApi.getQizzessbyUser();
      console.log('Fetched quizzes:', response);
      this.quizzes = response.data || response;
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      this.loading = false;
    }
  },
};
</script>