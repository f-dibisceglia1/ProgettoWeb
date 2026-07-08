import { useState } from "react";
import { useEffect } from "react";


import { createBook } from "../services/api";
import { listBooks } from "../services/api";
import { deleteBook } from "../services/api";

export default function DashboardPage(){
    const[myForm, setMyForm] = useState({title: "", author:"", description:"", category:"", price: "", condition: "come nuovo", image:""});
        //variabile di stato per i campi del form: in react il valore dei form viene mantenuto 
        //all'interno di uno stato => Single Source of Truth.
    const[error, setError] = useState("");

    const[search, setSearch] = useState("");
   const[books, setBooks] = useState([]);


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
                     placeholder="Cerca..." 
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     />
                </div>
                <div>
                    {books.map((book) => {
                        return(
                        <div key={book._id} className="dashboard__books">
                            <div className="dashboard__books-info">
                                <p>{book.title}</p>
                                <p>{book.author}</p>
                                <p>{book.price.toFixed(2)} €</p>
                                <p>{book._id}</p>
                            </div>
                            <div className="dashboard__books-actions">
                                <button type="button" onClick={() => handleDelete(book._id)}>Elimina</button>
                                <button type="button">Modifica</button>
                            </div>                            
                        </div>
                        )                        
                    })
                    }                
                </div>
            </div>
        </div>
    )
}