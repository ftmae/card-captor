export default class InvalidTokenError extends Error{
    constructor(message="Invalid Token"){
        super(message);
        this.message = message;
    }
}