import { useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";
import FilterBar from "../components/FilterBar";

//HomePage:
//Banner
//FilterBar 
//BookCard (disposte in 2 colonne se modalità mobile 
//tramite grid nel CSS, oppure 5 colonne se modalità 
//desktop (width > 800px, gestito tramite media query))


export default function HomePage({books, error, category, onCategoryChange}){
//alla HomePage sono passati da App.jsx come props i libri da mostrare, 
//category e setCategory come category e onCategoryChange perché 
//nella HomePage c'è la FilterBar che permette all'utente di 
//filtrare i libri per categoria. Quando viene selezionata una categoria
//lo stato category si aggiorna e triggera lo useEffect per 
//aggiornare i libri da mostrare nella HomePage

    return (
        <>
             <div className="main__banner"> 
             <h2 className="main__banner-text">Trova i tuoi libri universitari usati in un click</h2>
             </div>
             <FilterBar category={category} onCategoryChange={onCategoryChange} />
             {/*a FilterBar sono passati come props category e onCategoryChange*/}
             {error && <p className="home__error">{error}</p>}
             <div className="products__container">
                {books.map(book => (
                    <BookCard key={book._id} book={book} />
                    //È buona pratica associare ad ogni componente
                    //un attributo key univoco
                    //Questo aiuta React a fare più velocemente i confronti 
                    //tra due alberi quando deve aggiornare la UI
                    //per ogni libro nello stato books in App.jsx viene
                    //renderizzata una BookCard a cui viene passato come 
                    //props il libro
                ))}
             </div>
        </>
    )
}