var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var basicAuth = require('basic-auth')

// var auth = function (req, res, next) {
  
//   function unauthorized(res) {
//     res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
//     return res.send(401);
//   };

//   var user = basicAuth(req);

//   if (!user || !user.name || !user.pass) {
//     return unauthorized(res);
//   };

//   if (user.name === 'milow' && user.pass === 'letsgo') {
//     return next();
//   } else {
//     return unauthorized(res)
//   };
// };


var port = process.env.PORT || 5000

// app.get('/', auth, function (req, res) {
//   app.use(express.static(__dirname + "/public"))
//   res.redirect('index.html')
// });
app.use(express.static(__dirname + "/public"))
var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)
var wss = new WebSocketServer({server: server})
console.log("websocket server created")


wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};


var userID 		= 0
var clients 	= {}
var webSockets 	= {} // deviceID: webSocket
var messageArray = [];
var startLogger = false;
stats = {
        "temps":[],
        "hum":[],
        "smoke":[]
      }

wss.on("connection", function(ws) {

	var deviceID = ws.upgradeReq.url.substr(1)
  	
  webSockets[deviceID] = ws
 	console.log('connected: ' + deviceID)

 	if (deviceID == 'milow') {
      messageArray = ['dashboard','connected']
  }else{
    messageArray = ['milow','connected']
  }
    

    var toUserWebSocket = webSockets[messageArray[0]]
    
    if (toUserWebSocket) {
      //console.log('sent to ' + messageArray[0] + ': ' + JSON.stringify(messageArray))
      messageArray[0] = deviceID
      toUserWebSocket.send(messageArray[1])
    }
 	

 	ws.send('connected to server via websocket');
   	// var id = setInterval(function() {
   	//   ws.send(JSON.stringify(new Date()), function() {  })
   	// }, 1000)
	//console.log(wss.clients)


	ws.on('message', function incoming(message) {
		console.log('received from ' + deviceID + ': ' + message)
		
		if (deviceID == 'milow') {
			messageArray = ['dashboard',message]
		}else{
			messageArray = ['milow',message]
		}
    
    if (message === 'start-log'){
      startLogger = true;
    }
    if (message === 'stop-log'){
      startLogger = false;
    }
    console.log(startLogger)
    var toUserWebSocket = webSockets[messageArray[0]]
    
    if (toUserWebSocket) {
      console.log('sent to ' + messageArray[0] + ': ' + JSON.stringify(messageArray))
      messageArray[0] = deviceID
      toUserWebSocket.send(messageArray[1], function(error){
        //console.log(error)
      })
    }

    if(startLogger === true && deviceID === 'milow'){
      console.log(parseFloat(message.split(" ")[0]))
      if (parseFloat(message.split(" ")[0]) > -30){
        stats.temps.push(parseFloat(message.split(" ")[0]))
        stats.hum.push(parseFloat(message.split(" ")[1]))
        stats.smoke.push(parseFloat(message.split(" ")[2]))
        console.log(stats.temps)
        if (stats.temps.length < 600) {
          toUserWebSocket.send(JSON.stringify(stats), function(error){
          })
        }else{
          startLogger = false;
          stats = {
            "temps":[],
            "hum":[],
            "smoke":[]
          }
        }
      }
    }

    //console.log('received: %s', message);
	
	//wss.broadcast(message)
	});


  ws.on("close", function() {
    console.log("websocket connection close")
    //clearInterval(id)
    console.log((new Date()) + ' Peer ' + deviceID + ' disconnected.');
    delete clients[deviceID]
    console.log(Object.keys(clients).length)
  })
})






/*
webSockets = {} // userID: webSocket

// CONNECT /:userID
// wscat -c ws://localhost:5000/1
webSocketServer.on('connection', function (webSocket) {
  var userID = parseInt(webSocket.upgradeReq.url.substr(1), 10)
  webSockets[userID] = webSocket
  console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(webSockets))

  // Forward Message
  //
  // Receive               Example
  // [toUserID, text]      [2, "Hello, World!"]
  //
  // Send                  Example
  // [fromUserID, text]    [1, "Hello, World!"]
  webSocket.on('message', function(message) {
    console.log('received from ' + userID + ': ' + message)
    var messageArray = JSON.parse(message)
    var toUserWebSocket = webSockets[messageArray[0]]
    if (toUserWebSocket) {
      console.log('sent to ' + messageArray[0] + ': ' + JSON.stringify(messageArray))
      messageArray[0] = userID
      toUserWebSocket.send(JSON.stringify(messageArray))
    }
  })

  webSocket.on('close', function () {
    delete webSockets[userID]
    console.log('deleted: ' + userID)
  })
})

------------------------------------------------------------

var express = require('express');
var app = express();

// Authenticator
app.use(express.basicAuth(function(user, pass) {
 return user === 'testUser' && pass === 'testPass';
}));

app.get('/home', function(req, res) {
 res.send('Hello World');
});

app.listen(process.env.PORT || 8080);

-
-------------------------------------------------------------

var basicAuth = require('basic-auth');

var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === 'foo' && user.pass === 'bar') {
    return next();
  } else {
    return unauthorized(res);
  };
};


*/