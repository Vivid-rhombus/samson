import { Router, Request, Response } from 'express';

import userRouter from './users';
import taskRouter from './tasks';

const router = Router();

router.use('/health', (req: Request, res: Response) => {
	res.send('good');
});
router.use('/users', userRouter);
router.use('/tasks', taskRouter);

export default router;
