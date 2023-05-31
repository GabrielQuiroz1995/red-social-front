import React,{ useState } from "react";
import useAuth from '../../hooks/useAuth'
import avatar from '../../assets/img/user.png'
import { Global } from "../../helpers/Global";
import { SerializeForm } from "../../helpers/SerialiseForm";

export const Config = () => {

    const {auth, setAuth} = useAuth();
    const [saved, setSaved]= useState("not_sended");

    const updateUser = async (e)=>{
        e.preventDefault();

        // tokend e autenticacion
        const token = localStorage.getItem("token")
        // recoge datos del formulario
        let newDataUser = SerializeForm(e.target);
       
        delete newDataUser.file0;

        // Actualizar usuario en la bd
        const request  = await fetch(Global.url + "users/update", {
          method: "PUT",
          body: JSON.stringify(newDataUser),
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          }
        })

        // transformo la respuesta en un objeto javascript usable
        const data = await request.json()

        if(data.status == "success" && data.user){
          delete data.user.password
          setAuth(data.user)
          setSaved("saved")
        }else{
          setSaved("error")
        }

        // subida de imagenes 
        const fileInput = document.querySelector("#file")

        if(data.status == "success" && fileInput.files[0]){
          // recoger img
          const formData = new FormData();
          formData.append('file0',fileInput.files[0]);

          // peticion para enviar imagen 
          const uploadRequest = await fetch(Global.url+ "users/upload",{
            method: "POST",
            body: formData,
            headers: {
              "Authorization": token
            }
          });
          const upLoadData = await uploadRequest.json();

          if(upLoadData.status == "success" && upLoadData.user){

            delete upLoadData.user.password

            setAuth(upLoadData.user)
            setSaved("saved")

          }else{
            setSaved("error")
          }
        }

    }

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Registro</h1>
      </header>

      <div className="content__posts">
      {saved== 'saved' ? 
          <strong className="alert alert-success">Usuario actualizado</strong>
          : ''}
        {saved== 'error' ?
          <strong className="alert alert-danger">Error al actualizar</strong>
          : ''}
        <form className="config-form" onSubmit={updateUser}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input type="text" name="name" defaultValue={auth.name}></input>
          </div>

          <div className="form-group">
            <label htmlFor="surname">Apellido</label>
            <input type="text" name="surname" defaultValue={auth.surname}></input>
          </div>

          <div className="form-group">
            <label htmlFor="nick">Nick</label>
            <input type="text" name="nick" defaultValue={auth.nick}></input>
          </div>

          <div className="form-group">
            <label htmlFor="bio">Biografia</label>
            <textarea name="bio" defaultValue={auth.bio}/>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" defaultValue={auth.email}></input>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" name="password"></input>
          </div>

          <div className="form-group">
            <label htmlFor="file0">Imagen</label>
            <div className="general-info__container-avatar">
                    {auth.image != 'default.png' && <img src={Global.url + 'users/avatar/'+auth.image} className="container-avatar__img" alt="Foto de perfil"/>}
                    {auth.image == 'default.png' && <img src={avatar} className="container-avatar__img" alt="Foto de perfil"/>}
                    
            </div>
            <br/>
            <input type="file" name="file0" id="file"/>
   
          </div>

          <br/>
          <input
            type="submit"
            value="Actualizar"
            className="btn btn-succcess"
          />
        </form>
        <br/>
      </div>
    </>
  );
};
