
/*
 * This requires: restler
 * To install, type 'npm install restler'
 * Tested with node.js v0.6.14
 */

var util = require('util');
var restclient = require('restler');

var fxml_url = 'http://flightxml.flightaware.com/json/FlightXML2/';
var username = 'consultblu';
var apiKey = '01079df8f4dd13315af77a984d54dc03abc9f0eb';


restclient.get(fxml_url + 'MetarEx', {
    username: username,
    password: apiKey,
    query: {airport: 'FLL', howMany: 1}
}).on('success', function(result, response) {
    // console.log(util.inspect(result, true, null));
    var entry = result.MetarExResult.metar[0];
    console.log('The temperature at ' + entry.airport + ' is ' + entry.temp_air + 'C');
});

restclient.get(fxml_url + 'Enroute', {
    username: username,
    password: apiKey,
    query: {airport: 'FLL', howMany: 10, filter: '', offset: 0}
}).on('success', function(result, response) {
    console.log('Aircraft en route to KIAH:');
    //console.log(util.inspect(result, true, null));
	  console.log(result);
    var flights = result.EnrouteResult.enroute;
	/*
    for (i in flights) {
      var flight = flights[i];
      //console.log(util.inspect(flight));
      console.log(flight.ident + ' (' + flight.aircrafttype + ')\t' + 
          flight.originName + ' (' + flight.origin + ')');
    }*/
});