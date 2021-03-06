var PushBullet = require('pushbullet');
var events = require('events');
var util = require('util');
util.inherits(module.exports, require(require('path').join(GLOBAL.ROOTDIR, 'core', 'module.js')));

module.exports.prototype.init = function(){
	this.pusher = new PushBullet(this.settings.API_key);
	this.log.write("Instance started with API key: " + this.settings.API_key, "", 3);
	this.log.write("Approved Users: " + JSON.stringify(this.settings.approved_users), "", 3);
	this.log.write("Command Code: " + this.settings.push_command_code, "", 3);
	
	this.stream = this.pusher.stream();
	this.log.write("Stream created", "", 3);
	
	this.listenForConnect();
	this.listenForPush();
	
	this.stream.connect();
	this.running = true;
	this.log.write_time("Pushbullet is started", "", 3);

	//this.sendPush({type:'note', deviceName:'LGG3', title:'Test', body:'Test Body'});
}

module.exports.prototype.close = function(){
	this.running = false;
	console.log(this);
	this.stream.close();
}

module.exports.prototype.listenForPush = function(){
	this.stream.on('push', this.processPush.bind(this));
}
module.exports.prototype.deleteLastPush = function(title, body){
	this.pusher.history({limit: 1, modified_after: 1438170000.00000}, function(error, response) {
		if(response.pushes[0] != null && response.pushes[0].title == title && response.pushes[0].body == body)
			this.pusher.deletePush(response.pushes[0].iden, function(error, response) {});
	}.bind(this));
}

module.exports.prototype.listenForConnect = function(){
	var log = this.log;
	var thisEmitter = this;
	this.stream.on('connect', function(){
		log.write_time("Stream connected", "", 3);
	});
}

module.exports.prototype.processPush = function(push){
	this.log.write("New Push Detected", "", 3);
	this.log.write("Type:  " + push.type, "", 4);
	
	if(push.type == "clip"){
		var body = push.body.split(":");
		if(body[1] != null){
			var title = body[0];
			body = body[1].trim();
			
			if(title == this.settings.push_command_code){
				if(this.settings.approved_users.indexOf(push.source_user_iden) > -1){
					var args = parse_push_data(body);
					this.log.write_time("Push: " + JSON.stringify(args), "", 4);
					this.emit('command', args);
					this.deleteLastPush(title, body);
				}
				else
					this.log.write("Unapproved Sender", "", 2);
			}
			else
				this.log.write("Not a command", "", 4);
		}
	}
}

module.exports.prototype.getMyIden = function(){
	var iden = null;
	this.pusher.me(function(err, res){
		iden = res.iden;
	});
	return iden;
}

function parse_push_data(pushBody){
	var args = {};
	//var args = new Array();
	if(pushBody != null){
		pushBody.split("&").forEach(function(arg){
			var key = arg.split("=")[0];
			var value = arg.split("=")[1];
			args[key] = value;
		});
	}
	return args;
}

//Add commands here!

module.exports.prototype.sendPush = function(pushData){
	if(pushData.hasOwnProperty('deviceName') && pushData.hasOwnProperty('title') && pushData.hasOwnProperty('body')){
		this.log.write("Sending push to: " + pushData.deviceName + ' - \"' + pushData.title + ": " + pushData.body + '\"', '', 3);
		this.pusher.devices(function(err, res){
			res.devices.forEach(function(device){
				if(device.nickname == pushData.deviceName){
					this.pusher.note(device.iden, 
							pushData.title, 
							pushData.body, 
							function(er, res) {}
							);
				}
			}.bind(this));
		}.bind(this));
	}
}

/*if(dev.nickname == "LGE VS985 4G")
{
	console.log("Sending push!");
	pusher.note(dev.iden, "TITLE!", "MESSAGE!", function(err, res){
		console.log(err);
		console.log(res);
	});
}*/