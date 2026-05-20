import { Router } from 'express';
import * as leadsController from '../controllers/leads.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { createLeadSchema, updateLeadSchema, leadQuerySchema } from '../schemas/lead.schemas';

const router = Router();

// All routes require authentication
router.use(verifyToken);

router.get('/', validate(leadQuerySchema), leadsController.getLeads);
router.post('/', validate(createLeadSchema), leadsController.createLead);
router.get('/export', requireRole('admin'), leadsController.exportLeads);
router.get('/:id', leadsController.getLeadById);
router.put('/:id', validate(updateLeadSchema), leadsController.updateLead);
router.delete('/:id', requireRole('admin'), leadsController.deleteLead);

export default router;
