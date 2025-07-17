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
        console.error("Registration failed:", error);
        throw error; // Re-throw the error for further handling if needed
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
        console.error("Profile update failed:", error);
        throw error; 
      }
    },
    async loginAccount(email, password) {
      try {
        let user = await auth.login(email, password);

        this.accountData =  {
  
          email: user.email,
        id: user.id,
        token: user.token,
      };
      console.log("User logged in:", this.accountData);
        return user;
      } catch (error) {
        console.error("Login failed:", error);
        throw error; // Re-throw the error for further handling if needed
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
      return user;
    } catch (error) {
      this.logOut();

      return null; // Re-throw the error for further handling if needed

    }},
    async updateUserProfile(profileData) {
      try {
        let user = await auth.updateUser(profileData, this.userData.id);
        this.userData =user.data

        return user;
      } catch (error) {
        console.error("Profile update failed:", error);
        throw error; // Re-throw the error for further handling if needed
      }
    },
    
   
},

})