const CATEGORIES = ["Ingegneria", "Giurisprudenza", "Economia", "Informatica", "Scienze", "Medicina", "Psicologia"];
//CATEGORIES è definito fuori dal componente perché è un dato costante,
//non cambia mai e non dipende da nessuna prop o stato quindi non ha 
//senso ricrearlo ad ogni render

export default function FilterBar({ category, onCategoryChange }) {
//a FilterBar sono passati come props category e onCategoryChange
    return (
        <div className="filter-bar__container">
            <button
                className= "filter-bar-btn"
                onClick={() => onCategoryChange("")}
            >
                Tutti
            </button>
            {/*cliccando su Tutti si resetta category alla
            stringa vuota iniziale*/}
            {CATEGORIES.map(cat => (
                //genera un bottone per ogni categoria 
                //nell'array CATEGORIES
                <button
                    key={cat}
                    //È buona pratica associare ad ogni elemento
                    //un attributo key univoco
                    //Questo aiuta React a fare più velocemente i confronti 
                    //tra due alberi quando deve aggiornare la UI
                    className="filter-bar-btn"
                    onClick={() => onCategoryChange(cat)}
                    //cliccando su una categoria si chiama onCategoryChange 
                    //passando il nome di quella categoria 
                    //che aggiornerà lo stato category in App.jsx e triggererà 
                    //una nuova fetch dei libri filtrati
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}