import * as express from 'express';
import {ArticlesController} from '../controllers/articlesController';
import { authenticateJWT } from '../middleware/auth';


const articlesController = new ArticlesController() ;
export const articlesRouter = express.Router() ;

articlesRouter.get('/',articlesController.getAll) ;

articlesRouter.get('/:id', articlesController.getById) ;

articlesRouter.post('/',authenticateJWT , articlesController.add) ;

articlesRouter.put('/:id',authenticateJWT, articlesController.edit) ;

articlesRouter.delete('/:id',authenticateJWT, articlesController.delete) ; 
