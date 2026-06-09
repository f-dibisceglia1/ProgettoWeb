import {useState} from 'react';
import './MyHeader.css';
import MySearchbar from './MySearchbar';
import MyMenu from './MyMenu.js';

//Obiettivo:
//1. Header in modalità desktop: barra in cima alla pagina, sempre visibile, contenente in riga: 
//logo, barra di ricerca, bottone login, bottone carrello che quando cliccato mostra carrello come sidebar
//2. Header in modalità mobile: barra in cima alla pagina, sempre visibile, contente in riga:
//logo, barra di ricerca, bottone menù che quando cliccato mostra menù con bottone login e bottone carrello.
//quest'ultimo una volta cliccato mostra carrello come overlay dell'intera pagina

function MyHeader({onBasketClick}){
    const [menuOpen, setMenuOpen] = useState(false);
    //creato una variabile di stato menuOpen con valore iniziale false (useState(false)), 
    // setMenuOpen è la funzione per cambiarla

    //Convenzione per denominare classi:
    //- componente principale => ".container"
    //- parte del componente => ".container__logo"
    //- una variante => ".container__logo--active" (nomi composti come ".container__logo-new" un solo -)
   
    return (
        <header className="header">
            <div className="header__container"> 
                {/*1. Logo app con link alla home page*/}
               <h1 className="header__logo"><a href="/">UniShelf</a></h1>
               {/*2. Barra di ricerca*/}
               <MySearchbar />
               {/*3. Login (non ancora implementato)*/}
               <a href="#" className="header__login"><span className="header__login-btn">Login</span></a>
               {/*4. Bottone Carrello (modalità desktop) a cui è stata passata la funzione onBasketClick che viene
               chiamata ogni volta che si clicca il bottone e aggiorna il valore di basketOpen*/}
               <button className="header__basket-btn" onClick = {onBasketClick}>Carrello</button> 
               {/*5. Bottone Menu (modalità mobile) dove ogni volta, viene chiamata setMenuOpen che cambia menuOpen al 
                valore opposto di quello attuale (se è true diventa false e viceversa)*/}
               <button className="header__menu" onClick = {() => setMenuOpen(!menuOpen)}>
               <i className="fa-solid fa-bars"></i> {/*icona hamburger per menù*/}
               </button>    
               {/*6.Menù (modalità desktop)
               {menuOpen ? <MyMenu onBasketClick = {onBasketClick}/> : null } => ternario: se menuOpen 
                è true allora l'header renderizza il menu altrimenti no.
                passato anche onBasketClick a MyMenù per il secondo bottone Carrello*/}
               { menuOpen ? <MyMenu onBasketClick = {onBasketClick}/> : null }  
            </div>
        </header>
    );
}

export default MyHeader;