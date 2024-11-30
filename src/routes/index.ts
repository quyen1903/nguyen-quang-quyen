import express from 'express';

import user from './account';

const router = express.Router();


router.use('/api/v1', user);

export default router;