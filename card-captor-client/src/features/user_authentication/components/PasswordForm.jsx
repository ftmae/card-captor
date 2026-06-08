import { useState } from 'react';
import { useSearchParams } from 'react-router';

import { useForgotPassword, useResetPassword } from '../hooks/useAuthenticate.jsx';
import { validateEmail, validatePassword } from '../utils.js';
import FormInput from './FormInput.jsx';
import './css/form.css';

export default function PasswordForm({type}){
    console.log(type);
    const {mutate: forgotPassword, isPending: isForgotPending} = useForgotPassword();
    const {mutate: resetPassword, isPending: isResetPending} = useResetPassword();
    const [searchParams] = useSearchParams();
    const [validation, setValidation] = useState([]);

    function handleSubmit(event){
        event.preventDefault();
        const formData = new FormData(event.target);

        if(type === "reset"){ 
            const token = searchParams.get('token');
            const email = searchParams.get('email');
            const password = formData.get('password');
            if(!validatePassword(password)){
                setValidation({password: "Password must be 12+ characters and include an uppercase, lowercase, numeric and special character"});
                return;
            }
            resetPassword({password, email, token});
        }

        if(type === "forgot"){
            const email = formData.get('email');
            if(!validateEmail(email)){
                setValidation({email: "Enter a valid E-Mail ID"});
                return;
            }
            forgotPassword(email);
        }

        setValidation([]);
    }

    return(
        <div className='flex-container-center min-height-100vh flex-column'>
            <form onSubmit={handleSubmit} className="auth-form">
                <h1 className="ff-serif">Reset Password</h1>
                {
                    type === "forgot" ? 
                        <>
                            <FormInput type="email" value="email"  placeholder="E-Mail"/>
                            {validation.email}
                        </>
                    : 
                        <>
                            <FormInput type="password" value="password" placeholder="Enter New Password"/>
                            {validation.password}
                        </>
                }
                <button className="small-button bg-dark-1 text-white border-trans" type="submit" disabled={isResetPending || isForgotPending}>
                    {isResetPending || isForgotPending ? 'Loading...' : type === "forgot" ? 'Send Reset Link' : 'Reset' }
                </button>
            </form>
        </div>
        
    )
}