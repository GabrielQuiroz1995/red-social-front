import { Global } from "./Global";

export const GetProfile = async (userId, setProfile)=>{
    const request = await fetch(Global.url+"users/profile/"+userId,{
      method:"GET",
      headers:{
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token"),
      }
    })

    const data = await request.json();

    if(data.status == "success"){
      setProfile(data.user);
    }

    return data;

  }