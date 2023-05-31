import React from "react";
import { Routes, Route, BrowserRouter, Navigate, Link } from "react-router-dom";
import { PrivateLayout } from "../components/layout/private/PrivateLayout";
import { PublicLayout } from "../components/layout/public/PublicLayout";
import { Feed } from "../components/publication/Feed";
import { Login } from "../components/user/Login";
import { Logout } from "../components/user/Logout";
import { Register } from "../components/user/Register";
import { AuthProvider } from "../context/AuthProvider";
import { People } from "../components/user/People";
import { Config } from "../components/user/Config";
import { Following } from "../components/follow/Following";
import { Followers } from "../components/follow/Followers";
import { Profile } from "../components/user/Profile";

export const Routing = () => {
  return (
    <BrowserRouter>
      <AuthProvider>

        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Login />}></Route>
            <Route path="login" element={<Login />}></Route>
            <Route path="registro" element={<Register />}></Route>
          </Route>

          <Route path="/social" element={<PrivateLayout />}>
            <Route index element={<Feed></Feed>}></Route>
            <Route path="feed" element={<Feed></Feed>}></Route>
            <Route path="logout" element={<Logout></Logout>}></Route>
            <Route path="gente" element={<People></People>}></Route>
            <Route path="configuracion" element={<Config></Config>}></Route>
            <Route path="siguiendo/:userId" element={<Following/>}></Route>
            <Route path="seguidores/:userId" element={<Followers/>}></Route>
            <Route path="perfil/:userId" element={<Profile/>}></Route>
          </Route>

          <Route
            path="*"
            element={
              <>
                <p>
                  <h1>Error 404</h1>
                  <Link to="/">Volver al inicio</Link>
                </p>
              </>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
