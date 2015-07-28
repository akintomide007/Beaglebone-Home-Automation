//TODO:
// * To Do List API
// * Search Song Itunes
// * Download Songs 
// * Alarm Clock 
// * Serve videos and pictures
// 
// * Pushbullet API send password & new IP & new SSID
// * Create Pin Controller
// * Auto Load Modules 
// * Both Servers emit event to a command processer which selects a module

var path = require('path');

var logger = require('./core/logger.js');
var module_loader = require('./core/module_loader.js');
var command_processor = require('./core/command_processor.js');

var module_name = path.basename(module.filename, path.extname(module.filename));
GLOBAL["settings"] = module_loader.load_json("./config/settings.config");
GLOBAL["settings"].root_dir = __dirname;

GLOBAL.core_log = logger.Log(path.join(GLOBAL["settings"].path.logs, "CORE.log"), "CORE_SERVER", 4);

var server_log = logger.Log(path.join(GLOBAL["settings"].path.logs, "SERVER.log"), "SERVER" , 4);
var commandProcessor_log = logger.Log(path.join(GLOBAL["settings"].path.logs, "COMMAND_PROCESSOR.log"),"COMMAND_PROCESSOR" , 4);

var commandProcessor = command_processor.CommandProcessor(commandProcessor_log);
commandProcessor.loadModules();
//commandProcessor.testCommand({command:'setPassword', password:'passwordX'});
commandProcessor.testCommand({command:'processVoice', voiceText:'send push to lgg3 saying I love programming'});
commandProcessor.testCommand({command:'processVoice', voiceText:'set my current location as loganville'});
commandProcessor.testCommand({command:'processVoice', voiceText:'set the post password as 123456'});
commandProcessor.testCommand({command:'processVoice', voiceText:'turn on led one'});
commandProcessor.testCommand({command:'processVoice', voiceText:'set red pin value to half power'});
//commandProcessor.testCommand({command:'sendPush', deviceName:'LGG3', title:'TITLE!', body:'password:j9unf87ahs783h87hfio21m'});
//commandProcessor.testCommand({command:'setPinValue', pinName:'led0', pinValue:0.6});
//commandProcessor.testCommand({command:'setPinValue', pinName:'ledRed', pinValue:0.6});
//commandProcessor.testCommand({command:'setLoc', lat:1231, long: 123123});