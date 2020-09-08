var express = require('express');
var request = require('request-promise');
var router = express.Router();
const User = require('../models/user');
require('dotenv').config();



router.all("/*", function (req, res, next) {
    if (req.session.accessToken) {
        next();
    }
    else {
        return res.status(204).send("Session is expired. Please Login to your facebook again");
    }
});

router.get("/pages", (req, res) => {
    var options = {
        uri: 'https://graph.facebook.com/v2.8/me/accounts',
        headers: {
            "Authorization": 'Bearer ' + req.session.accessToken,
            'User-Agent': 'Request-Promise',
            "Access-Control-Allow-Origin": "*"
        },
        json: true
    };

    request(options)
        .then(function (data) {
            var sessData = req.session;
            sessData.pageID = data.data[0].id;
            sessData.pageAccessToken = data.data[0].access_token;
            res.status(200).send({'message': 'Successfully retrived page information'})

        })
        .catch(function (err) {
            return res.status(400).send(err);
        });
});


router.get("/posts", (req, res) => {
    let imageURl = 'https://picsum.photos/id/674/900/500';
    let message = 'Posted through web application!!!';

    if (req.session.pageAccessToken) {
        const postUrl = "https://graph.facebook.com/me/photos?published=true&" +
            "access_token=" + req.session.pageAccessToken +
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
                return res.status(200).send("Successfully shared with your friends");
            })
            .catch(function (err) {
                return res.status(400).send(err);
            });
    }else{
        return res.status(400).send('Error retrieving your page details');
    }

});

// Test route
router.get("/resource", (req, res) => {
    res.send(req.session.accessToken);
});





module.exports = router;
