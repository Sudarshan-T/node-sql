require('dotenv').config()
import { default as express } from "express";
import * as bodyParser from "body-parser";

import { knexDB } from './database/knexDatabase';
import Knex from 'knex';
import * as knexconfiguration from './database/knexfile';

import { Routes } from "./modules/routes";

const jwt = require('jsonwebtoken');

export class App {
    public app: express.Application;
    public port: number;

    constructor(port) {
        this.app = express();
        this.port = port;

        this.configure();
    }

    // connect to MySQL and set to knexDatabase class method
    private configureMySQL(): void {
        // const configuration = require('./databases/knexfile');
        const database = Knex(knexconfiguration);
        knexDB.setDatabase(database);
    }

    private accessControl() {
        this.app.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader(
                "Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            );
            res.setHeader(
                "Access-Control-Allow-Methods",
                "GET, POST, PATCH, DELETE, OPTIONS"
            );
            next();
        });
    }

    private initializeControllers() {
        this.app.use("/api", Routes);
    }

    private configure() {
        this.app.use(bodyParser.json());
        this.accessControl();
        this.configureMySQL();
        this.app.use((req, res, next) => {
            next();
            let user = req['user'];
            if (user) {
                delete user.exp;
                delete user.iat;
                const token = jwt.sign(user, 'secret-key', { expiresIn: '1h' })
                res.setHeader('Authorization', token);
            }
        });
        this.initializeControllers();
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}
