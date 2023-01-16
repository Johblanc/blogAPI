import { Request, Response } from "express";
import { Responser } from "../module/Responser";
import { ArticlesServices } from "../services/articlesServices";


const articlesServices = new ArticlesServices()

export class ArticlesController 
{
    async getAll (req : Request , res : Response)
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
}