import { Client } from 'pg';        // Client
import * as dotenv from 'dotenv';   // Client
dotenv.config()                     // Client


/** Acces au serveur SQL */
export const client = new Client({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME, 
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT)
});

client.connect();
