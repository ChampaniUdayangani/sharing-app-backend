// Add imports

var express = require('express');
var request = require('request-promise');
var router = express.Router();
require('dotenv').config();
const User = require('../models/user');

// Define globally used variables
const clientID = process.env.BC_CLIENT_ID;
const clientSecret = process.env.BC_CLIENT_SECRET;
const scopes = "pages_read_engagement pages_manage_posts";
const callbackUrl = 'https://sharing-app-bc.herokuapp.com/callback'

// Default route
router.get("/", (req, res) => {
    res.send("Default Route");
});

// Authorization route
router.get("/connect", (req, res) => {

    const auth_url = "https://www.facebook.com/dialog/oauth?";

    const connectUrl = auth_url + "response_type=code&" +
        "client_id=" + clientID +
        "&redirect_uri=" + callbackUrl +
        "&scope=" + scopes;
    res.redirect(connectUrl);
});

// callback url on app installation
router.get("/callback", (req, res) => {

    const { code } = req.query;

    if (code) {

        const accessTokenPayload = {
            'grant_type': 'authorization_code',
            'redirect_uri': callbackUrl,
            'client_id': clientID,
            'client_secret': clientSecret,
            'code': code,
        };

        var options = {
            method: 'POST',
            uri: 'https://graph.facebook.com/oauth/access_token',
            body: accessTokenPayload,
            json: true
        };

        request(options)
            .then((data) => {
                accessToken = data.access_token;


                // Create an instance of User
                var new_user = new User({
                    access_token: accessToken
                });

                // Save the new model instance, passing a callback
                new_user.save(function (err) {
                    if (err) return handleError(err);
                    console.log('User is saved in DB');
                });
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(200).send({ messge : "You've successfully connected your Facebook account."});

            })
            .catch((err) => {
                res.status(400).send("Error occured: ", err);
            });

    } else {
        res.status(400).send("Required parameters missing");
    }
});



module.exports = router;
