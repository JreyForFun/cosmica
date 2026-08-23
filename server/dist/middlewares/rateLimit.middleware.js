"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = RateLimiter;
const node_cache_1 = __importDefault(require("node-cache"));
const RATE_LIMIT_WINDOW_IN_SECONDS = 60;
const RATE_LIMIT_MAX_REQUESTS = 5;
const cacheLimiter = new node_cache_1.default({ stdTTL: RATE_LIMIT_WINDOW_IN_SECONDS });
async function RateLimiter(req, res, next) {
    try {
        const ip = req.ip || '';
        const rateLimiterKey = `rate_limit:tasks:${ip}`;
        let requestCount = cacheLimiter.get(rateLimiterKey);
        if (requestCount === undefined) {
            cacheLimiter.set(rateLimiterKey, 1);
            requestCount = 1;
        }
        else {
            requestCount = cacheLimiter.incr(rateLimiterKey);
        }
        res.setHeader("X-RateLimit-Limit", RATE_LIMIT_MAX_REQUESTS);
        res.setHeader("X-RateLimit-Remaining", Math.max(0, RATE_LIMIT_MAX_REQUESTS - requestCount));
        if (requestCount > RATE_LIMIT_MAX_REQUESTS) {
            return res.status(429).json({
                success: false,
                message: "Too many request. Please try again later"
            });
        }
        next();
    }
    catch (error) {
        console.error("rate limit node-cache error", error);
        next(error);
    }
}
//# sourceMappingURL=rateLimit.middleware.js.map