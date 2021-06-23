/*##############################################################################
# File: model.js                                                               #
# Project: MyZap2.0                                                            #
# Created Date: 2021-06-21 18:29:14                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2021-06-21 18:40:14                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

class Sessions {
    constructor(id, name, apitoken, sessionkey, wh_status,
        wh_message, wh_qrcode, wh_connect, wa_browser_id, wa_secret_bundle, wa_token_1, wa_token_2) {
        this.id = id;
        this.name = name;
        this.apitoken = apitoken;
        this.sessionkey = sessionkey;
        this.wh_status = wh_status;
        this.wh_message = wh_message;
        this.wh_qrcode = wh_qrcode;
        this.wh_connect = wh_connect;
        this.wa_browser_id = wa_browser_id;
        this.wa_secret_bundle = wa_secret_bundle;
        this.wa_token_1 = wa_token_1;
        this.wa_token_2 = wa_token_2;
    }
}

module.exports = Sessions;