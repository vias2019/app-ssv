var db = require("../models");

// Axios
var axios = require("axios");
axios.defaults.headers.common.Authorization = "Bearer: " + process.env.SABRE_TOKEN;

module.exports = function(app) {
  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Example.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  // app.delete("/api/examples/:id", function(req, res) {
  //   db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample
  //     {
  //       res.json(dbExample);
  //     });
  // });
};
