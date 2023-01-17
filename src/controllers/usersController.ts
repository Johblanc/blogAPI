import { Request, Response } from "express";

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import {Responser} from '../module/Responser';
import { faillingString } from '../module/faillingTest';

const accessTokenSecret = process.env.SECRET_TOKEN! ;
import {UsersServices} from '../services/usersServices';
import { TUser } from "../types/TUser";

const usersService = new UsersServices()


export class UsersController 
{

    async register (req : Request , res : Response) : Promise<void>
    {
        let responcer = new Responser<Partial<TUser>>(req, res) ;
        const pass = req.body.pass ;
        const name = req.body.name ;

        console.log(pass,name);
        

        
        bcrypt.hash(pass, 10, async (err : any, hash : string) =>
        {
            if (faillingString(pass) || faillingString(name))
            {
                responcer.status = 400 ;
                responcer.message = "Structure incorrect : { pass : string , name : string }" ;
                responcer.send() ;
            }
            
            try
            {
                const usersList = await usersService.getByName(name);
                
                if (usersList) 
                {
                    responcer.status = 400 ;
                    responcer.message = `Cet utilisateur existe déjà`
                    responcer.send() ;
                }
                else 
                {
                    const data = await usersService.add(name, hash,2);
                    
                    responcer.status = 200 ;
                    responcer.message = `L'utilisateur ${name} à bien été ajouté`
                    responcer.data = data
                    responcer.send() ;
                }
            }
            catch (err :any)
            {
                console.log(err.stack);
                responcer.send() ;
            }
        });
    }

    async login (req : Request , res : Response) : Promise<void>
    {
        let responcer = new Responser(req , res ) ;
        const pass = req.body.pass ;
        const name = req.body.name ;
        
        if (faillingString(pass) || faillingString(name))
        {
            responcer.status = 400 ;
            responcer.message = "Structure incorrect : { pass : string , name : string }" ;
            responcer.send() ;
        }
        
        try 
        {
            const data = await usersService.getByName(name);
            
            if (!data)
            {
                responcer.status = 404 ;
                responcer.message = `Le nom d'utilisateur ou/et le mot de passe sont incorects`;
                responcer.send() ;
            }
    
            bcrypt.compare(pass, data!.password,async (err,result) =>
            {
                if (result) 
                {
                    responcer.status = 200 ;
                    responcer.message = `Connection de ${name}` ;
                    responcer.data = { 
                        token : jwt.sign({ id: data!.id , adminLvl : data!.admin_lvl}, accessTokenSecret!),
                        id : data!.id,
                        adminLvl : data!.admin_lvl
                    } ;
                    responcer.send() ;
                }
                else
                {
                    responcer.status = 404 ;
                    responcer.message = `Le nom d'utilisateur ou/et le mot de passe sont incorects` ;
                    responcer.send() ;
                }
            })
        }
        catch (err : any) 
        {
            console.log(err.stack) ;
            responcer.send() ;
        }
        
    }
}
