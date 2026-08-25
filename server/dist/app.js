"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = createServer;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_middleware_1 = require("./middlewares/errorHandler.middleware");
const notFound_middleware_1 = require("./middlewares/notFound.middleware");
const api_routes_1 = require("./routers/api.routes");
function createServer() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use('/api', api_routes_1.apiRouter);
    app.use(notFound_middleware_1.notFound);
    app.use(errorHandler_middleware_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map