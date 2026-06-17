import React from 'react';
import ReactDOM from 'react-dom/client';

import {BrowserRouter} from "react-router-dom";
//serve per gestire la navigazione tra le pagine direttamente nel browser
//senza ricaricare l'intera pagina (SPA, Single Page Application)

import App from './App';
import './App.css';


//Il metodo ReactDOM.createRoot crea una root per l'applicazione React e 
//accetta come parametro un elemento del DOM. In questo caso il div con id
//"root" in index.html (qui verrà renderizzata l'app React nel DOM). 
//Creata la root per l'app React, viene chiamato il metodo render per 
//appunto renderizzare l'applicazione. 
//Il componente App è inserito all'interno del componente BrowserRouter 
//in modo che possa accedere al contesto di routing.
//React.StrictMode è un componente che aiuta ad identificare problemi nell'app
//durante lo sviluppo. 

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
        <App />
        </BrowserRouter>
    </React.StrictMode>
)
