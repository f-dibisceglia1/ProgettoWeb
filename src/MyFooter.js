import './MyFooter.css';

function MyFooter(){
    return(
        <footer className="footer">
            <div className="footer__container">
                <p className="footer__text">&copy; 2026 UniShelf — Fondamenti del Web, <a href="https://www.poliba.it" className="footer__link" target="_blank" rel="noopener">Politecnico di Bari</a></p>
            </div>
        </footer>
    );
}

export default MyFooter;