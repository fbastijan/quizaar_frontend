export const useAccountStore = defineStore('account', {
  state: () => {
    return { accountData: null, }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    async register_account(full_name, email, password) {
 
    }
   
},
 async login_account(email, password) {
       
    }
})