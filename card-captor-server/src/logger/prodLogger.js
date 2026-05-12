import { format, transports, createLogger } from 'winston';

export default function prodLogger(){
    return createLogger({
        format: format.combine(
            format.timestamp(),
            format.errors({stack: true}),
            format.json(),
        ),
        transports: [
            new transports.Console(),
        ]
    });
}