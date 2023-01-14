import { Router } from 'express';
import { getRegularTemplate } from '../controllers/templateController';

const router = Router();

router.get('/regular', getRegularTemplate);
export default router;
