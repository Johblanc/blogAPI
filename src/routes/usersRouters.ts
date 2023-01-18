import * as express from 'express';                                 // API
import {UsersController} from '../controllers/usersController';     // API


export const usersRouter = express.Router();

/** Permet le routage des requetes users */
const usersController = new UsersController()

/** Route d'ajout d'un user  */
usersRouter.post('/register',usersController.register)

/** Route d'authentification d'un user  */
usersRouter.post('/login', usersController.login)

