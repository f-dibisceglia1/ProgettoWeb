import {Link} from 'react-router-dom';

export default function Header({handleMenu}){
    return(
        <header className="header">
            <div className="header__container">
                <Link to="/" className="header__logo">UniShelf</Link>
                <div className="header__searchbar">
                     {/*1. Icona lente di ingrandimento*/}
                     <i className="header__searchbar-icon fa-solid fa-magnifying-glass"></i>
                     <label htmlFor="search-input" aria-label="Cerca"></label>
                     {/*2. Input search per barra di ricerca*/}
                     <input type="search" id="search-input" className="header__searchbar-input" placeholder="Cerca..."/>
                </div>
                <nav className="nav">
                    <ul className="nav__list">
                        <li id="header__menu">
                            <button className="header__menu-btn" onClick={handleMenu}>
                               <i className="fa-solid fa-bars"></i> {/*icona hamburger per menù*/}
                           </button> 
                        </li>
                        <li id="header__login">
                             {/*3. Login (non ancora implementato)*/}
                             <Link to="/login" className="header__login-btn">Login</Link>
                        </li>
                        <li id="header__cart">
                            {/*4. Bottone Carrello (modalità desktop) a cui è stata passata la funzione onBasketClick che viene
                            chiamata ogni volta che si clicca il bottone e aggiorna il valore di basketOpen*/}
                            <Link to="/cart" className="header__cart-btn">Carrello</Link> 
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}