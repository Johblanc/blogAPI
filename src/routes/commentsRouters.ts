import * as express from 'express';                                         // API
import { CommentsController } from '../controllers/commentsController';     // API

import { authenticateJWT } from '../middleware/auth';                       // token


const commentsController = new CommentsController() ;

/** Permet le routage des requetes comments */
export const commentsRouter = express.Router() ;

/** Route de récupération de tous les commentaires d'un article  */
commentsRouter.get('/ofArticle/:id',commentsController.getByArticleId) ;

/** Route d'ajout d'un commentaires */
commentsRouter.post('/',authenticateJWT ,commentsController.add) ;

/** Route de modification d'un commentaire */
commentsRouter.put('/:id',authenticateJWT ,commentsController.edit) ;

/** Route de suppession d'un commentaire */
commentsRouter.delete('/:id',authenticateJWT ,commentsController.delete) ; 
