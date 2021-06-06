const Sessions = require('../../controllers/sessions');
const get = require("async-get-file")
const path = require('path')
const fs = require('fs')
const ffmpeg = require('ffmpeg')
const { MessageMedia } = require('whatsapp-web.js');
const url = require('valid-url');
const request = require('request');

const mediadownloader = (url, path, callback) => {
    request.head(url, (err, res, body) => {
        request(url)
            .pipe(fs.createWriteStream(path))
            .on('close', callback)
    })
}

module.exports = class Mensagens {


    static async sendText(req, res) {
        let { session, number, text } = req.body
        let data = Sessions.getSession(session)

        let response = data.client.sendMessage(number, text).then(result => {
            return res.status(200).json({
                result: 200,
                type: 'text',
                id: response.id._serialized,
                phone: response.id.remote._serialized,
                content: response.body
            });
        }).catch(err => {
            res.status(500).json({
                status: 'FAIL',
                response: err
            });
        });

    }

    static async addStatusText(req, res) {
        let { session, number, text } = req.body
        let data = Sessions.getSession(session)
        let response = await data.client.sendMessage('status@broadcast', text)
        return res.status(200).json({
            result: "success"
        })
    }

    static async sendImage(req, res) {
        let { session, number, filePath, caption } = req.body
        try {
            let data = Sessions.getSession(session)
            if (!url.isWebUri(filePath)) {
                const media = MessageMedia.fromFilePath(filePath);
                data.client.sendMessage(number, media, { caption: caption || "" }).then((response) => {
                    if (response.id.fromMe) {
                        return res.status(200).json({
                            result: 200,
                            type: 'image',
                            id: response.id._serialized,
                            session: req.body.session,
                            phone: response.id.remote._serialized,
                            file: req.body.filePath,
                            content: response.body,
                            mimetype: response.type
                        })
                    }
                }).catch((error) => { res.status(500).json({ status: 'error', message: error }) })
            } else {
                if (!fs.existsSync('./files-received')) {
                    await fs.mkdirSync('./files-received');
                }
                var path = './files-received/' + filePath.split("/").slice(-1)[0]
                mediadownloader(filePath, path, () => {
                    let media = MessageMedia.fromFilePath(path);
                    data.client.sendMessage(number, media, { caption: caption || "" }).then((response) => {
                        fs.unlinkSync(path)
                        if (response.id.fromMe) {
                            return res.status(200).json({
                                result: 200,
                                type: 'image',
                                id: response.id._serialized,
                                session: req.body.session,
                                phone: response.id.remote._serialized,
                                file: req.body.filePath,
                                content: response.body,
                                mimetype: response.type
                            })
                        }
                    });
                })
            }
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }

    static async sendVideo(req, res) {
        let { session, number, filePath, caption } = req.body
        try {
            let data = Sessions.getSession(session)
            if (!url.isWebUri(filePath)) {
                const media = MessageMedia.fromFilePath(filePath);
                data.client.sendMessage(number, media, { caption: caption || "" }).then((response) => {
                    if (response.id.fromMe) {
                        return res.status(200).json({
                            result: 200,
                            type: 'video',
                            id: response.id._serialized,
                            session: req.body.session,
                            phone: response.id.remote._serialized,
                            file: req.body.filePath,
                            content: response.body,
                            mimetype: response.type
                        })
                    }
                }).catch((error) => { res.status(500).json({ status: 'error', message: error }) })
            } else {
                if (!fs.existsSync('./files-received')) {
                    await fs.mkdirSync('./files-received');
                }
                var path = './files-received/' + filePath.split("/").slice(-1)[0]
                mediadownloader(filePath, path, () => {
                    let media = MessageMedia.fromFilePath(path);
                    data.client.sendMessage(number, media, { caption: caption || "" }).then((response) => {
                        fs.unlinkSync(path)
                        if (response.id.fromMe) {
                            return res.status(200).json({
                                result: 200,
                                type: 'video',
                                id: response.id._serialized,
                                session: req.body.session,
                                phone: response.id.remote._serialized,
                                file: req.body.filePath,
                                content: response.body,
                                mimetype: response.type
                            })
                        }
                    });
                })
            }
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }

    static async sendSticker(req, res) {
        let { session, number, filePath } = req.body
        try {
            let data = Sessions.getSession(session)
            if (!url.isWebUri(filePath)) {
                const media = MessageMedia.fromFilePath(filePath);
                data.client.sendMessage(number, media, { sendMediaAsSticker: true }).then((response) => {
                    if (response.id.fromMe) {
                        return res.status(200).json({
                            result: 200,
                            type: 'sticker',
                            id: response.id._serialized,
                            session: req.body.session,
                            phone: response.id.remote._serialized,
                            file: req.body.filePath,
                            content: response.body,
                            mimetype: response.type
                        })
                    }
                }).catch((error) => { res.status(500).json({ status: 'error', message: error }) })
            } else {
                if (!fs.existsSync('./files-received')) {
                    await fs.mkdirSync('./files-received');
                }
                var path = './files-received/' + filePath.split("/").slice(-1)[0]
                mediadownloader(filePath, path, () => {
                    let media = MessageMedia.fromFilePath(path);
                    data.client.sendMessage(number, media, { sendMediaAsSticker: true }).then((response) => {
                        fs.unlinkSync(path)
                        if (response.id.fromMe) {
                            return res.status(200).json({
                                result: 200,
                                type: 'sticker',
                                id: response.id._serialized,
                                session: req.body.session,
                                phone: response.id.remote._serialized,
                                file: req.body.filePath,
                                content: response.body,
                                mimetype: response.type
                            })
                        }
                    });
                })
            }
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }

    static async sendFile(req, res) {
        let { session, number, filePath, caption } = req.body
        try {
            let data = Sessions.getSession(session)
            if (!url.isWebUri(filePath)) {
                const media = MessageMedia.fromFilePath(filePath);
                data.client.sendMessage(number, media, { caption: caption || "" }).then((response) => {
                    if (response.id.fromMe) {
                        return res.status(200).json({
                            result: 200,
                            type: 'file',
                            id: response.id._serialized,
                            session: req.body.session,
                            phone: response.id.remote._serialized,
                            file: req.body.filePath,
                            content: response.body,
                            mimetype: response.type
                        })
                    }
                }).catch((error) => { res.status(500).json({ status: 'error', message: error }) })
            } else {
                if (!fs.existsSync('./files-received')) {
                    await fs.mkdirSync('./files-received');
                }
                var path = './files-received/' + filePath.split("/").slice(-1)[0]
                mediadownloader(filePath, path, () => {
                    let media = MessageMedia.fromFilePath(path);
                    data.client.sendMessage(number, media, { caption: caption || "" }).then((response) => {
                        fs.unlinkSync(path)
                        if (response.id.fromMe) {
                            return res.status(200).json({
                                result: 200,
                                type: 'file',
                                id: response.id._serialized,
                                session: req.body.session,
                                phone: response.id.remote._serialized,
                                file: req.body.filePath,
                                content: response.body,
                                mimetype: response.type
                            })
                        }
                    });
                })
            }
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }


    static async sendFile64(req, res) {
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number;
        let valid = number.indexOf('-') > -1 ? number + '@g.us' : await Sessions.validNumber(req, res)
        if (valid) {
            try {
                let base64 = ''
                let response = await data.client.sendFile(valid, base64, 'File', 'oi')
                return res.status(200).json({
                    result: 200,
                    type: 'file',
                    id: response.to._serialized,
                    session: req.body.session,
                    phone: response.to.remote.user,
                    file: name,
                    content: response.text,
                    mimetype: response.mimeType
                })
                // fs.unlink(path.basename("/files-received")+"/"+name, erro => console.log(""))
            } catch (error) {
                return res.status(400).json({
                    result: 400,
                    "status": "FAIL",
                    "log": error
                })
            }

        } else {
            return res.status(400).json({
                result: 400,
                "status": "FAIL",
                "reason": "check parameters"
            })
        }
    }

    static async sendAudio(req, res) {
        let { session, number, filePath, caption } = req.body
        try {
            let data = Sessions.getSession(session)
            if (!url.isWebUri(filePath)) {
                const media = MessageMedia.fromFilePath(filePath);
                data.client.sendMessage(number, media, { sendAudioAsVoice: true }).then((response) => {
                    if (response.id.fromMe) {
                        return res.status(200).json({
                            result: 200,
                            type: 'audio',
                            id: response.id._serialized,
                            session: req.body.session,
                            phone: response.id.remote._serialized,
                            file: req.body.filePath,
                            content: response.body,
                            mimetype: response.type
                        })
                    }
                }).catch((error) => { res.status(500).json({ status: 'error', message: error }) })
            } else {
                if (!fs.existsSync('./files-received')) {
                    await fs.mkdirSync('./files-received');
                }
                var path = './files-received/' + filePath.split("/").slice(-1)[0]
                mediadownloader(filePath, path, () => {
                    let media = MessageMedia.fromFilePath(path);
                    data.client.sendMessage(number, media, { sendAudioAsVoice: true }).then((response) => {
                        fs.unlinkSync(path)
                        if (response.id.fromMe) {
                            return res.status(200).json({
                                result: 200,
                                type: 'audio',
                                id: response.id._serialized,
                                session: req.body.session,
                                phone: response.id.remote._serialized,
                                file: req.body.filePath,
                                content: response.body,
                                mimetype: response.type
                            })
                        }
                    });
                })
            }
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }

    //parei aqui

    static async sendVoice(req, res) {
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number;
        let valid = number.indexOf('-') > -1 ? number + '@g.us' : await Sessions.validNumber(req, res)
        if (valid) {
            try {
                let file = req.body.url.split(/[\/\\]/).pop();
                let name = file.split('.')[0];
                let dir = 'files-received/'
                await get(req.body.url, {
                    directory: 'files-received'
                });
                try {
                    var process = new ffmpeg(dir + file)
                    let audio = await process
                    let mp3 = await audio.setAudioCodec('opus')
                        .fnExtractSoundToMP3(dir + name + '.mp3')

                    let response = await data.client.sendVoice(valid, mp3)

                    return res.status(200).json({
                        result: 200,
                        type: 'ptt',
                        id: response.to._serialized,
                        session: req.body.session,
                        phone: response.to.remote.user,
                        file: mp3,
                        content: response.text,
                        mimetype: response.mimeType
                    })

                } catch (e) {
                    return res.status(400).json({
                        result: 400,
                        "status": "FAIL",
                        "log": e
                    })
                }
                // fs.unlink(path.basename("/files-received")+"/"+name, erro => console.log(""))

            } catch (error) {
                return res.status(400).json({
                    result: 400,
                    "status": "FAIL",
                    "log": error
                })
            }

        } else {
            return res.status(400).json({
                result: 400,
                "status": "FAIL",
                "reason": "check parameters"
            })
        }
    }

    static async sendVoiceBase64(req, res) {
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number;
        let base64 = req.body.base64;
        let valid = number.indexOf('-') > -1 ? number + '@g.us' : await Sessions.validNumber(req, res)
        if (valid) {
            try {
                let response = await data.client.sendPttFromBase64(valid, base64, 'none')
                return res.status(200).json({
                    result: 200,
                    type: 'audio',
                    id: response.to._serialized,
                    session: req.body.session,
                    phone: response.to.remote.user,
                    file: name,
                    content: response.text,
                    mimetype: response.mimeType
                })
                // fs.unlink(path.basename("/files-received")+"/"+name, erro => console.log(""))
            } catch (error) {
                return res.status(400).json({
                    result: 400,
                    "status": "FAIL",
                    "log": error
                })
            }
        } else {
            return res.status(400).json({
                result: 400,
                "status": "FAIL",
                "reason": "check parameters"
            })
        }
    }

    static async sendLink(req, res) {
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number;
        let valid = number.indexOf('-') > -1 ? number + '@g.us' : await Sessions.validNumber(req, res)
        if (valid) {
            try {
                let response = await data.client.sendLinkPreview(valid, req.body.url, req.body.text)

                return res.status(200).json({
                    result: 200,
                    type: 'link',
                    id: response.to._serialized,
                    session: req.body.session,
                    phone: response.to.remote.user,
                    content: response.text
                })
            } catch (error) {
                return res.status(400).json({
                    result: 400,
                    "status": "FAIL",
                    "log": error
                })
            }

        } else {
            return res.status(400).json({
                result: 400,
                "status": "FAIL",
                "reason": "check parameters"
            })
        }
    }
    static async sendContact(req, res) {
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number;
        let valid = number.indexOf('-') > -1 ? number + '@g.us' : await Sessions.validNumber(req, res)
        if (valid) {
            try {
                let response = await data.client.sendContactVcard(valid, req.body.contact + '@c.us', req.body.name)
                return res.status(200).json({
                    result: 200,
                    type: 'contact',
                    id: response.to._serialized,
                    session: req.body.session,
                    phone: response.to.remote.user,
                    content: response.text
                })
            } catch (error) {
                return res.status(400).json({
                    result: 400,
                    "status": "FAIL",
                    "log": error
                })
            }

        } else {
            return res.status(400).json({
                result: 400,
                "status": "FAIL",
                "reason": "check parameters"
            })
        }
    }

    static async sendLocation(req, res) {
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number;
        let valid = number.indexOf('-') > -1 ? number + '@g.us' : await Sessions.validNumber(req, res)
        if (valid) {
            try {
                let response = await data.client.sendLocation(valid, req.body.lat, req.body.log, `${req.body.title}\n${req.body.description}`)
                return res.status(200).json({
                    result: 200,
                    type: 'locate',
                    id: response.to._serialized,
                    session: req.body.session,
                    phone: response.to.remote.user,
                    content: response.text
                })
            } catch (error) {
                return res.status(400).json({
                    result: 400,
                    "status": "FAIL",
                    "log": error
                })
            }

        } else {
            return res.status(400).json({
                result: 400,
                "status": "FAIL",
                "reason": "check parameters"
            })
        }
    }

}

