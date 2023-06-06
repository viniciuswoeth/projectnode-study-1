// Conjunto de rotas para organizar codigo

import { Router } from 'express';
import { UserRepository } from '../modules/user/repositories/userRepository';

const userRoutes = Router();
const userRepository = new UserRepository();

//Rota para criar novo usuario
userRoutes.post('/sing-up', (request, response) => {
    userRepository.create(request, response);
})//fim app.post(/user)

//Rota para autenticar usuario
userRoutes.post('/sing-in', (request, response) => {
    userRepository.login(request, response);
})//fim app.post(/user)

export { userRoutes };