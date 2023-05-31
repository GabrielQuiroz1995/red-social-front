import React, { useEffect, useState } from "react";
import avatar from '../../assets/img/user.png';
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { PublicationList } from './PublicationList';

export const Feed = () => {

    const [publications, setPublications] = useState([]);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const { auth } = useAuth();
    const params = useParams();

    useEffect(() => {
        getPublications(1, false);
    }, []);

    const getPublications = async (nextPage = 1, showNews=false) => {

        if(showNews){
            setPublications([]);
            setPage(1);
            nextPage=1;
        }
        const request = await fetch(
          Global.url + "publication/feed/"+ nextPage,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );
    
        const data = await request.json();
        console.log(data.status)
    
        if (data.status == "success") {
    
            let newPublication = data.publications;
    
            if(!showNews && publications.length >= 1){
                newPublication = [...publications, ...data.publications]
            }
    
            setPublications(newPublication);        
    
            if(!showNews && publications.length >= (data.total - data.publications.length)){
                setMore(false);
            }
    
            if(data.pages <= 1){
              setMore(false);
            }
    
        }
      };


  return (
    <>
        <header className="content__header">
            <h1 className="content__title">Timeline</h1>
            <button className="content__button" onClick={()=>getPublications(1,true)}>Actualizar</button>
        </header>

        <PublicationList
          publications={publications}
          getPublications={getPublications}
          page={page}
          setPage={setPage}
          more={more}
          setMore={setMore}
        />

</>
  )
}
