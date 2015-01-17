var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var usernames = [];

server.listen(3000);

app.get('/', function(req,res){
	res.sendFile(__dirname + "/index.html");
});

io.sockets.on('connection', function(socket){
	socket.on('new user',function(data, callback){
		if(usernames.indexOf(data) != -1) {
			callback(false);
		} else {
			callback(true);
			socket.username = data;
			usernames.push(socket.username);
			io.sockets.emit('usernames', usernames);
		}
	});

	socket.on('send message', function(data){
		var currentdate = new Date();
    	var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
        io.sockets.emit('new message',{message:data, username:socket.username, currentTime: datetime});
	});

	socket.on('disconnect',function(data){
		if(!socket.username)
			return;
		usernames.splice(usernames.indexOf(socket.username),1);
		io.sockets.emit('usernames',usernames);
	});

});