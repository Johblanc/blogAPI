import { Request, Response } from "express";
import * as jwt from 'jsonwebtoken';

import { Responser } from '../module/Responser';
import { TToken } from "../types/TToken";

const accessTokenSecret = process.env.SECRET_TOKEN! ;


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
            next();
        });
    } else {
        reponser.status = 401 ;
        reponser.message = `Vous n'êtes pas identifier`
        reponser.send();
        return  ;
    }
};
