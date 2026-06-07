/**
 * Authentication Middleware
 * JWT validation and tenant isolation
 */

const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * Authenticate JWT token
 */
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`JWT validation error: ${error.message}`);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Validate tenant access - Prevent cross-tenant data access
 */
const validateTenantAccess = (req, res, next) => {
  const tenant_id = req.body.tenant_id || req.query.tenant_id || req.params.tenant_id;
  const user_tenant_id = req.user.tenant_id;

  if (tenant_id && tenant_id !== user_tenant_id) {
    logger.warn(`Unauthorized tenant access attempt: ${req.user.id} tried to access ${tenant_id}`);
    return res.status(403).json({ error: 'Unauthorized tenant access' });
  }

  next();
};

module.exports = {
  authenticateJWT,
  validateTenantAccess
};
