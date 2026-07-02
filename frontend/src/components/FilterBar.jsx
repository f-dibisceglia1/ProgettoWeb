const CATEGORIES = ["Ingegneria", "Giurisprudenza", "Economia", "Informatica", "Scienze", "Medicina", "Psicologia"];

export default function FilterBar({ category, onCategoryChange }) {
    return (
        <div className="filter-bar__container">
            <button
                className= "filter-bar-btn"
                onClick={() => onCategoryChange("")}
            >
                Tutti
            </button>
            {CATEGORIES.map(cat => (
                <button
                    key={cat}
                    className="filter-bar-btn"
                    onClick={() => onCategoryChange(cat)}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}