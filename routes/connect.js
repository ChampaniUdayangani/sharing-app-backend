// Add imports
const cors = require('cors');
var express = require('express');
var request = require('request-promise');
const session = require('express-session');
var router = express.Router();
require('dotenv').config();
const User = require('../models/user');

// Define globally used variables
const clientID = process.env.BC_CLIENT_ID;
const clientSecret = process.env.BC_CLIENT_SECRET;
const scopes = "pages_read_engagement pages_manage_posts";
const callbackUrl = 'https://sharing-app-bc.herokuapp.com/callback'


const corsOptions = {
    origin: '*',

    methods: [
        'GET',
        'POST',
    ],

    allowedHeaders: [
        'Content-Type',
    ],
};

router.use(cors());

var sessionObj = {
    accessToken: '',
    pageID: '',
    pageAccessToken: '',
    secret: 'sheseescheese',
    cookie: {}
}

router.use(session(sessionObj));
// Default route
router.get("/", (req, res) => {
    res.send("Default Route");
});

// Default route
router.get("/connect", (req, res) => {
    res.send("Connect Route");
});


// Authorization route
router.get("/facebook", (req, res) => {

    const auth_url = "https://www.facebook.com/dialog/oauth?";
    const state = "strawberries";

    const connectUrl = auth_url + "response_type=code&" +
        "client_id=" + clientID +
        "&redirect_uri=" + callbackUrl +
        "&scope=" + scopes +
        "&state=" + state;

    res.send({ 'url': connectUrl });
});

// callback url on app installation
router.get("/callback", (req, res) => {
    
    
    const { code, state } = req.query;
    if (state !== 'strawberries') {
        return res.status(403).send("Request origin cannot be verified");
    }
    else {
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
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                uri: 'https://graph.facebook.com/oauth/access_token',
                body: accessTokenPayload,
                json: true
            };

            request(options)
                .then((data) => {
                    let accessToken = data.access_token;

                    var sessData = req.session;
                    sessData.accessToken = accessToken;


                    console.log("Access Token: ", req.session.access_token);
                    return res.status(200).send({ messge: "You've successfully connected your Facebook account." });

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
