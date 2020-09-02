import { NextFunction, Request, Response, Router } from "express";
import request from "request-promise";
const router = Router();

// router.all("/*", (req: Request, res: Response, next: NextFunction) => {
   
// });

router.get("/pages", (req, res) => {
    let pageID;
    let pageAccessToken;
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
            console.log('pageID ', pageID);
        })
        .catch(function (err) {
            console.log('Request failed..')
        });
});



module.exports = router;
