import express from 'express';
import validateAuthHeaders from '../Middlewares/validateAuthHeaders.js'
import { saveRecordForUser, getAllRecordsForUser } from '../Controllers/registersController.js'

const router = express.Router();

router.post('/registro', validateAuthHeaders, saveRecordForUser);
router.get('/registro', validateAuthHeaders, getAllRecordsForUser);

export default router;