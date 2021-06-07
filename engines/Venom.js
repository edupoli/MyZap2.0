const venom = require('venom-bot');
const Sessions = require('../controllers/sessions');
require('dotenv').config();
const events = require('../controllers/events');
const webhooks = require('../controllers/webhooks');
// Defina caso use o Browserless abaixo
const token_browser = process.env.TOKEN_BROWSERLESS

module.exports = class Venom {

    static async start(req, res, session) {
        const data = Sessions.getSession(session)
        try {
            const client = await venom.create(
                session,
                (base64Qrimg, asciiQR, attempts, urlCode) => {
                    webhooks.wh_qrcode(session, base64Qrimg);
                    this.exportQR(req, res, base64Qrimg, session);
                    Sessions.addInfoSession(session, {
                        qrCode: base64Qrimg
                    });
                },

                (statusSession, session) => {
                    console.log(statusSession)
                    Sessions.addInfoSession(session, {
                        status: statusSession
                    })
                    if (statusSession != 'qrReadSuccess') {
                        webhooks.wh_connect(session, statusSession)
                    }
                    if (statusSession === 'browserClose' ||
                        statusSession === 'qrReadFail' ||
                        statusSession === 'autocloseCalled' ||
                        statusSession === 'serverClose') {
                        req.io.emit('whatsapp-status', false)
                    }
                    if (statusSession === 'isLogged' ||
                        statusSession === 'qrReadSuccess' ||
                        statusSession === 'chatsAvailable' ||
                        statusSession === 'inChat') {
                        req.io.emit('whatsapp-status', true)
                    }
                },
                {
                    headless: true,
                    logQR: true,
                    browserWS: '', //browserless !=  '' ? browserless.replace('https://', 'wss://')+'?token='+token_browser : '',
                    useChrome: true,
                    updatesLog: true,
                    autoClose: 90000,
                    disableSpins: true,
                    browserArgs: [
                        '--log-level=3',
                        '--no-default-browser-check',
                        '--disable-site-isolation-trials',
                        '--no-experiments',
                        '--ignore-gpu-blacklist',
                        '--ignore-certificate-errors',
                        '--ignore-certificate-errors-spki-list',
                        '--disable-gpu',
                        '--disable-extensions',
                        '--disable-default-apps',
                        '--enable-features=NetworkService',
                        '--disable-setuid-sandbox',
                        '--no-sandbox',
                        // Extras
                        '--disable-webgl',
                        '--disable-threaded-animation',
                        '--disable-threaded-scrolling',
                        '--disable-in-process-stack-traces',
                        '--disable-histogram-customizer',
                        '--disable-gl-extensions',
                        '--disable-composited-antialiasing',
                        '--disable-canvas-aa',
                        '--disable-3d-apis',
                        '--disable-accelerated-2d-canvas',
                        '--disable-accelerated-jpeg-decoding',
                        '--disable-accelerated-mjpeg-decode',
                        '--disable-app-list-dismiss-on-blur',
                        '--disable-accelerated-video-decode',
                    ],
                    createPathFileToken: true,
                },
                {
                    WABrowserId: data.wa_browser_id,
                    WASecretBundle: data.wa_secret_bundle,
                    WAToken1: data.wa_token_1,
                    WAToken2: data.wa_token_2,
                }
            )

            let info = await client.getHostDevice()
            let tokens = await client.getSessionTokenBrowser()
            let browser = []
            // browserless != '' ? browserless+'/devtools/inspector.html?token='+token_browser+'&wss='+browserless.replace('https://', '')+':443/devtools/page/'+client.page._target._targetInfo.targetId : null
            webhooks.wh_connect(session, 'connected', info.wid.user, browser, tokens)
            events.receiveMessage(session, client)
            events.statusMessage(session, client)
            events.statusConnection(session, client)
            Sessions.addInfoSession(session, {
                client: client,
                tokens: tokens
            })
            return client;
        } catch (error) {
            console.log(error)
        }
    }

    static async stop(session) {
        let data = Sessions.getSession(session)
        let response = await data.client.close()
        if (response) {
            return true
        }
        return false

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