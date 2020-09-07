import React, { useState, useEffect } from "react";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import { Link } from "react-router-dom";
import CustomersAPI from "../services/customersAPI";
import InvoicesAPI from "../services/invoicesAPI";
import { toast } from "react-toastify";
import FormContentLoader from "../components/loaders/FormContentLoader";

const InvoicePage = ({ history, match }) => {
  const { id = "new" } = match.params;

  const [invoice, setInvoice] = useState({
    amount: "",
    customer: "",
    status: "annulée"
  });
  const [customers, setCustomers] = useState([]);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({
    amount: "",
    customer: "",
    status: ""
  });
  const [loadingCus, setLoadingCus] = useState(true);
  const [loadingInv, setLoadingInv] = useState(true);

  // Récupération des clients
  const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
      setLoadingCus(false);
      if (!invoice.customer) setInvoice({ ...invoice, customer: data[0].id });
    } catch (error) {
      toast.error("Une erreur est survenue");
      history.replace("/invoices");
    }
  };

  // Récupération d'une facture
  const fetchInvoice = async id => {
    try {
      const { amount, status, customer } = await InvoicesAPI.find(id);
      setInvoice({ amount, status, customer: customer.id });
      setLoadingInv(false);
    } catch (error) {
      toast.error("Erreur lors du chargement de la facture demandée");
      history.replace("/invoices");
    }
  };

  // Récupération de la liste des clients à chaque chargement du composant
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Récupération de la bonne facture quand l'identifiant de l'URL change
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchInvoice(id);
    }
    else {
      setLoadingInv(false);
    }
  }, [id]);

  // Gestion des changements des inputs dans le formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setInvoice({ ...invoice, [name]: value });
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async event => {
    event.preventDefault();

    try {
      if (editing) 
      {
        await InvoicesAPI.update(id, invoice);
        toast.success("Les modifications ont bien été enregistrées");
      }
      else
      {
        await InvoicesAPI.create(invoice);
        toast.success("La facture a bien été créée");
        }
        history.replace("/invoices");
    } catch ({ response }) {
      const { violations } = response.data;

      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        }); 
        setErrors(apiErrors);
        toast.error("Une erreur est survenue... Veuillez réessayer.");
      }
    }
  };

  return (
    <>
      {(editing && <h1>Modification de la facture n°{id}</h1>) || (
        <h1>Création d'une facture</h1>
        )}
      {(loadingInv || loadingCus) && <FormContentLoader /> }
      {(!loadingInv && !loadingCus) && <form onSubmit={handleSubmit}>
        <Field
          name="amount"
          type="number"
          placeholder="Montant de la facture"
          label="Montant"
          onChange={handleChange}
          value={invoice.amount}
          error={errors.amount}
        />

        <Select
          name="customer"
          label="Client"
          value={invoice.customer}
          error={errors.customer}
          onChange={handleChange}
        >
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.firstName} {customer.lastName}
            </option>
          ))}
        </Select>

        <Select
          name="status"
          label="Statut"
          value={invoice.status}
          error={errors.status}
          onChange={handleChange}
        >
          <option value="envoyée">Envoyée</option>
          <option value="payée">Payée</option>
          <option value="annulée">Annulée</option>
        </Select>

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/invoices" className="btn btn-link">
            Retour aux factures
          </Link>
        </div>
      </form>}
    </>
  );
};
export default InvoicePage;