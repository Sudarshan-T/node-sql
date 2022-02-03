import * as express from 'express';

import { User } from './User';

export class UserController {
    constructor(router: express.Router) {
        router.post('/user', this.createUser);
        router.post('/login', this.login);
        router.get('/user', this.getUser);
        router.delete('/user', this.deleteUser);
    }

    // create new user
    createUser(request: express.Request, response: express.Response) {
        const user = new User();
        user.create(request.body).then(
            (res) => response.status(200).json(res),
            (err) => response.status(422).json(err)
        );
    }

    // get all users
    getUser(request: express.Request, response: express.Response) {
        const user = new User();
        user.getUser(request.query).then(
            (res) => response.status(200).json(res),
            (err) => response.status(422).json(err)
        );
    }

    // login
    login(request: express.Request, response: express.Response) {
        const user = new User();
        user.login(request.body).then(
            (res) => {
                response.setHeader('Authorization', 'Bearer ' + res['token'])
                response.status(200).json(res)},
            (err) => response.status(422).json(err)
        );
    }

    // delete users
    deleteUser(request: express.Request, response: express.Response) {
        const user = new User();
        user.delete(request.body.userIDs).then(
            (res) => response.status(200).json(res),
            (err) => response.status(422).json(err)
        );
    }
}
