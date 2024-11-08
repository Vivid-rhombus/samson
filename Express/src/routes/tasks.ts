import { Router } from 'express';

const router: Router = Router();

router.get('/');
router.get('/:id');
router.put('/:id');
router.delete('/:id');
router.post('/:id');

export default router;
