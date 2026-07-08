import {Link} from 'react-router-dom';
import {useAuth} from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

//modalità mobile (width < 800px, gestito tramite media query nel CSS):
// Logo - Barra di ricerca - Bottone menù
//modalità desktop (width > 800px):
// Logo - Barra di ricerca - Login/Logout - Profilo - Carrello

export default function Header({search, handleSearch, handleMenu}){
//ad Header sono passati come props da App.jsx handleMenu per gestire 
//l'apertura/chiusura del menù in modalità mobile cliccando l'icona hamburger, 
//q e setQ come search e handleSearch per registrare cosa viene scritto nella barra
//di ricerca e usarlo poi per fare la fetch al server e aggiornare il catalogo tramite
//lo useEffect in App.jsx
    const navigate = useNavigate();
    const{user, logout} = useAuth();

    async function handleLogout(){
        await logout();
        navigate("/");
        //quando si clicca su Logout viene chiamata l'api logout
        //che invalida il cookie e riporta alla HomePage (utile se
        //ci si trova in ProfilePage quando si fa logout)
    }

    return(
        <header className="header">
            <div className="header__container">
                <Link to="/" className="header__logo">UniShelf</Link>
                {/*cliccare sul logo porta alla HomePage*/}
                <div className="header__searchbar">
                     <i className="header__searchbar-icon fa-solid fa-magnifying-glass"></i>
                      {/*icona lente di ingrandimento*/}
                     <label htmlFor="search-input" aria-label="Cerca"></label>
                     <input 
                     type="search" 
                     id="search-input" 
                     className="header__searchbar-input" 
                     placeholder="Cerca..." 
                     value={search}
                     onChange={(e) => {handleSearch(e.target.value); navigate("/");}}/>
                     {/*input search per barra di ricerca il cui valore è registrato nello 
                     stato search (q in App.jsx)
                     quando si digita nella barra di ricerca si viene riportati alla
                     HomePage perché i risultati della ricerca sono renderizzati lì*/}
                </div>
                <nav className="nav">
                    <ul className="nav__list">
                        <li id="header__menu">
                            <button className="header__menu-btn" onClick={handleMenu}>
                               <i className="fa-solid fa-bars"></i> 
                               {/*icona hamburger per menù*/}
                           </button> 
                           {/*bottone menù con icona hamburger*/}
                        </li>
                        <li id="header__login">
                             {
                                 user 
                                 ? <button onClick={handleLogout} className="header__logout-btn">Logout</button> 
                                 : <Link to="/login" className="header__login-btn">Login</Link>
                             }
                             {/*se c'è una sessione attiva viene renderizzato il bottone
                             Logout che quando viene cliccato chiama handleLogout
                             se invece non c'è una sessione attiva viene renderizzato 
                             il link che porta alla LoginPage*/}
                        </li>
                        {user && <li id="header__profile"><Link to="/profile">Profilo</Link></li>}
                        {/*se c'è un utente attualmente loggato viene renderizzato il link che porta 
                        alla pagina di profilo*/}
                        {user?.role === "admin" && <li id="header__dashboard"><Link to="/dashboard">Dashboard</Link></li>}
                        {/*se c'è un admin attualmente loggato viene renderizzato il link che porta 
                        alla dashboard*/}
                        <li id="header__cart">
                            <Link to="/cart" className="header__cart-btn">Carrello</Link> 
                            {/*cliccare su carrello porta alla CartPage*/}
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}