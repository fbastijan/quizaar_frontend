import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import QuizView from '@/views/QuizView.vue'
import RegisterView from './views/authorization/RegisterView.vue'
import LoginView from './views/authorization/LoginView.vue'
import NewQuiz from './views/quiz/NewQuiz.vue'
import ActiveQuiz from './views/quiz/ActiveQuiz.vue'
import JoinQuiz from './views/quiz/JoinQuiz.vue'
import Lobby from './views/quiz/QuizLobby.vue'
import QuestionView from './views/quiz/PlayerQuestionView.vue'
import OrgQuestionView from './views/quiz/OrgQuestionView.vue'
import FinalResultView from './views/quiz/FinalResultView.vue'
const routes = [
  { path: '/', component: HomeView },
    { path: '/about', component: AboutView },
    { path: '/quiz', component: QuizView },
    {path: '/register', component: RegisterView }, // Redirect any unmatched routes to home
     {path: '/login', component: LoginView },
     {path: '/quiz/new', component: NewQuiz }, // Redirect any unmatched routes to home
      {path: '/quiz/active/:join_code', component: ActiveQuiz }, // Redirect any unmatched routes to home
      {path: '/quiz/join' ,component: JoinQuiz },
      {path: "/quiz/lobby/:join_code", component: Lobby }, // Redirect any unmatched routes to home
      {path: "/quiz/:join_code/current_question", component: QuestionView },
      {path: "/quiz/:join_code/org/current_question", component: OrgQuestionView },
      {path: "/quiz/:join_code/results", component: FinalResultView }, // Redirect any unmatched routes to home
      
]

const router = createRouter({
   history: createWebHistory(),
  routes,
})

import { toast } from 'vue-sonner'

router.beforeEach((to, from, next) => {
  const javneStranice = [
    /^\/login$/,
    /^\/register$/,
    /^\/quiz\/join$/,
    /^\/quiz\/lobby(\/[^/]+)?$/, // matches /quiz/lobby and /quiz/lobby/:join_code
    /^\/quiz\/[^/]+\/current_question$/,
    /^\/quiz\/[^/]+\/results$/,
  ];

  const isJavnaStranica = (path) =>
    javneStranice.some(pattern => pattern.test(path));

  const loginPotreban = !isJavnaStranica(to.path);
  const user = localStorage.getItem("token");

  if (loginPotreban && !user) {
    toast.error('You are not authorized!', {
      description: 'Please log in to continue.',
      duration: 2000,
    });
    next("/login");
    return;
  }

  next();
});
export default router