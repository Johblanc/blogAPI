import { Request, Response } from "express";                            // TypeScript
import { TComment } from "../types/TComment";                           // TypeScript

import { Responser } from '../module/Responser';                        // Module
import { faillingId, faillingString } from "../module/faillingTest";    // Module

import { CommentsServices } from "../services/commentsServices";        // API
const commentsServices = new CommentsServices()                         // API

/**
 * Class permettant le contrôle des données entrantes pour les requête comments
 * * **.getByArticleId()** : Contrôle préalable à la récupération de tous les commentaires d'un article
 * * **.add()** : Contrôle préalable à l'ajout d'un commentaire
 * * **.edit()** : Contrôle préalable à la modification d'un commentaire
 * * **.delete()** : Contrôle préalable à la suppression d'un commentaire
 */
export class CommentsController {

    /** 
     * Contrôle préalable à la récupération de tous les commentaires d'un article
     * * Admin : 3
     * * Request :
     *   * param.id => L'id de l'article (number | string)
     * * Response.data : Listes des commentaires de l'article (TComment[])
     * */
    async getByArticleId (req : Request , res : Response) : Promise<void>
    {
        let responser = new Responser<TComment[]>(req, res) ;
        const article_id = req.params.id ;
    
        if ( faillingId(article_id) )
        {
            responser.status = 400 ;
            responser.message = `Structure incorrect : id : number` ;
            responser.send() ;
            return ;
        } 
        
        try 
        {
            const data = await commentsServices.getByArticleId( Number(article_id) );
    
            responser.status = 201 ;
            responser.message = `Récupération de ${data?.length || 0} Commentaires` ;
            responser.data = data ;
            responser.send() ;
        }
        catch (err :any) 
        {
            console.log(err.stack)
            responser.send() ;
        }
    }

    /** 
     * Contrôle préalable à l'ajout d'un commentaire
     * * Admin : 2
     * * Request :
     *   * body.tokenId => L'id du user (number)
     *   * body.article_id => l'id de l'article de ratachement (number)
     *   * body.content => le contenu du commentaire (string)
     * * Response.data : Le commentaire créé (TComment)
     * */
    async add (req : Request , res : Response) : Promise<void>
    {
        let responser = new Responser<TComment>(req, res) ;
        const { tokenId, article_id, content} = req.body;
    
        if ( faillingId(article_id) || faillingString(content) )
        {
            responser.status = 400 ;
            responser.message = `Structure incorrect : { article_id : number , content : string }` ;
            responser.send() ;
            return ;
        } 
        
        try 
        {
            const data = await commentsServices.add(tokenId, article_id, content);
    
            responser.status = 201 ;
            responser.message = `Création du Commentaire ${data!.id}` ;
            responser.data = data ;
            responser.send() ;
        }
        catch (err :any) 
        {
            console.log(err.stack)
            responser.send() ;
        }
    }

    /** 
     * Contrôle préalable à la modification d'un commentaire
     * * Admin : 2
     * * Request :
     *   * param.id => L'id du commentaire (number | string)
     *   * body.tokenId => L'id du user (number)
     *   * body.content => le contenu du commentaire (string)
     * * Response.data : Le commentaire modifié (TComment)
     * */
    async edit (req : Request , res : Response) : Promise<void>
    {
        let responser = new Responser<TComment>(req, res) ;
        const id = req.params.id ;
        const { tokenId , content } = req.body;
        
        if (faillingId(id) || faillingString(content))
        {
            responser.status = 400 ;
            responser.message = "Structure incorrect : id : number { content : string }" ;
            responser.send() ;
            return ;
            
        }
        try 
        {
            const verificator = await commentsServices.getById(Number(id)) ;
            if(!verificator)
            {
                responser.status = 404 ;
                responser.message = `Le commentaire ${id} n'existe pas` ;
                responser.send() ;
                return ;
            };
            
            if(verificator?.user_id !== tokenId)
            {
                responser.status = 404 ;
                responser.message = `Ce commentaire ne vous appartient pas` ;
                responser.send() ;
                return ;
            };

            const data = await commentsServices.edit(Number(id), content);
            
            responser.status = 200 ;
            responser.message = `Le commentaire ${id} a bien été modifier` ;
            responser.data = data ;
            responser.send() ;
            
        }
        catch (err:any) 
        {
            console.log(err.stack)
            responser.send() ;
        }
    }

    /** 
     * Contrôle préalable à la suppression d'un commentaire
     * * Admin : 2
     * * Request :
     *   * param.id => L'id du commentaire (number | string)
     *   * body.tokenId => L'id du user (number)
     * * Response.data : Nombre de commentaire supprimé (number)
     * */
    async delete (req : Request , res : Response) : Promise<void>
    {
        let responser = new Responser<number>(req, res) ;
        const id = Number(req.params.id);
        const { tokenId } = req.body;
    
        if ( faillingId(id) )
        {
            responser.status = 400 ;
            responser.message = `Structure incorrect : id : number` ;
            responser.send() ;
            return ;
        } 
        
        try 
        {
            const verificator = await commentsServices.getById(id) ;
            if(!verificator)
            {
                responser.status = 404 ;
                responser.message = `Le commentaire ${id} n'existe pas` ;
                responser.send() ;
                return ;
            };

            if(verificator?.user_id !== tokenId)
            {
                responser.status = 404 ;
                responser.message = `Ce commentaire ne vous appartient pas` ;
                responser.send() ;
                return ;
            };
            const data = await commentsServices.delete(id);
    
            responser.status = 201 ;
            responser.message = `Suppression du Commentaire ${id}` ;
            responser.data = data ;
            responser.send() ;
        }
        catch (err :any) 
        {
            console.log(err.stack)
            responser.send() ;
        }
    }
}