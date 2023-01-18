import { QueryResult } from "pg";                   // API

import { client } from "../module/clientData";      // Client

import { TComment } from "../types/TComment";       // TypeScript


/**
 * Permet la gestion des requetes SQL comments.
 * 
 * * **getAll()** : Récupération de tous les commentaires
 * * **getById()** : Récupération d'un commentaires en fonction de son id
 * * **getByArticleId()** : Récupération de tous les commentaires d'un article en fonction de son id
 * * **add()** : Ajout d'un commentaires
 * * **edit()** : Modification d'un commentaires
 * * **delete()** : Suppression d'un commentaires
 * * **deleteByArticleId()** : Suppression de tous les commentaires d'un article en fonction de son id
 */
export class CommentsServices
{
    /**
     * Récupération de tous les commentaires
     * 
     * @returns             Liste des articles -> TComment[] | undefined
     */
    async getAll() : Promise<TComment[] | undefined>
    {
        const data : QueryResult<TComment> = await client.query('SELECT * FROM comments');

        if(data.rowCount)
        {
            return data.rows;
        }
        return undefined
    }

    /**
     * Récupération d'un commentaires en fonction de son id
     * 
     * @param id            L'id du commentaires souhaité
     * @returns             Le commentaires souhaité -> TComment | undefined
     */
    async getById( id :number) : Promise<TComment | undefined>
    {
        const data : QueryResult<TComment> = await client.query('SELECT * FROM comments WHERE id = $1',[id]);

        if(data.rowCount)
        {
            return data.rows[0];
        }
        return undefined
    }

    /**
     * Récupération de tous les commentaires d'un article en fonction de son id
     * 
     * @param article_id    Id de l'article dant on souhaite les commentaires
     * @returns             Liste des commentaires de l'article -> TComment[] | undefined
     */
    async getByArticleId(article_id :number) : Promise<TComment[] | undefined>
    {
        const data : QueryResult<TComment> = await client.query('SELECT * FROM comments WHERE article_id = $1',[article_id]);

        if(data.rowCount)
        {
            return data.rows;
        }
        return undefined
    }

    /**
     * Ajout d'un commentaires
     * 
     * @param userId        L'id du propriétaire du commentaires      
     * @param articleId     L'id de l'article du commentaires  
     * @param content       Le contenu du commentaires  
     * @returns             Le commentaires créé -> TComment | undefined
     */
    async add(userId :number, articleId :number ,content : string) : Promise<TComment | undefined>
    {
        const data : QueryResult<TComment> = await client.query('INSERT INTO comments (user_id, article_id ,content) VALUES ($1,$2,$3) RETURNING *',[userId, articleId ,content]);

        if(data.rowCount)
        {
            return data.rows[0];
        }
        return undefined
    }

    /**
     * Modification d'un commentaires
     * 
     * @param id            L'id du commentaires à modifier   
     * @param content       Le nouveau contenu du commentaires  
     * @returns             Le commentaires modifié -> TComment | undefined
     */
    async edit(id :number,content : string) : Promise<TComment | undefined>
    {
        const data : QueryResult<TComment> = await client.query('UPDATE comments SET content = $1, modified = NOW() WHERE id = $2 RETURNING *',[ content , id]);

        if(data.rowCount)
        {
            return data.rows[0];
        }
        return undefined
    }

    /**
     * Suppression d'un commentaires
     * 
     * @param id            L'id du commentaires à supprimer   
     * @returns             Le nombre de commentaires supprimés -> number
     */
    async delete(id :number) : Promise<number>
    {
        const data : QueryResult<TComment> = await client.query('DELETE FROM comments WHERE id = $1', [ id ] );

        return data.rowCount;
    }

    /**
     * Suppression de tous les commentaires d'un article en fonction de son id
     * 
     * @param articleId     L'id de l'article dont on veux supprimer les commentaires  
     * @returns             Le nombre de commentaires supprimés -> number
     */
    async deleteByArticleId(articleId :number) : Promise<number>
    {
        const data : QueryResult<TComment> = await client.query('DELETE FROM comments WHERE id = $1', [ articleId ] );

        return data.rowCount;
    }

}