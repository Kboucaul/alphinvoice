import React from 'react';

const HomePage = props => {
    return ( 
        <div className="jumbotron change bg-warning text-light">
            <h1 className="display-3">Bienvenue !</h1>
            <p className="lead"><strong>Alph<span className="text-danger font-weight-bold">I</span>nvoices</strong> est là pour vous simplifier la vie !</p>
            <hr className="my-4"/>
            <p>Que vous soyez freelance, entrepreneur ou autres, nous vous aidons à gérer vos factures clients avec simplicité</p>
            <p className="lead">
                <a className="btn btn-success btn-sm" href="#" role="button">Learn more</a>
            </p>
        </div>
    );
}
 
export default HomePage;