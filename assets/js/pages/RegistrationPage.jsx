import React, { useState } from 'react';
import Field from '../components/forms/Field';
import { Link } from 'react-router-dom';
import RegistrationAPI from '../services/registrationAPI';

const RegistrationPage = ({history}) => {
    
    const [user, setUser] = useState({
        firstName:        "",
        lastName:         "",
        email:            "",
        password:         "",
        passwordConfirm : ""
    });

    const [errors, setErrors] = useState({
        firstName:        "",
        lastName:         "",
        email:            "",
        password:         "",
        passwordConfirm:  ""
    });

    /*
    **  Affiche saisie de l'utilisateur
    */
   const handleChange = (event) => {
    const name = event.currentTarget['name'];
    const value = event.currentTarget['value'];
    setUser({...user, [name]: value});
}
    /*
    **  gere la soumission du formulaire
    */
    const handleSubmit = async event => {
        event.preventDefault();
        const apiErrors = {};
        if (user.password !== user.passwordConfirm)
        {
            apiErrors.passwordConfirm = "Les mots de passe doivent être identiques !";
            setErrors(apiErrors);
            return ;
        }
        try {
            await RegistrationAPI.createUserRegistration(user);
            setErrors([]);
            history.replace('/login');

        } catch ({response}) {
            const violations = response.data.violations;
            if (violations)
            {
                violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors);
            }
        }
    }
    
    return ( 
        <>
            <h1 className="mb-4">Inscrivez-vous !</h1>
            <form onSubmit={handleSubmit}>
                <Field
                    name="firstName"
                    label="Prénom"
                    placeholder="Votre prénom"
                    error={errors.firstName}
                    value={user.firstName}
                    onChange={handleChange}
                />
                <Field
                    name="lastName"
                    label="Nom"
                    placeholder="Votre nom de famille"
                    error={errors.lastName}
                    value={user.lastName}
                    onChange={handleChange}
                />
                <Field
                    name="email"
                    label="Adresse email"
                    type="email"
                    placeholder="Votre adresse email"
                    error={errors.email}
                    value={user.email}
                    onChange={handleChange}
                />
                <Field
                    name="password"
                    label="Mot de passe"
                    type="password"
                    placeholder="Choisissez un mot de passe"
                    error={errors.password}
                    value={user.password}
                    onChange={handleChange}
                />
                <Field
                    name="passwordConfirm"
                    label="Confirmation du mot de passe"
                    type="password"
                    placeholder="Confirmez votre mot de passe"
                    error={errors.passwordConfirm}
                    value={user.passwordConfirm}
                    onChange={handleChange}
                />
                <div className="form-group mt-4">
                    <button type="submit" className="btn btn-success">
                        S'inscrire
                    </button>
                    <Link to="/login" className="btn btn-link">J'ai déjà un compte</Link>
                </div>
            </form>
        </>

     );
}
 
export default RegistrationPage;