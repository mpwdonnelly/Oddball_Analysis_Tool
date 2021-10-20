const Dataset = require("../models/data.model.js");

// Create and Save a datarow
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    // Create a datarow
    const dataset = new Dataset({
      microvolts: req.body.microvolts,
      trialstart: req.body.trialstart,
      oddball: req.body.oddball,
      flag: req.body.flag
    });
  
    // Save datarow in the database
    Dataset.create(dataset, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the dataset."
        });
      else res.send(data);
    });
  };

// Retrieve all data from the database.
exports.findAll = (req, res) => {
    Dataset.getAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving datarows."
        });
      else res.send(data);
    });
  };


// Find a single data row with id
exports.findOne = (req, res) => {
  Dataset.findById(req.params.datasetId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No data row with id ${req.params.datasetId}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving data row with id " + req.params.datasetId
          });
        }
      } else res.send(data);
    });
  };

  // Find all values for specified flag
  exports.getAll = (req, res) => {
    Dataset.findByFlag(req.params.datasetFlag, (err,data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No data rows with flag ${req.params.datasetFlag}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving data rows with flag " + req.params.datasetFlag
          });
        }
      } else res.send(data);
    });
  };

// Update a datarow identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    Dataset.updateById(
      req.params.id,
      new Dataset(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Data row with id ${req.params.id} not found.`
            });
          } else {
            res.status(500).send({
              message: "Error updating datarow with id " + req.params.id
            });
          }
        } else res.send(data);
      }
    );
  };

// Delete a single datarow with the specified id in the request
exports.delete = (req, res) => {
  Dataset.remove(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Data row with id ${req.params.id} not found.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete data row with id " + req.params.id
          });
        }
      } else res.send({ message: `Datarow was deleted successfully!` });
    });
  };

// Delete all rows from the database.
exports.deleteAll = (req, res) => {
  Dataset.removeAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all data rows."
        });
      else res.send({ message: `All data rows were deleted successfully!` });
    });
  };

  // Delete all user-specified flag values from the database.
  exports.deleteAllFlags = (req, res) => {
    Dataset.removeAllFlags(req.params.flagToRemove, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Data row with flag ${req.params.flagToRemove} not found.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete data rows with flag " + req.params.flagToRemove
          });
        }
      } else res.send({ message: `Datarows were deleted successfully!` });
    });
  };

    // Find all flags in the database.
    exports.findAllFlags = (req, res) => {
      Dataset.getAllFlags((err,data) => {
        if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving datarows."
        });
      else res.send(data);
    });
  };
 

  


