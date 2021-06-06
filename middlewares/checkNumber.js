const Sessions = require('../controllers/sessions')

const checkNumber = async (req, res, next) => {
    const c = '@c.us'
    let number = req.body.number
    let session = req.body.session
    let data = Sessions.getSession(session)
    let profile = await data.client.checkNumberStatus(req.body.number + c)

    if (!number) {
        return res.status(401).send({ message: "Telefone não informado." });
    }
    else
        if (!profile.numberExists) {
            return res.status(400).json({
                response: false,
                status: "error",
                message: 'O telefone informado nao esta registrado no whatsapp.'
            })
        } else {
            next();
        }

}

exports.checkNumber = checkNumber