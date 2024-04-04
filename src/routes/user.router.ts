import { Router } from 'express';
import { helloWorld } from '../controllers/user.controller';

const router = Router();

router.get('/', helloWorld)


export default router;