import { Application, Router } from 'express';
import users from './user.route';

const _routes: [string, Router][] = [['/api/user', users]];

const routes = (app: Application) => {
  _routes.forEach((route) => {
    const [url, controller] = route;
    app.use(url, controller);
  });
};

export default routes;
