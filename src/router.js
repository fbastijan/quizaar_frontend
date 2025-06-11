import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import QuizView from '@/views/QuizView.vue'
import RegisterView from './views/authorization/RegisterView.vue'
import LoginView from './views/authorization/LoginView.vue'
import NewQuiz from './views/quiz/NewQuiz.vue'

const routes = [
  { path: '/', component: HomeView },
    { path: '/about', component: AboutView },
    { path: '/quiz', component: QuizView },
    {path: '/register', component: RegisterView }, // Redirect any unmatched routes to home
     {path: '/login', component: LoginView },
     {path: '/quiz/new', component: NewQuiz }, // Redirect any unmatched routes to home

]

const router = createRouter({
   history: createWebHistory(),
  routes,
})

import { toast } from 'vue-sonner'

 router.beforeEach((to, from, next) => {
  const javneStranice = ["/login", "/register"];
 
  const loginPotreban = !javneStranice.includes(to.path);
  const user = localStorage.getItem("token")
    
  
 

  if (loginPotreban && !user) {

    toast('You are not authorized!', {
      description: 'Please log in to continue.',
      duration: 2000,
    })
    next("/login");
    return;
  }
  
  next();
});
export default router