

import { QueryResult } from 'pg';
import {client} from '../module/clientData';
import { TArticle } from '../types/TArticle';

export class ArticlesServices{
    async getAll() : Promise<TArticle[] | undefined>
    {
        const data : QueryResult<TArticle> = await client.query('SELECT * FROM articles');

        if(data.rowCount)
        {
            return data.rows;
        }
        return undefined
    }

    async getById(id : number) : Promise<TArticle | undefined>
    {
        const data : QueryResult<TArticle> = await client.query('SELECT * FROM articles WHERE id = $1', [id]);

        if(data.rowCount)
        {
            return data.rows[0];
        }
        return undefined
    }

    async add(user_id : number, title : string , content : string) : Promise<TArticle | undefined>
    {
        const data : QueryResult<TArticle> = await client.query('INSERT INTO articles (user_id, title ,content) VALUES ($1,$2,$3) RETURNING *', [user_id,title,content]);

        if(data.rowCount)
        {
            return data.rows[0];
        }
        return undefined
    }

}
