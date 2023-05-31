import React,{useState} from "react";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";
import { useForm } from "../../hooks/useForm";

export const Login = () => {
  const { form, changed } = useForm({});
  const [ saved, setSaved ] = useState("not_sended");

  const {setAuth} = useAuth();

  const loginUser = async (e) => {
    e.preventDefault();

    // datos del formulario
    let userLogin = form;

    // peticion al backend
    const query = await fetch(Global.url + "users/login", {
      method: "POST",
      body: JSON.stringify(userLogin),
      headers: {
        "Content-Type": "application/json",
      },
    });
    // recogo los datos en el formato correcto
    const data = await query.json();
    
    // persistir datos en navegador
    localStorage.setItem("token",data.token)
    localStorage.setItem("user",JSON.stringify(data.user))

    if (data.status == "success") {
      setSaved("login");

      // set de datos en el auth 
      setAuth(data.user);

      // Redireccion
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } else {
      setSaved("error");
    }
  };

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Login</h1>
      </header>

      <div className="content__posts">
        {saved == "login" ? (
          <strong className="alert alert-success">
            Usuario encontrado
          </strong>
        ) : (
          ""
        )}
        {saved == "error" ? (
          <strong className="alert alert-danger">
            Usuario no registrado
          </strong>
        ) : (
          ""
        )}

        <form className="form-login" onSubmit={loginUser}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" onChange={changed}></input>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" name="password" onChange={changed}></input>
          </div>

          <input
            type="submit"
            value="Identificate"
            className="btn btn-succcess"
          />
        </form>
      </div>
    </>
  );
};
