import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'a-seat-to-study-dev-secret-key-2025';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate a signed JWT token containing user id and role
 * @param {Object} payload - { id, role, studentId }
 * @returns {string} Signed JWT
 */
export const generateToken = (payload) => {
  return jwt.sign(
    {
      id: payload.id || payload._id,
      role: payload.role,
      studentId: payload.studentId,
      email: payload.email,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
};

/**
 * Verify and decode a JWT token
 * @param {string} token
 * @returns {Object} decoded payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export default { generateToken, verifyToken };

