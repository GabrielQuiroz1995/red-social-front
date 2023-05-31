import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar} from './Sidebar';
import useAuth from '../../../hooks/useAuth'

export const PrivateLayout = () => {

  const {auth, loading} = useAuth()

  if(loading){
    return <h1>Cargado...</h1>
  }else{
  return (
    <>
    <Header></Header>

    <section className="layout__content">
    {auth._id ?
      <Outlet></Outlet>
      :
      <Navigate to='/login'></Navigate>
    }
    </section>

    {/* Barra lateral */}
    <Sidebar></Sidebar>
  </>
  )
  }
}
