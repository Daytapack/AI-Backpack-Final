import express from 'express';
import { getSavedOppInfo, addSavedOppInfo , deleteSavedOppInfo, deleteSavedOppFromUser } from '../Controllers/SavedOpportunity.js';

// Create Router Object
const router = express.Router();

//all routes in here are starting with /savedopportunity
router.get('/', getSavedOppInfo);

router.post('/addsaved', addSavedOppInfo);

router.delete('/deletesaved', deleteSavedOppInfo);

router.delete('/deleteoppfromuser', deleteSavedOppFromUser);

export default router;