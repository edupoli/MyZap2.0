const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const qrcodeBase64 = require('qrcode');
const { Launcher } = require('chrome-launcher');
let chromeLauncher = Launcher.getInstallations()[0];
const Sessions = require('../controllers/sessions');
const events = require('../controllers/events');
const webhooks = require('../controllers/webhooks');
const fs = require('fs');
const path = require('path');

module.exports = class WhatsappWebJS {
    static async start(session) {

        const SESSIONS_FILE = path.resolve(`./tokens/${session}.json`);
        console.log('Creating session: ' + session);
        let sessionCfg;
        if (fs.existsSync(SESSIONS_FILE)) {
            sessionCfg = require(SESSIONS_FILE);
        }

        const client = new Client({
            restartOnAuthFail: true,
            puppeteer: {
                executablePath: chromeLauncher || null,
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
            session: sessionCfg
        });

        client.on('qr', (qr) => {
            console.log('QR RECEIVED', qr);
            qrcode.generate(qr, { small: true });
            qrcodeBase64.toDataURL(qr, (err, url) => {
                webhooks.wh_qrcode(session, url)
                //console.log(url)
            });
        });

        client.on('ready', () => {
            console.log('READY... WhatsApp is ready');
        });

        client.on('authenticated', (session) => {
            sessionCfg = session;
            fs.writeFile(SESSIONS_FILE, JSON.stringify(session), function (err) {
                if (err) {
                    console.error(err);
                }
            });
            Sessions.addInfoSession(session, {
                session: session,
                client: client
            })
        });

        client.on('change_state', (reason) => {
            console.log('Client was change state', reason);
            webhooks.wh_connect(session, reason)
        });

        client.on('auth_failure', function (session) {
            console.log('Auth failure, restarting...');
        });

        client.on('disconnected', (reason) => {
            console.log('Whatsapp is disconnected!');
            fs.unlinkSync(SESSIONS_FILE, function (err) {
                if (err) return console.log(err);
                console.log('Session file deleted!');
            });
            client.destroy();
            client.initialize();
        });

        client.on('change_battery', (batteryInfo) => {
            const { battery, plugged } = batteryInfo;
            console.log(`Battery: ${battery}% - Charging? ${plugged}`);
        });

        client.on('message', async message => {

        })

        client.on('message_create', (message) => {
            // Disparado em todas as criações de mensagem, incluindo a sua
            if (message.fromMe) {
                // faça coisas aqui, pode ser disparado um webhook por exemplo
            }
        });

        client.on('message_revoke_everyone', async (after, before) => {
            // Disparado sempre que uma mensagem é excluída por alguém (incluindo você)
            console.log(after); // mensagem depois de ser excluída.
            if (before) {
                console.log(before); // mensagem antes de ser excluída.
            }
        });

        client.on('message_revoke_me', async (message) => {
            // Disparado sempre que uma mensagem é excluída apenas em sua própria visualização.
            console.log(message.body); // mensagem antes de ser excluída.
        });
        client.initialize();
    }
}

// const { Client } = require('whatsapp-web.js');
// const qrcode = require('qrcode-terminal');
// const qrcodeBase64 = require('qrcode');
// const { Launcher } = require('chrome-launcher');
// let chromeLauncher = Launcher.getInstallations()[0];
// const Sessions = require('../controllers/sessions');
// const events = require('../controllers/events-whatswebjs');
// const webhooks = require('../controllers/webhooks');
// const fs = require('fs');
// const path = require('path');
// const superagent = require('superagent');
// require('superagent-queue');

// module.exports = class WhatsappWebJS {

//     static createSession = async function (session) {
//         return new Promise((resolve, rejects) => {
//             console.log('Creating session: ' + session);
//             const SESSION_FILE_PATH = path.resolve(`./tokens/${session}.json`);

//             let sessionCfg;
//             if (fs.existsSync(SESSION_FILE_PATH)) {
//                 sessionCfg = require(SESSION_FILE_PATH);
//             }

//             const client = new Client({
//                 restartOnAuthFail: true,
//                 puppeteer: {
//                     headless: true,
//                     executablePath: chromeLauncher || null,
//                     args: [
//                         '--no-sandbox',
//                         '--disable-setuid-sandbox',
//                         '--disable-dev-shm-usage',
//                         '--disable-accelerated-2d-canvas',
//                         '--no-first-run',
//                         '--no-zygote',
//                         '--single-process',
//                         '--disable-gpu'
//                     ],
//                 },
//                 session: sessionCfg
//             });

//             client.initialize();

//             client.on('qr', (qr) => {
//                 console.log('QR RECEIVED', qr);
//                 qrcode.generate(qr, { small: true });
//                 qrcodeBase64.toDataURL(qr, (err, url) => {
//                     webhooks.wh_qrcode(session, url)
//                 });
//             });

//             client.on('ready', () => {
//                 console.log('READY... WhatsApp is ready');
//                 resolve(client)
//             });

//             client.on('authenticated', (session) => {
//                 console.log('Whatsapp is authenticated!');
//                 sessionCfg = session;
//                 fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
//                     if (err) {
//                         console.error(err);
//                     }
//                 });
//                 Sessions.addInfoSession(session, {
//                     wa_browser_id: sessao.WABrowserId,
//                     wa_secret_bundle: sessao.WASecretBundle,
//                     wa_token_1: sessao.WAToken1,
//                     wa_token_2: sessao.WAToken2
//                 })
//             });

//             client.on('change_state', (reason) => {
//                 console.log('Client was change state', reason);
//                 webhooks.wh_status(session, reason)
//             });

//             client.on('auth_failure', function (session) {
//                 console.log('Auth failure, restarting...');
//             });

//             client.on('disconnected', (reason) => {
//                 console.log('Whatsapp is disconnected!');
//                 fs.unlinkSync(SESSION_FILE_PATH, function (err) {
//                     if (err) return console.log(err);
//                     console.log('Session file deleted!');
//                 });
//                 client.destroy();
//                 client.initialize();
//             });
//         })
//     }
// }

