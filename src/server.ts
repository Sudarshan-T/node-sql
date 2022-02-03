import { App } from "./app";
const knex = require('./database/database');

const port = 3000;

const app = new App(port)

app.listen();
