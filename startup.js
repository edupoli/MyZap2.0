/*##############################################################################
# File: startup.js                                                             #
# Project: myzap2.0                                                            #
# Created Date: 2021-06-27 02:34:00                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2021-06-30 22:58:02                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

const database = require('./firebase/functions');
const SessionsDB = require('./firebase/model');
const firebase = require('./firebase/db');
const firestore = firebase.firestore();
const request = require('request-promise');
const config = require('./config');
const async = require('async');


async function getAllSessions() {
    try {
        const Sessions = await firestore.collection('Sessions');
        const data = await Sessions.get();
        const SessionsArray = [];
        if (data.empty) {
            return null;
        } else {
            data.forEach(doc => {
                const Session = new SessionsDB(
                    doc.id,
                    doc.data().session,
                    doc.data().apitoken,
                    doc.data().sessionkey,
                    doc.data().wh_status,
                    doc.data().wh_message,
                    doc.data().wh_qrcode,
                    doc.data().wh_connect,
                    doc.data().WABrowserId,
                    doc.data().WASecretBundle,
                    doc.data().WAToken1,
                    doc.data().WAToken2
                );
                SessionsArray.push(Session);
            });
            return (SessionsArray);
        }
    } catch (error) {
        return (error.message);
    }
}

async function startAllSessions() {
    let dados = await getAllSessions()
    if (dados != null) {
        dados.map((item) => {
            var options = {
                'method': 'POST',
                'json': true,
                'url': `http://${config.host}:${config.port}/start`,
                'headers': {
                    'apitoken': item.apitoken,
                    'sessionkey': item.sessionkey
                },
                body: {
                    "session": item.session,
                    "wh_connect": item.wh_connect,
                    "wh_qrcode": item.wh_qrcode,
                    "wh_status": item.wh_status,
                    "wh_message": item.wh_message
                }

            };
            request(options).then(result => {
                console.log(result)
            }).catch(error => {
                console.log(error)
            })
        });
    }
}
module.exports.startAllSessions = startAllSessions;
