//var db = require("../models");
// Axios
var axios = require("axios");
axios.defaults.headers.common.Authorization = process.env.SABRE_TOKEN;

module.exports = function(app) {
  // Load index page
  // app.get("/", function(req, res)
  // {
  //   res.sendFile("../public/index.html");
  // });

  // Get all themes from Sabre API

  app.get("/api/themes", function(req, res) {
    axios
      .get("https://api-crt.cert.havail.sabre.com" + "/v1/shop/themes")
      .then(function(result) {
        if (result) {
          res.send(result.data);
        } else {
          res.send("error");
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  });

  // Load example page and pass in an example by id
  // app.get("/example/:id", function(req, res) {
  //   db.Example.findOne({ where: { id: req.params.id } }).then(function(
  //     dbExample
  //   ) {
  //     res.render("example", {
  //       example: dbExample
  //     });
  //   });
  // });

  // Render 404 page for any unmatched routes
  // app.get("*", function(req, res) {
  //   res.render("404");
  // });
};
