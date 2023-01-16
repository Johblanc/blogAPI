import { QueryResult } from "pg";
import { client } from "../module/clientData";
import { TComment } from "../types/TComment";

export class CommentsServices{
    async getByArticleId() : Promise<TComment[] | undefined>
    {
        const data : QueryResult<TComment> = await client.query('SELECT * FROM comments');

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

}