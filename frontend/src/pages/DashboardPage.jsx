import { useState } from "react";
import { createBook } from "../services/api";

export default function DashboardPage(){
    const[myForm, setMyForm] = useState({title: "", author:"", description:"", category:"", price: "", condition: "", image:""});
        //variabile di stato per i campi del form: in react il valore dei form viene mantenuto 
        //all'interno di uno stato => Single Source of Truth.
    const[error, setError] = useState("");


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
                            <option>come nuovo</option>
                            <option>ottimo</option>
                            <option>buono</option>
                            <option>accettabile</option>
                            <option>scadente</option>
                        </select>
                    </div>
                    <div className="create-book__form-field">
                        <label htmlFor="book-image">Immagine</label>
                        <input type="text" id="book-image" name="image" value={myForm.image} onChange={handleChange} required/>
                    </div>
                    <button type="submit" id="create-book__form-btn">Aggiungi</button>
                </form>
            </div>
        </div>
    )
}