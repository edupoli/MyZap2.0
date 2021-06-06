const express = require('express');
const Router = express.Router();
const engine = require('../engines/WhatsappWebJS');
const Sessions = require('../controllers/sessions');
const Mensagens = require('../functions/WhatsappWebJS/mensagens');

Router.post('/start', async (req, res) => {

    let session = req.body.session
    let existSession = Sessions.checkSession(session)
    if (!existSession) {
        Sessions.checkAddUser(session)
        Sessions.addInfoSession(session, {
            webhook: req.body.webhook,
            wa_browser_id: req.headers['wa_browser_id'] ? req.headers['wa_browser_id'] : '',
            wa_secret_bundle: req.headers['wa_secret_bundle'] ? req.headers['wa_secret_bundle'] : '',
            wa_token_1: req.headers['wa_token_1'] ? req.headers['wa_token_1'] : '',
            wa_token_2: req.headers['wa_token_2'] ? req.headers['wa_token_2'] : '',
        })
        engine.start(session).then(response => {
            Sessions.addInfoSession(session, {
                client: response,
            })
            res.status(200).json({
                "result": 200,
                "status": "CONNECTING"
            })
        })
    }
    else {
        res.status(400).json({
            result: 400,
            "status": "FAIL",
            "reason": "there is already a session with that name"
        })
    }
})

// Mensagens
Router.post('/sendText', Mensagens.sendText);
Router.post('/sendImage', Mensagens.sendImage);
Router.post('/sendVideo', Mensagens.sendVideo);
Router.post('/sendSticker', Mensagens.sendSticker);
Router.post('/sendFile', Mensagens.sendFile);
// Router.post('/sendFile64', Mensagens.sendFile64);
Router.post('/sendAudio', Mensagens.sendAudio);
// Router.post('/sendVoiceBase64', Mensagens.sendVoiceBase64);
// Router.post('/sendLink', Mensagens.sendLink);
// Router.post('/sendContact', Mensagens.sendContact);
// Router.post('/sendLocation', Mensagens.sendLocation);
// // Grupos
// Router.post('/getAllGroups', Groups.getAllGroups);
// Router.post('/joinGroup', Groups.joinGroup);
// Router.post('/createGroup', Groups.createGroup);
// Router.post('/leaveGroup', Groups.leaveGroup);
// Router.post('/getGroupMembers', Groups.getGroupMembers);
// Router.post('/addParticipant', Groups.addParticipant);
// Router.post('/removeParticipant', Groups.removeParticipant);
// Router.post('/promoteParticipant', Groups.promoteParticipant);
// Router.post('/demoteParticipant', Groups.demoteParticipant);
// Router.post('/getGroupAdmins', Groups.getGroupAdmins);
// Router.post('/getGroupInviteLink', Groups.getGroupInviteLink);
// Router.post('/setGroupPic', Groups.setGroupPic);
// // Status
// Router.post('/addStatusText', Status.addStatusText);
// Router.post('/addStatusImage', Status.addStatusImage);
// Router.post('/addStatusVideo', Status.addStatusVideo);
// // Dispositivo, chats entre outras
// Router.post('/getBatteryLevel', Commands.getBatteryLevel);
// Router.post('/getConnectionState', Commands.getConnectionState);
// Router.post('/getHostDevice', Commands.getHostDevice);
// Router.post('/getAllContacts', Commands.getAllContacts);
// Router.post('/getBlockList', Commands.getBlockList);
// Router.post('/getMessagesChat', Commands.getMessagesChat);
// Router.post('/getProfilePic', Commands.getProfilePic);
// Router.post('/verifyNumber', Commands.verifyNumber);
// Router.post('/deleteChat', Commands.deleteChat);
// Router.post('/clearChat', Commands.clearChat);
// Router.post('/archiveChat', Commands.archiveChat);
// Router.post('/deleteMessage', Commands.deleteMessage);
// Router.post('/reply', Commands.reply);
// Router.post('/forwardMessages', Commands.forwardMessages);
// Router.post('/markUnseenMessage', Commands.markUnseenMessage);
// Router.post('/blockContact', Commands.blockContact);
// Router.post('/unblockContact', Commands.unblockContact);
// Router.post('/getNumberProfile', Commands.getNumberProfile);

module.exports = Router;