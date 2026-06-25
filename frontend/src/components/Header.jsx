import {Link} from 'react-router-dom';
import {useAuth} from "../context/AuthContext";

export default function Header({search, handleSearch, handleMenu}){
    const{user, logout} = useAuth();

    return(
        <header className="header">
            <div className="header__container">
                {/*cliccare sul logo porta alla HomePage*/}
                <Link to="/" className="header__logo">UniShelf</Link>
                <div className="header__searchbar">
                     {/*icona lente di ingrandimento*/}
                     <i className="header__searchbar-icon fa-solid fa-magnifying-glass"></i>
                     <label htmlFor="search-input" aria-label="Cerca"></label>
                     {/*input search per barra di ricerca*/}
                     <input 
                     type="search" 
                     id="search-input" 
                     className="header__searchbar-input" 
                     placeholder="Cerca..." 
                     value={search}
                     onChange={(e) => handleSearch(e.target.value)}/>
                </div>
                <nav className="nav">
                    <ul className="nav__list">
                        <li id="header__menu">
                            {/*bottone menù con icona hamburger*/}
                            <button className="header__menu-btn" onClick={handleMenu}>
                               <i className="fa-solid fa-bars"></i> {/*icona hamburger per menù*/}
                           </button> 
                        </li>
                        <li id="header__login">
                             {/*cliccare su login porta alla LoginPage*/}
                             {
                                 user 
                                 ? <button onClick={logout} className="header__logout-btn">Logout</button> 
                                 : <Link to="/login" className="header__login-btn">Login</Link>
                             }
                        </li>
                        {user && <li id="header__profile"><Link to="/profile">Profilo</Link></li>}
                        <li id="header__cart">
                            {/*cliccare su carrello porta alla CartPage*/}
                            <Link to="/cart" className="header__cart-btn">Carrello</Link> 
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}