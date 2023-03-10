import { QueryResult } from 'pg';                   // API

import { client } from '../module/clientData';      // Client

import { TArticle } from '../types/TArticle';       // TypeScript



/**
 * Permet la gestion des requetes SQL articles.
 * 
 * * **getAll()** : Récupération de tous les articles
 * * **getById()** : Récupération d'un articles en fonction de son id
 * * **add()** : Ajout d'un articles
 * * **edit()** : Modification du titre et du content d'un articles
 * * **editTitre()** : Modification du titre d'un articles
 * * **editContent()** : Modification du content d'un articles
 * * **delete()** : Suppression d'un articles
 */
export class ArticlesServices{

    /**
     * Récupération de tous les articles
     * 
     * @returns Liste des articles -> TArticle[] | undefined
     */
    async getAll() : Promise<TArticle[] | undefined>
    {
        const data : QueryResult<TArticle> = await client.query('SELECT articles.*, name AS user_name FROM articles INNER JOIN users ON articles.user_id = users.id WHERE not_achive = true');

        if(data.rowCount)
        {
            return data.rows;
        }
        return undefined
    }

    /**
     * Récupération d'un articles en fonction de son id
     * 
     * @param id        L'id de l'article souhaité
     * @returns         L'articles souhaité -> TArticle | undefined
     */
    async getById(id : number) : Promise<TArticle | undefined>
    {
        const data : QueryResult<TArticle> = await client.query('SELECT articles.* , name AS user_name FROM articles INNER JOIN users ON articles.user_id = users.id WHERE articles.id = $1 AND not_achive = true', [id]);

        if(data.rowCount)
        {
            return data.rows[0];
        }
        return undefined
    }

    /**
     * Ajout d'un articles
     * 
     * @param user_id   l'id du propriétaire de l'article
     * @param title     Le titre du nouvel article
     * @param content   Le contenu du nouvel article
     * @returns         L'articles créé -> TArticle | undefined
     */
    async add(user_id : number, title : string , content : string) : Promise<TArticle | undefined>
    {
        const data : QueryResult<TArticle> = await client.query('INSERT INTO articles (user_id, title ,content) VALUES ($1,$2,$3) RETURNING *', [user_id,title,content]);

        if(data.rowCount)
        {
            return this.getById(data.rows[0].id);
        }
        return undefined
    }

    /**
     * Modification du titre et du content d'un articles
     * 
     * @param id        L'id de l'article souhaité
     * @param title     Nouveau titre de l'article
     * @param content   Nouveau contenu de l'article article
     * @returns         L'articles modifié -> TArticle | undefined
     */
    async edit(id : number, title : string , content : string) : Promise<TArticle | undefined>
    {
        const data : QueryResult<TArticle> = await client.query('UPDATE articles SET title = $1 ,content = $2, modified = NOW() WHERE id = $3  AND not_achive = true RETURNING *', [title,content,id]);

        if(data.rowCount)
        {
            return this.getById(data.rows[0].id);;
        }
        return undefined
    }

    /**
     * Modification du titre d'un articles
     * 
     * @param id        L'id de l'article souhaité
     * @param title     Nouveau titre de l'article
     * @returns         L'articles modifié -> TArticle | undefined
     */
    async editTitre(id : number, title : string ) : Promise<TArticle | undefined>
    {
        
        const data : QueryResult<TArticle> = await client.query('UPDATE articles SET title = $1, modified = NOW() WHERE id = $2  AND not_achive = true RETURNING *', [title,id]);

        if(data.rowCount)
        {
            return this.getById(data.rows[0].id);;
        }
        return undefined
    }

    /**
     * Modification du content d'un articles
     * 
     * @param id        L'id de l'article souhaité
     * @param content   Nouveau contenu de l'article article
     * @returns         L'articles modifié -> TArticle | undefined
     */
    async editContent(id : number , content : string) : Promise<TArticle | undefined>
    {
        const data : QueryResult<TArticle> = await client.query('UPDATE articles SET content = $1, modified = NOW() WHERE id = $2 AND not_achive = true RETURNING *', [content,id]);

        if(data.rowCount)
        {
            return this.getById(data.rows[0].id);;
        }
        return undefined
    }

    /**
     * Archivage d'un articles
     * 
     * @param id        L'id de l'article souhaité
     * @returns         le nombre d'article supprimé -> number
     */
    async delete(id : number ) : Promise<number | undefined>
    {
        const data : QueryResult<TArticle> = await client.query('UPDATE articles SET not_achive = false, modified = NOW() WHERE id = $1 RETURNING *', [id]);

        return data.rowCount;
    }

}
