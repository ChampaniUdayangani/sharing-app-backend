var express = require('express');
var request = require('request-promise');
var router = express.Router();
require('dotenv').config();

// router.all("/*", (req: Request, res: Response, next: NextFunction) => {
   
// });

let pageID;
let pageAccessToken;

router.get("/pages", (req, res) => {
   
    var options = {
        uri: 'https://graph.facebook.com/v2.8/me/accounts',
        headers: {
            "Authorization": 'Bearer EAAJhl2elBEgBACoDRFZAay6ZClE0NZBRJYybIFUyEaNaXIAPETLZBaRCTFhYuvzLJfmjwyK9L1W2cF7CHw7IH6NM0WodrYiIReQnZCqP49eYiu0MNnR0apMHcpg5mlbkx4YbObuTYHu2IY7S5I37FLWDxoErdmA3s4rtZCzDzUfPy0mFRJRWVR',
            'User-Agent': 'Request-Promise'
        },
        json: true 
    };
     
    request(options)
        .then(function (data) {
            pageID = data.id;
            pageAccessToken = data.access_token;
            res.status(200).send(pageAccessToken);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
});


router.get("/posts", (req, res) => {
    let accessToken;
    let imageURl = 'https://picsum.photos/id/674/900/500';
    let message = 'Posted through web application!!!';

    const postUrl = "https://graph.facebook.com/me/photos?published=true&" +
        "access_token=" + pageAccessToken +
        "&url=" + imageURl +
        "&message=" + message;
    
    var options = {
        method: 'POST',
        uri: postUrl,
        json: true 
    };
     
    request(options)
        .then(function (data) {
           res.status(200).send(data);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
});




module.exports = router;
