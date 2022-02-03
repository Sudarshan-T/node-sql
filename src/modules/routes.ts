import { Router } from 'express';

import { UserController } from './user/UserController';

export class RoutesDef {
    router: Router = Router();

    constructor() {
        new UserController(this.router);
    }

}

export const Routes: Router = new RoutesDef().router;
