"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAPOD = getAPOD;
exports.getNasaAPODRange = getNasaAPODRange;
const nasaApodService = __importStar(require("../services/nasaApod.service"));
const errors_1 = require("../lib/errors");
async function getAPOD(req, res, next) {
    try {
        const apod = await nasaApodService.fetchNasaAPOD();
        if (!apod)
            throw new errors_1.AppError(500, "Failed to fetch APOD");
        res.status(200).json({
            success: true,
            apod
        });
    }
    catch (error) {
        next(error);
    }
}
async function getNasaAPODRange(req, res, next) {
    try {
        const startDate = typeof req.query.startDate === "string" ? req.query.startDate : null;
        const endDate = typeof req.query.endDate === "string" ? req.query.endDate : null;
        if (!startDate || !endDate) {
            throw new errors_1.AppError(400, "startDate and endDate are required");
        }
        const apod = await nasaApodService.fetchNasaAPODRange(startDate, endDate);
        if (!apod)
            throw new errors_1.AppError(500, "Failed to fetch APOD range");
        res.status(200).json({
            success: true,
            apod,
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=nasaApod.controller.js.map