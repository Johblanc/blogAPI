import { Request, Response } from "express";
import { faillingId } from "../module/faillingTest";
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
}