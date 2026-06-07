/**
 * Authentication Routes
 * Login, token generation
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const logger = require('../../utils/logger');

/**
 * POST /api/v1/auth/login
 * Authenticate user and return JWT token
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Mock implementation
    const user = {
      id: 'user_123',
      email: email,
      tenant_id: 'tenant_456',
      role: 'admin'
    };

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        tenant_id: user.tenant_id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );

    logger.info(`User ${email} authenticated successfully`);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/v1/auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, tenant_id } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        email: email,
        tenant_id: tenant_id
      }
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;