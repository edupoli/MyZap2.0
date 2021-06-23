/*##############################################################################
# File: config.js                                                              #
# Project: MyZap2.0                                                            #
# Created Date: 2021-06-21 12:52:13                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2021-06-21 14:09:55                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

//'use strict';
const dotenv = require('dotenv');
const assert = require('assert');

dotenv.config();

const {
    PORT,
    HOST,
    TOKEN,
    HTTPS,
    SSL_KEY_PATH,
    SSL_CERT_PATH,
    API_KEY,
    AUTH_DOMAIN,
    DATABASE_URL,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGING_SENDER_ID,
    APP_ID
} = process.env;

assert(PORT, 'PORT is required, please set the PORT variable value in the .env file');
assert(HOST, 'HOST is required, please set the HOST variable value in the .env file');
assert(TOKEN, 'TOKEN is required, please set the token variable value in the .env file');



module.exports = {
    port: PORT,
    host: HOST,
    token: TOKEN,
    https: HTTPS,
    ssl_key_path: SSL_KEY_PATH,
    ssl_cert_path: SSL_CERT_PATH,
    firebaseConfig: {
        apiKey: API_KEY,
        authDomain: AUTH_DOMAIN,
        databaseURL: DATABASE_URL,
        projectId: PROJECT_ID,
        storageBucket: STORAGE_BUCKET,
        messagingSenderId: MESSAGING_SENDER_ID,
        appId: APP_ID
    }
}