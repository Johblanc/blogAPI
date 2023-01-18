import * as express from 'express';                                     // API
import { ArticlesController } from '../controllers/articlesController'; // API

import { authenticateJWT } from '../middleware/auth';                   // token


const articlesController = new ArticlesController() ;

/** Permet le routage des requetes articles */
export const articlesRouter = express.Router() ;

/** Route de récupération des articles*/
articlesRouter.get('/',articlesController.getAll) ;

/** Route de récupération d'un article avec son id*/
articlesRouter.get('/:id', articlesController.getById) ;

/** Route d'ajout d'un article */
articlesRouter.post('/',authenticateJWT , articlesController.add) ;

/** Route de modification d'un article */
articlesRouter.put('/:id',authenticateJWT, articlesController.edit) ;

/** Route de suppression d'un article */
articlesRouter.delete('/:id',authenticateJWT, articlesController.delete) ; 
