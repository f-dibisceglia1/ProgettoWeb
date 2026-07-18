import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {useAuth} from "../context/AuthContext";

export default function LoginPage(){
    const [isRegister, setIsRegister] = useState(false);
    //variabile di stato per passare dal form Accedi al form Registrati e viceversa

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    //variabili di stato per i campi del form: in react il valore dei form viene mantenuto 
    //all'interno di uno stato => Single Source of Truth.

    const [loading, setLoading] = useState(false);
    const[error, setError] = useState("");

    const {login, register} = useAuth();

    async function handleSubmit(e){
        e.preventDefault();
        setLoading(true);
        setError("");

        try{
            if(isRegister){
                await register(name, email, password);
            }else{
                await login(email, password);
            }
            navigate("/");
        }catch(err){
            setError(err.message);
        }finally{
            setLoading(false);
        }
    }
    
    return (
        <div className="form__container">
            <h1>{isRegister ? "Registrati" : "Accedi"} </h1>
            {/*se isRegister = true il titolo sarà "Registrati" altrimenti "Accedi"*/}
            {error && <p className="login__error">{error}</p>}
            <form onSubmit={handleSubmit}>
                {isRegister &&
                  <div className="form__field">
                      <label htmlFor="username-input">Username</label>
                      <input type="text" id="username-input" value={name} required onChange={(e) => setName(e.target.value)}/>
                  </div>
                }
                {/*se isRegister = true si triggerà il rendering del campo username*/}
                <div className="form__field">
                    <label htmlFor="email-input">Email</label>
                    <input type="email" id="email-input" value={email} required onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="form__field">
                    <label htmlFor="password-input">Password</label>
                    <input type="password" id="password-input" minLength={8} value={password} required onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className="form__action">
                    <button type="submit" id="form__action-btn" disabled={loading}>
                        {isRegister ? "Registrati" : "Accedi"}
                    </button>
                </div>
            </form>
            {loading && <p>Attendere...</p>}

            <p className="form__switch">
                {isRegister ? "Hai già un account?" : "Non hai un account?"}
                {/*se isRegister = true apparirà la scritta "Hai già un account?" altrimenti "Non hai un account?"*/}
                <button type="button" id="form__switch-btn" onClick={() => {setIsRegister(!isRegister); setError("");}}>
                    {/*cliccando su Accedi/Registrati (cambia in base al valore di isRegister) si cambia 
                    il valore di isRegister al suo opposto*/}
                    {isRegister ? "Accedi" : "Registrati"}                    
                </button>
            </p>
        </div>
    )
}