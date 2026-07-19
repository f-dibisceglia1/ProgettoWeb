const API_BASE =
  import.meta.env.VITE_API_URL || "/api/v1";

//funzione helper per semplificare il processo di richiesta alle API del server
//accetta due parametri:
//1. l'endpoint
//2. un oggetto options (può includere method, headers, body, ...)
//la funzione manda una fetch allo specifico endpoint aggiungendo /api/v1 all'url 
//e invia il cookie per l'autenticazione tramite credentials: "include" (i token di accesso sono memorizzati nei cookie)
async function request(endpoint, options = {}) {
    const headers = { "Content-Type": "application/json", ...options.headers };
    //crea un header Content-Type : application/json per comunicare al server il tipo dei dati
    //(application/json è un MIME type --> application è il tipo principale, json il sottotipo)
    //lo spread operator serve ad aggiungere all'oggetto headers gli options.headers passati come 
    //parametro alla funzione
    //quindi headers = {
    //         "Content-Type": "application/json",
    //          options.headers
    //       }

    const res = await fetch(`${API_BASE}${endpoint}`, { 
    //fetch a /api/v1/url_endpoint
        ...options, 
        headers,
        credentials: "include" // invia automaticamente il cookie
        //con lo spread operator prende tutte le opzioni ricevute e 
        //ci aggiunge headers e credentials
        //quindi options = {
        //       headers ={
        //         "Content-Type": "application/json",
        //          options.headers
        //         },
        //       credentials: "include"
        //       }
    });
    //res è una promise


    const data = await res.json(); //res.json() è un'altra promise
    //trasforma la risposta ricevuta in un oggetto json
    if (!res.ok) throw new Error(data.message || "Errore del server");
    //se la richiesta non è andata a buon fine lancia un errore 
    //(se il server ha inviato un messaggio di errore mostra quello 
    //altrimenti mostra "Errore del server")
    return data;
    //se tutto è andato bene restituisce data
}

//---------------AUTENTICAZIONE-------------------

//in server.js:
//- const authRoutes = require('./routes/auth.routes.js')
//- app.use('/api/v1/auth', authRoutes)
//quindi il parametro endpoint da passare alla funzione request sarà: 
// "/auth/..."


//funzione di login in auth.controller.js:
// - const { email, password } = req.body --> si aspetta email e password
// nel body della richiesta
//in auth.routes.js:
// - router.post('/login', login) --> si aspetta una post,
//endpoint da passare a request è "/auth/login"
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

//funzione register in auth.controller.js:
// - const { name, email, password } = req.body --> si aspetta nome, email e password
// nel body della richiesta
//in auth.routes.js:
// - router.post('/register', register) --> si aspetta una post,
//endpoint da passare a request è "/auth/register"
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

//in auth.routes.js:
// - router.post('/logout', logout) --> si aspetta una post,
//endpoint da passare a request è "/auth/logout"
export async function logout() {
    return request("/auth/logout", { 
        method: "POST" 
    });
}

//in auth.routes.js:
// - router.get('/me', requireAuth, me) --> si aspetta una get,
//endpoint da passare a request è "/auth/me"
//la funzione requireAuth del middleware auth.js 
//verifica che la richiesta provenga da un utente autenticato
export async function me() {
    return request("/auth/me", {
        method: "GET",
    });
}

//funzione updateProfile in auth.controller.js:
// - const { name, address } = req.body --> si aspetta nome e indirizzo
// nel body della richiesta
//in auth.routes.js:
// - router.put('/profile', requireAuth, updateProfile) --> si aspetta una put,
//endpoint da passare a request è "/auth/profile"
//la funzione requireAuth del middleware auth.js 
//verifica che la richiesta provenga da un utente autenticato
export async function updateProfile(name, address){
    return request("/auth/profile",{
        method: "PUT",
        body: JSON.stringify(
            {
               name,
               address
            }
        ),
    });
}

//---------------LIBRI-------------------

//in server.js:
//- const bookRoutes = require('./routes/book.routes.js')
//- app.use('/api/v1/books', bookRoutes)
//quindi il parametro endpoint da passare alla funzione request sarà: 
// "/books/..."

//funzione listBooks in book.controller.js:
// -  const { category, q } = req.query --> si aspetta categoria (da FilterBar) 
// e q (dalla barra di ricerca) nella query della richiesta//
//in book.routes.js:
// - router.get('/', listBooks) --> si aspetta una get,
//endpoint da passare a request è `/books${query}`
export async function listBooks(filter = {}){
    const params = new URLSearchParams();
    //new URLSearchParams() crea un nuovo oggetto URLSearchParams che è un oggetto 
    //nativo del browser usato per costruire la query string di un URL. 
    //le coppie chiave-valore si aggiungono con il metodo .set()
    //evitando di scrivere a mano stringhe con "&" e "=" (e gestendo automaticamente 
    //l'encoding di caratteri speciali/spazi nell'URL)

    if (filter.category) params.set("category", filter.category);
    //se filter.category non è vuoto aggiunge a params la coppia chiave-valore ("category", filter.category)
    if (filter.q) params.set("q", filter.q);
    //se filter.q non è vuoto aggiunge a params la coppia chiave-valore ("q", filter.q)

    const query = params.toString() ? `?${params}` : "";
    //params.toString() trasforma l'oggetto params in una 
    //stringa con ? davanti se filter non era vuoto (params.toString() ? `?${params}`)
    //se filter era vuoto (nessun category, nessun q) params.toString() 
    //restituisce una stringa vuota "" (: "")

    return request(`/books${query}`, {
        method: "GET",
    });
}


//funzione getBook in book.controller.js:
// -  const book = await Book.findById(req.params.id) --> 
//si aspetta l'id del libro nei parametri della richiesta
// - router.get('/:id', getBook) --> si aspetta una get,
//endpoint da passare a request è `/books/${id}`
export async function getBook(id){
    return request(`/books/${id}`, {
        method: "GET",
    });
}

//funzione createBook in book.controller.js:
// -  const { title, author, description, category, price, condition, available, image } = req.body --> 
// si aspetta un oggetto { title, author, description, category, price, condition, available, image }
//cioè un libro con tutti i parametri che deve avere un libro secondo il modello Book.js
//nel corpo della richiesta
//in book.routes.js:
// - router.post('/', requireAuth, requireAdmin, createBook) --> si aspetta una post,
//endpoint da passare a request è "/books"
//la funzione requireAuth del middleware auth.js 
//verifica che la richiesta provenga da un utente autenticato
//la funzione requireAdmin del middleware auth.js 
//verifica che la richiesta provenga da un admin
export async function createBook(bookData){
    return request("/books", {
        method: "POST",
        body: JSON.stringify(bookData),
    });  
}

//funzione updateBook in book.controller.js:
// -  const book = await Book.findById(req.params.id) --> 
//si aspetta l'id del libro nei parametri della richiesta
// - const fields = ['title', 'author', 'description', 'category', 'price', 'condition', 'available', 'image'];
//for (const f of fields) {
//  if (req.body[f] !== undefined) book[f] = req.body[f];
// }  --> si aspetta anche un oggetto con i dati da aggiornare nel corpo della richiesta
//in book.routes.js:
// - router.put('/:id', requireAuth, requireAdmin, updateBook) --> si aspetta una put,
//endpoint da passare a request è `/books/${id}`
//la funzione requireAuth del middleware auth.js 
//verifica che la richiesta provenga da un utente autenticato
//la funzione requireAdmin del middleware auth.js 
//verifica che la richiesta provenga da un admin
export async function updateBook(id, updateData){
    return request(`/books/${id}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
    });
}

//funzione deleteBook in book.controller.js:
// -  const book = await Book.findById(req.params.id) --> 
//si aspetta l'id del libro nei parametri della richiesta
//in book.routes.js:
// - router.delete('/:id', requireAuth, requireAdmin, deleteBook) --> si aspetta una delete,
//endpoint da passare a request è `/books/${id}`
//la funzione requireAuth del middleware auth.js 
//verifica che la richiesta provenga da un utente autenticato
//la funzione requireAdmin del middleware auth.js 
//verifica che la richiesta provenga da un admin
export async function deleteBook(id){
    return request(`/books/${id}`, {
        method: "DELETE",
    });
}

//---------------ORDINI-------------------

//in server.js:
//- const orderRoutes = require('./routes/order.routes.js')
//- app.use('/api/v1/orders', orderRoutes)
//quindi il parametro endpoint da passare alla funzione request sarà: 
// "/orders/..."

//funzione createOrder in order.controller.js:
// -  const { items, shippingAddress } = req.body --> 
//si aspetta i libri da aggiungere all'ordine e l'indirizzo di consegna
//nel corpo della richiesta
//in order.routes.js:
// - router.post('/', requireAuth, createOrder) --> si aspetta una post,
//endpoint da passare a request è "/orders"
//la funzione requireAuth del middleware auth.js 
//verifica che la richiesta provenga da un utente autenticato
export async function createOrder(items, shippingAddress){
    return request("/orders", {
        method: "POST",
        body: JSON.stringify(
            {
                items,
                shippingAddress,
            }
        ),
    });
}

//in order.routes.js:
// - router.get('/mine', requireAuth, myOrders) --> si aspetta una get,
//endpoint da passare a request è "/orders/mine"
//la funzione requireAuth del middleware auth.js 
//verifica che la richiesta provenga da un utente autenticato
export async function myOrders(){
    return request("/orders/mine", {
        method: "GET",
    });
}

//in order.routes.js:
// - router.get('/', requireAuth, requireAdmin, listOrders) --> si aspetta una get,
//endpoint da passare a request è "/orders"
//la funzione requireAuth del middleware auth.js 
//verifica che la richiesta provenga da un utente autenticato
//la funzione requireAdmin del middleware auth.js 
//verifica che la richiesta provenga da un admin
export async function listOrders(){
    return request("/orders", {
        method: "GET",
    });
}

//funzione updateOrderStatus in order.controller.js:
// -  const { status } = req.body --> si aspetta lo stato
//dell'ordine nel corpo della richiesta
// - const order = await Order.findById(req.params.id) --> si
//aspetta l'id del libro nei parametri della richiesta
//in order.routes.js:
// - router.put('/:id/status', requireAuth, requireAdmin, updateOrderStatus) --> 
//si aspetta una put, endpoint da passare a 
//request è `/orders/${id}/status`
//la funzione requireAuth del middleware auth.js 
//verifica che la richiesta provenga da un utente autenticato
//la funzione requireAdmin del middleware auth.js 
//verifica che la richiesta provenga da un admin
export async function updateOrderStatus(status, id){
    return request(`/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({status}),
    });
}
