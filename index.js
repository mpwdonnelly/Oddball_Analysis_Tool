/**
 * Required External Modules
 */

const express = require("express");
const { restart } = require("nodemon");
const path = require("path");


/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8000";


/**
 *  App Configuration
 */

 app.use(express.static(__dirname + '/baseInit'));
//  app.set("views", path.join(__dirname, "views"));
//  app.set("view engine", "pug");

/**
 * Routes Definitions
 */

 app.get("/", (req, res) => {
    res.render("index", { title: "TESTING BED" });
  });

/*
 * Server Activation
 */

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
})


