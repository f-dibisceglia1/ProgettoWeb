import { useParams } from "react-router-dom";
//useParams è un hook che permette al componente di accedere ai 
//parametri dell'URL
import { useEffect } from "react";
import { useState } from "react";
import { getBook } from "../services/api";
import { isInList, toggleCart } from "../utils/cart.js";

export default function BookDetailPage(){
    const {id} = useParams();
    //estrae l'id dall'URL 
    const [book, setBook] = useState(null);
    const [error, setError] = useState("");
    const [inCart, setInCart] = useState(false);

    useEffect(() => {
        async function fetchBook(){
            try{
                const data = await getBook(id);
                setBook(data);
            }catch(err){
                setError(err.message)
            }
        }
        fetchBook();
    }, [id]);

    function handleCart(){
        toggleCart(book._id);
        setInCart(prev => !prev);
    }

     if (!book) return <p className="empty-state">Libro non trovato.</p>;

    return (
        <div className="book-details__container">
            <img className="book__img" src={book.image} alt={book.title} />
            <div className="book__meta">
                <h1>{book.title}</h1>
                <p><span className="first-word">Autore/i:</span> {book.author}</p>
                <p><span className="first-word">Prezzo:</span> {book.price.toFixed(2)} €</p>
                <div><span className="first-word">Descrizione:</span>
                    <p>{book.description}</p>
                </div>
                <p><span className="first-word">Condizioni:</span> {book.condition}</p>
                <button type="button" className="book__cart-btn" onClick={handleCart}>
                    {inCart ? "Rimuovi dal carrello" : "Aggiungi al carrello"}
                </button>
            </div>
        </div>
    )
}