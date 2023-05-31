import { Application, Router } from 'express';
import users from './user.route';
import auth from './auth.route';

const _routes: [string, Router][] = [
  ['/api/users', users],
  ['/api/auth', auth],
];

const routes = (app: Application) => {
  _routes.forEach((route) => {
    const [url, controller] = route;
    app.use(url, controller);
  });
};

export default routes;
