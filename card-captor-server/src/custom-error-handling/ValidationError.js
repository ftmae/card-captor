class ValidationError extends Error {
    constructor(message){
        super(message);
        this.name = "ValidationError";
    }
}

export class MissingFieldError extends ValidationError{
    constructor(field){
        super(`Missing Required Field - ${field}`);
        this.name = "MissingFieldError";
        this.field = field
    }
}

export class InvalidFieldError extends ValidationError{
    constructor(field){
        super(`Invalid Field - ${field}`);
        this.name = "InvalidFieldError";
        this.field = field;
    }
};
