import * as express from 'express';
import { CommentsController } from '../controllers/commentsController';


const commentsController = new CommentsController() ;
export const commentsRouter = express.Router() ;

commentsRouter.get('/OfArticle/:id',commentsController.getByArticleId) ;

commentsRouter.post('/',commentsController.add) ;

commentsRouter.put('/:id',commentsController.edit) ;

commentsRouter.delete('/:id',commentsController.delete) ; 
