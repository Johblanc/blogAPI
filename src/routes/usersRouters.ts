import * as express from 'express';
import {UsersController} from '../controllers/usersController';


export const usersRouter = express.Router();
const usersController = new UsersController()

usersRouter.post('/register',usersController.register)

usersRouter.post('/login', usersController.login)

