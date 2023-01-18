import { Request, Response } from "express";                            // TypeScript
import { TArticle } from "../types/TArticle";                           // TypeScript

import { Responser } from '../module/Responser';                        // Module
import { faillingId, faillingString } from "../module/faillingTest";    // Module

import { ArticlesServices } from "../services/articlesServices";        // API
import { CommentsServices } from "../services/commentsServices";        // API
const articlesServices = new ArticlesServices()                         // API
const commentsServices = new CommentsServices()                         // API

/**
 * Class permettant le contrôle des données entrantes pour les requête articles
 * * **.getAll()** : Contrôle préalable à la récupération de tous les articles 
 * * **.getById()** : Contrôle préalable à la récupération d'un article grâce à son id
 * * **.add()** : Contrôle préalable à l'ajout d'un nouvel article
 * * **.edit()** : Contrôle préalable à la modification d'un article
 * * **.delete()** : Contrôle préalable à la suppression d'un article
 */

export class ArticlesController 
{
    /** 
     * Contrôle préalable à la récupération de tous les articles 
     * * Admin : 3
     * * Response : Liste de tous les articles (TArticle[])
     * */
    async getAll (req : Request , res : Response) : Promise<void>
    {
        let responser = new Responser<TArticle[]>(req, res) ;
        
        try 
        {
            const data = await articlesServices.getAll();
    
            responser.status = 200 ;
            responser.message = `Récupération de ${data?.length || 0} articles` ;
            responser.data = data ;
            responser.send() ;
        }
        catch (err : any) 
        {
            console.log(err.stack);
            responser.send() ;
        }
    }

    /** 
     * Contrôle préalable à la récupération d'un article grâce à son id
     * * Admin : 3
     * * Request :
     *   * param.id => L'id de l'article (number | string)
     * * Response.data : L'article correspondant à l'id (TArticle)
     * */
    async getById (req : Request , res : Response) : Promise<void>
    {
        let responser = new Responser<TArticle>(req, res) ;
        const id = req.params.id ;
        
        if (faillingId(id))
        {
            responser.status = 400 ;
            responser.message = `${id} n'est pas un nombre entier` ;
            responser.send() ;
            return ;
        } 
    
        try 
        {
            const data = await articlesServices.getById(Number(id));
    
            if (data) {
                
                responser.status = 200 ;
                responser.message = `Récupération de l'article ${id}` ;
                responser.data = data ;
                responser.send() ;
                return ;
    
            } 
            responser.status = 404 ;
            responser.message = `L'article ${id} n'existe pas` ;
            responser.send() ;
            
        }
        catch (err : any)
        {
            console.log(err.stack)
            responser.send() ;
        }
    }

    /** 
     * Contrôle préalable à l'ajout d'un nouvel article
     * * Admin : 2
     * * Request :
     *   * body.tokenId => L'id du user (number)
     *   * body.title => le titre de l'article (string)
     *   * body.content => le contenu de l'article (string)
     * * Response.data : L'article créé (TArticle)
     * */
    async add (req : Request , res : Response) : Promise<void>
    {
        let responser = new Responser<TArticle>(req, res) ;
        const { tokenId, title , content } = req.body ;
    
        if ( faillingString(title) || faillingString(content) )
        {
            responser.status = 400 ;
            responser.message = `Structure incorrect : { title : string , content : string }` ;
            responser.send() ;
        } 
        
        try 
        {
            const data = await articlesServices.add(tokenId, title, content);
    
            responser.status = 201 ;
            responser.message = `Création de l'article ${data!.id}` ;
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
     * Contrôle préalable à la modification d'un article
     * * Admin : 2 ou byPassId 1
     * * Request :
     *   * param.id => L'id de l'article (number | string)
     *   * body.tokenId => L'id du user (number)
     *   * body.tokenAdmin => Le niveau d'admin du user (number)
     *   * body.title => le titre de l'article (string) / optionnel si content
     *   * body.content => le contenu de l'article (string) / optionnel si title
     * * Response.data : L'article modifié (TArticle)
     * */
    async edit (req : Request , res : Response) : Promise<void>
    {
        let responser = new Responser<TArticle>(req, res) ;
        const id = Number(req.params.id) ;
        const {tokenId, tokenAdmin, title, content} = req.body;

        if (faillingId(id) || (faillingString(title) && faillingString(content))) 
        {
            responser.status = 400 ;
            responser.message = "Structure incorrect : id : number  {  title : string , content : string } ou { title : string } ou { content : string }" ;
            responser.send() ;
            return ;
        }
    
        try 
        {
            
            const verificator = await articlesServices.getById(id) ;
            if(!verificator)
            {
                responser.status = 404 ;
                responser.message = `L'article ${id} n'existe pas` ;
                responser.send() ;
                return ;
            };
            
            if(verificator?.user_id !== tokenId && tokenAdmin > 1)
            {
                responser.status = 404 ;
                responser.message = `Cet article ne vous appartient pas` ;
                responser.send() ;
                return ;
            };
            let data ;
            if ( ! (faillingString(title) || faillingString(content))) 
            {
                data = await articlesServices.edit(id, title, content);
            } 
            else if (! faillingString(title))
            {
                data = await articlesServices.editTitre(id, title);
            } 
            else 
            {
                data = await articlesServices.editContent(id, content);
            }
    
            responser.status = 200 ;
            responser.message = `L'article ${id} a bien été modifier` ;
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
     * Contrôle préalable à la suppression d'un article
     * * Admin : 2 ou byPassId 1 
     * * Request :
     *   * param.id => L'id de l'article (number | string)
     *   * body.tokenId => L'id du user (number)
     *   * body.tokenAdmin => Le niveau d'admin du user (number)
     * * Response.data : Nombre d'article supprimé (number)
     * */
    async delete (req : Request , res : Response) : Promise<void>
    {
        let responser = new Responser<number>(req, res) ;
        const id = Number(req.params.id);
        const { tokenId , tokenAdmin} = req.body;
    
        if (faillingId(id))
        {
            responser.status = 400 ;
            responser.message = `${id} n'est pas un nombre entier` ;
            responser.send() ;
            return ;
        }
        try 
        {
            const verificator = await articlesServices.getById(id) ;
            if(!verificator)
            {
                responser.status = 404 ;
                responser.message = `L'article ${id} n'existe pas` ;
                responser.send() ;
                return ;
            };

            if(verificator?.user_id !== tokenId && tokenAdmin > 1)
            {
                responser.status = 404 ;
                responser.message = `Cet article ne vous appartient pas` ;
                responser.send() ;
                return ;
            };
            await commentsServices.deleteByArticleId(id)
            const data = await articlesServices.delete(id);
            
            responser.status = 200 ;
            responser.message = `L'article ${id} a bien été supprimé` ;
            responser.data = data
            responser.send() ;
            
        }
        catch (err :any) 
        {
            console.log(err.stack);
            responser.send() ;
        }
    }
}
