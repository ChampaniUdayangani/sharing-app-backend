const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const cors = require('cors');

require('dotenv').config();

const app = express();
app.set("port", process.env.PORT || 3000);


app.use(require('./routes/connect'));
app.use(require('./routes/facebookAPI'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


app.listen(app.get("port"), () => {
  console.log("App listening on port " + app.get("port") + "!");
});
