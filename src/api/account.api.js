import {Service} from "@/api/axiosService.js";


const auth ={

      async login(email, password) {
    let response = await Service.post("/accounts/sign_in",
      { email: email, hash_password: password }
    );
    let user = response.data;
    localStorage.setItem("token", user.token);
 
   

    return user;
  },


  async register(userDetail) {
    console.log("userDetail", userDetail); // Debugging line to check the email value
    
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
      return null; // or throw an error
    }
    let response = await Service.get("/accounts/current", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  async updateProfile(profileData, password) {
    let token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User not authenticated");
    }
    let response = await Service.patch("/accounts/update", {account: profileData, current_hash: password}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

}

export default auth;