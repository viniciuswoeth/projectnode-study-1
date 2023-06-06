//uma Factory function que vai criar um objeto com metodos e propriedades
import { pool } from '../../../mysql';
import { v4 as uuidv4 } from 'uuid';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { request, Request, Response } from 'express';


class UserRepository {

    // Criando Usuario no Banco de Dados
    create(request: Request, response: Response) {
        const { name, email, password } = request.body;

        //importa a pool
        // a conexao tem um callback dentro que tem um erro e uma conexao 
        // tem uma arrow function onde tem a conexao
        pool.getConnection((err: any, connection: any) => {
            hash(password, 10, (err, hash) => {
                if (err) {
                    return response.status(500).json(err)
                }
                // query SQL onde se tem 3 parametros
                connection.query(
                    // primeiro parametro é a nossa query (se escreve em SQL)
                    //Para user_id necessario instalar um biblioteca chamada "uuid" (npm i uuid)
                    //Inserir usuario no banco de dados 
                    'INSERT INTO users (user_id, name, email, password) VALUES (?,?,?,?)',
                    // sao os valores, um array de valores
                    [uuidv4(), name, email, hash],
                    // arrow function, que recebe 3 parametros 
                    // 
                    (error: any, result: any, fields: any) => {
                        connection.release();//Encerrar conexao (ao receber o resultado) (sem codigo conexao continua aberta)
                        if (error) {
                            return response.status(400).json(error);
                        }
                        response.status(200).json({ message: 'Usuario criado com sucesso' });
                    }// fim arrow function 3 parametros
                )//fim connection
            })//fim hash bcrypt password
        })//fim pool.getConnection
    }//fim create

    login(request: Request, response: Response) {
        const { email, password } = request.body;

        //importa a pool
        // a conexao tem um callback dentro que tem um erro e uma conexao 
        // tem uma arrow function onde tem a conexao
        pool.getConnection((err: any, connection: any) => {
            // query SQL onde se tem 3 parametros
            connection.query(
                // primeiro parametro é a nossa query (se escreve em SQL)
                //Para user_id necessario instalar um biblioteca chamada "uuid" (npm i uuid)
                'SELECT * FROM users WHERE email = ?',
                // sao os valores, um array de valores
                [email],
                // arrow function, que recebe 3 parametros 
                (error: any, results: any, fields: any) => {
                    connection.release();//Encerrar conexao (ao receber o resultado) (sem codigo conexao continua aberta)
                    if (error) {
                        return response.status(400).json({ error: "Erro na sua autenticacao" });
                    }
                    compare(password, results[0].password, (err, result) => {
                        if (err) {
                            return response.status(400).json({ error: "Erro na sua autenticacao" });
                        }

                        if (result) {
                            // Retorna um JWT (Jason Web Token) pode ser atribuido tempo de expiracao
                            // Caso senha esteja correta o usuario recebe um token (utilizar biblioteca jsonwebtoken)
                            const token = sign({
                                id: results[0].user_id,
                                email: results[0].email
                            }, process.env.SECRET as string, { expiresIn: "1d" })

                            return response.status(200).json({ token: token, message: 'Autenticado com sucesso' })
                        }

                    })
                }// fim arrow function 3 parametros
            )//fim connection
        })//fim pool.getConnection
    }//fim Login
}//fim Class UseRepository

export { UserRepository };