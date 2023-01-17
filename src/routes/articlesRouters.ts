import * as express from 'express';
import {ArticlesController} from '../controllers/articlesController';


const articlesController = new ArticlesController() ;
export const articlesRouter = express.Router() ;

articlesRouter.get('/',articlesController.getAll) ;

articlesRouter.get('/:id', articlesController.getById) ;

articlesRouter.post('/',articlesController.add) ;

articlesRouter.put('/:id',articlesController.edit) ;

articlesRouter.delete('/:id',articlesController.delete) ; 
