var config = require("./config.json");

var cleverbot = require("cleverbot.io");
homebot = new cleverbot(config.CLEVERBOT_USER, config.CLEVERBOT_KEY);
homebot.setNick("homebot");
homebot.create(function(err, session){
});

var mqtt = require("mqtt");
var client = mqtt.connect("mqtt://iot.eclipse.org");

HOME_DEVICE = "/" + config.MQTT_HOME + "/" + config.MQTT_DEVICE + "/";

client.on("connect", function() {
    client.subscribe(HOME_DEVICE + "2");
    client.subscribe(HOME_DEVICE + "3");
    client.subscribe(HOME_DEVICE + "4");
    client.subscribe(HOME_DEVICE + "5");
});

client.on("message", function(topic, message) {
    console.log(topic);
    console.log(message.toString());

    switch (topic) {
        case HOME_DEVICE + "2":
            snsbot.sendMessage({
                chat_id: config.TELEGRAM_USER,
                text: "Your air conditioner was turned " + message.toString() + ".",
            }, function(err, msg) {
                console.log(err);
                console.log(msg);
            });
            break;
        case HOME_DEVICE + "3":
            snsbot.sendMessage({
                chat_id: config.TELEGRAM_USER,
                text: "Current temperature is " + message.toString() + " degrees.",
            }, function(err, msg) {
                console.log(err);
                console.log(msg);
            });
            break;
        case HOME_DEVICE + "4":
            snsbot.sendMessage({
                chat_id: config.TELEGRAM_USER,
                text: "Preferred temperature was set to " + message.toString() + " degrees.",
            }, function(err, msg) {
                console.log(err);
                console.log(msg);
            });
            break;
        case HOME_DEVICE + "5":
            snsbot.sendMessage({
                chat_id: config.TELEGRAM_USER,
                text: message.toString(),
            }, function(err, msg) {
                console.log(err);
                console.log(msg);
            });
            break;
        default:

    }
});

var telegram = require("node-telegram-bot");
var snsbot = new telegram({
    token: config.TELEGRAM_TOKEN
});
snsbot.start();

snsbot.on("message", function(message) {
    console.log(message);

    var n;
    if ((n = message.text.search(/turn on/i)) > -1) {
        client.publish(HOME_DEVICE + "2/R", "on");
    }
    else if ((n = message.text.search(/turn off/i)) > -1) {
        client.publish(HOME_DEVICE + "2/R", "off");
    }
    else if ((n = message.text.search(/set preferred/i)) > -1) {
        client.publish(HOME_DEVICE + "4/R", message.text.slice(n + 14));
    }
	else if ((n = message.text.search(/ok/i)) > -1) {
        client.publish(HOME_DEVICE + "5/R", "on");
    }
    else {
		homebot.ask(message.text, function(err, response){
            snsbot.sendMessage({
                chat_id: config.TELEGRAM_USER,
                text: response.toString(),
            }, function(err, msg) {
                console.log(err);
                console.log(msg);
            });
		});
    }
});

