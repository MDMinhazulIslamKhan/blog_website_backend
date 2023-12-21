import express, { Router } from 'express';
import { AuthRouters } from '../modules/auth/auth.route';

const router = express.Router();

const moduleRoutes: Array<{ path: string; route: Router }> = [
  {
    path: '/auth',
    route: AuthRouters,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export const ApplicationRouters = router;
