// ******************************************************************
// SSD Assignment 02   - Software Engineering 
// Udayangani Hamy W.C - IT 1602 3574 
// Ranawake P I        - IT 1609 7520
// 
// index.js
// The Entry point of the application
// ******************************************************************

var express = require('express');
const app = express();
app.set("port", process.env.PORT || 3000); // Set the PORT as 3000

// Routes for authorization & resource access
app.use(require('./routes/connect'));
app.use(require('./routes/facebookAPI'));

// Running the application on port 3000
app.listen(app.get("port"), () => {
  console.log("App listening on port " + app.get("port") + "!");
});
