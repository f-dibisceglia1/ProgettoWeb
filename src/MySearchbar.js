import './MySearchbar.css'

function MySearchbar(){
    return(
        <div className="header__searchbar">
            {/*1. Icona lente di ingrandimento*/}
            <i className="header__searchbar-icon fa-solid fa-magnifying-glass"></i>
            <label htmlFor="search-input" aria-label="Cerca"></label>
            {/*2. Input search per barra di ricerca*/}
            <input type="search" id="search-input" className="header__searchbar-input" placeholder="Cerca..."/>
        </div>
    );
}

export default MySearchbar;