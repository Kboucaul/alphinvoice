import React, { useEffect, useState } from 'react';
import axios from "axios";
import Pagination from '../components/Pagination';

const CustomersPageWithPagination = (props) => {
    //
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); 
    //Calcul du nombre de pages
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;
    const [loading, setLoading] = useState(true);

    //
    useEffect(() => {
        //on utilise axios qui fonctionne avec des promesses
        axios.get(`http://localhost:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
             .then(response => {
                setCustomers(response.data['hydra:member']);
                setTotalItems(response.data["hydra:totalItems"]);
                setLoading(false);
             })
             .catch(error => console.log(error.response));
    }, [currentPage]); // a chaque fois que currentpage change cet effet se relance
    const handleDelete = (id) => {
        //on copie le tableau de customers avant la suppression
        const originalCustomers = [...customers];

        //1-Approche optimiste
         //setCustomers(customers.filter(customer => customer.id !== id));
         setCustomers(customers.filter(customer => customer.id !== id));
        //2-Approche pessimiste
        //moins rapide
        //on demande a axios d'effectuer une requete en mode delete
        axios.delete("http://localhost:8000/api/customers/" + id)
             .then(response => console.log("ok"))
             .catch(error => {
                console.log(error.response)
                setCustomers(originalCustomers)
            });
    }

    //fonction qui permet de modifier la classe active dans la pagination
   const handlePageChange = (page) => {
        setCurrentPage(page);
        setLoading(true);
    };

    return (
        <>
        <h1>Liste des clients (pagination)</h1>

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
                {loading && 
                   <tr>
                        <td>
                            Chargement ...
                        </td> 
                   </tr>
                }
                {customers.map(customer => 
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
        
        <Pagination 
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            length={totalItems}
            onPageChanged={handlePageChange}
        />
    </>
     );
}
 
export default CustomersPageWithPagination;