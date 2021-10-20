const sql = require("./db.js");

// constructor
const Dataset = function(dataset) {
  this.microvolts = dataset.microvolts;
  this.trialstart = dataset.trialstart;
  this.oddball = dataset.oddball;
  this.flag = dataset.flag;
};

Dataset.create = ([dataset], result) => {
  sql.query("microvolts = ?, trialstart = ?, oddball = ?", 
  [dataset.microvolts, dataset.trialstart, dataset.oddball], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created datarow: ", { id: res.insertId, ...newData });
    result(null, { ID: res.insertId, ...newData });
  });
};

Dataset.findByFlag = (datasetFlag, result) => {
  sql.query(`SELECT * FROM data WHERE flag = ${datasetFlag}`, (err, res) => {
    if (err) {
      console.log("error:", err);
      result(err, null);
      return;
    }

    if(res.length) {
      console.log("found data set: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found"}, null);
  });
};

Dataset.findById = (datasetId, result) => {
  sql.query(`SELECT * FROM data WHERE id = ${datasetId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found datarow: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

Dataset.getAll = result => {
  sql.query("SELECT * FROM data", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("datarows: ", res);
    result(null, res);
  });
};

Dataset.getAllFlags = result => {
  sql.query("SELECT DISTINCT flag FROM data", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("datarows: ", res);
    result(null, res);
  });
};

Dataset.updateById = (id, dataset, result) => {
  sql.query(
    "UPDATE data SET microvolts = ?, trialstart = ?, oddball = ?, flag = ?, WHERE ID = ?",
    [dataset.microvolts, dataset.trialstart, dataset.oddball, dataset.flag, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated datarow: ", { id: id, ...dataset });
      result(null, { ID: ID, ...dataset });
    }
  );
};

Dataset.remove = (id, result) => {
  sql.query("DELETE FROM data WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted datarow with id: ", id);
    result(null, res);
  });
};

Dataset.removeAll = result => {
  sql.query("DELETE FROM data", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} datarows`);
    result(null, res);
  });
};

Dataset.removeAllFlags = (flagToRemove, result) => {
  sql.query("DELETE FROM data WHERE flag = ?", flagToRemove, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found"}, null);
      return;
    }

    console.log("deleted all rows with flag: ", flagToRemove)
    result(null, res);
  })
}

module.exports = Dataset;