/*##############################################################################
# File: teste.js                                                               #
# Project: myzap2.0                                                            #
# Created Date: 2021-06-23 11:09:35                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2021-06-23 12:51:08                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

const firebase = require('./firebase/db');
const firestore = firebase.firestore();
const wppconnect = require('@wppconnect-team/wppconnect');

async function getToken(session) {
    return new Promise(async (resolve, reject) => {
        try {
            const Session = await firestore.collection('Sessions').doc(session);
            const dados = await Session.get();
            let data = {
                'WABrowserId': dados.data().WABrowserId,
                'WASecretBundle': dados.data().WASecretBundle,
                'WAToken1': dados.data().WAToken1,
                'WAToken2': dados.data().WAToken2
            }
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

(async () => {
    var token = await getToken('eduardo')
    wppconnect.create({
        session: 'calcinha',
        catchQR: (base64Qrimg, asciiQR, attempts, urlCode) => {

        },
        statusFind: (statusSession, session) => {
            console.log('Status Session: ', statusSession);
            console.log('Session name: ', session);
        },
        headless: true,
        devtools: false,
        useChrome: true,
        debug: false,
        logQR: true,
        browserArgs: [''],
        disableWelcome: false,
        updatesLog: true,
        autoClose: 60000,
        tokenStore: 'file',
        folderNameToken: './tokens',

        sessionToken: {
            WABrowserId: token.WABrowserId,
            WASecretBundle: token.WASecretBundle,
            WAToken1: token.WAToken1,
            WAToken2: token.WAToken2
        }
    })
        .then((client) => start(client))
        .catch((error) => console.log(error));

    function start(client) {
        client.onMessage((message) => {
            if (message.body === 'Hello') {
                client
                    .sendText(message.from, 'Hello, how I may help you?')
                    .then((result) => {
                        console.log('Result: ', result); //return object success
                    })
                    .catch((erro) => {
                        console.error('Error when sending: ', erro); //return object error
                    });
            }
        });
    }
})();



// (async () => {
//     let tokens = await getToken('eduardo');
//     console.log(tokens)
// })();


// (async () => {
//     const Session = await firestore.collection('Sessions').doc('eduardo');
//     const data = await Session.get();

//     console.log(data.data().session)
// })();
