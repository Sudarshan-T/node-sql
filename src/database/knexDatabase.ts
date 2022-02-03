import { UserDetails } from './tables/UserDetails';

class knexDatabase {
    knexDatabase: any;

    setDatabase(database) {
        this.knexDatabase = database;
        this.createDatabase();
    }

    // get all database
    getDatabase() {
        return this.knexDatabase;
    }

    // Create database
    async createDatabase() {
        await new UserDetails().create();
    }

}

export const knexDB = new knexDatabase();
