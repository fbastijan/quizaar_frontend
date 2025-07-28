import { defineStore } from 'pinia';
import auth from '@/api/account.api';






export const useAccountStore = defineStore('account', {
  state: () => {
    return { accountData: null, 
      userData: null,
    }
  },
 
  actions: {
    async registerAccount(full_name, email, password) {
      let userDetail = {
        full_name: full_name,
        email: email,
        hash_password: password
      };
      try {
        let user = await auth.register(userDetail);
        this.accountData =  {email: user.email,
        id: user.id,
        token: user.token,
      };
        
        return user;
      } catch (error) {
      
        throw error; 
      }
    },
    async updateAccountProfile(profileData, password) {
      try {
        profileData = {
          ...profileData,
         id: this.accountData.id
        }

        let user = await auth.updateAccount(profileData, password); 

        
          this.accountData = {
          email: user.email,
          id: user.id,
          token: localStorage.getItem("token"),
          }
        return user;
      } catch (error) {
        
        throw error; 
      }
    },
    async loginAccount(email, password) {
      try {
        let user = await auth.login(email, password);
       
        this.accountData =  {
  
          email: user.data.email,
          id: user.data.id,
          token: user.data.token,
        };
        localStorage.setItem("token", user.data.token);
        
        return user;
      } catch (error) {
      
        throw error;
      }
    },

    logOut() {
      auth.logOut();
      this.accountData = null;
     
    },
   async getCurrentUser() {
    try {
     let user = await auth.getUser()

      this.accountData = {email: user.email,
        id: user.id,
        token: localStorage.getItem("token"),

      };
      this.userData = user.user;
      return this.userData;
    } catch (error) {
      this.logOut();

      return null; 

    }},
    async updateUserProfile(profileData) {
      try {
        let user = await auth.updateUser(profileData, this.userData.id);
        this.userData =user.data

        return user;
      } catch (error) {
     
        throw error;
      }
    },
    
   
},

})