import { useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";



export default function HomePage({books}){
    return (
        <>
             <div className="main__banner"> 
              <h2 className="main__banner-text">Il mercato dei libri universitari</h2>
             </div>
             <div className="products__container">
                {books.map(book => (
                    <BookCard book={book} />
                ))}
             </div>
        </>
    )
}