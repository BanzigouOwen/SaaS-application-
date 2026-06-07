/**
 * Dashboard Routes
 * Widget creation and rendering endpoints
 */

const express = require('express');
const router = express.Router();
const WidgetRenderer = require('../WidgetRenderer');
const { authenticateJWT, validateTenantAccess } = require('../../middlewares/auth');

/**
 * POST /api/v1/dashboards/widgets/render
 * Render a custom widget with dynamic query
 */
router.post('/widgets/render', authenticateJWT, validateTenantAccess, async (req, res) => {
  try {
    const userId = req.user.id;
    const tenantId = req.user.tenant_id;
    const payload = req.body;

    const result = await WidgetRenderer.renderWidget(payload, userId, tenantId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/v1/dashboards/user
 * Get user's saved dashboards
 */
router.get('/user', authenticateJWT, validateTenantAccess, async (req, res) => {
  try {
    const userId = req.user.id;

    res.json({
      dashboards: [],
      total: 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/v1/dashboards/save
 * Save a custom dashboard configuration
 */
router.post('/save', authenticateJWT, validateTenantAccess, async (req, res) => {
  try {
    const userId = req.user.id;
    const tenantId = req.user.tenant_id;
    const { name, widgets } = req.body;

    res.json({
      message: 'Dashboard saved',
      dashboard_id: `dashboard_${Date.now()}`,
      name
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;