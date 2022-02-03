import { knexDB } from '../knexDatabase';
import { Tables } from '../../modules/shared/constants';

export class UserDetails {

    /**
         * reference :  
         * http://knexjs.org/
         * https://devhints.io/knex
         * https://github.com/knex/knex/issues/2365
         * https://github.com/adonisjs/adonis-framework/issues/234
         * https://stackoverflow.com/questions/35089571/knex-js-create-table-and-insert-data
        */

    // create USER_DETAILS table
    create() {
        return new Promise((resolve, reject) => {
            knexDB.getDatabase().schema.hasTable(Tables.USER_DETAILS).then((exists) => {
                // if table does not exist then create table
                if (!exists) {
                    knexDB.getDatabase().schema.createTable(Tables.USER_DETAILS, (table) => {
                        table.increments('USER_ID').primary(); // integer id
                        table.string('USERNAME', 100).notNullable();
                        table.integer('CONTACT_NUMBER').notNullable();
                        table.string('PASSWORD', 100).notNullable();
                        table.timestamp('CREATED_DATE_TIME').default('0000-00-00 00:00:00');
                    }).then(
                        (res) => {
                            return resolve('success');
                        }, (err) => {
                            return reject('Error while creating USER_DETAILS table : ' + err);
                        }
                    )
                } else {
                    console.info('USER_DETAILS table already exist');
                    return resolve('success');
                }
            })
        });
    }
}
