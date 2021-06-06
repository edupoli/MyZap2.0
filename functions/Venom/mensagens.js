const Sessions = require('../../controllers/sessions');
const get = require("async-get-file")
const path = require('path')
const fs = require('fs')
const util = require('util');
const urlExists = util.promisify(require('url-exists'));

module.exports = class Mensagens {

    static async sendText(req, res) {
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number + '@c.us';
        if (!req.body.text) {
            return res.status(400).json({
                status: 400,
                error: "Text não foi informado"
            })
        }
        else {
            try {
                let response = await data.client.sendText(number, req.body.text)
                return res.status(200).json({
                    result: 200,
                    type: 'text',
                    id: response.to._serialized,
                    phone: response.to.user,
                    content: response.content
                })
            } catch (error) {
                return res.status(500).json({
                    result: 500,
                    error: error
                })
            }
        }
    }

    static async sendImage(req, res) {
        try {
            const { caption, path } = req.body;
            let data = Sessions.getSession(req.body.session)
            let number = req.body.number + '@c.us';
            if (!path) {
                return res.status(400).send({
                    status: 400,
                    error: "Path não informado",
                    message: "Informe o caminho da imagem. Exemplo: C:\\folder\\image.jpg caso a imagem esteja local ou uma URL caso a imagem a ser enviada esteja na internet"
                });
            }

            let response = await data.client.sendImage(number, path, 'imagem', caption)
            return res.status(200).json({
                result: 200,
                type: 'image',
                id: response.to._serialized,
                session: req.body.session,
                phone: response.to.user,
                file: req.body.url,
                mimetype: response.mimeType,

            })
        } catch (error) {
            return res.status(500).json({
                result: 500,
                error: error
            })
        }
    }

    static async sendVideo(req, res) {
        if (!req.body.path) {
            return res.status(400).send({
                status: 400,
                error: "Path não informado",
                message: "Informe o path. Exemplo: C:\\folder\\video.mp4 para arquivo local ou URL caso o arquivo a ser enviado esteja na internet"
            });
        }
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number + '@c.us';
        let isURL = await urlExists(req.body.path);
        let name = req.body.path.split(/[\/\\]/).pop();
        try {
            if (isURL) {
                let dir = 'files-received/'
                await get(req.body.path, {
                    directory: 'files-received'
                });
                let response = await data.client.sendFile(number, dir + name, 'Video', req.body.caption)
                fs.unlink(path.basename("/files-received") + "/" + name, erro => console.log(""))
                return res.status(200).json({
                    result: 200,
                    type: 'video',
                    session: req.body.session,
                    id: response.to._serialized,
                    phone: response.to.user,
                    file: name,
                    content: response.content,
                    mimetype: response.mimeType
                })
            }
            if (!isURL) {

                let response = await data.client.sendFile(number, req.body.path, 'Video', req.body.caption)

                return res.status(200).json({
                    result: 200,
                    type: 'video',
                    session: req.body.session,
                    id: response.to._serialized,
                    phone: response.to.user,
                    file: name,
                    content: response.content,
                    mimetype: response.mimeType
                })
            }

        } catch (error) {
            return res.status(500).json({
                result: 500,
                error: error
            })
        }
    }

    static async sendSticker(req, res) {
        if (!req.body.path) {
            return res.status(400).send({
                status: 400,
                error: "Path não informado",
                message: "Informe o path. Exemplo: C:\\folder\\imagem.jpg para arquivo local ou URL caso o arquivo a ser enviado esteja na internet"
            });
        }
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number + '@c.us';
        let isURL = await urlExists(req.body.path);
        let name = req.body.path.split(/[\/\\]/).pop();
        try {
            if (isURL) {
                await get(req.body.path, {
                    directory: 'files-received'
                });
                let response = await data.client.sendImageAsSticker(number, `./files-received/${name}`)
                fs.unlink(path.basename("/files-received") + "/" + name, erro => console.log(""))
                return res.status(200).json({
                    result: 200,
                    type: 'sticker',
                    id: response.to._serialized,
                    session: req.body.session,
                    phone: response.to.user,
                    file: name,
                    content: response.content,
                    mimetype: response.mimeType
                })
            }
            if (!isURL) {
                let response = await data.client.sendImageAsSticker(number, req.body.path)
                return res.status(200).json({
                    result: 200,
                    type: 'sticker',
                    id: response.to._serialized,
                    session: req.body.session,
                    phone: response.to.user,
                    file: name,
                    content: response.content,
                    mimetype: response.mimeType
                })
            }
        } catch (error) {
            return res.status(500).json({
                result: 500,
                error: error
            })
        }

    }

    static async sendFile(req, res) {
        if (!req.body.path) {
            return res.status(400).send({
                status: 400,
                error: "Path não informado",
                message: "Informe o path. Exemplo: C:\\folder\\arquivo.xlsx para arquivo local ou URL caso o arquivo a ser enviado esteja na internet"
            });
        }
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number + '@c.us';
        let isURL = await urlExists(req.body.path);
        let name = req.body.path.split(/[\/\\]/).pop();

        try {
            if (isURL) {
                let dir = 'files-received/'
                await get(req.body.path, {
                    directory: 'files-received'
                });
                let response = await data.client.sendFile(number, dir + name, 'File', req.body.caption)
                fs.unlink(path.basename("/files-received") + "/" + name, erro => console.log(""))
                return res.status(200).json({
                    result: 200,
                    type: 'file',
                    id: response.to._serialized,
                    session: req.body.session,
                    phone: response.to.user,
                    file: name,
                    content: response.content,
                    mimetype: response.mimeType
                })
            }
            if (!isURL) {
                let response = await data.client.sendFile(number, req.body.path, 'File', req.body.caption)
                return res.status(200).json({
                    result: 200,
                    type: 'file',
                    id: response.to._serialized,
                    session: req.body.session,
                    phone: response.to.user,
                    file: name,
                    content: response.content,
                    mimetype: response.mimeType
                })
            }
        } catch (error) {
            return res.status(400).json({
                result: 400,
                "status": "FAIL",
                "log": error
            })
        }
    }
    static async sendFile64(req, res) {
        if (!req.body.path) {
            return res.status(400).send({
                status: 400,
                error: "Path não informado",
                message: "Informe o path em formato Base64"
            });
        }
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number + '@c.us';
        let name = req.body.path.split(/[\/\\]/).pop();
        try {
            let response = await data.client.sendFileFromBase64(number, req.body.path, 'File', req.body.caption)
            return res.status(200).json({
                result: 200,
                type: 'file',
                id: response.to._serialized,
                session: req.body.session,
                phone: response.to.user,
                file: name,
                content: response.content,
                mimetype: response.mimeType
            })

        } catch (error) {
            return res.status(400).json({
                result: 400,
                "status": "FAIL",
                "log": error
            })
        }
    }

    static async sendAudio(req, res) {
        if (!req.body.path) {
            return res.status(400).send({
                status: 400,
                error: "Path não informado",
                message: "Informe o path. Exemplo: C:\\folder\\arquivo.mp3 para arquivo local ou URL caso o arquivo a ser enviado esteja na internet"
            });
        }
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number + '@c.us';
        let isURL = await urlExists(req.body.path);

        if (isURL) {
            await get(req.body.path, {
                directory: 'files-received'
            });
            let file = req.body.path.split(/[\/\\]/).pop();
            let name = file.split('.')[0];
            let dir = 'files-received/'
            let ext = file.split('.').pop();

            if (ext === 'mp3' || ext === 'ogg' || ext === 'webm') {
                try {

                    let response = await data.client.sendPtt(number, dir + file)
                    fs.unlink(path.basename("/files-received") + "/" + name, erro => console.log(""))
                    return res.status(200).json({
                        result: 200,
                        type: 'ptt',
                        id: response.to._serialized,
                        session: req.body.session,
                        phone: response.to.user,
                        file: file,
                        content: response.content,
                        mimetype: response.mimeType
                    })

                } catch (e) {
                    return res.status(400).json({
                        result: 400,
                        "status": "FAIL",
                        "log": e
                    })
                }
            }
            else {
                return res.status(400).json({
                    result: 400,
                    "status": "FAIL",
                    "log": 'Envio de áudio permitido apenas com arquivos .mp3 ou .ogg ou .webm'
                })
            }
        }
        if (!isURL) {
            let file = req.body.path.split(/[\/\\]/).pop();
            let name = file.split('.')[0];
            let ext = file.split('.').pop();
            if (ext === 'mp3' || ext === 'ogg' || ext === 'webm') {
                try {
                    let response = await data.client.sendPtt(number, req.body.path)
                    return res.status(200).json({
                        result: 200,
                        type: 'ptt',
                        id: response.to._serialized,
                        session: req.body.session,
                        phone: response.to.user,
                        file: file,
                        content: response.content,
                        mimetype: response.mimeType
                    })

                } catch (e) {
                    return res.status(400).json({
                        result: 400,
                        "status": "FAIL",
                        "log": e
                    })
                }
            }
            else {
                return res.status(400).json({
                    result: 400,
                    "status": "FAIL",
                    "log": 'Envio de áudio permitido apenas com arquivos .mp3 ou .ogg ou .webm'
                })
            }
        }
    }


    static async sendVoiceBase64(req, res) {
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number;
        let base64 = req.body.path;
        if (!req.body.path) {
            return res.status(400).send({
                status: 400,
                error: "Path não informado",
                message: "Informe o path em formato Base64"
            });
        }
        else {
            try {
                let response = await data.client.sendPttFromBase64(number, base64).then((value) => {
                    console.log(value)
                }).catch((err) => {
                    console.log(err)
                })
                return res.status(200).json({
                    result: 200,
                    type: 'audio',
                    id: response.to._serialized,
                    session: req.body.session,
                    phone: response.to.user,
                    file: 'audio',
                    content: response.content,
                    mimetype: response.mimeType
                })

            } catch (error) {
                return res.status(400).json({
                    result: 400,
                    "status": "FAIL",
                    "log": error
                })
            }
        }
    }

    static async sendLink(req, res) {
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number + '@c.us';
        if (!req.body.url) {
            return res.status(400).json({
                status: 400,
                error: "URL não foi informada, é obrigatorio"
            })
        }
        else {
            try {
                let response = await data.client.sendLinkPreview(number, req.body.url, req.body.text)

                return res.status(200).json({
                    result: 200,
                    type: 'link',
                    id: response.to._serialized,
                    session: req.body.session,
                    phone: response.to.user,
                    content: response.content
                })
            } catch (error) {
                return res.status(400).json({
                    result: 400,
                    "status": "FAIL",
                    "log": error
                })
            }
        }
    }

    static async sendContact(req, res) {
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number + '@c.us';
        if (!req.body.contact) {
            return res.status(400).json({
                status: 400,
                error: "Contact não foi informado"
            })
        }
        else if (!req.body.name) {
            return res.status(400).json({
                status: 400,
                error: "Nome do Contato não foi informado"
            })
        }
        else {
            try {
                let response = await data.client.sendContactVcard(number, req.body.contact + '@c.us', req.body.name)
                return res.status(200).json({
                    result: 200,
                    type: 'contact',
                    id: response.to._serialized,
                    session: req.body.session,
                    phone: response.to.user,
                    content: response.content
                })
            } catch (error) {
                return res.status(400).json({
                    result: 400,
                    "status": "FAIL",
                    "log": error
                })
            }
        }
    }

    static async sendLocation(req, res) {
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number + '@c.us';
        if (!req.body.lat) {
            return res.status(400).json({
                status: 400,
                error: "Latitude não foi informada"
            })
        }
        else if (!req.body.log) {
            return res.status(400).json({
                status: 400,
                error: "Longitude não foi informada"
            })
        }
        if (!req.body.title) {
            return res.status(400).json({
                status: 400,
                error: "Title do endereço não foi informado"
            })
        }
        else if (!req.body.description) {
            return res.status(400).json({
                status: 400,
                error: "Descrição do endereço não foi informado"
            })
        }
        else {
            try {
                let response = await data.client.sendLocation(number, req.body.lat, req.body.log, `${req.body.title}\n${req.body.description}`)
                return res.status(200).json({
                    result: 200,
                    type: 'locate',
                    id: response.to._serialized,
                    session: req.body.session,
                    phone: response.to.user,
                    content: response.content
                })
            } catch (error) {
                return res.status(400).json({
                    result: 400,
                    "status": "FAIL",
                    "log": error
                })
            }
        }
    }

    static async reply(req, res) {
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number + '@c.us';
        if (!req.body.text) {
            return res.status(400).json({
                status: 400,
                error: "Text não foi informado"
            })
        }
        else if (!req.body.messageid) {
            return res.status(400).json({
                status: 400,
                error: "MessageID não foi informada, é obrigatorio"
            })
        }
        else {
            try {
                let response = await data.client.reply(number, req.body.text, req.body.messageid);
                return res.status(200).json({
                    result: 200,
                    type: 'text',
                    id: response.id,
                    phone: response.chat.id.user,
                    content: response.content
                })
            } catch (error) {
                return res.status(400).json({
                    result: 400,
                    "status": "FAIL",
                    "log": error
                })
            }
        }
    }

    static async forwardMessages(req, res) {
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number + '@c.us';
        if (!req.body.text) {
            return res.status(400).json({
                status: 400,
                error: "Text não foi informado"
            })
        }
        else if (!req.body.messageid) {
            return res.status(400).json({
                status: 400,
                error: "MessageID não foi informado, é obrigatorio"
            })
        }
        else {
            try {
                let response = await data.client.forwardMessages(number, [req.body.messageid]);
                return res.status(200).json({
                    result: 200,
                    type: 'forward',
                    id: response.to._serialized,
                    session: req.body.session,
                    phone: response.to.user,
                })

            } catch (error) {
                return res.status(200).json({
                    "result": 400,
                    "status": "FAIL",
                    "error": error
                })
            }
        }
    }
}
