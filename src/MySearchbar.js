import './MySearchbar.css'

function MySearchbar(){
    return(
        <div className="header__searchbar">
                    <i className="header__searchbar-icon fa-solid fa-magnifying-glass"></i>
                    <label htmlFor="search-input" aria-label="Cerca"></label>
                    <input type="search" id="search-input" className="header__searchbar-input" placeholder="Cerca..."/>
        </div>
    );
}

export default MySearchbar;