import React, { Component } from 'react';

// <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={customers.length} onPageChanged={handlePageChange} />

const Pagination = ({ currentPage, itemsPerPage, length, onPageChanged}) => {
    const pagesCount = Math.ceil(length / itemsPerPage);

    //on cree un tableau
    const pages = [];
    for (let i = 1; i <= pagesCount; i++)
    {
        pages.push(i);
    }
    return ( 
        <div>
            <ul className="pagination pagination-sm">
                <li className={"page-item " + (currentPage === 1 && "disabled")}>
                    <button className="page-link" onClick={() => onPageChanged(currentPage - 1)}>&laquo;</button>
                </li>
                {pages.map(page =>
                    <li key={page} className={"page-item " + (currentPage === page && "active")}>
                        <button className="page-link" onClick={() => onPageChanged(page)}>
                            {page}
                        </button>
                    </li>
                )}
                <li className={"page-item " + (currentPage >= length && "disabled")}>
                    <button className="page-link" onClick={() => onPageChanged(currentPage + 1)}>&raquo;</button>
                </li>
            </ul>
        </div>
     );
}

Pagination.getData = (items, currentPage, itemsPerPage) => {
//D'ou on part => start et pendant combien (itemsPerPage)
const start = (currentPage * itemsPerPage) - itemsPerPage;
/*
**  ex : page 3 x 10 - 10 = 20
**  car 1 => 0->10
**      2 => 10->20
**      3 => 20->30
*/  
const paginatedItems = items.slice(start, (start + itemsPerPage));
return paginatedItems;
}

export default Pagination;