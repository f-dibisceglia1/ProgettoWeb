import { useParams } from "react-router-dom";
//useParams è un hook che permette al componente di accedere ai 
//parametri dell'URL
import { useEffect } from "react";
import { useState } from "react";
import { getBook } from "../services/api";
import { isInList, toggleCart } from "../utils/cart.js";

//BookDetailPage:
//Immagine  -  Meta:
//             titolo
//             autore
//             prezzo
//             descrizione
//             condizioni
//             bottone aggiungi/rimuovi dal carrello

export default function BookDetailPage(){
    const {id} = useParams();
    //estrae l'id dall'URL 
    //cliccando sulla BookCard si naviga alla BookDetailPage
    //di quel libro. il path alla BookDetailPage è `/books/${book._id}`
    //quindi per generare una pagina con i dettagli di quello 
    //specifico libro serve estrarre l'id (perché l'api getBook richiede l'id) 
    //del libro dal path dell'URL
    const [book, setBook] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [inCart, setInCart] = useState(false);


    //alcuni componenti hanno necessità di sincronizzazione con sistemi esterni 
    //(ad esempio con un server per ricevere dati o inviare un log) 
    //quando il componente appare sullo schermo 
    //gli Effect permettono di eseguire codice subito dopo il primo 
    //rendering e dopo il re-rendering relativo ad alcune dipendenze
    //cioè useEffect(callback, dependencies) dice a React di
    //eseguire la callback dopo il render e di rieseguirla solo se uno 
    //dei valori nell'array dependencies è cambiato rispetto all'ultima volta
    useEffect(() => {
        async function fetchBook(){
            setLoading(true);
            setError("");

            try{
                const data = await getBook(id);
                //tramite getBook si riceve dal server il libro
                setBook(data);
                //lo stato book è aggiornato 
                setInCart(isInList(id));
                //sincronizza con lo stato reale del carrello
                //in questo modo se il libro è stato aggiunto al
                //carrello dalla HomePage quando ci si clicca sopra
                //il bottone che viene renderizzato è Rimuovi dal carrello
                //e non Aggiungi al carrello
            }catch(err){
                setError(err.message)
            }finally{
                setLoading(false);
            }
        }
        fetchBook();
    }, [id]);
    //ogni volta che si clicca su una BookCard diversa l'id cambia
    //e quindi si fa una fetch e si aggiorna lo stato book che triggera
    //il rerendering 

    function handleCart(){
        toggleCart(book._id);
        setInCart(prev => !prev);
    }

     if (loading) return <p className="empty-state">Caricamento...</p>;
     if (error) return <p className="empty-state">{error}</p>;
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