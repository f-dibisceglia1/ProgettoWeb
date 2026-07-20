import { useState } from "react";
import { useEffect } from "react";


import { createBook } from "../services/api";
import { listBooks } from "../services/api";
import { deleteBook } from "../services/api";
import { updateBook } from "../services/api";
import { listOrders } from "../services/api";
import { updateOrderStatus } from "../services/api";

export default function DashboardPage(){
    const[myForm, setMyForm] = useState({title: "", author:"", description:"", category:"", price: "", condition: "come nuovo", image:""});
        //variabile di stato per i campi del form: in react il valore dei form viene mantenuto 
        //all'interno di uno stato => Single Source of Truth.
    const[error, setError] = useState("");

    const[search, setSearch] = useState("");
    //variabile di stato per registrare l'input di ricerca 
    //dell'admin per trovare il libro che vuole modificare
    const[books, setBooks] = useState([]);
    //variabile di stato per registrare i libri che soddisfano
    //la ricerca
    const [booksLoading, setBooksLoading] = useState(false);
    const[orders, setOrders] = useState([]);
    //variabile di stato per registrare tutti gli ordini
    //di tutti gli utenti
    const [ordersLoading, setOrdersLoading] = useState(true);

    const[editingId, setEditingId] = useState(null);
    const[editingOrderId, setEditingOrderId] = useState(null);
    //variabili di stato per registrare il libro e l'ordine
    //che si sta attualmente modificando e gestire quindi
    //il rendering del form 

    const[myUpdateForm, setMyUpdateForm] = useState({title: "", author:"", description:"", category:"", price: "", condition: "come nuovo", available: true, image:""});
    //variabile di stato per i campi del form: in react il valore dei form viene mantenuto 
    //all'interno di uno stato => Single Source of Truth.
    const[status, setStatus] = useState("in elaborazione"); 
    //variabile di stato per l'unico campo del form per modificare
    //lo stato dell'ordine  


    function handleChange(e){
       setMyForm({...myForm, [e.target.name]: e.target.value})
       //copia myForm e sovrascrive solo la proprietà interessata
    }

    //funzione per aggiungere un libro
    async function handleSubmit(e){
        e.preventDefault();
        setError("");

        try{
            const bookData = {
                title: myForm.title,
                author: myForm.author,
                description: myForm.description,
                category: myForm.category,
                price: myForm.price,
                condition: myForm.condition,
                available: true,
                image: myForm.image
            };
            //crea un oggetto bookData con i campi del form
            await createBook(bookData);
            //crea il libro 
            setMyForm({title: "", author:"", description:"", category:"", price: "", condition: "come nuovo", image:""});
            //il form si svuota
        }catch(err){
            setError(err.message);
        }
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
        async function findBook(){
            setBooksLoading(true);
            setError("");

            if (!search.trim()) {
                setBooks([]);
                setBooksLoading(false);
                return;
                //se search è vuota books è una stringa vuota
                //non procede con la fetch
           }

            try{
                const data = await listBooks({q: search, category: ""});
            //fa la fetch dei libri che soddisfano i parametri di ricerca
            //listBooks riceve anche category che in questo caso è una stringa
            //vuota 
                setBooks(data);
            //aggiorna books con i libri restituiti
            }catch(e){
                setError(e.message);
            }finally{
                setBooksLoading(false);
            }
    }
    findBook();
    }, [search]);


    //funzione per eliminare libri dal catalogo
    async function handleDelete(id) {
        setError("");

        try {
            await deleteBook(id); 
            
            setBooks(books.filter(book => book._id !== id));
            //aggiorna lo stato rimuovendo il libro eliminato 
            //dai risultati della ricerca

            setSearch("");
            //il campo torna vuoto
        } catch(err) {
            setError(err.message);
        }
    }

    //funzione per gestire il form per la modifica del libro
    function handleEditing(book){
        setEditingId(book._id);
        //setta editingId con l'id del libro da modificare
        setMyUpdateForm({
        title: book.title,
        author: book.author,
        description: book.description,
        category: book.category,
        price: book.price,
        condition: book.condition,
        available: book.available,
        image: book.image,
    });
    //riempie il form con i dati del libro così si può andare a modificare
    //direttamente il campo che si vuole cambiare e lasciare gli 
    //altri inalterati
    }

    function handleUpdateChange(e){
        setMyUpdateForm({...myUpdateForm, [e.target.name]: e.target.value});
        //copia myForm e sovrascrive solo la proprietà interessata
    }

    async function handleUpdateSubmit(e, id){
        e.preventDefault();
        setError("");

        try{
            const updated = await updateBook(id, {...myUpdateForm});
            setBooks(prev => prev.map(book => book._id === id ? updated : book));
            //sostituisce il libro modificato nella lista senza rifare la fetch
            setEditingId(null);
        }catch(err){
            setError(err.message);
        }
}

useEffect(() => {
    async function fetchOrders(){
        setOrdersLoading(true);
        setError("");

        try{
            const data = await listOrders();
            //ottiene la lista di tutti gli ordini
            setOrders(data);
        }catch(err){
            setError(err.message)
        }finally{
            setOrdersLoading(false);
        }
    }
    fetchOrders();    
}, []);

//funzione per gestire il form per la modifica dello stato
//dell'ordine
function handleEditOrder(order){
    setEditingOrderId(order._id);
    //setta orderId con l'id dell'ordine il cui stato
    //si vuole modificare
    setStatus(order.status);
    //setta la variabile di stato status con lo stato dell'ordine
}

//funzione per aggiornare lo stato dell'ordine
async function handleStatusChange(e, orderId, newStatus){
    e.preventDefault();
    setError("");

    try{
        const updated = await updateOrderStatus(newStatus, orderId);
        //aggiorna lo stato dell'ordine e riceve l'ordine 
        //aggiornato
        setOrders(prev => prev.map(order => order._id === orderId ? {...order, status: updated.status} : order));
        //aggiorna la lista degli ordini visualizzata dall'admin
        setEditingOrderId(null);   
        //richiude il select dopo il salvataggio
    }catch(err){
        setError(err.message);
    }
}



    return(
        <div className="dashboard__container">
            {error && <p className="cart__error">{error}</p>}
            <div className="dashboard__create-book">
                <h2>Aggiungi un libro al catalogo</h2>
                <form onSubmit={handleSubmit}>
                    <div className="create-book__form-field">
                        <label htmlFor="book-title">Titolo</label>
                        <input type="text" id="book-title" name="title" value={myForm.title} onChange={handleChange} required/>
                    </div>
                    <div className="create-book__form-field">
                        <label htmlFor="book-author">Autore/i</label>
                        <input type="text" id="book-author" name="author" value={myForm.author} onChange={handleChange} required/>
                    </div>
                    <div className="create-book__form-field">
                        <label htmlFor="book-description">Descrizione</label>
                        <textarea id="book-description" name="description" value={myForm.description} onChange={handleChange} required></textarea>
                    </div>
                    <div className="create-book__form-field">
                        <label htmlFor="book-category">Categoria</label>
                        <input type="text" id="book-category" name="category" value={myForm.category} onChange={handleChange} required/>
                    </div>
                    <div className="create-book__form-field">
                        <label htmlFor="book-price">Prezzo</label>
                        <input type="number" id="book-price" name="price" min="0" step="0.01" value={myForm.price} onChange={handleChange} required/>
                    </div>
                    <div className="create-book__form-field">
                        <label htmlFor="book-condition">Condizioni</label>
                        <select id="book-condition" name="condition" value={myForm.condition} onChange={handleChange} required>
                            <option value="come nuovo">come nuovo</option>
                            <option value="ottimo">ottimo</option>
                            <option value="buono">buono</option>
                            <option value="accettabile">accettabile</option>
                            <option value="scadente">scadente</option>
                        </select>
                    </div>
                    <div className="create-book__form-field">
                        <label htmlFor="book-image">Immagine</label>
                        <input type="text" id="book-image" name="image" value={myForm.image} onChange={handleChange} required/>
                    </div>
                    <button type="submit" id="create-book__form-btn">Aggiungi</button>
                </form>
            </div>
            <div className="dashboard__update-book">
                <h2>Aggiorna/elimina un libro</h2>
                <div className="dashboard__searchbar">
                     <label htmlFor="dashboard__search-input" aria-label="Cerca"></label>
                     <input 
                     type="search" 
                     id="dashboard__search-input" 
                     placeholder="Cerca il libro..." 
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     />
                </div>
                <div>
                    {booksLoading && <p>Ricerca in corso...</p>}
                    {!booksLoading && books.map((book) => {
                        const isEditingThisBook = editingId === book._id;
                        //quando si clicca su modifica su un certo libro 
                        //handleEditing setta editingId all'id di quel libro
                        //(l'id del libro che voglio modificare)
                        //quando con map vengono renderizzati i libri, 
                        //per ogni libro editingId è confrontato con l'id
                        //e se il confronto restituisce true per quel libro 
                        //e solo per quel libro isEditingThisBook è true e 
                        //quindi si apre il form per aggiornarlo

                        return(
                        <div key={book._id} className="dashboard__books">
                            <div className="dashboard__books-card">
                                <div className="dashboard__books-info">
                                     <p>{book.title}</p>
                                     <p>{book.author}</p>
                                     <p>{book.price.toFixed(2)} €</p>
                                     <p>{book.available ? "Disponibile" : "Non disponibile"}</p>
                                     <p>{book._id}</p>
                                </div>
                                <div className="dashboard__books-actions">
                                     <button type="button" onClick={() => handleDelete(book._id)}>Elimina</button>
                                     <button type="button" onClick={() => handleEditing(book)}>Modifica</button>
                                </div>      
                            </div>
                            <div className="update-book__form">
                                {isEditingThisBook && 
                                <form onSubmit={(e) => handleUpdateSubmit(e, book._id)}>
                                  <div className="update-book__form-field">
                                      <label htmlFor="book-title">Titolo</label>
                                      <input type="text" id="book-title" name="title" value={myUpdateForm.title} onChange={handleUpdateChange} required/>
                                  </div>
                                  <div className="update-book__form-field">
                                       <label htmlFor="book-author">Autore/i</label>
                                       <input type="text" id="book-author" name="author" value={myUpdateForm.author} onChange={handleUpdateChange} required/>
                                  </div>
                                  <div className="update-book__form-field">
                                      <label htmlFor="book-description">Descrizione</label>
                                      <textarea id="book-description" name="description" value={myUpdateForm.description} onChange={handleUpdateChange} required></textarea>
                                  </div>
                                  <div className="update-book__form-field">
                                      <label htmlFor="book-category">Categoria</label>
                                      <input type="text" id="book-category" name="category" value={myUpdateForm.category} onChange={handleUpdateChange} required/>
                                 </div>
                                 <div className="update-book__form-field">
                                     <label htmlFor="book-price">Prezzo</label>
                                     <input type="number" id="book-price" name="price" min="0" step="0.01" value={myUpdateForm.price} onChange={handleUpdateChange} required/>
                                 </div>
                                 <div className="update-book__form-field">
                                     <label htmlFor="book-condition">Condizioni</label>
                                     <select id="book-condition" name="condition" value={myUpdateForm.condition} onChange={handleUpdateChange} required>
                                           <option value="come nuovo">come nuovo</option>
                                           <option value="ottimo">ottimo</option>
                                           <option value="buono">buono</option>
                                           <option value="accettabile">accettabile</option>
                                           <option value="scadente">scadente</option>
                                     </select>
                                 </div>
                                 <div className="update-book__form-field update-book__form-field--checkbox">
                                       <label htmlFor="book-available">Disponibile</label>
                                       <input 
                                          type="checkbox" 
                                          id="book-available" 
                                          name="available" 
                                          checked={myUpdateForm.available} 
                                          onChange={(e) => setMyUpdateForm({...myUpdateForm, available: e.target.checked})}
                                        />
                                 </div>
                                 <div className="update-book__form-field">
                                      <label htmlFor="book-image">Immagine</label>
                                      <input type="text" id="book-image" name="image" value={myUpdateForm.image} onChange={handleUpdateChange} required/>
                                 </div>
                                 <button type="submit" id="update-book__form-btn">Salva</button>
                               </form>
                                }
                            </div>
                                                  
                        </div>
                        )                        
                    })
                    }                
                </div>
            </div>
            <div className="dashboard__orders">
                <h2>Storico ordini</h2>
                {ordersLoading && <p>Caricamento...</p>}
                {!ordersLoading && orders.length === 0 && <p>Nessun ordine effettuato.</p>}
                {!ordersLoading && orders.map((order) => {
                    const isEditingThisOrder = editingOrderId === order._id;
                    //stessa cosa di isEditingThisBook

                    return (
                    <div key={order._id} className="dashboard__order-card">
                        <div className="dashboard__order-info">
                        <p className="dashboard__order-date">
                            {new Date(order.createdAt).toLocaleDateString("it-IT")}
                        </p>
                        <p className="dashboard__order-user">
                         Cliente: {order.user?.name} ({order.user?.email})
                       </p>
                        <p className="dashboard__order-status">Stato: {order.status}</p>
                        <ul className="dashboard__order-items">
                            {order.items.map((item, idx) => (
                                <li key={idx}>{item.title}: {item.price.toFixed(2)} €</li>
                            ))}
                        </ul>
                        <p className="dashboard__order-total">Totale: {order.total.toFixed(2)} €</p>
                       </div>

                       <div className="dashboard__order-status-change">
                        <button type="button" id="status-change-btn" onClick={() => handleEditOrder(order)}>Aggiorna stato</button>
                        {
                         isEditingThisOrder
                          && (<form onSubmit={(e) => handleStatusChange(e, order._id, status)}> 
                            <select name="status" id="status-form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="in elaborazione">in elaborazione</option>
                                <option value="spedito">spedito</option>
                                <option value="consegnato">consegnato</option>
                                <option value="annullato">annullato</option>
                            </select>
                            <button type="submit" id="status-form-btn">Salva</button>
                        </form>)
                        }                  
                       </div>
                    </div>
                    );
                })}
                </div>
        </div>
    )
}