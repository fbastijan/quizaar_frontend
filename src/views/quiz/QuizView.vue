<template>
    <div class="flex gap-6 justify-center mt-12">
        <!-- Join Quiz Card -->
        <Card class="w-[28rem]">
            <CardHeader>
                <CardTitle>Join Quiz</CardTitle>
            </CardHeader>
            <CardContent>
                <p class="mb-6 text-gray-500 text-center">Enter a code to join an existing quiz.</p>
                <div class="flex flex-col gap-4 px-20">
                    <Input placeholder="Join Code" v-model="join_code" />
                    <Input placeholder="Your Name" v-model="name"  :disabled="token"/>
                </div>
            </CardContent>
            <CardFooter class="flex justify-end">
                <Button @click="goToLobby" >Join<ChevronRight class="size-4"/></Button>
            </CardFooter>
        </Card>
        <!-- Create Quiz Card -->
        <Card class="w-[28rem]">
            <CardHeader>
                <CardTitle>Create a New Quiz</CardTitle>
            </CardHeader>
            <CardContent class=" h-full">
                <p class="mb-6 text-gray-500 text-center">Start a new quiz and invite others to join.</p>
            </CardContent>
            <CardFooter class="flex justify-end">
                <Button @click="goToCreateQuiz">Create  <ChevronRight></ChevronRight></Button>
            </CardFooter>
        </Card>
    </div>
</template>

<script >
// Import shadcn components
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