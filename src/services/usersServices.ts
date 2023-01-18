import { QueryResult } from "pg";                   // API

import { client } from "../module/clientData";      // Client

import { TUser } from '../types/TUser';             // TypeScript

/**
 * Permet la gestion des requetes SQL users.
 * 
 * * **getByName()** : Récupération d'un user grâce à son nom
 * * **add()** : Ajout d'un user
 * * **changeName()** : Modification du nom du user
 * * **changePass()** : Modification du mot de passe du user
 * * **changeAdminLvl()** : Modification du niveau d'admin du user
 */
export class UsersServices
{
    /**
     * Récupération d'un user grâce à son nom
     * 
     * @param name          Nom du user recherché
     * @returns             Le user recherché (TUser)
     */
    async getByName(name : string) : Promise<TUser | undefined>
    {
        const data : QueryResult<TUser> = await client.query('SELECT * FROM users WHERE name = $1', [name]);

        if(data.rowCount)
        {
            return data.rows[0];
        }
        
        return undefined
    }

    /**
     * Ajout d'un user
     * 
     * @param name          Nom du user à ajouter  
     * @param hash          Mot de pass hasher un user à ajouter
     * @param adminLvl      Niveau d'admin du user à ajouter
     * @returns             Les informations "visibles" du user ajouté (Partial<TUser>)
     */
    async add(name : string, hash : string, adminLvl : number) : Promise<Partial<TUser> | undefined>
    {
        const data : QueryResult<Partial<TUser>> = await client.query('INSERT INTO users (name, password,admin_lvl) VALUES ($1,$2,$3) RETURNING id,name,admin_lvl', [name, hash, adminLvl]);

        if(data.rowCount)
        {
            return data.rows[0];
        }
        
        return undefined
    }

    /**
     * Modification du nom du user
     * 
     * @param id            L'id du user à modifier
     * @param name          Nouveau nom du user
     * @returns             Les informations "visibles" du user modifié (Partial<TUser>)
     */
    async changeName(id : number, name : string) : Promise<TUser | undefined>
    {
        const data : QueryResult<TUser> = await client.query('UPDATE users SET name = $1 WHERE id = $2', [name, id]);

        if(data.rowCount)
        {
            return data.rows[0];
        }
        
        return undefined
    }

    /**
     * Modification du mot de passe du user
     * 
     * @param id            L'id du user à modifier
     * @param name          Nouveau mot de passe du user
     * @returns             Les informations "visibles" du user modifié (Partial<TUser>)
     */
    async changePass(id : number, hash : string) : Promise<TUser | undefined>
    {
        const data : QueryResult<TUser> = await client.query('UPDATE users SET password = $1 WHERE id = $2', [hash, id]);

        if(data.rowCount)
        {
            return data.rows[0];
        }
        
        return undefined
    }

    /**
     * Modification du niveau d'admin du user
     * 
     * @param id            L'id du user à modifier
     * @param adminLvl      Nouveau niveau d'admin du user
     * @returns             Les informations "visibles" du user modifié (Partial<TUser>)
     */
    async changeAdminLvl(id : number, adminLvl : number) : Promise<TUser | undefined>
    {
        const data : QueryResult<TUser> = await client.query('UPDATE users SET admin_lvl = $1 WHERE id = $2', [adminLvl, id]);

        if(data.rowCount)
        {
            return data.rows[0];
        }
        
        return undefined
    }
}
