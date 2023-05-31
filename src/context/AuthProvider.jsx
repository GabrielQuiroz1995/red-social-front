import React, { useState, useEffect ,createContext } from 'react';
import { Global } from '../helpers/Global';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState({});
    const [counters, setCounters] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        authUser();
    },[]);

    const authUser = async() =>{
        // datos del local storage
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        // comprobar token
        if(!token || !user){
            setLoading(false);
            return false;
        }
        // tranformar datos
        const userObj = JSON.parse(user);
        const userId = userObj.id;
        // petyicion ajax al backen para que comprueb el token

        const request = await fetch(Global.url+ 'users/profile/'+ userId,{
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": token,
            }
        })

        const data = await request.json();
        
        // peticion para los contadores 
        const requestCounters = await fetch(Global.url+ 'users/counters/'+ userId,{
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": token,
            }
        })

        const dataCounters = await requestCounters.json();

        // setear el estado auth
        setAuth(data.user);
        setCounters(dataCounters);
        setLoading(false);

    }

  return (
    <AuthContext.Provider
        value={{
            auth,
            setAuth,
            counters,
            setCounters,
            loading,
        }}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;
