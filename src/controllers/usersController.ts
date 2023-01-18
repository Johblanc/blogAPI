import { Request, Response } from "express";                // TypeScript
import { TUser } from "../types/TUser";                     // TypeScript

import { Responser } from '../module/Responser';            // Module
import { faillingString } from '../module/faillingTest';    // Module

import {UsersServices} from '../services/usersServices';    // API

import * as bcrypt from 'bcrypt';                           // password

import * as jwt from 'jsonwebtoken';                        // token
import * as dotenv from 'dotenv';                           // token
dotenv.config()                                             // token
const accessTokenSecret = process.env.SECRET_TOKEN! ;       // token

const usersService = new UsersServices()                    // API

/**
 * Class permettant le contrôle des données entrantes pour les requête users
 * * **.register()** : Contrôle préalable à la création d'un nouveau user
 * * **.login()** : Contrôle préalable à l'authentification d'un user
 */
export class UsersController 
{

    /** 
     * Contrôle préalable à la création d'un nouveau user
     * * Admin : 3
     * * Request :
     *   * body.pass => Le mot de pass du user (string)
     *   * body.name => Le nom du user (string)
     * * Response.data : Les informations visible du user (Partial<TUser>)
     * */
    async register (req : Request , res : Response) : Promise<void>
    {
        let responcer = new Responser<Partial<TUser>>(req, res) ;
        const {pass , name} = req.body ;
        
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

    /** 
     * Contrôle préalable à l'authentification d'un user
     * * Admin : 3
     * * Request :
     *   * body.pass => Le mot de pass du user (string)
     *   * body.name => Le nom du user (string)
     * * Response.data : Les informations visible du user (Partial<TUser>)
     * */
    async login (req : Request , res : Response) : Promise<void>
    {
        let responcer = new Responser<Partial<TUser>>(req , res ) ;
        const {pass , name} = req.body ;
        
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
    
            bcrypt.compare(pass, data!.password, async (err,result) =>
            {
                if (result) 
                {
                    responcer.status = 200 ;
                    responcer.message = `Connection de ${name}` ;
                    responcer.data = { 
                        id : data!.id,
                        admin_lvl : data!.admin_lvl,
                        token : jwt.sign({ id: data!.id , adminLvl : data!.admin_lvl }, accessTokenSecret!)
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
