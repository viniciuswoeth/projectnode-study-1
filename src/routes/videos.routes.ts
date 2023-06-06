// Conjunto de rotas para organizar codigo
import { Router } from 'express';
import { VideoRepository } from '../modules/videos/repositories/VideosRepository';
import { login } from '../middleware/login';

const videosRoutes = Router();
const videoRepository = new VideoRepository();

//Rota para criar video
videosRoutes.post('/create-video', login, (request, response) => {
    videoRepository.create(request, response);
})//fim videosRoutes.post(/create-video)

//Rota retorna videos do usuario
videosRoutes.get('/get-videos', login, (request, response) => {
    videoRepository.getVideos(request, response);
})//fim videosRoutes.get(/get-videos)

//Rota retorna videos pelo titulo
videosRoutes.get('/search', login, (request, response) => {
    videoRepository.searchVideos(request, response);
})//fim videosRoutes.get(/get-videos)

export { videosRoutes };