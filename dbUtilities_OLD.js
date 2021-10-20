//************************************************************************************/
//************APPEND THE RAW CSV WITH 'FLAG' HEADER AND 'FLAG' COLUMN VALUES**********/
//************************************************************************************/
function asyncAppendCSV(flagVar) {

    return new Promise((resolve, reject) => {
    const fs = require('fs');

    fs.readFile('mainData.csv', 'utf8', function (err, data) {
        var dataArray = data.split(/\r?\n/);
        dataArray[0] = dataArray[0] + ",flag";

        for (i = 1; i < dataArray.length; i++) {
            if (flagVar == undefined) {
                dataArray[i] = dataArray[i] + ",NULL"
            } else {
                dataArray[i] = dataArray[i] + "," + flagVar
            }
        }

        console.log("MODIFIED CSV ARRAY FROM appendCsv()")
        console.log(dataArray);

        const csv = dataArray.map((e) => {
            return e.replace(/;/g, ",");
        });

        fs.writeFile("mainData.csv", csv.join("\r\n"), (err) => {
            console.log(err || "CSV update done!");
            resolve();
        });
    });
});
}

//************************************************************************************/
//******************USE CSVAPPENDER TO APPEND THE DATA, PUSH TO DB********************/
//************************************************************************************/
async function rawDatabasePush(flagVar) {

    await asyncAppendCSV(flagVar);

    const fs = require("fs");
    const mysql = require("mysql");
    const fastcsv = require("fast-csv");
    const json2csv = require("json2csv");

    let stream = fs.createReadStream("mainData.csv");
    let csvData = [];
    let csvStream = fastcsv
      .parse()
      .on("data", function (data) {
        csvData.push(data);
      })
      .on("end", function () {
        //strip headers
        csvData.shift();
        console.log("csvData from rawDataBasePush()")
        console.log(csvData);
  
        //create conn
        const connection = mysql.createConnection({
          host: "localhost",
          user: "root",
          password: "mysql",
          database: "db"
        });
  
        //open conn
        connection.connect(error => {
          if (error) {
            console.error(error);
          } else {
            console.log("CONNECTED")
            let query =
              "INSERT INTO data(microvolts, trialstart, oddball, flag) VALUES ?";
            connection.query(query, [csvData], (error, response) => {
              console.log(error || response);
            });
          }
        });
      });
  
    //writestream
    stream.pipe(csvStream);
    //delete file afted db send
    deleteCsv("mainData.csv");   
}

//************************************************************************************/
//************RETRIEVE EVERYTHING IN THE DATABASE - EVEN NULL FLAG ENTRIES************/
//************************************************************************************/
function databaseGetAll(){
    const mysql = require("mysql");
    const fastcsv = require("fast-csv");
    const fs = require("fs");
    const ws = fs.createWriteStream("fullDataPull.csv");

    //create conn
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "mysql",
      database: "db"
    });
    
    //open conn
    connection.connect(error => {
      if (error) throw error;
    
      //data fetch
      connection.query("SELECT * FROM data", function(error, data, fields) {
        if (error) throw error;
    
        const jsonData = JSON.parse(JSON.stringify(data));
        console.log("jsonData", jsonData);
    
        //throw to CSV
        fastcsv
            .write(jsonData, { headers: true })
            .on("finish", function() {
                console.log("data successfully written to csv");
            })
            .pipe(ws);
      });
    });
}

//************************************************************************************/
//******************RETRIEVE A LIST OF CURRENT FLAGS IN THE DATABASE******************/
//************************************************************************************/
function databaseGetAllFlags(){
  const mysql = require("mysql");
  const fastcsv = require("fast-csv");
  const fs = require("fs");
  const ws = fs.createWriteStream("fullFlagList.csv");

  //create conn
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql",
    database: "db"
  });
  
  //open conn
  connection.connect(error => {
    if (error) throw error;
  
    //data fetch
    connection.query("SELECT flag FROM data", function(error, data, fields) {
      if (error) throw error;
  
      const jsonData = JSON.parse(JSON.stringify(data));
      console.log("jsonData", jsonData);
  
      //throw to CSV
      fastcsv
          .write(jsonData, { headers: true })
          .on("finish", function() {
              console.log("current flags in DB successfully written to csv");
          })
          .pipe(ws);
    });
  });
}

//************************************************************************************/
//**************************GET USER SPECIFIED FLAG DATASET***************************/
//************************************************************************************/
function databaseGetDefinedFlags(flags){
    const mysql = require("mysql");
    const fastcsv = require("fast-csv");
    const fs = require("fs");
    const ws = fs.createWriteStream("definedFlagList.csv");

    //create IN search string for SQL query - accounts for embedded quotes
    let flagsFinal = flags.map(function (a) { 
        return "'" + a.replace("'", "''") + "'"; 
    }).join(",");
    //console.log(flagsFinal);

    //create conn
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "mysql",
      database: "db"
    });
    
    //open conn
    connection.connect(error => {
      if (error) throw error;
    
      //data fetch
      connection.query("SELECT * FROM data WHERE FLAG IN (" + flagsFinal + ")", function(error, data, fields) {
        if (error) throw error;
    
        const jsonData = JSON.parse(JSON.stringify(data));
        console.log("jsonData", jsonData);
    
        //throw to CSV
        fastcsv
            .write(jsonData, { headers: true })
            .on("finish", function() {
                console.log("flags successfully written to CSV");
            })
            .pipe(ws);
      });
    });
}

//************************************************************************************/
//************************DELETE ENTRIES FROM DB BASED ON FLAG************************/
//************************************************************************************/
function databaseDeleteOnFlag(flags){
  const mysql = require("mysql");
  const fastcsv = require("fast-csv");
  const fs = require("fs");

  //create IN search string for SQL query - accounts for embedded quotes
  let flagsFinal = flags.map(function (a) { 
      return "'" + a.replace("'", "''") + "'"; 
  }).join(",");
  //console.log(flagsFinal);

  //create conn
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql",
    database: "db"
  });
  
  //open conn
  connection.connect(error => {
    if (error) throw error;
  
    //data fetch
    connection.query("DELETE FROM data WHERE FLAG IN (" + flagsFinal + ")", function(error, data, fields) {
      if (error) throw error;
      console.log("Rows based on " + flagsFinal + " deleted!");
    });
  });
}

//************************************************************************************/
//*****************************CREATE PARENT TABLE FOR DB*****************************/
//************************************************************************************/
function createParentTable(){
  const mysql = require("mysql");

  //create conn
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql",
    database: "db"
  });
  
  //open conn
  connection.connect(error => {
    if (error) throw error;
  
    //data fetch
    connection.query("CREATE TABLE IF NOT EXISTS `db`.`data` (`microvolts` DECIMAL(10 , 6 ) NULL,`trialstart` INT NULL,`oddball` INT NULL,`flag` VARCHAR(45) NULL,`ID` INT NOT NULL AUTO_INCREMENT,PRIMARY KEY (`ID`));", function(error) {
      if (error) throw error;
      console.log("Table created or already exists!");
    });
  });
}

//************************************************************************************/
//********************DELETE SPECIFIED CSV FROM THE ROOT DIRECTORY********************/
//************************************************************************************/
function deleteCsv(fileName) {
    const fs = require("fs");
    fs.unlink(fileName, function (err) {
        if (err) throw err;
        //if no error, file has been deleted
        console.log("File deleted!");
    })
}

//************************************************************************************/
//**********************************SLEEP FUNCTION************************************/
//************************************************************************************/
function sleep(milliseconds){
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}