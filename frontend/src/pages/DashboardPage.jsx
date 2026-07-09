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
    const[books, setBooks] = useState([]);
    const[orders, setOrders] = useState([]);

    const[editingId, setEditingId] = useState(null);
    const[editingOrderId, setEditingOrderId] = useState(null);

    const[myUpdateForm, setMyUpdateForm] = useState({title: "", author:"", description:"", category:"", price: "", condition: "come nuovo", available: true, image:""});
    const[status, setStatus] = useState("in elaborazione");    


    function handleChange(e){
       setMyForm({...myForm, [e.target.name]: e.target.value})
    }

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
            await createBook(bookData);
            setMyForm({title: "", author:"", description:"", category:"", price: "", condition: "come nuovo", image:""});
        }catch(err){
            setError(err.message);
        }
    }
    
    useEffect(() => {
        async function findBook(){
        setError("");

        if (!search.trim()) {
            setBooks([]);
            return;
        }

        try{
            const data = await listBooks({q: search, category: ""});
            setBooks(data);
        }catch(e){
            setError(e.message);
        }
    }
    findBook();
    }, [search]);
    
    async function handleDelete(id) {
        setError("");

        try {
            await deleteBook(id); 
            
            //aggiorna lo stato rimuovendo il libro eliminato dal display
            setBooks(books.filter(book => book._id !== id));

            setSearch("");
        } catch(err) {
            setError(err.message);
        }
    }

    function handleEditing(book){
        setEditingId(book._id);
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
    }

    function handleUpdateChange(e){
        setMyUpdateForm({...myUpdateForm, [e.target.name]: e.target.value});
    }

    async function handleUpdateSubmit(e, id){
    e.preventDefault();
    setError("");

    try{
        const updated = await updateBook(id, {
            ...myUpdateForm
        });
        // sostituisce il libro modificato nella lista senza rifare la fetch
        setBooks(prev => prev.map(book => book._id === id ? updated : book));
        setEditingId(null);
    }catch(err){
        setError(err.message);
    }
}

useEffect(() => {
    async function fetchOrders(){
        setError("");

        try{
            const data = await listOrders();
            setOrders(data);
        }catch(err){
            setError(err.message)
        }
    }
    fetchOrders();    
}, []);

function handleEditOrder(order){
    setEditingOrderId(order._id);
    setStatus(order.status);
}

async function handleStatusChange(e, orderId, newStatus){
    e.preventDefault();
    setError("");

    try{
        const updated = await updateOrderStatus(newStatus, orderId);
        setOrders(prev => prev.map(order => order._id === orderId ? {...order, status: updated.status} : order));
        setEditingOrderId(null);   
        //richiude il select dopo il salvataggio
    }catch(err){
        setError(err.message);
    }
}



    return(
        <div className="dashboard__container">
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
                        <textarea id="book-description" name="description" value={myForm.description} onChange={handleChange} required> </textarea>
                    </div>
                    <div className="create-book__form-field">
                        <label htmlFor="book-category">Categoria</label>
                        <input type="text" id="book-category" name="category" value={myForm.category} onChange={handleChange} required/>
                    </div>
                    <div className="create-book__form-field">
                        <label htmlFor="book-price">Prezzo</label>
                        <input type="text" id="book-price" name="price" value={myForm.price} onChange={handleChange} pattern="[0-9]{2}" required/>
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
                    {books.map((book) => {
                        const isEditingThisBook = editingId === book._id;
                        //confronta l'id del libro che voglio modificare con 
                        //l'id del libro che sto renderizzando adesso 
                        //il risultato è true solo per il libro giusto, false 
                        //per tutti gli altri

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
                                      <textarea id="book-description" name="description" value={myUpdateForm.description} onChange={handleUpdateChange} required> </textarea>
                                  </div>
                                  <div className="update-book__form-field">
                                      <label htmlFor="book-category">Categoria</label>
                                      <input type="text" id="book-category" name="category" value={myUpdateForm.category} onChange={handleUpdateChange} required/>
                                 </div>
                                 <div className="update-book__form-field">
                                     <label htmlFor="book-price">Prezzo</label>
                                     <input type="text" id="book-price" name="price" value={myUpdateForm.price} onChange={handleUpdateChange} pattern="[0-9]{2}" required/>
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
                {orders.length === 0 && <p>Nessun ordine effettuato.</p>}
                {orders.map((order) => {
                    const isEditingThisOrder = editingOrderId === order._id;

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