import express from 'express';
import { getSearchInfo, getFilterMonthInfo, getFilterDateInfo } from '../Controllers/Search.js';

// Create Router Object
const router = express.Router();

//all routes in here are starting with /search
router.get('/', getSearchInfo);

router.get('/filtermonth', getFilterMonthInfo);

router.get('/filterdate', getFilterDateInfo);

export default router;