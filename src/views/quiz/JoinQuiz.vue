<template>
    <Card class="max-w-md mx-auto mt-8">
        <CardHeader>
            <CardTitle class="">Join a Quiz</CardTitle>
            <CardDescription class="mb-3">Enter your username and the join code to participate.</CardDescription>
        </CardHeader>
        <CardContent>
            <form @submit.prevent="joinQuiz" class="space-y-6">
                <div class="">
                    <Label class="mb-1 font-medium" for="username">Username</Label>
                    <Input id="username" v-model="username" required placeholder="Enter your username" />
                </div>
                <div>
                    <Label class="mb-1 font-medium" for="joinCode">Join Code</Label>
                    <Input id="joinCode" v-model="joinCode" required placeholder="Enter join code" />
                </div>
                <Button type="submit" class="w-full mt-8">Join Quiz</Button>
            </form>
        </CardContent>
    </Card>
</template>

<script>
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button' 
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default {
    name: 'JoinQuiz',
    components: {
        Input,
        Button,
        Card,
        CardHeader,
        CardTitle,
        CardDescription,
        CardContent,
        Label
    },
    data() {
        return {
            username: '',
            joinCode: ''
        }
    },
    methods: {
        joinQuiz() {
             this.$router.push({
            path: "/quiz/lobby/" + this.joinCode,
            query: { name: this.username }
        })
        }

        
    }
}
</script>
