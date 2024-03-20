import express from 'express';
import {getUsers, getID, createUsers, deleteUser, updateUser} from '../Controllers/Users.js';

const router = express.Router();

//all routes in here are starting with /users
router.get('/', getUsers);

router.get('/getid', getID); // This is a temporary testing function

router.post('/create', createUsers);

router.delete('/delete', deleteUser);

router.patch('/update', updateUser);

export default router;