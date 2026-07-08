import {Link} from 'react-router-dom';
import {useAuth} from "../context/AuthContext";


export default function Menu(){ 
    const{user, logout} = useAuth();

    async function handleLogout(){
        await logout();
        navigate("/");
        //quando si clicca su Logout viene chiamata l'api logout
        //che invalida il cookie e riporta alla HomePage (utile se
        //ci si trova in ProfilePage quando si fa logout)
    }


    return(
        <div className="menu">
            {
                user 
                ? <button onClick={handleLogout} className="menu__logout">Logout</button> 
                : <Link to="/login" className="menu__login">Login</Link>
            }
            {/*se c'è una sessione attiva viene renderizzato il bottone
            Logout che quando viene cliccato chiama handleLogout
            se invece non c'è una sessione attiva viene renderizzato 
            il link che porta alla LoginPage*/}
            <Link to="/cart" className="menu__cart-btn">Carrello</Link> 
            {/*cliccare su carrello porta alla CartPage*/}
            {user && <Link to="/profile" className="menu__profile">Profilo</Link>} 
            {/*se c'è un utente attualmente loggato viene renderizzato il link che porta 
            alla pagina di profilo*/}
        </div>  
    );
}