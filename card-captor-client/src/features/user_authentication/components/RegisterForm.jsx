import { useState } from "react";
import { useRegister } from '../hooks/useAuthenticate.jsx';
import { useNavigate } from 'react-router';
import { validateUsernamePassword, validateAll, validateEmailPassword } from '../utils.js';
import FormInput from './FormInput.jsx';
import RadioButtons from "../../../shared/components/RadioButtons/RadioButtons";
import AuthChange from "./AuthChange.jsx";
import './css/form.css';

export default function RegisterForm(){
    const navigate = useNavigate();
    const [validations, setValidations] = useState({});
    const {mutate: register, isPending, isError, error, reset} = useRegister();

    function handleSubmit(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get('email');
        const username = formData.get('username');
        const password = formData.get('password');
        const errors = validateAll(username, email, password);
        if(Object.keys(errors).length > 0){
            setValidations(errors);
            return;
        }
        register({username, email, password});
    }

    return(
        <div className="flex-container-center min-height-100vh flex-column">    
            <form onSubmit={handleSubmit} className="auth-form">
                <h1 className="ff-serif text-center mb-1">Register</h1>
                <FormInput type="text" value="username" placeholder="Username" />
                {validations.username && <p>{validations.username}</p>}
            
                <FormInput type="email" value="email"  placeholder="E-Mail"/>
                {validations.email && <p>{validations.email}</p>}

                <FormInput type="password" value="password"  placeholder="******"/>
                {validations.password && <p>{validations.password}</p>}

                <button className="small-button bg-dark-1 text-white border-trans" type="submit" disabled = {isPending}>
                    {isPending ? 'Authenticating...' : 'Register'}
                </button>
            </form>
            <AuthChange to="/login" linkText="Sign In" title="Already Have an Account?" />      
        </div>
    )
}