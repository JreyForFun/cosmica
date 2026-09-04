"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNasaIBL = getNasaIBL;
const nasaIBL_service_1 = require("../services/nasaIBL.service");
const errors_1 = require("../lib/errors");
async function getNasaIBL(req, res, next) {
    try {
        const query = typeof req.query.query === "string" ? req.query.query : null;
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
        const pageSize = typeof req.query.pageSize === "string" ? parseInt(req.query.pageSize) : 10;
        if (!query)
            throw new errors_1.AppError(400, "query is required");
        const images = await (0, nasaIBL_service_1.fetchNasaIBL)(query, page, pageSize);
        if (!images)
            throw new errors_1.AppError(500, "Failed to fetch images");
        res.status(200).json({
            success: true,
            images,
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=nasaIBL.controller.js.map