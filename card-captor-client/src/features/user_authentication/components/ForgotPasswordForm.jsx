import { useState, useEffect} from 'react';
import { useForgotPassword } from '../hooks/useAuthenticate.jsx';
import { validateEmail } from '../utils.js';
import FormInput from './FormInput.jsx';
import './css/form.css';

export default function ForgotPasswordForm(){
    const {mutate: forgotPassword, isPending: isForgotPending} = useForgotPassword();
    const [validation, setValidation] = useState([]);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timer, setTimer] = useState(60);

    useEffect(()=>{
        if(!isTimerRunning) return;
        const interval = setInterval(()=>{
            setTimer(prev=>{
                if(prev<=1){
                    clearInterval(interval);
                    setIsTimerRunning(false); 
                    return 0;
                }
                return prev-1;
            });
        }, 1000);
        return ()=> {
            clearInterval(interval);
            setTimer(60)
        }
    }, [isTimerRunning])

    function handleSubmit(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get('email');
        if(!validateEmail(email)){
            setValidation({email: "Enter a valid E-Mail ID"});
            return;
        }
        forgotPassword(email, {
            onSuccess: ()=> setIsTimerRunning(true)
        });
        setValidation([]);
    }

    return(
        <div className='flex-container-center min-height-100vh flex-column'>
            <form onSubmit={handleSubmit} className="auth-form">
                <h1 className="ff-serif">Reset Password</h1>
                <FormInput type="email" value="email"  placeholder="E-Mail"/>
                {validation.email}
                <button className={`small-button ${isTimerRunning || isForgotPending ? 'bg-light-1 text-dark-2 border-dark-2': 'bg-dark-1 text-white border-trans'}`} type="submit" disabled={isTimerRunning || isForgotPending}>
                    { 
                        isForgotPending ? 'Loading...' : isTimerRunning ? `00:${timer < 10 ? `0${timer}`: timer}` : 'Send Reset Link'
                    }
                </button>
            </form>
            {isTimerRunning && <p className='align-self-center'>Did not receive an e-mail? Try again after 60 seconds.</p>}
        </div>
        
    )
}