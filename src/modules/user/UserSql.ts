import { Tables } from '../shared/constants';
import { UserModel } from './UserModel';

export class UserSQL {

    // create new user
    async add(userDetail: UserModel, transaction) {
        try {
            const response = await transaction(Tables.USER_DETAILS)
                .insert(userDetail);
            return response;
        } catch (error) {
            throw new Error(error);
        }
    }

    // get users
    async getUser(query, transaction) {
        try {
            const response = await transaction(Tables.USER_DETAILS)
                .orderBy('CREATED_DATE_TIME', 'asc')    // sort by created date ascending order
                .select('*')
                .modify(queryBuilder => {
                    // get user based on username
                    if (query.USERNAME) {
                        queryBuilder.where('USERNAME', query.USERNAME)
                    }
                    // get user based on contact number
                    if (query.CONTACT_NUMBER) {
                        queryBuilder.where('CONTACT_NUMBER', query.CONTACT_NUMBER)
                    }
                });
            return response;
        } catch (error) {
            throw new Error(error);
        }
    }

    // delete user with the userIDs
    async deleteUser(userIDs, transaction) {
        try {
            const response = await transaction(Tables.USER_DETAILS)
                .delete()
                .where('USER_ID', 'in', userIDs)
            return response;
        } catch (error) {
            throw new Error(error);
        }
    }
}
