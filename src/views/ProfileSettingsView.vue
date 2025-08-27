<template>
    <div class="mx-auto">
    <Card class="max-w-4xl mt-12 mx-auto">
       <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
            <p class="text-gray-500">Manage your profile settings and preferences.</p>
       
        
    
    <Tabs class=" mt-12 " defaultValue="account">  
        <TabsList class="grid w-full grid-cols-2" >
            <TabsTrigger value="account"  class="w-full">Account</TabsTrigger>
            <TabsTrigger value="user" class="w-full">User</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <h3 class="text-md font-semibold mb-4">Change password</h3>
                    <Input type="password" placeholder="New Password" class="mb-4 w-50 " v-model="new_password"/>
                    <Input type="password" placeholder="Confirm New Password" class="mb-4 w-50" v-model="confirm_password"/>
                   <ConfirmWithPassword @confirm="updatePassword"> <Button class="">Update Password</Button></ConfirmWithPassword> 

                    <h3 class="text-md font-semibold mt-6 mb-4">Email Settings</h3>
                    <Input type="email" placeholder="New Email" class="mb-4 w-100" v-model="new_email" />
                     <ConfirmWithPassword @confirm="updateEmail" ><Button class="" >Update Email</Button> </ConfirmWithPassword>
                    
                   


                </CardContent>
                <CardFooter>
                 
                </CardFooter>
            </Card>
        </TabsContent>

        <TabsContent value="user">
            <Card>
                <CardHeader>
                    <CardTitle>User</CardTitle>
                </CardHeader>


                <CardContent>
                    <h3 class="text-md font-semibold mb-4">Username</h3>
                    <Input type="text" placeholder="New Username" class="mb-4 w-full" v-model="username"/>
                    <Button class=""  @click="updateUsername">Update Username</Button>

                    <h3 class="text-md font-semibold mt-6 mb-4">Update Bio</h3>
                    <Textarea placeholder="Write a short bio about yourself" class="mb-4 w-full h-24 resize-none "  v-model="bio"/>
                    <Button class="" @click="updateBio" >Update Bio</Button>
                </CardContent>
                <CardFooter>
           
                </CardFooter>
            </Card>
        </TabsContent>

    </Tabs>
    </CardContent>
    </Card>
</div>
</template>
<script>
import { Card, CardHeader, CardTitle, CardFooter, CardContent,  } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import ConfirmWithPassword from '@/components/ConfirmWithPassword.vue';
import { 
    TabsContent,
    TabsList, 
    TabsTrigger,
    Tabs 
}from '@/components/ui/tabs';
import { toast } from 'vue-sonner';
import { useAccountStore } from '@/stores/account';



    export default {
        components: {
            Card,
            CardHeader,
            CardTitle,
            CardFooter,
            Button,
            TabsContent,
            TabsList, 
            TabsTrigger,
            CardContent,
            Tabs,
            Input,
            Textarea,
            ConfirmWithPassword
        },
        setup() {
            const accountStore = useAccountStore();
            return { accountStore };
        },
        name: 'ProfileSettingsView',
        data() {
            return {
             
                new_password: '',
                confirm_password: '',
                new_email: '',
                username: '',
                bio: '',
               
            };
        },
       
        methods: {
         
           updatePassword(password) {
           
                if (this.new_password === this.confirm_password) {
                    this.accountStore.updateAccountProfile({ 
                        hash_password: this.new_password }, password)
                        .then(() => {
                            toast.success("Password updated successfully");
                            this.current_password = '';
                            this.new_password = '';
                            this.confirm_password = '';
                        })
                        .catch((error) => {
                            console.error("Error updating password:", error);
                            toast.error("Failed to update password");
                        });
                } else {
                   toast.error("Passwords do not match");
                }
            },
            updateEmail(password) {
               
                this.accountStore.updateAccountProfile({ email: this.new_email }, password)
                    .then(() => {
                        toast.success("Email updated successfully");
                        
                    })
                    .catch((error) => {
                        console.error("Error updating email:", error);
                        toast.error("Failed to update email");
                    });
            },
            updateUsername() {
              
                this.accountStore.updateUserProfile({ full_name: this.username })
                    .then(() => {
                        toast.success("Username updated successfully");
                    })
                    .catch((error) => {
                        console.error("Error updating username:", error);
                        toast.error("Failed to update username");
                    });
            },
            updateBio() {
               
                this.accountStore.updateUserProfile({ biography: this.bio })
                    .then(() => {
                        toast.success("Bio updated successfully");
                    })
                    .catch((error) => {
                        console.error("Error updating bio:", error);
                        toast.error("Failed to update bio");
                    });
            }


            
           
        },
      mounted() {
       this.accountStore.getCurrentUser().then(() => {
            console.log("Current user data:", this.accountStore.accountData);
            this.new_email = this.accountStore.accountData.email || '';
            this.username = this.accountStore.userData.full_name || '';
            this.bio = this.accountStore.userData.biography || '';
          }).catch((error) => {
            console.error("Error fetching current user data:", error);
          });
       

        }
    };


</script>