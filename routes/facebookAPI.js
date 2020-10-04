// ******************************************************************
// SSD Assignment 02   - Software Engineering 
// Udayangani Hamy W.C - IT 1602 3574 
// Ranawake P I        - IT 1609 7520
// ******************************************************************

var express = require('express');
var request = require('request-promise');
var bodyParser = require('body-parser');
var router = express.Router();
var cookie = require('cookie');
var connection = require('./connect');

require('dotenv').config();

let pageAccessToken;
let pageName;

// parse application/json
var jsonParser = bodyParser.json()

// Pages route to get page details
// The creawted HTML heawder with the acquired access token global.token
// Will allow the user to get teh pages list 
router.get("/pages", (req, res) => {
    
    // Call /me/accounts endpoint to get user's page details
    var options = {
        uri: 'https://graph.facebook.com/v2.8/me/accounts', // Facebook resource server 
        headers: {
            "Authorization": 'Bearer ' + global.token,
            'User-Agent': 'Request-Promise',
            "Access-Control-Allow-Origin": "*"
        },
        json: true
    };

    request(options)
        .then(function (data) {
            // Save page token & name
            pageAccessToken = data.data[0].access_token;
            pageName = data.data[0].name;
            res.status(200).send({'message': 'Sucessfully retrieved page information'});

        })
        .catch(function (err) {
            res.status(400).send({'error': 'Error retrieving page details'});
        });
});

// 
// Posts route to create a post in page feed
router.post("/posts",jsonParser, (req, res) => {
    // console.log(req.body);
    let imageURl = req.body.url;
    let message = req.body.msg;

    // Check for valid page token
    if (pageAccessToken) {
        // Call /me/photos endpoint to create a post
        const postUrl = "https://graph.facebook.com/me/photos?published=true&" +
            "access_token=" + pageAccessToken +
            "&url=" + imageURl +
            "&message=" + message;

        var options = {
            method: 'POST',
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            uri: postUrl,
            json: true,
        };

        request(options)
            .then(function (data) {
                res.status(200).send({'message':'Successfully shared in your page '+ pageName});
            })
            .catch(function (err) {
                res.status(400).send({'message':'Parameters are invalid'});
            });
    }else{
        res.status(400).send({'error': 'Error retrieving your page details'});
    }

});
module.exports = router;


// 
//
//

