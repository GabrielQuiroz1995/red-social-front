import React, { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";
import { GetProfile } from "../../helpers/GetProfile";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { PublicationList } from "../publication/PublicationList";

export const Profile = () => {
  const [profile, setProfile] = useState({});
  const [counters, setCounters] = useState({});
  const [follow, setFollow] = useState(false);
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const { auth } = useAuth();
  const params = useParams();

  useEffect(() => {
    getDataUsers();
    getCounters();
    getPublications(1, true);
  }, []);

  useEffect(() => {
    getDataUsers();
    getCounters();
    setMore(true)
    getPublications(1, true);
  }, [params]);

  const getDataUsers = async () => {
    let dataUser = await GetProfile(params.userId, setProfile);
    if (dataUser.following && dataUser.user._id) setFollow(true);
  };
  const getCounters = async () => {
    const request = await fetch(
      Global.url + "users/counters/" + params.userId,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    const data = await request.json();
    if (data.status == "success") {
      setCounters(data);
    }
  };
  const followMethod = async (userId) => {
    const request = await fetch(Global.url + "follow/save", {
      method: "POST",
      body: JSON.stringify({ followed: userId }),
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await request.json();

    if (data.status == "success") {
      setFollow(true);
    }
  };
  const unFollow = async (userId) => {
    const request = await fetch(Global.url + "follow/unfollow/" + userId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await request.json();

    if (data.status == "success") {
      setFollow(false);
    }
  };
  const getPublications = async (nextPage = 1, newProfile = false) => {
    const request = await fetch(
      Global.url + "publication/user/" + params.userId + "/" + nextPage,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    const data = await request.json();

    if (data.status == "success") {

        let newPublication = data.publications;

        if(!newProfile && publications.length >= 1){
            newPublication = [...publications, ...data.publications]
        }
        if(newProfile){
            newPublication = data.publications;
            setMore(true)
            setPage(1);
        }

        setPublications(newPublication);

        if(!newProfile && publications.length >= (data.total - data.publications.length)){
            setMore(false);
        }

        if(data.pages <= 1){
          setMore(false);
        }
    }
  };


  return (
    <>
      <header className="aside__profile-info">
        <div className="profile-info__general-info">
          <div className="general-info__container-avatar">
            {profile.image != "default.png" && (
              <img
                src={Global.url + "users/avatar/" + profile.image}
                className="container-avatar__img"
                alt="Foto de perfil"
              />
            )}
            {profile.image == "default.png" && (
              <img
                src={avatar}
                className="container-avatar__img"
                alt="Foto de perfil"
              />
            )}
          </div>

          <div className="general-info__container-names">
            <div className="container-names__name">
              <h1>
                {profile.name} {profile.surname}
              </h1>
              {profile._id != auth._id &&
                (follow ? (
                  <button
                    onClick={() => unFollow(profile._id)}
                    className="content__button button--rigth post__button"
                  >
                    Dejar de seguir
                  </button>
                ) : (
                  <button
                    onClick={() => followMethod(profile._id)}
                    className="content__button button--rigth"
                  >
                    Seguir
                  </button>
                ))}
            </div>
            <h2 className="container-names__nickname">{profile.nick}</h2>
            <p>{profile.bio}</p>
          </div>
        </div>

        <div className="profile-info__stats">
          <div className="stats__following">
            <Link
              to={"/social/siguiendo/" + profile._id}
              className="following__link"
            >
              <span className="following__title">Siguiendo</span>
              <span className="following__number">{counters.following}</span>
            </Link>
          </div>
          <div className="stats__following">
            <Link
              to={"/social/seguidores/" + profile._id}
              className="following__link"
            >
              <span className="following__title">Seguidores</span>
              <span className="following__number">{counters.followed}</span>
            </Link>
          </div>

          <div className="stats__following">
            <Link
              to={"/social/perfil/" + profile._id}
              className="following__link"
            >
              <span className="following__title">Publicaciones</span>
              <span className="following__number">{counters.publications}</span>
            </Link>
          </div>
        </div>
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
  );
};
