const API_BASE = "/api/v1";


//funzione helper per semplificare il processo di richiesta alle API del server
//accetta due parametri:
//1. l'endpoint
//2. un oggetto options (può includere method, headers, body, ...)
//la funzione manda una fetch allo specifico endpoint aggiungendo /api/v1 all'url 
//e invia il cookie per l'autenticazione tramite credentials: 'include' (i token di accesso sono memorizzati nei cookie)
async function request(endpoint, options = {}) {
    const headers = { "Content-Type": "application/json", ...options.headers };
    //crea un header Content-Type : application/json per comunicare al server il tipo dei dati
    //(application/json è un MIME type --> application è il tipo principale, json il sottotipo)
    //lo spread operator serve ad aggiungere all'oggetto headers gli options.headers passati come 
    //parametro alla funzione

    const res = await fetch(`${API_BASE}${endpoint}`, { 
    //fetch a /api/v1/url_endpoint
        ...options, 
        headers,
        credentials: 'include' // invia automaticamente il cookie
        //con lo spread operator prende tutte le opzioni ricevute e 
        //ci aggiunge headers e credentials
    });

    const data = await res.json();
    //trasforma la risposta ricevuta in un oggetto json
    if (!res.ok) throw new Error(data.message || "Errore del server");
    //se la richiesta non è andata a buon fine lancia un errore 
    //(se il server ha inviato un messaggio di errore mostra quello 
    //altrimenti mostra "Errore del server")
    return data;
    //se tutto è andato bene restituisce data
}

export async function login(email, password){
    return request("/auth/login", {
    //manda credenziali all'endpoint /auth/login
        method: "POST",
        //usa il metodo POST in modo da poter mettere le credenziali nel body
        body: JSON.stringify(
            {
                email, 
                password
            }
        ),
    });
}

export async function register(name, email, password){
    return request("/auth/register", {
        method: "POST",
        body: JSON.stringify(
            {
                name, 
                email,
                password
            }
        ),
    });
}

export async function logout() {
    return request("/auth/logout", { 
        method: "POST" 
    });
}

export async function me() {
    return request("/auth/me");
}