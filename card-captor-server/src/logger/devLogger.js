import { format, transports, createLogger } from 'winston';

const logFormat = format.printf(({timestamp, message, level, stack})=>{
    return `${timestamp} - ${level} - ${stack || message}`
});

export default function devLogger(){
    return createLogger({
        format: format.combine(
            format.colorize(),
            format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
            format.errors({stack: true}),
            logFormat,
        ),
        transports: [
            new transports.Console(),
        ]
    });
}