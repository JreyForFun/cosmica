"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchNasaAPOD = fetchNasaAPOD;
exports.fetchNasaAPODRange = fetchNasaAPODRange;
const errors_1 = require("../lib/errors");
async function fetchNasaAPOD() {
    const apiKey = process.env.NASA_API_KEY;
    if (!apiKey) {
        throw new errors_1.AppError(500, "NASA API key is not defined");
    }
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
    if (!response.ok) {
        const errorText = await response.text();
        throw new errors_1.AppError(response.status, `NASA API error: ${errorText}`);
    }
    return await response.json();
}
async function fetchNasaAPODRange(startDate, endDate) {
    const apiKey = process.env.NASA_API_KEY;
    if (!apiKey)
        throw new errors_1.AppError(500, "NASA API key is not defined");
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`);
    if (!response.ok) {
        const errorText = await response.text();
        throw new errors_1.AppError(response.status, `NASA API error: ${errorText}`);
    }
    return await response.json();
}
//# sourceMappingURL=nasaApod.service.js.map