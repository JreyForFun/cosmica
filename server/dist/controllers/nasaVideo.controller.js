"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNasaVideos = getNasaVideos;
const errors_1 = require("../lib/errors");
const nasaVideo_service_1 = require("../services/nasaVideo.service");
async function getNasaVideos(req, res, next) {
    try {
        const query = typeof req.query.query === "string" ? req.query.query : null;
        const page = typeof req.query.page === "string" ? parseInt(req.query.page, 10) : 1;
        const pageSize = typeof req.query.pageSize === "string" ? parseInt(req.query.pageSize, 10) : 10;
        if (!query)
            throw new errors_1.AppError(400, "query is required");
        res.status(200).json({
            success: true,
            videos: await (0, nasaVideo_service_1.fetchNasaVideos)(query, page, pageSize),
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=nasaVideo.controller.js.map