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
            "Authorization": 'Bearer EAAJhl2elBEgBAJJ8To57gZA0KR7ZBwvYAXIuSvVB8TTHtLPHZC6JW0kc3T0FwZCgO51ZCk5CZC835AcoPesJLFg1ZC1xzphxyOYReswPDdhCu5ZCAFOWTeVdPQl27fXadz5JeDvvQDzG72nlQLRdbZBhZAHbHOwOx0MIyZBX9io5098xHVBUxFQjzoT',
            'User-Agent': 'Request-Promise'
        },
        json: true 
    };
     
    request(options)
        .then(function (data) {
            pageID = data.id;
            pageAccessToken = data.access_token;
            res.status(200).send(data);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
});


router.post("/posts", (req, res) => {
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
        headers: {
            "Authorization": 'Bearer EAAJhl2elBEgBAJJ8To57gZA0KR7ZBwvYAXIuSvVB8TTHtLPHZC6JW0kc3T0FwZCgO51ZCk5CZC835AcoPesJLFg1ZC1xzphxyOYReswPDdhCu5ZCAFOWTeVdPQl27fXadz5JeDvvQDzG72nlQLRdbZBhZAHbHOwOx0MIyZBX9io5098xHVBUxFQjzoT',
        },
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
