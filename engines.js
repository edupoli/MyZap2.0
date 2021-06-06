var engines = {
    1: {
        descricao: "Engine Whatsapp-Web-JS",
        motor: require("./engines/WhatsappWebJS"),
        router: require("./routers/WhatsappWebJS"),
    },
    2: {
        descricao: "Engine WPPConnect",
        motor: require("./engines/WppConnect"),
        router: require("./routers/WppConnect"),
    },
    3: {
        descricao: "Engine Venom",
        motor: require("./engines/Venom"),
        router: require("./routers/Venom"),
    },
};

exports.engines = engines;