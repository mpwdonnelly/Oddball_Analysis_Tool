module.exports = app => {
    const datasets = require("../controllers/data.controller.js");
  
    // Create single entry [WORKING - NEED TO MODIFY]
    app.post("/datasets", datasets.create);
  
    // Retrieve all data [WORKING]
    app.get("/datasets", datasets.findAll);

    app.get("/datasets/:datasetFlag", datasets.getAll);
  
    // Retrieve a single row with datasetId [WORKING - NEED TO MODIFY]
    app.get("/datasets/:datasetId", datasets.findOne);

    //TODO:
    //    MODIFY CREATION FOR ARRAY JSON VS SINGLE JSON OBJECT

  
    // Update a single row with datasetId [WORKING - DON'T THINK WE'll NEED? ADDT'L FUNC]
    app.put("/datasets/:datasetId", datasets.update);
  
    // Delete a data row with datasetId [WORKING - DON'T THINK WE'll NEED? ADDT'L FUNC]
    //app.delete("/datasets/:datasetId", datasets.delete);

    app.get("/datasets/getAll/test", datasets.findAllFlags);

    app.delete("/datasets/:flagToRemove", datasets.deleteAllFlags);
  
    // NUKE IT ALL [WORKING]
    app.delete("/datasets", datasets.deleteAll);
  };

  