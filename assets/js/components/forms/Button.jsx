import React from 'react';
import { Link } from 'react-router-dom';

/*
**  1 : type
**  2 : classname
**  3 : label
**  4 : link 
*/

const Button = ({type, classname, label, link }) => {
    return ( 
        <div className="form-group">
          <button type={type} className={classname}>
            {label}
          </button>
            {link}
        </div>
     );
}
 
export default Button;