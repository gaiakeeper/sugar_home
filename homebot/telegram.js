var config = require('./config.json');
HOME_DEVICE = '/' + config.HOME + '/' + config.DEVICE + '/';

var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://iot.eclipse.org');

client.on('connect', function(){
	client.subscribe(HOME_DEVICE + '2');
	client.subscribe(HOME_DEVICE + '3');
	client.subscribe(HOME_DEVICE + '4');
});

client.on('message', function(topic, message){
	console.log(topic);
	console.log(message.toString());

	switch(topic){
		case HOME_DEVICE + '2':
				bot.sendMessage({
					  chat_id: config.USER,
					  text: 'Your air conditioner was turned ' + message.toString() + '.',
				  }, function(err, msg){
				  	console.log(err);
				  	console.log(msg);
				  });
				break;
		case HOME_DEVICE + '3':
				bot.sendMessage({
					  chat_id: config.USER,
					  text: 'Current temperature is ' + message.toString() + ' degrees.',
				  }, function(err, msg){
				  	console.log(err);
				  	console.log(msg);
				  });
				break;
		case HOME_DEVICE + '4':
				bot.sendMessage({
					  chat_id: config.USER,
					  text: 'Preferred temperature was set to ' + message.toString() + ' degrees.',
				  }, function(err, msg){
				  	console.log(err);
				  	console.log(msg);
				  });
				break;
		default:

	}
});


var telegram = require('node-telegram-bot');
var bot = new telegram({
        token: config.TOKEN
});
bot.start();

bot.on( 'message', function(message){
		console.log(message);

		var n = message.text.search(/turn on/i);
		if (n>-1){
			client.publish(HOME_DEVICE + '2/R', 'on');
		}

		n = message.text.search(/turn off/i);
		if (n>-1){
			client.publish(HOME_DEVICE + '2/R', 'off');
		}

		n = message.text.search(/set preferred/i);
		if (n>-1){
			client.publish(HOME_DEVICE + '4/R', message.text.slice(n+14));
		}
});


