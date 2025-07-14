<template>
  <div class="mb-6 flex flex-col md:flex-col items-center justify-between gap-4 px-3">
    <div class="text-2xl font-bold">
      <Skeleton v-if="loadingQuiz" class="h-8 w-48" />
      <template v-else>
        {{ activeQuiz?.title || 'Quiz' }}
      </template>
    </div>
    <div class="flex items-center gap-2">
      <span class="font-mono text-lg px-3 py-1 rounded">
        <Skeleton v-if="loadingQuiz" class="h-6 w-32" />
        <template v-else>
          Code: {{ $route.params.join_code }}
        </template>
      </span>
      <Button size="icon" variant="ghost" @click="copyJoinCode" title="Copy join code" :disabled="loadingQuiz">
        <Copy class="size-4" />
      </Button>
    </div>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 lg:mx-50">
    <template v-if="loadingQuiz">
      <div class="lg:col-span-2 flex flex-col gap-4">
        <Skeleton class="h-10 w-full mb-2" />
        <Skeleton class="h-32 w-full mb-2" />
        <Skeleton class="h-32 w-full mb-2" />
      </div>
    </template>
    <QuizQuestions
      v-else-if="activeQuiz && activeQuiz.questions && activeQuiz.questions.data"
      class="lg:col-span-2"
      :questions="activeQuiz.questions.data"
      @delete-question="deleteQuestion"
      @update-question="openUpdateDialog"
      @add-question="openAddDialog"
    />

    <div class="bg-white shadow-md rounded-lg p-6">
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold mb-4">Active Users</h2>
          <span class="text-sm text-gray-500 mb-2">
            <Skeleton v-if="loadingPlayers" class="h-5 w-20" />
            <template v-else>
              Users ready: {{ countReadyUsers }}/{{ addedPlayers.length }}
            </template>
          </span>
        </div>
        <ul class="space-y-2">
          <template v-if="loadingPlayers">
            <li v-for="n in 4" :key="n" class="flex items-center justify-between">
              <Skeleton class="h-6 w-32" />
              <Skeleton class="h-6 w-8" />
            </li>
          </template>
          <template v-else>
            <li v-for="user in addedPlayers" :key="user.id" class="flex items-center justify-between">
              <span :class="isPlayerReady(user) ? 'text-green-600 font-bold' : 'text-gray-400'">
                {{ user.name }}
              </span>
              <Button variant="destructive" size="icon" class="px-1 py-1 text-xs h-6 min-w-0" @click="deletePlayer(user.id)">
                <Trash2 class="size-4" />
              </Button>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <div class="mt-6 flex justify-end col-span-3">
      <Button class="px-6" @click="startQuiz" :disabled="!canStartQuiz || loadingQuiz || loadingPlayers">Start Quiz</Button>
    </div>
    <UpdateQuestionDialog
      v-model="showDialog"
      :question="selectedQuestion"
      @save="saveQuestion"
    />
  </div>
</template>

<script>
import QuizQuestions from '@/components/QuizQuestions.vue';
import { ref } from 'vue'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import UpdateQuestionDialog from '@/components/QuestionDialog.vue'
import { useQuizStore } from '@/stores/quiz'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'vue-sonner'
import { useSocketStore } from '@/stores/socket';
import { Trash2 } from 'lucide-vue-next';
import { Copy } from 'lucide-vue-next';
import { Skeleton } from '@/components/ui/skeleton';

export default {
  name: 'ActiveQuiz',
  components: {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
    Button,
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    Input,
    Label,
    UpdateQuestionDialog,
    Trash2,
    QuizQuestions,
    Copy,
    Skeleton
  },
  setup() {
    const quizStore = useQuizStore();
    const socketStore = useSocketStore();
    const showDialog = ref(false)
    const selectedQuestion = ref(null)

    function openAddDialog() {
      selectedQuestion.value = { text: '', options: ['', '', '', ''], answer: '' }
      showDialog.value = true
    }
    function openUpdateDialog(question) {
      selectedQuestion.value = { ...question }

      showDialog.value = true
    }
    function closeDialog() {
      showDialog.value = false
      selectedQuestion.value = null
    }
    async function saveQuestion(question) {
      if (!question.id) {

        await quizStore.createQuestion(question)
      } else {

        await quizStore.updateQuestion(question)
      }
      closeDialog()

    }

    return {
      quizStore,
      showDialog,
      selectedQuestion,
      openUpdateDialog,
      closeDialog,
      saveQuestion,
      openAddDialog,
      socketStore
    };
  },
  data() {
    return {
      questions: [],
      activeUsers: [],
      addedPlayers: [],
      loadingQuiz: true,
      loadingPlayers: true,
    };
  },

  async created() {


    },
    async mounted() {

      try {
        let res = await this.socketStore.joinChannel(`quiz:${this.$route.params.join_code}`, { token: localStorage.getItem('token') });
        console.log('Joined channel:', res);

      } catch (error) {

        console.log(error);
      }

      await this.getQuiz();
      this.loadingQuiz = false;

      await this.fetchPlayers();
      this.loadingPlayers = false;

      this.socketStore.presence.onSync(() => {
        this.activeUsers = this.socketStore.presence.list((id, { metas: [firstMeta] }) => ({
          id,
          ...firstMeta,
        }));
        console.log('Active users:', this.activeUsers);
      });

      this.socketStore.presence.onJoin((id, currentPresence, newPresence) => {
        if (currentPresence && Object.keys(currentPresence).length > 0 && newPresence.metas[0].ready) {

          toast.success("Heads up!", {
            description: `${currentPresence.metas[0].user_name} is ready`,
            position: "bottom-right"
          });

        } else {

          toast.success(`Heads up!`, {
            description: `${newPresence.metas[0].user_name} joined the quiz!`,
            position: "bottom-right"

          });
        }
      });

      this.socketStore.channel.on("player_created", (payload) => {
        console.log('Player created:', payload);
        this.addedPlayers.push(payload.player);

      });
    },

  methods: {
    async startQuiz() {
      if (this.canStartQuiz) {
        try {
          this.socketStore.channel.push('quiz_start', { quiz_id: this.activeQuiz.id })
            .receive('ok', (response) => {
              console.log('Quiz started successfully:', response);
              this.$router.push(`/quiz/${this.activeQuiz.join_code}/org/current_question`);


            })
            .receive('error', (error) => {
              console.error('Error starting quiz:', error);
              toast.error("Error starting quiz: " + error.message, {
                position: "bottom-right"
              });
            });
        } catch (error) {
          console.error('Error pushing start_quiz:', error);
          toast.error("Error starting quiz: " + error.message, {
            position: "bottom-right"
          });
        }
      } else {
        toast.error("Cannot start quiz. Ensure all players are ready.", {
          position: "bottom-right"
        });
      }
    },
    async fetchPlayers() {
      try {
        const resp = await this.socketStore.push('get_players', { quiz_id: this.activeQuiz.id });

        let players = resp;
        console.log('Response from get_players:', resp);
        if (Array.isArray(resp)) {
          players = resp[resp.length - 1]?.response?.players || [];
        } else if (resp?.players) {
          players = resp.players;
        }
        this.addedPlayers = players;
        console.log('Added players:', this.addedPlayers);
      } catch (error) {
        console.error('Error fetching players:', error);
      }

    },


    isPlayerReady(addedPlayer) {

      const match = this.activeUsers.find(user => {

        return user.id === addedPlayer.session_id || user.id === addedPlayer.user_id

      });

      return match ? match.ready : false;
    },

    async deletePlayer(playerId) {
      try {
        let res = await this.socketStore.push('delete_player', { player_id: playerId });
        console.log('Response from delete_player:', res);
        this.addedPlayers = this.addedPlayers.filter(player => player.id !== playerId);
        this.activeUsers = this.activeUsers.filter(user => user.id !== playerId);
      } catch (error) {
        console.error('Error deleting player:', error);
      }
    },

    async getQuiz() {
      let res = await this.quizStore.fetchQuiz(this.$route.params.join_code);
      console.log('Quiz fetched:', res);

    },
    deleteQuestion(questionId) {
      this.quizStore.deleteQuestion(questionId)
        .then(() => {
          console.log(`Question with ID ${questionId} deleted`);
          this.getQuiz();
        })
        .catch((error) => {
          console.error('Error deleting question:', error);
        });
    },
    updateQuestion(question) {
      this.quizStore.updateQuestion(question)
        .then(() => {
          console.log(`Question with ID ${question.id} updated`);
          this.getQuiz();
        })
        .catch((error) => {
          console.error('Error updating question:', error);
        });
    },
    copyJoinCode() {
      const code = this.$route.params.join_code;
      navigator.clipboard.writeText(code);
      toast.success("Join code copied to clipboard!", {
        position: "top-center",
        duration: 1000
      });
    }

  },
  computed: {
    activeQuiz() {
      return this.quizStore.activeQuiz
    },
    countReadyUsers() {
      return this.activeUsers.filter(user => user.ready).length;
    },
    canStartQuiz() {

      return this.addedPlayers.length > 0 && this.countReadyUsers === this.addedPlayers.length;

    },


  }

};
</script>