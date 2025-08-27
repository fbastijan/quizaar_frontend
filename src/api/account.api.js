import {Service} from "@/api/axiosService.js";


const auth ={

      async login(email, password) {
    let response = await Service.post("/accounts/sign_in",
      { email: email, hash_password: password }
    );

    return response;
  },


  async register(userDetail) {
    
    
  let res  = await Service.post("/accounts/create", {
      account:{
      email: userDetail.email,
      full_name: userDetail.full_name,
      hash_password: userDetail.hash_password,
 
    }
    });
    let user = res.data;
    localStorage.setItem("token", user.token);
    return user;
  },
    async logOut() {
        localStorage.removeItem("token");
       
    },
  async getUser() {
    let token = localStorage.getItem("token");
    if (!token) {
      return null; 
    }
    let response = await Service.get("/accounts/current", {

      headers: { Authorization: `Bearer ${token}` },
    });
  
    return response.data;
  },
  async updateAccount(profileData, password) {
    let token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User not authenticated");
    }
    let response = await Service.patch("/accounts/update", {account: profileData, current_hash: password}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  ,
  async updateUser(userData, user_id) {
    let token = localStorage.getItem("token");
    try {
      let response = await Service.patch('/users/update', {user: {...userData, id: user_id}}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (error) {
      
      throw error;
    }
  }

}

export default auth;