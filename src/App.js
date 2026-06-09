import {useState} from 'react';
import './App.css';
import MyHeader from './MyHeader';
import MyFooter from './MyFooter';
import MyMain from './MyMain';

function App() {
   const [basketOpen, setBasketOpen] = useState(false);
   //creato una variabile di stato basketOpen per il carrello (la sidebar in modalità desktop e 
   //l'overlay in modalità mobile) con valore iniziale false (useState(false)), 
   //setBasketOpen è la funzione per cambiarla. 
   //creato la variabile qui in App.js perchè il valore di basketOpen è aggiornato ogni volta che 
   //si clicca il bottone Carrello in MyHeader (modalità desktop) e il bottone Carrello in MyMenu 
   //(modalità mobile), questo valore deve poi essere passato a MyMain per mostrare la sidebar o 
   //l'overlay. 

  return (
    <div className="App">
      <MyHeader onBasketClick ={() => setBasketOpen(!basketOpen)} />
        {/*passo a MyHeader, dove c'è il primo bottone Carrello, la funzione per cambiare basketOpen, 
        in questo modo si aggiorna qui la variabile che poi passo a MyMain per creare la sidebar*/}
      <MyMain basketOpen={basketOpen} onBasketClick ={() => setBasketOpen(!basketOpen)}/>
      {/*passo basketOpen a MyMain e passo la funzione per cambiare basketOpen per passarla anche
      a MyMenu dove c'è l'altro bottone Carrello*/}
      <MyFooter />
    </div>
  );
}

export default App;
