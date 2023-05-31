import React,{useEffect, useState} from "react";
import { Global } from "../../helpers/Global";
import { UserList } from "./UserList";

export const People = () => {
  
  
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    getUsers(1);
  }, []);

  const getUsers = async (next=1) =>{
    // peticion para sacar usuareio
    const request = await fetch(Global.url + 'users/list/'+next,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token"),
      }
    });

    const data = await request.json();
    // estados para listar
    if(data.users && data.status=="success"){

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
        <h1 className="content__title">Gente</h1>
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
