

export function faillingId(id : any){
    return Number.isNaN(Number(id)) ||  id % 1 !== 0 || typeof id === typeof Boolean()
}


export function faillingString(message : any = undefined){
    return message === undefined  || typeof message != typeof String()
}

export function faillingBool(done : any = undefined){
    return done === undefined || typeof done != typeof Boolean()
}
