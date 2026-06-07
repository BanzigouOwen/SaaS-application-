/**
 * Users Routes
 * User management and group endpoints
 */

const express = require('express');
const router = express.Router();
const { authenticateJWT, validateTenantAccess } = require('../../middlewares/auth');

/**
 * GET /api/v1/users/profile
 * Get current user profile
 */
router.get('/profile', authenticateJWT, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      id: user.id,
      email: user.email,
      tenant_id: user.tenant_id,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/v1/users/team
 * Get user's team members
 */
router.get('/team', authenticateJWT, validateTenantAccess, async (req, res) => {
  try {
    const tenant_id = req.user.tenant_id;

    res.json({
      team_members: [],
      total: 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;