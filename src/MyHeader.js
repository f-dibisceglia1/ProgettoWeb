import {useState} from 'react';
import './MyHeader.css';
import MySearchbar from './MySearchbar';
import MyMenu from './MyMenu.js';

function MyHeader({onBasketClick}){
    const [menuOpen, setMenuOpen] = useState(false);
    //creato una variabile menuOpen con valore iniziale false (useState(false)), 
    // setMenuOpen è la funzione per cambiarla

    return (
        <header className="header">
            <div className="header__container">
               <h1 className="header__logo"><a href="/">UniShelf</a></h1>
               <MySearchbar />
               <a href="#" className="header__login"><span className="header__login-btn">Login</span></a>
               <button className="header__basket-btn" onClick = {onBasketClick}>Carrello</button> 
               <button className="header__menu" onClick = {() => setMenuOpen(!menuOpen)}>
                {/*ogni volta che viene cliccato, viene chiamata setMenuOpen che cambia menuOpen al 
                valore opposto di quello attuale (se è true diventa false e viceversa)*/}
               <i className="fa-solid fa-bars"></i>
               </button>    
               { menuOpen ? <MyMenu onBasketClick = {onBasketClick}/> : null }  
               {/*ternario: se menuOpen è true allora l'header renderizza il menu altrimenti no
                gli passo anche onBasketClick per il bottone Carrello nel menù in modalità mobile*/}
            </div>
        </header>
    );
}

export default MyHeader;