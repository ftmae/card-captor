import { useState } from 'react';
import { useNavigate } from 'react-router';
import useAuthenticate from '../hooks/useAuthenticate.jsx';
import { validateUsernamePassword, validateAll, validateEmailPassword } from '../utils.js';
import RadioButtons from '../../../shared/components/RadioButtons/RadioButtons.jsx';
import FormInput from './FormInput.jsx';
import './css/form.css';

const options = [
    {key: '1-radio-username', id: 'usernameRadio', label:'Username', value: 'username'},
    {key: '2-radio-email', id: 'emailRadio', label:'E-Mail', value: 'email'},
];

export default function AuthForm(){
    const navigate = useNavigate();
    const [validations, setValidations] = useState({});
    const [authState, setAuthState] = useState('login');
    const {mutate: authenticate, isPending, isError, error, reset} = useAuthenticate();
    const [selected, setSelected] = useState('username');

    function toggleAuthState(){
        setAuthState(prev=> prev==='login' ? 'register' : 'login');
    }

    async function handleSubmit(event){
        event.preventDefault();
        setValidations({});
        const formData = new FormData(event.target);
        const username = formData.get('username');
        const password = formData.get('password');
        const email = formData.get('email');
        const emailLogin = formData.get('email-login');
        const errors = authState === 'login' ? selected === 'username' ?  validateUsernamePassword(username, password) : validateEmailPassword(emailLogin, password) : validateAll(username, email, password)
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
                { authState === 'login' && <RadioButtons options={options} selected={selected} setSelected={setSelected} /> }
                {
                    authState === 'login' ?
                        selected === 'username' ? 
                        <>
                            <FormInput type="text" value="username" placeholder="Username" />
                            {validations.username && <p>{validations.username}</p>}
                        </>
                        :
                        <>
                            <FormInput type="email" value="email-login"  placeholder="E-Mail"/>
                            {validations.email && <p>{validations.email}</p>}
                        </>
                    :
                    <>
                        <FormInput type="text" value="username" placeholder="Username" />
                        {validations.username && <p>{validations.username}</p>}
                    </>
                }

                { authState === 'register' && 
                    <>
                        <FormInput type="email" value="email"  placeholder="E-Mail"/>
                        {validations.email && <p>{validations.email}</p>}
                    </>
                }
                <FormInput type="password" value="password"  placeholder="Password"/>
                {validations.password && <p>{validations.password}</p>}

                <button className="small-button bg-dark-1 text-white border-trans" type="submit" disabled = {isPending}>
                    {isPending ? 'Authenticating...' : authState === 'login' ? 'Login' : 'Register'}
                </button>
                { authState === 'login'  &&
                    <button type="button" className="small-button bg-trans text-dark-2 border-trans align-self-start" onClick={()=> navigate('/forgotPassword')}>Forgot Password?</button>
                }
        
            </form>
            <div className="flex-row align-center border-top-dark-1 padding-1">
                <p>{authState === 'login' ? "Don't Have An Account?" : "Already Have An Account?"}</p>
                <button className="small-button bg-dark-1 text-white border-trans" disabled = {isPending} onClick={toggleAuthState}>{authState === 'login' ? "Sign Up" : "Sign In"}</button>
            </div>
        </div>
    )
}