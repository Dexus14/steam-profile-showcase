import { Router } from 'express';
import { getHealth, getIndex } from '../controllers/mainController';

const router = Router();

router.get('/', getIndex);
router.get('health', getHealth);

export default router;
