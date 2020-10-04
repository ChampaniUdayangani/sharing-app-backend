// ******************************************************************
// SSD Assignment 02   - Software Engineering 
// Udayangani Hamy W.C - IT 1602 3574 
// Ranawake P I        - IT 1609 7520
// ******************************************************************

// Add imports
var cors = require('cors');
var express = require('express');
var request = require('request-promise');
var session = require('express-session');
var cookie = require('cookie');
var router = express.Router();
require('dotenv').config();

// Define globally used variables
const clientID = process.env.BC_CLIENT_ID;
const clientSecret = process.env.BC_CLIENT_SECRET;
const scopes = "pages_read_engagement pages_manage_posts";
const callbackUrl = 'https://sharing-app-bc.herokuapp.com/callback'
const stateValue = "strawberries";

router.use(cors());

// Define session object signed with the secret
var sessionObj = {
    accessToken: '',
    pageID: '',
    pageAccessToken: '',
    secret: 'sheseescheese',
    cookie: {
        maxAge: 3600000
    }
}

// Create the session
router.use(session(sessionObj));

// Default route
router.get("/", (req, res) => {
    res.send("Backend For Image Sharing App");
});

// Authorization route
router.get("/facebook", (req, res) => {
    // Facebook authorization endpoint
    const auth_url = "https://www.facebook.com/dialog/oauth?";

    // Construct connection url
    const connectUrl = auth_url + "response_type=code&" +"client_id=" + clientID +"&redirect_uri=" + callbackUrl +"&scope=" + scopes +"&state=" + stateValue;
    res.cookie('state', stateValue);
    res.send({ 'url': connectUrl });
});

// callback route
router.get("/callback", (req, res) => {
    const { code, state } = req.query;

    // Check for state changes
    if (state !== stateValue) {
        return res.status(403).send("Request origin can not be verified");
    }
    else {
        if (code) {
            // Costruct access token payload
            const accessTokenPayload = {
                'grant_type': 'authorization_code','redirect_uri': callbackUrl,'client_id': clientID,'client_secret': clientSecret,'code': code,
            };

            // POST request to get access token providing temporary code received
            var options = {
                method: 'POST',
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                uri: 'https://graph.facebook.com/oauth/access_token',
                body: accessTokenPayload,
                json: true
            };

            request(options)
                .then((data) => {
                    // Store access token only within the app
                    global.token = data.access_token;
                    return res.status(200).send({ messge: "You've successfully connected your Facebook account."});

                })
                .catch((err) => {
                    return res.status(400).send({ error: "Error occured" });
                });

        } else {
            return res.status(400).send({ error: "Required parameters missing" });
        }
    }
});

module.exports = router;


