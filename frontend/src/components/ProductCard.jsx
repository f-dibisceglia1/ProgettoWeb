import {isInList, toggleCart} from '../utils/cart.js';
import { useState } from 'react';

export default function ProductCard({product, onCartChange, isCart = false}){
    const [inCart, setInCart] = useState(() => isInList(product.id));
    //variabile di stato che registra se un prodotto è nel carrello o no
    //a useState è passata una callback che verifica se il prodotto è nel carrello
    //con la funzione isInList importata da cart.js
     

    //funzione per gestire il click sul bottone Aggiungi al carrello/Rimuovi dal carrello
    //a cui viene passato come parametro l'evento
    function handleCart(e){
        toggleCart(product.id);
        //chiama la funzione toggleCart importata da cart.js
        //che aggiunge/rimuove prodotti da localStorage 
        //e lancia l'evento custom
        setInCart(prev => !prev);
        //aggiorna lo stato di inCart al suo opposto
        onCartChange?.();
    }
    return(
        <article className={isCart ? "cart__product-card" :"product-card"}>
            {/*ProductCard deve essere visualizzato in un modo diverso nel carrello, quindi 
            si passa come props il valore isCart che di default è false, quando nel carrello vengono renderizzati
            i prodotti si passa isCart={true} che da una classe diversa in modo da poter definire delle regole diverse 
            nel CSS*/}
            <img className="product-card__img" src={product.image} alt={product.name} />
            <div className="product-card__info">
                <p className="product-card__name">{product.name}</p>
                <div className="product-card__meta">{product.price} €</div>
            <button type="button" id="product-card__cart-btn" onClick={handleCart}>{inCart ? "Rimuovi dal carrello" : "Aggiungi al carrello"}</button>
            </div>
        </article>
    )
}