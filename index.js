const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.set("port", process.env.PORT || 3000);

app.use(require('./routes/connect'));
app.use(require('./routes/facebookAPI'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-My-Custom-Header");
  next();
});


//Set up mongoose connection
const mongoDB = process.env.BC_MONGODB_URI;
mongoose.connect(mongoDB, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

//Get the database connection
var db = mongoose.connection;

db.once('open', console.log.bind(console, 'Connected to MongoDB'));

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.listen(app.get("port"), () => {
  console.log("App listening on port " + app.get("port") + "!");
});
