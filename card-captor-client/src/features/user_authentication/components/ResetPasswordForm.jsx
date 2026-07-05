import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useResetPassword } from '../hooks/useAuthenticate.jsx';
import { validateEmail, validatePassword } from '../utils.js';
import FormInput from './FormInput.jsx';
import './css/form.css';

export default function ResetPasswordForm(){
    const {mutate: resetPassword, isPending: isResetPending} = useResetPassword();
    const [searchParams] = useSearchParams();
    const [validation, setValidation] = useState([]);

    function handleSubmit(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        const password = formData.get('password');
        if(!validatePassword(password)){
            setValidation({password: "Password must be 12+ characters and include an uppercase, lowercase, numeric and special character"});
            return;
        }
        resetPassword({password, email, token});
        setValidation([]);
    }

    return(
        <div className='flex-container-center min-height-100vh flex-column'>
            <form onSubmit={handleSubmit} className="auth-form">
                <h1 className="ff-serif">Reset Password</h1>
                <FormInput type="password" value="password" placeholder="Enter New Password"/>
                {validation.password}
                <button className={`small-button ${isResetPending ? 'bg-light-1 text-dark-2 border-dark-2': 'bg-dark-1 text-white border-trans'}`} type="submit" disabled={isResetPending}>
                    {isResetPending  ? 'Loading...' : 'Reset' }
                </button>
            </form>
        </div>
        
    )
}