class DbError extends Error{
    constructor(message){
        super(message)
        this.name = "DbError";
        this.message = message;
    }
}

export class RecordNotFoundError extends DbError{
    constructor(record){
        super(`Record Not Found - ${record}`)
        this.record = record;
        this.name = "RecordNotFound";
    }
}

export class RecordAlreadyExistsError extends DbError{
    constructor(record){
        super(`Record Already Exists - ${record}`)
        this.record = record;
        this.name = "RecordAlreadyExists";
    }
}