import { Request, Response } from "express";
import { faillingId, faillingString } from "../module/faillingTest";
import { Responser } from "../module/Responser";
import { CommentsServices } from "../services/commentsServices";
import { TComment } from "../types/TComment";



const commentsServices = new CommentsServices()

export class CommentsController {

    async getByArticleId (req : Request , res : Response) : Promise<void>
    {
        let responser = new Responser<TComment[]>(req, res) ;
        const article_id = Number(req.params.id) ;
    
        // Vérifiction du Type du user_id entrant
        if ( faillingId(article_id) )
        {
            responser.status = 400 ;
            responser.message = `Structure incorrect : id : number` ;
            responser.send() ;
            return ;
        } 
        
        try 
        {
            const data = await commentsServices.getByArticleId( article_id );
    
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


    async add (req : Request , res : Response) : Promise<void>
    {
        let responser = new Responser<TComment>(req, res) ;
        const { tokenId, article_id, content} = req.body;
    
        // Vérifiction du Type du user_id entrant
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

    async edit (req : Request , res : Response) : Promise<void>
    {
        let responser = new Responser<TComment>(req, res) ;
        const id = Number(req.params.id) ;
        const { tokenId , content } = req.body;
        
        
        
        // Vérifiction de la presence des paramètres nécessaires
        if (faillingId(id) || faillingString(content))
        {
            responser.status = 400 ;
            responser.message = "Structure incorrect : id : number { content : string }" ;
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
            // Exécution de la bonne requête en fonction des paramètres
            
            
            const data = await commentsServices.edit(id, content);
            
            console.log(data);
    
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

    async delete (req : Request , res : Response) : Promise<void>
    {
        let responser = new Responser<number>(req, res) ;
        const id = Number(req.params.id);
        const { tokenId } = req.body;
    
        // Vérifiction du Type du user_id entrant
        if ( faillingId(id) )
        {
            responser.status = 400 ;
            responser.message = `Structure incorrect : { id : number , content : string }` ;
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