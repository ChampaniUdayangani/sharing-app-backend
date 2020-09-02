var express = require('express');
var bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.set("port", process.env.PORT || 3000);

// app.use(require('./routes/connect'));
app.use(require('./routes/facebookAPI'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-My-Custom-Header");
  next();
});


app.listen(app.get("port"), () => {
  console.log("App listening on port " + app.get("port") + "!");
});
