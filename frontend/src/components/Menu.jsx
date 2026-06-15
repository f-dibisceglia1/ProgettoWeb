import {Link} from 'react-router-dom';


export default function Menu(){ {/*Riceve props contenente onBasketClick*/}
    return(
        <div className="menu">
            {/*1. Bottone Login*/}
            <Link to="/login" className="menu__login">Login</Link>
            {/*2. Bottone Carrello */}
            <Link to="/cart" className="menu__cart-btn">Carrello</Link>  
        </div>  
    );
}