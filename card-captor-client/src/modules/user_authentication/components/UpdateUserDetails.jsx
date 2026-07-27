import { validateUsernamePassword, validatePasswords } from '../utils.js';
import { useRouteLoaderData } from 'react-router';
import { useUpdateUser } from '../hooks/useAuthenticate.jsx';
import { useState } from 'react';
import RadioButtons from '../../../shared/components/RadioButtons/RadioButtons.jsx';
import FormInput from './FormInput.jsx';
import './css/form.css';

const options = [
    {key: '1-radio-username', id: 'username', label:'Username', value: 'username'},
    {key: '2-radio-password', id: 'password', label:'Password', value: 'password'},
];

export default function UpdateUserDetails(){
    const {mutate: updateUser, isPending} = useUpdateUser();
    const [validations, setValidations] = useState({});
    const user = useRouteLoaderData('root-protected');
    const [selected, setSelected] = useState('username');
        
    function handleSubmit(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        const username = formData.get('username');
        const password = formData.get('password');
        const newPassword = formData.get('newPassword');

        const errors = selected === 'username' ? validateUsernamePassword(username, password) : validatePasswords(password, newPassword);
        if(Object.keys(errors).length > 0){
            setValidations(errors);
            return;
        }
        if(selected === 'username'){
            updateUser({type: "username", username, password});
        } else{
            updateUser({type: "password", password, newPassword});
        }
    }

    return(
        <div className="flex-container-center min-height-100vh flex-column">
            <form onSubmit={handleSubmit} className='auth-form'>
                <h1 className="text-center ff-serif">Update Details</h1>
                <RadioButtons selected={selected} setSelected={setSelected} options={options} />
                { selected === 'username' && 
                    <>
                        <FormInput type="text" value="username" placeholder="Username" defaultValue={user.username} />
                        {validations.username && <p>{validations.username}</p>}
                    </>
                }

                <FormInput type="password" value="password"  placeholder="Password"/>
                {validations.password && <p>{validations.password}</p>}
            
                { selected === 'password' && 
                    <>
                        <FormInput type="password" value="newPassword"  placeholder="New Password"/>
                        {validations.newPassword && <p>{validations.newPassword}</p>}
                    </>
                }
                <button className="small-button bg-dark-1 text-white border-trans" type="submit" disabled = {isPending}>
                    {isPending ? 'Authenticating...' : 'Update'}
                </button>
            </form>
        </div>
    )
}