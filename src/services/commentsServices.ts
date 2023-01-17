import { QueryResult } from "pg";
import { client } from "../module/clientData";
import { TComment } from "../types/TComment";

export class CommentsServices{
    async getAll() : Promise<TComment[] | undefined>
    {
        const data : QueryResult<TComment> = await client.query('SELECT * FROM comments');

        if(data.rowCount)
        {
            return data.rows;
        }
        return undefined
    }
    async getById( id :number) : Promise<TComment | undefined>
    {
        const data : QueryResult<TComment> = await client.query('SELECT * FROM comments WHERE id = $1',[id]);

        if(data.rowCount)
        {
            return data.rows[0];
        }
        return undefined
    }
    async getByArticleId(article_id :number) : Promise<TComment[] | undefined>
    {
        const data : QueryResult<TComment> = await client.query('SELECT * FROM comments WHERE article_id = $1',[article_id]);

        if(data.rowCount)
        {
            return data.rows;
        }
        return undefined
    }

    async add(userId :number, articleId :number ,content : string) : Promise<TComment | undefined>
    {
        const data : QueryResult<TComment> = await client.query('INSERT INTO comments (user_id, article_id ,content) VALUES ($1,$2,$3) RETURNING *',[userId, articleId ,content]);

        if(data.rowCount)
        {
            return data.rows[0];
        }
        return undefined
    }


    async edit(id :number,content : string) : Promise<TComment | undefined>
    {
        const data : QueryResult<TComment> = await client.query('UPDATE comments SET content = $1, modified = NOW() WHERE id = $2 RETURNING *',[id ,content]);

        if(data.rowCount)
        {
            return data.rows[0];
        }
        return undefined
    }

    async delete(id :number) : Promise<number>
    {
        const data : QueryResult<TComment> = await client.query('DELETE FROM comments WHERE id = $1', [ id ] );

        return data.rowCount;
    }

    async deleteByArticleId(articleId :number) : Promise<number>
    {
        const data : QueryResult<TComment> = await client.query('DELETE FROM comments WHERE id = $1', [ articleId ] );

        return data.rowCount;
    }

}