import { Response } from 'express';
import { CUBE_NUMBER_WIDTH, MAX_SCORE, MIN_SCORE } from '../config/constants';

/**
 * Error thrown by route handlers when the client is at fault. Its message is
 * safe to return verbatim; anything else is replaced with a generic message so
 * Prisma internals and table names never reach the client.
 */
export class HttpError extends Error {
  constructor(public status: number, message: string, public details?: any) {
    super(message);
    this.name = 'HttpError';
  }
}

export function badRequest(message: string, details?: any) {
  return new HttpError(400, message, details);
}

export function forbidden(message: string) {
  return new HttpError(403, message);
}

export function notFound(message: string) {
  return new HttpError(404, message);
}

export function conflict(message: string, details?: any) {
  return new HttpError(409, message, details);
}

/**
 * Central error responder. Logs the full error server-side and returns a
 * sanitized payload. Replaces the `res.status(500).json({ error: error.message })`
 * pattern that leaked database internals.
 */
export function sendError(res: Response, error: any) {
  if (error instanceof HttpError) {
    const body: any = { error: error.message };
    if (error.details !== undefined) body.details = error.details;
    return res.status(error.status).json(body);
  }

  console.error('[api] Unhandled error:', error);
  return res.status(500).json({
    error: 'An unexpected server error occurred. Please try again.'
  });
}

/**
 * Parses a mentor feedback score. Returns null for anything outside 1..5 or
 * non-numeric input, which previously reached the database as NaN or an
 * out-of-range value and broke the radar chart.
 */
export function parseScore(value: any): number | null {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  if (!Number.isFinite(num) || !Number.isInteger(num)) return null;
  if (num < MIN_SCORE || num > MAX_SCORE) return null;
  return num;
}

/** Parses an optional integer, returning null when absent or invalid. */
export function parseOptionalInt(value: any): number | null {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  return Math.trunc(num);
}

/**
 * Normalizes a Cube number to the zero-padded form used across the app.
 * Previously `PUT /cubes/:id` only trimmed, so a manually entered "7" broke the
 * lexicographic ordering that picks the next available number.
 */
export function parseCubeNumber(value: any): string | null {
  if (value === null || value === undefined) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  if (!/^\d+$/.test(raw)) return null;
  return raw.padStart(CUBE_NUMBER_WIDTH, '0');
}

/**
 * Highest numeric Cube number currently in use. Scans values rather than
 * relying on `orderBy` over a string column, which sorted "9" above "10".
 */
export function highestCubeNumber(cubeNumbers: string[]): number {
  return cubeNumbers.reduce((max, current) => {
    const parsed = parseInt(current, 10);
    return Number.isNaN(parsed) ? max : Math.max(max, parsed);
  }, 0);
}
