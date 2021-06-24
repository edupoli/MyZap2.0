/*##############################################################################
# File: events copy.js                                                         #
# Project: myzap2.0                                                            #
# Created Date: 2021-06-24 12:01:19                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2021-06-24 16:06:54                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

const fs = require('fs');
const mime = require('mime-types');
const MD5 = require("crypto-js/md5");
const webhooks = require('./webhooks');
var dir = 'files-received/'
module.exports = class Events {

    static async receiveMessage(session, client) {
        client.on('message_create', async (message) => {
            let type = message.type
            if (type == 'chat' && message.subtype == 'url') {
                type = 'link'
            } else if (type == 'chat' && !message.subtype) {
                type = 'text'
            }

            let response = []
            if (message.hasMedia === true || message.type == 'document' || message.type == 'ptt' || message.type == 'sticker') {
                var buffer = await message.downloadMedia();
                var fileName = `${dir + MD5(message.id)}.${mime.extension(buffer.mimetype)}`;
                console.log(fileName)
            }
            switch (type) {

                case 'text':
                    response = {
                        "wook": 'RECEIVE_MESSAGE',
                        "type": 'text',
                        "id": message.id._serialized,
                        "session": session,
                        "isGroupMsg": message.isGroupMsg,
                        "author": message.author ? message.author : null,
                        "sender": message.to.split('@')[0],
                        "phone": message.from.split('@')[0],
                        "content": message.body,
                        "status": "RECEIVED",
                        "timestamp": message.timestamp,
                    }

                    break;

                case 'image':
                    //fs.writeFile(caminho, base64Image, { encoding: 'base64' }, function (err) { console.log('Uma imagem .jpeg foi criada com sucesso no diretório.'); }
                    fs.writeFileSync(fileName, buffer.data, { encoding: 'base64' }, (err) => {
                        console.log('arquivo baixado!')
                    });
                    response = {
                        "wook": 'RECEIVE_MESSAGE',
                        "type": 'image',
                        "id": message.id._serialized,
                        "session": session,
                        "isGroupMsg": message.isGroupMsg,
                        "author": message.author ? message.author : null,
                        "sender": message.to.split('@')[0],
                        "phone": message.from.split('@')[0],
                        "content": message.body,
                        "caption": message.caption != undefined ? message.caption : "",
                        "file": fileName.split('/')[1],
                        "status": "RECEIVED",
                        "timestamp": message.timestamp,
                    }

                    break;
                case 'sticker':
                    fs.writeFileSync(fileName, buffer.data, { encoding: 'base64' }, (err) => {
                        console.log('arquivo baixado!')
                    });
                    response = {
                        "wook": 'RECEIVE_MESSAGE',
                        "type": 'sticker',
                        "id": message.id._serialized,
                        "session": session,
                        "isGroupMsg": message.isGroupMsg,
                        "author": message.author ? message.author : null,
                        "sender": message.to.split('@')[0],
                        "phone": message.from.split('@')[0],
                        "content": message.body,
                        "caption": message.caption != undefined ? message.caption : "",
                        "file": fileName.split('/')[1],
                        "status": "RECEIVED",
                        "timestamp": message.timestamp,
                    }

                    break;

                case 'audio':
                    fs.writeFileSync(fileName, buffer.data, { encoding: 'base64' }, (err) => {
                        console.log('arquivo baixado!')
                    });
                    response = {
                        "wook": 'RECEIVE_MESSAGE',
                        "type": 'audio',
                        "id": message.id._serialized,
                        "session": session,
                        "isGroupMsg": message.isGroupMsg,
                        "author": message.author ? message.author : null,
                        "sender": message.to.split('@')[0],
                        "phone": message.from.split('@')[0],
                        "mimetype": message.mimetype,
                        "file": fileName.split('/')[1],
                        "status": "RECEIVED",
                        "timestamp": message.timestamp,
                    }
                    break;

                case 'ptt':
                    fs.writeFileSync(fileName, buffer.data, { encoding: 'base64' }, (err) => {
                        console.log('arquivo baixado!')
                    });
                    response = {
                        "wook": 'RECEIVE_MESSAGE',
                        "type": 'ptt',
                        "id": message.id._serialized,
                        "session": session,
                        "isGroupMsg": message.isGroupMsg,
                        "author": message.author ? message.author : null,
                        "sender": message.to.split('@')[0],
                        "phone": message.from.split('@')[0],
                        "mimetype": message.mimetype,
                        "file": fileName.split('/')[1],
                        "status": "RECEIVED",
                        "timestamp": message.timestamp,
                    }
                    break;

                case 'video':
                    fs.writeFileSync(fileName, buffer.data, { encoding: 'base64' }, (err) => {
                        console.log('arquivo baixado!')
                    });
                    response = {
                        "wook": 'RECEIVE_MESSAGE',
                        "type": 'video',
                        "id": message.id._serialized,
                        "session": session,
                        "isGroupMsg": message.isGroupMsg,
                        "author": message.author ? message.author : null,
                        "sender": message.to.split('@')[0],
                        "phone": message.from.split('@')[0],
                        "content": message.body,
                        "caption": message.caption != undefined ? message.caption : "",
                        "file": fileName.split('/')[1],
                        "status": "RECEIVED",
                        "timestamp": message.timestamp,
                    }

                    break;

                case 'location':
                    response = {
                        "wook": 'RECEIVE_MESSAGE',
                        "type": 'location',
                        "id": message.id._serialized,
                        "session": session,
                        "isGroupMsg": message.isGroupMsg,
                        "author": message.author ? message.author : null,
                        "sender": message.to.split('@')[0],
                        "phone": message.from.split('@')[0],
                        "content": message.body,
                        "loc": message.loc,
                        "lat": message.lat,
                        "lng": message.lng,
                        "status": "RECEIVED",
                        "timestamp": message.timestamp,
                    }

                    break;

                case 'document':
                    fs.writeFileSync(fileName, buffer.data, { encoding: 'base64' }, (err) => {
                        console.log('arquivo baixado!')
                    });
                    response = {
                        "wook": 'RECEIVE_MESSAGE',
                        "type": 'document',
                        "id": message.id._serialized,
                        "session": session,
                        "isGroupMsg": message.isGroupMsg,
                        "author": message.author ? message.author : null,
                        "sender": message.to.split('@')[0],
                        "phone": message.from.split('@')[0],
                        "mimetype": message.mimetype,
                        "caption": message.caption != undefined ? message.caption : "",
                        "file": fileName.split('/')[1],
                        "status": "RECEIVED",
                        "timestamp": message.timestamp,
                    }

                    break;

                case 'link':
                    response = {
                        "wook": 'RECEIVE_MESSAGE',
                        "type": 'link',
                        "id": message.id._serialized,
                        "session": session,
                        "isGroupMsg": message.isGroupMsg,
                        "author": message.author ? message.author : null,
                        "sender": message.to.split('@')[0],
                        "phone": message.from.split('@')[0],
                        "thumbnail": message.thumbnail,
                        "title": message.title,
                        "description": message.description,
                        "url": message.body,
                        "status": "RECEIVED",
                        "timestamp": message.timestamp,
                    }
                    break;

                case 'vcard':
                    response = {
                        "wook": 'RECEIVE_MESSAGE',
                        "type": 'vcard',
                        "id": message.id._serialized,
                        "session": session,
                        "isGroupMsg": message.isGroupMsg,
                        "author": message.author ? message.author : null,
                        "sender": message.to.split('@')[0],
                        "phone": message.from.split('@')[0],
                        "contactName": message.vcardFormattedName,
                        "contactVcard": message.body,
                        "status": "RECEIVED",
                        "timestamp": message.timestamp,
                    }

                    break;

                case 'order':
                    response = {
                        "wook": 'RECEIVE_MESSAGE',
                        "type": 'order',
                        "id": message.id._serialized,
                        "session": session,
                        "isGroupMsg": message.isGroupMsg,
                        "author": message.author ? message.author : null,
                        "sender": message.to.split('@')[0],
                        "phone": message.from.split('@')[0],
                        "content": '',
                        "status": "RECEIVED",
                        "timestamp": message.timestamp,
                    }

                    break;
            }


            await webhooks.wh_messages(session, response)

        });
    }

    static statusMessage(session, client) {
        client.on('message_ack', async (message, ack) => {
            let type = ack.type
            if (type == 'chat' && ack.subtype == 'url') {
                type = 'link'
            } else if (type == 'chat' && !ack.subtype) {
                type = 'text'
            }
            let status
            switch (ack.ack) {
                case 0:
                    status = 'CLOCK'

                    break;

                case -3:
                    status = 'CONTENT_GONE'

                    break;
                case -4:
                    status = 'CONTENT_TOO_BIG'

                    break;

                case -5:

                    status = 'CONTENT_UNUPLOADABLE'

                    break;

                case -2:

                    status = 'EXPIRED'

                    break;
                case -1:

                    status = 'FAILED'

                    break;
                case -6:

                    status = 'INACTIVE'

                    break;
                case -7:

                    status = 'MD_DOWNGRADE'

                    break;
                case 4:

                    status = 'PLAYED'

                    break;
                case 3:

                    status = 'READ'

                    break;
                case 2:

                    status = 'RECEIVED'

                    break;
                case 1:

                    status = 'SENT'

                    break;
            }

            let timestamp = Math.round(new Date().getTime() / 1000)
            let response = {
                "wook": 'MESSAGE_STATUS',
                "status": status,
                "id": ack.id._serialized,
                "session": session,
                "phone": ack.id.remote.split("@")[0],
                "content": ack.body,
                "timestamp": timestamp,
                "type": type
            }

            await webhooks.wh_status(session, response)
        });
    }


    static statusConnection(session, client) {

        client.onStateChange((state) => {
            console.log('State changed: ', state);
            // force whatsapp take over
            if ('CONFLICT'.includes(state)) client.useHere();
            // detect disconnect on whatsapp
            if ('UNPAIRED'.includes(state)) webhooks.wh_connect(session, 'disconnectedMobile');

        });

    }

}