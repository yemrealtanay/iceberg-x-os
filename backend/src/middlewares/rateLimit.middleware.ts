import { Request, Response, NextFunction } from 'express';

interface Bucket {
  count: number;
  resetAt: number;
}

interface RateLimitOptions {
  /** Window length in milliseconds. */
  windowMs: number;
  /** Maximum requests allowed per client within the window. */
  max: number;
  /** Message returned once the limit is exceeded. */
  message?: string;
}

/**
 * Minimal fixed-window rate limiter kept in process memory. The app runs as a
 * single instance, so an in-memory counter is enough and avoids adding a
 * dependency to the production image. Protects the login and public
 * application endpoints, which previously had no brute-force or spam limit.
 */
export function rateLimit({ windowMs, max, message }: RateLimitOptions) {
  const buckets = new Map<string, Bucket>();

  // Drop expired buckets periodically so the map cannot grow without bound.
  const sweeper = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }, windowMs);
  sweeper.unref?.();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    bucket.count += 1;

    if (bucket.count > max) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
      res.setHeader('Retry-After', String(retryAfter));
      return res.status(429).json({
        error: message || 'Too many requests. Please try again later.'
      });
    }

    return next();
  };
}

/** 10 login attempts per IP per 15 minutes. */
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts. Please try again in a few minutes.'
});

/** 5 public applications per IP per hour. */
export const applicationRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Too many applications submitted. Please try again later.'
});
