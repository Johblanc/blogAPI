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

}