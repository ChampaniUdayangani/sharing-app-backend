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

    // https://www.facebook.com/dialog/oauth?
    // response_type=code&
    // client_id=670252860245064&
    // redirect_uri=https%3A%2F%2Flocalhost%3A8000%2F&
    // scope=pages_read_engagement%20pages_manage_posts
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

    // console.log("code: ", code);
    // console.log("client ID: ", clientID);


    if (code) {
        // grant_type=authorization_code&
        // redirect_uri=https%3A%2F%2Flocalhost%3A8000%2F&
        // client_id=670252860245064&
        // code=AQAd-yUnhMXi83JbvX9ni052qSs8_2f_gVHWKtcocCougS-pqSIC8J4RhtQLUVD1ZwvFV7947qps3tf0SsvBIiNY5dpfNK4kYunXCVBhvQyeE8UzHQ8qnAhwUrjRLKYVi6kdlR-ksbOWyzoxEVtFSYc56SXoyG3r4o8COVe51AsvC83bkszrpk3InHa4N6zFomrISf_tFTyiCdqmYm7xnil11NylxHM2RoFI2qnYsV954nZNkj6jdgZX1xIQ5dgAsYIo2sgLxtMNmlL_TBmz0w0AtT3dL59L1rEh_m6JSLXAZ6zKlyowcbqcaTvmu7A8maw95BGFrXhIvAWwn-guVetHYv7i3D4dbeB9VU_AwNNBvdt6v2X6wL8CrQDCG8RDVv8#_=_

        const accessTokenPayload = {
            'grant_type': 'authorization_code',
            'redirect_uri': 'https://sharing-app-bc.herokuapp.com/callback/token',
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
                res.status(200).send(accessToken);

            })
            .catch((err) => {
                res.status(400).send(err);
                // console.log("Error occured while calling Access token endpoint");
            });

    } else {
        res.redirect("/verify");
        // res.status(400).send("Required parameters missing");
    }
});



router.get("/callback/token", (req, res) => {
    let accessToken = res;
    res.send("Access Token: ", accessToken);
  
})

module.exports = router;
