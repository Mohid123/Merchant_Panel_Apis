"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileLogger = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
class FileLogger extends common_1.Logger {
    error(message, stack, context) {
    }
    log(message, ...optionalParams) {
        fs.appendFileSync('errors.log', `\n${message}`);
    }
}
exports.FileLogger = FileLogger;
//# sourceMappingURL=FileLogger.logger.js.map