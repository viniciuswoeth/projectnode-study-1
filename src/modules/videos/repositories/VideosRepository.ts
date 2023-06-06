//uma Factory function que vai criar um objeto com metodos e propriedades
import { pool } from '../../../mysql';
import { v4 as uuidv4 } from 'uuid';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { request, Request, Response } from 'express';

class VideoRepository {

    // Usuario cria um novo video
    create(request: Request, response: Response) {
        const { title, description, user_id } = request.body;

        //importa a pool
        // a conexao tem um callback dentro que tem um erro e uma conexao 
        // tem uma arrow function onde tem a conexao
        pool.getConnection((err: any, connection: any) => {
            if (err) {
                return response.status(500).json(err)
            }
            // query SQL onde se tem 3 parametros
            connection.query(
                // primeiro parametro é a nossa query (se escreve em SQL)
                //Inserir video no banco de dados 
                'INSERT INTO videos (video_id, user_id, title, description) VALUES (?,?,?,?)',
                // um array de valores
                [uuidv4(), user_id, title, description],
                // arrow function, que recebe 3 parametros 
                (error: any, result: any, fields: any) => {
                    connection.release();//Encerrar conexao (ao receber o resultado) (sem codigo conexao continua aberta)
                    //Caso de erro na solicitacao ao banco de dados
                    if (error) {
                        return response.status(400).json(error);
                    }
                    //Caso seja bem sucedido 
                    response.status(200).json({ message: 'Video criado com sucesso' });
                }// fim arrow function 3 parametros
            )//fim connection
        })//fim pool.getConnection
    }//fim create

    //Envia user_id do usuario e recebe todos os videos do usuario
    getVideos(request: Request, response: Response) {
        const { user_id } = request.body;

        //importa a pool
        // a conexao tem um callback dentro que tem um erro e uma conexao 
        // arrow function 
        pool.getConnection((err: any, connection: any) => {
            // query SQL onde se tem 3 parametros
            connection.query(
                // primeiro parametro é a nossa query (se escreve em SQL)
                'SELECT * FROM videos WHERE user_id = ?',
                // sao os valores, um array de valores
                [user_id],
                // arrow function, que recebe 3 parametros 
                (error: any, results: any, fields: any) => {
                    connection.release();//Encerrar conexao (ao receber o resultado) (sem codigo conexao continua aberta)
                    if (error) {
                        return response.status(400).json({ error: "Erro ao buscar os videos" });
                    }

                    return response.status(200).json({ message: 'Videos retornados com sucesso', videos: results })
                }// fim arrow function 3 parametros
            )//fim connection
        })//fim pool.getConnection
    }//fim getVideos

    // procura videos no BD
    searchVideos(request: Request, response: Response) {
        const { search } = request.query;

        //importa a pool
        // a conexao tem um callback dentro que tem um erro e uma conexao 
        // arrow function 
        pool.getConnection((err: any, connection: any) => {
            // query SQL onde se tem 3 parametros
            connection.query(
                // primeiro parametro é a nossa query (se escreve em SQL)
                'SELECT * FROM videos WHERE title LIKE ?',
                // sao os valores, um array de valores
                // Palavra a ser pesquisada tem que ficar entre % xxx % (porcentagem) 
                [`%${search}%`],
                // arrow function, que recebe 3 parametros 
                (error: any, results: any, fields: any) => {
                    connection.release();//Encerrar conexao (ao receber o resultado) (sem codigo conexao continua aberta)
                    if (error) {
                        return response.status(400).json({ error: "Erro ao buscar os videos" });
                    }

                    return response.status(200).json({message: 'Videos retornados com sucesso', videos: results})
                }// fim arrow function 3 parametros
            )//fim connection
        })//fim pool.getConnection
    }//fim getVideos
}//fim class VideoRepository

export { VideoRepository };