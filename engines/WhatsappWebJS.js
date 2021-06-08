/*
 * @Author: Eduardo Policarpo
 * @contact: +55 43996611437
 * @Date: 2021-05-10 18:09:49
 * @LastEditTime: 2021-06-07 03:18:01
 */
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
    static async start(req, res, session) {
        console.log(`****** STARTING SESSION ${session} ******`)
        const SESSION_FILE_PATH = path.resolve(`./tokens/${session}.data.json`);
        let client;
        let dataSession;

        const withSession = () => {
            dataSession = require(SESSION_FILE_PATH);
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
                session: dataSession
            });

            client.on('ready', () => {
                Sessions.addInfoSession(session, {
                    session: session,
                    client: client
                })
                req.io.emit('whatsapp-status', true);
                console.log('READY... WhatsApp is ready');
            });
            client.on('auth_failure', () => {
                console.log('Auth failure, restarting...');
                fs.unlinkSync(`./tokens/${session}.data.json`);
            })
            client.initialize();
            Sessions.addInfoSession(session, {
                session: session,
                client: client
            })
        }

        const withOutSession = () => {
            client = new Client();
            client.on('qr', (qr) => {
                console.log('QR RECEIVED', qr);
                qrcode.generate(qr, { small: true });
                qrcodeBase64.toDataURL(qr, (err, url) => {
                    webhooks.wh_qrcode(session, url)
                    this.exportQR(req, res, url, session);
                    Sessions.addInfoSession(session, {
                        qrCode: url
                    })
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
                dataSession = session;
                fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
                    if (err) console.log(err);
                });
            });
            client.initialize();
            Sessions.addInfoSession(session, {
                session: session,
                client: client
            })
        }

        (fs.existsSync(SESSION_FILE_PATH)) ? withSession() : withOutSession();

        client.on('change_state', (reason) => {
            console.log('Client was change state', reason);
            webhooks.wh_connect(session, reason)
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
            //console.log(message)
            // Disparado em todas as criações de mensagem, incluindo a sua => AQUI IREI DESENVOLVER O DISPARO PARA O WEBHOOK
            if (message.fromMe) {
                // faça coisas aqui, pode ser disparado um webhook por exemplo
            }
        });

        client.on('message_revoke_everyone', async (after, before) => {
            // Disparado sempre que uma mensagem é excluída por alguém (incluindo você)
            //console.log(after); // mensagem depois de ser excluída.
            if (before) {
                //console.log(before); // mensagem antes de ser excluída.
            }
        });

        client.on('message_revoke_me', async (message) => {
            // Disparado sempre que uma mensagem é excluída apenas em sua própria visualização.
            console.log(message.body); // mensagem antes de ser excluída.
        });
    }
    static async exportQR(req, res, qrCode, session) {
        qrCode = qrCode.replace('data:image/png;base64,', '');
        const imageBuffer = Buffer.from(qrCode, 'base64');
        req.io.emit('qrCode',
            {
                data: 'data:image/png;base64,' + imageBuffer.toString('base64'),
                session: session
            }
        );
    }
}