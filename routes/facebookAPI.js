var express = require('express');
var request = require('request-promise');
var router = express.Router();
const User = require('../models/user');
require('dotenv').config();


let pageID;


let accessToken;

router.all("/*", function (req, res, next) {
    User.findOne({ name: "Champani Udayangani" }, 'name access_token', (err, result) => {
        if (result) {
            accessToken = result.access_token;
            next();
        }
        else {
            res.status(204).send("You haven't logged in before or your access token is expired.");
        }
    });
});

router.get("/pages", (req, res) => {
    let pageAccessToken;

    var options = {
        uri: 'https://graph.facebook.com/v2.8/me/accounts',
        headers: {
            "Authorization": 'Bearer ' + accessToken,
            'User-Agent': 'Request-Promise'
        },
        json: true
    };

    request(options)
        .then(function (data) {
            pageID = data.data[0].id;
            pageAccessToken = data.data[0].access_token;

            User.findOne({ name: "Champani Udayangani" }, "name access_token", (err, loggedinUser) => {
                // to use if a shop record is alredy there
                if (err) { return res.status(503).send("error with db connection. Plese try again in a while"); }
                if (loggedinUser) {
                    loggedinUser.page_id = pageID;
                    loggedinUser.page_access_token = pageAccessToken;
                    loggedinUser.save(() => {
                        if (err) { return res.status(503).send("error with db connection. Plese try again in a while"); }
                        else {
                            res.status(200).send("Successfully found your page");
                        }

                    });
                }
            });

        })
        .catch(function (err) {
            res.status(400).send(err);
        });
});


router.get("/posts", (req, res) => {
    let savedPageAccessToken;
    let imageURl = 'https://picsum.photos/id/674/900/500';
    let message = 'Posted through web application!!!';



    User.findOne({ name: "Champani Udayangani" }, "name access_token page_id page_access_token", (err, loggedinUser) => {
        // to use if a shop record is alredy there
        if (err) { return res.status(503).send("error with db connection. Plese try again in a while"); }
        if (loggedinUser) {
            const postUrl = "https://graph.facebook.com/me/photos?published=true&" +
                "access_token=" + loggedinUser.page_access_token +
                "&url=" + imageURl +
                "&message=" + message;

            var options = {
                method: 'POST',
                uri: postUrl,
                json: true
            };

            request(options)
                .then(function (data) {
                    res.status(200).send("Successfully shared with your friends");
                })
                .catch(function (err) {
                    res.status(400).send(err);
                });
            
        }
        else {
            res.status(503).send("Error retrieving your information");
        }
    });



});




module.exports = router;
