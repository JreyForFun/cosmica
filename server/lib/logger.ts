import pino from 'pino'

export const logger = pino({
    level: 'info',
    transport: process.env.NODE_ENV === 'development' ? undefined : {
        target : "pino-pretty",
        options : {
            colorize : true,
            translateTime : "SYS:standard",
        }
    }
});

