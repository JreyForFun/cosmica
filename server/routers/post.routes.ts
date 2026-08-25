import { Router } from 'express';
import { createUserPostHandler, getAllPostHandler, getPostByIdAndUserIdHandler, getUserPostsHandler, updateUserPostHandler, deleteUserPostHandler} from '../controllers/post.controller';
import { authenticate } from '../middlewares/auth.middleware';

export const postRouter = Router();

postRouter.use(authenticate);

postRouter.post('/', createUserPostHandler);
postRouter.get('/', getAllPostHandler);
postRouter.get('/user', getUserPostsHandler);
postRouter.get('/:postId', getPostByIdAndUserIdHandler);
postRouter.put('/:postId', updateUserPostHandler);
postRouter.delete('/:postId', deleteUserPostHandler);