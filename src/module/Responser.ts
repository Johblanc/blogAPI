import { Request, Response } from "express";


/**
 * @status      => 500
 * @message     => "Erreur serveur"
 * @data        => undefined
 */
export class Responser<TypeData> {
    req : Request ;
    res : Response ;
    status : number ;
    message : string ;
    data : TypeData |  undefined;
    isSend : boolean
    constructor(req : Request ,res : Response, conf : {status? : number , message? : string , data? : TypeData} = {}) {
        this.req = req ;
        this.res = res ;
        this.status = conf.status       ||  500 ;
        this.message = conf.message     ||  "Erreur serveur" ;
        this.data = conf.data           ||  undefined ;
        this.isSend = false
    }

    statusStr() : string
    {
        return (200 <= this.status && this.status <300) ? "SUCCESS" : "FAIL"
    }

    info() : string
    {
        return `${this.req.method} | ${this.req.originalUrl} | ${this.status} | ${this.statusStr()}\n${this.message}`
    }

    send() : void
    {
        if (! this.isSend)
        {
            this.isSend = true ;

            console.log(this.info()) ;

            this.res
                .status(this.status)
                .json({
                    status: this.statusStr(),
                    message: this.message,
                    data: this.data
                }) ;
        }
    }

}
