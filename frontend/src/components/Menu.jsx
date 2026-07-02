import {Link} from 'react-router-dom';
import {useAuth} from "../context/AuthContext";


export default function Menu(){ 
    const{user, logout} = useAuth();

    async function handleLogout(){
        await logout();
        navigate("/");
    }


    return(
        <div className="menu">
            {/*cliccare su login porta alla LoginPage*/}
            {user ? <button onClick={handleLogout} className="menu__logout">Logout</button> : <Link to="/login" className="menu__login">Login</Link>}
            {/*cliccare su carrello porta alla CartPage*/}
            <Link to="/cart" className="menu__cart-btn">Carrello</Link> 
            {user && <Link to="/profile" className="menu__profile">Profilo</Link>} 
        </div>  
    );
}