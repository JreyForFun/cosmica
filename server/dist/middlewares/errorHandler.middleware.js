"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const logger_1 = require("../lib/logger");
const errors_1 = require("../lib/errors");
function errorHandler(err, req, res, next) {
    if (err instanceof errors_1.AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
        return;
    }
    logger_1.logger.error({ err }, "Unhandled error");
    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
}
//# sourceMappingURL=errorHandler.middleware.js.map