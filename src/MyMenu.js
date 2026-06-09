import './MyMenu.css'

function MyMenu({onBasketClick}){
    return(
         <div className="menu">
                    <a href="#" className="menu__login"><span>Login</span></a>
                    <button className="menu__basket-btn" onClick = {onBasketClick}>Carrello</button>  
            </div>  
    );
}

export default MyMenu;