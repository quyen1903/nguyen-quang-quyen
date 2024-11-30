import express from 'express';
import accessController from'../../controllers/account.controller';
import { authentication } from '../../auth/authUtils';
import asyncHandler from '../../shared/helper/async.handler';

const router = express.Router();

router.get('/user/searchUser',asyncHandler(accessController.searchAccount))

router.post('/user/register',asyncHandler(accessController.register))
router.post('/user/login',asyncHandler(accessController.login))   

router.use(authentication)

router.patch('/user/update',asyncHandler(accessController.updateAccount))
router.post('/user/logout',asyncHandler(accessController.logout))
router.post('/user/handlerRefreshToken',asyncHandler(accessController.handlerRefreshToken))
router.post('/user/changePassword',asyncHandler(accessController.changePassword))
router.get('/user/readUser',asyncHandler(accessController.readAccount))
router.delete('/user/deleteUser',asyncHandler(accessController.deleteAccount))

export default router