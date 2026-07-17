import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

import { getCart } from "../utils/cart.js";
import { toggleCart } from "../utils/cart.js";

import { createOrder } from "../services/api";
import { getBook } from "../services/api";
import { listBooks } from "../services/api";

import BookCard from "../components/BookCard.jsx";


export default function CartPage(){
    const navigate = useNavigate();
    const {user} = useAuth();

    const cartIds = getCart();
    //array degli id dei libri nel carrello

    const [cartBooks, setCartBooks] = useState([]);
    //variabile di stato per registrare quali libri sono nel carrello

    const[myForm, setMyForm] = useState({name: "", address: user?.address?.street || "", city: user?.address?.city || "", cap: user?.address?.zip || "", payment: "cash", cardNumber: ""});
    //variabile di stato per i campi del form: in react il valore dei form viene mantenuto 
    //all'interno di uno stato => Single Source of Truth.
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    function handleChange(e){
       setMyForm({...myForm, [e.target.name]: e.target.value})
       //copia myForm e sovrascrive solo la proprietà interessata
    }

    //alcuni componenti hanno necessità di sincronizzazione con sistemi esterni 
    //(ad esempio con un server per ricevere dati o inviare un log) 
    //quando il componente appare sullo schermo 
    //gli Effect permettono di eseguire codice subito dopo il primo 
    //rendering e dopo il re-rendering relativo ad alcune dipendenze
    //cioè useEffect(callback, dependencies) dice a React di
    //eseguire la callback dopo il render e di rieseguirla solo se uno 
    //dei valori nell'array dependencies è cambiato rispetto all'ultima volta
    useEffect(() => {
        async function fetchCartBooks(){
            setLoading(true);
            setError("");
            
            const cartIds = getCart();
            //recupera dal local storage gli id di ogni libro nel carrello
            if(cartIds.length === 0){
                setCartBooks([]);
                //se non ci sono libri nel carrello cartBooks è un array vuoto
                return;
                //e non fa la fetch
            }

            try{
                const allBooks = await listBooks();
                //recupera tutti i libri dal server
                const filteredBooks = allBooks.filter(book => cartIds.includes(book._id));
                //estrae solo i libri che sono nel carrello
                setCartBooks(filteredBooks);
            }catch(err){
                setError(err.message);
            }finally{
                setLoading(false);
            }
        }
        fetchCartBooks();
    }, []);


    //funzioni per calcolare il totale 
    const subtotal = cartBooks.reduce((acc, book) => acc + book.price, 0);
    const shipmentCost = subtotal > 0 ? 5 : 0;
    const total = subtotal + shipmentCost;
    

    //funzione per aggiornare lo stato cartProducts quando si clicca il bottone
    const handleCartBooks = (bookId) => {
        setCartBooks(prev => 
            prev.filter(book => book._id !== bookId)
            //lascia in cartProducts solo i prodotti con id diverso dal prodotto
            //che si vuole rimuovere, quindi si aggiorna lo stato cartProducts
        );
    };


    //funzione per effettuare l'"acquisto" e creare l'ordine
     async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        
        try {
            const items = cartBooks.map(book => ({ bookId: book._id }));
            //crea un array items contenente i libri nel carrello
            const shippingAddress = {
                street: myForm.address,
                city: myForm.city,
                zip: myForm.cap,
            };
            //crea un oggetto shippingAddress utilizzando le informazioni
            //di spedizione inserite nel form
            await createOrder(items, shippingAddress);
            //crea l'ordine 

            
            cartBooks.forEach(book => toggleCart(book._id));
            //svuota il local storage dopo l'acquisto riuscito
            navigate("/");
            //torna alla HomePage
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <>
        <h1 className="cart__title">Carrello</h1>
        <div className="cart__container">
             <div className="cart-products__container">
                 {loading && <p className="empty-state">Caricamento...</p>}
                 {!loading && cartBooks.map(book=> (
                 //fa il rendering solo dei prodotti in cartProducts    
                    <BookCard key={book._id} book={book} isCart={true} onCartChange={() => handleCartBooks(book._id)} />
                    //non c'è bisogno di mettere di nuovo onClick, perché è già definito nel componente
                    //quindi quando si clicca su Rimuovi dal carrello viene eseguita handleCart che fa tre cose:
                    //1. rimuove il prodotto da localStorage
                    //2. aggiorna lo stato inCart del componente ProductCard
                    //3. chiama la funzione onCartChange che gli stiamo passando, che in realtà è handleCartProducts
                    //   che aggiorna lo stato cartProducts e quindi triggera il rerendering 
                ))}            
            </div>
            <div className="cart__shipment-info">
                <form className="cart__form" onSubmit = {handleSubmit}>
                    <div className="cart__form-field">
                        <label htmlFor="shipment-name">Nome e cognome</label>
                        <input type="text" id="shipment-name" name="name" value={myForm.name} onChange={handleChange} required/>
                    </div>
                    <div className="cart__form-field">
                        <label htmlFor="shipment-address">Indirizzo di spedizione</label>
                        <input type="text" id="shipment-address" name="address" value={myForm.address} onChange={handleChange} required/>
                    </div>
                    <div className="cart__form-field">
                        <label htmlFor="shipment-city">Città</label>
                        <input type="text" id="shipment-city" name="city" value={myForm.city} onChange={handleChange} required/>
                    </div>
                    <div className="cart__form-field">
                        <label htmlFor="shipment-cap">CAP</label>
                        <input type="text" id="shipment-cap" name="cap" pattern="[0-9]{5}" value={myForm.cap} onChange={handleChange} required/>
                    </div>
                    <div className="cart__form-field">
                        <span>Metodo di pagamento:</span>
                        <div>
                             <input type="radio" id="payment-card" name="payment" value="card" checked={myForm.payment === "card"} onChange={handleChange}/>
                             <label htmlFor="payment-card">Carta di credito</label>
                        </div>
                        {myForm.payment === "card" && (
                            <>
                             <label htmlFor="card-number">Numero della carta</label>
                             <input type="text" id="card-number" name="cardNumber" minLength={16} maxLength={16} value={myForm.cardNumber} onChange={handleChange} required/>
                            </>
                        )}
                        {/*se {myForm.payment === "card" cioè se viene selezionato "Carta di credito", 
                        si triggera il rendering del campo per inserire il numero della carta di credito*/}
                        <div>
                             <input type="radio" id="payment-cash" name="payment" value="cash" checked={myForm.payment === "cash"} onChange={handleChange}/>
                             <label htmlFor="payment-cash">Contanti alla consegna</label>
                        </div>
                    </div>
                    <p className="cart__total">
                        Subtotale:  {subtotal.toFixed(2)} €
                        <br />
                        Spedizione: {shipmentCost.toFixed(2)} €
                        <br />
                        Totale: {total.toFixed(2)} €
                    </p>
                    {error && <p className="cart__error">{error}</p>}
                <button type="submit" id="cart__form-btn" disabled = {cartBooks.length === 0}>Acquista</button>
                </form>
            </div>
        </div>
        </>
    )
}