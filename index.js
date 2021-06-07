/*
 * @Author: Eduardo Policarpo
 * @contact: +55 43996611437
 * @Date: 2021-05-10 18:09:49
 * @LastEditTime: 2021-06-07 03:18:01
 */
'use strict';
const cors = require('cors');
const express = require('express');
const app = express();
const path = require('path')
const server = require('http').Server(app);
//const router = require('./routers/WppConnect');
const serveIndex = require('serve-index');
const motor = require('./engines');
require('dotenv').config();
const router = motor.engines[process.env.ENGINE].router

const io = require('socket.io')(server, {
    cors: {
        origins: ["*"],
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('json spaces', 2);
app.use(express.static('public'));
express.static(path.join(__dirname, '/public'));
app.use('/files', express.static('files-received'), serveIndex('files-received', { icons: true }));

app.use((req, res, next) => {
    req.io = io;
    next();
});


app.use(router);

io.on('connection', sock => {
    console.log(`ID: ${sock.id} socket in`)

    sock.on('event', data => {
        console.log(data)
    });

    sock.on('disconnect', () => {
        console.log(`ID: ${sock.id} socket out`)
    });
});

app.get('/start', function (req, res) {
    res.render('index', { port: appPort })
});

var appPort = process.env.HOST_PORT ? process.env.HOST_PORT : 3000;

if (process.env.HTTPS == 1) {
    https.createServer(
        {
            key: fs.readFileSync(process.env.SSL_KEY_PATH),
            cert: fs.readFileSync(process.env.SSL_CERT_PATH)
        },
        server).listen(appPort);
    console.log("Https server running on port " + appPort);
} else {
    server.listen(appPort, () => {
        console.log("Http server running on port " + appPort);
    });
}

process.stdin.resume();

async function exitHandler(options, exitCode) {
    if (options.cleanup) {
        console.log('cleanup');
        await Sessions.getSessions().forEach(async session => {
            await Sessions.closeSession(session);
        });
    }
    if (exitCode || exitCode === 0) {
        console.log(exitCode);
    }

    if (options.exit) {
        process.exit();
    }
}

process.on('exit', exitHandler.bind(null, { cleanup: true }));
process.on('SIGINT', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
