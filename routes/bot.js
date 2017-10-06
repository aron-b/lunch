var express = require('express');
var request = require('request');
var router = express.Router();

var config = require('../config');

router.post('/bot/lunch', function(req, res, next) {
	var baseLng = '18.035192',
		baseLat = '59.346208',
		baseAddress = 'Gävlegatan 22, Stockholm' // Gävlegatan 22

	var query = 'https://api.foursquare.com/v2/';
		query += 'venues/explore?ll=' + baseLat + ',' + baseLng;
		query += '&limit=20&section=food&radius=1000';
		query += '&venuePhotos=1&openNow=1';
		query += '&client_id=' + config('FSQUARE_CLIENT_ID');
		query += '&client_secret=' + config('FSQUARE_CLIENT_SECRET');
		query += '&v=20170310';
	
	request.get(query, function (error, response, body) {
	  	if (!error && response.statusCode == 200) {
	    	var jsonResponse = JSON.parse(body);
	    	var response = jsonResponse.response;
	    	var items = response.groups[0].items;
	    	var randItem = items[Math.floor(Math.random()*items.length)];
	    	var venue = randItem.venue;
	    	var tips = randItem.tips;

	    	// console.log('Total: ', response.totalResults);

	    	// items.forEach(function(val, i){
	    	// 	console.log((i+1) + '.', val.venue.name);
	    	// });

	    	var directionsLink = "http://maps.google.com/?saddr=" + baseAddress + "&daddr=" + venue.location.address + ", " + venue.location.city + "&directionsmode=transit";

	    	var finalResponse = {
	    		"mrkdwn": true,
	    		"text": 'Here\'s a tip for you, hear what ' + tips[0].user.firstName + " says: _" + tips[0].text + "_",
	    		"attachments": [
			        {
			            "fallback": 'Try ' + venue.name + ' - ' + venue.location.address + ' - ' + venue.url,
			            "title": venue.name,
			            "title_link": venue.url,
			            "color": "#" + venue.ratingColor,
			            "image_url": venue.photos.groups[0].items[0].prefix + 'width400' + venue.photos.groups[0].items[0].suffix,
			            "fields": [
			                {
			                    "title": "Address",
			                    "value": "<" + directionsLink + "|" + venue.location.address + ">",
			                    "short": true
			                },
			                {
			                    "title": "Distance",
			                    "value": venue.location.distance + "m",
			                    "short": true
			                },
			                {
			                    "title": "Category",
			                    "value": venue.categories[0].shortName,
			                    "short": true
			                },
			                {
			                    "title": "Rating",
			                    "value": venue.rating,
			                    "short": true
			                }
			            ],
			        }
			    ]
	    	};


	    	// res.json(randItem.tips);
	    	res.json(finalResponse);
	  	}
	  	else {
	  		res.sendStatus(500);
	  	}
	})
});

module.exports = router;