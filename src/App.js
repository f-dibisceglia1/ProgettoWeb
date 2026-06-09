import {useState} from 'react';
import './App.css';
import MyHeader from './MyHeader';
import MyFooter from './MyFooter';
import MyMain from './MyMain';

function App() {
   const [basketOpen, setBasketOpen] = useState(false);
   //creato una variabile basketOpen con valore iniziale false (useState(false)), 
   //setBasketOpen è la funzione per cambiarla
   //deve essere creata qui in App.js per poter passare basketOpen a main dove si trova il 
   //carrello

  return (
    <div className="App">
      <MyHeader onBasketClick ={() => setBasketOpen(!basketOpen)} />
        {/*passo a MyHeader la funzione per cambiare basketOpen, in questo modo si aggiorna
        qui la variabile che passo a MyMain */}
      <MyMain basketOpen={basketOpen} onBasketClick ={() => setBasketOpen(!basketOpen)}/>
      {/*passo basketOpen a MyMain */}
      <MyFooter />
    </div>
  );
}

export default App;
