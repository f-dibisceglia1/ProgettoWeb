import './MyMain.css';
import MyBanner from './MyBanner.js';

function MyMain({basketOpen, onBasketClick}){
           return( 
            <main className="main">
            {basketOpen ? <div className="main__basket-mobile"> Carrello vuoto </div> : null}
            {basketOpen ? <button className="main__basket-close-btn" onClick={onBasketClick}><i className="fa-solid fa-xmark"></i></button> : null}
            {basketOpen ? <div className="main__basket-desktop"> Carrello vuoto</div> : null}
            <div className="main__content">
                <MyBanner />
                <div className="main__categories">
                   <span className="main__categories-title"><h2>Trova i libri per la tua facoltà</h2></span>
                    <div className="main__categories-sections">
                       <section className="main__categories-courses">Lettere</section>
                       <section className="main__categories-courses">Ingegneria</section>
                       <section className="main__categories-courses">Medicina</section>
                       <section className="main__categories-courses">Filosofia</section>
                    </div>
            </div>
            </div>
        </main>
        );
}

export default MyMain;