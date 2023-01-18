import { Request, Response } from "express";            // TypeScript
import { TToken } from "../types/TToken";               // TypeScript

import { Responser } from '../module/Responser';        // Module

import * as jwt from 'jsonwebtoken';                    // token
import * as dotenv from 'dotenv';                       // token
dotenv.config()                                         // token
const accessTokenSecret = process.env.SECRET_TOKEN! ;   // token

/**
 * Permet la vérification de l'existence du token et sa transformation en parametres dans le body de la requete
 * * req.body.tokenId       : id du user
 * * req.body.tokenAdmin    : niveau d'admin du user
 */
export const authenticateJWT = (req : Request, res : Response, next : () => void) => {
    
    let reponser = new Responser<undefined>(req, res) ;

    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, token) => {
            if (err) {
                reponser.status = 403 ;
                reponser.message = `Vous n'êtes pas identifier`
                reponser.send();
                return ;
            }
            
            req.body.tokenId = (token as TToken).id ;
            req.body.tokenAdmin = (token as TToken).adminLvl ;
            next();
        });
    } else {
        reponser.status = 401 ;
        reponser.message = `Vous n'êtes pas identifier`
        reponser.send();
        return  ;
    }
};
