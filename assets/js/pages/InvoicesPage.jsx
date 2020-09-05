import moment from "moment";
import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import InvoicesAPI from "../services/invoicesAPI.js";
import { Link } from "react-router-dom";

const STATUS_CLASSES = {
    payée: "success",
    envoyée: "primary",
    annulée: "danger"
};

var i = 0;

const InvoicesPage = (props) => {
    
    //State
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
   
    const itemsPerPage = 20;
    // Récupération des invoices auprès de l'API
  const fetchInvoices = async () => {
    try {
      const data = await InvoicesAPI.findAll();
      setInvoices(data);
     // setLoading(false);
    } catch (error) {
     console.log(error.response);
    }
  };

  // Charger les invoices au chargement du composant
  useEffect(() => {
    fetchInvoices();
  }, []);
    //Gestion du changement de pages
    const handlePageChange = (page) => {
    setCurrentPage(page);
};

//Gestion de la suppression d'une invoice
const handleDelete = async (id) => {
    //on copie le tableau d'invoices avant la suppression
    const originalInvoices = [...invoices];
    //1-Approche optimiste
     //setInvoices(invoices.filter(invoice => invoice.chrono !== chrono));
     setInvoices(invoices.filter(invoice => invoice.id !== id));
    //2-Approche pessimiste
    //moins rapide
    //on demande a axios d'effectuer une requete en mode delete
    try {
        await InvoicesAPI.delete(id)
    } catch(error) {
        console.log("Erreur");
        setInvoices(originalInvoices)
    }
}

//Gestion de la recherche
const handleSearch = event => {
    setSearch(event.currentTarget.value);
    setCurrentPage(1);
}

//Filtrage des invoices en fonction de la recherche

const filteredInvoices = invoices.filter(i => 
    i.customer.firstName.toLowerCase().includes(search.toLowerCase())   ||
    i.customer.lastName.toLowerCase().includes(search.toLowerCase())    ||
    i.status.toLowerCase().includes(search.toLowerCase())               ||
    i.amount.toString().startsWith(search.toString()));
    

 //Gere l'affichage des invoices par page (update avec filtre recherche)
 const paginatedInvoices = Pagination.getData(
    filteredInvoices,
    currentPage,
    itemsPerPage);


    const formatDate = (str) => moment(str).format('DD/MM/YYYY');
    
    return ( 
        <>
        <div className="mb-3 d-flex justify-content-between align-items-center">
            <h1>Liste des factures</h1>
            <Link to="/invoices/new" className="btn btn-primary">Créer une facture</Link>
        </div>

            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher..."/>
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Numéro</th>
                        <th>Client</th>
                        <th className="text-center">Date d'envoie</th>
                        <th className="text-center">Statut</th>
                        <th className="text-center">Montant</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedInvoices.map(invoice => 
                        <tr key={invoice.id} >
                        <td>{invoice.chrono}</td>
                        <td>
                            <a href="#">
                                {invoice.customer.firstName} {invoice.customer.lastName}
                            </a>
                        </td>
                        <td className="text-center">{formatDate(invoice.sentAt)}</td>
                        <td className="text-center">
                            <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>
                                {invoice.status}
                            </span>
                        </td>
                        <td className="text-center">{invoice.amount.toLocaleString()} &euro;</td>
                        <td>
                            <Link to={"/invoices/" + invoice.id} className="btn btn-warning btn-sm mt-1 mr-1">Modifier</Link>
                            <button className="btn btn-danger btn-sm mt-1" onClick={() => handleDelete(invoice.id)}>Supprimer</button>
                        </td>
                    </tr>    
                    )}
                </tbody>
            </table>
            {itemsPerPage < filteredInvoices.length &&
            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChanged={handlePageChange} length={filteredInvoices.length} />}
        </>
     );
}
 
export default InvoicesPage;