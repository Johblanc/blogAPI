
import { JwtPayload } from "jsonwebtoken";
import * as express from 'express';
import * as dotenv from 'dotenv';

import { Request, Response } from "express";

import {Responser} from './module/Responser';
import { usersRouter } from "./routes/usersRouters";
import { articlesRouter } from "./routes/articlesRouters";
import { commentsRouter } from "./routes/commentsRouters";


dotenv.config()

declare global
{
    namespace Express
    {
        interface Request
        {
            id?: JwtPayload,
            adminLvl?: JwtPayload
        }
    }
}


// declarations
const app = express();
const port = 8000;

app.use(express.json());
app.use(function (req : Request, res : Response, next: () => void) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Pass to next layer of middleware
    next();
});

app.use('/api/users'    , usersRouter       );
app.use('/api/articles'  , articlesRouter    );
app.use('/api/comments'  , commentsRouter    );


app.all('*', async (req: Request, res: Response) => 
{
    new Responser<undefined>(req,res,{
        status : 404,
        message : `Cette requête n'existe pas`
    }).send()
});

// ecoute le port 8000
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})

















