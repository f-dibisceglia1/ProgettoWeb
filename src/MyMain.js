import './MyMain.css';
import MyBanner from './MyBanner.js';

//Obiettivo:
//1. Main in modalità desktop: banner con immagine di sottofondo,
// righe di contenuti (es. riga con categorie di libri, 
// riga con libri aggiunti da poco, ecc...) e sidebar del carrello a scomparsa (quindi due colonne)
//2. Main in modalità mobile: unica colonna con banner e contenuti, overlay del carrello che 
//appare solo quando è cliccato il bottone con un bottone per chiuderlo

function MyMain({basketOpen, onBasketClick}){ {/*Riceve props contenente sia basketOpen che onBasketClick*/}
           return( 
            <main className="main"> 
            {/*1. Overlay carrello per modalità mobile
            {basketOpen ? <div className="main__basket-mobile"> Carrello vuoto </div> : null} => ternario:
            se basketOpen = true allora si crea l'overlay del carrello.
            ovviamente in questo caso, basketOpen = true perché è stato cliccato il bottone nel menù a scomparsa*/}
            {basketOpen ? <div className="main__basket-mobile"> Carrello vuoto </div> : null}
            {/*2. Bottone per chiudere l'overlay
            {basketOpen ? <button className="main__basket-close-btn" onClick={onBasketClick}><i className="fa-solid fa-xmark"></i></button> : null}
             => ternario: se basketOpen = true, si crea il bottone X per chiudere l'overlay e quando viene cliccato 
             viene chiamata onBasketClick che fa tornare basketOpen = false e sparisce l'overlay*/}
            {basketOpen ? <button className="main__basket-close-btn" onClick={onBasketClick}><i className="fa-solid fa-xmark"></i></button> : null}
            {/*3. Sidebar carrello per modalità mobile
            {basketOpen ? <div className="main__basket-desktop"> Carrello vuoto</div> : null} => ternario:
            se basketOpen = true allora si crea la sidebar del carrello.
            ovviamente in questo caso, basketOpen = true perché è stato cliccato il bottone nell'header*/}
            {basketOpen ? <div className="main__basket-desktop"> Carrello vuoto</div> : null}
            <div className="main__content">
               {/*4. Banner con foto in background e slogan sito*/}
                <MyBanner />
                {/*5. Righe di contenuti (bozza)*/}
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