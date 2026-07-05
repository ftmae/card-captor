import { useState } from "react";
import { useLogin } from '../hooks/useAuthenticate.jsx';
import { useNavigate, Link } from 'react-router';
import { validateUsernamePassword, validateAll, validateEmailPassword } from '../utils.js';
import FormInput from './FormInput.jsx';
import RadioButtons from "../../../shared/components/RadioButtons/RadioButtons";
import AuthChange from "./AuthChange.jsx";
import './css/form.css';

const options = [
    {key: '1-radio-username', id: 'usernameRadio', label:'Username', value: 'username'},
    {key: '2-radio-email', id: 'emailRadio', label:'E-Mail', value: 'email'},
];

export default function LoginForm(){
    const navigate = useNavigate();
    const [selected, setSelected] = useState('username');
    const [validations, setValidations] = useState({});
    const {mutate: login, isPending, isError, error, reset} = useLogin();

    function handleSubmit(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        const username = formData.get('username');
        const password = formData.get('password');
        const email = formData.get('email-login');
        const errors = selected === 'username' ? validateUsernamePassword(username, password) : validateEmailPassword(email, password);
        if(Object.keys(errors).length > 0){
            setValidations(errors);
            return;
        }
        selected === 'username' ? login({loginType: 'username', username, password }) : login({loginType: 'email', email, password});
    }

    return(
        <div className="flex-container-center min-height-100vh flex-column">    
            <form onSubmit={handleSubmit} className="auth-form">
                <h1 className="ff-serif text-center">Login</h1>
                <RadioButtons options={options} selected={selected} setSelected={setSelected} />
                {
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
                }

                <FormInput type="password" value="password"  placeholder="Password"/>
                {validations.password && <p>{validations.password}</p>}

                <button className="small-button bg-dark-1 text-white border-trans" type="submit" disabled = {isPending}>
                    {isPending ? 'Authenticating...' : 'Login'}
                </button>
                <Link to="/forgotPassword" className="text-dark-2 align-self-end mt-1 ">Forgot Password?</Link>
            </form>
            <AuthChange to="/register" linkText="Sign Up" title="Don't Have an Account?" />
        </div>
    )
}