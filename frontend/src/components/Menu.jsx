import {Link} from 'react-router-dom';


export default function Menu(){ 
    return(
        <div className="menu">
            {/*cliccare su login porta alla LoginPage*/}
            <Link to="/login" className="menu__login">Login</Link>
            {/*cliccare su carrello porta alla CartPage*/}
            <Link to="/cart" className="menu__cart-btn">Carrello</Link>  
        </div>  
    );
}