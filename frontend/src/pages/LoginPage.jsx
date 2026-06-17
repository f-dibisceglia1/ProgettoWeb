import { useNavigate } from "react-router-dom";
import { useState } from "react";


export default function LoginPage(){
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    return (
        <div className="form__container">
            <h1>{isRegister ? "Registrati" : "Accedi"} </h1>
            <form>
                {isRegister &&
                  <div className="form__field">
                      <label htmlFor="username-input">Username</label>
                      <input type="text" id="username-input" value={username} required onChange={(e) => setUsername(e.target.value)}/>
                  </div>
                }
                <div className="form__field">
                    <label htmlFor="email-input">Email</label>
                    <input type="email" id="email-input" value={email} required onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="form__field">
                    <label htmlFor="password-input">Password</label>
                    <input type="password" id="password-input" minLength={8} value={password} required onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className="form__action">
                    <button type="submit" id="form__action-btn">
                        {isRegister ? "Registrati" : "Accedi"}
                    </button>
                </div>
            </form>

            <p className="form__switch">
                {isRegister ? "Hai già un account?" : "Non hai un account?"}
                <button type="button" id="form__switch-btn" onClick={() => setIsRegister(!isRegister)}>
                    {isRegister ? "Accedi" : "Registrati"}
                </button>
            </p>
        </div>
    )
}