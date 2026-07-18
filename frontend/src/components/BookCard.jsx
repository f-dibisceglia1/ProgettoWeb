import {isInList, toggleCart} from '../utils/cart.js';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function BookCard({book, onCartChange, isCart = false}){
    const [inCart, setInCart] = useState(() => isInList(book._id));
    //variabile di stato che registra se un prodotto è nel carrello o no
    //a useState è passata una callback che verifica se il prodotto è nel carrello
    //con la funzione isInList importata da cart.js
    

    //funzione per gestire il click sul bottone Aggiungi al carrello/Rimuovi dal carrello
    //a cui viene passato come parametro l'evento
    function handleCart(e){
        toggleCart(book._id);
        //chiama la funzione toggleCart importata da cart.js
        //che aggiunge/rimuove prodotti da localStorage 
        //e lancia l'evento custom
        setInCart(prev => !prev);
        //aggiorna lo stato di inCart al suo opposto
        onCartChange?.();
        //se passata come props viene chiamata
    }
    return(
        <article className={isCart ? "cart__product-card" :"product-card"}>
            {/*ProductCard deve essere visualizzato in un modo diverso nel carrello, quindi 
            si passa come props il valore isCart che di default è false, quando nel carrello 
            vengono renderizzati i prodotti si passa isCart={true} che da una classe diversa 
            in modo da poter definire delle regole diverse nel CSS*/}
            <Link to={`/books/${book._id}`} className={isCart ? "cart__product-link" : "product-card__link"}>
            <img className={isCart ? "cart__product-card__img" :"product-card__img"} src={book.image} alt={book.title} />
            <div className="product-card__info">
                <p className="product-card__name">{book.title}</p>
                <div className="product-card__meta">
                    <p>{book.author}</p>
                   <p>{book.price.toFixed(2)} €</p> 
                   <p>{book.condition}</p>
                </div>
            </div>
            </Link>
            <button type="button" className="product-card__cart-btn" onClick={handleCart}>{inCart ? "Rimuovi dal carrello" : "Aggiungi al carrello"}</button>
        </article>
    )
}