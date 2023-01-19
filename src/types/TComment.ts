

/** Type pour le commentaire */
export type TComment = {
    id          : number ,
    user_id     : number ,
    article_id  : number ,
    content     : string ,
    created     : Date ,
    modified    : Date ,
    not_archive : boolean ,
    user_name ? : string 
}