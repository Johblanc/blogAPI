import { Request, Response } from "express";
import { faillingId, faillingString } from "../module/faillingTest";
import { Responser } from "../module/Responser";
import { ArticlesServices } from "../services/articlesServices";


const articlesServices = new ArticlesServices()

export class ArticlesController 
{
    async getAll (req : Request , res : Response) : Promise<void>
    {
        let responcer = new Responser(req, res) ;
        
        try 
        {
            const data = await articlesServices.getAll();
    
            responcer.status = 200 ;
            responcer.message = `Récupération de ${data?.length || 0} articles` ;
            responcer.data = data ;
            responcer.send() ;
        }
        catch (err : any) 
        {
            console.log(err.stack);
            responcer.send() ;
        }
    }

    async getById (req : Request , res : Response) : Promise<void>
    {
        let responcer = new Responser(req, res) ;
        const id = Number(req.params.id) ;
        
        // Vérifiction du Type de l'id entrante
        if (faillingId(id))
        {
            responcer.status = 400 ;
            responcer.message = `${id} n'est pas un nombre entier` ;
            responcer.send() ;
            return ;
        } 
    
        try 
        {
            const data = await articlesServices.getById(id);
    
            // Vérifiction de l'existence de l'id
            if (data) {
                
                responcer.status = 200 ;
                responcer.message = `Récupération de l'article ${id}` ;
                responcer.data = data ;
                responcer.send() ;
                return ;
    
            } 
            responcer.status = 404 ;
            responcer.message = `L'article ${id} n'existe pas` ;
            responcer.send() ;
            
        }
        catch (err : any)
        {
            console.log(err.stack)
            responcer.send() ;
        }
    }

    async add (req : Request , res : Response) : Promise<void>
    {
        let responcer = new Responser(req, res) ;
        const { tokenId, title, content} = req.body;
    
        // Vérifiction du Type du user_id entrant
        if ( faillingString(title) || faillingString(content) )
        {
            responcer.status = 400 ;
            responcer.message = `Structure incorrect : { title : string , content : string }` ;
            responcer.send() ;
        } 
        
        try 
        {
            const data = await articlesServices.add(tokenId, title, content);
    
            responcer.status = 201 ;
            responcer.message = `Création du ticket ${data!.id}` ;
            responcer.data = data ;
            responcer.send() ;
        }
        catch (err :any) 
        {
            console.log(err.stack)
            responcer.send() ;
        }
    }

    async edit (req : Request , res : Response) : Promise<void>
    {
        let responcer = new Responser(req, res) ;
        const id = Number(req.params.id) ;
        const { title, content, tokenId} = req.body;


    
        // Vérifiction de la presence des paramètres nécessaires
        if (faillingId(id) || (faillingString(title) && faillingString(content))) 
        {
            responcer.status = 400 ;
            responcer.message = "Structure incorrect : id : number  {  message : string , done : boolean } ou { message : string } ou  { done : boolean }" ;
            responcer.send() ;
            return ;
        }
    
        try 
        {
            const verificator = await articlesServices.getById(id) ;
            if(!verificator)
            {
                responcer.status = 404 ;
                responcer.message = `Le ticket ${id} n'existe pas` ;
                responcer.send() ;
                return ;
            };

            if(verificator?.user_id === tokenId)
            {
                responcer.status = 404 ;
                responcer.message = `Ce ticket ne vous appartient pas` ;
                responcer.send() ;
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
    
            responcer.status = 200 ;
            responcer.message = `Le ticket ${id} a bien été modifier` ;
            responcer.data = data ;
            responcer.send() ;
            
        }
        catch (err:any) 
        {
            console.log(err.stack)
            responcer.send() ;
        }
    }
    async delete (req : Request , res : Response) : Promise<void>
    {
        let responcer = new Responser(req, res) ;
        const id = Number(req.params.id);
        const tokenId = req.body.tokenId;
    
        // Vérifiction du Type de l'id entrante
        if (faillingId(id))
        {
            responcer.status = 400 ;
            responcer.message = `${id} n'est pas un nombre entier` ;
            responcer.send() ;
            return ;
        }
        try 
        {
            const verificator = await articlesServices.getById(id) ;
            if(!verificator)
            {
                responcer.status = 404 ;
                responcer.message = `Le ticket ${id} n'existe pas` ;
                responcer.send() ;
                return ;
            };

            if(verificator?.user_id === tokenId)
            {
                responcer.status = 404 ;
                responcer.message = `Ce ticket ne vous appartient pas` ;
                responcer.send() ;
                return ;
            };
    
            const data = await articlesServices.delete(id);
            
            responcer.status = 200 ;
            responcer.message = `Le ticket ${id} a bien été supprimé` ;
            responcer.send() ;
            
        }
        catch (err :any) 
        {
            console.log(err.stack);
            responcer.send() ;
        }
    }
}
