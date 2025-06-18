import jwt, { SignOptions, Secret } from "jsonwebtoken";

// --------------------- Types ---------------------
export interface AccessTokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface RefreshTokenPayload {
  userId: string;
}
// --------------------------------------------------

const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is not defined`);
  return value;
};

/**
 * Generate a signed JWT access token.
 *
 * @param {AccessTokenPayload} payload
 *   An object containing the user’s ID, email, and role to include in the token payload.
 *
 * @returns {string}
 *   The signed JWT access token as a string.
 *
 * @throws {Error}
 *   If required environment variables (JWT_REFRESH_SECRET_KEY or JWT_REFRESH_EXPIRATION) are missing or invalid.
 */
export const generateToken = (payload: AccessTokenPayload): string => {
  const secret = getEnvVar("JWT_REFRESH_SECRET_KEY");
  const expiration = parseInt(getEnvVar("JWT_REFRESH_EXPIRATION"), 10);

  const options: SignOptions = { expiresIn: expiration };
  return jwt.sign(payload, secret as Secret, options);
};

/**
 * Verify and decode a JWT access token.
 *
 * @param {string} token
 *   The JWT access token string to verify and decode.
 *
 * @returns {AccessTokenPayload}
 *   The decoded payload containing userId, email, and role.
 *
 * @throws {Error}
 *   If the token is invalid, expired, or the secret is missing.
 */
export const verifyToken = (token: string): AccessTokenPayload => {
  const secret = getEnvVar("JWT_REFRESH_SECRET_KEY");
  try {
    return jwt.verify(token, secret as Secret) as AccessTokenPayload;
  } catch {
    throw new Error("Invalid token");
  }
};

/**
 * Generate a signed JWT refresh token.
 *
 * @param {RefreshTokenPayload} payload
 *   An object containing the user’s ID to include in the refresh token payload.
 *
 * @returns {string}
 *   The signed JWT refresh token as a string.
 *
 * @throws {Error}
 *   If required environment variables (JWT_REFRESH_SECRET_KEY or JWT_REFRESH_EXPIRATION) are missing or invalid.
 */
export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  const secret = getEnvVar("JWT_REFRESH_SECRET_KEY");
  const expiration = parseInt(getEnvVar("JWT_REFRESH_EXPIRATION"), 10);

  const options: SignOptions = { expiresIn: expiration };
  return jwt.sign(payload, secret as Secret, options);
};

/**
 * Verify and decode a JWT refresh token.
 *
 * @param {string} token
 *   The JWT refresh token string to verify and decode.
 *
 * @returns {RefreshTokenPayload}
 *   The decoded payload containing userId.
 *
 * @throws {Error}
 *   If the token is invalid, expired, or the refresh secret is missing.
 */
export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  const secret = getEnvVar("JWT_REFRESH_SECRET_KEY");
  try {
    return jwt.verify(token, secret as Secret) as RefreshTokenPayload;
  } catch (error) {
    console.error("verifyRefreshToken error:", error);
    throw new Error("Invalid refresh token");
  }
};
