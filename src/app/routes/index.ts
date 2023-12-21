import express, { Router } from 'express';
import { AuthRouters } from '../modules/auth/auth.route';
import { BlogRouters } from '../modules/blog/blog.route';

const router = express.Router();

const moduleRoutes: Array<{ path: string; route: Router }> = [
  {
    path: '/auth',
    route: AuthRouters,
  },
  {
    path: '/blog',
    route: BlogRouters,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export const ApplicationRouters = router;
