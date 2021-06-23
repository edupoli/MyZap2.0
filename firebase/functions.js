/*##############################################################################
# File: functions.js                                                           #
# Project: MyZap2.0                                                            #
# Created Date: 2021-06-21 18:41:44                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2021-06-22 09:09:26                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

'use strict';

const firebase = require('./db');
const SessionsDB = require('./model');
const firestore = firebase.firestore();

module.exports = class Firebase {

    static async addSession(req, res, next) {
        try {
            const data = req.body;
            await firestore.collection('Sessions').doc().set(data);
            res.send('Record saved successfuly');
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    static async getAllSessions(req, res, next) {
        try {
            const Sessions = await firestore.collection('Sessions');
            const data = await Sessions.get();
            const SessionsArray = [];
            if (data.empty) {
                res.status(404).send('No Session record found');
            } else {
                data.forEach(doc => {
                    const Session = new SessionsDB(
                        doc.id,
                        doc.data().name,
                        doc.data().apitoken,
                        doc.data().sessionkey,
                        doc.data().wh_status,
                        doc.data().wh_message,
                        doc.data().wh_qrcode,
                        doc.data().wh_connect,
                        doc.data().wa_browser_id,
                        doc.data().wa_secret_bundle,
                        doc.data().wa_token_1,
                        doc.data().wa_token_2
                    );
                    SessionsArray.push(Session);
                });
                res.send(SessionsArray);
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    static async getSessionById(req, res, next) {
        try {
            const id = req.body.id;
            const Session = await firestore.collection('Sessions').doc(id);
            const data = await Session.get();
            if (!data.exists) {
                res.status(404).send('Session with the given ID not found');
            } else {
                res.send(data.data());
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    static async getSession(req, res, next) {
        try {

            const Session = firestore.collection('Sessions');
            const data = await Session.where('nome', '==', req.body.nome).get();
            if (data.empty) {
                console.log('No matching documents.');
                return;
            }
            data.forEach(doc => {
                res.send(doc.data())
            });

        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    static async updateSessionById(req, res, next) {
        try {
            const id = req.params.id;
            const data = req.body;
            const Session = await firestore.collection('Sessions').doc(id);
            await Session.update(data);
            res.send('Session record updated successfuly');
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    static async updateSession(req, res, next) {
        try {
            const Session = firestore.collection('Sessions')
            const data = await Session.where('nome', '==', req.body.nome).get();
            const dados = req.body;

            //await data.update(dados);
            res.send(data, 'Session record updated successfuly');
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    static async deleteSession(req, res, next) {
        try {
            const id = req.params.id;
            await firestore.collection('Sessions').doc(id).delete();
            res.send('Record deleted successfuly');
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
}