# Home Bot

This repository provides [chatterbot](https://en.wikipedia.org/wiki/Chatterbot) for sugar home.

## Telegram Home Bot

![Alt text](/document/image/telegram_homebot.png?raw=true "Telegram Homebot")

As shown the above, Telegram homebot communicates with Telegram messenger. User can control sugar home devices using Telegram messenger and homebot notifies sugar home changes to user using Telegram messenger.

### Creating Telegram Bot

You can create your own Telegram Bot. You have only to talk to BotFather using Telegram messenger or [https://telegram.me/botfather](https://telegram.me/botfather). It gives chat-based interface to manage Telegram Bot.

![Alt text](/document/image/creating_new_telegrambot.png?raw=true "New Telegram Bot")

When creating new Telegram Bot, you should remember TOKEN to access your bot as shown the above image. You can access your bot through HTTP-based [Bot API](https://core.telegram.org/bots/api). You can get the detail guideline in [Telegram Bot](https://core.telegram.org/bots).

### Installing Node.js and the required modules

We are developing Home Bot with [Node.js](http://nodejs.org). First, you should install Node.js (Now, we are using v4.4.3 LTS). And you should install [MQTT](https://www.npmjs.com/package/mqtt) for connecting sugar home MQTT broker and [node-telegram-bot](https://www.npmjs.com/package/node-telegram-bot) as Node.js wrapper for Telegram Bot.

```
$ npm install mqtt
mqtt@1.9.0 node_modules\mqtt
├── inherits@2.0.1
├── reinterval@1.0.2
├── xtend@4.0.1
├── minimist@1.2.0
├── readable-stream@1.0.34 (isarray@0.0.1, string_decoder@0.10.31, core-util-
is@1.0.2)
├── mqtt-packet@3.4.6 (bl@0.9.5)
├── end-of-stream@1.1.0 (once@1.3.3)
├── commist@1.0.0 (leven@1.0.2)
├── concat-stream@1.5.1 (typedarray@0.0.6, readable-stream@2.0.6)
├── help-me@0.1.0 (pump@1.0.1)
├── mqtt-connection@2.1.1 (through2@0.6.5, reduplexer@1.1.0)
└── websocket-stream@3.1.0 (ws@1.1.0, through2@2.0.1, duplexify@3.4.3)

$ npm install node-telegram-bot
node-telegram-bot@0.1.9 node_modules\node-telegram-bot
├── botanio-node@1.0.2
├── q@1.4.1
├── mime@1.3.4
├── debug@2.2.0 (ms@0.7.1)
└── request@2.72.0 (aws-sign2@0.6.0, forever-agent@0.6.1, tunnel-agent@0.4.2,
 caseless@0.11.0, is-typedarray@1.0.0, oauth-sign@0.8.1, stringstream@0.0.5, iss
tream@0.1.2, json-stringify-safe@5.0.1, extend@3.0.0, tough-cookie@2.2.2, node-u
uid@1.4.7, qs@6.1.0, combined-stream@1.0.5, mime-types@2.1.10, form-data@1.0.0-r
c4, aws4@1.3.2, bl@1.1.2, hawk@3.1.3, http-signature@1.1.1, har-validator@2.0.6)

```

### Connecting to MQTT broker

You can simply connect to sugar home MQTT broker - mqtt://iot.eclipse.org as below. And 3 resources are subcribed.

```
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://iot.eclipse.org');

client.on('connect', function(){
	client.subscribe(HOME_DEVICE + '2');
	client.subscribe(HOME_DEVICE + '3');
	client.subscribe(HOME_DEVICE + '4');
});
```

### Connecting to Telegram Bot

You can simply connect to your Telegram Bot as below. Here, you should specify TOKEN that you got from BotFather when you created your Bot. 

```
var telegram = require('node-telegram-bot');
var snsbot = new telegram({
        token: config.TELEGRAM_TOKEN
});
snsbot.start();
```

### Handling messages from Sugar Home

You can handle messages from MQTT broker as below. When getting the air conditioner turned on from MQTT broker, homebot sends chat message "Your air conditioner was turned on." by Telegram Bot. 

```
client.on('message', function(topic, message){
  switch(topic){
    case HOME_DEVICE + '2':
      snsbot.sendMessage({
          chat_id: config.TELEGRAM_USER,
          text: 'Your air conditioner was turned ' + message.toString() + '.',
        }, function(err, msg){
          console.log(err);
          console.log(msg);
        });
    break;
  }
});
```

### Handling messages from Telegram

You can handle messages from Telegram Bot as below. When getting "turn on" message, homebot publishes MQTT topic to request the air conditioner turned on.

```
snsbot.on( 'message', function(message){
    console.log(message);

    var n = message.text.search(/turn on/i);
    if (n>-1){
      client.publish(HOME_DEVICE + '2/R', 'on');
    }
});
```

### Connecting AI bot

[Cleverbot](cleverbot.io) provides cloud based general chatterbot. You can connect telegram to Cleverbot. At first, you should install cleverbot.io npm.

```
$ npm install --save cleverbot.io
cleverbot.io@1.0.4 node_modules\cleverbot.io
└── request@2.72.0 (forever-agent@0.6.1, aws-sign2@0.6.0, tunnel-agent@0.4.2,
 caseless@0.11.0, oauth-sign@0.8.1, is-typedarray@1.0.0, stringstream@0.0.5, iss
tream@0.1.2, json-stringify-safe@5.0.1, extend@3.0.0, tough-cookie@2.2.2, node-u
uid@1.4.7, qs@6.1.0, combined-stream@1.0.5, mime-types@2.1.10, form-data@1.0.0-r
c4, aws4@1.3.2, bl@1.1.2, hawk@3.1.3, http-signature@1.1.1, har-validator@2.0.6)
```

And you can create the clverbot as below. You should create CLEVERBOT USER and get KEY from [the cleverbot site](http://cleverbot.io/keys).
```
var cleverbot = require("cleverbot.io");
homebot = new cleverbot(config.CLEVERBOT_USER, config.CLEVERBOT_KEY);
homebot.setNick("homebot");
homebot.create(function(err, session){
});
```

When user sends unknown message such as "hello", you can toss it to cleverbot. The response from cleverbot can be returned to telegram.

```
snsbot.on("message", function(message) {
    console.log(message);

    var n;
    if ((n = message.text.search(/turn on/i)) > -1) {
        client.publish(HOME_DEVICE + "2/R", "on");
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
```

The below is an example chat with cleverbot in Telegram.

![Alt text](/document/image/cleverbot_talk.jpg?raw=true "Cleverbot Talk")

### Configuration

Configuration parameters are segregated into "config.json" that you should create your own. The below is one example.

```
{
	"TELEGRAM_TOKEN":"212664916:AAEsZR3-v853gyNHSiGMknxpLkEEJOjEzgO",
	"TELEGRAM_USER":"181234562",

	"MQTT_HOME":"sugar_home",
	"MQTT_DEVICE":"air_conditioner",

	"CLEVERBOT_USER":"Tdnfy2lWy6tdHGTP",
	"CLEVERBOT_KEY":"CtTTya3pVXE1RN7JAt4xQvHqHUT6UB5V"
}
```

For your unique sugar home and devices, HOME ID and DEVICE ID should be unique. They should be managed in Sugar Home server, later. 

### Runnng Home Bot using Telegram

Simple run "telegram.js" as below.

```
$ node telegram.js
```

And you can test how it works using your telegram client and MQTT client - [MQTT Dashboard](https://play.google.com/store/apps/details?id=com.thn.iotmqttdashboard) for your mobile as below.

![Alt text](/document/image/MQTT_Dashboard.jpg?raw=true "MQTT Dashboard")

The below is chat with air conditioner.

![Alt text](/document/image/telegram_talk.jpg?raw=true "Telegram Talk")
