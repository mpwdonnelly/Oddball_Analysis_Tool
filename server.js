const express = require("express");
const bodyParser = require("body-parser");
const { restart } = require("nodemon");
const path = require("path");

const app = express();

// parse requests of content-type: application/json
app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))

// test route upon loading base dir
// app.get("/", (req, res) => {
//   res.json({ message: "TEST." });
// });

const port = process.env.PORT || "8000";

/**
 *  App Configuration
 */
 app.use(express.static(__dirname + '/baseInit'));

// link the routes
require("./app/routes/data.routes.js")(app);

// set port, listen for requests
app.listen(8000, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});