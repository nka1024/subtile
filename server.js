var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

server.listen(process.env.PORT || 8081,function(){
    console.log('Listening on '+ server.address().port);
});

var matches = {}
var waiting = null;
io.on('connection', function(socket){
    console.log('client connected');

    socket.on('disconnect',function() {
        console.log("client disconnected: " + socket.match_id);
        if (waiting && waiting.match_id == socket.match_id) {
            waiting = null;
        }
        var match_id = socket.match_id;
        if(match_id in matches) { 
            var m = matches[match_id];
            var side = socket == m.player1;
            m.player1.emit('end_match', {side: side, match_id:match_id});
            m.player2.emit('end_match', {side: side, match_id:match_id});
            console.log("match " + m.id + " is ended");
            delete matches[match_id]
        }
    });

    socket.on('pping', function() {
        socket.emit('ppong');
    });

    socket.on('ball_update', function(data) {
        if(!(data.match_id in matches)) {
            io.emit("error_no_match");
            return;
        }
        var match = matches[data.match_id];

        [match.player1, match.player2].forEach(s => {
            console.log(s + " " + s.id + " " + socket.id);
            if(socket.id != s.id) {
                s.emit("ball_update", {
                    speed: {x: data.speed.x, y:data.speed.y}, 
                    pos: {x:data.pos.x,y:data.pos.y}
                });
            }    
        });
    });

    socket.on('ball_out', function(data) {
        if(!(data.match_id in matches)) {
            io.emit("error_no_match");
            return;
        }
        console.log("ball_out: " + JSON.stringify(data));
        var match = matches[data.match_id];
        match.player1.emit("end_match", data);
        match.player2.emit("end_match", data);
        delete matches[data.match_id];
    });

    socket.on('player_update', function(data) {
        if(!(data.match_id in matches)) {
            io.emit("error_no_match");
            return;
        }
        var match = matches[data.match_id];
        var opponent = data.player_side == 2 ? match.player1 : match.player2;
        opponent.emit("opponent_update", {pos: {y:data.y}, speed: data.speed})
    });

    socket.on('hello', function(data) {
        if (waiting == null) {
            console.log("player1 ready");
            waiting = socket;
            waiting.match_id = -Math.round(Math.random() * 1000000);
        } else {
            console.log("player2 ready");
            var match_id = Math.round(Math.random() * 1000000);
            var match = {player1: waiting, player2: socket, id: match_id};
            waiting = null;

            matches[match_id] = match;
            match.player1.emit("start_match", {player_side: 1, match_id: match_id});
            match.player2.emit("start_match", {player_side: 2, match_id: match_id});
            match.player1.match_id = match_id;
            match.player2.match_id = match_id;
            console.log('all matches: ' + JSON.stringify(Object.keys(matches)));
        }
    });

    socket.on('test', function(){
        io.emit("ball_update", {speed: {x: 1,y:1}, pos: {x:0,y:0}});
        socket.broadcast.emit("ball_update", {speed: {x: 1,y: 1}, pos: {x: 0,y: 0}});
    });
});
