import express from 'express';
import { getComDispInfo } from '../Controllers/CommunityDisplay.js';

// Create Router Object
const router = express.Router();

//all routes in here are starting with /communitydisplay
router.get('/', getComDispInfo)

export default router;