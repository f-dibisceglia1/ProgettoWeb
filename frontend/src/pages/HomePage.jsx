import { useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";
import FilterBar from "../components/FilterBar";



export default function HomePage({books, category, onCategoryChange}){
    return (
        <>
             <div className="main__banner"> 
             <h2 className="main__banner-text">Il mercato dei libri universitari</h2>
             </div>
             <FilterBar category={category} onCategoryChange={onCategoryChange} />
             <div className="products__container">
                {books.map(book => (
                    <BookCard book={book} />
                ))}
             </div>
        </>
    )
}