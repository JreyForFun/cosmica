import {Request, Response, NextFunction} from 'express'
import NodeCache from 'node-cache'

const RATE_LIMIT_WINDOW_IN_SECONDS = 60
const RATE_LIMIT_MAX_REQUESTS = 5

const cacheLimiter = new NodeCache({ stdTTL: RATE_LIMIT_WINDOW_IN_SECONDS }) as NodeCache & {
  incr(key: string): number
}
export async function RateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
){
  try{

    const ip = req.ip || '';
    const rateLimiterKey = `rate_limit:tasks:${ip}`

    let requestCount = cacheLimiter.get<number>(rateLimiterKey);

    if (requestCount === undefined) {
      cacheLimiter.set(rateLimiterKey, 1);
      requestCount = 1;
    } else {
      requestCount = cacheLimiter.incr(rateLimiterKey);
    }

    res.setHeader("X-RateLimit-Limit", RATE_LIMIT_MAX_REQUESTS)
    res.setHeader("X-RateLimit-Remaining",
      Math.max(0, RATE_LIMIT_MAX_REQUESTS - requestCount)
    )

    if(requestCount > RATE_LIMIT_MAX_REQUESTS){
      return res.status(429).json({
        success:false,
        message: "Too many request. Please try again later"
      })
    }

    next()
  }catch(error){
    console.error("rate limit node-cache error", error);
    next(error)
  }
}