import { Request, Response } from "express";

/**
 * Permet la préparation et l'envoie d'une réponse html
 */
export class Responser<TypeData> 
{
    /** La requete html en cours */
    req : Request ;

    /** La réponse html en attente d'envoie */
    res : Response ;

    /** Le status numérique de la réponse html */
    status : number ;

    /** Le message contenu dans la réponse html */
    message : string ;

    /** L'information contenu dans la réponse html */
    data : TypeData |  undefined;
    
    /** La réponse html a-t-elle déjà été envoyé ? */
    private isSend : boolean

    /**
     * Permet la préparation et l'envoie d'une réponse html
     * * **TypeData** : Type générique pour la data 
     * * **req** : La requete html en cours
     * * **res** : La réponse html en attente d'envoie
     * * **conf** : Option de modification des valeurs par défaut :
     *   * status = 500
     *   * message = "Erreur serveur"
     *   * data = undefined
     */
    constructor(req : Request ,res : Response, conf : {status? : number , message? : string , data? : TypeData} = {}) {
        this.req = req ;
        this.res = res ;
        this.status = conf.status       ||  500 ;
        this.message = conf.message     ||  "Erreur serveur" ;
        this.data = conf.data           ||  undefined ;
        this.isSend = false
    }

    /** Le status textuel de la réponce html en fonction du numérique */
    statusStr() : string
    {
        return (200 <= this.status && this.status <300) ? "SUCCESS" : "FAIL"
    }

    /** 
     * Condensé d'information sur la requete en cours 
     * * le verbe html
     * * l'url
     * * le status numérique
     * * le status textuel
     * * le message de réponse
     * */
    info() : string
    {
        return `${this.req.method} | ${this.req.originalUrl} | ${this.status} | ${this.statusStr()}\n${this.message}`
    }

    /** Permet **un unique envoie** de la réponse html **par instance** */
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
