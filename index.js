var express = require('express');


const app = express();
app.set("port", process.env.PORT || 3000);

// Routes for authorization & resource access
app.use(require('./routes/connect'));
app.use(require('./routes/facebookAPI'));



app.listen(app.get("port"), () => {
  console.log("App listening on port " + app.get("port") + "!");
});
