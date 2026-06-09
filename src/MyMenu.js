import './MyMenu.css'
//Menù a scomparsa che si apre solo quando si clicca su icona menù in modalità mobile,
//posizionato sotto logo e barra di ricerca

function MyMenu({onBasketClick}){ {/*Riceve props contenente onBasketClick*/}
    return(
        <div className="menu">
            {/*1. Bottone Login (non ancora implementato)*/}
            <a href="#" className="menu__login"><span>Login</span></a>
            {/*2. Bottone Carrello che chiama onBasketClick quando cliccato*/}
            <button className="menu__basket-btn" onClick = {onBasketClick}>Carrello</button>  
        </div>  
    );
}

export default MyMenu;