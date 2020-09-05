import React, { useState, useContext } from "react";
import AuthAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/Field";
import Button from "../components/forms/Button";

const LoginPage = ({ history }) => {
  const { setIsAuthenticated } = useContext(AuthContext);

  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");

  // Gestion des champs
  const handleChange = ({ currentTarget }) => {
    const { value, name } = currentTarget;
    setCredentials({ ...credentials, [name]: value });
  };

  // Gestion du submit
  const handleSubmit = async event => {
    event.preventDefault();
    

    try {
      await AuthAPI.authenticate(credentials);
      setError("");
      setIsAuthenticated(true);
      history.replace("/customers");
    } catch (error) {
      setError(
        "Aucun compte ne possède cette adresse email ou alors les informations ne correspondent pas !"
      );
    }
  };

  return (
    <>
      <h1>Connexion à l'application</h1>
      <form onSubmit={handleSubmit}>
        <Field
          name={"username"} 
          label={"Adresse email"}
          value={credentials.username}
          onChange={handleChange}
          placeholder={"Adresse email de connexion"}
          type={"email"}
          error={error}
          />
        <Field
          name={"password"} 
          label={"Mot de passe"}
          value={credentials.password}
          onChange={handleChange}
          placeholder={"Mot de passe"}
          type={"password"}
          />
          <Button 
            type= {"submit"}
            classname={"btn btn-success"}
            label={"Je me connecte"}
          />
      </form>
    </>
  );
};
export default LoginPage;