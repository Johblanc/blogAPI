import { Request, Response } from "express";
import { faillingId, faillingString } from "../module/faillingTest";
import { Responser } from "../module/Responser";
import { ArticlesServices } from "../services/articlesServices";
import { TArticle } from "../types/TArticle";


const articlesServices = new ArticlesServices()

export class ArticlesController 
{
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

    async getById (req : Request , res : Response) : Promise<void>
    {
        let responser = new Responser<TArticle>(req, res) ;
        const id = Number(req.params.id) ;
        
        // Vérifiction du Type de l'id entrante
        if (faillingId(id))
        {
            responser.status = 400 ;
            responser.message = `${id} n'est pas un nombre entier` ;
            responser.send() ;
            return ;
        } 
    
        try 
        {
            const data = await articlesServices.getById(id);
    
            // Vérifiction de l'existence de l'id
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

    async add (req : Request , res : Response) : Promise<void>
    {
        let responser = new Responser<TArticle>(req, res) ;
        const { tokenId, title, content} = req.body;
    
        // Vérifiction du Type du user_id entrant
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
            responser.message = `Création du ticket ${data!.id}` ;
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
        let responser = new Responser<TArticle>(req, res) ;
        const id = Number(req.params.id) ;
        const { title, content, tokenId} = req.body;


    
        // Vérifiction de la presence des paramètres nécessaires
        if (faillingId(id) || (faillingString(title) && faillingString(content))) 
        {
            responser.status = 400 ;
            responser.message = "Structure incorrect : id : number  {  message : string , done : boolean } ou { message : string } ou  { done : boolean }" ;
            responser.send() ;
            return ;
        }
    
        try 
        {
            const verificator = await articlesServices.getById(id) ;
            if(!verificator)
            {
                responser.status = 404 ;
                responser.message = `Le ticket ${id} n'existe pas` ;
                responser.send() ;
                return ;
            };

            if(verificator?.user_id === tokenId)
            {
                responser.status = 404 ;
                responser.message = `Ce ticket ne vous appartient pas` ;
                responser.send() ;
                return ;
            };
            // Exécution de la bonne requête en fonction des paramètres
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
            responser.message = `Le ticket ${id} a bien été modifier` ;
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
        const tokenId = req.body.tokenId;
    
        // Vérifiction du Type de l'id entrante
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
                responser.message = `Le ticket ${id} n'existe pas` ;
                responser.send() ;
                return ;
            };

            if(verificator?.user_id === tokenId)
            {
                responser.status = 404 ;
                responser.message = `Ce ticket ne vous appartient pas` ;
                responser.send() ;
                return ;
            };
    
            const data = await articlesServices.delete(id);
            
            responser.status = 200 ;
            responser.message = `Le ticket ${id} a bien été supprimé` ;
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
