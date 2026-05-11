import { useState } from 'react';
import useAuthenticate from '../../hooks/useAuthenticate.jsx';
import './authform.css';

export default function AuthForm(){
    const [validations, setValidations] = useState({});
    const [authState, setAuthState] = useState('login');
    const {mutate: authenticate, isPending, isError, error, reset} = useAuthenticate();
    
    function toggleAuthState(){
        setAuthState(prev=> prev==='login' ? 'register' : 'login');
    }

    function validateUsername(username){
        if(!username || username.trim() === '') return false;
        return true;
    }

    function validateEmail(email){
        if(!email || email.trim() === '') return false
        const pattern = /^[A-Za-z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
        return pattern.test(email);
    }

    function validatePassword(password){
        if(!password || password.trim() === ''|| password.length < 12) return false;
        const pattern = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])/ ;
        return pattern.test(password);
    }
    
    function validateRegister(username, email, password){
       let errors = {};
       if(!validateUsername(username)) errors.username = 'Enter a valid username';
       if(!validateEmail(email)) errors.email = 'Enter a valid E-Mail ID';
       if(!validatePassword(password)) errors.password = 'Password must be 12+ characters and include an uppercase, lowercase, numeric and special character';
       return errors;
    }

    function validateLogin(username, password){
        let errors = {};
        if(!validateUsername(username)) errors.username = 'Enter username';
        if(!validatePassword(password)) errors.password = 'Enter password';
        return errors;
    }

    async function handleSubmit(event){
        event.preventDefault();
        setValidations({});
        const formData = new FormData(event.target);
        const username = formData.get('username');
        const password = formData.get('password');
        const email = formData.get('email');
        const errors = authState === 'login' ? validateLogin(username, password) : validateRegister(username, email, password)
        if(Object.keys(errors).length > 0){
            setValidations(errors);
            return;
        }
        authState === 'login' ? authenticate({authState, username, password}) : authenticate({authState, username, password, email});
    }

    return(
        <div className="flex-container-center min-height-100vh flex-column">
            <form onSubmit={handleSubmit} className="auth-form">
                <h1 className="ff-serif">{authState === 'login' ? 'Login' : 'Register'}</h1>
                <label htmlFor="username" className="sr-only">Username</label>
                <input className="textbox" type="text" name="username" id="username" placeholder="Username"/>
                {validations.username && <p>{validations.username}</p>}

                { authState === 'register' && 
                    <>
                        <label htmlFor="email" className="sr-only">E-Mail</label>
                        <input className="textbox" type="email" name="email" id="email" placeholder="E-Mail"/>
                        {validations.email && <p>{validations.email}</p>}
                    </>
                }

                <label htmlFor="password" className="sr-only">Password</label>
                <input className="textbox" type="password" name="password" id="password" placeholder="******"/>
                {validations.password && <p>{validations.password}</p>}

                <button className="small-button bg-dark-1 text-white" type="submit" disabled = {isPending}>
                    {isPending ? 'Authenticating...' : authState === 'login' ? 'Login' : 'Register'}
                </button>
            </form>
            <div className="flex-row align-center border-top-dark-1 padding-1">
                <p>{authState === 'login' ? "Don't Have An Account?" : "Already Have An Account?"}</p>
                <button className="small-button bg-dark-1 text-white" disabled = {isPending} onClick={toggleAuthState}>{authState === 'login' ? "Sign Up" : "Sign In"}</button>
            </div>
        </div>
    )
}