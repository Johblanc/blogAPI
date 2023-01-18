import { QueryResult } from "pg";                   // API

import { client } from "../module/clientData";      // Client

import { TAdminLvl } from "../types/TAdminLvl";     // TypeScript


/**
 * Permet la gestion des requetes SQL users.
 * 
 * * **getAll()** : Récupération de tous les niveau d'admin
 * * **getById()** : Récupération d'un niveau d'admin en fonction de son id
 */
export class AdminLvlServices{

    /**
     * Récupération de tous les niveau d'admin
     * 
     * @returns Liste des niveau d'admin -> TAdminLvl[] | undefined
     */
    async getAll() : Promise<TAdminLvl[] | undefined>
    {
        const data : QueryResult<TAdminLvl> = await client.query('SELECT * FROM admin_lvl');

        if(data.rowCount)
        {
            return data.rows;
        }
        return undefined
    }

    /**
     * Récupération d'un niveau d'admin en fonction de son id.
     * 
     * @param id L'id du niveau d'admin souhaité
     * @returns Le niveau d'admin souhaité -> TAdminLvl | undefined
     */
    async getById(id : number) : Promise<TAdminLvl | undefined>
    {
        const data : QueryResult<TAdminLvl> = await client.query('SELECT * FROM admin_lvl WHERE id = $1',[id]);

        if(data.rowCount)
        {
            return data.rows[0];
        }
        return undefined
    }

}
