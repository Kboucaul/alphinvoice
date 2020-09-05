import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/forms/Button';
import Field from '../components/forms/Field';
import CustomersAPI from '../services/customersAPI';

const CustomerPage = ({match, history}) => {
    
    //Quelle adresse est recue (/new ou /id)

    /*
    **  Dans les props on recupere le chemin et ses parametres
    */

    //On recupere l'id.
    const id = match.params.id;
    const [customer, setCustomer] = useState({
        lastName   : "",
        firstName  : "",
        email      : "",
        company    : ""
    });

    const [errors, setErrors] = useState({
        lastName   : "",
        firstName  : "",
        email      : "",
        company    : ""
    });
    const [editing, setEditing] = useState(false);
 
    /*
    **  On va chercher le client correspondant a l'id
    */
    const fetchCustomer = async (id) => {
        try {
            const { firstName, lastName, email, company } = await CustomersAPI.getCustomerById(id);
             //on ne veut enregistrer que certains champs
             setCustomer({firstName, lastName, email, company});
            } 
        catch(error)
        {
            history.replace('/customers');
        }
    }

    /*
    **  Chargement du customer si besoin au chargement
    **  du composant ou changement de l'identifiant.
    **  ex: /customers/id
    */
    useEffect(() => {
        if (id !== "new")
        {
            setEditing(true);
            fetchCustomer(id);
        }
    }, [id]);

    /*
    **  Affiche saisie de l'utilisateur
    */
    const handleChange = (event) => {
        const name = event.currentTarget['name'];
        const value = event.currentTarget['value'];
        setCustomer({...customer, [name]: value});
    }

    /*
    **  Gestion soumission du formulaire
    **  Requete vers api
    **      ->soit edit du customer
    **      ->soit création du customer
    */
    const handleSubmit = async (event) => {
        event.preventDefault(); //annule le rechargement de page
        try{
            //Si on est en train d'editer
            if (editing)
            {
                await CustomersAPI.editCustomer(id, customer)
            }
            //Si on est en création
            else
            {
                await CustomersAPI.createCustomer(customer);
            }
            history.replace("/customers");
            setErrors({});
        }
        /*
        **  Si on ne remplit pas tous les
        **  champs on a une erreur : les violations.
        **  Car les contraintes d'api platform ne sont
        **  pas respectées.
        */
       //On destructure error pour recuperer la reposne
        catch({ response }) {
            const violations = response.data.violations;

            if (violations)
            {
                const apiErrors = {};
                //On crée un objet contenant l'ensemble de smessages d'erreur
                violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                //On set nos messages d'erreurs qui seront affichés
                setErrors(apiErrors);
            }
        }
    }

    return ( 
        <>
            { !editing && 
                <h1 className="mb-4">Création d'un client</h1>
            }
            { editing &&
               <h1 className="mb-4">Modification du client n°{id}</h1> 
            }
            <form onSubmit={handleSubmit}>
                <Field 
                    name        = "lastName"
                    label       = "Nom de famille"
                    placeholder = "Nom de famille du client"
                    value       = {customer.lastName}
                    onChange    = {handleChange}
                    error       = {errors.lastName}
                />
                <Field 
                    name        = "firstName"
                    label       = "Prénom"
                    placeholder = "Prénom du client"
                    value       = {customer.firstName}
                    onChange    = {handleChange}
                    error       = {errors.firstName}
                />
                <Field 
                    name        = "email"
                    label       = "Adresse email"
                    type        = "email"
                    placeholder = "Adresse email du client"
                    value       = {customer.email}
                    onChange    = {handleChange}
                    error       = {errors.email}
                />
                <Field 
                    name        = "company"
                    label       = "Entreprise"
                    placeholder = "Entreprise du client"
                    value       = {customer.company}
                    onChange    = {handleChange}  
                />
                <div>
                    <Button
                        type = "submit"
                        classname = "btn btn-success"
                        label = "Valider"
                        link = {
                        <Link
                            to={"/customers"}
                            className={"btn btn-link"}
                        >
                            {"Retour à la liste"}
                        </Link>
                        }
                    />
                </div>
            </form>
        </>
     );
}
 
export default CustomerPage;