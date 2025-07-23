<template>
  <div class="flex lg:min-h-screen items-center justify-center bg-background lg:mt-0 lg:mb-0 mb-3">  ">
    <Pagination v-slot="{ page }" :items-per-page="itemsPerPage" :total="quizzes.length" :default-page="1" class="w-full">
      <PaginationContent v-slot="{ items }">
        <div class="w-full">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6 min-h-[70vh] items-start">
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
                <p class="text-sm text-gray-500">{{dateAndTime(quiz.inserted_at) }}</p>
                </CardTitle>
              </CardHeader>
              <CardContent class="flex flex-col">
                <p
                  class="mb-4 text-sm md:text-base lg:text-lg text-gray-600 flex-1 break-words truncate"
                  style="word-break: break-word; overflow-wrap: break-word; max-height: 6em;"
                  :title="quiz.description"
                >
                  {{ quiz.description }}
                
                </p>

                <p class="text-sm  mb-2">
                    {{ quiz.current_question_id ? ' On going' : 'Not started' }}
                </p>
                <div class="text-sm text-gray-400 mb-4 break-words" style="word-break: break-word;">
                  Join code: {{ quiz.join_code }}
                </div>
                <Button @click="redirectToOrgView(quiz)"  variant="outline"class="  text-lg mt-auto break-words">
                  View Quiz
                </Button>
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
  </div>
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
import { Button } from '@/components/ui/button';
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
    Button
  },

  computed:{
    dateAndTime() {
      // Returns a function to parse ISO date strings like "2025-07-03T18:12:23Z"
      return (quiz_date) => {
        if (!quiz_date) return '';
        const date = new Date(quiz_date);
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
      };
    }
  },
  methods: {
    paginatedQuizzes(page) {
      const start = (page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.quizzes.slice(start, end);
    },
    redirectToOrgView(quiz) {
     if (quiz.current_question_id ) {
        this.$router.push({ name: 'OrgQuestionView', params: { join_code: quiz.join_code } });
      } else {
        this.$router.push({ name: 'ActiveQuiz', params: { join_code: quiz.join_code } });
      }
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