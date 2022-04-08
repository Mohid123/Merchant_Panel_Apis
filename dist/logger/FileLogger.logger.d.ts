import { Logger } from '@nestjs/common';
export declare class FileLogger extends Logger {
    error(message: any, stack?: string, context?: string): void;
    log(message: any, ...optionalParams: any[]): void;
}
