import { QueryResult } from "pg";
import { client } from "../module/clientData";
import { TAdminLvl } from "../types/TAdminLvl";

export class AdminLvlServices{
    async getAll() : Promise<TAdminLvl[] | undefined>
    {
        const data : QueryResult<TAdminLvl> = await client.query('SELECT * FROM admin_lvl');

        if(data.rowCount)
        {
            return data.rows;
        }
        return undefined
    }

    async getbyId(id : number) : Promise<TAdminLvl | undefined>
    {
        const data : QueryResult<TAdminLvl> = await client.query('SELECT * FROM admin_lvl WHERE id = $1',[id]);

        if(data.rowCount)
        {
            return data.rows[0];
        }
        return undefined
    }

}
