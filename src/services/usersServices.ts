

import { QueryResult } from 'pg';
import {client} from '../module/clientData';
import { TUser } from '../types/TUser';

export class UsersServices{
    async getByName(name : string) : Promise<TUser | undefined>
    {
        const data : QueryResult<TUser> = await client.query('SELECT * FROM users WHERE name = $1', [name]);

        if(data.rowCount)
        {
            return data.rows[0];
        }
        
        return undefined
    }

    async add(name : string, hash : string, adminLvl : number) : Promise<Partial<TUser> | undefined>
    {
        const data : QueryResult<Partial<TUser>> = await client.query('INSERT INTO users (name, password,admin_lvl) VALUES ($1,$2,$3) RETURNING id,name,admin_lvl', [name, hash, adminLvl]);

        if(data.rowCount)
        {
            return data.rows[0];
        }
        
        return undefined
    }

    async changeName(id : number, name : string) : Promise<TUser | undefined>
    {
        const data : QueryResult<TUser> = await client.query('UPDATE users SET name = $1 WHERE id = $2', [name, id]);

        if(data.rowCount)
        {
            return data.rows[0];
        }
        
        return undefined
    }

    async changePass(id : number, hash : string) : Promise<TUser | undefined>
    {
        const data : QueryResult<TUser> = await client.query('UPDATE users SET password = $1 WHERE id = $2', [hash, id]);

        if(data.rowCount)
        {
            return data.rows[0];
        }
        
        return undefined
    }

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
