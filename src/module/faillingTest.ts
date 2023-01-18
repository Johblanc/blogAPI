
/** 
 * Vérification de l'**INCOMPATIBILITE** de l'objet en tant qu'id. 
 * * Renvoie **true** si l'objet rempli une de ces conditions :
 *   * n'est pas convertible en nombre
 *   * n'est pas un entier
 *   * est un booleen
 */
export function faillingId(id : any){
    return Number.isNaN(Number(id)) || Number(id) % 1 !== 0 || typeof id === typeof Boolean()
}


/** 
 * Vérification de l'**INCOMPATIBILITE** de l'objet en tant que string. 
 * * Renvoie **true** si l'objet rempli une de ces conditions :
 *   * est undefined
 *   * n'est pas de type string
 */
export function faillingString(message : any = undefined){
    return message === undefined  || typeof message != typeof String()
}

/** 
 * Vérification de l'**INCOMPATIBILITE** de l'objet en tant que boolean. 
 * * Renvoie **true** si l'objet rempli une de ces conditions :
 *   * est undefined
 *   * n'est pas de type Boolean
 */
export function faillingBool(done : any = undefined){
    return done === undefined || typeof done != typeof Boolean()
}
