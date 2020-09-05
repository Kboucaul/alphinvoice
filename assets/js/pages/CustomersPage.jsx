import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import CustomersAPI from "../services/customersAPI.js";
import { Link } from 'react-router-dom';

const CustomersPage = (props) => {

    //Gestion des states avec des hooks
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
   
    //Calcul du nombre de pages
    const itemsPerPage = 10;

// Permet d'aller récupérer les customers
const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  // Au chargement du composant, on va chercher les customers
  useEffect(() => {
    fetchCustomers();
  }, []);

  

    //Gestion de la suppression d'un customer
    const handleDelete = async (id) => {
        //on copie le tableau de customers avant la suppression
        const originalCustomers = [...customers];

        //1-Approche optimiste
         //setCustomers(customers.filter(customer => customer.id !== id));
         setCustomers(customers.filter(customer => customer.id !== id));
        //2-Approche pessimiste
        //moins rapide
        //on demande a axios d'effectuer une requete en mode delete
        try {
            await CustomersAPI.delete(id)
        } catch(error) {
            setCustomers(originalCustomers)
        }
    }

    //Gestion du changement de pages
   const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    //Gestion de la recherche
    const handleSearch = event => {
        setSearch(event.currentTarget.value);
        setCurrentPage(1);
    }

    //Filtrage des customers en fonction de la recherche
    const filteredCustomers = customers.filter(c => 
        c.firstName.toLowerCase().includes(search.toLowerCase()) || 
        c.lastName.toLowerCase().includes(search.toLowerCase())  ||
        c.email.toLowerCase().includes(search.toLowerCase())     ||
        (c.company && c.company.toLowerCase().includes(search.toLowerCase())));

    //Gere l'affichage des customers par page (update avec filtre recherche)
    const paginatedCustomers = Pagination.getData(
                               filteredCustomers,
                               currentPage,
                               itemsPerPage);


    return (
        <>
        <div className="d-flex justify-content-between align-items-center">
            <h1>Liste des clients</h1>
            <Link to="/customers/new" className="btn btn-primary">Créer un client</Link>
        </div>

        <div className="form-group form-control">
            <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher..."/>
        </div>
        <div className="container">
        <table className="table table-hover">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Entreprise</th>
                    <th className="text-center">Factures</th>
                    <th className="text-center">Montant total</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {paginatedCustomers.map(customer => 
                <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>
                        <a href="#">{customer.firstName} {customer.lastName}</a>
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.company}</td>
                    <td className="text-center">
                <span className="badge badge-primary">{customer.invoices.length}</span>
                    </td>
                    <td className="text-center">{customer.totalAmount.toLocaleString()} &euro;</td>
                    <td>
                        <button 
                        disabled={customer.invoices.length > 0}
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(customer.id)}>Supprimer</button>
                    </td>
                </tr>)}
            </tbody>
        </table>
        
        {itemsPerPage < filteredCustomers.length && <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={filteredCustomers.length} onPageChanged={handlePageChange} />}
    </div>
    </>
     );
}
 
export default CustomersPage;