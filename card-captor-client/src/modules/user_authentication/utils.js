export function validateUsername(username){
    if(!username || username.trim() === '') return false;
    return true;
}

export function validateEmail(email){
    if(!email || email.trim() === '') return false
    const pattern = /^[A-Za-z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
    return pattern.test(email);
}

export function validatePassword(password){
    if(!password || password.trim() === ''|| password.length < 12) return false;
    const pattern = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])/ ;
    return pattern.test(password);
}

export function validateAll(username, email, password){
    let errors = {};
    if(!validateUsername(username)) errors.username = 'Enter a valid username';
    if(!validateEmail(email)) errors.email = 'Enter a valid E-Mail ID';
    if(!validatePassword(password)) errors.password = 'Password must be 12+ characters and include an uppercase, lowercase, numeric and special character';
    return errors;
}

export function validateUsernamePassword(username, password){
    let errors = {};
    if(!validateUsername(username)) errors.username = 'Enter username';
    if(!validatePassword(password)) errors.password = 'Enter a valid password';
    return errors;
}

export function validateEmailPassword(email, password){
    let errors = {};
    if(!validateEmail(email)) errors.email = 'Enter a valid E-Mail ID';
    if(!validatePassword(password)) errors.password = 'Enter a valid password';
    return errors;
}

export function validatePasswords(password, newPassword){
    let errors = {};
    if(!validatePassword(password)) errors.password = 'Enter valid password';
    if(!validatePassword(newPassword)) errors.newPassword = 'Password must be 12+ characters and include an uppercase, lowercase, numeric and special character';
    return errors;
}
