import { TComment } from "./TComment"

/** Type pour l'article */
export type TArticle = {
    id          : number ,
    user_id     : number ,
    title       : string ,
    content     : string ,
    created     : Date ,
    modified    : Date,
    not_archive : boolean,
    user_name ? : string ,
    comments ?  : TComment[]
}