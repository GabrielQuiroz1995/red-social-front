import React,{useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { GetProfile } from "../../helpers/GetProfile";
import { Global } from "../../helpers/Global";
import { UserList } from "../user/UserList";

export const Followers = () => {
  
  
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [load, setLoad] = useState(true);
  const [profile, setProfile] = useState({});

  const params = useParams();

  useEffect(() => {
    getUsers(1);
    GetProfile(params.userId, setProfile)
  }, []);

  const getUsers = async (next=1) =>{

    const userId = params.userId;
    // peticion para sacar usuareio
    const request = await fetch(Global.url + 'follow/followers/'+ userId +"/"+ next,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token"),
      }
    });

    const data = await request.json();

    let cleanUsers = [];
    // recorrer y limpiar 
    data.follows.forEach(follow =>{
        cleanUsers = [...cleanUsers, follow.user]
    });
    data.users = cleanUsers

    // estados para listar
    if(data.users /*&& data.status=="following"*/){

      let newUsers = data.users
      if(users.length >= 1){
        newUsers = [...users, ...data.users]
      }

      setUsers(newUsers)
      setFollowing(data.seguidos)
      setLoad(false)

      // paginacion
      if(users.length >= (data.totalDeUsuarios - data.users.length)){
        setMore(false);
      }
    }

  }
  

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Seguidores de {profile.nick}</h1>
      </header>
        <UserList users ={users} 
                  getUsers={getUsers}
                  following={following}
                  setFollowing={setFollowing}
                  setPage ={setPage}
                  page={page}
                  more={more}
                  load={load}
                  />

    </>
  );
};
