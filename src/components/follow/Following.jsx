import React,{useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { GetProfile } from "../../helpers/GetProfile";
import { Global } from "../../helpers/Global";
import { UserList } from "../user/UserList";

export const Following = () => {
  
  
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [load, setLoad] = useState(true);
  const [profile, setProfile] = useState({});

  const params = useParams();
  const token = localStorage.getItem("token");

  useEffect(() => {
    getUsers(1);
    GetProfile(params.userId, setProfile);
  }, []);

  const getUsers = async (next=1) =>{

    const userId = params.userId;
    // peticion para sacar usuareio
    const request = await fetch(Global.url + 'follow/following/'+ userId +"/"+ next,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      }
    });

    const data = await request.json();

    let cleanUsers = [];
    // recorrer y limpiar 
    data.follows.forEach(follow =>{
        cleanUsers = [...cleanUsers, follow.followed]
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
        <h1 className="content__title">{profile.nick} sigue a: </h1>
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
