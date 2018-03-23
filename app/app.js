//var util = require('util');
var restclient = require('restler');

var fxml_url = 'http://flightxml.flightaware.com/json/FlightXML2/';
var username = 'consultblu';
var apiKey = '01079df8f4dd13315af77a984d54dc03abc9f0eb';


var http = require("http");
var express = require("express");
var consolidate = require("consolidate"); //1
var _ = require("underscore");
var bodyParser = require('body-parser');
var fs = require('fs');

var routes = require('./routes'); //File that contains our endpoints
var mongoClient = require("mongodb").MongoClient;

var app = express();
app.use(bodyParser.urlencoded({
    extended: true,
}));

app.use(bodyParser.json({
    limit: '5mb'
}));

app.set('views', 'views'); //Set the folder-name from where you serve the html page. 
app.use(express.static('./public')); //setting the folder name (public) where all the static files like css, js, images etc are made available

app.set('view engine', 'html');
app.engine('html', consolidate.underscore); //Use underscore to parse templates when we do res.render

var server = http.Server(app);
var portNumber = 8000; //for locahost:8000

var io = require('socket.io')(server); //Creating a new socket.io instance by passing the HTTP server object

server.listen(portNumber, function() { //Runs the server on port 8000
    console.log('Server listening at port ' + portNumber);

    var url = 'mongodb://localhost:27017/myUberApp'; //Db name
    mongoClient.connect(url, function(err, db) { //a connection with the mongodb is established here.
        console.log("Connected to Database");

      app.get('/index.html', function(req, res) {
        res.render('index.html', {
                userId: req.query.userId
      	});
      });
			
			app.get('/citizen.html', function(req, res) { //a request to /citizen.html will render our citizen.html page
            //Substitute the variable userId in citizen.html with the userId value extracted from query params of the request.
            res.render('citizen.html', {
                userId: req.query.userId
            });
        });

        app.get('/cop.html', function(req, res) {
            res.render('cop.html', {
                userId: req.query.userId
            });
        });

        app.get('/data.html', function(req, res) {
            res.render('data.html');
        });
			
        app.get('/flights.html', function(req, res) {
					
					restclient.get(fxml_url + 'Enroute', {
							username: username,
							password: apiKey,
							query: {airport: 'FLL', howMany: 10, filter: '', offset: 0}
					}).on('success', function(result, response) {
							console.log('Aircraft en route to KIAH:');
							//console.log(util.inspect(result, true, null));

							var flights = result.EnrouteResult.enroute;		
							var json = JSON.stringify(flights);
						
							fs.appendFile('flights.json', json, function (err) {
								if (err) throw err;
								console.log('Saved!');
							});										
						/*
							for (i in flights) {
								var flight = flights[i];
								
					//console.log(util.inspect(flight));
								
								console.log(flight.ident + ' (' + flight.aircrafttype + ')\t' + 
										flight.originName + ' (' + flight.origin + ')');
								
							}*/
						res.render('flights.html',{ title: 'Flight Schedule', flightResults: json});						
					});	
					
          //res.render('flights.html',{ title: 'Flight Schedule'});	
        });			

        io.on('connection', function(socket) { //Listen on the 'connection' event for incoming sockets
            console.log('A user just connected');

            socket.on('join', function(data) { //Listen to any join event from connected users
                socket.join(data.userId); //User joins a unique room/channel that's named after the userId 
                console.log("User joined room: " + data.userId);
            });

            routes.initialize(app, db, socket, io); //Pass socket and io objects that we could use at different parts of our app
        });
    });
});

/* 1. Not all the template engines work uniformly with express, hence this library in js, (consolidate), is used to make the template engines work uniformly. Altough it doesn't have any 
modules of its own and any template engine to be used should be seprately installed!*/