// Add imports

var express = require('express');
var request = require('request-promise');
var router = express.Router();
require('dotenv').config();

// Define globally used variables
const clientID = '670252860245064';
const scopes = "pages_read_engagement pages_manage_posts";
const appUrl = 'https://sharing-app-bc.herokuapp.com/callback'

// Default route
router.get("/", (req, res) => {
    res.send("Default Route");
});

// Authorization route
router.get("/connect", (req, res) => {

    const auth_url = "https://www.facebook.com/dialog/oauth?";

    const connectUrl = auth_url + "response_type=code&" +
        "client_id=" + clientID +
        "&redirect_uri=" + appUrl +
        "&scope=" + scopes;
    res.redirect(connectUrl);
});

// callback url on app installation
router.get("/callback", (req, res) => {
    
    const { code } = req.query;

    if (code) {
        
        const accessTokenPayload = {
            'grant_type': 'authorization_code',
            'redirect_uri': 'https://sharing-app-bc.herokuapp.com/callback',
            'client_id': clientID,
            'client_secret': '3b1624f837401f79d3f5eaecb07a19b0',
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
                res.status(200).send(data);

            })
            .catch((err) => {
                res.status(400).send(err);
            });

    } else {
        res.status(400).send("Required parameters missing");
    }
});



module.exports = router;
