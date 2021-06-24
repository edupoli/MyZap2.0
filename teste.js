/*##############################################################################
# File: teste.js                                                               #
# Project: myzap2.0                                                            #
# Created Date: 2021-06-23 11:09:35                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2021-06-24 16:30:48                                           #
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
            if (!dados.exists) {
                resolve(0)
            } else {
                let data = {
                    'WABrowserId': dados.data().WABrowserId,
                    'WASecretBundle': dados.data().WASecretBundle,
                    'WAToken1': dados.data().WAToken1,
                    'WAToken2': dados.data().WAToken2
                }
                resolve(data)
            }

        } catch (error) {
            reject(error)
        }
    })
}

// (async () => {
//     var token = await getToken('eduardo')
//     wppconnect.create({
//         session: 'calcinha',
//         catchQR: (base64Qrimg, asciiQR, attempts, urlCode) => {

//         },
//         statusFind: (statusSession, session) => {
//             console.log('Status Session: ', statusSession);
//             console.log('Session name: ', session);
//         },
//         headless: true,
//         devtools: false,
//         useChrome: true,
//         debug: false,
//         logQR: true,
//         browserArgs: [''],
//         disableWelcome: false,
//         updatesLog: true,
//         autoClose: 60000,
//         tokenStore: 'file',
//         folderNameToken: './tokens',

//         sessionToken: {
//             WABrowserId: token.WABrowserId,
//             WASecretBundle: token.WASecretBundle,
//             WAToken1: token.WAToken1,
//             WAToken2: token.WAToken2
//         }
//     })
//         .then((client) => start(client))
//         .catch((error) => console.log(error));

//     function start(client) {
//         client.onMessage((message) => {
//             if (message.body === 'Hello') {
//                 client
//                     .sendText(message.from, 'Hello, how I may help you?')
//                     .then((result) => {
//                         console.log('Result: ', result); //return object success
//                     })
//                     .catch((erro) => {
//                         console.error('Error when sending: ', erro); //return object error
//                     });
//             }
//         });
//     }
// })();



(async () => {
    let tokens = await getToken('eduardo');
    // console.log(tokens)
})();


// (async () => {
//     const Session = await firestore.collection('Sessions').doc('eduardo');
//     const data = await Session.get();

//     console.log(data.data().session)
// })();

// static async getAllSessions(req, res, next) {
//     try {
//         const Sessions = await firestore.collection('Sessions');
//         const data = await Sessions.get();
//         const SessionsArray = [];
//         if (data.empty) {
//             res.status(404).send('No Session record found');
//         } else {
//             data.forEach(doc => {
//                 const Session = new SessionsDB(
//                     doc.id,
//                     doc.data().name,
//                     doc.data().apitoken,
//                     doc.data().sessionkey,
//                     doc.data().wh_status,
//                     doc.data().wh_message,
//                     doc.data().wh_qrcode,
//                     doc.data().wh_connect,
//                     doc.data().wa_browser_id,
//                     doc.data().wa_secret_bundle,
//                     doc.data().wa_token_1,
//                     doc.data().wa_token_2
//                 );
//                 SessionsArray.push(Session);
//             });
//             res.send(SessionsArray);
//         }
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// }


// static async sendText(sessionkey, session, number, text) {
//     return new Promise((resolve, reject) => {
//         var options = {
//             'method': 'POST',
//             'json': true,
//             'url': 'http://192.168.15.109:3333/sendText',
//             'headers': {
//                 'sessionkey': sessionkey
//             },
//             body: {
//                 'session': session,
//                 'number': number,
//                 'text': text
//             }
//         };
//         request(options, function (error, response) {
//             if (error) {
//                 reject(error)
//             }
//             else {
//                 resolve(response.body)
//             }
//         });
//     })
// }

const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const qrcodeBase64 = require('qrcode');
const fs = require('fs');

client = new Client({
    restartOnAuthFail: true,
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ],
    },
    session: {
        WABrowserId: '"7+p16dFhkmgOVqW1nsJuVA=="',
        WASecretBundle: '{"key":"sNax/roxX0Rdqlh2iC37/fE9n/uHK8FBDxeLGJJa6uw=","encKey":"514unlIgzL1n5w+sZXf3Mhxg+FWKo000/bpaYgXK8b8=","macKey":"sNax/roxX0Rdqlh2iC37/fE9n/uHK8FBDxeLGJJa6uw="}',
        WAToken1: '"BSQtfX2qLNEX5+XQhYFmTPZ67rGLXxWcBG0zvGHxqi0="',
        WAToken2: '"1@qDDRX0qrLmMYwxmV9Cqk25+7G6eAawYqRq60ErVBek01JfOzbX3smikNWQv6ks87N6Z6pZ4V0z2EfA=="'
    }
});



client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true });
    qrcodeBase64.toDataURL(qr, (err, url) => {

    });
});
client.on('ready', () => {
    console.log('READY... WhatsApp is ready');
});
client.on('auth_failure', () => {
    console.log('Auth failure, restarting...');
    fs.unlinkSync(`./tokens/${session}.data.json`);
})
client.on('authenticated', (session) => {
    console.log(session)
    // fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
    //     if (err) console.log(err);
    // });
});

client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});

client.on('message_ack', (message, ack) => {
    console.log(message)
    console.log(ack)

});


client.on('message_create', (message) => {
    //console.log(message)
    // Disparado em todas as criações de mensagem, incluindo a sua => AQUI IREI DESENVOLVER O DISPARO PARA O WEBHOOK
    if (message.fromMe) {
        // faça coisas aqui, pode ser disparado um webhook por exemplo
    }
});

client.initialize();