<template>
    <div class="flex justify-center mt-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:mx-32 sm:mx-10 mx-2 max-w-3xl">
  
        <Card class="col-span-1 p-4 max-w-md mx-auto flex flex-col h-full">
            <CardHeader>
                <CardTitle class="text-xl">Join Quiz</CardTitle>
            </CardHeader>
            <CardContent>
                <p class="mb-4 text-gray-500 text-center text-sm">Enter a code to join an existing quiz.</p>
                <div class="flex flex-col gap-3 px-4">
                    <Input placeholder="Join Code" v-model="join_code" />
                    <Input placeholder="Your Name" v-model="name" :disabled="token"/>
                </div>
            </CardContent>
            <div class="flex-1"></div>
            <CardFooter class="flex justify-end">
                <Button @click="goToLobby" size="sm">Join<ChevronRight class="size-4"/></Button>
            </CardFooter>
        </Card>
    
        <Card class="col-span-1 p-4 max-w-md mx-auto flex flex-col h-full">
            <CardHeader>
                <CardTitle class="text-xl">Create a New Quiz</CardTitle>
            </CardHeader>
            <div class="flex flex-col flex-1 justify-center">
                <CardContent>
                    <p class="mb-4 text-gray-500 text-center text-sm">Start a new quiz and invite others to join.</p>
                    <div class="flex justify-center mt-2">
                      <a to="quiz/list/user" href="quiz/list/user" class="text-blue-600 underline text-xs hover:text-blue-800">
                        View My Quizzes
                      </a>
                    </div>
                </CardContent>
            </div>
            <CardFooter class="flex justify-end">
                <Button @click="goToCreateQuiz" size="sm">Create <ChevronRight class="size-4"/></Button>
            </CardFooter>
        </Card>
      </div>
    </div>
</template>

<script >

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronRight } from 'lucide-vue-next';
import router from '@/router';



export default {
    name: 'QuizView',
    components: {
        Card,
        CardHeader,
        CardTitle,
        CardContent,
        CardFooter,
        Button,
        Input,
        ChevronRight
    },
    data() {
        return {
            join_code: '',
            name: '',
            token: localStorage.getItem('token')
        };
    },
    methods: {
        goToCreateQuiz() {
            router.push({ name: 'NewQuiz' });
        },
        goToLobby() {
            router.push({ name: 'Lobby', params: { join_code: this.join_code}, query: { name: this.name } });
        }
    }

};
</script>