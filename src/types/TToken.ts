import { JwtPayload } from "jsonwebtoken";

export interface RequestWithUserRole extends Request
{
    id?: string | JwtPayload | undefined,
    adminLvl?: string | JwtPayload | undefined,
    headers: HeaderWithAuthorization
}

interface HeaderWithAuthorization extends Headers
{
    authorization?: string
}

export type TToken = {
    id : number ,
    adminLvl : number ,
} 
