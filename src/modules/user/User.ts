import { knexDB } from '../../database/knexDatabase';
import { UserModel } from './UserModel';
import { UserSQL } from './UserSql';
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');

export class User {
    // create users
    create(body) {
        return new Promise(async (resolve, reject) => {
            const knexDb = knexDB.getDatabase();
            const transaction = await knexDb.transaction();
            try {
                const userDetail: UserModel = body;
                // Check if username and password exist
                if (!userDetail.USERNAME || userDetail.USERNAME.trim().length == 0 || !userDetail.PASSWORD || userDetail.PASSWORD.trim().length === 0) {
                    transaction.rollback();
                    return reject({message: 'Invalid User details', status: 422});
                }
                // encrypt password
                const password = CryptoJS.AES.encrypt(userDetail.PASSWORD, process.env.PASSWORD_SECRET).toString();
                userDetail.PASSWORD = password;     // encrypted password
                userDetail.CREATED_DATE_TIME = new Date();  // user created date
                // validate password
                if (typeof (userDetail.CONTACT_NUMBER) !== 'number' || userDetail.CONTACT_NUMBER.toString().trim().length !== 10) {
                    transaction.rollback();
                    return reject({message: 'Invalid Contact number', status: 422});
                }
                // check if username already exist in database
                const validateUsername = await new UserSQL().getUser({USERNAME: userDetail.USERNAME}, transaction);
                if (validateUsername.length) {
                    transaction.rollback();
                    return reject({message: 'Username already exist', status: 422});
                }
                // check if password already exist in database
                const validateContactNumber = await new UserSQL().getUser({CONTACT_NUMBER: userDetail.CONTACT_NUMBER}, transaction);
                if (validateContactNumber.length) {
                    transaction.rollback();
                    return reject({message: 'Contact number already exist', status: 422});
                }
                // add new user
                await new UserSQL().add(userDetail, transaction);
                transaction.commit();
                return resolve({message: 'User created', status: 200});
            } catch (err) {
                transaction.rollback();
                return reject({message: 'Error creating user', status: 422});
            }
        });
    }

    // get users
    getUser(query) {
        return new Promise(async (resolve, reject) => {
            const knexDb = knexDB.getDatabase();
            const transaction = await knexDb.transaction();

            try {
                const users = await new UserSQL().getUser(query, transaction);
                // for all users get created date time and decrypt password
                for (let user of users) {
                    user.CREATED_DATE_TIME.setHours(user.CREATED_DATE_TIME.getHours() + 5);
                    user.CREATED_DATE_TIME.setMinutes(user.CREATED_DATE_TIME.getMinutes() + 30);
                    const bytes  = CryptoJS.AES.decrypt(user.PASSWORD, process.env.PASSWORD_SECRET);
                    user.PASSWORD = bytes.toString(CryptoJS.enc.Utf8);
                }
                transaction.commit();
                return resolve({ data: users, status: 200 });
            } catch (err) {
                transaction.rollback();
                return reject({ err, status: 422 });
            }
        });
    }

    // login
    login(credentials: { USERNAME: String, PASSWORD: String }) {
        return new Promise(async (resolve, reject) => {
            const knexDb = knexDB.getDatabase();
            const transaction = await knexDb.transaction();

            try {
                // get user by username
                const users = await new UserSQL().getUser(credentials, transaction);
                // if no user data with the username reject request
                if (users.length === 0) {
                    transaction.rollback();
                    return reject({ message: 'Invalid Username', status: 422 });
                }
                // decrypt password
                const bytes  = CryptoJS.AES.decrypt(users[0].PASSWORD, process.env.PASSWORD_SECRET);
                users[0].PASSWORD = bytes.toString(CryptoJS.enc.Utf8);
                // If password does not match reject request
                if (users[0].PASSWORD !== credentials.PASSWORD) {
                    transaction.rollback();
                    return reject({ message: 'Incorrect Password', status: 422 });
                }
                // data to create token
                const loggedInUser = {
                    USERNAME: users[0].USERNAME,
                    CONTACT_NUMBER: users[0].CONTACT_NUMBER,
                    PASSWORD: users[0].PASSWORD,
                    USER_ID: users[0].USER_ID,
                    CREATED_DATE_TIME: users[0].CREATED_DATE_TIME,
                };
                transaction.commit();
                // create jwt token
                const token = 'Bearer ' + jwt.sign(loggedInUser, process.env.JWT_SECRET);
                return resolve({ token, message: 'Logged In successfully', status: 200 });
            } catch (err) {
                transaction.rollback();
                return reject({ err, status: 422 });
            }
        });
    }

    // delete users
    delete(userIDs: Number[]) {
        return new Promise(async (resolve, reject) => {
            const knexDb = knexDB.getDatabase();
            const transaction = await knexDb.transaction();

            try {
                // Delete users with the userIDs
                const users = await new UserSQL().deleteUser(userIDs, transaction);
                transaction.commit();
                return resolve({ message: 'User deleted', numberOfUsersDeleted: users, status: 200 });
            } catch (err) {
                transaction.rollback();
                return reject({ err, status: 422 });
            }
        });
    }
}
