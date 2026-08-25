"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("./lib/logger");
const connectDb_1 = __importDefault(require("./config/connectDb"));
dotenv_1.default.config();
const app = (0, app_1.createServer)();
async function startServer() {
    await (0, connectDb_1.default)();
    app.listen(process.env.PORT, () => {
        logger_1.logger.info(`Server is running on port ${process.env.PORT}`);
    });
}
startServer().catch((error) => {
    logger_1.logger.error('Error starting server:', error);
});
//# sourceMappingURL=server.js.map