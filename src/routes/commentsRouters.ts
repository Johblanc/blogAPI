import * as express from 'express';
import { CommentsController } from '../controllers/commentsController';
import { authenticateJWT } from '../middleware/auth';


const commentsController = new CommentsController() ;
export const commentsRouter = express.Router() ;

commentsRouter.get('/OfArticle/:id',commentsController.getByArticleId) ;

commentsRouter.post('/',authenticateJWT ,commentsController.add) ;

commentsRouter.put('/:id',authenticateJWT ,commentsController.edit) ;

commentsRouter.delete('/:id',authenticateJWT ,commentsController.delete) ; 
